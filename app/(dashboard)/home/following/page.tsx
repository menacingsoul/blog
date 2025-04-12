import React from 'react'
import { prisma } from '@/utils/db'
import { getUserByClerkID } from '@/utils/auth'
import BlogCard from '@/components/cards/BlogCard'

const FollowingBlog = async() => {
    const currUserId = (await getUserByClerkID()).id;
    const blogs =await prisma.blog.findMany({
        where:{
            author:{
                followers:{
                    some:{
                        id : currUserId
                    }
                }
            },
            published:true,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-26 left-[32%] w-[55%] h-60 md:w-64 md:h-64 lg:w-[40%] lg:h-72 bg-purple-500 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-36 left-[29%] w-[45%] h-48 md:w-64 md:h-64 lg:w-[50%] lg:h-96 bg-yellow-500 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-200"></div>
      <div className="absolute top-6 left-[19%] w-[50%] h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-pink-500 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-400"></div>
        

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 scrollbar-thin scrollbar-thumb-rounded">
        {blogs.map(blog => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>

      </div>
    
  )
}

export default FollowingBlog