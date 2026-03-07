import { prisma } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ commentId: string }> }) {
  const { commentId } = await params;
  const take = Number(req.nextUrl.searchParams.get('take') || 5);
  const skip = Number(req.nextUrl.searchParams.get('skip') || 0);

  const replies = await prisma.comment.findMany({
    where: { parentId: commentId },
    orderBy: { createdAt: 'asc' },
    take,
    skip,
    include: {
      author: { select: { firstName: true, lastName: true, profilePhoto: true, username: true } }
    }
  });

  return NextResponse.json(replies);
}