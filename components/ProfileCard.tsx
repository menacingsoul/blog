"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LocateIcon } from "lucide-react";
import { LocateFixed } from "lucide-react";
import FollowerList from "./FollowerList";
import FollowingList from "./FollowingList";

const ProfileCard = ({ user }) => {
  const [followerList, setFollowerList] = useState(false);
  const [followingList, setFollowingList] = useState(false);

  return (
    <>
    {followerList && (
      <div className="w-full lg:w-3/4 h-full px-4 mx-auto">
         <FollowerList followers={user.followers}/>
         {/* Close Button */}
         <div className="flex justify-end mt-4">
              <button 
                className="px-4 py-2 mr-2 rounded bg-zinc-900/70 hover:bg-gray-300/70 text-slate-50 hover:text-gray-800"
                onClick={()=>setFollowerList(false)}>
                Close
              </button>
            </div>
      </div>
        )}
        {followingList && (
      <div className="w-full lg:w-3/4 h-full px-4 mx-auto">
         <FollowingList followings={user.following}/>
         {/* Close Button */}
         <div className="flex justify-end mt-4">
              <button 
                className="px-4 py-2 mr-2 rounded bg-zinc-900/70 hover:bg-gray-300/70 text-slate-50 hover:text-gray-800"
                onClick={()=>setFollowingList(false)}>
                Close
              </button>
            </div>
      </div>
        )}
    {!followerList &&!followingList && (<div className="w-full lg:w-3/4 h-full px-4 mx-auto">
      <div className="relative flex-col overflow-hidden rounded-xl bg-gradient-to-br from-[#E2DFD0]/20 to-[#E2DFD0]/30 backdrop-filter backdrop-blur-lg border border-[#E2DFD0]/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-gradient-to-b flex items-center justify-center">
        
        
        <div className="px-6">

          <div className="text-center mt-8">
          
                <Image
                  alt="..."
                  src={user.profilePhoto}
                  height={100}
                  width={100}
                  className="shadow-lg rounded-full align-middle mx-auto  mb-2 border-none max-w-150-px"
                />
            <h3 className="text-xl font-semibold leading-normal mb-1 text-blueGray-700">
              {user.firstName} {user.lastName}
            </h3>
            <div className="text-sm  mt-1 mb-2 text-blueGray-400 font-normal">
              <p className="text-xs text-blueGray-400 font-semibold"> @{user.username}</p>
              <div className=" flex gap-2 justify-center">
                  <LocateFixed/>
                 <div className="mt-1">{user.city}, {user.country}</div>
              </div>
             
            </div>
          </div>
          <div className="w-full px-4 text-center">
            <div className="flex justify-center py-4 lg:pt-4 pt-8">
              <div className="mr-4 p-3 text-center">
                <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                  {user.followers.length}
                </span>
                <span className="text-sm text-blueGray-400 cursor-pointer"
                onClick={()=>setFollowerList(true)}
                >Followers
                </span>
              </div>
              <div className="mr-4 p-3 text-center">
                <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                {user.following.length}
                </span>
                <span className="text-sm text-blueGray-400 cursor-pointer"
                onClick={()=>setFollowingList(true)}
                >Following</span>
              </div>
              <div className="lg:mr-4 p-3 text-center">
                <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                {user.posts.length}
                </span>
                <span className="text-sm text-blueGray-400">Blogs</span>
              </div>
            </div>
          </div>
          <div className="py-2 border-t border-blueGray-200 text-center">
            <div className="flex flex-wrap justify-center">
              <div className="w-full lg:w-9/12 px-4">
                <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                  {user.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>)}
    </>
  );
};

export default ProfileCard;
