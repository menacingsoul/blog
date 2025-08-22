// app/api/blog/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';
import { getUserByClerkID } from '@/utils/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { title, content, description, published, imageUrl } = await req.json();
  try {
    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: { title, description, content, published, imageUrl },
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
        author: { select: { firstName: true, lastName: true, profilePhoto: true } },
        comments: {
          where: { parentId: null },
          include: {
            author: { select: { firstName: true, lastName: true, profilePhoto: true } },
            replies: {
              include: {
                author: { select: { firstName: true, lastName: true, profilePhoto: true } },
              },
            },
          },
        },
      },
    });

    if (!blog) return NextResponse.json({ message: 'Blog not found' }, { status: 404 });

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { type, content, parentId } = await req.json();

  try {
    const user = await getUserByClerkID();

    if (type === 'upvote' || type === 'downvote') {
      const updateData = type === 'upvote' ? { upVotes: { increment: 1 } } : { downVotes: { increment: 1 } };
      const blog = await prisma.blog.update({ where: { id }, data: updateData });
      return NextResponse.json({ message: 'Vote recorded successfully', blog });
    }

    if (type === 'comment') {
      const comment = await prisma.comment.create({
        data: {
          content,
          authorId: user.id,
          blogId: id,
          parentId: parentId || null,
        },
      });

      // Notify original commenter if it's a reply
      if (parentId) {
        const parentComment = await prisma.comment.findUnique({ where: { id: parentId } });
        if (parentComment && parentComment.authorId !== user.id) {
          await prisma.notification.create({
            data: {
              userId: parentComment.authorId,
              commentId: comment.id,
              type: 'reply',
              message: `${user.firstName} replied to your comment.`,
            },
          });
        }
      } else {
        // Notify blog author if it's a top-level comment
        const blog = await prisma.blog.findUnique({ where: { id } });
        if (blog && blog.authorId !== user.id) {
          await prisma.notification.create({
            data: {
              userId: blog.authorId,
              blogId: id,
              type: 'comment',
              message: `${user.firstName} commented on your blog.`,
            },
          });
        }
      }

      return NextResponse.json({ message: 'Comment added successfully', comment });
    }

    return NextResponse.json({ message: 'Invalid request type' }, { status: 400 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    await prisma.view.deleteMany({ where: { blogId: id } });
    await prisma.vote.deleteMany({ where: { blogId: id } });
    await prisma.comment.deleteMany({ where: { blogId: id } });
    await prisma.blog.delete({ where: { id } });

    return NextResponse.json({ message: "Blog deleted successfully", status: 200 });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ error: "Failed to delete blog entry", status: 500 });
  }
}
