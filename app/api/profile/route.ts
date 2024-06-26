import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '../../../utils/db'
import { currentUser } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.json();
  const image = user?.imageUrl;

  try {
    const newUser = await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        registered: true,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        bio: formData.bio,
        profilePhoto:image,
        website: formData.website,
        city: formData.city,
        country: formData.country,
      },
    });
    return NextResponse.json({ message: 'Profile created', user: newUser });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

