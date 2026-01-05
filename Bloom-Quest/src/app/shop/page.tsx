'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SHOP_ITEMS, ShopItem } from '@/data/shopItems';
import { useRouter } from 'next/navigation';
import { Loader2, ShoppingBag, Check } from 'lucide-react';

interface UserData {
    coins: number;
    inventory: string[];
    equippedItems: {
        pot: string;
        decor: string;
        background: string;
    }
}

export default function ShopPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.user) setUser(data.user);
                setLoading(false);
            });
    }, []);

    async function handleBuy(item: ShopItem) {
        if (!user) return;
        setPurchasing(item.id);

        try {
            const res = await fetch('/api/shop/buy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId: item.id })
            });

            if (res.ok) {
                const data = await res.json();
                setUser(prev => prev ? ({
                    ...prev,
                    coins: data.newBalance,
                    inventory: [...prev.inventory, item.id]
                }) : null);
            } else {
                const err = await res.json();
                alert(err.error);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setPurchasing(null);
        }
    }

    async function handleEquip(item: ShopItem) {
        if (!user) return;

        // Optimistic update
        const newItem = { ...user.equippedItems, [item.type]: item.id };
        setUser({ ...user, equippedItems: newItem });

        try {
            await fetch('/api/shop/equip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId: item.id, type: item.type })
            });
            router.refresh(); // Refresh layouts that might depend on this
        } catch (e) {
            console.error(e);
        }
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-transparent p-4 md:p-8 pt-36 md:pt-44 pb-32">
            <Navbar />

            <div className="container max-w-4xl mx-auto py-8 px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <ShoppingBag className="h-8 w-8 text-emerald-600" />
                            Garden Shop
                        </h1>
                        <p className="text-muted-foreground">Customize your sanctuary.</p>
                    </div>

                    <div className="bg-yellow-100 border-2 border-yellow-300 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                        <span className="text-2xl">🪙</span>
                        <span className="text-xl font-bold text-yellow-800">{user.coins}</span>
                    </div>
                </div>

                <Tabs defaultValue="pot" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="pot">Pots</TabsTrigger>
                        <TabsTrigger value="decor">Decor</TabsTrigger>
                        <TabsTrigger value="background">Themes</TabsTrigger>
                    </TabsList>

                    {['pot', 'decor', 'background'].map((category) => (
                        <TabsContent key={category} value={category} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {SHOP_ITEMS.filter(i => i.type === category).map((item) => {
                                const isOwned = (user.inventory || []).includes(item.id) || item.price === 0;
                                const isEquipped = user.equippedItems?.[item.type as keyof typeof user.equippedItems] === item.id;
                                const canAfford = user.coins >= item.price;

                                return (
                                    <Card key={item.id} className={`overflow-hidden transition-all hover:shadow-lg ${isEquipped ? 'ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : ''}`}>
                                        <div className="h-40 bg-slate-100/50 dark:bg-black/20 flex items-center justify-center p-4">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="h-full object-contain drop-shadow-md transition-transform hover:scale-110" />
                                            ) : (
                                                <span className="text-6xl drop-shadow-lg">
                                                    {item.type === 'pot' ? '🪴' : item.type === 'decor' ? '🗿' : '🌱'}
                                                </span>
                                            )}
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="flex justify-between items-center text-lg">
                                                {item.name}
                                                {isEquipped && <Check className="h-5 w-5 text-emerald-600" />}
                                            </CardTitle>
                                            <CardDescription>{item.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="font-bold text-sm">
                                                    {item.price === 0 ? 'Free' : `${item.price} 🪙`}
                                                </div>

                                                {isOwned ? (
                                                    <Button
                                                        variant={isEquipped ? "outline" : "default"}
                                                        size="sm"
                                                        onClick={() => handleEquip(item)}
                                                        disabled={isEquipped}
                                                    >
                                                        {isEquipped ? 'Equipped' : 'Equip'}
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        disabled={!canAfford || purchasing === item.id}
                                                        onClick={() => handleBuy(item)}
                                                    >
                                                        {purchasing === item.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Buy'}
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </div>
    )
}
