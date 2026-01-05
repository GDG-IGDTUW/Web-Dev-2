# 🤖 How to Activate Real AI Code Generation

## Current Status
✅ AI code is implemented and ready  
✅ Google Gemini package is installed  
❌ **API key is not configured** (running in mock mode)

## Quick Setup (5 minutes)

### Step 1: Get Your FREE API Key

1. Go to: **https://makersuite.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"** button
4. Copy the API key that appears

### Step 2: Add API Key to .env File

1. Open the file: `server/.env`
2. Find this line (currently commented):
   ```
   # GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. **Remove the `#`** and replace with your actual key:
   ```
   GEMINI_API_KEY=AIzaSyD-abcd1234yourActualKeyHere
   ```

### Step 3: Restart the Backend Server

1. Stop the server if it's running (Ctrl+C)
2. Restart it:
   ```bash
   cd server
   npm run dev
   ```

### Step 4: Test It!

1. Go to the generator page: http://localhost:5173/generate
2. Type a prompt like: "A modern pricing card with three tiers"
3. Click "Generate UI"
4. You should now see **unique, AI-generated code** instead of the same template!

## How to Tell If AI Is Working

### 🟢 AI Mode (Real AI)
- Console shows: `🤖 Generating react component with AI for: "..."`
- Each prompt generates **different** code
- More creative and varied responses

### 🟡 Mock Mode (Fallback)
- Console shows: `📦 Using mock response for react component`
- Always returns the **same template** code
- Good for testing without API key

## Troubleshooting

### "AI generation error" in console
- ❌ API key is invalid or expired
- ❌ API key has wrong format
- ✅ Get a new key from the link above

### Still getting mock responses
- ❌ API key line is still commented out (has `#`)
- ❌ Server wasn't restarted after adding key
- ❌ Extra spaces in the API key

### "Rate limit exceeded"
- You've used up your free quota for the day
- Wait 24 hours or upgrade your account
- Mock mode will automatically activate as fallback

## API Key Limits (Free Tier)

- **60 requests per minute**
- **Completely FREE** to use
- No credit card required
- Perfect for development and testing

## Need Help?

Check the detailed guide: `docs/AI_SETUP_GUIDE.md`
