import React from "react";
import Link from "next/link";
import Image from "next/image";
import { unFollowUser } from "@/utils/api";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const FollowingList = ({ followings }) => {
  const [followingList, setFollowingList] = useState(followings);
  const [loading,setLoading] = useState(false);
  const handleUnfollow = async (followingId) => {
    setLoading(true)
    try {

      await unFollowUser(followingId);

      setFollowingList(followingList.filter(following => following.id !== followingId));
    } catch (error) {
      console.error('Error removing follower:', error);
    }finally
    {
      setLoading(false);
    }
  };
  return (
    <div
      className="overflow-auto mx-auto rounded-xl w-full h-fit bg-gradient-to-br from-[#E2DFD0]/20 to-[#E2DFD0]/30 backdrop-filter backdrop-blur-lg border border-[#E2DFD0]/30 shadow-lg transition-all duration-300 p-6"
      onClick={(e) => e.stopPropagation()} // Prevent closing on modal content click
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-300 text-center">
        Following
      </h2>

      {/* Follower List */}
      <div className="max-h-72 overflow-y-auto scrollbar-thumb-rounded">
        {followings.map((following) => (
          <li key={following.id} className="list-none border-b border-blue-100 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={following.profilePhoto}
                alt="profile_img"
                height={35}
                width={35}
                className="rounded-full"
              />
              <div className="flex flex-col">
                <div>{following.firstName}</div>
                <div className="text-xs text-fuchsia-200">{following.username}</div>
              </div>
            </div>

            <button
              onClick={() => handleUnfollow(following.id)}
              className="bg-fuchsia-200 w-fit h-fit py-1 px-2 rounded-lg text-sm text-black"
            >
              {loading?<Loader2 size={12} className=" animate-spin"/>:<div>Unfollow</div>}
            </button>
          </div>
        </li>
        ))}
      </div>
    </div>
  );
};


export default FollowingList;
