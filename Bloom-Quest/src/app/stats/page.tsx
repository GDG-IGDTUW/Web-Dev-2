'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';
import { Trophy, Calendar, Zap, Clock, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

export default function StatsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f8f9fa] dark:bg-zinc-950">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (!stats) return <div className="text-center p-10">Failed to load stats.</div>;

    // Transform history for chart
    const chartData = stats.history.map((day: any) => ({
        name: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        completed: day.habitsCompleted,
        minutes: day.focusMinutes || 0,
        fullDate: day.date
    }));

    return (
        <div className="min-h-screen bg-transparent pt-24">
            <Navbar />
            <div className="container py-10 space-y-8 max-w-6xl mx-auto">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-emerald-950 dark:text-emerald-50">Your Growth</h2>
                    <p className="text-muted-foreground">Visualize your productivity journey.</p>
                </div>

                {/* Stat Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm dark:bg-zinc-900/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total XP</CardTitle>
                            <Zap className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.xp}</div>
                            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm dark:bg-zinc-900/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                            <Trophy className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.streak} Days</div>
                            <p className="text-xs text-muted-foreground">Consistent effort!</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm dark:bg-zinc-900/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Habits Done</CardTitle>
                            <Calendar className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalHabits}</div>
                            <p className="text-xs text-muted-foreground">Total completions</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm dark:bg-zinc-900/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Focus Time</CardTitle>
                            <Clock className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalFocusMinutes}m</div>
                            <p className="text-xs text-muted-foreground">Deep work sessions</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Chart Section */}
                <div className="grid gap-4 md:grid-cols-1">
                    <Card className="col-span-1 border-none shadow-md bg-white dark:bg-zinc-900">
                        <CardHeader>
                            <CardTitle>Activity Overview</CardTitle>
                            <CardDescription>Track your daily habits and focus sessions</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <Tabs defaultValue="habits" className="w-full">
                                <div className="flex justify-end mb-4 pr-6">
                                    <TabsList>
                                        <TabsTrigger value="habits">Habits</TabsTrigger>
                                        <TabsTrigger value="focus">Focus</TabsTrigger>
                                    </TabsList>
                                </div>

                                <div className="h-[350px] w-full">
                                    {chartData.length > 0 ? (
                                        <>
                                            <TabsContent value="habits" className="h-full mt-0">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} allowDecimals={false} />
                                                        <Tooltip
                                                            cursor={{ fill: 'transparent' }}
                                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                                            labelFormatter={(label) => `Date: ${label}`}
                                                        />
                                                        <Bar dataKey="completed" name="Habits" radius={[4, 4, 0, 0]} fill="#10b981" barSize={40} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </TabsContent>

                                            <TabsContent value="focus" className="h-full mt-0">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                        <defs>
                                                            <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}m`} />
                                                        <Tooltip
                                                            cursor={{ stroke: '#8b5cf6', strokeWidth: 2 }}
                                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                                            labelFormatter={(label) => `Date: ${label}`}
                                                        />
                                                        <Area type="monotone" dataKey="minutes" name="Focus Minutes" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorMinutes)" />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </TabsContent>
                                        </>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                                            <p>No activity recorded yet.</p>
                                            <p className="text-sm">Complete a habit or start a focus session!</p>
                                        </div>
                                    )}
                                </div>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
