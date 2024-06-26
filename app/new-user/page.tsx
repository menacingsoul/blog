import ProfileForm from '@/components/ProfileForm';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/utils/db";


const fetchUserRegistrationStatus = async () => {
  
  const user = await currentUser();

  if (user) {
    const User = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });
    return User?.registered || false;
  }
  return false;
};

const ProfileCreation = async () => {
  const isRegistered = await fetchUserRegistrationStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-26 left-[32%] w-[55%] h-60 md:w-64 md:h-64 lg:w-[40%] lg:h-72 bg-purple-500 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-36 left-[29%] w-[45%] h-48  md:w-64 md:h-64 lg:w-[50%] lg:h-96 bg-yellow-500 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-200"></div>
      <div className="absolute top-6 left-[19%] w-[50%] h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-pink-500 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-400"></div>
      <div className="max-w-md space-y-5 rounded-xl px-8 py-10 shadow-lg">
        <h1 className={` text-5xl text-center z-50 md:text-7xl  mb-8 font-extrabold text-white `}>
          Blog files
        </h1>
        <h2 className="relative z-10 text-center text-3xl font-extrabold text-white">
          {isRegistered ? "You have already created your profile" : "Create Your Profile"}
        </h2>
        <ToastContainer />
        {!isRegistered && <ProfileForm />}
      </div>
    </div>
  );
};

export default ProfileCreation;
