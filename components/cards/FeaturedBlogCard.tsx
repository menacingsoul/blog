'use client'

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Clock, Eye, ChevronRight } from 'lucide-react';
import FeaturedBlogCardSkeleton from '../FeaturedBlogCardSkeleton';

interface View {
  id: string;
  blog: Blog;
}

interface Blog {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  views: View;
  author: {
    profilePhoto: string;
    firstName: string;
    lastName: string;
  };
}

const FeaturedBlogCard: React.FC<{ blog: Blog }> = ({ blog }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000); // Simulate loading time
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <FeaturedBlogCardSkeleton />;

  const handleClick = async () => {
    try {
      await fetch(`/api/views/${blog.id}`, {
        method: 'POST',
      });
      router.push(`/blog/viewer/${blog.id}`);
    } catch (error) {
      console.error('Failed to record view:', error);
    }
  };

  const creationDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Kolkata',
  });

  return (
    <div 
      className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/30 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col md:flex-row"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left side content for featured blog */}
      <div className="p-6 md:p-8 flex-1">
        <div className="flex items-center gap-3 mb-4">
          <Image
            src={blog.author.profilePhoto}
            alt={`${blog.author.firstName}'s profile`}
            width={48}
            height={48}
            className="rounded-full border border-zinc-700/50"
          />
          <div>
            <h3 className="text-white text-sm font-medium">
              {blog.author.firstName} {blog.author.lastName}
            </h3>
            <div className="flex items-center text-zinc-400 text-xs">
              <Clock size={12} className="mr-1" />
              <span>{creationDate}</span>
            </div>
          </div>
          
          <div className="ml-auto flex items-center text-zinc-400 text-xs">
            <Eye size={14} className="mr-1" />
            <span>{blog.views ? (Array.isArray(blog.views) ? blog.views.length : 1) : 0}</span>
          </div>
        </div>
        
        {/* Featured badge */}
        <div className="mb-3">
          <span className="bg-indigo-600/30 text-indigo-300 text-xs px-3 py-1 rounded-full font-medium">
            Featured
          </span>
        </div>
        
        {/* Blog title - larger for featured */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 line-clamp-3 group-hover:text-indigo-300 transition-colors">
          {blog.title}
        </h2>
        
        {/* Blog description - more space for featured */}
        <p className="text-zinc-300 text-sm md:text-base mb-6 line-clamp-4 md:line-clamp-5">
          {blog.description}
        </p>
        
        {/* Read more button with animation */}
        <div className="flex justify-end">
          <button 
            className={`text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center transition-all duration-300 ${
              isHovered ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-70'
            }`}
          >
            Read full article
            <ChevronRight size={16} className={`transition-all duration-300 ${isHovered ? 'ml-2' : 'ml-1'}`} />
          </button>
        </div>
      </div>
      
      {/* Right side with decorative gradient for featured blogs */}
      <div className="hidden md:block w-1/3 bg-gradient-to-br from-indigo-800/20 to-purple-700/20 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-indigo-500/20 backdrop-blur-sm flex items-center justify-center">
            <ChevronRight size={28} className="text-indigo-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBlogCard;