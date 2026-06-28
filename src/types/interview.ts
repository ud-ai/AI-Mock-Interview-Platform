export interface TranscriptTurn {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface AnswerScore {
  quality: 'weak' | 'adequate' | 'strong';
  reasoning: string;
  score: number;
  flags: string[];
  questionAsked: string;
  candidateAnswer: string;
}

export interface InterviewerPersona {
  name: string;
  style: string;
  openingScript: string;
  probePatterns: string[];
}

export interface InterviewState {
  sessionId: string;
  candidateName: string;
  jobRole: string;
  experienceLevel: 'junior' | 'mid' | 'senior' | 'lead';
  interviewType: 'behavioral' | 'technical' | 'system_design' | 'hr_culture';
  interviewerPersona: InterviewerPersona;
  transcript: TranscriptTurn[];
  currentTopic: string;
  topicsCovered: string[];
  currentQuestion: string;
  currentQuestionIndex: number;
  difficultyLevel: number; // 1-5
  answerScores: AnswerScore[];
  startTime: string; // ISO string for serialization
  maxDurationMinutes: number;
  phase: 'opening' | 'questioning' | 'closing' | 'complete';
  flags: {
    lastAnswerWeak: boolean;
    lastAnswerStrong: boolean;
    candidateStrugglingCount: number;
    followUpCount: number;
  };
}
