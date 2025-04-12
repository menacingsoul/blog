import React from 'react';
import Analysis from '@/components/myBlogs/Analysis';
import { prisma } from '@/utils/db';
import { getUserByClerkID } from '@/utils/auth';

const AnalyticsPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const user = await getUserByClerkID();
  const currentUserId = user.id;

  // Fetch the blog data on the server side
  const blog = await prisma.blog.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profilePhoto: true,
          country: true,
        },
      },
      views: {
        include: {
          user: true,
        },
      },
      votes: {
        include: {
          user: true,
        },
      },
      comments: true,
    },
  });

  if (!blog) {
    return <div>Blog not found</div>;
  }

  if (blog.author.id !== currentUserId) {
    return <div>Unauthorized access</div>;
  }

  // Prepare data for the Analysis component
  const viewCountsByDate = blog.views.reduce((acc, view) => {
    const date = view.createdAt.toISOString().split('T')[0];
    if (acc[date]) {
      acc[date]++;
    } else {
      acc[date] = 1;
    }
    return acc;
  }, {});

  const viewDate = Object.keys(viewCountsByDate);
  const viewCount = Object.values(viewCountsByDate);

  const comments = blog.comments.map(comment => comment.id).length;

  const viewerCountry = blog.views.reduce((acc, view) => {
    const country = view.user.country;
    if (acc[country]) {
      acc[country]++;
    } else {
      acc[country] = 1;
    }
    return acc;
  }, {});

  const upVotes = blog.upVotes;
  const downVotes = blog.downVotes;

  return (
    <div className='bg-gradient-to-br from-gray-900 to-black h-screen overflow-y-scroll'>
       <div className="absolute top-32 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-64 right-1/4 w-80 h-80 bg-pink-600 rounded-full filter blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>
      <div className="absolute bottom-32 left-1/3 w-72 h-72 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>

        <div className="items-center p-6">
      <Analysis
        title={blog.title}
        viewCount={viewCount}
        viewerCountry={viewerCountry}
        viewDate={viewDate}
        comments={new Array(viewDate.length).fill(comments)}
        upVotes = {upVotes}
        downVotes= {downVotes}
      />
    </div>
    </div>
    
  );
};

export default AnalyticsPage;
