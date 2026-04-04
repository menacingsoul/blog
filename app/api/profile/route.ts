import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getCurrentUser } from '@/utils/auth';

// Create new profile (onboarding)
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.json();

  try {
    // Check if user already exists (created by NextAuth adapter)
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (existingUser) {
      // Update existing user with profile data
      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          registered: true,
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          bio: formData.bio,
          website: formData.website,
          city: formData.city,
          country: formData.country,
        },
      });
      return NextResponse.json({ message: 'Profile created', user: updatedUser });
    } else {
      // Create new user (shouldn't happen normally since adapter creates user on sign-in)
      const newUser = await prisma.user.create({
        data: {
          id: session.user.id,
          email: session.user.email!,
          registered: true,
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          bio: formData.bio,
          profilePhoto: session.user.image,
          website: formData.website,
          city: formData.city,
          country: formData.country,
        },
      });
      return NextResponse.json({ message: 'Profile created', user: newUser });
    }
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Update existing profile
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
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
        ...(formData.profilePhoto !== undefined && { profilePhoto: formData.profilePhoto || null }),
      },
    });

    return NextResponse.json({ message: 'Profile updated', user: updatedUser });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
