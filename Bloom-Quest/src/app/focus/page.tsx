'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import Navbar from '@/components/layout/Navbar';

import { useGameSounds } from '@/hooks/use-game-sounds';

export default function FocusPage() {
    const router = useRouter();
    const { playSuccess } = useGameSounds();
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'focus' | 'break'>('focus');
    const [coinsEarned, setCoinsEarned] = useState(0);

    const [initialDuration, setInitialDuration] = useState(25); // Track minutes for stats

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            // Timer finished
            setIsActive(false);
            handleComplete();
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, timeLeft]);
    const handleComplete = async () => {
        const minutes = mode === 'focus' ? initialDuration : 0;

        if (minutes > 0) {
            playSuccess(); // Fanfare! 🎺

            // Optimistic Update
            setCoinsEarned(c => c + Math.floor(minutes));

            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 }
            });

            try {
                await fetch('/api/focus/complete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ minutes }) // Send actual duration
                });
            } catch (e) {
                console.error(e);
            }
        }
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(25 * 60);
        setMode('focus');
    };

    const setDuration = (minutes: number) => {
        setIsActive(false);
        setTimeLeft(minutes * 60);
        setInitialDuration(minutes);
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-transparent">
            <Navbar />
            <div className="container py-10 max-w-md mx-auto">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Garden
                </Button>

                <Card className="border-none shadow-xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-900/10">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                            🌱 The Greenhouse
                        </CardTitle>
                        <p className="text-muted-foreground text-sm">Focus to grow your extra seeds!</p>
                        <p className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold mt-1 bg-emerald-100 dark:bg-emerald-900/50 px-3 py-1 rounded-full inline-block">
                            Rate: 1 Minute ⏱️ = 1 Coin 🪙
                        </p>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-8 pt-6">

                        {/* Timer Display */}
                        <div className="relative w-64 h-64 flex items-center justify-center">
                            {/* Plant Animation Placeholder */}
                            <div className={`absolute inset-0 rounded-full border-8 border-emerald-500/20 ${isActive ? 'animate-pulse' : ''}`} />

                            <div className="text-6xl font-mono font-bold text-emerald-800 dark:text-emerald-400">
                                {formatTime(timeLeft)}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-4">
                            <Button
                                size="lg"
                                className="h-16 w-16 rounded-full"
                                onClick={toggleTimer}
                                variant={isActive ? "secondary" : "default"}
                            >
                                {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                            </Button>
                            <Button
                                size="lg"
                                className="h-16 w-16 rounded-full"
                                variant="destructive"
                                onClick={resetTimer}
                            >
                                <Square className="h-5 w-5 fill-current" />
                            </Button>
                        </div>

                        {/* Quick Select */}
                        <div className="grid grid-cols-3 gap-2 w-full mt-4">
                            <Button variant="outline" onClick={() => setDuration(15)} size="sm">15m</Button>
                            <Button variant="outline" onClick={() => setDuration(25)} size="sm">25m</Button>
                            <Button variant="outline" onClick={() => setDuration(60)} size="sm">60m</Button>
                        </div>

                        {coinsEarned > 0 && (
                            <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg font-bold animate-bounce">
                                +{coinsEarned} Coins Earned! 🪙
                            </div>
                        )}

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
