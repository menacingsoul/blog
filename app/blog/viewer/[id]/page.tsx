import BlogViewer from '@/components/blog/BlogViewer';
import { prisma } from '@/utils/db';
import { getUserByClerkID } from '@/utils/auth';

const BlogViewPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const user = await getUserByClerkID();
  const userId = user.id;
  const following = user.following

  
  const blog = await prisma.blog.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          firstName: true,
          id:true,
          lastName: true,
          profilePhoto: true,
          username:true,
          followers:true,
        },
    
      },
      comments:{
        select:{
            author:{
                select:{
                    firstName:true,
                    lastName:true,
                    profilePhoto:true,
                    username:true,
                   
                }
            },
            content:true,
            createdAt:true,
        }
      },
      views:true,
      
    },
  });

  if (!blog) {
    return <div>Blog not found</div>;
  }
  const viewCount = blog.views.length;

  let showFollow = true;

  if(blog.author.id==userId)
  {
    showFollow = false;
  }

  const unfollow = blog.author.followers.some(follower => follower.id === userId);
  
  console.log(unfollow);

  return (
    <div className="h-screen overflow-y-scroll bg-gradient-to-br from-gray-900 to-black p-8">
     <div className="absolute top-32 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-64 right-1/4 w-80 h-80 bg-pink-600 rounded-full filter blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>
      <div className="absolute bottom-32 left-1/3 w-72 h-72 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>

      <BlogViewer
        blogId={id}
        title={blog.title}
        content={blog.content}
        author={blog.author}
        upVotes={blog.upVotes}
        downVotes={blog.downVotes}
        initialComments={blog.comments}
        viewCount={viewCount}
        imageUrl={blog.imageUrl}
        followButton={showFollow}
        unfollow = {unfollow}
        createdAt={blog.createdAt}
      />
    </div>
  );
};

export default BlogViewPage;
