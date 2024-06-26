// app/blog/view/[id]/page.tsx

import BlogViewer from '@/components/BlogViewer';
import { prisma } from '@/utils/db';

const BlogViewPage = async ({ params }) => {
  const { id } = params;

  // Fetch the blog data on the server side
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
      comments:{
        select:{
            author:{
                select:{
                    firstName:true,
                    lastName:true,
                    profilePhoto:true,
                }
            },
            content:true,
        }
      }
    },
  });

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <div className="h-screen overflow-y-scroll bg-gradient-to-br from-gray-900 to-black p-8">
    <div className="absolute top-26 left-[32%] w-[55%] h-60 md:w-64 md:h-64 lg:w-[40%] lg:h-72 bg-purple-500 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-36 left-[29%] w-[45%] h-48 md:w-64 md:h-64 lg:w-[50%] lg:h-96 bg-yellow-500 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-200"></div>
      <div className="absolute top-6 left-[19%] w-[50%] h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-pink-500 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-400"></div>
      <BlogViewer
        blogId={id}
        title={blog.title}
        content={blog.content}
        author={blog.author}
        upVotes={blog.upVotes}
        downVotes={blog.downVotes}
        initialComments={blog.comments}
      />
    </div>
  );
};

export default BlogViewPage;
