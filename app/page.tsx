import Link from "next/link";
import Image from "next/image";
import { Raleway, Playfair_Display } from "next/font/google";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import { prisma } from '@/utils/db';
import { TrendingUp, Clock } from 'lucide-react';
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
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 relative overflow-hidden">
      {/* Subtle background gradient blobs — matches dashboard style */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-fuchsia-500/5 rounded-full filter blur-3xl translate-y-1/2 -translate-x-1/3"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="container mx-auto px-6 h-16 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <h1 className={`${raleway.className} text-xl md:text-2xl font-bold tracking-tight text-foreground`}>
                BlogVerse
              </h1>
            </Link>
            
            <Link href="/sign-in">
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/10 text-sm">
                Get Started
              </button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="border-b border-border">
          <div className="container mx-auto px-6 py-20 md:py-28 lg:py-32">
            <div className="max-w-4xl animate-fadeInUp">
              <h2 className={`${playfair.className} text-5xl sm:text-6xl md:text-8xl lg:text-[100px] font-black leading-[0.95] tracking-tight mb-8 text-foreground`}>
                Where ideas <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-fuchsia-400 italic">find</span> their voice.
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-10">
                Join BlogVerse to share your perspective with a global community of thinkers and creators.
              </p>
              <Link href="/sign-in">
                <button className="bg-gradient-to-r from-primary to-fuchsia-500 hover:opacity-90 text-primary-foreground text-base font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg shadow-primary/20 active:scale-[0.97]">
                  Start Reading
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Trending Section */}
        {trendingBlogs.length > 0 && (
          <section className="border-b border-border">
            <div className="container mx-auto px-6 py-12 md:py-16">
              <div className="flex items-center gap-2 mb-10">
                <div className="p-1.5 border border-foreground/20 rounded-full">
                  <TrendingUp size={16} className="text-primary" />
                </div>
                <span className="text-sm font-semibold text-foreground tracking-wide">Trending on BlogVerse</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-10">
                {trendingBlogs.map((blog, idx) => {
                  const readTime = estimateReadingTime(blog.content);
                  const avatar = blog.author.profilePhoto || 
                    `https://eu.ui-avatars.com/api/?name=${blog.author.firstName}+${blog.author.lastName || ''}&color=7F9CF5&background=EBF4FF`;
                  
                  return (
                    <div key={blog.id} className="flex gap-4 group">
                      <span className={`${playfair.className} text-[32px] font-black text-muted-foreground/30 select-none leading-none mt-1`}>
                        0{idx + 1}
                      </span>
                      <div className="flex-1 space-y-2.5">
                        <div className="flex items-center gap-2">
                           <div className="relative w-5 h-5 rounded-full overflow-hidden">
                              <Image 
                                src={avatar} 
                                fill
                                className="object-cover" 
                                alt={blog.author.firstName} 
                              />
                           </div>
                          <span className="text-xs font-semibold text-foreground">
                            {blog.author.firstName} {blog.author.lastName}
                          </span>
                        </div>
                        <Link href={`/sign-in?callbackUrl=${encodeURIComponent(`/blog/viewer/${blog.id}`)}`}>
                          <h3 className={`${raleway.className} text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug`}>
                            {blog.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {readTime} min read
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2">
            <span className={`${raleway.className} text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-fuchsia-400`}>
              BlogVerse
            </span>
            <span className="text-muted-foreground/50 text-sm">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-5 text-xs font-medium text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Help</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="hover:text-foreground transition-colors">About</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}