import BlogEditor from '@/components/blog/BlogEditor';
import { prisma } from '@/utils/db';
import { getUser } from '@/utils/auth';

const BlogEditorPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const user = await getUser();
  const currentUserId = user.id;

  const blog = await prisma.blog.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, firstName: true, lastName: true, profilePhoto: true, username: true },
      },
    },
  });

  if (!blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-foreground">
          <h1 className="text-4xl font-bold mb-4">Blog not found</h1>
          <p className="text-muted-foreground">This blog may have been deleted.</p>
        </div>
      </div>
    );
  }

  if (blog.author.id !== currentUserId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-foreground">
          <h1 className="text-4xl font-bold mb-4">Unauthorized</h1>
          <p className="text-muted-foreground">You don&apos;t have permission to edit this blog.</p>
        </div>
      </div>
    );
  }

  return (
    <BlogEditor
      blogId={id}
      initialDescription={blog.description}
      initialContent={blog.content}
      initialTitle={blog.title}
      initialImageUrl={blog.imageUrl || ''}
      mode={blog.published ? 'published' : 'draft'}
      username={blog.author.username || ''}
    />
  );
};

export default BlogEditorPage;
