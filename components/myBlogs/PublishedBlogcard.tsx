'use client'

import Link from 'next/link';
import Image from 'next/image';
import { Clock, CheckCircle } from 'lucide-react';
import type { BlogCard } from '@/types';

const PublishedBlogCard: React.FC<{ blog: BlogCard }> = ({ blog }) => {
  const creationDate = new Date(blog.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const authorPhoto = blog.author.profilePhoto || `https://eu.ui-avatars.com/api/?name=${blog.author.firstName}+${blog.author.lastName || ''}&color=7F9CF5&background=EBF4FF`;

  return (
    <Link href={`/myblogs/viewer/${blog.id}`} className="block rounded-xl overflow-hidden shadow-lg 
      bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 
      hover:border-green-500/40 hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300">
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-green-500/20 text-green-300 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
            <CheckCircle size={12} />
            Published
          </span>
        </div>
        <h2 className="text-xl font-semibold mb-3 text-white line-clamp-2">{blog.title}</h2>
        <div className="flex items-center gap-2 mb-2">
          <Image alt="Author" src={authorPhoto} height={28} width={28} className="rounded-full border border-zinc-700" />
          <p className="text-zinc-400 text-sm">{blog.author.firstName} {blog.author.lastName}</p>
        </div>
        <p className="text-zinc-500 text-xs flex items-center gap-1 mb-2">
          <Clock size={12} />
          {creationDate}
        </p>
        <p className="text-zinc-400 text-sm line-clamp-2">{blog.description}</p>
      </div>
    </Link>
  );
}

export default PublishedBlogCard;
