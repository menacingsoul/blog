import Link from "next/link";
import Image from "next/image";
import { Raleway } from "next/font/google";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';
import { prisma } from '@/utils/db';

// Font import
const raleway = Raleway({
  weight: ['400', '600', '700', '800'],
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
    <main className="min-h-screen overflow-hidden bg-black relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-fuchsia-600 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        
        {/* Grid background overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 h-screen flex flex-col">
        {/* Header area */}
        <header className="pt-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              height={40}
              width={40}
              alt="BlogVerse logo"
              className="animate-spin-slow"
            />
            <span className={`${raleway.className} text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-fuchsia-400`}>
              BlogVerse
            </span>
          </div>
          
          <Link href="/sign-in">
            <button className="text-white/70 hover:text-white border border-white/20 hover:border-white/40 px-4 py-2 rounded-lg transition-all duration-300 text-sm">
              Sign In
            </button>
          </Link>
        </header>
        
        {/* Hero section */}
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {/* Left side content */}
          <div className="flex-1 max-w-xl">
            <h1 className={`${raleway.className} text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight`}>
              Where <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-fuchsia-500">ideas</span> find their voice
            </h1>
            
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              Join BlogVerse and become part of a thriving community of writers, thinkers, and creators. Share your perspective and connect with readers from around the world.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/sign-up">
                <button className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40">
                  Start Blogging
                </button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex gap-8 mt-12">
              <div>
                <p className="text-3xl font-bold text-white">10k+</p>
                <p className="text-white/50 text-sm">Writers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">50k+</p>
                <p className="text-white/50 text-sm">Articles</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">2M+</p>
                <p className="text-white/50 text-sm">Readers</p>
              </div>
            </div>
          </div>
          
          {/* Right side - floating cards */}
          <div className="relative h-80 w-80 md:h-96 md:w-96 hidden md:block">
            <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 backdrop-filter backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl transform rotate-6 hover:rotate-3 transition-all duration-300">
              <div className="p-6">
                <div className="w-10 h-10 rounded-full bg-indigo-500/50 mb-4"></div>
                <div className="h-4 w-3/4 bg-white/20 rounded-lg mb-2"></div>
                <div className="h-4 w-1/2 bg-white/20 rounded-lg mb-4"></div>
                <div className="h-24 bg-white/10 rounded-lg"></div>
              </div>
            </div>
            
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-fuchsia-500/20 to-indigo-500/20 backdrop-filter backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl transform -rotate-6 hover:-rotate-3 transition-all duration-300">
              <div className="p-6">
                <div className="w-10 h-10 rounded-full bg-fuchsia-500/50 mb-4"></div>
                <div className="h-4 w-3/4 bg-white/20 rounded-lg mb-2"></div>
                <div className="h-4 w-1/2 bg-white/20 rounded-lg mb-4"></div>
                <div className="h-24 bg-white/10 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="py-6 text-center text-white/40 text-sm">
          <p>&copy; {new Date().getFullYear()} BlogVerse. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}