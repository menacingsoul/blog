"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LocateFixed, Users, LogOut, BookOpen, Edit, Globe } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import FollowerList from "../lists/FollowerList";
import FollowingList from "../lists/FollowingList";
import type { ProfileUser } from "@/types";

const ProfileCard: React.FC<{ user: ProfileUser }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  
  const closeModals = () => setActiveTab(null);

  const publishedCount = user.posts.filter((p) => p.published).length;
  const avatarUrl = user.profilePhoto || `https://eu.ui-avatars.com/api/?name=${user.firstName}+${user.lastName || ''}&color=7F9CF5&background=EBF4FF`;

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      {activeTab && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center" onClick={closeModals}>
          <div className="w-full max-w-2xl p-2" onClick={(e) => e.stopPropagation()}>
            {activeTab === "followers" && <FollowerList followers={user.followers} />}
            {activeTab === "following" && <FollowingList followings={user.following} />}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/90 backdrop-filter backdrop-blur-lg rounded-2xl border border-zinc-700/50 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-indigo-500/10">
        <div className="h-32 bg-gradient-to-r from-indigo-600/30 to-fuchsia-600/30 relative">
          <div className="absolute -bottom-16 left-0 w-full flex items-end justify-between px-8">
            <div className="flex items-end">
              <Image
                src={avatarUrl}
                alt={`${user.firstName}'s profile`}
                height={100}
                width={100}
                className="rounded-full border-4 border-zinc-800 shadow-lg object-cover h-32 w-32"
              />
              <div className="ml-4 mb-2 text-white">
                <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
                <p className="text-zinc-300 text-sm">@{user.username}</p>
              </div>
            </div>
            <Link
              href="/profile/edit"
              className="bg-zinc-800 hover:bg-zinc-700 transition-colors mb-2 rounded-lg px-4 py-2 text-white flex items-center gap-2 shadow-lg"
            >
              <Edit size={16} />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>

        <div className="pt-20 px-8 pb-6">
          <div className="flex flex-wrap items-center gap-4 text-zinc-400 text-sm mb-4">
            <div className="flex items-center gap-1">
              <LocateFixed size={16} />
              <span>{user.city}, {user.country}</span>
            </div>
            {user.website && (
              <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-indigo-400 transition-colors">
                <Globe size={16} />
                <span>{user.website.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
          </div>

          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-lg p-4 mb-6">
            <p className="text-zinc-300 leading-relaxed">{user.bio}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div 
              className="flex flex-col items-center p-4 bg-zinc-800/40 rounded-lg border border-zinc-700/50 cursor-pointer hover:bg-zinc-700/40 transition-colors"
              onClick={() => setActiveTab("followers")}
            >
              <span className="text-2xl font-bold text-white">{user.followers.length}</span>
              <div className="flex items-center text-zinc-400 mt-1">
                <Users size={14} className="mr-1" />
                <span>Followers</span>
              </div>
            </div>
            
            <div 
              className="flex flex-col items-center p-4 bg-zinc-800/40 rounded-lg border border-zinc-700/50 cursor-pointer hover:bg-zinc-700/40 transition-colors"
              onClick={() => setActiveTab("following")}
            >
              <span className="text-2xl font-bold text-white">{user.following.length}</span>
              <div className="flex items-center text-zinc-400 mt-1">
                <Users size={14} className="mr-1" />
                <span>Following</span>
              </div>
            </div>
            
            <Link href="/myblogs" className="flex flex-col items-center p-4 bg-zinc-800/40 rounded-lg border border-zinc-700/50 cursor-pointer hover:bg-zinc-700/40 transition-colors">
              <span className="text-2xl font-bold text-white">{publishedCount}</span>
              <div className="flex items-center text-zinc-400 mt-1">
                <BookOpen size={14} className="mr-1" />
                <span>Published</span>
              </div>
            </Link>
          </div>

          <div className="flex justify-center">
            <button className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 text-white rounded-lg px-6 py-2 shadow-lg flex items-center gap-2 transition-all duration-300">
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