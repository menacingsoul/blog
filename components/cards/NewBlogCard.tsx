"use client";
import React, { useState } from "react";
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
        glass-card bg-primary/5 dark:bg-primary/10 border border-primary/20
        hover:border-primary/40 hover:shadow-primary/10 hover:shadow-xl transition-all duration-300 flex 
        items-center gap-2 text-foreground font-medium ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
        onClick={createBlogHandler}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <PlusIcon className="w-5 h-5 text-primary" />
        )}
        {isLoading ? "Creating..." : "Create New Blog"}
      </button>
    </div>
  );
};

export default NewBlogCard;
