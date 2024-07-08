// components/BlogCard.tsx
'use client'

import Link from 'next/link';
import { Edit } from 'lucide-react';

  
  const EditorCard =({id})=> {
  return (
    <Link href={`/myblogs/publishededitor/${id}`} className=' cursor-pointer'>
        <div className=' bg-white z-50 cursor-pointer bg-opacity-100 text-sm md:text-lg text-black flex p-3 rounded-md w-fit gap-x-1 mb-3'><Edit />Edit</div>
    </Link>
  );
}

export default EditorCard;
