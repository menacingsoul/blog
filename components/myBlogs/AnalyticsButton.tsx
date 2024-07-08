// components/BlogCard.tsx
'use client'

import Link from 'next/link';
import { BarChart } from 'lucide-react';

  
  const AnalyticsButton =({id})=> {
  return (
    <Link href={`/myblogs/analytics/${id}`} className=' cursor-pointer'>
        <div className=' bg-orange-400 z-50 cursor-pointer bg-opacity-100  font-semibold text-sm md:text-lg text-white flex p-3 rounded-md w-fit gap-x-1 mb-3'><BarChart />Analytics</div>
    </Link>
  );
}

export default AnalyticsButton;
