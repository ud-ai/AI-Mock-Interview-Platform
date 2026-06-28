import { StateGraph } from '@langchain/langgraph';
import { InterviewStateAnnotation } from './state';
import {
  sessionInitNode,
  openingStatementNode,
  questionGeneratorNode,
  answerEvaluatorNode,
  followupProberNode,
  difficultyEscalatorNode,
  topicTransitionNode,
  coverageCheckerNode,
  closingStatementNode,
  feedbackGeneratorNode,
} from './nodes';
import { routeAfterEvaluation, routeAfterCoverage } from './edges';

// Construct the state graph
const workflow = new StateGraph(InterviewStateAnnotation)
  // Define nodes
  .addNode('session_init', sessionInitNode as any)
  .addNode('opening_statement', openingStatementNode as any)
  .addNode('question_generator', questionGeneratorNode as any)
  .addNode('answer_evaluator', answerEvaluatorNode as any)
  .addNode('followup_prober', followupProberNode as any)
  .addNode('difficulty_escalator', difficultyEscalatorNode as any)
  .addNode('topic_transition', topicTransitionNode as any)
  .addNode('coverage_checker', coverageCheckerNode as any)
  .addNode('closing_statement', closingStatementNode as any)
  .addNode('feedback_generator', feedbackGeneratorNode as any)

  // Define edges
  .addEdge('session_init', 'opening_statement')
  .addEdge('opening_statement', 'question_generator')

  // Answer evaluator conditional routing
  .addConditionalEdges('answer_evaluator', routeAfterEvaluation, {
    followup_prober: 'followup_prober',
    difficulty_escalator: 'difficulty_escalator',
    topic_transition: 'topic_transition',
  })

  // From prober, we wait for next answer (loop back to evaluator when candidate speaks)
  // In the active phase, candidate answers go directly to evaluator.
  .addEdge('followup_prober', 'coverage_checker')
  .addEdge('difficulty_escalator', 'topic_transition')
  .addEdge('topic_transition', 'coverage_checker')

  // Coverage checker conditional routing
  .addConditionalEdges('coverage_checker', routeAfterCoverage, {
    question_generator: 'question_generator',
    closing_statement: 'closing_statement',
  })

  .addEdge('question_generator', 'coverage_checker')
  .addEdge('closing_statement', 'feedback_generator');

// Compile the workflow
export const graph = workflow.compile();

/**
 * Run session start sequence.
 * Returns initial state and opening statement.
 */
export async function startInterviewSession(initialParams: {
  sessionId: string;
  candidateName: string;
  jobRole: string;
  experienceLevel: 'junior' | 'mid' | 'senior' | 'lead';
  interviewType: 'behavioral' | 'technical' | 'system_design' | 'hr_culture';
}) {
  const defaultState = {
    ...initialParams,
    difficultyLevel: 1,
    currentQuestionIndex: 0,
    topicsCovered: [],
    transcript: [],
    answerScores: [],
    currentQuestion: '',
    currentTopic: '',
    startTime: new Date().toISOString(),
    maxDurationMinutes: 20,
    phase: 'opening' as const,
    flags: {
      lastAnswerWeak: false,
      lastAnswerStrong: false,
      candidateStrugglingCount: 0,
      followUpCount: 0,
    },
  };

  // Run through session_init and opening_statement nodes
  const stateAfterInit = await sessionInitNode(defaultState as any);
  const stateAfterOpening = await openingStatementNode({ ...defaultState, ...stateAfterInit } as any);

  return {
    ...defaultState,
    ...stateAfterInit,
    ...stateAfterOpening,
  };
}

/**
 * Process a user answer turn.
 * Executes answer evaluation and determines next node to visit.
 */
export async function processUserAnswer(
  currentState: any,
  userAnswer: string
): Promise<any> {
  const updatedTranscript = [
    ...currentState.transcript,
    {
      role: 'user' as const,
      content: userAnswer,
      timestamp: new Date().toISOString(),
    },
  ];

  const stateWithAnswer = {
    ...currentState,
    transcript: updatedTranscript,
  };

  // 1. Evaluate answer
  const evalUpdates = await answerEvaluatorNode(stateWithAnswer);
  const evaluatedState = { ...stateWithAnswer, ...evalUpdates };

  // 2. Route after evaluation
  const nextTarget = routeAfterEvaluation(evaluatedState);
  let finalState = evaluatedState;

  if (nextTarget === 'followup_prober') {
    const probeUpdates = await followupProberNode(evaluatedState);
    finalState = { ...evaluatedState, ...probeUpdates };
  } else {
    // Escalate difficulty or transition topic
    let prepState = evaluatedState;
    if (nextTarget === 'difficulty_escalator') {
      const escalatorUpdates = await difficultyEscalatorNode(evaluatedState);
      prepState = { ...evaluatedState, ...escalatorUpdates };
    }
    const transitionUpdates = await topicTransitionNode(prepState);
    const stateAfterTransition = { ...prepState, ...transitionUpdates };

    // Check coverage
    const afterCoverageTarget = routeAfterCoverage(stateAfterTransition);

    if (afterCoverageTarget === 'closing_statement') {
      const closingUpdates = await closingStatementNode(stateAfterTransition);
      finalState = { ...stateAfterTransition, ...closingUpdates };
    } else {
      const questionUpdates = await questionGeneratorNode(stateAfterTransition);
      finalState = { ...stateAfterTransition, ...questionUpdates };
    }
  }

  return finalState;
}

/**
 * End session and trigger feedback report.
 */
export async function generateSessionFeedback(currentState: any): Promise<any> {
  const result = await feedbackGeneratorNode(currentState);
  return result.graphState;
}
