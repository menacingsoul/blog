import React from 'react';
import Analysis from '@/components/blog/Analysis';
import { prisma } from '@/utils/db';
import { getUser } from '@/utils/auth';

const AnalyticsPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const user = await getUser();
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
    return (
      <>
      <div className='bg-gradient-to-br from-gray-900 to-black h-screen overflow-y-scroll'>
        <div className="items-center p-6 z-50">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">Unauthorized access</h1>
              <p className="text-white">You are not authorized to view this page</p>
            </div>
          </div>
        </div>
      </div>
      </>
    )
  }

  // Prepare data for the Analysis component
  const viewCountsByDate = blog.views.reduce((acc: Record<string, number>, view: any) => {
    const date = view.createdAt.toISOString().split('T')[0];
    if (acc[date]) {
      acc[date]++;
    } else {
      acc[date] = 1;
    }
    return acc;
  }, {});

  const viewDate: string[] = Object.keys(viewCountsByDate);
  const viewCount: number[] = Object.values(viewCountsByDate);

  const comments: number = blog.comments.length;

  const viewerCountry = blog.views.reduce((acc: Record<string, number>, view: any) => {
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
