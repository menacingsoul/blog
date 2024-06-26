import Link from "next/link";
import Image from "next/image";
import { Dancing_Script } from 'next/font/google';
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';
import {prisma} from '@/utils/db'

const inter = Dancing_Script({
  weight: '400',
  subsets: ['latin'],
});

export default async function Home() {
  const user = await currentUser();

  if (user) {
    const userId = user.id;
    const userExists = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!userExists) {
      redirect('/new-user');
    } else {
      redirect('/home');
    }
  }

  return (
    <section className="h-screen flex flex-col items-center justify-center bg-gradient-radial from-gray-900 via-slate-900 to-black bg-opacity-100">
      <div className="relative max-w-screen">
        <div className="absolute top-20 left-[15%] w-[55%] h-60 md:w-64 md:h-64 lg:w-60 lg:h-72 bg-purple-500 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-2 left-[32%] w-[45%] h-48  md:w-64 md:h-64 lg:w-64 lg:h-96 bg-yellow-500 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-200"></div>
        <div className="absolute top-36 left-[20%] w-[50%] h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-pink-500 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-100"></div>
      </div>
      <div className="text-center mb-8 flex">
        <h1 className={`${inter.className} text-5xl z-50 md:text-7xl font-extrabold text-white mt-4`}>
          Blog files
        </h1>
      </div>
      
      <div className="bg-white/20 backdrop-filter backdrop-blur-lg rounded-lg shadow-md p-8 sm:p-12 text-center max-w-xl">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-100 mb-4">
          Your Personal Haven for Emotional Well-being
        </h2>
        <p className="text-lg md:text-xl text-gray-200/80 mb-6">
          Capture your thoughts, track your moods, and gain insights into your emotional journey. Mood Diary is your companion for self-reflection and growth.
        </p>
        <Link href="/sign-up">
          <button className="bg-stone-900 hover:bg-stone-900/90 text-white font-semibold py-3 px-6 rounded-full transition duration-300">
            Get Started
          </button>
        </Link>
      </div>
    </section>
  );
}
