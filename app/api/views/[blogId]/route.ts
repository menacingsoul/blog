import { getUserByClerkID } from '@/utils/auth';
import { NextResponse,NextRequest } from 'next/server';
import { prisma } from '@/utils/db';

export async function POST(request: NextRequest, { params }: { params: { blogId: string } }) {
  const blogId = params.blogId;

  const user = await getUserByClerkID();
  const userId = user.id; 

  if (!userId) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  try {
    await prisma.view.create({
      data: {
        userId,
        blogId,
      },
    });
    return NextResponse.json({ message: 'View recorded' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Could not record view' }, { status: 500 });
  }
}
