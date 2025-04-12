// components/BlogCard.tsx
'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import BlogCardSkeleton from '../BlogCardSkeleton';
interface Blog {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    author: {
      profilePhoto: string;
      firstName: string;
      lastName: string;
    };
    
  }
  
  
  const UnpublishedBlogCard: React.FC<{ blog: Blog }> = ({ blog }) => {
    const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000); // Simulate loading time
    return () => clearTimeout(timer);
  }, []);

  const creationDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Kolkata',
  });

  if (isLoading) return <BlogCardSkeleton />;
  return (
    <Link href={`/myblogs/editor/${blog.id}`} className=" max-w-full h-56 rounded-xl overflow-hidden shadow-lg 
  bg-gradient-to-br from-white/20 to-white/30 backdrop-filter backdrop-blur-lg
  border border-white/30 hover:border-white/50
  hover:shadow-2xl transition-all duration-300 transform ">
      <div className="relative overflow-hidden rounded-lg">
      </div>
      <div className="p-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-2 text-white">{blog.title}</h2>
        <div className='flex mb-1 bg-yellow-50 font-semibold px-1 py-1 rounded-2xl w-fit items-center gap-1'>
        <Image
        alt="author image"
        src={blog.author.profilePhoto}
        height={30}
        width={30}
        className=" rounded-full"
        />
        <p className="text-gray-900 text-xs  ">{blog.author.firstName} {blog.author.lastName}</p>
        </div>
        <p className=" text-red-100 text-xs mb-2">{creationDate}</p>
        <p className="text-gray-300 line-clamp-2 ">{blog.description}</p>
      </div>
    </Link>
  );
}

export default UnpublishedBlogCard;
