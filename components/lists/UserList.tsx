'use client'
import React from "react";
import Link from "next/link";
import Image from "next/image";

interface User {
  id: string | number;         // Ensure unique identification
  profilePhoto: string;
  firstName: string;
  username: string;
  // Add any other properties your follower object has
}

const UserList: React.FC<{ users: User[] }> = ({ users }) => {
  return (
    <div
      className="overflow-auto mx-auto  rounded-xl w-full h-fit bg-gradient-to-br from-[#E2DFD0]/20 to-[#E2DFD0]/30 backdrop-filter backdrop-blur-lg border border-[#E2DFD0]/30 shadow-lg transition-all duration-300 p-6"
      onClick={(e) => e.stopPropagation()} // Prevent closing on modal content click
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-300 text-center">
        Users
      </h2>

      {/* Follower List */}
      <div className="max-h-72 overflow-y-auto scrollbar-thumb-rounded">
        {users.map((follower) => (
          <li key={follower.id} className="list-none border-b border-blue-100 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src={follower.profilePhoto}
                  alt="profile_img"
                  height={35}
                  width={35}
                  className="rounded-full"
                />
                <div className="flex flex-col">
                  <div>{follower.firstName}</div>
                  <div className="text-xs text-fuchsia-200">{follower.username}</div>
                </div>
              </div>

              <div className="bg-fuchsia-200 w-fit h-fit py-1 px-2 rounded-lg text-sm text-black">
                <Link href={""}>remove</Link>
              </div>
            </div>
          </li>
        ))}
      </div>
    </div>
  );
};


export default UserList;
