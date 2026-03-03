import ProfileForm from '@/components/new-user/ProfileForm';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/utils/db";
import { redirect } from "next/navigation";

const fetchUserRegistrationStatus = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    return user?.registered || false;
  }
  return false;
};

const ProfileCreation = async () => {
  const isRegistered = await fetchUserRegistrationStatus();

  if (isRegistered) {
    redirect('/home');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md space-y-5 rounded-xl px-8 py-10 shadow-lg">
        <h1 className="text-2xl text-center z-50 md:text-7xl mb-8 font-extrabold text-white">
          Blog verse
        </h1>
        <h2 className="relative z-10 text-center text-3xl font-extrabold text-white">
          Create Your Profile
        </h2>
        <ToastContainer />
        <ProfileForm />
      </div>
    </div>
  );
};

export default ProfileCreation;
