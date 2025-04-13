'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Clock, Eye, ChevronRight } from 'lucide-react';
import BlogCardSkeleton from '../BlogCardSkeleton';

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

const BlogCard: React.FC<{ blog: Blog }> = ({ blog }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000); // Simulate loading time
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <BlogCardSkeleton />;

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

  // Generate random background gradient for blog cards
  const gradients = [
    'from-indigo-600/10 to-fuchsia-600/10 border-indigo-500/20',
    'from-fuchsia-600/10 to-indigo-600/10 border-fuchsia-500/20',
    'from-purple-600/10 to-indigo-600/10 border-purple-500/20',
    'from-indigo-600/10 to-purple-600/10 border-indigo-500/20'
  ];
  
  const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

  return (
    
    <div 
      className={`bg-gradient-to-br ${randomGradient} border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-5">
        {/* Author information and date */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Image
              src={blog.author.profilePhoto}
              alt={`${blog.author.firstName}'s profile`}
              width={40}
              height={40}
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
          </div>
          
          <div className="flex items-center text-zinc-400 text-xs">
            <Eye size={14} className="mr-1" />
            <span>{blog.views ? (Array.isArray(blog.views) ? blog.views.length : 1) : 0}</span>
          </div>
        </div>
        
        {/* Blog title */}
        <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-indigo-300 transition-colors">
          {blog.title}
        </h2>
        
        {/* Blog description */}
        <p className="text-zinc-300 text-sm mb-4 line-clamp-3">
          {blog.description}
        </p>
        
        {/* Read more button with animation */}
        <div className="flex justify-end">
          <button 
            className={`text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center transition-all duration-300 ${
              isHovered ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-70'
            }`}
          >
            Read more
            <ChevronRight size={16} className={`transition-all duration-300 ${isHovered ? 'ml-2' : 'ml-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;