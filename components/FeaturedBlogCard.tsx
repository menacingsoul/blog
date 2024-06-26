// components/BlogCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image'; // Using next/image for better image optimization



function FeaturedBlogCard({ blog }) {
  return (
    <Link href={`/blog/viewer/${blog.id}`} className=" h-full cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-[#E2DFD0]/20 to-[#E2DFD0]/30 backdrop-filter backdrop-blur-lg
      border border-[#E2DFD0]/30 shadow-lg hover:shadow-2xl transition-all duration-300
      hover:bg-gradient-to-b flex items-center mb-4">
        <div className='flex flex-row p-2 '>
        <div className="relative  overflow-hidden rounded-lg">
        <Image 
          src="/blog.jpg"
          alt={blog.title} 
          width={400} // Replace with your desired width
          height={250} // Replace with your desired height
          className="object-cover" 
        />
      </div>
      <div className="p-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-2 text-white">{blog.title}</h2>
        <p className="text-gray-900 text-xs mb-2 bg-yellow-50 font-semibold px-2 py-1 rounded-xl w-fit ">{blog.author.firstName}</p>
        <p className="text-gray-300 line-clamp-2">{blog.description}</p>
      </div>
      </div>
    </Link>
    
  );
}

export default FeaturedBlogCard;