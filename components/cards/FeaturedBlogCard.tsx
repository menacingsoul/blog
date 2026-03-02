'use client'

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Clock, Eye, ChevronRight, BookOpen, TrendingUp } from 'lucide-react';
import { estimateReadingTime } from '@/utils/readingTime';
import type { BlogCard } from '@/types';
import { cn } from '@/lib/utils';

const FeaturedBlogCard: React.FC<{ blog: BlogCard }> = ({ blog }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const readingTime = estimateReadingTime(blog.content || '');

  const avatar = blog.author.profilePhoto || 
    `https://eu.ui-avatars.com/api/?name=${blog.author.firstName}+${blog.author.lastName || ''}&color=7F9CF5&background=EBF4FF`;

  return (
    <article
      onClick={() => router.push(`/blog/viewer/${blog.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative flex flex-col md:flex-row rounded-2xl overflow-hidden cursor-pointer transition-all duration-500",
        "bg-white/60 dark:bg-white/5 backdrop-blur-xl",
        "border border-black/5 dark:border-white/10",
        "shadow-md hover:shadow-2xl dark:shadow-none",
        "hover:-translate-y-1"
      )}
    >
      {/* Image */}
      <div className="relative w-full md:w-2/5 h-56 md:h-auto overflow-hidden">
        {blog.imageUrl ? (
          <Image
            src={blog.imageUrl}
            fill
            alt={blog.title}
            className={cn(
              "object-cover transition-transform duration-700",
              isHovered && "scale-110"
            )}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-fuchsia-400/30 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-primary/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/10 dark:to-black/30" />

        {/* Featured badge */}
        <div className="absolute top-4 left-4 bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1.5 shadow-lg">
          <TrendingUp className="w-3.5 h-3.5" />
          Featured
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 md:p-8 justify-center">
        <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {readingTime} min read
          </span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {blog._count?.views ?? blog.views?.length ?? 0} views
          </span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors duration-300">
          {blog.title}
        </h2>

        <p className="text-sm text-muted-foreground line-clamp-3 mb-6">
          {blog.description || 'No description available.'}
        </p>

        {/* Author Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={avatar}
              height={40}
              width={40}
              alt={blog.author.firstName}
              className="rounded-full ring-2 ring-primary/20"
            />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {blog.author.firstName} {blog.author.lastName || ''}
              </p>
              <p className="text-xs text-muted-foreground">Author</p>
            </div>
          </div>

          <div className={cn(
            "flex items-center gap-1.5 text-sm font-medium text-primary transition-transform duration-300",
            isHovered && "translate-x-1"
          )}>
            Read more
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </article>
  );
};

export default FeaturedBlogCard;