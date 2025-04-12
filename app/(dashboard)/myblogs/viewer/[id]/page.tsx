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
              firstName: true,
              lastName: true,
              profilePhoto: true,
              username: true,
            },
          },
          content: true,
        },
      },
      views: true,  // Include views relation
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
       <div className="absolute top-32 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-64 right-1/4 w-80 h-80 bg-pink-600 rounded-full filter blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>
      <div className="absolute bottom-32 left-1/3 w-72 h-72 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>

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
        imageUrl={blog.imageUrl}
        viewCount={viewCount}  // Pass view count to the BlogViewer component
      />
    </div>
  );
};

export default BlogViewPage;
