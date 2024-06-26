import React from "react";
import ProfileCard from "@/components/ProfileCard";
import { getUserByClerkID } from "@/utils/auth";



const ProfilePage = async () => {
 
    const user = await getUserByClerkID();
  
  return (
    <div className="pt-16 bg-black text-white h-full">
      <div className="absolute top-26 left-[32%] w-[55%] h-60 md:w-64 md:h-64 lg:w-[40%] lg:h-72 bg-purple-500 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-36 left-[29%] w-[45%] h-48  md:w-64 md:h-64 lg:w-[50%] lg:h-96 bg-yellow-500 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-200"></div>
      <div className="absolute top-6 left-[19%] w-[50%] h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-pink-500 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-400"></div>
        <ProfileCard user={user} />
    </div>
  );
};

export default ProfilePage;
