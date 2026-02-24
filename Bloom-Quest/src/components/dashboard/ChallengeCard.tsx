

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Check, Sparkles, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IChallenge } from '@/types';

export default function ChallengeCard({ 
    challenge, 
    isCompleted, 
    onComplete 
}: { 
    challenge: IChallenge | null, 
    isCompleted: boolean, 
    onComplete: () => void 
}) {
    const [completed, setCompleted] = useState(isCompleted);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setCompleted(isCompleted);
    }, [isCompleted]);

    async function handleComplete() {
        if (!challenge || completed) return;
        setLoading(true);
        try {
            const res = await fetch('/api/challenges/complete', { method: 'POST' });
            if (res.ok) {
                setCompleted(true);
                onComplete();
            }
        } finally {
            setLoading(false);
        }
    }

    if (!challenge) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            {/* The Glass Container */}
            <Card className="relative border border-white/30 dark:border-white/10 overflow-hidden rounded-[2.5rem] bg-white/40 dark:bg-black/40 backdrop-blur-3xl shadow-2xl group">
                
                {/* Background Glows */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className={cn(
                        "absolute inset-0 transition-opacity duration-1000",
                        completed 
                            ? "bg-emerald-500/10 opacity-40" 
                            : "bg-gradient-to-br from-amber-400/20 via-orange-300/10 to-transparent opacity-70"
                    )} />
                    {/* Shimmer line */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                </div>

                <CardHeader className="relative z-10 p-7 pb-3">
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <motion.div 
                                whileHover={{ rotate: [0, -10, 10, 0] }}
                                className={cn(
                                    "p-3 rounded-2xl shadow-lg border border-white/40",
                                    completed 
                                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                                        : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                                )}
                            >
                                <Trophy className="h-6 w-6" />
                            </motion.div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400/80">
                                    Daily Quest
                                </span>
                                <span className="text-xl font-black tracking-tighter text-emerald-950 dark:text-white leading-tight">
                                    Today&apos;s Goal
                                </span>
                            </div>
                        </div>
                        
                        <div className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-black border backdrop-blur-3xl shadow-sm",
                            completed 
                                ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-700 dark:text-emerald-300" 
                                : "bg-white/60 dark:bg-white/10 border-white/40 text-amber-800 dark:text-amber-200"
                        )}>
                            {completed ? 'COMPLETED' : 'ACTIVE'}
                        </div>
                    </CardTitle>
                </CardHeader>

                <CardContent className="relative z-10 p-7 pt-2">
                    <p className="mb-6 text-base font-bold text-emerald-950/70 dark:text-white/70 leading-relaxed">
                        {challenge.description}
                    </p>
                    
                    {/* Rewards Section with Glass Look */}
                    <div className="flex justify-between items-center bg-white/30 dark:bg-black/20 backdrop-blur-md p-4 rounded-[2rem] border border-white/40 dark:border-white/10 shadow-lg">
                        <div className="flex items-center gap-3 bg-amber-500/20 px-4 py-2 rounded-2xl border border-amber-500/30">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span className="text-sm font-black text-amber-900 dark:text-amber-300">
                                +{challenge.xp} XP
                            </span>
                        </div>

                        <Button
                            onClick={handleComplete}
                            disabled={completed || loading}
                            className={cn(
                                "h-12 px-8 rounded-2xl font-black transition-all active:scale-95 shadow-xl",
                                completed
                                    ? "bg-emerald-500/30 text-emerald-900 dark:text-emerald-300 border border-emerald-500/40 shadow-none cursor-default"
                                    : "bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-amber-500/40 text-white border-none"
                            )}
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : completed ? (
                                <span className="flex items-center gap-2">
                                    <Check className="h-5 w-5 stroke-[4]" /> CLAIMED
                                </span>
                            ) : (
                                "COMPLETE NOW"
                            )}
                        </Button>
                    </div>
                </CardContent>

                {!completed && (
                    <motion.div 
                        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="absolute -right-4 -top-4 pointer-events-none"
                    >
                        <Sparkles className="h-24 w-24 text-amber-400" />
                    </motion.div>
                )}
            </Card>
        </motion.div>
    );
}