import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticateRequest } from '@/lib/auth/middleware';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userPayload = await authenticateRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: sessionId } = await params;

    // Verify session belongs to the user
    const session = await prisma.session.findFirst({
      where: { id: sessionId, userId: userPayload.userId },
      include: {
        feedbackReport: true,
      },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (!session.feedbackReport) {
      return NextResponse.json(
        { error: 'Feedback report not generated yet' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      session: {
        id: session.id,
        interviewType: session.interviewType,
        jobRole: session.jobRole,
        startedAt: session.startedAt,
        durationSeconds: session.durationSeconds,
        transcript: session.transcript,
      },
      report: session.feedbackReport,
    });
  } catch (err: any) {
    console.error('Fetch report error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
