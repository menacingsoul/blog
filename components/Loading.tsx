import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  className?: string;
  fullScreen?: boolean;
}

export default function Loading({ className, fullScreen = true }: LoadingProps) {
  return (
    <div 
      className={cn(
        "flex items-center justify-center transition-all duration-300",
        fullScreen ? "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" : "h-full w-full py-20",
        className
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center">
          {/* Outer Ring */}
          <div className="h-16 w-16 rounded-full border-4 border-primary/10" />
          
          {/* Animated Spinner */}
          <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent" />
          
        </div>
        
        <div className="flex flex-col items-center gap-1">
          <p className="text-xs text-muted-foreground animate-pulse font-medium uppercase tracking-[0.2em]">Loading</p>
        </div>
      </div>
    </div>
  );
}
