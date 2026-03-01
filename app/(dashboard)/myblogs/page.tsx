import React from "react";
import { getUserByClerkID } from "@/utils/auth";
import { prisma } from '@/utils/db';
import UnpublishedBlogCard from "@/components/myBlogs/UnpublishedBlogCard";
import PublishedBlogCard from "@/components/myBlogs/PublishedBlogcard";
import { FileText, FileEdit } from "lucide-react";

const myBlogPage = async () => {
  const user = await getUserByClerkID();
  const id = user.id;

  const publishedBlogs = await prisma.blog.findMany({
    where: { authorId: id, published: true },
    include: {
      author: {
        select: {
          firstName: true,
          lastName: true,
          profilePhoto: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  const unpublishedBlogs = await prisma.blog.findMany({
    where: { authorId: id, published: false },
    include: {
      author: {
        select: {
          firstName: true,
          lastName: true,
          profilePhoto: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4 sm:px-6 lg:px-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Published Blogs */}
        <div className="mb-12">
          <h2 className="text-white font-bold text-2xl flex items-center gap-2 mb-6">
            <FileText size={24} className="text-green-400" />
            Published Blogs
            <span className="text-sm font-normal text-gray-400">({publishedBlogs.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedBlogs.length > 0 ? (
              publishedBlogs.map(blog => (
                <PublishedBlogCard key={blog.id} blog={blog} />
              ))
            ) : (
              <div className="col-span-full text-gray-400 bg-gray-800/30 rounded-xl p-8 text-center border border-gray-700/30">
                <FileText size={40} className="mx-auto mb-3 opacity-30" />
                <p>No published blogs yet. Start writing and publish your first blog!</p>
              </div>
            )}
          </div>
        </div>

        {/* Unpublished Blogs / Drafts */}
        <div>
          <h2 className="text-white font-bold text-2xl flex items-center gap-2 mb-6">
            <FileEdit size={24} className="text-yellow-400" />
            Drafts
            <span className="text-sm font-normal text-gray-400">({unpublishedBlogs.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unpublishedBlogs.length > 0 ? (
              unpublishedBlogs.map(blog => (
                <UnpublishedBlogCard key={blog.id} blog={blog} />
              ))
            ) : (
              <div className="col-span-full text-gray-400 bg-gray-800/30 rounded-xl p-8 text-center border border-gray-700/30">
                <FileEdit size={40} className="mx-auto mb-3 opacity-30" />
                <p>No drafts. All your work is published!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default myBlogPage;
