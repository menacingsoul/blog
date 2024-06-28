// app/blog/page.tsx
import { prisma } from '@/utils/db';
import BlogCard from '@/components/BlogCard';
import FeaturedBlogCard from '@/components/FeaturedBlogCard';
import NewBlogCard from'@/components/NewBlogCard';
import { ToastContainer } from 'react-toastify';
import Link from 'next/link';
const BlogPage = async () => {
  
  // Fetch blogs using Prisma
  const mostViewedBlogs = await prisma.blog.findMany({
    where:{
      published:true,
    },
    include: {
      author: {
        select: {
          firstName: true,
          lastName: true,
          profilePhoto: true,
        },
      },
    },
    orderBy: {
      upVotes: 'desc',
    },
  });

  const blogs = await prisma.blog.findMany({
    where:{
      published:true,
      
    },
    include: {
      author: {
        select: {
          firstName: true,
          lastName: true,
          profilePhoto: true,
        },
      },
      
      
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const featuredBlog = mostViewedBlogs.length > 0 ? mostViewedBlogs[0] : null;
  const recentBlogs = blogs.slice(0,3);

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-26 left-[32%] w-[55%] h-60 md:w-64 md:h-64 lg:w-[40%] lg:h-72 bg-purple-500 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-36 left-[29%] w-[45%] h-48 md:w-64 md:h-64 lg:w-[50%] lg:h-96 bg-yellow-500 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-200"></div>
      <div className="absolute top-6 left-[19%] w-[50%] h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-pink-500 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-400"></div>
        <NewBlogCard/>
        <div className="text-white p-4 mt-3 font-bold text-2xl cursor-pointer">
          Top Blog
        </div>
        <div className="mb-4">
          {featuredBlog && <FeaturedBlogCard blog={featuredBlog}/>}
        </div>
      <div className='flex justify-between items-center'>
      <div className="text-white p-4 font-bold text-2xl">
        Recent Blogs
      </div>
      <div className='text-white p-4 z-50'>
        <Link href="/blog/blogs">
        View all
        </Link>
      </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 scrollbar-thin scrollbar-thumb-rounded">
        {recentBlogs.map(blog => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
