'use client'
import { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import {Poppins} from 'next/font/google'
import { Dancing_Script } from 'next/font/google';
import { Raleway } from 'next/font/google';
import Image from 'next/image';


const dScript = Raleway({
  weight: '400',
  subsets: ['latin'],
});

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
})
const links = [
  { href: '/', label: 'Home' },
  { href: '/profile', label: 'Profile' },
  { href: '/myblogs', label: 'My Blogs' },
];

const SidebarToggle = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <button
        className="md:hidden p-2 text-white flex bg-zinc-950/90 text-xl"
        onClick={toggleSidebar}
      >
        ☰
      </button>
      <aside
        className={`fixed w-[300px] top-0 left-0 h-full border-r border-black/10 bg-[#092635] transition-transform transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
        style={{ zIndex: 1000 }}
      >
        <div className='flex justify-between items-center p-6'>
          <div className='flex gap-2 items-center'>
            <Image
              src="/logo.svg" // Replace with your actual logo path
              alt="Mood Diary Logo"
              width={40}
              height={40}
            />
            <div className = {`${dScript.className} text-white md:text=-4xl text-2xl font-extrabold `}>Blog Verse</div>
          </div>
          <button className="md:hidden text-white" onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto">
          {links.map((link) => (
            <li key={link.href} className="p-4 text-white text-lg font-thin transition-all duration-400 hover:text-xl hover:text-black hover:bg-[#9EC8B9]">
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
        <div className="p-4 absolute bottom-0  text-white space-y-1 ">
         <div className='text-base'>
         Developed by <span className=' font-semibold '>Adarsh</span>
        </div> 

          <p className=' text-sm'>
            <span className=' font-bold'>© </span>Copyright <span className=' font-semibold'>2024</span>
          </p>
        </div>
      </aside>
    </>
  );
};

export default SidebarToggle;
