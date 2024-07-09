// app/api/follow/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';
import { getUserByClerkID } from '@/utils/auth';

export const POST = async (request: NextRequest) => {
  const { followerId } = await request.json();
  if (!followerId) {
    return NextResponse.json({ message: 'Author ID is required' }, { status: 400 });
  }

  const user = await getUserByClerkID();
  const currUserId = user.id;

  try {
    await prisma.$transaction(async (prisma) => {
      // Add the current user to the author's followers
      await prisma.user.update({
        where: { id: currUserId },
        data: {
          followers: {
            disconnect: { id: followerId },
          },
        },
      });

      // Add the author to the current user's following
      await prisma.user.update({
        where: { id: followerId },
        data: {
          following: {
            disconnect: { id: currUserId },
          },
        },
      });
    });

    return NextResponse.json({ message: 'Follower removal successful' });
  } catch (error) {
    console.error('Error removimg follower', error);
    return NextResponse.json({ message: 'Error removimg follower' }, { status: 500 });
  }
};
