import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { sessionStore } from '@/lib/redis/client';
import { authenticateRequest } from '@/lib/auth/middleware';
import { startInterviewSession } from '@/lib/langgraph/graph';

export async function POST(req: NextRequest) {
  try {
    const userPayload = await authenticateRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { interviewType, customJobRole } = await req.json();

    if (!interviewType) {
      return NextResponse.json(
        { error: 'Missing interviewType' },
        { status: 400 }
      );
    }

    // Fetch user details from database
    const user = await prisma.user.findUnique({
      where: { id: userPayload.userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const role = customJobRole || user.jobRole;

    // Create session in DB
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        interviewType,
        jobRole: role,
        status: 'active',
        transcript: [],
        graphState: {},
      },
    });

    // Start LangGraph session
    const initialState = await startInterviewSession({
      sessionId: session.id,
      candidateName: user.name,
      jobRole: role,
      experienceLevel: user.experienceLevel as any,
      interviewType: interviewType,
    });

    // Save to Redis (expires in 2 hours)
    await sessionStore.set(
      `session:${session.id}`,
      JSON.stringify(initialState),
      7200
    );

    // Save initial transcript to PostgreSQL
    await prisma.session.update({
      where: { id: session.id },
      data: {
        transcript: initialState.transcript as any,
        graphState: initialState as any,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Vapi configuration
    const vapiCallConfig = {
      model: {
        provider: 'custom',
        url: `${appUrl}/api/interview/respond?sessionId=${session.id}`,
      },
      voice: {
        provider: '11labs',
        voiceId: 'adam',
      },
      firstMessage: initialState.currentQuestion,
    };

    return NextResponse.json({
      sessionId: session.id,
      openingMessage: initialState.currentQuestion,
      vapiCallConfig,
    });
  } catch (err: any) {
    console.error('Session start error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
