"use client";
import React from "react";
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { createBlog } from "../utils/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const NewBlogCard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const createBlogHandler = async () => {
    try {
      const newBlog = await createBlog();
      setIsLoading(true);
      router.push(`/blog/editor/${newBlog.id}`);
    } catch (error) {
      alert("Error creating blog.");
      toast.error("Error creating blog");
      console.error(error);
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
       <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
       <div className="bg-white rounded-lg p-8 shadow-md">
       <Loader2 className="mr-2 h-20 w-20 animate-spin" /> 
       </div>
     </div>
    )}

      <div
        className="w-fit h-fit cursor-pointer rounded-xl overflow-hidden shadow-lg p-4 
        bg-gradient-to-br from-white/20 to-white/30 backdrop-filter backdrop-blur-lg border 
        border-white/30 hover:border-white/50 hover:shadow-2xl transition-all duration-300 transform flex 
        items-center text-white"
        onClick={createBlogHandler}
      >
        <PlusIcon className="w-6 h-6 " />
        Create Blog
      </div>
    </>
  );
};

export default NewBlogCard;
