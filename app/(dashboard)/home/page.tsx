// app/(dashboard)/home/page.tsx
import { prisma } from '@/utils/db';
import BlogCard from '@/components/cards/BlogCard';
import FeaturedBlogCard from '@/components/cards/FeaturedBlogCard';
import NewBlogCard from '@/components/cards/NewBlogCard';
import HomeSearch from '@/components/home/HomeSearch';
import Link from 'next/link';
import { ArrowRightCircle, TrendingUp, Clock, Search } from 'lucide-react';

export const revalidate = 3600;

const BlogPage = async () => {
  const mostViewedBlogs = await prisma.blog.findMany({
    where: { published: true },
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
    orderBy: { upVotes: 'desc' },
    take: 5,
  });

  const recentBlogs = await prisma.blog.findMany({
    where: { published: true },
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
    take: 6,
  });

  // Fetch categories for filter chips
  const categories = await prisma.category.findMany({
    include: { _count: { select: { blogs: true } } },
    orderBy: { blogs: { _count: 'desc' } },
    take: 10,
  });

  const featuredBlog = mostViewedBlogs.length > 0 ? mostViewedBlogs[0] : null;
  const topBlogs = mostViewedBlogs.slice(1, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden pb-20 md:pb-8">
      {/* Hero section */}
      <section className="relative z-10 max-w-7xl mx-auto mb-12 pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight animate-fadeInUp">
            Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">BlogVerse</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Discover insightful articles, stories, and perspectives from our community of writers.
          </p>
        </div>

        {/* Search bar */}
        <HomeSearch />

        {/* Category chips */}
        {categories.length > 0 && (
          <div className="max-w-3xl mx-auto flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog/blogs?search=${encodeURIComponent(cat.name)}`}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-800/70 border border-gray-700/50 text-gray-300 hover:border-indigo-500/50 hover:text-indigo-300 transition-colors"
              >
                {cat.name}
                <span className="ml-1 text-gray-500">({cat._count.blogs})</span>
              </Link>
            ))}
          </div>
        )}

        {/* Create New Blog Card */}
        <NewBlogCard />
      </section>

      {/* Featured blog section */}
      {featuredBlog && (
        <section className="relative z-10 max-w-7xl mx-auto mb-16 animate-fadeInUp">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-2xl font-bold flex items-center">
              <TrendingUp className="mr-2" size={24} />
              Featured Post
            </h2>
          </div>
          <FeaturedBlogCard blog={featuredBlog} />
        </section>
      )}

      {/* Top blogs section */}
      {topBlogs.length > 0 && (
        <section className="relative z-10 max-w-7xl mx-auto mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-2xl font-bold">Top Blogs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topBlogs.map(blog => (
              <BlogCard key={blog.id} blog={blog} featured={true} />
            ))}
          </div>
        </section>
      )}

      {/* Recent blogs section */}
      <section className="relative z-10 max-w-7xl mx-auto mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-2xl font-bold flex items-center">
            <Clock className="mr-2" size={24} />
            Recent Publications
          </h2>
          <Link 
            href="/blog/blogs" 
            className="flex items-center gap-x-2 text-white hover:text-purple-400 transition-colors group"
          >
            <span>View all</span>
            <ArrowRightCircle className="group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentBlogs.map(blog => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;