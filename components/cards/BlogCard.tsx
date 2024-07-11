// components/BlogCard.tsx
'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState,useEffect } from 'react';
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

  return (
    <div onClick={handleClick} className="max-w-full h-56 rounded-xl overflow-hidden shadow-lg 
      bg-gradient-to-br from-white/20 to-white/30 backdrop-filter backdrop-blur-lg
      border border-white/30 hover:border-white/50
      hover:shadow-2xl transition-all duration-300 transform cursor-pointer">
      <div className="relative overflow-hidden rounded-lg">
      </div>
      <div className="p-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-1 text-white">{blog.title}</h2>
        <div className='flex mb-2 bg-yellow-50 font-semibold px-2 py-1 rounded-2xl w-fit items-center gap-1'>
          <Image
            alt="author image"
            src={blog.author.profilePhoto}
            height={30}
            width={30}
            className="rounded-full"
          />
          <p className="text-gray-900 text-xs">{blog.author.firstName} {blog.author.lastName}</p>
        </div>
        <h4 className='text-red-100 mb-1 text-sm'>{creationDate}</h4>
        <p className="text-gray-300 line-clamp-2">{blog.description}</p>
      </div>
    </div>
  );
}

export default BlogCard;
