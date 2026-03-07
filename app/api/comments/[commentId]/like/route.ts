// app/api/comments/[commentId]/like/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';
import { getUser } from '@/utils/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ commentId: string }> }) {
  try {
    const user = await getUser();
    const { commentId } = await params;

    const existing = await prisma.commentLike.findUnique({
      where: { userId_commentId: { userId: user.id, commentId } },
    });

    if (existing) {
      await prisma.commentLike.delete({ where: { id: existing.id } });
      const likeCount = await prisma.commentLike.count({ where: { commentId } });
      return NextResponse.json({ liked: false, likeCount });
    }

    await prisma.commentLike.create({
      data: { userId: user.id, commentId },
    });

    const likeCount = await prisma.commentLike.count({ where: { commentId } });

    // Notify comment author
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (comment && comment.authorId !== user.id) {
      await prisma.notification.create({
        data: {
          userId: comment.authorId,
          commentId,
          type: 'like',
          message: `${user.firstName} liked your comment.`,
        },
      });
    }

    return NextResponse.json({ liked: true, likeCount });
  } catch (error) {
    console.error('Error toggling comment like:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
