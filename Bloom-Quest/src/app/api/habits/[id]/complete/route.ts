import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Habit from '@/models/Habit';
import User from '@/models/User';
import { getSession } from '@/lib/auth';
import { calculateStreak } from '@/lib/streak';

const XP_MAP = {
    easy: 10,
    medium: 20,
    hard: 30,
};

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const habit = await Habit.findOne({ _id: id, userId: session.userId });
    if (!habit) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (habit.completedToday) {
        // Optionally allow untick, but for now just return
        return NextResponse.json({ message: 'Already completed' });
    }

    // Mark complete
    habit.completedToday = true;
    await habit.save();

    // Award XP
    const xpGain = XP_MAP[habit.difficulty as keyof typeof XP_MAP] || 10;
    const user = await User.findById(session.userId);
    if (user) {
        console.log(`[API Complete] User fetched. ID: ${user._id}, XP: ${user.xp}, Coins Before: ${user.coins} (type: ${typeof user.coins})`);

        user.xp += xpGain;

        // Update Streak
        const { streak, lastActiveDate } = calculateStreak(user.streak, user.lastActiveDate);
        user.streak = streak;
        user.lastActiveDate = lastActiveDate;

        // Daily Stats Update
        const today = new Date().toISOString().split('T')[0];
        // Initialize dailyStats if undefined (legacy users)
        if (!user.dailyStats) user.dailyStats = [];

        const statsIndex = user.dailyStats.findIndex((s: any) => s.date === today);

        if (statsIndex >= 0) {
            user.dailyStats[statsIndex].habitsCompleted += 1;
            user.dailyStats[statsIndex].xpGained += xpGain;
        } else {
            user.dailyStats.push({
                date: today,
                habitsCompleted: 1,
                xpGained: xpGain,
                focusMinutes: 0
            });
        }

        // Paranoid Casting
        const currentCoins = typeof user.coins === 'number' ? user.coins : 0;
        user.coins = currentCoins + 5;
        console.log(`[API Complete] Coins After Calc: ${user.coins}`);

        // Check for growth stage up?
        // Accelerated for visual feedback: 10xp (1 habit) -> Sprout, 50xp -> Bud, 100xp -> Bloom
        if (user.plantStage === 0 && user.xp >= 20) user.plantStage = 1;
        else if (user.plantStage === 1 && user.xp >= 60) user.plantStage = 2;
        else if (user.plantStage === 2 && user.xp >= 120) user.plantStage = 3;

        try {
            await user.save();
            console.log(`[API Complete] Saved Successfully. New Coins: ${user.coins} Streak: ${user.streak}`);
        } catch (err) {
            console.error('[API Complete] Save Error:', err);
            return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
        }
    }

    return NextResponse.json({
        message: 'Completed',
        habit,
        userXp: user?.xp,
        userStage: user?.plantStage,
        userStreak: user?.streak,
        userCoins: user?.coins
    });
}
