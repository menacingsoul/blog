// components/BlogCard.tsx
'use client'

import Link from 'next/link';

function UnpublishedBlogCard({ blog }) {
  return (
    <Link href={`/myblogs/editor/${blog.id}`} className=" max-w-full h-56 rounded-xl overflow-hidden shadow-lg 
  bg-gradient-to-br from-white/20 to-white/30 backdrop-filter backdrop-blur-lg
  border border-white/30 hover:border-white/50
  hover:shadow-2xl transition-all duration-300 transform ">
      <div className="relative overflow-hidden rounded-lg">
      </div>
      <div className="p-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-2 text-white">{blog.title}</h2>
        <p className="text-gray-900 text-xs mb-2 bg-yellow-50 font-semibold px-2 py-1 rounded-xl w-fit  ">{blog.author.firstName} {blog.author.lastName}</p>
        <p className="text-gray-300 line-clamp-2 ">{blog.description}</p>
      </div>
    </Link>
  );
}

export default UnpublishedBlogCard;
