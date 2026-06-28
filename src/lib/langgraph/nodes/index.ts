import { InterviewState, TranscriptTurn, AnswerScore } from '@/types/interview';
import { geminiModel, geminiProModel } from '../gemini';
import { INTERVIEWER_PERSONAS } from '../personas';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';

// 1. Session Init Node
export async function sessionInitNode(state: InterviewState): Promise<Partial<InterviewState>> {
  const persona = INTERVIEWER_PERSONAS[state.interviewType] || INTERVIEWER_PERSONAS.behavioral;
  return {
    interviewerPersona: persona,
    difficultyLevel: state.difficultyLevel || 1,
    currentQuestionIndex: 0,
    topicsCovered: [],
    transcript: [],
    answerScores: [],
    phase: 'opening',
    flags: {
      lastAnswerWeak: false,
      lastAnswerStrong: false,
      candidateStrugglingCount: 0,
      followUpCount: 0,
    },
  };
}

// 2. Opening Statement Node
export async function openingStatementNode(state: InterviewState): Promise<Partial<InterviewState>> {
  const persona = state.interviewerPersona;
  const script = persona.openingScript
    .replace('{name}', state.candidateName)
    .replace('{role}', state.jobRole);

  const newTurn: TranscriptTurn = {
    role: 'assistant',
    content: script,
    timestamp: new Date().toISOString(),
  };

  return {
    currentQuestion: script,
    transcript: [newTurn],
    phase: 'questioning',
  };
}

// Helper to format transcript for model context
function formatTranscript(turns: TranscriptTurn[]): string {
  return turns
    .map((t) => `${t.role === 'user' ? 'Candidate' : 'Interviewer'}: "${t.content}"`)
    .join('\n');
}

// 3. Question Generator Node
export async function questionGeneratorNode(state: InterviewState): Promise<Partial<InterviewState>> {
  const transcriptStr = formatTranscript(state.transcript);

  const prompt = `You are ${state.interviewerPersona.name}, an expert interviewer conducting a ${state.interviewType} interview.
Interviewer Style: ${state.interviewerPersona.style}
Candidate Name: ${state.candidateName}
Job Role: ${state.jobRole}
Experience Level: ${state.experienceLevel}
Current Difficulty Level: ${state.difficultyLevel}/5
Current Topic: ${state.currentTopic || 'Core concepts'}
Topics Covered So Far: ${state.topicsCovered.join(', ') || 'None'}

Here is the conversation transcript so far:
${transcriptStr || 'No questions asked yet.'}

Generate the NEXT question for the candidate. Keep it concise, natural, and conversational as if spoken in a real-time voice call. Do not include any JSON formatting, meta-commentary, or greetings. Ask only one question.`;

  const response = await geminiModel.invoke([new HumanMessage(prompt)]);
  const question = response.content.toString().trim();

  const newTurn: TranscriptTurn = {
    role: 'assistant',
    content: question,
    timestamp: new Date().toISOString(),
  };

  return {
    currentQuestion: question,
    currentQuestionIndex: state.currentQuestionIndex + 1,
    transcript: [newTurn],
    flags: {
      ...state.flags,
      followUpCount: 0, // Reset follow up count for new question
    },
  };
}

// 4. Answer Evaluator Node
export async function answerEvaluatorNode(state: InterviewState): Promise<Partial<InterviewState>> {
  const lastUserTurn = state.transcript.filter(t => t.role === 'user').at(-1);
  if (!lastUserTurn) {
    return {};
  }

  const prompt = `You are evaluating a candidate's response to an interview question.
Interview Type: ${state.interviewType}
Job Role: ${state.jobRole}
Experience Level: ${state.experienceLevel}
Question Asked: "${state.currentQuestion}"
Candidate's Answer: "${lastUserTurn.content}"

Evaluate the answer based on: completeness, specificity, relevance, and structure (STAR method if behavioral).
You must return a valid JSON object matching the following schema exactly. Do not wrap it in markdown code blocks.
Schema:
{
  "quality": "weak" | "adequate" | "strong",
  "reasoning": "Brief explanation of your evaluation, referencing specific details the candidate said or missed.",
  "score": number (1-10),
  "flags": string[] (e.g. ["vague", "skipped_star", "over-technical", "good_depth"])
}`;

  try {
    const response = await geminiProModel.invoke([new HumanMessage(prompt)]);
    let cleanedText = response.content.toString().trim();
    // Strip markdown code blocks if the model wrapped it
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    }
    const result = JSON.parse(cleanedText);

    const isWeak = result.quality === 'weak';
    const isStrong = result.quality === 'strong';

    const newScoreEntry: AnswerScore = {
      quality: result.quality,
      reasoning: result.reasoning,
      score: result.score || 5,
      flags: result.flags || [],
      questionAsked: state.currentQuestion,
      candidateAnswer: lastUserTurn.content,
    };

    return {
      flags: {
        ...state.flags,
        lastAnswerWeak: isWeak,
        lastAnswerStrong: isStrong,
        candidateStrugglingCount: isWeak
          ? state.flags.candidateStrugglingCount + 1
          : state.flags.candidateStrugglingCount,
      },
      answerScores: [newScoreEntry],
      difficultyLevel: isStrong
        ? Math.min(5, state.difficultyLevel + 1)
        : isWeak
        ? Math.max(1, state.difficultyLevel - 1)
        : state.difficultyLevel,
    };
  } catch (err) {
    console.error('Error in answerEvaluatorNode parsing:', err);
    // Fallback safe return
    return {
      flags: {
        ...state.flags,
        lastAnswerWeak: false,
        lastAnswerStrong: false,
      },
      answerScores: [{
        quality: 'adequate',
        reasoning: 'Evaluation fallback due to system error.',
        score: 6,
        flags: [],
        questionAsked: state.currentQuestion,
        candidateAnswer: lastUserTurn.content,
      }],
    };
  }
}

// 5. Follow-Up Prober Node
export async function followupProberNode(state: InterviewState): Promise<Partial<InterviewState>> {
  const lastScore = state.answerScores.at(-1);
  const transcriptStr = formatTranscript(state.transcript);

  const prompt = `You are ${state.interviewerPersona.name}, conducting a ${state.interviewType} interview.
Candidate: ${state.candidateName} (Role: ${state.jobRole})
Interviewer Style: ${state.interviewerPersona.style}

The candidate's last answer was evaluated as WEAK/VAGUE.
Reasoning: ${lastScore?.reasoning || 'Missing details'}

Here is the conversation history:
${transcriptStr}

Generate a natural, conversational follow-up question/probe to help the candidate expand on their answer. Ask for specifics, numbers, STAR details, or clarify design trade-offs based on: ${JSON.stringify(state.interviewerPersona.probePatterns)}.
Ask ONLY one direct question. Do not add greetings or metadata.`;

  const response = await geminiModel.invoke([new HumanMessage(prompt)]);
  const followUp = response.content.toString().trim();

  const newTurn: TranscriptTurn = {
    role: 'assistant',
    content: followUp,
    timestamp: new Date().toISOString(),
  };

  return {
    currentQuestion: followUp,
    transcript: [newTurn],
    flags: {
      ...state.flags,
      followUpCount: state.flags.followUpCount + 1,
    },
  };
}

// 6. Difficulty Escalator Node
export async function difficultyEscalatorNode(state: InterviewState): Promise<Partial<InterviewState>> {
  // Increase difficulty if evaluated strong
  const nextDifficulty = Math.min(5, state.difficultyLevel + 1);
  return {
    difficultyLevel: nextDifficulty,
  };
}

// 7. Topic Transition Node
export async function topicTransitionNode(state: InterviewState): Promise<Partial<InterviewState>> {
  const topicsForRole = getTopicsForInterviewType(state.interviewType);
  const remainingTopics = topicsForRole.filter((t) => !state.topicsCovered.includes(t));

  const nextTopic = remainingTopics[0] || 'advanced scenarios';

  return {
    currentTopic: nextTopic,
    topicsCovered: [nextTopic],
  };
}

function getTopicsForInterviewType(type: string): string[] {
  switch (type) {
    case 'technical':
      return ['core programming concepts', 'algorithms & complexity', 'data structures', 'system testing & debug'];
    case 'system_design':
      return ['high-level architecture', 'database schema & scalability', 'caching & performance', 'fault tolerance & security'];
    case 'hr_culture':
      return ['core motivations', 'collaboration & teamwork', 'handling failure/feedback', 'career aspirations'];
    case 'behavioral':
    default:
      return ['conflict resolution', 'leadership & initiative', 'adaptability & pressure', 'problem solving'];
  }
}

// 8. Coverage Checker Node
export async function coverageCheckerNode(state: InterviewState): Promise<Partial<InterviewState>> {
  // Handled by state logic, passes through to edges
  return {};
}

// 9. Closing Statement Node
export async function closingStatementNode(state: InterviewState): Promise<Partial<InterviewState>> {
  const message = `Thank you, ${state.candidateName}. We have covered all the major areas I wanted to discuss today. That concludes our mock interview. I will analyze your performance and prepare a detailed feedback report. Good luck!`;

  const newTurn: TranscriptTurn = {
    role: 'assistant',
    content: message,
    timestamp: new Date().toISOString(),
  };

  return {
    currentQuestion: message,
    transcript: [newTurn],
    phase: 'closing',
  };
}

// 10. Feedback Generator Node
export async function feedbackGeneratorNode(state: InterviewState): Promise<Partial<InterviewState>> {
  const transcriptStr = formatTranscript(state.transcript);
  const scoresStr = JSON.stringify(state.answerScores, null, 2);

  const prompt = `You are an expert interviewer and talent assessor.
Generate a comprehensive, structured feedback report for ${state.candidateName} who interviewed for the role of ${state.jobRole} (Experience: ${state.experienceLevel}).
Interview Type: ${state.interviewType}

Complete Interview Transcript:
${transcriptStr}

Per-Question Answer Scores & Critiques:
${scoresStr}

Analyze the candidate's performance across overall communication, technical depth (if technical/system design), answer structure (STAR method), and confidence.
You must return a valid JSON object matching the schema below exactly. Reference actual details/quotes from the conversation. Do not include markdown code block syntax.

JSON Schema:
{
  "overallScore": number (0-100),
  "communicationScore": number (0-100),
  "technicalScore": number (0-100) or null,
  "structureScore": number (0-100),
  "confidenceScore": number (0-100),
  "strengths": string[] (3-5 specific strengths with quotes/examples),
  "improvements": string[] (3-5 actionable improvements with details),
  "detailedFeedback": [
    {
      "question": "string",
      "answer": "string",
      "feedback": "string",
      "score": number (0-10)
    }
  ],
  "hiringRecommendation": "strong yes" | "yes" | "maybe" | "no",
  "recommendationReason": "string"
}`;

  try {
    const response = await geminiProModel.invoke([new HumanMessage(prompt)]);
    let cleanedText = response.content.toString().trim();
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    }

    // Save final state phase to complete
    return {
      phase: 'complete',
      // We will parse and store this directly in PostgreSQL in the End Session API
      graphState: JSON.parse(cleanedText) as any,
    };
  } catch (err) {
    console.error('Error generating feedback report:', err);
    return {
      phase: 'complete',
      graphState: {
        overallScore: 70,
        communicationScore: 70,
        technicalScore: 70,
        structureScore: 70,
        confidenceScore: 70,
        strengths: ['Demonstrated solid basic understanding.'],
        improvements: ['Could elaborate on specific design choices.'],
        detailedFeedback: [],
        hiringRecommendation: 'maybe',
        recommendationReason: 'System fallback evaluation.',
      } as any,
    };
  }
}
