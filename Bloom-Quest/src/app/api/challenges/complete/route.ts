import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    // In a real app we would check if user already completed this challenge (need a UserChallenge collection or array in User)
    // For MVP, we just trust the client call and award XP.

    const user = await User.findById(session.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
    const lastCompletedStr = user.lastChallengeCompleted
        ? new Date(user.lastChallengeCompleted).toLocaleDateString('en-CA')
        : null;

    if (lastCompletedStr === todayStr) {
        return NextResponse.json({ message: 'Challenge already completed today', userXp: user.xp, userCoins: user.coins });
    }

    // Force direct update - much safer for simple ops
    const updateResult = await User.updateOne(
        { _id: user._id },
        {
            $set: { lastChallengeCompleted: new Date() },
            $inc: { xp: 50, coins: 50 }
        }
    );

    // Fetch fresh user for response
    const updatedUser = await User.findById(user._id);

    return NextResponse.json({
        message: 'Challenge completed',
        userXp: updatedUser?.xp,
        userCoins: updatedUser?.coins
    });
}
