import React from 'react';
import { prisma } from '@/utils/db';
import BlogCard from '@/components/cards/BlogCard';
import BlogsSearch from '@/components/blog/BlogSearch';
import { Search } from 'lucide-react';

const Blogs = async ({ searchParams }: { searchParams: { search?: string; page?: string } }) => {
  const searchQuery = searchParams.search || '';
  const page = Number(searchParams.page || 1);
  const limit = 12;
  const skip = (page - 1) * limit;

  const where: any = { published: true };

  if (searchQuery) {
    where.OR = [
      { title: { contains: searchQuery, mode: 'insensitive' } },
      { description: { contains: searchQuery, mode: 'insensitive' } },
      { content: { contains: searchQuery, mode: 'insensitive' } },
    ];
  }

  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            profilePhoto: true,
          },
        },
        views: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
    }),
    prisma.blog.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4 sm:px-6 lg:px-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
          <Search size={28} />
          Explore Blogs
          {searchQuery && (
            <span className="text-lg font-normal text-gray-400">
              — results for &quot;{searchQuery}&quot;
            </span>
          )}
        </h1>

        <BlogsSearch />

        <div className="text-gray-400 text-sm mb-6">
          {total} {total === 1 ? 'blog' : 'blogs'} found
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.length > 0 ? (
            blogs.map((blog: any) => (
              <BlogCard key={blog.id} blog={blog} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-400">
              <Search size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">No blogs found</p>
              {searchQuery && (
                <p className="text-sm mt-1">Try a different search term</p>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            {page > 1 && (
              <a
                href={`/blog/blogs?${searchQuery ? `search=${searchQuery}&` : ''}page=${page - 1}`}
                className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors text-sm"
              >
                Previous
              </a>
            )}
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
              .map((p, idx, arr) => (
                <React.Fragment key={p}>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="text-gray-500 px-1">...</span>
                  )}
                  <a
                    href={`/blog/blogs?${searchQuery ? `search=${searchQuery}&` : ''}page=${p}`}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      p === page
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {p}
                  </a>
                </React.Fragment>
              ))
            }

            {page < totalPages && (
              <a
                href={`/blog/blogs?${searchQuery ? `search=${searchQuery}&` : ''}page=${page + 1}`}
                className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors text-sm"
              >
                Next
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
