import React from 'react'
import { prisma } from '@/utils/db'
import { getUser } from '@/utils/auth'
import BlogCard from '@/components/cards/BlogCard'
import { Users } from 'lucide-react'

const FollowingBlog = async() => {
    const currUserId = (await getUser()).id;
    const blogs = await prisma.blog.findMany({
        where: {
            author: {
                followers: {
                    some: { id: currUserId }
                }
            },
            published: true,
        },
        include: {
            author: {
              select: {
                firstName: true,
                lastName: true,
                profilePhoto: true,
              },
            }
          },
    })

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 pb-20 md:pb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
          <Users size={28} className="text-primary" />
          Following Feed
        </h1>
        
        {blogs.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground glass-card rounded-2xl">
            <Users size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">No posts from people you follow</p>
            <p className="text-sm mt-1">Follow authors to see their posts here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FollowingBlog