import React from 'react';
import Analysis from '@/components/blog/Analysis';
import { prisma } from '@/utils/db';
import { getUser } from '@/utils/auth';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const AnalyticsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const user = await getUser();
  const currentUserId = user.id;

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
          user: {
            select: {
              country: true,
            },
          },
        },
      },
      votes: true,
      comments: true,
    },
  });

  if (!blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Blog not found</h1>
          <p className="text-muted-foreground">This blog may have been deleted or doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  if (blog.author.id !== currentUserId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Unauthorized access</h1>
          <p className="text-muted-foreground">You are not authorized to view this page.</p>
          <Link href="/home" className="mt-4 inline-block text-primary hover:underline text-sm font-medium">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  // Views grouped by date
  const viewCountsByDate = blog.views.reduce((acc: Record<string, number>, view: any) => {
    const date = view.createdAt.toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const viewDate: string[] = Object.keys(viewCountsByDate);
  const viewCount: number[] = Object.values(viewCountsByDate);

  // Viewers by country
  const viewerCountry = blog.views.reduce((acc: Record<string, number>, view: any) => {
    const country = view.user?.country || 'Unknown';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[900px] mx-auto px-5 py-10">
        {/* Back link */}
        <Link
          href={`/blog/viewer/${id}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors group text-sm"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to story
        </Link>

        <Analysis
          title={blog.title}
          blogId={id}
          createdAt={blog.createdAt}
          totalViews={blog.views.length}
          viewCount={viewCount}
          viewDate={viewDate}
          viewerCountry={viewerCountry}
          totalComments={blog.comments.length}
          upVotes={blog.upVotes}
          downVotes={blog.downVotes}
        />
      </div>
    </div>
  );
};

export default AnalyticsPage;
