import { NextRequest } from 'next/server';
import { verifyToken, JWTPayload } from './jwt';

export async function authenticateRequest(req: NextRequest): Promise<JWTPayload | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  return verifyToken(token);
}
