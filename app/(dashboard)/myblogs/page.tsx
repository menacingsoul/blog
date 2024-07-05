import React from "react";
import { getUserByClerkID } from "@/utils/auth";
import { prisma } from '@/utils/db';
import UnpublishedBlogCard from "@/components/myBlogs/UnpublishedBlogCard";
import PublishedBlogCard from "@/components/myBlogs/PublishedBlogcard";

const myBlogPage = async () => {
  const user = getUserByClerkID();
  const id = (await user).id;

  const publishedBlogs = await prisma.blog.findMany({
    where: {
      authorId: id,
      published: true,
    },
    include: {
      author: {
        select: {
          firstName: true,
          lastName: true,
          profilePhoto: true,
        },
      },
    },
  });

  const unpublishedBlogs = await prisma.blog.findMany({
    where: {
      authorId: id,
      published: false,
    },
    include: {
      author: {
        select: {
          firstName: true,
          lastName: true,
          profilePhoto: true,
        },
      },
    },
  });

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-26 left-[32%] w-[55%] h-60 md:w-64 md:h-64 lg:w-[40%] lg:h-72 bg-purple-500 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-36 left-[29%] w-[45%] h-48 md:w-64 md:h-64 lg:w-[50%] lg:h-96 bg-yellow-500 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-200"></div>
        <div className="absolute top-6 left-[19%] w-[50%] h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-pink-500 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-400"></div>

        <div className="text-white p-4 font-bold text-2xl">
          Published Blogs
          <p className="text-sm">
            *Blogs once published cannot be edited/deleted
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 scrollbar-thin scrollbar-thumb-rounded">
          {publishedBlogs.length > 0 ? (
            publishedBlogs.map(blog => (
              <PublishedBlogCard key={blog.id} blog={blog} />
            ))
          ) : (
            <p className="text-white  p-4 font-xs">You have no published blogs.</p>
          )}
        </div>

        <div className="text-white p-4 font-bold text-2xl mt-4">
          Unpublished Blogs
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 scrollbar-thin scrollbar-thumb-rounded">
          {unpublishedBlogs.length > 0 ? (
            unpublishedBlogs.map(blog => (
              <UnpublishedBlogCard key={blog.id} blog={blog} />
            ))
          ) : (
            <p className="text-white p-4 font-xs">You have no unpublished blogs.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default myBlogPage;
