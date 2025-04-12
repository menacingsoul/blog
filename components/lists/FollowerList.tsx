import React, { useState } from "react";
import Image from "next/image";
import { removeFollower } from "@/utils/api";
import { Loader2, X, UserMinus, Search, UserCheck } from "lucide-react";

const FollowerList = ({ followers }) => {
  const [followerList, setFollowerList] = useState(followers);
  const [loading, setLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleRemove = async (followerId) => {
    setLoadingIds(prev => [...prev, followerId]);
    try {
      await removeFollower(followerId);
      setFollowerList(followerList.filter(follower => follower.id !== followerId));
    } catch (error) {
      console.error('Error removing follower:', error);
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== followerId));
    }
  };

  const filteredFollowers = followerList.filter(follower => 
    follower.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    follower.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="bg-zinc-900 border border-zinc-700/50 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 w-full max-h-[80vh] flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 border-b border-zinc-700/50 flex justify-between items-center bg-gradient-to-r from-indigo-600/20 to-fuchsia-600/20">
        <h2 className="text-xl font-bold text-white flex items-center">
          <UserCheck size={20} className="mr-2 text-indigo-400" />
          <span>Followers</span>
          <span className="ml-2 bg-indigo-500/30 text-white px-2 py-0.5 rounded-full text-xs">
            {followerList.length}
          </span>
        </h2>
        <button className="text-zinc-400 hover:text-white transition-colors p-1 rounded-full hover:bg-zinc-700/50">
          <X size={20} />
        </button>
      </div>

      {/* Search bar */}
      <div className="p-3 border-b border-zinc-700/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={16} />
          <input
            type="text"
            placeholder="Search followers..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 pl-10 pr-4 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Follower List */}
      <div className="overflow-y-auto grow">
        {filteredFollowers.length > 0 ? (
          <ul className="divide-y divide-zinc-700/30">
            {filteredFollowers.map((follower) => (
              <li key={follower.id} className="p-4 hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src={follower.profilePhoto}
                      alt="profile_img"
                      height={48}
                      width={48}
                      className="rounded-full border border-zinc-700"
                    />
                    <div>
                      <div className="font-medium text-white">{follower.firstName}</div>
                      <div className="text-xs text-indigo-400">@{follower.username}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemove(follower.id)}
                    disabled={loadingIds.includes(follower.id)}
                    className="bg-zinc-800 hover:bg-red-500/80 text-zinc-300 hover:text-white transition-all px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
                  >
                    {loadingIds.includes(follower.id) ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <>
                        <UserMinus size={14} />
                        <span>Remove</span>
                      </>
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-zinc-500">
            <p>No followers found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowerList;