// components/BlogCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image'; 
import { useRouter } from 'next/navigation';

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




const FeaturedBlogCard: React.FC<{ blog: Blog }> = ({ blog }) => {
  const router = useRouter();
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
    <div onClick={handleClick} className=" h-full cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-[#E2DFD0]/20 to-[#E2DFD0]/30 backdrop-filter backdrop-blur-lg
      border border-[#E2DFD0]/30 shadow-lg hover:shadow-2xl transition-all duration-300
      hover:bg-gradient-to-b flex items-center mb-4">
        <div className='flex flex-col sm:flex-row p-2 '>
        <div className="relative  overflow-hidden rounded-lg">
        <Image 
          src="/blog1.jpg"
          alt={blog.title} 
          width={400} 
          height={250}
          className="object-cover" 
        />
      </div>
      <div className="p-6">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-white line-clamp-1">{blog.title}</h2>
        <div className='flex mb-2 bg-yellow-50 font-semibold px-2 py-1 rounded-2xl w-fit items-center gap-1'>
        <Image
        alt="author image"
        src={blog.author.profilePhoto}
        height={30}
        width={30}
        className=" rounded-full"
        />
        <p className="text-gray-900 sm:text-sm text-xs  ">{blog.author.firstName} {blog.author.lastName}</p>
        </div>
        <h4 className=' text-red-100 mb-1 md:text-lg text-sm'>{creationDate}</h4>
        
        <p className="text-gray-300 line-clamp-2 md:text-xl">{blog.description}</p>
      </div>
      </div>
    </div>
    
  );
}

export default FeaturedBlogCard;
