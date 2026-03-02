"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LocateFixed, Users, LogOut, BookOpen, Edit, Globe, Bookmark } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import FollowerList from "../lists/FollowerList";
import FollowingList from "../lists/FollowingList";
import type { ProfileUser } from "@/types";
import { cn } from "@/lib/utils";

const ProfileCard: React.FC<{ user: ProfileUser }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  
  const closeModals = () => setActiveTab(null);

  const publishedCount = user.posts.filter((p) => p.published).length;
  const avatarUrl = user.profilePhoto || `https://eu.ui-avatars.com/api/?name=${user.firstName}+${user.lastName || ''}&color=7F9CF5&background=EBF4FF`;

  return (
    <div className="w-full max-w-4xl mx-auto relative z-10">
      {activeTab && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center" onClick={closeModals}>
          <div className="w-full max-w-2xl p-2" onClick={(e) => e.stopPropagation()}>
            {activeTab === "followers" && <FollowerList followers={user.followers} />}
            {activeTab === "following" && <FollowingList followings={user.following} />}
          </div>
        </div>
      )}

      <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-primary/30 to-fuchsia-500/30 relative">
          <div className="absolute -bottom-16 left-0 w-full flex items-end justify-between px-8">
            <div className="flex items-end">
              <Image
                src={avatarUrl}
                alt={`${user.firstName}'s profile`}
                height={100}
                width={100}
                className="rounded-full border-4 border-background shadow-lg object-cover h-32 w-32"
              />
              <div className="ml-4 mb-2">
                <h2 className="text-2xl font-bold text-foreground">{user.firstName} {user.lastName}</h2>
                <p className="text-muted-foreground text-sm">@{user.username}</p>
              </div>
            </div>
            <Link
              href="/profile/edit"
              className="bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-colors mb-2 rounded-lg px-4 py-2 text-foreground flex items-center gap-2 shadow-lg"
            >
              <Edit size={16} className="text-primary" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>

        <div className="pt-20 px-8 pb-6">
          {/* Location & Website */}
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm mb-4">
            <div className="flex items-center gap-1">
              <LocateFixed size={16} />
              <span>{user.city}, {user.country}</span>
            </div>
            {user.website && (
              <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                <Globe size={16} />
                <span>{user.website.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
          </div>

          {/* Bio */}
          <div className="bg-muted/30 dark:bg-muted/20 border border-border rounded-lg p-4 mb-6">
            <p className="text-foreground/80 leading-relaxed">{user.bio}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div 
              className="flex flex-col items-center p-4 bg-muted/30 dark:bg-muted/20 rounded-xl border border-border cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-all duration-200"
              onClick={() => setActiveTab("followers")}
            >
              <span className="text-2xl font-bold text-foreground">{user.followers.length}</span>
              <div className="flex items-center text-muted-foreground mt-1 text-sm">
                <Users size={14} className="mr-1" />
                <span>Followers</span>
              </div>
            </div>
            
            <div 
              className="flex flex-col items-center p-4 bg-muted/30 dark:bg-muted/20 rounded-xl border border-border cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-all duration-200"
              onClick={() => setActiveTab("following")}
            >
              <span className="text-2xl font-bold text-foreground">{user.following.length}</span>
              <div className="flex items-center text-muted-foreground mt-1 text-sm">
                <Users size={14} className="mr-1" />
                <span>Following</span>
              </div>
            </div>
            
            <Link href="/myblogs" className="flex flex-col items-center p-4 bg-muted/30 dark:bg-muted/20 rounded-xl border border-border cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-all duration-200">
              <span className="text-2xl font-bold text-foreground">{publishedCount}</span>
              <div className="flex items-center text-muted-foreground mt-1 text-sm">
                <BookOpen size={14} className="mr-1" />
                <span>Published</span>
              </div>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <Link href="/bookmarks" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted/30 dark:bg-muted/20 border border-border hover:bg-primary/5 hover:border-primary/20 transition-all duration-200 text-sm text-foreground">
              <Bookmark size={16} className="text-primary" />
              <span>Saved Posts</span>
            </Link>
          </div>

          {/* Sign Out */}
          <div className="flex justify-center">
            <button className="bg-gradient-to-r from-primary to-fuchsia-500 hover:from-primary/90 hover:to-fuchsia-500/90 text-primary-foreground rounded-lg px-6 py-2 shadow-lg shadow-primary/20 flex items-center gap-2 transition-all duration-300">
              <SignOutButton redirectUrl="/">
                <div className="flex items-center gap-2">
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </div>
              </SignOutButton>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;