import BlogViewer from '@/components/blog/BlogViewer';
import ReadingProgress from '@/components/blog/ReadingProgress';
import { prisma } from '@/utils/db';
import { getUserByClerkID } from '@/utils/auth';
import { estimateReadingTime } from '@/utils/readingTime';

const BlogViewPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const user = await getUserByClerkID();
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
          createdAt: 'desc' as const,
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

  if (blog.author.id !== currentUserId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-foreground">
          <h1 className="text-4xl font-bold mb-4">Unauthorized</h1>
          <p className="text-muted-foreground">You can only view your own blogs from this page.</p>
        </div>
      </div>
    );
  }

  // Check bookmark & vote state
  const existingBookmark = await prisma.bookmark.findUnique({
    where: { userId_blogId: { userId: currentUserId, blogId: id } },
  });
  const existingVote = await prisma.vote.findUnique({
    where: { userId_blogId: { userId: currentUserId, blogId: id } },
  });

  const viewCount = blog.views.length;
  const readingTime = estimateReadingTime(blog.content);

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
          followButton={false}
          unfollow={false}
          createdAt={blog.createdAt}
          readingTime={readingTime}
          tags={blog.tags}
          initialBookmarked={!!existingBookmark}
          initialVote={existingVote ? (existingVote.upVote ? 'up' : 'down') : null}
          isAuthor={true}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
};

export default BlogViewPage;
