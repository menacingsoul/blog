import React, { useState } from "react";
import Image from "next/image";
import { unFollowUser } from "@/utils/api";
import { Loader2, X, UserMinus, Search, Users } from "lucide-react";

const FollowingList = ({ followings }) => {
  const [followingList, setFollowingList] = useState(followings);
  const [loadingIds, setLoadingIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleUnfollow = async (followingId) => {
    setLoadingIds(prev => [...prev, followingId]);
    try {
      await unFollowUser(followingId);
      setFollowingList(followingList.filter(following => following.id !== followingId));
    } catch (error) {
      console.error('Error unfollowing user:', error);
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== followingId));
    }
  };

  const filteredFollowing = followingList.filter(following => 
    following.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    following.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="bg-zinc-900 border border-zinc-700/50 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 w-full max-h-[80vh] flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 border-b border-zinc-700/50 flex justify-between items-center bg-gradient-to-r from-fuchsia-600/20 to-indigo-600/20">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Users size={20} className="mr-2 text-fuchsia-400" />
          <span>Following</span>
          <span className="ml-2 bg-fuchsia-500/30 text-white px-2 py-0.5 rounded-full text-xs">
            {followingList.length}
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
            placeholder="Search following..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 pl-10 pr-4 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Following List */}
      <div className="overflow-y-auto grow">
        {filteredFollowing.length > 0 ? (
          <ul className="divide-y divide-zinc-700/30">
            {filteredFollowing.map((following) => (
              <li key={following.id} className="p-4 hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src={following.profilePhoto}
                      alt="profile_img"
                      height={48}
                      width={48}
                      className="rounded-full border border-zinc-700"
                    />
                    <div>
                      <div className="font-medium text-white">{following.firstName}</div>
                      <div className="text-xs text-fuchsia-400">@{following.username}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUnfollow(following.id)}
                    disabled={loadingIds.includes(following.id)}
                    className="bg-zinc-800 hover:bg-red-500/80 text-zinc-300 hover:text-white transition-all px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
                  >
                    {loadingIds.includes(following.id) ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <>
                        <UserMinus size={14} />
                        <span>Unfollow</span>
                      </>
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-zinc-500">
            <p>No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowingList;