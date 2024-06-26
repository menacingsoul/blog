import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../utils/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { username: username },
  });

  return NextResponse.json({ exists: !!user });
}
