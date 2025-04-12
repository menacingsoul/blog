import { prisma } from '@/utils/db';
import BlogCard from '@/components/cards/BlogCard';
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
      <div className="absolute top-32 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-64 right-1/4 w-80 h-80 bg-pink-600 rounded-full filter blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>
      <div className="absolute bottom-32 left-1/3 w-72 h-72 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>

      
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
