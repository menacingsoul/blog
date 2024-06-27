import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-radial from-gray-900 via-slate-900 to-black bg-opacity-100">
    <div className=" cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-[#E2DFD0]/20 to-[#E2DFD0]/30 backdrop-filter backdrop-blur-lg
      border border-[#E2DFD0]/30 shadow-lg  text-white p-8 ">
    <Loader2 className="mr-2 h-20 w-20 animate-spin" /> 
    </div>
  </div>
  );
}