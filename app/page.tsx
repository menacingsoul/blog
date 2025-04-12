import Link from "next/link";
import Image from "next/image";
import { Raleway } from "next/font/google";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';
import {prisma} from '@/utils/db'

const dScript = Raleway({
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
      <div className="text-center mb-8 flex gap-3 items-center">
        <Image
        src="logo.svg"
        height={60}
        width={60}
        alt = "logo"
        
        />

       
        <h1 className={`${dScript.className} text-5xl z-50 md:text-7xl font-extrabold text-white mt-4`}>
          Blog verse
        </h1>
      </div>
      
      <div className="bg-white/20 backdrop-filter backdrop-blur-lg rounded-lg shadow-md p-8 sm:p-12 text-center max-w-xl">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-100 mb-4">
          Share Your Stories, Connect with the World
        </h2>
        <p className="text-lg md:text-xl text-gray-200/80 mb-6">
          BlogVerse is your platform for creative expression and meaningful conversations. Share your thoughts, experiences, and expertise with a larger audience.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4"> 
          <Link href="/sign-up">
            <button className="bg-stone-900 hover:bg-stone-900/90 text-white font-semibold py-3 px-6 rounded-full transition duration-300">
              Start Blogging
            </button>
          </Link>

        </div>
        </div>
    </section>
  );
}
