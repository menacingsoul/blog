import React from "react";
import ProfileCard from "@/components/cards/ProfileCard";
import { getUserByClerkID } from "@/utils/auth";

const ProfilePage = async () => {
  const user = await getUserByClerkID();
  
  return (
    <div className="text-white min-h-screen flex flex-col items-center justify-center relative p-5 pb-20 md:pb-5 bg-gradient-to-br from-gray-900 to-black">
      <ProfileCard user={user} />
    </div>
  );
};

export default ProfilePage;
