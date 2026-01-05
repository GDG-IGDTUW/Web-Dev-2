import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { plantType } = await req.json();
        if (!plantType) {
            return NextResponse.json({ error: 'Plant type is required' }, { status: 400 });
        }

        await dbConnect();
        const user = await User.findById(session.userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Only allow setting plant type if not already progressed significantly or if user wants to reset (logic dependent)
        // For v1, we assume this is initial setup.
        user.plantType = plantType;
        user.plantStage = 0; // Reset to seed
        await user.save();

        return NextResponse.json({ message: 'Plant selected successfully' }, { status: 200 });
    } catch (error) {
        console.error('Plant setup error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
