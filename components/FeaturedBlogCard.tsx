// components/BlogCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image'; 
interface Blog {
  id: string;
  title: string;
  description: string;
  author: {
    profilePhoto: string;
    firstName: string;
    lastName: string;
  };
  
}


const FeaturedBlogCard: React.FC<{ blog: Blog }> = ({ blog }) => {
  return (
    <Link href={`/blog/viewer/${blog.id}`} className=" h-full cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-[#E2DFD0]/20 to-[#E2DFD0]/30 backdrop-filter backdrop-blur-lg
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
        <h2 className="text-xl md:text-2xl font-semibold mb-2 text-white">{blog.title}</h2>
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
        
        <p className="text-gray-300 line-clamp-2">{blog.description}</p>
      </div>
      </div>
    </Link>
    
  );
}

export default FeaturedBlogCard;
