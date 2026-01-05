import dbConnect from '@/lib/db';
import User from '@/models/User';
import Habit from '@/models/Habit';
import Challenge from '@/models/Challenge';
import { getSession } from '@/lib/auth';
import DashboardView from '@/components/dashboard/DashboardView';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const session = await getSession();
    if (!session) {
        redirect('/login');
    }

    await dbConnect();

    // Fetch data in parallel for performance
    const today = new Date().toISOString().split('T')[0];
    const [user, habits, challengeDocs] = await Promise.all([
        User.findById(session.userId),
        Habit.find({ userId: session.userId }),
        Challenge.findOne({ date: today })
    ]);

    if (!user) redirect('/login');

    console.log('Dashboard fetch - User:', session.email, 'Coins:', user.coins, 'ID:', session.userId);

    let challengeData = challengeDocs ? { description: challengeDocs.description, xp: challengeDocs.xp } : null;

    // Lazy Creation: If no challenge exists for today, create one on the fly.
    if (!challengeData) {
        const CHALLENGES = [
            "Drink 8 glasses of water",
            "Take a 10 minute walk",
            "Read 5 pages of a book",
            "Meditate for 5 minutes",
            "Compliment someone today",
            "Write down 3 things you are grateful for",
            "Stretch for 5 minutes",
            "Eat a piece of fruit",
            "No social media for 1 hour",
            "Go to bed 30 mins early"
        ];
        const desc = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
        try {
            const newChallenge = await Challenge.create({
                date: today,
                description: desc,
                difficulty: 'medium',
                xp: 50
            });
            challengeData = { description: newChallenge.description, xp: newChallenge.xp };
        } catch (e) {
            // fast fallback if race condition
            challengeData = { description: desc, xp: 50 };
        }
    }

    const plainUser = user.toObject() as any;
    plainUser._id = plainUser._id.toString();
    // Default values for missing fields to satisfy IUser
    if (!plainUser.inventory) plainUser.inventory = [];

    if (!plainUser.placedItems) {
        plainUser.placedItems = [];
    } else {
        plainUser.placedItems = plainUser.placedItems.map((item: any) => ({
            ...item,
            _id: item._id?.toString(),
            itemId: item.itemId?.toString(), // Ensure any refs are strings
            instanceId: item.instanceId?.toString()
        }));
    }

    if (!plainUser.dailyStats) {
        plainUser.dailyStats = [];
    } else {
        plainUser.dailyStats = plainUser.dailyStats.map((stat: any) => ({
            ...stat,
            _id: stat._id?.toString()
        }));
    }

    if (!plainUser.equippedItems) plainUser.equippedItems = { pot: 'basic', decor: 'none', background: 'default' };

    const sanitizedUser = plainUser as unknown as import('@/types').IUser;

    const sanitizedHabits = habits.map(h => ({
        _id: h._id.toString(),
        userId: h.userId.toString(),
        title: h.title,
        difficulty: h.difficulty,
        frequency: h.frequency || 'daily',
        completedToday: h.completedToday,
        createdAt: h.createdAt ? new Date(h.createdAt) : new Date(),
    }));

    // Check if user completed the challenge today (using local server time YYYY-MM-DD)
    const todayStr = new Date().toLocaleDateString('en-CA');
    const userLastCompletedStr = user.lastChallengeCompleted
        ? new Date(user.lastChallengeCompleted).toLocaleDateString('en-CA')
        : null;

    const isChallengeCompleted = userLastCompletedStr === todayStr;

    // Pass the actual challenge object (simplified)
    const sanitizedChallenge = challengeData ? {
        _id: challengeDocs?._id?.toString() || 'daily-quest',
        ...challengeData,
        date: today,
        difficulty: 'medium' as const, // Force literal type
    } : null;

    return (
        <div className="space-y-8">
            <DashboardView
                initialUser={sanitizedUser}
                initialHabits={sanitizedHabits}
                initialChallenge={sanitizedChallenge}
                isChallengeCompleted={isChallengeCompleted}
            />
        </div>
    );
}
