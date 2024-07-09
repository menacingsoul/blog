// app/api/unfollow/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';
import { getUserByClerkID } from '@/utils/auth';

export const POST = async (request: NextRequest) => {
  const { authorId } = await request.json();
  if (!authorId) {
    return NextResponse.json({ message: 'Author ID is required' }, { status: 400 });
  }

  const user = await getUserByClerkID();
  const currUserId = user.id;

  try {
    await prisma.$transaction(async (prisma) => {
      // Add the current user to the author's followers
      await prisma.user.update({
        where: { id: authorId },
        data: {
          followers: {
            disconnect: { id: currUserId },
          },
        },
      });

      // Add the author to the current user's following
      await prisma.user.update({
        where: { id: currUserId },
        data: {
          following: {
            disconnect: { id: authorId },
          },
        },
      });
    });

    return NextResponse.json({ message: 'Unfollow successful' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return NextResponse.json({ message: 'Error unfollowing user' }, { status: 500 });
  }
};
