'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Sprout, Sun, CloudRain } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

const PLANTS = [
    {
        id: 'sunflower',
        name: 'Sunflower',
        description: 'Bright and cheerful. Grows quickly with consistent care.',
        icon: Sun,
        color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    },
    {
        id: 'rose',
        name: 'Rose',
        description: 'Beautiful and classic. Requires dedication to bloom fully.',
        icon: Sprout, // Placeholder
        color: 'bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
    },
    {
        id: 'succulent',
        name: 'Succulent',
        description: 'Resilient and steady. Perfect for a forgiving start.',
        icon: CloudRain, // Placeholder
        color: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [selectedPlant, setSelectedPlant] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleContinue() {
        if (!selectedPlant) return;
        setLoading(true);

        try {
            const res = await fetch('/api/plant/setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plantType: selectedPlant }),
            });

            if (!res.ok) throw new Error('Failed to save plant selection');

            router.push('/dashboard');
        } catch (error) {
            console.error(error);
            // Handle error (toast or alert)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar /> {/* Reuse navbar or simplified version */}
            <div className="container max-w-4xl py-12 px-4 md:px-6 mx-auto">
                <div className="text-center space-y-4 mb-12">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">Choose your companion</h1>
                    <p className="text-muted-foreground text-lg">Select the first plant you want to grow. Don&apos;t worry, you can grow others later!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {PLANTS.map((plant) => {
                        const Icon = plant.icon;
                        const isSelected = selectedPlant === plant.id;
                        return (
                            <Card
                                key={plant.id}
                                className={cn(
                                    "cursor-pointer transition-all hover:scale-105 border-2",
                                    isSelected ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-primary/50"
                                )}
                                onClick={() => setSelectedPlant(plant.id)}
                            >
                                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                                    <div className={cn("p-4 rounded-full", plant.color)}>
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl mb-2">{plant.name}</h3>
                                        <p className="text-sm text-muted-foreground">{plant.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="flex justify-center">
                    <Button size="lg" disabled={!selectedPlant || loading} onClick={handleContinue} className="px-12 text-lg">
                        {loading ? 'Planting...' : 'Start Growing'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
