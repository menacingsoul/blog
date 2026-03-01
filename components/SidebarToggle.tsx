'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X, Menu, Home, User2, Copyright, LogOut, Search, Bell, BookOpen, Bookmark } from 'lucide-react';
import { Raleway } from 'next/font/google';
import { fetchNotifications } from '@/utils/api';

const raleway = Raleway({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
});

const links = [
  { href: '/home', label: 'Home', icon: <Home className="w-5 h-5" /> },
  { href: '/myblogs', label: 'My Blogs', icon: <BookOpen className="w-5 h-5" /> },
  { href: '/blog/blogs', label: 'Explore', icon: <Search className="w-5 h-5" /> },
  { href: '/bookmarks', label: 'Bookmarks', icon: <Bookmark className="w-5 h-5" /> },
  { href: '/notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
  { href: '/profile', label: 'Profile', icon: <User2 className="w-5 h-5" /> },
];

const SidebarToggle = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    const interval = setInterval(loadUnread, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Backdrop overlay when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 md:hidden z-40 backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Toggle button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-full bg-zinc-800/90 backdrop-filter backdrop-blur-lg text-white shadow-lg hover:bg-zinc-700 transition-all duration-300"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[230px] bg-zinc-900/95 backdrop-filter backdrop-blur-lg border-r border-zinc-700/30 shadow-2xl transition-all duration-300 ease-in-out transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-50`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6">
          <Link href="/home" className="flex gap-3 items-center">
            <div className="relative w-10 h-10 overflow-hidden rounded-full">
              <Image
                src="/logo.svg"
                alt="BlogVerse Logo"
                fill
                className="object-contain animate-pulse"
              />
            </div>
            <h1 className={`${raleway.className} text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400 text-xl font-bold tracking-wide`}>
              BlogVerse
            </h1>
          </Link>
          
          <button 
            className="md:hidden text-zinc-400 hover:text-white p-1.5 rounded-full hover:bg-zinc-800 transition-colors"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="py-4 px-3">
          <div className="px-3 mb-2">
            <h2 className="text-xs uppercase text-zinc-500 font-semibold tracking-wider">Menu</h2>
          </div>
          
          <ul className="space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    onClick={closeSidebar}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-indigo-600/20 to-fuchsia-600/20 text-white border border-indigo-500/30' 
                        : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-white'
                    }`}
                  >
                    <span className={`${isActive ? 'text-indigo-400' : ''}`}>
                      {link.icon}
                    </span>
                    <span className={`${raleway.className} text-sm ${isActive ? 'font-semibold' : ''}`}>
                      {link.label}
                    </span>
                    {link.href === '/notifications' && unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                    {isActive && link.href !== '/notifications' && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800 text-zinc-500">
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

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-lg border-t border-zinc-700/30 z-40 md:hidden">
        <div className="flex justify-around items-center py-2">
          {links.slice(0, 5).map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-0.5 p-2 rounded-lg transition-colors ${
                  isActive ? 'text-indigo-400' : 'text-zinc-500'
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
        </div>
      </nav>
    </>
  );
};

export default SidebarToggle;