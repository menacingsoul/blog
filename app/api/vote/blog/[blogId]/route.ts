import { getUser } from '@/utils/auth';
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/utils/db';

export async function POST(request: NextRequest, { params }: { params: Promise<{ blogId: string }> }) {
  const { blogId } = await params;
  const user = await getUser();
  const userId = user.id; 

  if (!userId) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  const { type } = await request.json(); // expects { type: 'upvote' | 'downvote' }
  const isUpvote = type === 'upvote';

  try {
    // Check if the user has already voted for this blog
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_blogId: {
          userId,
          blogId,
        },
      },
    });

    if (existingVote) {
      if (existingVote.upVote === isUpvote) {
        // Same vote again — remove the vote (toggle off)
        await prisma.vote.delete({
          where: { id: existingVote.id },
        });

        const blog = await prisma.blog.update({
          where: { id: blogId },
          data: {
            upVotes: { decrement: isUpvote ? 1 : 0 },
            downVotes: { decrement: isUpvote ? 0 : 1 },
          },
          select: { upVotes: true, downVotes: true },
        });
        return NextResponse.json({ message: `Your ${type} has been removed`, blog, removed: true });
      } else {
        // Changing vote direction
        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { upVote: isUpvote },
        });

        const blog = await prisma.blog.update({
          where: { id: blogId },
          data: {
            upVotes: { increment: isUpvote ? 1 : -1 },
            downVotes: { increment: isUpvote ? -1 : 1 },
          },
          select: { upVotes: true, downVotes: true },
        });

        return NextResponse.json({ message: `Your vote has been updated to ${type}`, blog });
      }
    }

    // Create a new vote
    await prisma.vote.create({
      data: {
        userId,
        blogId,
        upVote: isUpvote,
      },
    });

    const blog = await prisma.blog.update({
      where: { id: blogId },
      data: {
        upVotes: { increment: isUpvote ? 1 : 0 },
        downVotes: { increment: isUpvote ? 0 : 1 },
      },
      select: { upVotes: true, downVotes: true },
    });

    return NextResponse.json({ message: `Your ${type} has been recorded`, blog });
  } catch (error) {
    console.error('Error handling vote:', error);
    return NextResponse.json({ error: 'Could not record vote' }, { status: 500 });
  }
}
