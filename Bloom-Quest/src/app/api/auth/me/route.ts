import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        await dbConnect();
        const user = await User.findById(session.userId);

        if (!user) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        return NextResponse.json(
            {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    plantStage: user.plantStage,
                    xp: user.xp,
                    coins: user.coins,
                    inventory: user.inventory || [],
                    equippedItems: user.equippedItems || { pot: 'basic', decor: 'none', background: 'default' },
                    placedItems: user.placedItems || []
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Session check error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
