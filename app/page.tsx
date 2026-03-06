import Link from "next/link";
import Image from "next/image";
import { Raleway, Playfair_Display } from "next/font/google";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import { prisma } from '@/utils/db';
import { TrendingUp, Clock, ChevronRight } from 'lucide-react';
import { estimateReadingTime } from '@/utils/readingTime';

const raleway = Raleway({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
});

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    const userExists = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!userExists || !userExists.registered) {
      redirect('/new-user');
    } else {
      redirect('/home');
    }
  }

  // Fetch trending blogs for the "inspired" feel
  const trendingBlogs = await prisma.blog.findMany({
    where: { published: true },
    include: {
      author: {
        select: {
          firstName: true,
          lastName: true,
          profilePhoto: true,
        },
      },
    },
    orderBy: { upVotes: 'desc' },
    take: 3,
  });

  return (
    <main className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      {/* Animated background elements - Keeping the BlogVerse vibe */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full filter blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/10 rounded-full filter blur-[120px] animate-pulse animation-delay-1000"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="relative z-10">
        {/* Header area */}
        <header className="container mx-auto px-6 py-8 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
          <div className="flex items-center gap-3">
            <span className={`${raleway.className} text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-fuchsia-400`}>
              BlogVerse
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="/sign-in" className="text-sm font-medium text-white/70 hover:text-white transition-colors hidden sm:block">
              Our Story
            </Link>
            <Link href="/sign-in">
              <button className="bg-white text-black text-sm font-bold px-5 py-2 rounded-full hover:bg-white/90 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                Get Started
              </button>
            </Link>
          </div>
        </header>

        {/* Hero Section - Refined but keeping the vibe */}
        <section className="container mx-auto px-6 py-20 md:py-32 border-b border-white/5">
          <div className="max-w-4xl">
            <h1 className={`${playfair.className} text-6xl md:text-8xl lg:text-[100px] font-black leading-[0.9] tracking-tight mb-10`}>
              Where ideas <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-500 italic">find</span> their voice.
            </h1>
            <p className="text-xl md:text-2xl text-white/60 leading-relaxed max-w-2xl mb-12">
              Join BlogVerse to share your perspective with a global community of thinkers and creators.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link href="/sign-in">
                <button className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 text-white text-lg font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-xl shadow-indigo-500/20 active:scale-95">
                  Start Reading
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Trending Section - The "Medium" Inspiration */}
        <section className="container mx-auto px-6 py-20">
          <div className="flex items-center gap-2 mb-12 uppercase text-xs font-bold tracking-[0.2em] text-white/50">
            <TrendingUp size={16} className="text-indigo-400" />
            Trending on BlogVerse
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12">
            {trendingBlogs.map((blog, idx) => {
              const readTime = estimateReadingTime(blog.content);
              const avatar = blog.author.profilePhoto || 
                `https://eu.ui-avatars.com/api/?name=${blog.author.firstName}+${blog.author.lastName || ''}&color=7F9CF5&background=EBF4FF`;
              
              return (
                <div key={blog.id} className="flex gap-5 group">
                  <span className={`${playfair.className} text-4xl font-black text-white/50 select-none group-hover:text-indigo-500/30 transition-colors`}>
                    0{idx + 1}
                  </span>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                       <div className="relative w-5 h-5 rounded-full overflow-hidden">
                          <Image 
                            src={avatar} 
                            fill
                            className="object-cover" 
                            alt={blog.author.firstName} 
                          />
                       </div>
                      <span className="text-xs font-bold text-white/80">
                        {blog.author.firstName} {blog.author.lastName}
                      </span>
                    </div>
                    <Link href={`/sign-in`}>
                      <h3 className={`${raleway.className} text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug`}>
                        {blog.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-3 text-[11px] font-medium text-white/40 uppercase tracking-wider">
                      <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} /> {readTime} min read
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-2">
            <span className={`${raleway.className} text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-fuchsia-400`}>
              BlogVerse
            </span>
            <span className="text-white/20 text-sm">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-white/40 uppercase tracking-widest">
            <Link href="#" className="hover:text-white transition-colors">Help</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">About</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}