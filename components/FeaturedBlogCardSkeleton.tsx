const FeaturedBlogCardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 animate-pulse flex flex-col md:flex-row">
    <div className="w-full md:w-2/5 h-56 md:h-auto bg-muted/50" />
    <div className="flex-1 p-6 md:p-8 space-y-4">
      <div className="flex gap-3">
        <div className="h-4 bg-muted/50 rounded w-20" />
        <div className="h-4 bg-muted/50 rounded w-20" />
      </div>
      <div className="h-7 bg-muted/50 rounded w-3/4" />
      <div className="h-4 bg-muted/50 rounded w-full" />
      <div className="h-4 bg-muted/50 rounded w-2/3" />
      <div className="flex items-center gap-3 pt-4">
        <div className="w-10 h-10 rounded-full bg-muted/50" />
        <div className="space-y-1">
          <div className="h-4 bg-muted/50 rounded w-28" />
          <div className="h-3 bg-muted/50 rounded w-16" />
        </div>
      </div>
    </div>
  </div>
);

export default FeaturedBlogCardSkeleton;