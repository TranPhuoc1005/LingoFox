# LingoFox - Premium English Learning Platform

A gamified and modern full-stack English learning platform featuring an interactive mascot (Kiko). Designed to guide learners from basic vocabulary up to IELTS/TOEIC preparation with immersive exercises, database synchronization, split-screen Notion-like note-taking, and active community features.

---

## Premium Dark-Mode-First Aesthetics

LingoFox is optimized exclusively with a high-contrast, premium dark theme. All light mode options have been retired, leaving a dark palette tailored for long night-study sessions with vibrant accent lighting, glassmorphism card panels, and smooth micro-animations powered by Framer Motion.

---

## Key Features & Modules

### Gamified Roadmap & Dashboard
*   **Visual Study Tree**: A Duolingo-style roadmap mapping courses from Zero to Advanced.
*   **Active Streak Tracking**: Keeps count of consecutive study days with automated streak multipliers.
*   **XP Progress & Badges**: Real-time XP rewards, level upgrades, and unlockable visual achievement badges.
*   **Analytics Panel**: Dynamic learning stats visualized via Recharts.

### Course Learning with Split-Screen Notepad
*   **Interactive Lesson steps**: Supports Vocabulary cards (with built-in audio pronunciation), Multiple-Choice Quizzes (MCQs), Listening Dictation, and IELTS Cue Card / Coaching Prompt steps (fully equipped with voice reading).
*   **Notion-Style Sticky Notepad**: Write markdown notes, save bookmarks, or automatically append word definitions to your personal notebook in real-time, saved directly to the database.

### Listening Studio (Accent Practice Lab)
*   **Accent Tuning**: Practice listening to diverse regional accents: US, UK, AUS, and IND.
*   **Typing Dictation Player**: Real-time dictation checker with smart punctuation removal and spelling accuracy feedback.
*   **Audio Synthesis**: Integrated Web Speech Synthesis configured to match the speaker's accent and reading speed.

### Communication Scenarios
*   **Branching Dialogues**: Interactive roleplaying for practical scenarios (Café conversation, Airport check-in, Job interviews, Hotel booking).
*   **Dialogue Shadowing**: Build oral confidence through prompt-matching and interactive conversations.

### Live Leaderboard & Leagues
*   **Tiered Leagues**: Auto-promotion system across Bronze, Gold, and Diamond Leagues based on weekly XP.
*   **Live Database Rankings**: Ranks are computed dynamically from active user profiles. Contains seeded bots like "Alex The Fox" to motivate new learners.

### AI Teacher (Kiko)
*   **Contextual Speaking Partner**: Live chat with your AI Teacher Kiko using Web Speech Recognition.
*   **Instant Grammar Coaching**: Get automated spelling corrections, sentence reconstructions, and alternative phrases.

### Forums & Voice Rooms
*   **Study Forums**: Create posts, leave comments, and like community tips.
*   **Voice Study Rooms**: Join themed Discord-style rooms (e.g., English Cafe, IELTS Sprint) for live peer-to-peer audio calls.

---

## Tech Stack

*   **Framework**: Next.js 16 (App Router)
*   **Language**: TypeScript
*   **Styling**: Vanilla Tailwind CSS v4
*   **Animations**: Framer Motion & Canvas Confetti
*   **State Management**: Zustand (Persisted Storage)
*   **Database**: PostgreSQL hosted on Supabase, connected using Prisma ORM
*   **Authentication**: Hybrid architecture supporting NextAuth.js and Supabase Auth (`@supabase/ssr`)
*   **AI Engine**: Web Speech API (TTS/STT) + OpenAI API integration ready
*   **Realtime**: Socket.io setup for voice/chat synchronization

---

## Installation & Environment Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/LingoFox.git
cd LingoFox
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
# Database Connection (Prisma)
# Session Pooler (Port 5432) for queries; Transaction Pooler (Port 6543) for migrations
DATABASE_URL="postgres://postgres.[YOUR_PROJECT_ID]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgres://postgres.[YOUR_PROJECT_ID]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# NextAuth Configurations
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Supabase Auth Integration
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR_PROJECT_ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-public-key"

# OpenAI API (For AI teacher chatbot)
OPENAI_API_KEY="your-openai-api-key"
```

### 4. Migrate and Seed Database
Run Prisma migrations to create the database tables, then run the seed script to populate realistic course material, listening tracks, and community records:
```bash
# Push schema to database
npx prisma db push

# Seed the database
npx prisma db seed
```

### 5. Launch local development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Supabase Authentication Configurations

To activate real User Registration and Login flows, follow these steps in your Supabase Console:
1.  Navigate to **Authentication** -> **URL Configuration**.
2.  Set the **Site URL** to `http://localhost:3000`.
3.  Add `http://localhost:3000/auth/callback` to the **Redirect URLs** list.
4.  Confirm email configurations (users will receive a validation link upon signup).

Once registered, the app's sync middleware (`/api/me`) automatically intercepts the auth callback to ensure profile metadata (avatars, XP, levels, and emails) is correctly synced into the Prisma PostgreSQL `User` table.

---

## Directory Structure

```
├── app/
│   ├── api/             # REST API Controllers (lessons, notes, listening, community, AI)
│   ├── auth/            # Sign In, Sign Up, Reset Password flows
│   ├── dashboard/       # Roadmap tree & user analytics
│   ├── lessons/         # Course player & split-screen note-taker
│   ├── listening/       # Dictation player & Accent selector
│   ├── communication/   # Dialogue roleplay scenarios
│   ├── exams/           # TOEIC/IELTS mock tests & performance analysis
│   ├── ai-teacher/      # Speech recognition AI chatbot
│   ├── community/       # Post forum & Voice rooms
│   └── layout.tsx       # Root App HTML & Providers wrapping
├── components/
│   ├── mascot/          # Kiko the Fox animated SVG component
│   ├── layout/          # Desktop Sidebar & Mobile navigation layout
│   ├── learning/        # Shared components like Notion NotePanel
│   └── ui/              # Global customized UI components (Card, Button, Progress, Dialog)
├── lib/
│   ├── prisma.ts        # Prisma DB client setup
│   ├── mappers.ts       # Database-to-UI JSON model mappers
│   └── api-client.ts    # Fetch wrapper with auto CSRF/JWT handling
├── store/
│   └── useAppStore.ts   # Zustand client state for offline fallback
├── prisma/
│   ├── schema.prisma    # Complete Relational Database Schema
│   └── seed.ts          # Advanced Seed script containing lessons, exams & listening tracks
└── tailwind.config.ts   # Custom theme specifications
```

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
# LingoFox
