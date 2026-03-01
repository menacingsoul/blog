import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';
import { currentUser } from '@clerk/nextjs/server';
import { getUserByClerkID } from '@/utils/auth';

// Create new profile
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
        profilePhoto: image,
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

// Update existing profile
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserByClerkID();
    const formData = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        website: formData.website,
        city: formData.city,
        country: formData.country,
        ...(formData.profilePhoto && { profilePhoto: formData.profilePhoto }),
      },
    });

    return NextResponse.json({ message: 'Profile updated', user: updatedUser });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
