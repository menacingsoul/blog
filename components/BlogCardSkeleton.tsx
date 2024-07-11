// components/BlogCardSkeleton.tsx
const BlogCardSkeleton = () => (
  <div className="max-w-full h-56 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-white/20 to-white/30 backdrop-filter backdrop-blur-lg border border-white/30 hover:border-white/50 hover:shadow-2xl transition-all duration-300 transform cursor-pointer animate-pulse">
    <div className=" p-2">
    <div className="relative overflow-hidden rounded-full bg-gray-200 h-12 w-12"></div>
    <div className="mt-3">
      <div className="bg-gray-200 h-8 w-2/4 mb-2 rounded-lg"></div>
      <div className="bg-gray-200 h-5 w-11/12 mb-2 rounded"></div>
      <div className="bg-gray-200 h-5 w-11/12 mb-2 rounded"></div>
      <div className="bg-gray-200 h-5 w-11/12 mb-2 rounded"></div>
    </div>
    </div>
   
  </div>
);

export default BlogCardSkeleton;
