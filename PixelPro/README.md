# 🎨 PixelPro - AI-Powered UI Component Generator

<div align="center">
  <img src="public/favicon.svg" alt="PixelPro Logo" width="120" height="120" />
  
  <p><strong>Transform text into beautiful UI components with AI</strong></p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
</div>

---

> **A beginner-friendly, open-source project for learning full-stack development**

PixelPro is an AI-powered UI component generator. Describe what you want, get production-ready code in HTML, Tailwind CSS, or React.

Open source, beginner-friendly, and built for learning full-stack development.

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🏗️ Project Architecture](#️-project-architecture)
- [🚀 Quick Start](#-quick-start)
- [📂 Project Structure](#-project-structure)
- [🔧 Technology Stack](#-technology-stack)
- [🎯 Current Status & Roadmap](#-current-status--roadmap)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)

---

## ✨ Features

- **AI-Powered Generation**: Google Gemini AI creates unique code for every prompt
- **Multi-Framework**: Generate HTML/CSS, Tailwind CSS, or React components
- **Copy to Clipboard**: One-click code copying
- **Responsive Design**: Works on all devices
- **Modern UI**: Built with shadcn/ui and Tailwind CSS
- **Open Source**: MIT licensed, contributions welcome

---

## 🏗️ Project Architecture

PixelPro follows a **decoupled full-stack architecture**:

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                           │
│  (React + Vite + TypeScript + Tailwind CSS)             │
│                                                          │
│  ┌──────────────┐      ┌──────────────┐                │
│  │ Landing Page │      │ Generator    │                │
│  │      "/"     │──────│   "/generate"│                │
│  └──────────────┘      └──────────────┘                │
│                              │                           │
│                              │ API Call                  │
│                              ▼                           │
└─────────────────────────────────────────────────────────┘
                               │
                               │ HTTP POST /api/generate
                               │
┌─────────────────────────────────────────────────────────┐
│                      BACKEND                            │
│         (Node.js + Express + Mock AI)                   │
│                                                          │
│  ┌────────────────────────────────────────────┐        │
│  │  POST /api/generate                         │        │
│  │                                              │        │
│  │  ┌──────────────┐      ┌──────────────┐   │        │
│  │  │  Validation  │──────│  Mock AI     │   │        │
│  │  │              │      │  Service     │   │        │
│  │  └──────────────┘      └──────────────┘   │        │
│  └────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────┘
```

### Why This Architecture?

1. **Separation of Concerns**: Frontend and backend are completely independent
2. **Easy Testing**: Each layer can be tested separately
3. **Scalability**: Add database, authentication, or new features without refactoring
4. **Learning-Friendly**: Clear boundaries help beginners understand full-stack flow
5. **API-First**: Backend exposes a clean REST API that could be used by other clients

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pixelpro.git
   cd pixelpro
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   cd server
   cp .env.example .env
   # IMPORTANT: Add your Gemini API key to .env (see below)
   cd ..
   ```

### Setup AI (Required for Real Code Generation)

**Without API key**: Returns hardcoded template responses  
**With API key**: Generates unique, AI-powered code for every prompt

**Quick setup:**
```bash
# Run the setup script
./setup-ai.sh
```

**Manual setup:**
1. Get FREE API key: https://makersuite.google.com/app/apikey
2. Edit `server/.env` and add: `GEMINI_API_KEY=your_key_here`
3. Restart backend server

### Running the Application

You need **two terminal windows**:

**Terminal 1 - Start the Backend**
```bash
cd server
npm run dev
```
Backend will run on: `http://localhost:3001`

**Terminal 2 - Start the Frontend**
```bash
npm run dev
```
Frontend will run on: `http://localhost:5173`

**Open your browser and navigate to**: `http://localhost:5173`

---

## 📂 Project Structure

```
pixelpro/
├── src/                          # Frontend source code
│   ├── pages/                    # Page components
│   │   ├── LandingPage.tsx      # Landing page "/"
│   │   ├── GeneratorPage.tsx    # Main generator "/generate"
│   │   └── NotFound.tsx          # 404 page
│   ├── components/               # Reusable UI components
│   │   ├── PromptInput.tsx      # Text input for descriptions
│   │   ├── FrameworkSelector.tsx # Dropdown for framework selection
│   │   ├── CodePreview.tsx      # Code display with copy button
│   │   ├── Loader.tsx           # Loading animation
│   │   └── ui/                  # shadcn/ui components
│   ├── services/                 # API and service functions
│   │   └── mockAI.ts            # Mock AI responses (Phase 1)
│   ├── App.tsx                  # Main app with routing
│   └── main.tsx                 # React entry point
│
├── server/                       # Backend source code
│   ├── index.js                 # Express server entry point
│   ├── services/                 # Business logic
│   │   └── aiService.js         # AI generation logic
│   ├── package.json             # Backend dependencies
│   ├── .env.example             # Environment variables template
│   └── .env                     # Environment variables (gitignored)
│
├── public/                       # Static assets
├── package.json                  # Frontend dependencies
├── vite.config.ts               # Vite configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

---

## 🔧 Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development Tools
- **ESLint** - Code linting
- **Nodemon** - Auto-restart for backend

---

## 🎯 Roadmap

- [ ] Component preview with live rendering
- [ ] History/saved components
- [ ] Syntax highlighting
- [ ] Export as files
- [ ] More frameworks (Vue, Svelte)
- [ ] Alternative AI providers (OpenAI, Claude)

---

## 🤝 Contributing

Contributions welcome! This is an open-source learning project.

1. Fork the repo
2. Create a feature branch: `git checkout -b feature-name`
3. Commit: `git commit -m "Add feature"`
4. Push: `git push origin feature-name`
5. Open a Pull Request

**Ideas:** Bug fixes, new frameworks, UI improvements, better prompts, tests, docs.

---

## 🔐 Environment Variables

### Backend Configuration

Create a `.env` file in the `server/` directory:

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Google Gemini AI API Key (Get it FREE at: https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key_here
```

### How to Get API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy and paste into your `.env` file

---

## 🧪 Testing

### Manual Testing Checklist

**Landing Page**
- [ ] Page loads without errors
- [ ] "Generate UI" button navigates to `/generate`
- [ ] Responsive on mobile/tablet/desktop

**Generator Page**
- [ ] Can enter text in prompt input
- [ ] Can select different frameworks
- [ ] Generate button works
- [ ] Loading state shows during generation
- [ ] Code appears in preview
- [ ] Copy button copies code to clipboard
- [ ] Back button returns to landing page

**Backend**
- [ ] Server starts on port 3001
- [ ] Health check endpoint works: `http://localhost:3001/api/health`
- [ ] Generate endpoint accepts POST requests
- [ ] Validation works for invalid inputs

---

## 📖 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "PixelPro backend is running",
  "timestamp": "2026-01-04T12:00:00.000Z"
}
```

#### Generate Component
```http
POST /api/generate
```

**Request Body:**
```json
{
  "prompt": "A modern login form with email and password",
  "framework": "react"
}
```

**Response:**
```json
{
  "success": true,
  "code": "import React from 'react'...",
  "framework": "react",
  "timestamp": "2026-01-04T12:00:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid framework. Must be 'html', 'tailwind', or 'react'"
}
```

---

## 🐛 Known Issues

- Mock AI responses are hardcoded (Phase 1 limitation)
- No component preview yet
- No syntax highlighting in code preview
- Limited framework options

Check [Issues](https://github.com/yourusername/pixelpro/issues) for full list.

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Inspired by the open-source community

---

## 💬 Questions or Feedback?

- **Issues**: [Open an issue](https://github.com/yourusername/pixelpro/issues)
- **Discussions**: [Join the discussion](https://github.com/yourusername/pixelpro/discussions)
- **Email**: your.email@example.com

---

**Made with ❤️ for the open-source community**
