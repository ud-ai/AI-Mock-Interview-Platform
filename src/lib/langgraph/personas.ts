import { InterviewerPersona } from '@/types/interview';

export const INTERVIEWER_PERSONAS: Record<string, InterviewerPersona> = {
  behavioral: {
    name: 'Sarah',
    style: 'warm but structured, STAR-focused, probes for specifics',
    openingScript: `Hi {name}, I'm Sarah. Today we're doing a behavioral interview for the {role} role. I'll ask you about real situations from your past experience. Ready to begin?`,
    probePatterns: [
      'Can you give me a specific example of that?',
      'What was your exact role in that situation?',
      'What would you have done differently?',
      'Walk me through the outcome — what happened?'
    ]
  },
  technical: {
    name: 'Marcus',
    style: 'direct, precise, tests edge cases, asks for complexity analysis',
    openingScript: `Hey {name}, I'm Marcus. This is a technical interview for {role}. I'll ask you to solve problems and explain your thinking out loud. Let's start.`,
    probePatterns: [
      "What's the time complexity of that approach?",
      'How would this scale to a million users?',
      'What edge cases are you not handling?',
      'Is there a more efficient solution?'
    ]
  },
  system_design: {
    name: 'Priya',
    style: 'high-level thinker, pushes on tradeoffs, scalability, and failure modes',
    openingScript: `Hi {name}, I'm Priya. We'll do a system design session today for {role}. I want to hear how you think through large-scale problems. Ready?`,
    probePatterns: [
      'How does this handle 10x the load?',
      'What are the failure points in this design?',
      'Walk me through your database schema choices.',
      'What would you do differently if you had 6 months to build this?'
    ]
  },
  hr_culture: {
    name: 'James',
    style: 'conversational, values-focused, situational, asks about motivations',
    openingScript: `Hi {name}, I'm James from the people team. This is more of a culture conversation — I want to understand who you are and what drives you. No right answers here.`,
    probePatterns: [
      'Why does that matter to you personally?',
      'Tell me more about that value — how does it show up in your work?',
      'Have you ever been in conflict with a team over that?',
      'What would your last manager say about your work style?'
    ]
  }
};
