import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Habit from '@/models/Habit';
import User from '@/models/User';
import Challenge from '@/models/Challenge';
import { checkWithering } from '@/lib/withering';

export async function GET(req: Request) {
    // In production, verify a secret key to prevent unauthorized access
    // const authHeader = req.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new NextResponse('Unauthorized', { status: 401 });
    // }

    await dbConnect();

    try {
        // 1. Reset all habits 'completedToday' to false
        await Habit.updateMany({}, { completedToday: false });

        // 2. Generate new daily challenge if not exists
        const today = new Date().toISOString().split('T')[0];
        const exists = await Challenge.findOne({ date: today });
        if (!exists) {
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
            await Challenge.create({
                date: today,
                description: desc,
                difficulty: 'medium',
                xp: 50
            });
        }

        // 3. Check for withering on all users
        const users = await User.find({});
        let witheredCount = 0;

        for (const user of users) {
            const { isWithered, newXp } = checkWithering(user.lastActiveDate, user.xp);
            
            // Update user if withering state changed
            if (isWithered !== user.isWithered || newXp !== user.xp) {
                user.isWithered = isWithered;
                user.xp = newXp;
                await user.save();
                if (isWithered) witheredCount++;
            }
        }

        return NextResponse.json({ 
            message: 'Daily reset complete',
            witheredPlants: witheredCount 
        });
    } catch (error) {
        console.error('Cron error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}