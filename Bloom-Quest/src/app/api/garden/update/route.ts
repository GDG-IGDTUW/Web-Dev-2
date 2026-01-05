import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { items } = await req.json(); // Array of placed items

    await dbConnect();
    const user = await User.findById(session.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // In a real app we'd validate that the user OWNS these items (check against inventory)
    // For MVP we just trust the client state, assuming the client checked inventory.
    // Ideally: Ensure every item in `items` exists in `user.inventory`.

    user.placedItems = items;
    await user.save();

    return NextResponse.json({ message: 'Garden updated', placedItems: user.placedItems });
}
