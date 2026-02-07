'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Check, Trash2, Zap, Sparkles, Sprout } from 'lucide-react';

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

// Parent staggered container
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

// Child item animation
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 12 } }
};

export default function DashboardView({ initialUser, initialHabits, initialChallenge, isChallengeCompleted }: DashboardViewProps) {
    const router = useRouter();
    const [user, setUser] = useState(initialUser);
    const [habits, setHabits] = useState(initialHabits);
    const [newHabit, setNewHabit] = useState('');
    const [loading, setLoading] = useState(false);

    const getNextStageXp = (stage: number) => {
        return GAME_CONFIG.XP_PER_LEVEL[stage] || GAME_CONFIG.XP_PER_LEVEL[GAME_CONFIG.XP_PER_LEVEL.length - 1];
    };

    const nextXp = getNextStageXp(user.plantStage);
    const progress = Math.min((user.xp / nextXp) * 100, 100);

    async function addHabit(e: React.FormEvent) {
        e.preventDefault();
        if (!newHabit.trim()) return;
        setLoading(true);
        try {
            const res = await fetch('/api/habits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newHabit.trim(), difficulty: 'medium' }),
            });
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
    // 1. Pehle check karein ki kahin pehle se complete toh nahi hai
    const target = habits.find(h => h._id === id);
    if (!target || target.completedToday) return;

    // 2. INSTANT UI UPDATE: Database ka wait kare bina screen update karein
    setHabits(prev => prev.map(h => 
        h._id === id ? { ...h, completedToday: true } : h
    ));

    try {
        // 3. Background mein database update karein
        const res = await fetch(`/api/habits/${id}/complete`, { method: 'POST' });
        const data = await res.json();
        
        // 4. User stats (XP/Coins) update karein
        if (data.userXp !== undefined) {
            setUser(prev => ({ ...prev, xp: data.userXp, coins: data.userCoins }));
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.7 } });
        }
    } catch (e) {
        console.error("Update fail ho gaya");
        // Error aaye toh refresh karke purana state dikha sakte hain (optional)
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
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-8 md:grid-cols-12 max-w-7xl mx-auto p-4"
        >
            {/* GARDEN CARD */}
            {/* LEFT COLUMN: The Plant Garden */}
{/* Left Column: Garden & Status (Span 4) */}
            {/* Left Column: Garden & Status */}
<div className="md:col-span-5 lg:col-span-4 space-y-6">
  <Card
    className="
    relative overflow-hidden h-[500px] flex flex-col
    bg-white/10 dark:bg-white/5
    backdrop-blur-xl
    border border-white/20 dark:border-white/10
    shadow-2xl shadow-emerald-900/10
    transition-all duration-500
    hover:-translate-y-1 hover:shadow-emerald-500/20
    group
  "
  >
    {/* Background Layers */}
    <div className="absolute inset-0 z-0 select-none">

      {/* Dynamic Backgrounds */}
      {(!user.equippedItems?.background ||
        user.equippedItems.background === "bg_default") && (
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-emerald-50 dark:from-slate-900 dark:to-emerald-950/40 animate-[pulse_10s_ease-in-out_infinite]" />
      )}

      {user.equippedItems?.background === "bg_night" && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#312e81]" />
      )}

      {user.equippedItems?.background === "bg_rain" && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-400 to-slate-300 dark:from-slate-800 dark:to-slate-900" />
      )}

      {/* Garden Texture */}
      {(!user.equippedItems?.background ||
        user.equippedItems.background === "bg_default") && (
        <img
          src="/plants/garden_bg.png"
          alt="Garden"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
      )}

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 z-10" />

      {/* Glass sweep highlight */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700">
        <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-12 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-1000" />
      </div>
    </div>

    {/* Header */}
    <CardHeader className="relative z-20 flex flex-row items-center justify-between pb-0 pt-6 px-6 shrink-0">
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-white drop-shadow-md tracking-tight">
          {user.name}&apos;s Garden
        </h2>

        <div className="flex items-center gap-2 mt-1">
          {/* Coin Glass Badge */}
          <div className="
            bg-white/15 backdrop-blur-xl
            border border-white/30
            px-3 py-1 rounded-full
            flex items-center gap-1.5
            shadow-lg
            hover:bg-white/25
            transition-all duration-300
          ">
            <span className="text-yellow-300">🪙</span>
            <span className="text-white font-bold text-sm">
              {user.coins || 0}
            </span>
          </div>

          <button
            onClick={resetProgress}
            className="
              bg-white/10 hover:bg-red-500/25
              text-white/70 hover:text-red-200
              px-2 py-1 rounded-lg text-xs font-medium
              transition-all duration-200
              border border-white/10 backdrop-blur-sm
              active:scale-95
            "
            title="Reset Progress"
          >
            Reset
          </button>
        </div>
      </div>

      <StreakCounter streak={user.streak} />
    </CardHeader>

    {/* Content */}
    <CardContent className="relative z-20 flex flex-col flex-1 justify-end pb-6 px-6 min-h-0">

      {/* Plant Section */}
      <div
        className="relative flex-1 flex items-end justify-center pb-4 group/plant cursor-pointer"
        onClick={() => router.push("/garden")}
      >
        {/* Glow halo */}
        <div className="
          absolute top-1/2 left-1/2
          -translate-x-1/2 -translate-y-1/2
          w-44 h-44 bg-white/20 blur-[55px]
          rounded-full opacity-50
          group-hover/plant:opacity-80
          transition duration-700
        " />

        {/* Plant with parallax hover */}
        <div className="
          relative transform transition duration-500
          group-hover/plant:scale-110
          group-hover/plant:-translate-y-3
          group-hover/plant:rotate-1
          drop-shadow-2xl
        ">
          <DynamicPlant
            stage={3}
            potType={user.equippedItems?.pot}
            decorType={user.equippedItems?.decor}
          />
        </div>

        {/* Enter Garden glass tag */}
        <span className="
          absolute bottom-10 opacity-0
          group-hover/plant:opacity-100
          transition-all duration-300
          bg-white/20 backdrop-blur-xl
          text-white text-xs font-bold
          px-4 py-1.5 rounded-full
          shadow-lg border border-white/30
          transform translate-y-4
          group-hover/plant:translate-y-0
          z-30
        ">
          Enter Garden
        </span>
      </div>

      {/* Progress Section */}
      <div className="
        space-y-2 mt-auto
        bg-black/25 backdrop-blur-md
        p-3 rounded-xl border border-white/15
      ">
        <div className="flex justify-between text-xs font-bold text-white uppercase tracking-wider">
          <span>Level {user.plantStage + 1}</span>
          <span>{user.xp} / {nextXp} XP</span>
        </div>

        <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/10 shadow-inner">
          <div
            className="
              h-full relative overflow-hidden
              bg-gradient-to-r from-emerald-400 to-green-300
              shadow-[0_0_15px_rgba(52,211,153,0.6)]
              transition-all duration-500
            "
            style={{ width: `${progress}%` }}
          >
            {/* shimmer */}
            <div className="absolute inset-0 bg-white/30 skew-x-12 animate-[shimmer_2s_infinite]" />
            {/* glow tip */}
            <div className="absolute right-0 top-0 h-full w-6 bg-white/40 blur-sm opacity-70 animate-pulse" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</div>

            {/* HABITS & QUESTS */}
            <div className="md:col-span-7 lg:col-span-8 space-y-8">
                <div className="relative mb-7 px-2 py-4 group">
    {/* Background Glow - Very subtle, no borders */}
    <div className="absolute -top-10 -left-10 w-64 h-64 bg-emerald-500/10 dark:bg-emerald-400/5 blur-[120px] rounded-full pointer-events-none" />
    
    <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
    >
        {/* Top Row: Time Icon & Label */}
        <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">
                {new Date().getHours() < 12 ? '☀️' : new Date().getHours() < 18 ? '🌤️' : '🌙'}
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600/60 dark:text-emerald-400/60">
                {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'} Session
            </span>
        </div>

        {/* Main Heading */}
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-emerald-950 dark:text-white leading-[1.05]">
            Hey, 
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-emerald-200 bg-clip-text text-transparent ml-3">
                {user.name.split(' ')[0]}
            </span>
        </h2>

        {/* Subtext */}
        <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-emerald-900/40 dark:text-white/30 font-bold text-md flex items-center gap-3"
        >
            <Sparkles className="h-5 w-5 text-amber-400/60" />
            Ready to grow something beautiful today?
        </motion.p>
    </motion.div>
</div>

                {initialChallenge && (
                    <motion.div variants={itemVariants}>
                        <ChallengeCard
                            challenge={initialChallenge}
                            isCompleted={isChallengeCompleted}
                            onComplete={() => setUser(u => ({ ...u, xp: u.xp + 50, coins: (u.coins || 0) + 50 }))}
                        />
                    </motion.div>
                )}

                <motion.div 
                    variants={itemVariants}
                    className="bg-white/10 dark:bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-7 border border-white/40 dark:border-white/10 shadow-2xl"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-emerald-950 dark:text-emerald-50 flex items-center gap-3">
                            <Zap className="text-emerald-500 fill-emerald-500 h-5 w-5" />
                            Daily Habits
                        </h3>
                        <div className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-xl text-[11px] font-black border border-emerald-500/20">
                            {habits.filter(h => h.completedToday).length}/{habits.length} DONE
                        </div>
                    </div>

                    <form onSubmit={addHabit} className="flex gap-3 mb-6">
                        <Input
                            placeholder="🌱 Plant a new habit..."
                            value={newHabit}
                            onChange={(e) => setNewHabit(e.target.value)}
                            className="h-12 rounded-xl bg-white/40 dark:bg-black/40 border-white/40 dark:border-white/10 text-base"
                        />
                        <Button type="submit" className="h-12 w-12 rounded-xl bg-emerald-600 hover:bg-emerald-500">
                            <Plus className="h-5 w-5" />
                        </Button>
                    </form>

                    <div className="space-y-3">
    <AnimatePresence mode="popLayout">
        {habits.map((habit) => (
            <motion.div
                key={habit._id}
                layout
                variants={itemVariants}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: 20 }}
                
                whileHover={{ scale: 1.01, borderColor: "rgba(16, 185, 129, 0.4)" }}
                onClick={() => completeHabit(habit._id)}
                className={cn(
                    "group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none",
                    habit.completedToday 
                        ? "bg-emerald-500/15 border-emerald-500/40 shadow-inner" // Click hote hi ye active hoga
                        : "bg-white/30 dark:bg-white/5 border-white/40 dark:border-white/10 shadow-sm"
                )}
            >
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "h-7 w-7 rounded-xl border-2 flex items-center justify-center transition-all duration-500",
                        habit.completedToday 
                            ? "bg-emerald-500 border-emerald-500 shadow-lg" 
                            : "border-emerald-200 dark:border-white/20 bg-white/20"
                    )}>
                        {habit.completedToday && <Check className="text-white h-4 w-4 stroke-[4]" />}
                    </div>
                    <span className={cn(
                        "font-bold text-base transition-all duration-300",
                        habit.completedToday 
                            ? "text-emerald-900 dark:text-emerald-300 line-through opacity-70" 
                            : "text-emerald-950 dark:text-white"
                    )}>
                        {habit.title}
                    </span>
                </div>
                
                <button 
                    onClick={(e) => { e.stopPropagation(); deleteHabit(habit._id); }} 
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-500 transition-all"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </motion.div>
        ))}
    </AnimatePresence>
</div>
                </motion.div>
            </div>
        </motion.div>
    );
}

