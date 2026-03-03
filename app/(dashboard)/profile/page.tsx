import React from "react";
import ProfileCard from "@/components/cards/ProfileCard";
import { getUser } from "@/utils/auth";

const ProfilePage = async () => {
  const user = await getUser();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative p-5 pb-20 md:pb-5 bg-background overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-fuchsia-500/5 rounded-full filter blur-3xl translate-y-1/2 -translate-x-1/2" />
      <ProfileCard user={user} />
    </div>
  );
};

export default ProfilePage;
