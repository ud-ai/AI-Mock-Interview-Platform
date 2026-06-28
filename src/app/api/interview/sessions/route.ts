import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticateRequest } from '@/lib/auth/middleware';

export async function GET(req: NextRequest) {
  try {
    const userPayload = await authenticateRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessions = await prisma.session.findMany({
      where: { userId: userPayload.userId },
      orderBy: { startedAt: 'desc' },
      include: {
        feedbackReport: {
          select: {
            overallScore: true,
            hiringRecommendation: true,
          },
        },
      },
    });

    return NextResponse.json({ sessions });
  } catch (err: any) {
    console.error('List sessions error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
