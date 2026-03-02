const BlogCardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 animate-pulse">
    <div className="h-48 bg-muted/50" />
    <div className="p-5 space-y-3">
      <div className="h-5 bg-muted/50 rounded w-3/4" />
      <div className="h-4 bg-muted/50 rounded w-full" />
      <div className="h-4 bg-muted/50 rounded w-2/3" />
      <div className="flex items-center gap-2.5 pt-4 border-t border-border/50">
        <div className="w-8 h-8 rounded-full bg-muted/50" />
        <div className="h-3 bg-muted/50 rounded w-24" />
      </div>
    </div>
  </div>
);

export default BlogCardSkeleton;