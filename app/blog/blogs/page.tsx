import { prisma } from '@/utils/db';
import BlogCard from '@/components/blog/BlogCard';
import BlogsSearch from '@/components/blog/BlogSearch';

const Blogs = async ({ searchParams }) => {
  const searchQuery = searchParams.search || '';
  const searchBy = searchParams.date ? 'date' : 'name'; // Determine search criteria based on URL params

  let blogs = [];

  if (searchBy === 'name') {
    blogs = await prisma.blog.findMany({
      where: {
        published: true,
        OR: [
          {
            title: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            content: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        ],
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
  } 

  const recentBlogs = blogs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-26 left-[32%] w-[55%] h-60 md:w-64 md:h-64 lg:w-[40%] lg:h-72 bg-purple-500 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-36 left-[29%] w-[45%] h-48 md:w-64 md:h-64 lg:w-[50%] lg:h-96 bg-yellow-500 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-200"></div>
      <div className="absolute top-6 left-[19%] w-[50%] h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-pink-500 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-400"></div>
      
      <BlogsSearch />

      <div className="text-white p-4 font-bold text-2xl">
        Recent Blogs
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 scrollbar-thin scrollbar-thumb-rounded">
        {recentBlogs.length > 0 ? (
          recentBlogs.map(blog => (
            <BlogCard key={blog.id} blog={blog} />
          ))
        ) : (
          <div className="text-white p-4">
            No results found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
