import React from "react";
import ProfileCard from "@/components/cards/ProfileCard";
import { getUserByClerkID } from "@/utils/auth";




const ProfilePage = async () => {
 
    const user = await getUserByClerkID();
  
  return (
    <div className="pt-16 bg-black text-white h-full">
      <div className="absolute top-32 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-64 right-1/4 w-80 h-80 bg-pink-600 rounded-full filter blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>
      <div className="absolute bottom-32 left-1/3 w-72 h-72 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>

        <ProfileCard user={user} />
    </div>
  );
};

export default ProfilePage;
