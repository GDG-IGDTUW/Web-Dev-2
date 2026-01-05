import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const user = await User.findById(session.userId);

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Calculate aggregates
    const totalHabits = user.dailyStats.reduce((acc: number, curr: any) => acc + curr.habitsCompleted, 0);
    const totalFocusMinutes = user.dailyStats.reduce((acc: number, curr: any) => acc + (curr.focusMinutes || 0), 0);

    // Sort and limit stats for chart (last 7 days)
    // Note: In a real app we'd fill in missing days with 0s
    const statsHistory = user.dailyStats
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-7);

    return NextResponse.json({
        xp: user.xp,
        streak: user.streak,
        totalHabits,
        totalFocusMinutes,
        history: statsHistory
    });
}
