// components/BlogViewer.tsx
'use client'
import React, { useState } from 'react';
import parse from 'html-react-parser';
import Image from 'next/image';

interface BlogViewerProps {
  title: string;
  content: string;
  imageUrl:string;
}

const BlogPreviewer: React.FC<BlogViewerProps> = ({ 
   title, content,imageUrl
}) => {
  return (
    <>
   
    <div className='md:flex flex-row '>
      <div className="w-full p-2 shadow-lg rounded max-h-screen overflow-y-scroll scrollbar-thumb-rounded">
        <div className='flex justify-between items-center mb-4'>
          <h1 className="md:text-3xl text-2xl mt-1 text-white font-bold">{title}</h1>
        </div>
        <Image
        src={imageUrl}
        unoptimized={true}
        height={100}
        width={100}
        alt='blog_image'
        className='w-full bg-white p-3 rounded mb-2'
        /><div className="prose text-gray-200 prose-headings:text-white prose-strong:text-white prose-blockquote:text-white w-full" >
  {parse(content)}
</div>

       


      </div>
    </div>
    </>
  );
};

export default BlogPreviewer;
