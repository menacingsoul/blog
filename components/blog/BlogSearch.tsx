'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { SearchIcon } from 'lucide-react';

const BlogsSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [searchBy, setSearchBy] = useState('name'); // Default search by name

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (searchBy === 'date') params.set('date', new Date().toISOString()); // Placeholder for date search logic
    router.push(`/blog/blogs?${params.toString()}`);
  };

  return (
    <div className='flex items-center w-full space-x-1 mb-2'>
      <div className="relative w-full">
        <input
          type={`${searchBy === 'name' ? 'text' : 'date'}`}
          placeholder={`Search blogs... ${searchBy === 'name' ? '' : 'date'}`}
          className="w-full h-12 p-2 pl-10 text-lg bg-gray-600/50 bg-opacity-80 rounded-2xl placeholder-gray-300 text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleSearch}
        />
        <div className="absolute inset-y-0 left-3 flex items-center text-white">
          <SearchIcon />
        </div>
      </div>
      <div className="relative">
       
      </div>
      <button onClick={handleSearch} className="p-2 h-12 bg-indigo-600 z-50 text-white rounded-2xl">
        Search
      </button>
    </div>
  );
};

export default BlogsSearch;
