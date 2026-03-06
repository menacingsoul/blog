import React from "react";
import { prisma } from "@/utils/db";
import { getUser } from "@/utils/auth";
import AuthorProfile from "@/components/profile/AuthorProfile";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const author = await prisma.user.findUnique({
    where: { username: params.username },
    select: { firstName: true, lastName: true, bio: true, profilePhoto: true },
  });

  if (!author) return { title: "Author Not Found — BlogVerse" };

  const name = `${author.firstName} ${author.lastName || ""}`.trim();
  return {
    title: `${name} — BlogVerse`,
    description: author.bio || `Read stories by ${name} on BlogVerse`,
    openGraph: {
      title: name,
      description: author.bio || `Read stories by ${name} on BlogVerse`,
      images: author.profilePhoto ? [author.profilePhoto] : [],
      type: "profile",
    },
  };
}

const AuthorProfilePage = async ({ params }: { params: { username: string } }) => {
  const { username } = params;
  const currentUser = await getUser();

  const author = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      bio: true,
      city: true,
      country: true,
      website: true,
      profilePhoto: true,
      createdAt: true,
      followers: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          profilePhoto: true,
        },
      },
      following: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          profilePhoto: true,
        },
      },
      posts: {
        where: { published: true },
        include: {
          author: {
            select: { firstName: true, lastName: true, profilePhoto: true },
          },
          views: true,
          tags: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!author) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Author not found</h1>
          <p className="text-muted-foreground">This author doesn&apos;t exist or may have been removed.</p>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser.id === author.id;
  const isFollowing = author.followers.some((f: any) => f.id === currentUser.id);

  // Fetch drafts only for own profile
  let drafts: any[] = [];
  if (isOwnProfile) {
    drafts = await prisma.blog.findMany({
      where: { authorId: author.id, published: false },
      include: {
        author: {
          select: { firstName: true, lastName: true, profilePhoto: true },
        },
        views: true,
        tags: true,
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  return (
    <AuthorProfile
      author={author}
      isOwnProfile={isOwnProfile}
      isFollowing={isFollowing}
      currentUserId={currentUser.id}
      drafts={drafts}
    />
  );
};

export default AuthorProfilePage;
