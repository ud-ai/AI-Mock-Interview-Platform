import { InterviewState } from '@/types/interview';

// Routing edge after evaluating candidate's answer
export function routeAfterEvaluation(state: InterviewState): string {
  // If answer is weak and we haven't followed up too many times, probe further
  if (state.flags.lastAnswerWeak && state.flags.followUpCount < 2) {
    return 'followup_prober';
  }

  // If answer is strong, escalate difficulty
  if (state.flags.lastAnswerStrong) {
    return 'difficulty_escalator';
  }

  // Otherwise, transition to a new topic / next normal question flow
  return 'topic_transition';
}

// Routing edge to determine if we should end the interview
export function routeAfterCoverage(state: InterviewState): string {
  const elapsedMs = new Date().getTime() - new Date(state.startTime).getTime();
  const elapsedMins = elapsedMs / (1000 * 60);

  const timeLimitReached = elapsedMins >= state.maxDurationMinutes * 0.85;
  const topicsLimitReached = state.topicsCovered.length >= 3; // Target 3 main topics per interview

  if (timeLimitReached || topicsLimitReached || state.currentQuestionIndex >= 8) {
    return 'closing_statement';
  }

  // Otherwise loop back to generating a new question
  return 'question_generator';
}
