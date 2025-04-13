// app/api/blog/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';
import { getUserByClerkID } from '@/utils/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { title, content, description, published ,imageUrl } = await req.json();
  try {
    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        title,
        description,
        content,
        published,
        imageUrl
      },
    });
    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            profilePhoto: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                firstName: true,
                lastName: true,
                profilePhoto: true,
              },
            },
          },
        },
      },
    });

    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}


export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { type, content } = await req.json();

  try {
    if (type === 'upvote' || type === 'downvote') {
      const updateData = type === 'upvote' ? { upVotes: { increment: 1 } } : { downVotes: { increment: 1 } };

      const blog = await prisma.blog.update({
        where: { id },
        data: updateData,
      });

      return NextResponse.json({ message: 'Vote recorded successfully', blog });
    } else if (type === 'comment') {
      const user = await getUserByClerkID();

      const comment = await prisma.comment.create({
        data: {
          content,
          authorId: user.id,
          blogId: id,
        },
      });

      return NextResponse.json({ message: 'Comment added successfully', comment });
    } else {
      return NextResponse.json({ message: 'Invalid request type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    await prisma.view.deleteMany({
      where:{
        blogId:id,
      }
    })
    await prisma.vote.deleteMany({
      where:{
        blogId:id,
      }
    })
    await prisma.comment.deleteMany({
      where: {
        blogId: id,
      },
    });
    await prisma.blog.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Blog deleted successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting blog :", error);
    return NextResponse.json({
      error: "Failed to delete blog entry",
      status: 500,
    });
  }
}