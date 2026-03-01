"use client";

import React, { useState, useEffect } from "react";
import { fetchBookmarks } from "@/utils/api";
import { Bookmark as BookmarkIcon, Loader2, BookOpen } from "lucide-react";
import BlogCard from "@/components/cards/BlogCard";
import type { Bookmark } from "@/types";

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const data = await fetchBookmarks();
      setBookmarks(data);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4 sm:px-6 lg:px-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <BookmarkIcon size={28} />
          Saved Posts
          <span className="text-sm font-normal text-gray-400">
            ({bookmarks.length})
          </span>
        </h1>

        {bookmarks.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">No saved posts yet</p>
            <p className="text-sm mt-1">
              Bookmark articles to read later. They&apos;ll appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark) => (
              <BlogCard key={bookmark.id} blog={bookmark.blog!} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;
