"use client";
import React from "react";
import { useState } from "react";
import { PlusIcon, Loader2 } from "lucide-react";
import { createBlog } from "@/utils/api";
import { useRouter } from "next/navigation";

const NewBlogCard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const createBlogHandler = async () => {
    setIsLoading(true);
    try {
      const newBlog = await createBlog();
      router.push(`/blog/editor/${newBlog.id}`);
    } catch (error) {
      console.error(error);
      alert("Error creating blog. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center mb-8">
      <button
        className={`cursor-pointer rounded-xl overflow-hidden shadow-lg px-6 py-3
        bg-gradient-to-r from-indigo-600/20 to-fuchsia-600/20 backdrop-filter backdrop-blur-lg border 
        border-indigo-500/30 hover:border-indigo-500/50 hover:shadow-indigo-500/10 hover:shadow-xl transition-all duration-300 flex 
        items-center gap-2 text-white font-medium ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
        onClick={createBlogHandler}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <PlusIcon className="w-5 h-5" />
        )}
        {isLoading ? "Creating..." : "Create New Blog"}
      </button>
    </div>
  );
};

export default NewBlogCard;
