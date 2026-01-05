import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getSession } from '@/lib/auth';
import { SHOP_ITEMS } from '@/data/shopItems';

export async function POST(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { itemId } = await req.json();
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return NextResponse.json({ error: 'Invalid Item' }, { status: 400 });

    await dbConnect();
    const user = await User.findById(session.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (user.inventory.includes(itemId)) {
        return NextResponse.json({ error: 'Already owned' }, { status: 400 });
    }

    if (user.coins < item.price) {
        return NextResponse.json({ error: 'Not enough coins' }, { status: 400 });
    }

    user.coins -= item.price;
    user.inventory.push(itemId);
    await user.save();

    return NextResponse.json({ message: 'Purchased', newBalance: user.coins, inventory: user.inventory });
}
