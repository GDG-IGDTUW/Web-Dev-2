## AlgoEase

AlgoEase is an AI‑assisted platform for learning Data Structures & Algorithms (DSA).  
It combines personalized roadmaps, a dashboard, an AI code analyzer, and (future) visualizations to help you understand algorithms faster and deeper.

---

## Features

- **Onboarding & Signup Flow**
  - Multi‑step signup with username/email/password validation.
  - Preference collection: level, goals, learning style, experience, and time commitment.
  - Automatic roadmap generation and auto‑login on successful signup.

- **Authentication**
  - Email/password auth via **NextAuth.js** Credentials provider.
  - Sessions stored in PostgreSQL via Prisma.
  - Protected `dashboard` route via NextAuth middleware.

- **Personalized Learning Roadmap**
  - `/api/generate-roadmap` uses **Google Gemini** (`@google/generative-ai`) to generate a DSA learning roadmap.
  - Roadmap is persisted in the `Roadmap` table via Prisma.
  - `/dashboard` shows summary; `/learning-path` shows detailed steps and lets users track progress.

- **Dashboard**
  - Welcomes the authenticated user.
  - Links to:
    - Full roadmap (`/learning-path`)
    - Code Analyzer (`/code-analyzer`)
    - Future experiences (events, challenges, community, etc.).

- **AI Code Analyzer**
  - `/code-analyzer` lets users paste/upload code.
  - `/api/analyse-code` (Gemini) returns:
    - Natural language code explanation.
    - Time/space complexity with Big‑O.
    - Potential failing test cases.
    - An optimized version of the code.
  - `/api/generate-video` (D‑ID) endpoint scaffold for generating explainer videos from the analysis.

- **Algorithm Visualizer (Scaffold)**
  - `/analyser` and `/visualizer` currently route users into `/code-analyzer`.
  - Ready to be extended with rich visualizations and step‑by‑step animations.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript + modern React
- **Styling**: Tailwind CSS, custom UI components
- **Auth**: NextAuth.js (`/api/auth/[...nextauth]/route.js`)
- **Database ORM**: Prisma
- **Database**: PostgreSQL (local or hosted e.g. Supabase/Neon)
- **AI / LLMs**:
  - Google Gemini via `@google/generative-ai`
  - Optional D‑ID API for video generation

---

## Project Structure (Relevant Parts)

```text
src/
  app/
    page.tsx                 # Landing page
    login/page.js            # Login screen
    signup/page.js           # Multi-step signup + personalization + roadmap
    dashboard/page.js        # Authenticated dashboard
    learning-path/page.js    # Full roadmap display with progress
    code-analyzer/page.js    # AI code analyzer UI
    analyser/page.js         # Simple redirect/entry into analyzer
    visualizer/page.js       # Visualizer placeholder
    api/
      auth/
        [...nextauth]/route.js   # NextAuth configuration
        register/route.js        # Legacy/simple registration (not main flow)
      check-user/route.ts        # Checks if email/username already exists
      user/route.ts              # Creates user with DSA preferences
      generate-roadmap/route.js  # Generates + stores personalized roadmap
      get-roadmap/route.js       # Fetches stored roadmap by user email
      analyse-code/route.js      # Analyses code using Gemini
      generate-video/route.js    # D‑ID integration (server-style handler)
  lib/
    db.ts                    # Prisma client (db)
    prisma.ts                # Prisma singleton
    auth.js                  # (Legacy/experimental auth helpers)
prisma/
  schema.prisma              # User, Account, Session, Roadmap models
  migrations/                # Prisma migrations
```

---

## Getting Started (Local Development)

### 1. Prerequisites

- Node.js 18+ (recommended: 20+)
- npm or pnpm
- A PostgreSQL database (local, Supabase, Neon, etc.)
- Optional:
  - Google Cloud project with Gemini enabled
  - D‑ID API key (if you want generated videos)

### 2. Clone the repository

```bash
git clone https://github.com/<your-username>/AlgoEase.git
cd AlgoEase
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create **both** `.env` (for Prisma CLI) and `.env.local` (for Next.js runtime) at the project root.

#### `.env`

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require"
```

Use the Postgres connection string from your provider (Use Supabase).  
It **must** start with `postgresql://` or `postgres://`.

#### `.env.local`

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=""

# Google Gemini
GEMINI_API_KEY="your-gemini-api-key"

# Optional: OAuth providers (only needed if you enable them in NextAuth)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Optional: D-ID for video generation
DID_API_KEY="your-d-id-api-key"

JWT_SECRET="some-jwt-secret"
```

> Do **not** commit these files to git. `.env` / `.env.local` should stay local.

### 5. Set up the database with Prisma

1. Generate the Prisma client:

   ```bash
   npx prisma generate
   ```

2. Apply existing migrations to your fresh database:

   ```bash
   npx prisma migrate deploy
   ```

   This will create the `User`, `Account`, `Session`, and `Roadmap` tables defined in `schema.prisma`.

3. (Optional) Inspect your DB:

   ```bash
   npx prisma studio
   ```

### 6. Run the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Application Flows

### Signup → Roadmap → Dashboard → Learning Path

1. **Landing page** (`/`)
   - “Start Learning Now” button → `/signup`.
2. **Signup** (`/signup`)
   - Step 1: username/email/password.
     - Calls `/api/check-user` to ensure uniqueness.
   - Step 2: level, goals, learning style, experience, time commitment.
   - Final submit:
     - POST `/api/user` → creates user in DB with hashed password + preferences.
     - POST `/api/generate-roadmap` → generates roadmap with Gemini & stores it.
     - Automatically logs the user in via NextAuth credentials provider.
   - Step 3: Shows generated roadmap with “Start Learning” → `/dashboard`.
3. **Dashboard** (`/dashboard`)
   - Protected by NextAuth middleware (`src/middleware.js`).
   - “View Full Roadmap” button:
     - Calls `/api/get-roadmap` with `session.user.email`.
     - Stores roadmap in `sessionStorage`.
     - Navigates to `/learning-path`.
4. **Learning Path** (`/learning-path`)
   - Reads roadmap content from `sessionStorage`.
   - Displays structured steps and lets the user track completion per resource.

### Login Flow

- **Login page** (`/login`)
  - Uses `signIn("credentials", { email, password })` via NextAuth.
  - On success → redirects to `/dashboard`.
  - Provides a link to `/signup` for new users.

---

## Contributing

Contributions are very welcome! Here’s how to get started:

### 1. Fork & Clone

1. Fork the repo on GitHub.
2. Clone your fork:

   ```bash
   git clone https://github.com/<your-username>/AlgoEase.git
   cd AlgoEase
   npm install
   ```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes

- Keep changes focused and coherent (one feature/fix per PR is ideal).
- Follow existing patterns for:
  - API routes in `src/app/api/**`.
  - Database access through `db` from `src/lib/db.ts`.
  - UI components & styling using Tailwind.
- If you add a new model or field:
  - Update `prisma/schema.prisma`.
  - Run `npx prisma migrate dev --name your_migration_name`.

### 4. Lint & Typecheck (if you have TypeScript setup locally)

```bash
npm run lint
```

Fix any reported issues before opening a PR.

### 5. Open a Pull Request

When opening a PR, please include:

- A clear title (`feat:`, `fix:`, `chore:`, etc.).
- A short description of:
  - What you changed.
  - How to test it (paths, steps, relevant env vars).

---

## Ideas for Future Contributions

- **Algorithm Visualizer**
  - Implement real, interactive visualizations in `/visualizer` or integrated into `/code-analyzer`.
  - Animate complexity steps, data structure changes, etc.

- **More Auth Providers**
  - Add Google and GitHub providers in NextAuth config.
  - Improve OAuth onboarding into the personalization flow.

- **Progress Persistence**
  - Store roadmap progress (completed steps/resources) in the database instead of only in local state.

- **Better Error Handling & UI**
  - Surface backend errors in a more user‑friendly way (toasts, banners).

If you’re unsure where to start, feel free to open a GitHub issue with your idea and we can discuss it.

---
