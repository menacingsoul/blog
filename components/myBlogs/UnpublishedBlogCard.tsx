'use client'

import Link from 'next/link';
import Image from 'next/image';
import { Clock, FileEdit } from 'lucide-react';
import type { BlogCard } from '@/types';
import { cn } from '@/lib/utils';

const UnpublishedBlogCard: React.FC<{ blog: BlogCard }> = ({ blog }) => {
  const formattedDate = new Date(blog.updatedAt).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <Link href={`/myblogs/editor/${blog.id}`}>
      <div className={cn(
        "group rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer",
        "bg-white/60 dark:bg-white/5 backdrop-blur-xl",
        "border border-black/5 dark:border-white/10 border-dashed",
        "shadow-sm hover:shadow-xl dark:shadow-none hover:-translate-y-1"
      )}>
        {blog.imageUrl && (
          <div className="relative h-40 overflow-hidden">
            <Image src={blog.imageUrl} fill alt={blog.title} className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <FileEdit size={14} className="text-amber-500" />
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Draft</span>
          </div>
          <h3 className="text-foreground font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {blog.title || 'Untitled Draft'}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{blog.description || 'No description yet'}</p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock size={12} />
            <span>Last edited {formattedDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default UnpublishedBlogCard;
