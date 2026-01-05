


// /api/generate-roadmap/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("Hello! This is the generate-roadmap route page.");

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing from environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function POST(req) {
  try {
    const { userId } = await req.json();
    console.log("Received request for userId:", userId);

    // Fetch user details from DB
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        level: true,
        experienceLevel: true,
        goals: true,
        learningStyle: true,
        timeCommitment: true,
      },
    });

    if (!user) {
      console.log("User not found");
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const prompt = `Create a detailed personalized learning roadmap for a user with the following details:
    - Name: ${user.username}
    - Level: ${user.level}
    - Experience Level: ${user.experienceLevel}
    - Goals: ${user.goals.join(", ")}
    - Learning Style: ${user.learningStyle}
    - Time Commitment: ${user.timeCommitment}.
    show a structured roadmap in the following format-
    Introduction: 1st line explaining how the roadmap is designed to help the user.
    Expected Outcome: 2nd line on what the user will achieve after following this roadmap.
    - Roadmap Steps (Structured Format)
    Each step should have:
    Step Title -  Clear, action-oriented (e.g., "Learn Python Basics")
    Description - What the user needs to do in this step.
    Time Estimate - Approximate duration (e.g., "1 Week")
    Resources & Tools - Links to tutorials, guides, or tools.
    (make it short and very precise) . Do not include any extra lines apart from this format. Do not include any text in bold`;

    console.log("Generating roadmap with prompt:", prompt);

    // Call Gemini API
    const chatSession = model.startChat({ generationConfig, history: [] });
    const result = await chatSession.sendMessage(prompt);
    const roadmapContent = result.response.text();

    if (!roadmapContent) {
      console.log("Failed to generate roadmap");
      return NextResponse.json({ message: "Failed to generate roadmap" }, { status: 500 });
    }

    console.log("Roadmap generated successfully.");

    // Save the roadmap to the database
    const newRoadmap = await db.roadmap.create({
      data: { userId, content: roadmapContent },
    });

    return NextResponse.json({ roadmap: newRoadmap }, { status: 201 });
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
