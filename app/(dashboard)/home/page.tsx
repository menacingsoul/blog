// app/blog/page.tsx
import { prisma } from '@/utils/db';
import BlogCard from '@/components/cards/BlogCard';
import FeaturedBlogCard from '@/components/cards/FeaturedBlogCard';
import NewBlogCard from '@/components/cards/NewBlogCard';
import Link from 'next/link';
import { ArrowRightCircle, TrendingUp, Clock, Search } from 'lucide-react';

export const revalidate = 3600; // Revalidate this page every hour

const BlogPage = async () => {
  // Fetch blogs using Prisma
  const mostViewedBlogs = await prisma.blog.findMany({
    where: {
      published: true,
    },
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
    orderBy: {
      upVotes: 'desc',
    },
    take: 5, // Get top 5 for more featured content options
  });

  const recentBlogs = await prisma.blog.findMany({
    where: {
      published: true,
    },
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
    orderBy: {
      createdAt: 'desc',
    },
    take: 6, // Show 6 recent blogs instead of 3
  });

  const featuredBlog = mostViewedBlogs.length > 0 ? mostViewedBlogs[0] : null;
  const topBlogs = mostViewedBlogs.slice(1, 3); // Get next 2 popular blogs after featured

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background blobs */}
      {/* <div className="absolute top-32 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-64 right-1/4 w-80 h-80 bg-pink-600 rounded-full filter blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>
      <div className="absolute bottom-32 left-1/3 w-72 h-72 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div> */}

      {/* Hero section */}
      <section className="relative z-10 max-w-7xl mx-auto mb-12 pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Blog Verse</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Discover insightful articles, stories, and perspectives from our community of writers.
          </p>
        </div>

        {/* Search bar
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative flex items-center">
            <input 
              type="text" 
              placeholder="Search articles..." 
              className="w-full py-3 px-5 pl-12 rounded-full bg-gray-800/70 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
            />
            <Search className="absolute left-4 text-gray-400" size={18} />
            <button className="absolute right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:opacity-90 transition">
              Search
            </button>
          </div>
        </div> */}

        {/* Create New Blog Card */}
        <NewBlogCard />
      </section>

      {/* Featured blog section */}
      <section className="relative z-10 max-w-7xl mx-auto mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-2xl font-bold flex items-center">
            <TrendingUp className="mr-2" size={24} />
            Featured Post
          </h2>
        </div>
        
        {featuredBlog && <FeaturedBlogCard blog={featuredBlog} />}
      </section>

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

      {/* Newsletter subscription */}
      {/* <section className="relative z-10 max-w-5xl mx-auto mt-20 mb-12">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-800 shadow-xl">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Stay updated with the latest posts</h3>
            <p className="text-gray-300">Subscribe to our newsletter and never miss new content</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-grow py-3 px-4 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition text-white py-3 px-6 rounded-lg font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default BlogPage;