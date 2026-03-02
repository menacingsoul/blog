'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, User2, Copyright, Search, Bell, BookOpen } from 'lucide-react';
import { Raleway } from 'next/font/google';
import { fetchNotifications } from '@/utils/api';
import { ThemeToggle } from './ThemeToggle';

const raleway = Raleway({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
});

const links = [
  { href: '/home', label: 'Home', icon: <Home className="w-5 h-5" /> },
  { href: '/myblogs', label: 'My Blogs', icon: <BookOpen className="w-5 h-5" /> },
  { href: '/blog/blogs', label: 'Explore', icon: <Search className="w-5 h-5" /> },
  { href: '/notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
  { href: '/profile', label: 'Profile', icon: <User2 className="w-5 h-5" /> },
];

const SidebarToggle = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch unread notification count
  useEffect(() => {
    const loadUnread = async () => {
      try {
        const data = await fetchNotifications(1, 0);
        setUnreadCount(data.unreadCount || 0);
      } catch {
        // silently fail
      }
    };
    loadUnread();
    const interval = setInterval(loadUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Desktop Sidebar — hidden on mobile */}
      <aside
        className="fixed top-0 left-0 h-full w-[230px] glass bg-background/70 backdrop-filter backdrop-blur-xl border-r border-border shadow-2xl transition-all duration-300 ease-in-out hidden md:flex md:flex-col z-50"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4">
          <Link href="/home" className="flex gap-3 items-center">
            {/* <div className="relative w-10 h-10 overflow-hidden rounded-full">
              <Image
                src="/logo.svg"
                alt="BlogVerse Logo"
                fill
                className="object-contain animate-pulse"
              />
            </div> */}
            <h1 className={`${raleway.className} text-transparent bg-clip-text bg-gradient-to-r from-primary to-fuchsia-400 text-xl font-bold tracking-wide`}>
              BlogVerse
            </h1>
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="py-4 px-3 flex-1 overflow-y-auto">
          <div className="px-3 mb-2">
            <h2 className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">Menu</h2>
          </div>
          
          <ul className="space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary/10 text-primary border border-primary/20 bg-gradient-to-r from-primary/10 to-fuchsia-400/10' 
                        : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                    }`}
                  >
                    <span className={`${isActive ? 'text-primary' : ''}`}>
                      {link.icon}
                    </span>
                    <span className={`${raleway.className} text-sm ${isActive ? 'font-semibold text-foreground' : ''}`}>
                      {link.label}
                    </span>
                    {link.href === '/notifications' && unreadCount > 0 && (
                      <span className="ml-auto bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                    {isActive && link.href !== '/notifications' && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]"></span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer with theme toggle */}
        <div className="p-4 border-t border-border/50 text-muted-foreground glass bg-background/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground">Appearance</span>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <Copyright size={12} />
              <span className={`${raleway.className}`}>BlogVerse</span>
              <span className="mx-1">•</span>
              <span>{new Date().getFullYear()}</span>
            </div>
            <span>{currentTime}</span>
          </div>
        </div>
      </aside>

      {/* Mobile bottom navigation — shown only on small screens */}
      <nav className="fixed bottom-0 left-0 right-0 glass bg-background/80 backdrop-blur-xl border-t border-border z-40 md:hidden">
        <div className="flex justify-around items-center py-2">
          {links.slice(0, 5).map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-0.5 p-2 rounded-lg transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <span className="relative">
                  {link.icon}
                  {link.href === '/notifications' && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </span>
                <span className="text-[10px]">{link.label}</span>
              </Link>
            );
          })}
          {/* Theme toggle in bottom bar */}
          <div className="flex flex-col items-center gap-0.5 p-2">
            <ThemeToggle />
            <span className="text-[10px] text-muted-foreground">Theme</span>
          </div>
        </div>
      </nav>
    </>
  );
};

export default SidebarToggle;