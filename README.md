# AI Mock Interview Platform

A full-stack, voice-first mock interview platform where candidates hold dynamic, back-and-forth conversations with an AI interviewer. Driving conversational transitions using stateful LangGraph logic and Google Gemini.

---

## Quick Start (5 Commands)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local   # then fill in keys

# 3. Run database migrations
npx prisma migrate dev

# 4. Start Redis (Docker)
docker run -d -p 6379:6379 redis:alpine

# 5. Start dev server
npm run dev
```

---

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **State**: Zustand (Client)
- **Database**: PostgreSQL (via Prisma ORM) + Redis (Session cache)
- **AI Brain**: LangGraph + Google Gemini (1.5 Flash & 1.5 Pro)
- **Voice SDK**: Vapi.ai WebRTC (with free native Web Speech API fallback)
