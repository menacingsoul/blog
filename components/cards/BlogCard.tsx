'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Clock, Eye, ChevronRight, BookOpen } from 'lucide-react';
import { estimateReadingTime } from '@/utils/readingTime';
import type { BlogCard as BlogCardType } from '@/types';
import { cn } from '@/lib/utils';

const BlogCard: React.FC<{ blog: BlogCardType }> = ({ blog }) => {
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
        "group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-500",
        "bg-white/60 dark:bg-white/5 backdrop-blur-xl",
        "border border-black/5 dark:border-white/10",
        "shadow-sm hover:shadow-xl dark:shadow-none",
        "hover:-translate-y-1"
      )}
    >
      {/* Image */}
      <div className="relative w-full h-48 overflow-hidden">
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
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-fuchsia-400/20 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-primary/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Reading time badge */}
        <div className="absolute top-3 right-3 glass rounded-full px-3 py-1 text-xs font-medium text-white flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          {readingTime} min
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h2 className="text-lg font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-300">
          {blog.title}
        </h2>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
          {blog.description || 'No description available.'}
        </p>

        {/* Author Row */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
          <div className="flex items-center gap-2.5">
            <Image
              src={avatar}
              height={32}
              width={32}
              alt={blog.author.firstName}
              className="rounded-full ring-2 ring-primary/20"
            />
            <div>
              <p className="text-sm font-medium text-foreground">
                {blog.author.firstName} {blog.author.lastName || ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground text-xs">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {blog._count?.views ?? blog.views?.length ?? 0}
            </span>
            <ChevronRight className={cn(
              "w-4 h-4 transition-transform duration-300",
              isHovered && "translate-x-1 text-primary"
            )} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;