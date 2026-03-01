'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Clock, Eye, ChevronRight, BookOpen } from 'lucide-react';
import { estimateReadingTime } from '@/utils/readingTime';
import type { BlogCard as BlogCardType } from '@/types';

const GRADIENTS = [
  'from-indigo-600/10 to-fuchsia-600/10 border-indigo-500/20',
  'from-fuchsia-600/10 to-indigo-600/10 border-fuchsia-500/20',
  'from-purple-600/10 to-indigo-600/10 border-purple-500/20',
  'from-indigo-600/10 to-purple-600/10 border-indigo-500/20',
];

// Deterministic gradient based on blog id hash
const getGradient = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
};

const BlogCard: React.FC<{ blog: BlogCardType; featured?: boolean }> = ({ blog, featured }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = async () => {
    try {
      await fetch(`/api/views/${blog.id}`, { method: 'POST' });
      router.push(`/blog/viewer/${blog.id}`);
    } catch (error) {
      console.error('Failed to record view:', error);
      router.push(`/blog/viewer/${blog.id}`);
    }
  };

  const creationDate = new Date(blog.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const readingTime = blog.content ? estimateReadingTime(blog.content) : null;
  const gradient = getGradient(blog.id);
  const viewCount = Array.isArray(blog.views) ? blog.views.length : 0;
  const authorPhoto = blog.author.profilePhoto || `https://eu.ui-avatars.com/api/?name=${blog.author.firstName}+${blog.author.lastName || ''}&color=7F9CF5&background=EBF4FF`;

  return (
    <div 
      className={`bg-gradient-to-br ${gradient} border rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer group`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-5">
        {/* Author information and date */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Image
              src={authorPhoto}
              alt={`${blog.author.firstName}'s profile`}
              width={40}
              height={40}
              className="rounded-full border border-zinc-700/50"
            />
            <div>
              <h3 className="text-white text-sm font-medium">
                {blog.author.firstName} {blog.author.lastName}
              </h3>
              <div className="flex items-center text-zinc-400 text-xs gap-2">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {creationDate}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-zinc-400 text-xs">
            {readingTime && (
              <span className="flex items-center gap-1">
                <BookOpen size={12} />
                {readingTime} min
              </span>
            )}
            <span className="flex items-center gap-1">
              <Eye size={14} />
              {viewCount}
            </span>
          </div>
        </div>
        
        {/* Blog title */}
        <h2 className={`${featured ? 'text-2xl' : 'text-xl'} font-bold text-white mb-3 line-clamp-2 group-hover:text-indigo-300 transition-colors`}>
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