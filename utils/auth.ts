import { auth } from '@clerk/nextjs/server'
import { prisma } from './db'

export const getUserByClerkID = async () => {
  const { userId } =  await auth();

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      clerkId: userId as string,
    },
    include:{
        followers : true,
        following : true,
        posts :true,
    }
  })
  return user
}