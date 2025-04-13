// components/BlogCardSkeleton.tsx
'use client'
import React from 'react';

const BlogCardSkeleton: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-zinc-800/40 to-zinc-900/40 border border-zinc-700/20 rounded-xl overflow-hidden shadow-lg animate-pulse">
      <div className="p-5">
        {/* Author information and date skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-700/50"></div>
            <div>
              <div className="h-4 w-32 bg-zinc-700/50 rounded"></div>
              <div className="h-3 w-24 bg-zinc-700/50 rounded mt-2"></div>
            </div>
          </div>
          
          <div className="h-3 w-10 bg-zinc-700/50 rounded"></div>
        </div>
        
        {/* Blog title skeleton */}
        <div className="h-7 bg-zinc-700/50 rounded mb-3"></div>
        
        {/* Blog description skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-zinc-700/50 rounded"></div>
          <div className="h-4 bg-zinc-700/50 rounded"></div>
          <div className="h-4 w-3/4 bg-zinc-700/50 rounded"></div>
        </div>
        
        {/* Read more button skeleton */}
        <div className="flex justify-end">
          <div className="h-4 w-20 bg-zinc-700/50 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default BlogCardSkeleton;