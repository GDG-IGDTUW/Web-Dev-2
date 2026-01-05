'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, Sprout, Trophy, Sparkles, Zap, Target, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-purple-50 to-emerald-50 dark:from-indigo-950 dark:via-purple-950 dark:to-emerald-950">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-300 dark:bg-emerald-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Login Button */}
      <div className="fixed top-6 right-6 z-50">
        <Link href="/login">
          <Button
            size="lg"
            variant="outline"
            className="group bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-2 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:border-purple-400 dark:hover:border-purple-600 shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold"
          >
            <LogIn className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Login
          </Button>
        </Link>
      </div>

      <main className="w-full">
        {/* Hero Section */}
        <section className="relative pb-16 pt-20 md:pb-20 md:pt-24 lg:pb-24 lg:pt-32">
          <div className="w-full max-w-7xl mx-auto flex flex-col items-center gap-8 text-center">
            {/* Badge */}
            <div className="group relative inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-xl px-6 py-2.5 text-sm font-semibold shadow-lg border border-white/20 hover:scale-105 transition-all duration-300 cursor-default">
              <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
              <span className="bg-gradient-to-r from-purple-600 to-emerald-600 bg-clip-text text-transparent">
                Gamified Habit Tracking
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/20 to-emerald-400/20 blur-xl group-hover:blur-2xl transition-all"></div>
            </div>

            {/* Main Heading */}
            <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight">
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent animate-gradient">
                Grow Your Habits,
              </span>
              <span className="block mt-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent animate-gradient animation-delay-1000">
                Bloom Your Life.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-[48rem] text-lg sm:text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
              Transform your daily routines into a <span className="text-emerald-600 dark:text-emerald-400 font-bold">thriving digital garden</span>.
              Complete habits, earn rewards, and watch your progress <span className="text-purple-600 dark:text-purple-400 font-bold">blossom</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href="/login">
                <Button
                  size="lg"
                  className="group relative px-8 py-6 text-lg font-bold bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Growing
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400 to-emerald-400 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-lg font-semibold border-2 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 backdrop-blur-sm"
                >
                  Explore Features
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 w-full max-w-2xl">
              {[
                { label: 'Active Users', value: '10K+', icon: '👥' },
                { label: 'Habits Tracked', value: '1M+', icon: '✅' },
                { label: 'Gardens Grown', value: '50K+', icon: '🌱' }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform duration-300">
                  <span className="text-3xl">{stat.icon}</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-emerald-600 bg-clip-text text-transparent">{stat.value}</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative py-16 md:py-20 lg:py-24">
          <div className="w-full max-w-7xl mx-auto">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-6 text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-900/30 px-4 py-2 text-sm font-semibold text-purple-700 dark:text-purple-300">
                <Zap className="h-4 w-4" />
                Features
              </div>
              <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                Everything You Need to
                <span className="block mt-2 bg-gradient-to-r from-purple-600 to-emerald-600 bg-clip-text text-transparent">
                  Build Better Habits
                </span>
              </h2>
              <p className="max-w-[42rem] text-lg text-slate-600 dark:text-slate-300">
                A delightful experience designed to make habit tracking feel less like work and more like play.
              </p>
            </div>

            <div className="mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:max-w-none">
              {[
                {
                  icon: Sprout,
                  title: 'Visual Growth',
                  description: 'Watch your virtual garden flourish as you complete daily tasks. Each habit waters your plants.',
                  gradient: 'from-emerald-500 to-teal-500',
                  bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30'
                },
                {
                  icon: CheckCircle2,
                  title: 'Daily Habits',
                  description: 'Simple, satisfying checkboxes for your routines. Build streaks and celebrate consistency.',
                  gradient: 'from-purple-500 to-pink-500',
                  bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30'
                },
                {
                  icon: Trophy,
                  title: 'Earn Rewards',
                  description: 'Gain XP, unlock achievements, and collect coins to customize your garden sanctuary.',
                  gradient: 'from-amber-500 to-orange-500',
                  bgGradient: 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30'
                },
                {
                  icon: Target,
                  title: 'Focus Sessions',
                  description: 'Pomodoro-style timer to help you concentrate. Turn focus time into garden currency.',
                  gradient: 'from-blue-500 to-cyan-500',
                  bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30'
                },
                {
                  icon: Sparkles,
                  title: 'Daily Quests',
                  description: 'Fresh challenges every day to keep things exciting. Complete them for bonus rewards.',
                  gradient: 'from-violet-500 to-purple-500',
                  bgGradient: 'from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30'
                },
                {
                  icon: Zap,
                  title: 'Streak Power',
                  description: 'Maintain your momentum with streak tracking. The longer you go, the more you grow.',
                  gradient: 'from-rose-500 to-red-500',
                  bgGradient: 'from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-red-950/30'
                }
              ].map((feature, i) => (
                <Card
                  key={i}
                  className={`group relative overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br ${feature.bgGradient}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{
                    backgroundImage: `linear-gradient(135deg, currentColor, transparent)`
                  }}></div>

                  <CardContent className="relative flex flex-col items-center gap-4 p-8 text-center">
                    <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <feature.icon className="h-8 w-8 text-white" />
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}></div>
                    </div>

                    <h3 className="font-bold text-2xl bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                      {feature.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-16 md:py-20 lg:py-24">
          <div className="w-full max-w-5xl mx-auto">
            <div className="mx-auto max-w-4xl">
              <Card className="relative overflow-hidden border-none shadow-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-emerald-600">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <CardContent className="relative flex flex-col items-center gap-6 p-12 md:p-16 text-center">
                  <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                    Ready to Transform Your Habits?
                  </h2>
                  <p className="max-w-[36rem] text-lg text-purple-100">
                    Join thousands of users who are already growing their best selves, one habit at a time.
                  </p>
                  <Link href="/login">
                    <Button
                      size="lg"
                      className="px-10 py-6 text-lg font-bold bg-white text-purple-700 hover:bg-purple-50 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                      Start Your Garden Today
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
          </div>
          <p className="text-center text-sm text-slate-600 dark:text-slate-400 md:text-left">
            © 2024 Bloom Quest. All rights reserved.
          </p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
