'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Menu, Home, NotebookPen, User2, Copyright } from 'lucide-react';
import { Raleway, Poppins } from 'next/font/google';

const raleway = Raleway({
  weight: ['400', '700'],
  subsets: ['latin'],
});

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
});

const links = [
  { href: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
  { href: '/myblogs', label: 'My Blogs', icon: <NotebookPen className="w-5 h-5" /> },
  { href: '/profile', label: 'Profile', icon: <User2 className="w-5 h-5" /> },
];

const SidebarToggle = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('/');

  // Get and set active link on client side
  useEffect(() => {
    setActiveLink(window.location.pathname);
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
          className="fixed inset-0 bg-black/40 md:hidden z-40 backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Toggle button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-full bg-[#092635] text-white shadow-lg hover:bg-[#0d3447] transition-all duration-300"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[280px] bg-[#092635] shadow-2xl transition-all duration-300 ease-in-out transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-50`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <div className="flex gap-3 items-center">
            <div className="relative w-9 h-9 overflow-hidden rounded-md shadow-inner">
              <Image
                src="/logo.svg"
                alt="Blog Verse Logo"
                fill
                className="object-contain"
              />
            </div>
            <h1 className={`${raleway.className} text-white text-xl font-bold tracking-wide`}>
              Blog Verse
            </h1>
          </div>
          
          <button 
            className="md:hidden text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="py-6">
          <ul className="space-y-1 px-3">
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-[#9EC8B9] text-[#092635] font-medium' 
                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className={`${isActive ? 'text-[#092635]' : 'text-white/80'}`}>
                      {link.icon}
                    </span>
                    <span className={`${poppins.className} ${isActive ? 'font-medium' : ''}`}>
                      {link.label}
                    </span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#092635]"></span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-white/10 bg-[#071e29] text-white/80">
          <div className="mb-2 flex items-center gap-2">
            <span className={`${raleway.className} font-medium text-sm`}>
              Developed by Adarsh
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-white/60">
            <Copyright size={12} />
            <span className={`${raleway.className}`}>Blog Verse</span>
            <span className="mx-1">•</span>
            <span>2025</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarToggle;