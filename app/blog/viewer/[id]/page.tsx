import BlogViewer from "@/components/blog/BlogViewer";
import ReadingProgress from "@/components/blog/ReadingProgress";
import { prisma } from "@/utils/db";
import { getUser } from "@/utils/auth";
import { estimateReadingTime } from "@/utils/readingTime";
import type { Metadata } from "next";

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
      description: blog.description,
      images: blog.imageUrl ? [blog.imageUrl] : [],
      type: "article",
      authors: [`${blog.author.firstName} ${blog.author.lastName}`],
    },
  };
}

const BlogViewPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const user = await getUser();
  const userId = user.id;

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
  const existingBookmark = await prisma.bookmark.findUnique({
    where: { userId_blogId: { userId, blogId: id } },
  });

  // Check if user has voted on this blog
  const existingVote = await prisma.vote.findUnique({
    where: { userId_blogId: { userId, blogId: id } },
  });

  const viewCount = blog.views.length;
  const readingTime = estimateReadingTime(blog.content);
  const showFollow = blog.author.id !== userId;
  const unfollow = blog.author.followers.some(
    (follower: any) => follower.id === userId
  );

  return (
    <div className="h-screen overflow-y-scroll bg-background relative">
      <ReadingProgress />
      <div className="p-4 md:p-8">
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
      </div>
    </div>
  );
};

export default BlogViewPage;
