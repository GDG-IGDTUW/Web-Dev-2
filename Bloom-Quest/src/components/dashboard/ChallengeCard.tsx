'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

import { IChallenge } from '@/types';

export default function ChallengeCard({ challenge, isCompleted, onComplete }: { challenge: IChallenge | null, isCompleted: boolean, onComplete: () => void }) {
    const [completed, setCompleted] = useState(isCompleted);
    const [loading, setLoading] = useState(false);

    // Sync state if prop changes (important for revalidation)
    useEffect(() => {
        setCompleted(isCompleted);
    }, [isCompleted]);

    async function handleComplete() {
        if (!challenge) return;
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
        <Card className="col-span-1 border-none shadow-lg relative overflow-hidden group">
            {/* Animated Gradient Border/Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 dark:from-amber-900/40 dark:via-amber-800/20 dark:to-amber-900/40 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

            <CardHeader className="relative pb-2 z-10">
                <CardTitle className="text-lg flex items-center justify-between text-amber-800 dark:text-amber-100">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-amber-100 dark:bg-amber-900/50 rounded-lg shadow-sm">
                            <Trophy className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="font-bold tracking-tight">Daily Quest</span>
                    </div>
                    <span className="text-xs font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-700/50">
                        {completed ? 'COMPLETED' : 'ACTIVE'}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
                <p className="mb-4 font-medium text-amber-950 dark:text-amber-50/90 leading-relaxed">
                    {challenge.description}
                </p>
                <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                        <span className="text-lg">✨</span> +{challenge.xp} XP
                    </span>
                    <Button
                        size="sm"
                        className={cn(
                            "rounded-xl transition-all shadow-md active:scale-95",
                            completed
                                ? "bg-green-100 text-green-700 hover:bg-green-200 shadow-none cursor-default"
                                : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white border-none"
                        )}
                        onClick={handleComplete}
                        disabled={completed || loading}
                    >
                        {completed ? <><Check className="mr-1 h-4 w-4" /> Claimed</> : "Complete Quest"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
