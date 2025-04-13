// components/FeaturedBlogCardSkeleton.tsx

const FeaturedBlogCardSkeleton = () => (
  <div className="bg-gradient-to-br from-purple-600/10 to-indigo-600/10 border border-purple-500/20 rounded-xl overflow-hidden shadow-lg flex flex-col md:flex-row animate-pulse">
    {/* Left side content skeleton */}
    <div className="p-6 md:p-8 flex-1">
      {/* Author info skeleton */}
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-full bg-gray-600/30 w-12 h-12"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-600/30 w-32 rounded-md mb-2"></div>
          <div className="h-3 bg-gray-600/20 w-24 rounded-md"></div>
        </div>
        <div className="flex items-center">
          <div className="h-3 bg-gray-600/20 w-12 rounded-md"></div>
        </div>
      </div>
      
      {/* Featured badge skeleton */}
      <div className="mb-3">
        <div className="bg-indigo-600/20 w-20 h-5 rounded-full"></div>
      </div>
      
      {/* Title skeleton */}
      <div className="h-8 bg-gray-600/30 w-full rounded-md mb-3"></div>
      <div className="h-8 bg-gray-600/30 w-5/6 rounded-md mb-4"></div>
      
      {/* Description skeleton */}
      <div className="h-4 bg-gray-600/20 w-full rounded-md mb-2"></div>
      <div className="h-4 bg-gray-600/20 w-full rounded-md mb-2"></div>
      <div className="h-4 bg-gray-600/20 w-full rounded-md mb-2"></div>
      <div className="h-4 bg-gray-600/20 w-4/5 rounded-md mb-6"></div>
      
      {/* Read more button skeleton */}
      <div className="flex justify-end">
        <div className="h-4 bg-indigo-600/30 w-28 rounded-md"></div>
      </div>
    </div>
    
    {/* Right side decorative area skeleton */}
    <div className="hidden md:block w-1/3 bg-gradient-to-br from-indigo-800/10 to-purple-700/10 relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-indigo-500/10"></div>
      </div>
    </div>
  </div>
);

export default FeaturedBlogCardSkeleton;