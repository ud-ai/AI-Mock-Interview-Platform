import { Annotation } from '@langchain/langgraph';
import { InterviewState } from '@/types/interview';

// Define the root state annotation for the LangGraph
export const InterviewStateAnnotation = Annotation.Root({
  sessionId: Annotation<string>(),
  candidateName: Annotation<string>(),
  jobRole: Annotation<string>(),
  experienceLevel: Annotation<'junior' | 'mid' | 'senior' | 'lead'>(),
  interviewType: Annotation<'behavioral' | 'technical' | 'system_design' | 'hr_culture'>(),
  interviewerPersona: Annotation<any>(),
  transcript: Annotation<any[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  currentTopic: Annotation<string>(),
  topicsCovered: Annotation<string[]>({
    reducer: (x, y) => Array.from(new Set([...x, ...y])),
    default: () => [],
  }),
  currentQuestion: Annotation<string>(),
  currentQuestionIndex: Annotation<number>(),
  difficultyLevel: Annotation<number>(),
  answerScores: Annotation<any[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  startTime: Annotation<string>(),
  maxDurationMinutes: Annotation<number>(),
  phase: Annotation<'opening' | 'questioning' | 'closing' | 'complete'>(),
  flags: Annotation<{
    lastAnswerWeak: boolean;
    lastAnswerStrong: boolean;
    candidateStrugglingCount: number;
    followUpCount: number;
  }>(),
});
