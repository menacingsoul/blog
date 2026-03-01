// app/blog/view/[id]/page.tsx

import BlogViewer from '@/components/myBlogs/BlogViewer';
import { prisma } from '@/utils/db';
import { getUserByClerkID } from '@/utils/auth';
import EditorCard from '@/components/myBlogs/EditorCard';
import AnalyticsButton from '@/components/myBlogs/AnalyticsButton';

const BlogViewPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const user = await getUserByClerkID();
  const currentUserId = user.id;
  
  // Fetch the blog data on the server side
  const blog = await prisma.blog.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profilePhoto: true,
          username: true,
        },
      },
      comments: {
        select: {
          id: true,
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePhoto: true,
              username: true,
            },
          },
          content: true,
          createdAt: true,
          _count: {
            select: {
              replies: true,
              likes: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc' as const,
        },
      },
      views: true,
    },
  });

  if (!blog) {
    return <div>Blog not found</div>;
  }

  if (blog.author.id !== currentUserId) {
    return <div>Unauthorized access</div>;
  }

  const viewCount = blog.views.length;

  return (
    <div className="h-screen overflow-y-scroll bg-gradient-to-br from-gray-900 to-black p-8">
       <div className='flex gap-x-2 items-center'>
       <AnalyticsButton id={id}/>
         <EditorCard id={id}/>
       </div>
      
      <BlogViewer
        blogId={id}
        title={blog.title}
        content={blog.content}
        author={blog.author}
        upVotes={blog.upVotes}
        downVotes={blog.downVotes}
        initialComments={blog.comments}
        imageUrl={blog.imageUrl || ''}
        viewCount={viewCount}
      />
    </div>
  );
};

export default BlogViewPage;
