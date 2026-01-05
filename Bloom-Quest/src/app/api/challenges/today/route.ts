import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Challenge from '@/models/Challenge';
import { getSession } from '@/lib/auth';

// Simple challenge generator for demo
const CHALLENGES = [
    "Drink 8 glasses of water",
    "Take a 10 minute walk",
    "Read 5 pages of a book",
    "Meditate for 5 minutes",
    "Compliment someone today",
];

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    // Get today's date YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    let challenge = await Challenge.findOne({ date: today });

    if (!challenge) {
        // Generate one if missing (lazy generation)
        const desc = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
        challenge = await Challenge.create({
            date: today,
            description: desc,
            difficulty: 'medium',
            xp: 50
        });
    }

    return NextResponse.json(challenge);
}

// Completion would be tracked per user, but for MVP checking if user completed the global challenge needs a join or user field.
// Creating a user-challenge completion tracking is separate.
// For now, let's skip "completing" the challenge in backend strictly (adding to User specific table)
// and just assume if they click it, they get XP and we trust client/session for simple MVP?
// No, better to add `challengesCompleted` array to User model or a separate collection.
// Implementation Plan said "Challenge XP gives bonus boost".
// Let's keep it simple: We just give XP via a generic complete endpoint for challenges.
