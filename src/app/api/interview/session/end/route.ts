import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { sessionStore } from '@/lib/redis/client';
import { authenticateRequest } from '@/lib/auth/middleware';
import { generateSessionFeedback } from '@/lib/langgraph/graph';

export async function POST(req: NextRequest) {
  try {
    const userPayload = await authenticateRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    // Verify session belongs to user
    const session = await prisma.session.findFirst({
      where: { id: sessionId, userId: userPayload.userId },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Load final state from Redis
    const stateStr = await sessionStore.get(`session:${sessionId}`);
    if (!stateStr) {
      return NextResponse.json({ error: 'Session state expired' }, { status: 410 });
    }
    const state = JSON.parse(stateStr);

    // Trigger feedback report generation (using Gemini Pro)
    const reportData = await generateSessionFeedback(state);

    // Save FeedbackReport to DB
    const feedbackReport = await prisma.feedbackReport.create({
      data: {
        sessionId: session.id,
        overallScore: reportData.overallScore,
        communicationScore: reportData.communicationScore,
        technicalScore: reportData.technicalScore,
        structureScore: reportData.structureScore,
        confidenceScore: reportData.confidenceScore,
        strengths: reportData.strengths || [],
        improvements: reportData.improvements || [],
        detailedFeedback: reportData.detailedFeedback || [],
        hiringRecommendation: reportData.hiringRecommendation || 'maybe',
      },
    });

    // Mark session as completed
    await prisma.session.update({
      where: { id: session.id },
      data: {
        status: 'completed',
        endedAt: new Date(),
        durationSeconds: Math.floor(
          (new Date().getTime() - new Date(state.startTime).getTime()) / 1000
        ),
      },
    });

    // Cleanup Redis
    await sessionStore.del(`session:${sessionId}`);

    return NextResponse.json({ feedbackReport });
  } catch (err: any) {
    console.error('Session end error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
