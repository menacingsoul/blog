'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, Bell, Edit3, Loader2, Bookmark } from 'lucide-react';
import { Raleway } from 'next/font/google';
import { fetchNotifications, createBlog } from '@/utils/api';
import { ThemeToggle } from './ThemeToggle';

const raleway = Raleway({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
});

interface CurrentUser {
  username: string | null;
  firstName: string;
  profilePhoto: string | null;
}

const Navbar = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const loadUnread = async () => {
      try {
        const data = await fetchNotifications(1, 0);
        setUnreadCount(data.unreadCount || 0);
      } catch {
        // silently fail
      }
    };
    if (currentUser) {
      loadUnread();
      const interval = setInterval(loadUnread, 30000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  // Fetch current user info for profile link & avatar
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch('/api/me');
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data);
        }
      } catch {
        // silently fail
      }
    };
    loadUser();
  }, []);

  const handleCreateBlog = async () => {
    setIsCreating(true);
    try {
      const newBlog = await createBlog();
      router.push(`/blog/editor/${newBlog.id}`);
    } catch (error) {
      console.error(error);
      alert("Error creating blog. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/blog/blogs?search=${encodeURIComponent(searchValue)}`);
    }
  };

  const profileHref = currentUser?.username
    ? `/profile/${currentUser.username}`
    : '/profile';

  const avatarUrl = currentUser?.profilePhoto
    || `https://eu.ui-avatars.com/api/?name=${currentUser?.firstName || 'U'}&color=7F9CF5&background=EBF4FF&size=32`;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-xl border-b border-border z-50 flex items-center px-4 md:px-8">
      <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between gap-4">
        {/* Left Side: Logo and Search */}
        <div className="flex items-center gap-4 md:gap-8 flex-1">
          <Link href="/home" className="flex gap-2 items-center flex-shrink-0">
             <h1 className={`${raleway.className} text-foreground text-xl md:text-2xl font-bold tracking-tight`}>
              BlogVerse
            </h1>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-muted/40 border border-border/50 rounded-full px-4 py-1.5 w-full max-w-[280px] group focus-within:bg-muted/80 focus-within:border-primary/50 transition-all">
            <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
            <input 
              type="text" 
              placeholder="Search" 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="bg-transparent border-none outline-none text-sm ml-2 w-full text-foreground placeholder:text-muted-foreground"
            />
          </form>
        </div>

        {/* Right Side: Actions and Profile */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
          {/* Home Link - Mobile only */}
          <Link 
            href="/home" 
            className={`md:hidden p-2 rounded-full transition-all ${pathname === '/home' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}`}
            title="Home"
          >
            <Home className="w-5 h-5" />
          </Link>

          {currentUser ? (
            <>
              {/* Write Link */}
              <button 
                onClick={handleCreateBlog}
                disabled={isCreating}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all px-2 sm:px-3 py-1.5 rounded-full hover:bg-primary/5"
                title="Write a blog"
              >
                {isCreating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Edit3 className="w-5 h-5" />
                )}
                <span className="hidden sm:inline text-sm font-medium">Write</span>
              </button>

              {/* Bookmarks */}
              <Link 
                href="/bookmarks" 
                className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${pathname === '/bookmarks' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}`}
                title="Bookmarks"
              >
                <Bookmark className="w-5 h-5" />
              </Link>

              {/* Notifications */}
              <Link 
                href="/notifications" 
                className={`relative p-2 rounded-full transition-all ${pathname === '/notifications' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}`}
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-background">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* Profile Avatar */}
              <Link 
                href={profileHref}
                className="flex-shrink-0 ml-1"
                title="Profile"
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-primary/50 transition-all">
                  <Image
                    src={avatarUrl}
                    fill
                    alt="Your profile"
                    className="object-cover"
                  />
                </div>
              </Link>
            </>
          ) : (
            <Link 
              href="/sign-in" 
              className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/10"
            >
              Sign In
            </Link>
          )}

          {/* Theme Toggle */}
          <div className="pl-1 sm:pl-2 border-l border-border/50 ml-1">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
