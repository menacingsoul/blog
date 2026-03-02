'use client'

import Link from 'next/link';
import Image from 'next/image';
import { Clock, CheckCircle } from 'lucide-react';
import type { BlogCard } from '@/types';
import { cn } from '@/lib/utils';

const PublishedBlogCard: React.FC<{ blog: BlogCard }> = ({ blog }) => {
  const formattedDate = new Date(blog.updatedAt).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <Link href={`/myblogs/viewer/${blog.id}`}>
      <div className={cn(
        "group rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer",
        "bg-white/60 dark:bg-white/5 backdrop-blur-xl",
        "border border-black/5 dark:border-white/10",
        "shadow-sm hover:shadow-xl dark:shadow-none hover:-translate-y-1"
      )}>
        {blog.imageUrl && (
          <div className="relative h-40 overflow-hidden">
            <Image src={blog.imageUrl} fill alt={blog.title} className="object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={14} className="text-emerald-500" />
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Published</span>
          </div>
          <h3 className="text-foreground font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {blog.title || 'Untitled'}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{blog.description || 'No description'}</p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock size={12} />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PublishedBlogCard;
