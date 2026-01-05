import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const user = await User.findById(session.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Reset Progress
    user.xp = 0;
    user.plantStage = 0;
    user.streak = 0;
    // We keep the habits and plant type for now, just resetting the "growth"

    await user.save();

    return NextResponse.json({ message: 'Progress reset', user });
}
