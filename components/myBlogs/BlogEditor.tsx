// components/BlogEditor.tsx
'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import 'react-quill/dist/quill.snow.css';
import { UserRound } from 'lucide-react';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const BlogEditor = ({ blogId, initialDescription, initialContent, initialTitle }) => {
  const [content, setContent] = useState(initialContent || '');
  const [description, setDescription] = useState(initialDescription || '');
  const [title, setTitle] = useState(initialTitle || '');
  const router = useRouter();

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/blog/${blogId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, content, published: true }),
      });

      if (res.ok) {
        alert('Blog published successfully!');
        router.push('/home')
      } else {
        const errorData = await res.json();
        throw new Error(errorData?.message || 'Failed to publish blog');
      }
    } catch (error) {
      console.error('Error publishing blog:', error);
      alert('Error publishing blog.');
    }
  };

  return (
    <div className=" max-h-full flex justify-center ">
      <div className="shadow-lg bg-gradient-to-br from-white/20 to-white/30 backdrop-filter backdrop-blur-lg
  border border-white/30 hover:border-white/50
  hover:shadow-2xl transition-all duration-300 transform p-8 rounded-lg w-full">
        <div className=' flex items-center mb-2'>
          <div className='p-2 text-white text-lg font-semibold'>
            Title:
          </div>
          <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Blog Title"
          className="w-full focus:border-b-sky-600 p-2 text-lg bg-transparent rounded border-none  placeholder-gray-300 focus:outline-none  text-white"
        />
        </div>
        
        <div className=' flex items-center mb-4'>
        <div className=' p-2 text-white text-lg font-semibold'>
          Description:
        </div>
        <input
          type="text"
          value={description}
          onChange={handleDescriptionChange}
          placeholder="What are you writing about?"
          className="w-full p-2 text-lg bg-transparent rounded border-none  placeholder-gray-300 focus:outline-none text-white"
        />
        </div>
        
        <ReactQuill value={content} onChange={handleContentChange} className= ' text-zinc-200 bg-gradient-to-br from-white/5 to-white/10 backdrop-filter backdrop-blur-lg outline-none' />
        <button onClick={handleSubmit} className="mt-4 px-4 py-2 rounded-lg shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
          Publish Blog
        </button>
      </div>
    </div>
  );
};

export default BlogEditor;
