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
      <div className=" h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      {/* <div className="absolute top-32 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-64 right-1/4 w-80 h-80 bg-pink-600 rounded-full filter blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>
      <div className="absolute bottom-32 left-1/3 w-72 h-72 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div> */}

        <div className="text-white p-4 font-bold text-2xl">
          Published Blogs
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
