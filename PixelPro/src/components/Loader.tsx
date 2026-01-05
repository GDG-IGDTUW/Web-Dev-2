import { Sparkles } from "lucide-react";

export const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in-up">
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
        
        {/* Main spinner */}
        <div className="relative w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center">
          <div className="absolute inset-1 rounded-full border-2 border-transparent border-t-primary animate-spin-slow" />
          <Sparkles className="w-6 h-6 text-primary animate-pulse" />
        </div>
      </div>
      
      <div className="mt-6 space-y-2 text-center">
        <p className="text-sm font-medium text-foreground">Generating your component...</p>
        <p className="text-xs text-muted-foreground">AI is crafting clean, reusable code</p>
      </div>
      
      {/* Shimmer loading bar */}
      <div className="mt-4 w-48 h-1 rounded-full overflow-hidden bg-muted">
        <div className="h-full w-1/2 rounded-full bg-primary animate-shimmer" />
      </div>
    </div>
  );
};
