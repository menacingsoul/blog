import { getUserByClerkID } from '@/utils/auth';
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/utils/db';

export async function POST(request: NextRequest, { params }: { params: { blogId: string } }) {
  const { blogId } = params;
  const user = await getUserByClerkID();
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

    // If the user has already voted, update the existing vote
    if (existingVote) {
      if (existingVote.upVote === isUpvote) {
        // If the user is trying to vote the same way again, ignore the vote
        return NextResponse.json({ message: `You have already ${type.toLowerCase()}d this blog` }, { status: 200 });
      } else {
        // If the user is changing their vote, update the vote
        await prisma.vote.update({
          where: {
            id: existingVote.id,
          },
          data: {
            upVote: isUpvote,
          },
        });

        // Update the vote count in the blog
        await prisma.blog.update({
          where: { id: blogId },
          data: {
            upVotes: { increment: isUpvote ? 1 : -1 },
            downVotes: { increment: isUpvote ? -1 : 1 },
          },
        });

        return NextResponse.json({ message: `Your vote has been updated to ${type.toLowerCase()}` }, { status: 200 });
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

    // Update the vote count in the blog
    await prisma.blog.update({
      where: { id: blogId },
      data: {
        upVotes: { increment: isUpvote ? 1 : 0 },
        downVotes: { increment: isUpvote ? 0 : 1 },
      },
    });

    return NextResponse.json({ message: `Your ${type.toLowerCase()} has been recorded` }, { status: 200 });
  } catch (error) {
    console.error('Error handling vote:', error);
    return NextResponse.json({ error: 'Could not record vote' }, { status: 500 });
  }
}
