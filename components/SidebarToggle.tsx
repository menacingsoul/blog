'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Menu, Home, NotebookPen, User2, Copyright, LogOut, Search, Bell, BookOpen, Users } from 'lucide-react';
import { Raleway } from 'next/font/google';

const raleway = Raleway({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
});

const links = [
  { href: '/home', label: 'Home', icon: <Home className="w-5 h-5" /> },
  { href: '/explore', label: 'Explore', icon: <Search className="w-5 h-5" /> },
  { href: '/myblogs', label: 'My Blogs', icon: <BookOpen className="w-5 h-5" /> },
  { href: '/community', label: 'Community', icon: <Users className="w-5 h-5" /> },
  { href: '/notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
  { href: '/profile', label: 'Profile', icon: <User2 className="w-5 h-5" /> },
];

const SidebarToggle = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('/');
  const [currentTime, setCurrentTime] = useState('');

  // Get and set active link on client side
  useEffect(() => {
    setActiveLink(window.location.pathname);
    
    // Set current time for the sidebar footer
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    
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
        className={`fixed top-0 left-0 h-full w-[280px] bg-zinc-900/95 backdrop-filter backdrop-blur-lg border-r border-zinc-700/30 shadow-2xl transition-all duration-300 ease-in-out transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-50`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6">
          <div className="flex gap-3 items-center">
            <div className="relative w-10 h-10 overflow-hidden rounded-full">
              <Image
                src="/logo.svg"
                alt="Blog Verse Logo"
                fill
                className="object-contain animate-pulse"
              />
            </div>
            <h1 className={`${raleway.className} text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400 text-xl font-bold tracking-wide`}>
              Blog Verse
            </h1>
          </div>
          
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
          <div className="mb-4 px-3">
            {/* <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-zinc-800/70 border border-zinc-700/50 text-zinc-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={16} />
            </div> */}
          </div>
          
          <div className="px-3 mb-2">
            <h2 className="text-xs uppercase text-zinc-500 font-semibold tracking-wider">Menu</h2>
          </div>
          
          <ul className="space-y-1">
            {links.map((link) => {
              const isActive = activeLink === link.href;
              return (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    onClick={() => {
                      setActiveLink(link.href);
                      closeSidebar();
                    }}
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
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
          
          <div className="mt-8 px-3">
            <div className="bg-gradient-to-r from-indigo-600/10 to-fuchsia-600/10 border border-indigo-500/20 rounded-xl p-4">
              <h3 className="text-white text-sm font-semibold mb-2">Write a new blog</h3>
              <p className="text-zinc-400 text-xs mb-3">Share your thoughts with the community</p>
              <Link href="/create-blog">
                <button className="w-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 text-white rounded-lg py-2 text-sm font-medium transition-all duration-300">
                  Create Post
                </button>
              </Link>
            </div>
          </div>
        </nav>

        

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800 text-zinc-500">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <Copyright size={12} />
              <span className={`${raleway.className}`}>Blog Verse</span>
              <span className="mx-1">•</span>
              <span>2025</span>
            </div>
            <span>{currentTime}</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarToggle;