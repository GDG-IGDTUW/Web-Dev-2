/**
 * PixelPro Backend Server
 * 
 * A simple Express.js server that handles UI component generation requests.
 * Currently uses mock AI responses - ready for future integration with Gemini/OpenAI.
 * 
 * TODO: Integrate Google Generative AI (Gemini) for real AI generation
 * TODO: Add rate limiting for production
 * TODO: Add request validation middleware
 */

import dotenv from "dotenv";

// Load environment variables FIRST before any other imports
dotenv.config();

import express from "express";
import cors from "cors";
import { generateComponentCode } from "./services/aiService.js";

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// Enable CORS for frontend communication
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:8081",
    process.env.FRONTEND_URL
  ].filter(Boolean),
  methods: ["GET", "POST"],
  credentials: true,
}));

// Parse JSON request bodies
app.use(express.json());

// Log all incoming requests (helpful for debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================
// API ROUTES
// ============================================

/**
 * Health check endpoint
 * Returns server status
 */
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "PixelPro backend is running",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Main generation endpoint
 * POST /api/generate
 * 
 * Request body:
 * {
 *   prompt: string,      // User's component description
 *   framework: string    // "html", "tailwind", or "react"
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   code: string,        // Generated component code
 *   framework: string,
 *   timestamp: string
 * }
 */
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, framework } = req.body;

    // Validate request body
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        success: false,
        error: "Missing or invalid 'prompt' in request body",
      });
    }

    if (!framework || !["html", "tailwind", "react"].includes(framework)) {
      return res.status(400).json({
        success: false,
        error: "Invalid 'framework'. Must be 'html', 'tailwind', or 'react'",
      });
    }

    // Log the generation request
    console.log(`Generating ${framework} component for prompt: "${prompt.substring(0, 50)}..."`);

    // Generate component code (currently uses mock AI)
    // TODO: Replace with actual AI API call
    const code = await generateComponentCode(prompt, framework);

    // Return successful response
    res.json({
      success: true,
      code,
      framework,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Generation error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate component. Please try again.",
    });
  }
});

// ============================================
// 404 HANDLER
// ============================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log("🚀 PixelPro Backend Server");
  console.log("=".repeat(50));
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`✨ API Endpoint: http://localhost:${PORT}/api/generate`);
  console.log("=".repeat(50));
});
