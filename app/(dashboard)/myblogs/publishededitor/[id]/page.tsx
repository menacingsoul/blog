// app/blog/editor/[id]/page.tsx

import BlogEditor from '@/components/myBlogs/BlogEditor';
import { prisma } from '@/utils/db';
import { getUserByClerkID } from '@/utils/auth';
import PublishedBlogEditor from '@/components/myBlogs/PublishedBlogEditor';


const PublishedEditorPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const user = await getUserByClerkID();
  const currentUserId = user.id;

  // Fetch the blog data on the server side
  const blog = await prisma.blog.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id:true,
          firstName: true,
          lastName: true,
          profilePhoto: true,
        },
      },
    },
  });

  if (!blog) {
    return <div>Blog not found</div>;
  }
  if(blog.author.id!=currentUserId)
  {
    return <div>unauthorised access</div>
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8 flex justify-center">
       <div className="absolute top-32 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-64 right-1/4 w-80 h-80 bg-pink-600 rounded-full filter blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>
      <div className="absolute bottom-32 left-1/3 w-72 h-72 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>

      <div className="w-full max-w-4xl">
        <h1 className="text-3xl mb-4 text-white font-bold">Edit Blog</h1>
        <PublishedBlogEditor
          blogId={id} 
          initialDescription={blog.description} 
          initialContent={blog.content} 
          initialTitle={blog.title} 
          initialImageUrl={blog.imageUrl}
        />
      </div>
    </div>
  );
};

export default PublishedEditorPage;
