// app/api/bookmarks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';
import { getUserByClerkID } from '@/utils/auth';

// Toggle bookmark (add/remove)
export async function POST(req: NextRequest) {
  try {
    const user = await getUserByClerkID();
    const { blogId } = await req.json();

    const existing = await prisma.bookmark.findUnique({
      where: { userId_blogId: { userId: user.id, blogId } },
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return NextResponse.json({ bookmarked: false, message: 'Bookmark removed' });
    }

    await prisma.bookmark.create({
      data: { userId: user.id, blogId },
    });

    return NextResponse.json({ bookmarked: true, message: 'Blog bookmarked' });
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Get user's bookmarks
export async function GET(req: NextRequest) {
  try {
    const user = await getUserByClerkID();

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        blog: {
          include: {
            author: { select: { firstName: true, lastName: true, profilePhoto: true } },
            views: true,
          },
        },
      },
    });

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
