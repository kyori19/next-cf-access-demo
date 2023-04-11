import { NextResponse } from 'next/server';
import { verifyToken } from '../../useAccess';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const path = searchParams.get('path');
  if (!path) {
    return new Response('invalid request', { status: 400 });
  }

  const token = searchParams.get('token');
  const res = await verifyToken(token);
  if (res.err) {
    return new Response('invalid token', { status: 400 });
  }

  const response = NextResponse.redirect(new URL(path, request.url));
  response.cookies.set('CF_Authorization', token!);

  return response;
}
