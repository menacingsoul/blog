import React, { useState } from "react";
import Image from "next/image";
import { unFollowUser } from "@/utils/api";
import { Loader2, X, UserMinus, Search, Users } from "lucide-react";
import type { UserFollower } from "@/types";
import { cn } from "@/lib/utils";

const FollowingList: React.FC<{ followings: UserFollower[] }> = ({ followings }) => {
  const [followingList, setFollowingList] = useState(followings);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleUnfollow = async (followingId: string) => {
    setLoadingIds(prev => [...prev, followingId]);
    try {
      await unFollowUser(followingId);
      setFollowingList(followingList.filter(f => f.id !== followingId));
    } catch (error) { console.error('Error unfollowing user:', error); }
    finally { setLoadingIds(prev => prev.filter(id => id !== followingId)); }
  };

  const filteredFollowing = followingList.filter(f => 
    f.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.username || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvatar = (f: UserFollower) => f.profilePhoto || `https://eu.ui-avatars.com/api/?name=${f.firstName}+${f.lastName || ''}&color=7F9CF5&background=EBF4FF`;

  return (
    <div className="glass-card rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 w-full max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
      <div className="p-4 border-b border-border flex justify-between items-center bg-gradient-to-r from-fuchsia-500/10 to-primary/10">
        <h2 className="text-xl font-bold text-foreground flex items-center">
          <Users size={20} className="mr-2 text-fuchsia-500" />
          <span>Following</span>
          <span className="ml-2 bg-fuchsia-500/20 text-foreground px-2 py-0.5 rounded-full text-xs">{followingList.length}</span>
        </h2>
        <button className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted"><X size={20} /></button>
      </div>

      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <input type="text" placeholder="Search following..." className="w-full bg-muted/50 border border-border rounded-lg py-2 pl-10 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 placeholder:text-muted-foreground" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="overflow-y-auto grow">
        {filteredFollowing.length > 0 ? (
          <ul className="divide-y divide-border">
            {filteredFollowing.map(following => (
              <li key={following.id} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image src={getAvatar(following)} alt="profile_img" height={48} width={48} className="rounded-full border border-border" />
                    <div>
                      <div className="font-medium text-foreground">{following.firstName}</div>
                      <div className="text-xs text-fuchsia-500">@{following.username}</div>
                    </div>
                  </div>
                  <button onClick={() => handleUnfollow(following.id)} disabled={loadingIds.includes(following.id)}
                    className="bg-muted/50 hover:bg-destructive/80 text-muted-foreground hover:text-destructive-foreground transition-all px-3 py-1.5 rounded-lg text-sm flex items-center gap-1">
                    {loadingIds.includes(following.id) ? <Loader2 size={14} className="animate-spin" /> : <><UserMinus size={14} /><span>Unfollow</span></>}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground"><p>No users found</p></div>
        )}
      </div>
    </div>
  );
};

export default FollowingList;