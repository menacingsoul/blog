"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const HomeSearch = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/blog/blogs?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Search articles, topics, authors..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-full py-3 px-5 pl-12 rounded-full bg-gray-800/70 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm transition-all"
        />
        <Search className="absolute left-4 text-gray-400" size={18} />
        <button
          onClick={handleSearch}
          className="absolute right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:opacity-90 transition"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default HomeSearch;
