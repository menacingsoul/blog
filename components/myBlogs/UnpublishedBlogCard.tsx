'use client'

import Link from 'next/link';
import Image from 'next/image';
import { Clock, FileEdit } from 'lucide-react';
import type { BlogCard } from '@/types';

const UnpublishedBlogCard: React.FC<{ blog: BlogCard }> = ({ blog }) => {
  const creationDate = new Date(blog.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const authorPhoto = blog.author.profilePhoto || `https://eu.ui-avatars.com/api/?name=${blog.author.firstName}+${blog.author.lastName || ''}&color=7F9CF5&background=EBF4FF`;

  return (
    <Link href={`/myblogs/editor/${blog.id}`} className="block rounded-xl overflow-hidden shadow-lg 
      bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 
      hover:border-yellow-500/40 hover:shadow-xl hover:shadow-yellow-500/5 transition-all duration-300">
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-yellow-500/20 text-yellow-300 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
            <FileEdit size={12} />
            Draft
          </span>
        </div>
        <h2 className="text-xl font-semibold mb-3 text-white line-clamp-2">
          {blog.title || 'Untitled Blog'}
        </h2>
        <div className="flex items-center gap-2 mb-2">
          <Image alt="Author" src={authorPhoto} height={28} width={28} className="rounded-full border border-zinc-700" />
          <p className="text-zinc-400 text-sm">{blog.author.firstName} {blog.author.lastName}</p>
        </div>
        <p className="text-zinc-500 text-xs flex items-center gap-1 mb-2">
          <Clock size={12} />
          {creationDate}
        </p>
        <p className="text-zinc-400 text-sm line-clamp-2">{blog.description || 'No description yet'}</p>
      </div>
    </Link>
  );
}

export default UnpublishedBlogCard;
