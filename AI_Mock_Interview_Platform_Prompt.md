# AI Mock Interview Platform — Master Build Prompt & File Structure

---

## MASTER PROMPT FOR AI ASSISTANT / CURSOR / CLAUDE CODE

```
You are a senior full-stack engineer building a production-grade AI-powered mock interview platform.
Read every instruction carefully. Do not skip sections. Do not simplify unless explicitly told to.

---

## PROJECT OVERVIEW

Build a full-stack voice-first mock interview platform where candidates hold a real, dynamic, back-and-forth 
voice conversation with an AI interviewer. This is NOT a quiz app, NOT a chatbot with preset answers, 
NOT a form. Every AI response must be generated from the complete conversation context so far.

The experience must feel like talking to a real human interviewer — dynamic, adaptive, occasionally 
surprising, and genuinely responsive to what the candidate actually said.

---

## TECH STACK — NON-NEGOTIABLE

Frontend:     Next.js 14 (App Router) + TypeScript + Tailwind CSS
Backend:      Next.js API Routes (Edge/Node runtime as appropriate)
Database:     PostgreSQL via Prisma ORM
Auth:         JWT (email + password only — no OAuth, no magic links)
Voice Layer:  Vapi.ai (managed real-time voice AI service — do NOT build or host your own models)
AI Brain:     Anthropic Claude (claude-3-5-sonnet) via LangGraph for conversation orchestration
State:        Zustand (client), Redis (session state, optional but recommended)
Styling:      Tailwind CSS + shadcn/ui components

---

## VOICE LAYER: VAPI.AI INTEGRATION

Use Vapi (vapi.ai) as the managed voice service. Vapi handles:
- Real-time speech-to-text (STT)
- Text-to-speech (TTS) with selectable voice personas
- WebRTC audio session management
- Webhooks for turn-by-turn transcript delivery

### Vapi Setup Pattern:
1. Create a Vapi assistant on session start via POST /assistant with a system prompt
2. Start a web call via the Vapi Web SDK (@vapi-ai/web)
3. Listen to Vapi's `message` events for transcript turns
4. On each user turn end, send the accumulated transcript to your LangGraph conversation engine
5. Inject the AI's response back as the assistant's next speech turn via Vapi's `say()` method
   OR configure Vapi's `serverUrl` webhook to call your /api/interview/respond endpoint

### Vapi Web SDK Integration (client-side):
```typescript
import Vapi from '@vapi-ai/web';

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);

// Start call
vapi.start({
  model: {
    provider: 'custom',          // We control the AI brain
    url: '/api/interview/respond' // Our LangGraph endpoint
  },
  voice: {
    provider: '11labs',
    voiceId: 'adam'             // Professional interviewer voice
  },
  firstMessage: '',             // We generate this dynamically
});

// Event listeners
vapi.on('speech-start', () => setStatus('interviewer-speaking'));
vapi.on('speech-end', () => setStatus('candidate-turn'));
vapi.on('transcript', (t) => appendTranscript(t));
vapi.on('call-end', () => triggerFeedbackGeneration());
```

---

## CONVERSATION ENGINE: LANGGRAPH

Model the interview as a stateful graph. Each node has a single responsibility.
Use @langchain/langgraph with Anthropic claude-3-5-sonnet as the LLM.

### Graph Nodes:

```
[START]
   │
   ▼
[session_init]        ← Sets up interview type, persona, difficulty, session state
   │
   ▼
[opening_statement]   ← AI introduces itself and the interview format
   │
   ▼
[question_generator]  ← Generates the next question based on interview type + history
   │
   ▼
[answer_evaluator]    ← Scores/classifies the candidate's last response
   │
   ├─ weak/vague ──► [followup_prober]    ← "Can you walk me through that more?"
   │
   ├─ strong ──────► [difficulty_escalator] ← Harder follow-up or next topic
   │
   └─ complete ────► [topic_transition]   ← Move to next interview area
                          │
                     [coverage_checker]   ← Have we hit enough topics? Time check?
                          │
                     ├─ no ──► [question_generator]  (loop)
                     │
                     └─ yes ─► [closing_statement]
                                    │
                               [feedback_generator]  ← Full session analysis
                                    │
                                  [END]
```

### Session State Schema (carried through all nodes):
```typescript
interface InterviewState {
  sessionId: string;
  candidateName: string;
  jobRole: string;
  experienceLevel: 'junior' | 'mid' | 'senior' | 'lead';
  interviewType: 'behavioral' | 'technical' | 'system_design' | 'hr_culture';
  interviewerPersona: InterviewerPersona;
  transcript: TranscriptTurn[];        // Full running conversation history
  currentTopic: string;
  topicsCovered: string[];
  currentQuestionIndex: number;
  difficultyLevel: number;             // 1-5, adjusts dynamically
  answerScores: AnswerScore[];
  startTime: Date;
  maxDurationMinutes: number;          // Default: 20
  phase: 'opening' | 'questioning' | 'closing' | 'complete';
  flags: {
    lastAnswerWeak: boolean;
    lastAnswerStrong: boolean;
    candidateStrugglingCount: number;
    followUpCount: number;             // How many follow-ups on current question
  };
}
```

### Node Implementation Pattern:
```typescript
// Example: answer_evaluator node
async function answerEvaluatorNode(state: InterviewState): Promise<Partial<InterviewState>> {
  const lastAnswer = state.transcript.at(-1);
  
  const evaluation = await claude.invoke([
    SystemMessage(`You are evaluating an interview answer.
    Interview type: ${state.interviewType}
    Job role: ${state.jobRole}
    Experience level: ${state.experienceLevel}
    Question asked: ${state.currentQuestion}
    
    Evaluate the answer on: completeness, specificity, relevance, structure (STAR if behavioral).
    Return JSON: { quality: 'weak'|'adequate'|'strong', reasoning: string, score: 1-10, flags: string[] }`),
    HumanMessage(`Candidate's answer: "${lastAnswer?.content}"`)
  ]);

  const result = JSON.parse(evaluation.content);
  
  return {
    flags: {
      ...state.flags,
      lastAnswerWeak: result.quality === 'weak',
      lastAnswerStrong: result.quality === 'strong',
    },
    answerScores: [...state.answerScores, result],
    difficultyLevel: result.quality === 'strong' 
      ? Math.min(5, state.difficultyLevel + 1)
      : state.difficultyLevel
  };
}
```

---

## INTERVIEWER PERSONAS (one per interview type)

Each persona has a name, voice style, and question strategy:

```typescript
const INTERVIEWER_PERSONAS = {
  behavioral: {
    name: 'Sarah',
    style: 'warm but structured, STAR-focused, probes for specifics',
    openingScript: `Hi {name}, I'm Sarah. Today we're doing a behavioral interview for the {role} role. 
                    I'll ask you about real situations from your past experience. Ready to begin?`,
    probePatterns: [
      "Can you give me a specific example of that?",
      "What was your exact role in that situation?",
      "What would you have done differently?",
      "Walk me through the outcome — what happened?"
    ]
  },
  technical: {
    name: 'Marcus',
    style: 'direct, precise, tests edge cases, asks for complexity analysis',
    openingScript: `Hey {name}, I'm Marcus. This is a technical interview for {role}. 
                    I'll ask you to solve problems and explain your thinking out loud. Let's start.`,
    probePatterns: [
      "What's the time complexity of that approach?",
      "How would this scale to a million users?",
      "What edge cases are you not handling?",
      "Is there a more efficient solution?"
    ]
  },
  system_design: {
    name: 'Priya',
    style: 'high-level thinker, pushes on tradeoffs, scalability, and failure modes',
    openingScript: `Hi {name}, I'm Priya. We'll do a system design session today for {role}. 
                    I want to hear how you think through large-scale problems. Ready?`,
    probePatterns: [
      "How does this handle 10x the load?",
      "What are the failure points in this design?",
      "Walk me through your database schema choices.",
      "What would you do differently if you had 6 months to build this?"
    ]
  },
  hr_culture: {
    name: 'James',
    style: 'conversational, values-focused, situational, asks about motivations',
    openingScript: `Hi {name}, I'm James from the people team. This is more of a culture conversation — 
                    I want to understand who you are and what drives you. No right answers here.`,
    probePatterns: [
      "Why does that matter to you personally?",
      "Tell me more about that value — how does it show up in your work?",
      "Have you ever been in conflict with a team over that?",
      "What would your last manager say about your work style?"
    ]
  }
};
```

---

## API ROUTES

### POST /api/auth/register
```typescript
Body: { name, email, password, jobRole, experienceLevel }
- Hash password with bcrypt (salt rounds: 12)
- Store in users table
- Return: { token: JWT, user: { id, name, email } }
```

### POST /api/auth/login
```typescript
Body: { email, password }
- Verify credentials
- Return: { token: JWT, user: { id, name, email } }
```

### POST /api/interview/session/start
```typescript
// Auth required
Body: { interviewType, customJobRole? }
- Creates a new session record in DB
- Initialises LangGraph state
- Triggers session_init + opening_statement nodes
- Returns: { sessionId, openingMessage, vapiCallConfig }
```

### POST /api/interview/respond
```typescript
// Called by Vapi webhook on each user speech turn
Body: { sessionId, transcript: TranscriptTurn[] }
- Loads session state from Redis
- Runs appropriate LangGraph node chain (evaluator → router → next node)
- Saves updated state to Redis
- Returns: { responseText: string }  ← Vapi speaks this
```

### POST /api/interview/session/end
```typescript
// Auth required
Body: { sessionId }
- Marks session as complete
- Triggers feedback_generator node
- Saves feedback report to DB
- Returns: { feedbackReport }
```

### GET /api/interview/sessions
```typescript
// Auth required
- Returns all past sessions with metadata for dashboard
```

### GET /api/interview/sessions/:id/report
```typescript
// Auth required
- Returns full feedback report for a session
```

---

## DATABASE SCHEMA (Prisma)

```prisma
model User {
  id              String    @id @default(cuid())
  name            String
  email           String    @unique
  passwordHash    String
  jobRole         String
  experienceLevel String
  createdAt       DateTime  @default(now())
  sessions        Session[]
}

model Session {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  interviewType   String
  jobRole         String
  status          String    @default("active")  // active | completed | abandoned
  startedAt       DateTime  @default(now())
  endedAt         DateTime?
  durationSeconds Int?
  transcript      Json      // Full TranscriptTurn[]
  graphState      Json      // Final LangGraph state snapshot
  feedbackReport  FeedbackReport?
  
  @@index([userId])
}

model FeedbackReport {
  id                String   @id @default(cuid())
  sessionId         String   @unique
  session           Session  @relation(fields: [sessionId], references: [id])
  overallScore      Float
  communicationScore Float
  technicalScore    Float?
  structureScore    Float
  confidenceScore   Float
  strengths         String[]
  improvements      String[]
  detailedFeedback  Json     // Per-question breakdown
  hiringRecommendation String  // "strong yes" | "yes" | "maybe" | "no"
  generatedAt       DateTime @default(now())
}
```

---

## FEEDBACK REPORT GENERATION

The feedback_generator node creates a structured report from the full session:

```typescript
const FEEDBACK_PROMPT = `
You are an expert interviewer and talent assessor. 
You have just completed a ${interviewType} interview with ${candidateName} for a ${jobRole} position.

Here is the complete interview transcript:
${formattedTranscript}

Here are the per-answer evaluations:
${JSON.stringify(answerScores, null, 2)}

Generate a comprehensive feedback report. Return valid JSON matching this schema:
{
  "overallScore": 0-100,
  "communicationScore": 0-100,
  "technicalScore": 0-100 | null,
  "structureScore": 0-100,
  "confidenceScore": 0-100,
  "strengths": ["string", ...],          // 3-5 specific strengths with examples
  "improvements": ["string", ...],       // 3-5 specific areas with actionable advice
  "detailedFeedback": [
    {
      "question": "string",
      "answer": "string",
      "feedback": "string",
      "score": 0-10
    }
  ],
  "hiringRecommendation": "strong yes" | "yes" | "maybe" | "no",
  "recommendationReason": "string"
}

Be specific. Reference actual things the candidate said. Do not be generic.
`;
```

---

## FRONTEND PAGES & COMPONENTS

### Pages:
```
/                          → Landing page (hero + CTA)
/auth/register             → Sign up form
/auth/login                → Login form
/dashboard                 → Past sessions list + stats
/interview/setup           → Choose interview type + confirm profile
/interview/session         → Live voice session UI (THE CORE PAGE)
/interview/report/[id]     → Detailed feedback report
```

### /interview/session Page Requirements:
- Full-screen, minimal UI — this is a voice experience, not a chat
- Central animated orb/waveform showing who is speaking (AI vs candidate)
- Subtle real-time transcript sidebar (collapsible) showing what's being said
- Session timer (top right)
- Single "End Interview" button (with confirmation dialog)
- Status states: "Interviewer speaking", "Your turn", "Processing...", "Connecting..."
- NO text input box. Voice only.

### Component Architecture:
```
components/
  interview/
    VoiceOrb.tsx            ← Animated speaking indicator
    TranscriptSidebar.tsx   ← Live transcript display
    SessionTimer.tsx        ← HH:MM timer
    StatusBanner.tsx        ← Current state label
    EndSessionDialog.tsx    ← Confirmation modal
  dashboard/
    SessionCard.tsx         ← Past session summary card
    ScoreRing.tsx           ← Circular score display
  report/
    ScoreOverview.tsx       ← Radar chart of all scores
    QuestionBreakdown.tsx   ← Per-question accordion
    StrengthsImprovements.tsx
  ui/
    (shadcn components)
  layout/
    Navbar.tsx
    AuthGuard.tsx
```

---

## ENVIRONMENT VARIABLES

```env
# Database
DATABASE_URL=postgresql://...

# Auth
JWT_SECRET=your-256-bit-secret
JWT_EXPIRES_IN=7d

# Vapi
NEXT_PUBLIC_VAPI_PUBLIC_KEY=
VAPI_PRIVATE_KEY=

# Anthropic
ANTHROPIC_API_KEY=

# Redis (for session state)
REDIS_URL=redis://localhost:6379

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## COMPLETE FILE STRUCTURE

```
ai-interview-platform/
├── README.md
├── .env.local
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│       └── 001_init/
│           └── migration.sql
│
├── src/
│   ├── app/                              ← Next.js App Router
│   │   ├── layout.tsx                    ← Root layout (fonts, providers)
│   │   ├── page.tsx                      ← Landing page
│   │   ├── globals.css
│   │   │
│   │   ├── auth/
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   │
│   │   ├── interview/
│   │   │   ├── setup/
│   │   │   │   └── page.tsx
│   │   │   ├── session/
│   │   │   │   └── page.tsx              ← Core voice session page
│   │   │   └── report/
│   │   │       └── [id]/
│   │   │           └── page.tsx
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── register/
│   │       │   │   └── route.ts
│   │       │   └── login/
│   │       │       └── route.ts
│   │       │
│   │       └── interview/
│   │           ├── session/
│   │           │   ├── start/
│   │           │   │   └── route.ts      ← POST: init session + LangGraph
│   │           │   └── end/
│   │           │       └── route.ts      ← POST: end + trigger feedback
│   │           ├── respond/
│   │           │   └── route.ts          ← POST: Vapi webhook handler
│   │           ├── sessions/
│   │           │   └── route.ts          ← GET: list user's sessions
│   │           └── sessions/
│   │               └── [id]/
│   │                   └── report/
│   │                       └── route.ts  ← GET: fetch report
│   │
│   ├── components/
│   │   ├── interview/
│   │   │   ├── VoiceOrb.tsx
│   │   │   ├── TranscriptSidebar.tsx
│   │   │   ├── SessionTimer.tsx
│   │   │   ├── StatusBanner.tsx
│   │   │   └── EndSessionDialog.tsx
│   │   ├── dashboard/
│   │   │   ├── SessionCard.tsx
│   │   │   └── ScoreRing.tsx
│   │   ├── report/
│   │   │   ├── ScoreOverview.tsx
│   │   │   ├── QuestionBreakdown.tsx
│   │   │   └── StrengthsImprovements.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── AuthGuard.tsx
│   │   └── ui/                           ← shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       └── ...
│   │
│   ├── lib/
│   │   ├── langgraph/
│   │   │   ├── graph.ts                  ← Main LangGraph definition
│   │   │   ├── state.ts                  ← InterviewState type + annotations
│   │   │   ├── nodes/
│   │   │   │   ├── sessionInit.ts
│   │   │   │   ├── openingStatement.ts
│   │   │   │   ├── questionGenerator.ts
│   │   │   │   ├── answerEvaluator.ts
│   │   │   │   ├── followupProber.ts
│   │   │   │   ├── difficultyEscalator.ts
│   │   │   │   ├── topicTransition.ts
│   │   │   │   ├── coverageChecker.ts
│   │   │   │   ├── closingStatement.ts
│   │   │   │   └── feedbackGenerator.ts
│   │   │   ├── edges/
│   │   │   │   ├── routeAfterEvaluation.ts  ← Conditional edge logic
│   │   │   │   └── routeAfterCoverage.ts
│   │   │   └── personas.ts               ← INTERVIEWER_PERSONAS config
│   │   │
│   │   ├── vapi/
│   │   │   ├── client.ts                 ← Vapi Web SDK wrapper
│   │   │   └── webhookHandler.ts         ← Processes Vapi webhook payloads
│   │   │
│   │   ├── db/
│   │   │   └── prisma.ts                 ← Prisma client singleton
│   │   │
│   │   ├── redis/
│   │   │   └── client.ts                 ← Redis client + session helpers
│   │   │
│   │   ├── auth/
│   │   │   ├── jwt.ts                    ← Sign/verify JWT
│   │   │   └── middleware.ts             ← Auth guard for API routes
│   │   │
│   │   └── utils/
│   │       ├── formatTranscript.ts
│   │       └── scoreCalculator.ts
│   │
│   ├── hooks/
│   │   ├── useVapiSession.ts             ← Manages Vapi connection lifecycle
│   │   ├── useInterviewSession.ts        ← Session state management
│   │   └── useAuth.ts                    ← Auth state + token storage
│   │
│   ├── store/
│   │   ├── authStore.ts                  ← Zustand: user auth state
│   │   └── interviewStore.ts             ← Zustand: current session state
│   │
│   └── types/
│       ├── interview.ts                  ← InterviewType, TranscriptTurn, etc.
│       ├── feedback.ts                   ← FeedbackReport schema
│       └── auth.ts                       ← User, JWT payload types
│
└── public/
    ├── favicon.ico
    └── assets/
```

---

## CRITICAL BEHAVIOURS TO IMPLEMENT

### 1. Dynamic Response (Most Important)
Every AI response MUST be generated from the FULL conversation history to date.
Never generate a question without first processing the candidate's previous answer.
The LangGraph `respond` endpoint receives the full transcript on every turn.

### 2. Follow-Up Logic
If `flags.followUpCount < 2` AND answer is weak:
  → Route to followup_prober (not a new question)
If `flags.followUpCount >= 2` OR answer is adequate/strong:
  → Route to topic_transition or difficulty_escalator

### 3. No Fixed Question Bank
Questions are generated by the `question_generator` node using the LLM.
Inputs: interview type, job role, experience level, topics already covered, difficulty level.
No hardcoded question list anywhere in the codebase.

### 4. Natural Closing
The `coverage_checker` node checks:
- Time elapsed >= maxDurationMinutes * 0.85
- OR topicsCovered.length >= targetTopicCount for the interview type
If either condition met → route to closing_statement → feedback_generator

### 5. Session Persistence
On every LangGraph execution:
  1. Load state from Redis (key: `session:{sessionId}`)
  2. Run node(s)
  3. Save updated state to Redis
  4. Persist transcript snapshot to PostgreSQL

---

## COST ANALYSIS REQUIREMENT

Include a `COST_ANALYSIS.md` in the repo root with:

```markdown
# API Cost Analysis (per interview session)

## Assumptions
- Average session: 20 minutes
- Average turns: 25 (candidate + AI)
- Average tokens per turn: ~500

## Vapi (Voice Layer)
- Price: $0.05/minute for voice processing
- 20 min session: $1.00

## Anthropic Claude 3.5 Sonnet (AI Brain)
- Input: $3/1M tokens
- Output: $15/1M tokens
- Per session: ~12,500 input tokens + ~3,000 output tokens
- Cost: ~$0.038 + $0.045 = ~$0.083

## Total per session: ~$1.08

## Optimisation Strategies
- Trim transcript context window for long sessions (keep last N turns + summary)
- Cache persona system prompts
- Use claude-3-haiku for evaluation nodes, sonnet only for generation
- Estimated optimised cost: ~$0.75/session
```

---

## README QUICK START

The README.md must enable local setup in 5 commands:

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

## QUALITY GATES (before considering this done)

- [ ] Voice session starts within 3 seconds of clicking "Begin Interview"
- [ ] AI always references something from the candidate's specific answer
- [ ] At least 1 follow-up question is asked per session on a weak answer
- [ ] No two sessions produce the same questions even for the same role/type
- [ ] Feedback report contains specific quotes from the candidate's answers
- [ ] JWT refresh works (token doesn't expire mid-session)
- [ ] Session recovers from Vapi disconnection (reconnect + state reload from Redis)
- [ ] All API routes return proper error codes (400/401/403/500)
- [ ] Transcript saved to DB on every turn (not just at end)
- [ ] Dashboard shows correct session history per authenticated user
```

---

## FULL FILE STRUCTURE (Plain Text Reference)

```
ai-interview-platform/
├── README.md
├── COST_ANALYSIS.md
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── auth/
│   │   │   ├── register/page.tsx
│   │   │   └── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── interview/
│   │   │   ├── setup/page.tsx
│   │   │   ├── session/page.tsx
│   │   │   └── report/[id]/page.tsx
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── register/route.ts
│   │       │   └── login/route.ts
│   │       └── interview/
│   │           ├── session/start/route.ts
│   │           ├── session/end/route.ts
│   │           ├── respond/route.ts
│   │           └── sessions/
│   │               ├── route.ts
│   │               └── [id]/report/route.ts
│   │
│   ├── components/
│   │   ├── interview/
│   │   │   ├── VoiceOrb.tsx
│   │   │   ├── TranscriptSidebar.tsx
│   │   │   ├── SessionTimer.tsx
│   │   │   ├── StatusBanner.tsx
│   │   │   └── EndSessionDialog.tsx
│   │   ├── dashboard/
│   │   │   ├── SessionCard.tsx
│   │   │   └── ScoreRing.tsx
│   │   ├── report/
│   │   │   ├── ScoreOverview.tsx
│   │   │   ├── QuestionBreakdown.tsx
│   │   │   └── StrengthsImprovements.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── AuthGuard.tsx
│   │   └── ui/  (shadcn)
│   │
│   ├── lib/
│   │   ├── langgraph/
│   │   │   ├── graph.ts
│   │   │   ├── state.ts
│   │   │   ├── personas.ts
│   │   │   ├── nodes/
│   │   │   │   ├── sessionInit.ts
│   │   │   │   ├── openingStatement.ts
│   │   │   │   ├── questionGenerator.ts
│   │   │   │   ├── answerEvaluator.ts
│   │   │   │   ├── followupProber.ts
│   │   │   │   ├── difficultyEscalator.ts
│   │   │   │   ├── topicTransition.ts
│   │   │   │   ├── coverageChecker.ts
│   │   │   │   ├── closingStatement.ts
│   │   │   │   └── feedbackGenerator.ts
│   │   │   └── edges/
│   │   │       ├── routeAfterEvaluation.ts
│   │   │       └── routeAfterCoverage.ts
│   │   ├── vapi/
│   │   │   ├── client.ts
│   │   │   └── webhookHandler.ts
│   │   ├── db/prisma.ts
│   │   ├── redis/client.ts
│   │   ├── auth/
│   │   │   ├── jwt.ts
│   │   │   └── middleware.ts
│   │   └── utils/
│   │       ├── formatTranscript.ts
│   │       └── scoreCalculator.ts
│   │
│   ├── hooks/
│   │   ├── useVapiSession.ts
│   │   ├── useInterviewSession.ts
│   │   └── useAuth.ts
│   │
│   ├── store/
│   │   ├── authStore.ts
│   │   └── interviewStore.ts
│   │
│   └── types/
│       ├── interview.ts
│       ├── feedback.ts
│       └── auth.ts
│
└── public/
    └── assets/
```
