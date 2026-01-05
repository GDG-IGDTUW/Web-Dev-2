

// /get-roadmap/route.js
import { NextResponse } from 'next/server';
import db from '@/lib/db'; // Import database connection

export async function POST(req) {
  try {
    console.log("entered backend")
    const { userEmail } = await req.json();
    console.log("Received request for userEmail:", userEmail);

    if (!userEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Fetch user by email
    const user = await db.user.findUnique({ 
      where: { email: userEmail },
      select: {
        id:true,
        username: true,
        level: true,
        experienceLevel: true,
        goals: true,
        learningStyle: true,
        timeCommitment: true,
      }, 
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch roadmap for the given user ID
    const roadmap_ = await db.roadmap.findFirst({ where: { userId: user.id } });

    if (!roadmap_) {
      return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 });
    }

    return NextResponse.json({ content: roadmap_.content }); // Send roadmap content
  } catch (error) {
    console.error("Detailed error:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json({ error: 'Database error!', message: error.message,
      stack: error.stack,
      name: error.name}, { status: 500 });
  }
}
