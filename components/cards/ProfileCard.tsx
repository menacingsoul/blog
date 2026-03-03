"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LocateFixed, Users, LogOut, BookOpen, Edit, Globe, Bookmark } from "lucide-react";
import { signOut } from "next-auth/react";
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
        <div className="h-32 sm:h-48 bg-gradient-to-r from-primary/30 to-fuchsia-500/30 relative">
          {/* Decorative tag line on desktop */}
          <div className=" text-center my-10 sm:my-0 sm:flex absolute inset-0 items-center justify-center pointer-events-none opacity-50">
            <span className="text-2xl sm:text-4xl italic tracking-tighter">#StoriesThatMatter</span>
          </div>
        </div>

        {/* Profile Header Area */}
        <div className="px-4 sm:px-8 pb-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 sm:-mt-12 mb-6 gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <div className="relative">
                <Image
                  src={avatarUrl}
                  alt={`${user.firstName}'s profile`}
                  height={128}
                  width={128}
                  className="rounded-full border-4 border-background shadow-xl object-cover h-24 w-24 sm:h-32 sm:w-32"
                />
              </div>
              <div className="sm:mb-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-primary opacity-80 font-medium">@{user.username}</p>
              </div>
            </div>

            <Link
              href="/profile/edit"
              className="w-full sm:w-auto bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-all duration-300 rounded-xl px-6 py-2.5 text-foreground flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <Edit size={18} className="text-primary" />
              <span className="font-medium">Edit Profile</span>
            </Link>
          </div>

          {/* Location & Website */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-muted-foreground text-sm mb-6">
            {user.city && user.country && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded-full border border-border">
                <LocateFixed size={14} className="text-primary" />
                <span>{user.city}, {user.country}</span>
              </div>
            )}
            {user.website && (
              <a 
                href={user.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded-full border border-border hover:text-primary transition-colors group"
              >
                <Globe size={14} className="text-primary group-hover:rotate-12 transition-transform" />
                <span>{user.website.replace(/^https?:\/\//, "")}</span>
              </a>
            )}
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="bg-muted/30 dark:bg-muted/20 border border-border rounded-xl p-5 mb-8 text-center sm:text-left">
              <p className="text-foreground/80 leading-relaxed italic">
                "{user.bio}"
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

            <Link 
              href="/myblogs" 
              className="flex items-center justify-between sm:flex-col sm:justify-center p-4 bg-muted/20 hover:bg-primary/5 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="flex flex-col items-start sm:items-center">
                <span className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {publishedCount}
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Posts</span>
              </div>
              {/* <BookOpen size={20} className="text-primary/40 group-hover:text-primary transition-colors" /> */}
            </Link>

            <button
              className="flex items-center justify-between sm:flex-col sm:justify-center p-4 bg-muted/20 hover:bg-primary/5 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 group"
              onClick={() => setActiveTab("followers")}
            >
              <div className="flex flex-col items-start sm:items-center">
                <span className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {user.followers.length}
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Followers</span>
              </div>
              {/* <Users size={20} className="text-primary/40 group-hover:text-primary transition-colors" /> */}
            </button>

            <button
              className="flex items-center justify-between sm:flex-col sm:justify-center p-4 bg-muted/20 hover:bg-primary/5 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 group"
              onClick={() => setActiveTab("following")}
            >
              <div className="flex flex-col items-start sm:items-center">
                <span className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {user.following.length}
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Following</span>
              </div>
              {/* <Users size={20} className="text-primary/40 group-hover:text-primary transition-colors" /> */}
            </button>

            
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t border-border/50">
            <Link 
              href="/bookmarks" 
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <Bookmark size={18} />
              <span>Saved Posts</span>
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 bg-foreground text-background hover:bg-foreground/90 rounded-xl font-bold transition-all duration-300 shadow-md"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;