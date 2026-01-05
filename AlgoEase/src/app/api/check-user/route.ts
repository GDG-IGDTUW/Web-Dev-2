import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, username } = await req.json();

    const existingUser = await db.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email or username already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json({ message: "User is available." }, { status: 200 });
  } catch {
    // Avoid re-throwing/logging issues here; just return a generic error.
    return NextResponse.json(
      { message: "Something went wrong while checking user!" },
      { status: 500 }
    );
  }
}
