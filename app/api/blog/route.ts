// app/api/blog/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';
import { getUserByClerkID } from '@/utils/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getUserByClerkID();

    const newBlog = await prisma.blog.create({
      data: {
        title: 'Untitled Blog',
        description:'',
        content: '',
        published: false,
        authorId: user.id,
      },
    });

    return NextResponse.json(newBlog);
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
