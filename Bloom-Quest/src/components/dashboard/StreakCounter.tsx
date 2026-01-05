'use client';

import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakCounterProps {
    streak: number;
}

export default function StreakCounter({ streak }: StreakCounterProps) {
    return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100/10 border border-orange-500/20 rounded-full dark:bg-orange-950/30">
            <Flame
                className={cn(
                    "h-5 w-5 transition-all duration-500",
                    streak > 0 ? "text-orange-500 fill-orange-500 animate-pulse" : "text-muted-foreground"
                )}
            />
            <span className={cn("font-bold text-sm", streak > 0 ? "text-orange-600 dark:text-orange-400" : "text-muted-foreground")}>
                {streak} Day Streak
            </span>
        </div>
    );
}
