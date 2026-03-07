import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';
import { getUser } from '@/utils/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const user = await getUser();
    const { commentId } = await params;

    // Fetch the comment with its blog's author
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        blog: {
          select: { authorId: true },
        },
      },
    });

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Allow deletion if: user is the comment author OR user is the blog post author
    const isCommentAuthor = comment.authorId === user.id;
    const isBlogAuthor = comment.blog.authorId === user.id;

    if (!isCommentAuthor && !isBlogAuthor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete all likes on this comment first, then replies, then the comment
    await prisma.$transaction([
      prisma.commentLike.deleteMany({ where: { commentId } }),
      // Delete likes on replies
      prisma.commentLike.deleteMany({
        where: { comment: { parentId: commentId } },
      }),
      // Delete replies
      prisma.comment.deleteMany({ where: { parentId: commentId } }),
      // Delete the comment itself
      prisma.comment.delete({ where: { id: commentId } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
