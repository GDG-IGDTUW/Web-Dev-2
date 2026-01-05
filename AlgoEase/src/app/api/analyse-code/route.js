
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

console.log("Hello! This is the analyze-code route page.");

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
    const code = await req.json();

    if(!code){
        return NextResponse("code not found!")
    }

    const prompt = `Analyze the given Data Structures and Algorithms (DSA) code:
    ${code}.
    return a JSON response with a very simple and beginner-friendly explanation for each component. 
    The JSON should have the following structure:
    {
  "code_explanation": "Very simple explanation of what the code does, avoiding technical jargon. Use real-life analogies if possible."},
  {"time_and_space_complexity": {
    "explanation": "Explain time and space complexity in the easiest way possible with relatable examples.",
    "big_o_notation": {
      "time_complexity": "O(n)",
      "space_complexity": "O(1)"
    }
  },
  "failing_test_cases": [
    {
      "input": "Provide an example input where the code may fail",
      "reason": "Explain why the failure occurs in simple terms"
    }
  ],
  "optimization_suggestions": {
    "improved_code": "Provide an optimized version of the given code.",
    "explanation": "Explain why the optimized version is better in a very simple way."
  }
}
`;

    // console.log("Generating roadmap with prompt:", prompt);

    // Call Gemini API
    const chatSession = model.startChat({ generationConfig, history: [] });
    const result = await chatSession.sendMessage(prompt);
    const analyseContent = result.response.text();

    if (!analyseContent) {
      console.log("Failed to analyse code!");
      return NextResponse.json({ message: "failed to analayse the code" }, { status: 500 });
    }

    console.log("code analysed successfully.");

    // Save the roadmap to the database
    return NextResponse.json(analyseContent, { status: 201 });

  } catch (error) {
    console.error("Error analysing code:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
