import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { minutes } = await req.json();
    if (!minutes || minutes <= 0) return NextResponse.json({ error: 'Invalid duration' }, { status: 400 });

    await dbConnect();
    const user = await User.findById(session.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Reward Logic: 1 Coin per minute
    const coinsEarned = Math.floor(minutes);
    const xpEarned = Math.floor(minutes / 2); // 0.5 XP per minute

    // Update Economy
    user.coins = (user.coins || 0) + coinsEarned;
    user.xp = (user.xp || 0) + xpEarned;

    // Update Daily Stats
    const today = new Date().toISOString().split('T')[0];
    if (!user.dailyStats) user.dailyStats = [];

    const statsIndex = user.dailyStats.findIndex((s: any) => s.date === today);
    if (statsIndex >= 0) {
        user.dailyStats[statsIndex].focusMinutes += minutes;
        user.dailyStats[statsIndex].xpGained += xpEarned;
    } else {
        user.dailyStats.push({
            date: today,
            habitsCompleted: 0,
            xpGained: xpEarned,
            focusMinutes: minutes
        });
    }

    await user.save();
    console.log(`[Focus Complete] User: ${user._id} | Time: ${minutes}m | Coins: +${coinsEarned} | Total: ${user.coins}`);

    return NextResponse.json({
        message: 'Session recorded',
        coinsEarned,
        xpEarned,
        newBalance: user.coins
    });
}
