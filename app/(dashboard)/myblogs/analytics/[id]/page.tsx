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
        <div className="items-center p-6 z-50">
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
