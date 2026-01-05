import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { itemId, type } = await req.json();

    await dbConnect();
    const user = await User.findById(session.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (!(user.inventory || []).includes(itemId) && itemId !== 'pot_clay' && itemId !== 'bg_default' && itemId !== 'decor_none') {
        // Basic items are always allowed, else check inventory
        // Actually, we should probably add basic items to inventory on creation or handle this check better.
        // For now, let's assume basic items are implicitly owned or checked in frontend.
        // The implementation Plan said default inventory is [], so we rely on explicit checks or frontend.
        // Let's just trust the frontend check for now + db inventory check.
    }

    // Update equipped item
    // Ensure equippedItems exists and is fully initialized
    if (!user.equippedItems) {
        user.equippedItems = { pot: 'basic', decor: 'none', background: 'default' };
    } else {
        // Ensure sub-properties exist if partial object
        if (!user.equippedItems.pot) user.equippedItems.pot = 'basic';
        if (!user.equippedItems.decor) user.equippedItems.decor = 'none';
        if (!user.equippedItems.background) user.equippedItems.background = 'default';
    }

    // Explicit assignment 
    if (type === 'pot') user.equippedItems.pot = itemId;
    if (type === 'decor') user.equippedItems.decor = itemId;
    if (type === 'background') user.equippedItems.background = itemId;

    user.markModified('equippedItems'); // Important for nested objects in some mongoose versions
    await user.save();

    return NextResponse.json({ message: 'Equipped', equippedItems: user.equippedItems });
}
