import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { sessionStore } from '@/lib/redis/client';
import { processUserAnswer } from '@/lib/langgraph/graph';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId query param' }, { status: 400 });
    }

    const body = await req.json();
    const messages = body.messages || [];
    
    // Find the latest user speech input from the messages
    const lastUserMsg = [...messages].reverse().find((m: any) => m.role === 'user');
    const candidateAnswer = lastUserMsg ? lastUserMsg.content : '';

    if (!candidateAnswer) {
      // Return empty response or simple prompt if no user input found
      return NextResponse.json({
        choices: [{ message: { role: 'assistant', content: 'I am listening. Please proceed.' } }]
      });
    }

    // Load state from Redis
    const stateStr = await sessionStore.get(`session:${sessionId}`);
    if (!stateStr) {
      return NextResponse.json({ error: 'Session state not found or expired' }, { status: 404 });
    }
    const state = JSON.parse(stateStr);

    // Process the candidate's response in LangGraph
    const nextState = await processUserAnswer(state, candidateAnswer);

    // Save updated state back to Redis
    await sessionStore.set(`session:${sessionId}`, JSON.stringify(nextState), 7200);

    // Persist running transcript and graph snapshot to PostgreSQL
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        transcript: nextState.transcript as any,
        graphState: nextState as any,
      },
    });

    const nextQuestion = nextState.currentQuestion;

    // Return in OpenAI format that Vapi Webhook/Custom provider expects
    return NextResponse.json({
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: nextQuestion,
          },
          finish_reason: 'stop',
        },
      ],
    });
  } catch (err: any) {
    console.error('Webhook response error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
