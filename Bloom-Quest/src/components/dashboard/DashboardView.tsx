'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Check, Trash2, Zap, Sparkles, Trophy } from 'lucide-react';

import ChallengeCard from '@/components/dashboard/ChallengeCard';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import StreakCounter from './StreakCounter';
import DynamicPlant from '@/components/plant/DynamicPlant';

import { IUser, IHabit, IChallenge } from '@/types';
import { GAME_CONFIG } from '@/lib/constants';

interface DashboardViewProps {
    initialUser: IUser;
    initialHabits: IHabit[];
    initialChallenge: IChallenge | null;
    isChallengeCompleted: boolean;
}

export default function DashboardView({ initialUser, initialHabits, initialChallenge, isChallengeCompleted }: DashboardViewProps) {
    const router = useRouter();
    const [user, setUser] = useState(initialUser);
    const [habits, setHabits] = useState(initialHabits);
    const [newHabit, setNewHabit] = useState('');
    const [loading, setLoading] = useState(false);



    // ... (imports)

    // ...

    // Calculate XP needed for next stage
    const getNextStageXp = (stage: number) => {
        return GAME_CONFIG.XP_PER_LEVEL[stage] || GAME_CONFIG.XP_PER_LEVEL[GAME_CONFIG.XP_PER_LEVEL.length - 1];
    };

    const nextXp = getNextStageXp(user.plantStage);
    const progress = Math.min((user.xp / nextXp) * 100, 100);

    async function addHabit(e: React.FormEvent) {
        e.preventDefault();
        if (!newHabit) return;
        setLoading(true);

        try {
            const res = await fetch('/api/habits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newHabit, difficulty: 'medium' }),
            });
            if (!res.ok) {
                const data = await res.json();
                alert(data.error || 'Failed to add habit');
                return;
            }
            if (res.ok) {
                const habit = await res.json();
                setHabits([...habits, habit]);
                setNewHabit('');
            }
        } finally {
            setLoading(false);
        }
    }

    async function completeHabit(id: string) {
        // Optimistic update
        const habitIndex = habits.findIndex(h => h._id === id);
        if (habitIndex === -1 || habits[habitIndex].completedToday) return;

        const newHabits = [...habits];
        newHabits[habitIndex] = { ...newHabits[habitIndex], completedToday: true };
        setHabits(newHabits);

        try {
            const res = await fetch(`/api/habits/${id}/complete`, { method: 'POST' });
            const data = await res.json();
            if (data.userXp !== undefined) {
                setUser({
                    ...user,
                    xp: data.userXp,
                    plantStage: data.userStage,
                    streak: data.userStreak,
                    coins: data.userCoins
                });

                // Trigger confetti
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#34d399', '#fbbf24', '#f472b6']
                });
            }
        } catch (e) {
            // Revert if failed
        }
    }

    async function deleteHabit(id: string) {
        const newHabits = habits.filter(h => h._id !== id);
        setHabits(newHabits);
        await fetch(`/api/habits/${id}`, { method: 'DELETE' });
    }

    async function resetProgress() {
        if (!confirm("Are you sure you want to reset your garden? This will reset your Plant, XP, and Streak to zero. Your habits will remain.")) return;

        try {
            const res = await fetch('/api/user/reset', { method: 'POST' });
            if (res.ok) {
                const data = await res.json();
                setUser({ ...user, xp: 0, plantStage: 0, streak: 0 });
                // alert("Garden reset! Fresh start. 🌱");
                router.refresh(); // Refresh server components
            }
        } catch (error) {
            // alert("Failed to reset");
        }
    }

    return (
        <div className="grid gap-8 md:grid-cols-12 lg:gap-10">
            {/* Left Column: Garden & Status (Span 4) */}
            <div className="md:col-span-5 lg:col-span-4 space-y-6">
                <Card className="relative border-none overflow-hidden h-[500px] group ring-1 ring-white/20 dark:ring-white/5 shadow-2xl shadow-emerald-900/10 flex flex-col">
                    <div className="absolute inset-0 z-0 select-none">
                        {/* Dynamic Backgrounds */}
                        {(!user.equippedItems?.background || user.equippedItems.background === 'bg_default') && (
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-emerald-50 dark:from-slate-900 dark:to-emerald-950/30" />
                        )}
                        {user.equippedItems?.background === 'bg_night' && (
                            <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#312e81]" />
                        )}
                        {user.equippedItems?.background === 'bg_rain' && (
                            <div className="absolute inset-0 bg-gradient-to-b from-slate-400 to-slate-300 dark:from-slate-800 dark:to-slate-900" />
                        )}

                        {/* Background Image Layer (if we had explicit images for backgrounds, we'd overlap them here) */}
                        {(!user.equippedItems?.background || user.equippedItems.background === 'bg_default') && (
                            <img
                                src="/plants/garden_bg.png"
                                alt="Garden"
                                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
                            />
                        )}


                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 z-10" />
                    </div>

                    <CardHeader className="relative z-20 flex flex-row items-center justify-between pb-0 pt-6 px-6 shrink-0">
                        <div className="flex flex-col">
                            <h2 className="text-xl font-bold text-white drop-shadow-md tracking-tight">{user.name}&apos;s Garden</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10 shadow-sm transition-transform hover:scale-105 cursor-default">
                                    <span className="text-yellow-300 drop-shadow-sm">🪙</span>
                                    <span className="text-white font-bold text-sm">{user.coins || 0}</span>
                                </div>
                                <button
                                    onClick={resetProgress}
                                    className="bg-white/10 hover:bg-red-500/20 text-white/70 hover:text-red-200 px-2 py-1 rounded-lg text-xs font-medium transition-colors border border-white/5 backdrop-blur-sm"
                                    title="Reset Progress"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                        <StreakCounter streak={user.streak} />
                    </CardHeader>

                    <CardContent className="relative z-20 flex flex-col flex-1 justify-end pb-6 px-6 min-h-0">
                        <div
                            className="relative flex-1 flex items-end justify-center pb-4 group/plant cursor-pointer"
                            onClick={() => router.push('/garden')}
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/20 blur-[50px] rounded-full opacity-50 group-hover/plant:opacity-80 transition-opacity duration-700" />

                            <div className="relative transform transition-transform duration-500 group-hover/plant:scale-105 group-hover/plant:-translate-y-2 drop-shadow-2xl">
                                <DynamicPlant
                                    stage={3}
                                    potType={user.equippedItems?.pot}
                                    decorType={user.equippedItems?.decor}
                                />
                            </div>

                            <span className="absolute bottom-10 opacity-0 group-hover/plant:opacity-100 transition-all duration-300 bg-white/90 text-emerald-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg transform translate-y-4 group-hover/plant:translate-y-0 z-30">
                                Enter Garden
                            </span>
                        </div>

                        <div className="space-y-2 mt-auto bg-black/20 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                            <div className="flex justify-between text-xs font-bold text-white uppercase tracking-wider drop-shadow-md">
                                <span>Level {user.plantStage + 1}</span>
                                <span>{user.xp} / {nextXp} XP</span>
                            </div>
                            <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/10 shadow-inner">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-400 to-green-300 shadow-[0_0_15px_rgba(52,211,153,0.6)] relative overflow-hidden"
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/30 skew-x-12 animate-[shimmer_2s_infinite]" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Challenges & Habits (Span 8) */}
            <div className="md:col-span-7 lg:col-span-8 space-y-8">
                {/* Greetings */}
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-emerald-950 dark:text-emerald-50 mb-1">
                        Good {new Date().getHours() < 12 ? 'Morning' : 'Evening'}, {user.name.split(' ')[0]}
                    </h2>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-400" />
                        Ready to grow something beautiful today?
                    </p>
                </div>

                {initialChallenge && (
                    <ChallengeCard
                        challenge={initialChallenge}
                        isCompleted={isChallengeCompleted}
                        onComplete={() => setUser(u => ({ ...u, xp: u.xp + 50, coins: (u.coins || 0) + 50 }))}
                    />
                )}

                <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2 text-emerald-950 dark:text-emerald-100">
                            <Zap className="h-5 w-5 text-emerald-500 fill-emerald-500" />
                            Daily Habits
                        </h3>
                        <span className="text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full">
                            {habits.filter(h => h.completedToday).length}/{habits.length} Completed
                        </span>
                    </div>

                    <div className="space-y-4">
                        <form onSubmit={addHabit} className="flex gap-3">
                            <Input
                                placeholder="🌱 Plant a new habit..."
                                value={newHabit}
                                onChange={(e) => setNewHabit(e.target.value)}
                                disabled={loading}
                                className="bg-white/60 dark:bg-black/20 border-white/20 focus-visible:ring-emerald-500 h-10 shadow-inner"
                            />
                            <Button type="submit" size="icon" disabled={loading || !newHabit} className="h-10 w-10 shrink-0 rounded-xl bg-emerald-600 hover:bg-emerald-500 shadow-md hover:shadow-lg transition-all">
                                <Plus className="h-5 w-5" />
                            </Button>
                        </form>

                        <div className="space-y-3 mt-4">
                            {habits.length === 0 && (
                                <div className="text-center py-12 flex flex-col items-center gap-3 opacity-60">
                                    <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                        <Sprout className="h-6 w-6 text-emerald-500" />
                                    </div>
                                    <p className="text-sm font-medium">Your garden is empty. Add a habit to start growing!</p>
                                </div>
                            )}

                            {habits.map((habit) => (
                                <div
                                    key={habit._id}
                                    className={cn(
                                        "group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none",
                                        habit.completedToday
                                            ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/30 shadow-none opacity-80 scale-[0.99]"
                                            : "bg-white/80 dark:bg-zinc-800/50 border-white/40 hover:border-emerald-200 dark:hover:border-emerald-700/50 hover:shadow-lg hover:-translate-y-0.5"
                                    )}
                                    onClick={() => completeHabit(habit._id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={cn(
                                                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                                                habit.completedToday
                                                    ? "bg-emerald-500 border-emerald-500 scale-110 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                                                    : "border-muted-foreground/30 group-hover:border-emerald-500/50 bg-transparent"
                                            )}
                                        >
                                            {habit.completedToday && <Check className="h-3.5 w-3.5 text-white stroke-[3]" />}
                                        </div>
                                        <span className={cn(
                                            "font-medium text-base transition-all duration-300",
                                            habit.completedToday
                                                ? "text-muted-foreground line-through decoration-emerald-500/30 decoration-2"
                                                : "text-foreground group-hover:text-emerald-900 dark:group-hover:text-emerald-50"
                                        )}>
                                            {habit.title}
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteHabit(habit._id);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground/50 hover:text-red-500 transition-all rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%) skewX(12deg); }
                    100% { transform: translateX(200%) skewX(12deg); }
                }
            `}</style>
        </div>
    );
}

// Helper icon component since Sprout wasn't imported
function Sprout(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M7 20h10" />
            <path d="M10 20c5.5-2.5.8-6.4 3-10" />
            <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.2.4-4.8-.3-1.1-.6-2.3-1.9-3.3-3.7C2.5 5 2.3 2 2 2c5 1.1 8 3.3 8 7.4Z" />
            <path d="M18.5 14.5c-.9-2.6-2.2-4.1-3.9-4.5 1.6-2.5 3.5-3.5 5.7-4.2.8.5 1.7 1.2 2.7 2.1.2 1.3.4 3.7-1.3 5.4-1 .9-2.2 1.3-3.2 1.2Z" />
        </svg>
    )
}
