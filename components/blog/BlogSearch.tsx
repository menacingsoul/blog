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
        <SearchIcon className="absolute left-4 text-muted-foreground" size={18} />
        <input
          type="text"
          placeholder="Search blogs by title, content, or description..."
          className="w-full py-3 px-5 pl-12 pr-24 rounded-full glass-card bg-white/60 dark:bg-white/5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-24 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        )}
        <button
          onClick={handleSearch}
          className="absolute right-2 bg-gradient-to-r from-primary to-fuchsia-500 text-primary-foreground px-5 py-1.5 rounded-full text-sm font-medium hover:opacity-90 transition shadow-lg shadow-primary/20"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default BlogsSearch;
