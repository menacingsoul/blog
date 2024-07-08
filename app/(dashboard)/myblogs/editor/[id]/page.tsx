// app/blog/editor/[id]/page.tsx

import BlogEditor from '@/components/myBlogs/BlogEditor';
import { prisma } from '@/utils/db';
import { getUserByClerkID } from '@/utils/auth';


const BlogEditorPage = async ({ params }: { params: { id: string } }) => {
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
  if(blog.published==true)
  {
    return <div>Page not found</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8 flex justify-center">
       <div className="absolute top-26 left-[32%] w-[55%] h-60 md:w-64 md:h-64 lg:w-[40%] lg:h-72 bg-purple-500 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-36 left-[29%] w-[45%] h-48 md:w-64 md:h-64 lg:w-[50%] lg:h-96 bg-yellow-500 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-200"></div>
      <div className="absolute top-6 left-[19%] w-[50%] h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-pink-500 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-400"></div>
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl mb-4 text-white font-bold">Edit Blog</h1>
        <BlogEditor 
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

export default BlogEditorPage;
