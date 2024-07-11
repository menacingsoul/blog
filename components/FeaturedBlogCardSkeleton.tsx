// components/BlogCardSkeleton.tsx
const FeaturedBlogCardSkeleton = () => (
    <div className="max-w-full h-64 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-white/20 to-white/30 backdrop-filter backdrop-blur-lg border border-white/30 hover:border-white/50 hover:shadow-2xl transition-all duration-300 transform cursor-pointer animate-pulse">
      <div className=" flex flex-col sm:flex-row p-2">
        <div className=" h-60 bg-gray-300 w-1/3 rounded-lg"></div>
      <div className=" px-2 w-2/3">
      <div className="bg-gray-200 h-8 w-2/6 mb-2 rounded-lg"></div>
       <div className="bg-gray-200 h-4 w-full mb-2 rounded"></div>
       <div className="bg-gray-200  h-44 w-full mb-2 rounded-lg"></div>
    </div>
      
      </div>
     
    </div>
  );
  
  export default FeaturedBlogCardSkeleton;
  