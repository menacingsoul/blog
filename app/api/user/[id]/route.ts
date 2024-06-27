// api/blog/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';
import { getUserByClerkID } from '@/utils/auth';
import { NextRequest } from 'next/server';

// export async function POST() {
//   try {
//     const user = await getUserByClerkID();

//     const newBlog = await prisma.blog.create({
//       data: {
//         title: 'Untitled Blog',
//         content: '',
//         views: 0,
//         published: false,
//         authorId: user.id,
//       },
//     });

//     return NextResponse.json(newBlog);
//   } catch (error) {
//     console.error('Error creating blog:', error);
//     return new NextResponse('Internal Server Error', { status: 500 });
//   }
// }

export async function GET(req: NextRequest, { params }: { params: { id: string } }){
  try{
    const user  = await getUserByClerkID();
    const  {id} = params;
    const getUserBlogs = await prisma.blog.findMany({
      where:{
       authorId: id,
       published:true,
      }
    })
  }catch (error) {
    console.error('Error fetching your blogs:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
