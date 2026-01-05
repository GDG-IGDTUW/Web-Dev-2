import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Habit from '@/models/Habit';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const habits = await Habit.find({ userId: session.userId });
    return NextResponse.json(habits);
}

export async function POST(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { title, difficulty } = await req.json();
        if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 });

        await dbConnect();

        // Limit habits for MVP
        const count = await Habit.countDocuments({ userId: session.userId });
        if (count >= 20) return NextResponse.json({ error: 'Max habits reached' }, { status: 400 });

        const habit = await Habit.create({
            userId: session.userId,
            title,
            difficulty: difficulty || 'medium',
        });

        return NextResponse.json(habit, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
