import BlogViewer from "@/components/blog/BlogViewer";
import ReadingProgress from "@/components/blog/ReadingProgress";
import { prisma } from "@/utils/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { estimateReadingTime } from "@/utils/readingTime";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

// Dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const blog = await prisma.blog.findUnique({
    where: { id: params.id },
    select: { title: true, description: true, imageUrl: true, author: { select: { firstName: true, lastName: true } } },
  });

  if (!blog) return { title: "Blog Not Found" };

  return {
    title: `${blog.title} — BlogVerse`,
    description: blog.description || `Read "${blog.title}" by ${blog.author.firstName} on BlogVerse`,
    openGraph: {
      title: blog.title,
      description: blog.description || `Read "${blog.title}" by ${blog.author.firstName} on BlogVerse`,
      images: blog.imageUrl ? [{ url: blog.imageUrl }] : [],
      type: "article",
      siteName: "BlogVerse",
      authors: [`${blog.author.firstName} ${blog.author.lastName}`],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description || `Read "${blog.title}" by ${blog.author.firstName} on BlogVerse`,
      images: blog.imageUrl ? [blog.imageUrl] : [],
    },
  };
}

const BlogViewPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const blog = await prisma.blog.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          firstName: true,
          id: true,
          lastName: true,
          profilePhoto: true,
          username: true,
          followers: true,
        },
      },
      comments: {
        where: { parentId: null },
        select: {
          id: true,
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePhoto: true,
              username: true,
            },
          },
          content: true,
          createdAt: true,
          _count: {
            select: {
              replies: true,
              likes: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      views: true,
      tags: true,
    },
  });

  if (!blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-foreground">
          <h1 className="text-4xl font-bold mb-4">Blog not found</h1>
          <p className="text-muted-foreground">This blog may have been deleted or doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  // Check if user has bookmarked this blog
  const existingBookmark = userId ? await prisma.bookmark.findUnique({
    where: { userId_blogId: { userId, blogId: id } },
  }) : null;

  // Check if user has voted on this blog
  const existingVote = userId ? await prisma.vote.findUnique({
    where: { userId_blogId: { userId, blogId: id } },
  }) : null;

  // Fetch more blogs for recommendation
  const moreBlogs = await prisma.blog.findMany({
    where: { 
      published: true,
      NOT: { id: id }
    },
    include: {
      author: {
        select: { firstName: true, lastName: true, profilePhoto: true }
      },
      views: true
    },
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  const viewCount = blog.views.length;
  const readingTime = estimateReadingTime(blog.content);
  const showFollow = userId ? blog.author.id !== userId : true;
  const unfollow = (userId && blog.author.followers) ? blog.author.followers.some(
    (follower: any) => follower.id === userId
  ) : false;

  return (
    <div className="min-h-screen bg-background relative">
      <ReadingProgress />
        <BlogViewer
          blogId={id}
          title={blog.title}
          content={blog.content}
          author={blog.author}
          upVotes={blog.upVotes}
          downVotes={blog.downVotes}
          initialComments={blog.comments.map((c: any) => ({
            ...c,
            repliesCount: c._count.replies,
            _count: c._count,
          }))}
          viewCount={viewCount}
          imageUrl={blog.imageUrl || ''}
          followButton={showFollow}
          unfollow={unfollow}
          createdAt={blog.createdAt}
          readingTime={readingTime}
          tags={blog.tags}
          initialBookmarked={!!existingBookmark}
          initialVote={existingVote ? (existingVote.upVote ? 'up' : 'down') : null}
          isAuthor={blog.author.id === userId}
          currentUserId={userId}
        />

        {/* More from section */}
        {moreBlogs.length > 0 && (
          <section className="max-w-[720px] mx-auto px-5 border-t border-border/50 pt-12 pb-20">
            <h3 className="text-xl font-bold mb-8 text-foreground">More from BlogVerse</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {moreBlogs.map((b: any) => (
                <div key={b.id} className="flex flex-col gap-3 group">
                  {b.imageUrl && (
                    <Link href={`/blog/viewer/${b.id}`} className="relative aspect-video rounded overflow-hidden block">
                      <Image src={b.imageUrl} fill className="object-cover group-hover:scale-105 transition-transform duration-500" alt={b.title} />
                    </Link>
                  )}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 relative flex-shrink-0">
                        <Image 
                          src={b.author.profilePhoto || `https://eu.ui-avatars.com/api/?name=${b.author.firstName}+${b.author.lastName}&background=random`} 
                          fill 
                          className="rounded-full object-cover" 
                          alt={b.author.firstName} 
                         />
                      </div>
                      <span className="text-xs text-muted-foreground">{b.author.firstName} {b.author.lastName}</span>
                    </div>
                    <Link href={`/blog/viewer/${b.id}`} className="text-base font-bold text-foreground leading-snug hover:underline line-clamp-2">
                      {b.title}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
    </div>
  );
};

export default BlogViewPage;
