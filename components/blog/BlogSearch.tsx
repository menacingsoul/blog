'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { SearchIcon, X } from 'lucide-react';

const BlogsSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    router.push(`/blog/blogs?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
    router.push('/blog/blogs');
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="relative flex items-center">
        <SearchIcon className="absolute left-4 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search blogs by title, content, or description..."
          className="w-full py-3 px-5 pl-12 pr-24 rounded-full bg-gray-800/70 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm transition-all placeholder-gray-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-24 text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}
        <button
          onClick={handleSearch}
          className="absolute right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-1.5 rounded-full text-sm font-medium hover:opacity-90 transition"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default BlogsSearch;
