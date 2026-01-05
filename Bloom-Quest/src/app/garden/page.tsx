'use client';

import React, { useState, useEffect } from 'react';
import { DndContext, useDraggable, useDroppable, DragEndEvent, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { SHOP_ITEMS } from '@/data/shopItems';
import { Button } from '@/components/ui/button';
import { X, Save, ArrowLeft, Trash2, Maximize2, Minimize2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';


interface PlacedItem {
    itemId: string;
    instanceId: string;
    x: number;
    y: number;
    scale?: number;
}

interface DraggableItemProps {
    id: string;
    itemId: string;
    x: number;
    y: number;
    scale?: number;
    isSelected: boolean;
    onClick: (e: React.MouseEvent) => void;
    onRemove: () => void;
}

function DraggableItem({ id, itemId, x, y, scale = 1, isSelected, onClick, onRemove }: DraggableItemProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
    });

    // We use translate3d for performance, but need to combine with absolute positioning
    const style: React.CSSProperties = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${scale})` : `scale(${scale})`,
        left: `${x}%`,
        top: `${y}%`,
        position: 'absolute',
        touchAction: 'none',
        zIndex: 10,
        // Center the transform on the bottom center of the item so it scales up from the ground
        transformOrigin: 'bottom center'
    };

    const itemDef = SHOP_ITEMS.find(i => i.id === itemId);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onClick={onClick}
            className={`cursor-move transition-transform ${isSelected ? 'ring-2 ring-yellow-400 rounded-lg' : ''} hover:brightness-110`}
        >
            {isSelected && (
                <div
                    className="absolute -top-3 -right-3 z-50 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors cursor-pointer"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                >
                    <X size={12} strokeWidth={3} />
                </div>
            )}
            {itemDef?.image ? (
                <img
                    src={itemDef.image}
                    alt={itemDef.name}
                    className="w-16 h-16 object-contain drop-shadow-md pointer-events-none"
                    style={{ filter: isSelected ? 'drop-shadow(0 0 4px gold)' : '' }}
                />
            ) : (
                <div className="text-4xl drop-shadow-xl">?</div>
            )}
        </div>
    );
}



export default function GardenCanvas() {
    const router = useRouter();
    const [items, setItems] = useState<PlacedItem[]>([]);
    const [inventory, setInventory] = useState<string[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [background, setBackground] = useState('bg_default');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Configure sensors to allow clicking without dragging
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Drag only starts after moving 5px
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        })
    );


    useEffect(() => {
        // Load initial state
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    let initialItems = data.user.placedItems || [];

                    // If garden is empty, auto-populate with equipped items (Study Bunny style)
                    if (initialItems.length === 0 && data.user.equippedItems) {
                        const { pot, decor } = data.user.equippedItems;
                        if (pot && pot !== 'basic') {
                            initialItems.push({
                                itemId: pot,
                                instanceId: `auto-${pot}-${Date.now()}`,
                                x: 50,
                                y: 60,
                                scale: 1
                            });
                        }
                        if (decor && decor !== 'none') {
                            initialItems.push({
                                itemId: decor,
                                instanceId: `auto-${decor}-${Date.now()}`,
                                x: 55,
                                y: 60,
                                scale: 1
                            });
                        }
                    }

                    setItems(initialItems);
                    setInventory(data.user.inventory || []);
                    setBackground(data.user.equippedItems?.background || 'default');
                }
            });
    }, []);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;

        setItems((prev) => prev.map(item => {
            if (item.instanceId === active.id) {
                const containerWidth = window.innerWidth;
                const containerHeight = window.innerHeight;
                return {
                    ...item,
                    x: item.x + (delta.x / containerWidth) * 100,
                    y: item.y + (delta.y / containerHeight) * 100
                };
            }
            return item;
        }));
    };

    const saveGarden = async () => {
        try {
            await fetch('/api/garden/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items })
            });
            // alert('Garden Saved! 📸');
            setIsEditMode(false);
            setSelectedId(null);
        } catch (e) {
            console.error(e);
        }
    };

    const addItemToGarden = (itemId: string) => {
        const newItem: PlacedItem = {
            itemId,
            instanceId: `${itemId}-${Date.now()}`,
            x: 50,
            y: 50,
            scale: 1
        };
        setItems([...items, newItem]);
        setSelectedId(newItem.instanceId); // Auto-select new item
    };

    const removeItem = (instanceId: string) => {
        setItems(items.filter(i => i.instanceId !== instanceId));
        setSelectedId(null);
    }

    const updateScale = (delta: number) => {
        if (!selectedId) return;
        setItems(items.map(i => {
            if (i.instanceId === selectedId) {
                const newScale = Math.max(0.5, Math.min(3.0, (i.scale || 1) + delta));
                return { ...i, scale: newScale };
            }
            return i;
        }));
    };

    // Background Render
    const getBgStyle = () => {
        const bgItem = SHOP_ITEMS.find(i => i.id === background);
        if (bgItem?.image) {
            return { backgroundImage: `url(${bgItem.image})`, backgroundSize: 'cover', backgroundPosition: 'center' };
        }
        return { background: 'linear-gradient(to bottom, #7dd3fc, #a7f3d0)' };
    };

    const selectedItemDef = items.find(i => i.instanceId === selectedId);
    const selectedShopItem = selectedItemDef ? SHOP_ITEMS.find(s => s.id === selectedItemDef.itemId) : null;

    return (
        <div className="min-h-screen relative overflow-hidden transition-all duration-700" style={getBgStyle()} onClick={() => setSelectedId(null)}>
            {/* UI Overlay */}
            <div className="absolute top-4 left-4 z-50 flex gap-2">
                <Button variant="secondary" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button onClick={() => router.push('/shop')} className="bg-yellow-500 hover:bg-yellow-600 text-white shadow-md">
                    🛍️ Shop
                </Button>
            </div>

            <div className="absolute top-4 right-4 z-50">
                {isEditMode ? (
                    <Button onClick={saveGarden} className="bg-green-600 hover:bg-green-700">
                        <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                ) : (
                    <Button onClick={() => setIsEditMode(true)} variant="secondary">
                        ✏️ Edit
                    </Button>
                )}
            </div>

            {/* DND Context */}
            <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
                <div className="w-full h-screen relative">
                    {items.map((item) => (
                        <DraggableItem
                            key={item.instanceId}
                            id={item.instanceId}
                            itemId={item.itemId}
                            x={item.x}
                            y={item.y}
                            scale={item.scale}
                            isSelected={item.instanceId === selectedId}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent bg click deselect
                                setSelectedId(item.instanceId);
                            }}
                            onRemove={() => removeItem(item.instanceId)}
                        />
                    ))}
                </div>
            </DndContext>

            {/* Selection HUD (Always visible if item selected) */}
            {selectedId && (
                <div
                    className="absolute bottom-36 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur px-6 py-3 rounded-full shadow-xl border flex items-center gap-4 z-50 animate-in slide-in-from-bottom-5"
                    onClick={(e) => e.stopPropagation()}
                >
                    <span className="font-bold text-sm text-slate-700">{selectedShopItem?.name}</span>

                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => updateScale(-0.1)}>
                            <Minimize2 className="h-4 w-4" />
                        </Button>
                        <span className="text-xs font-mono w-8 text-center">{((selectedItemDef?.scale || 1) * 100).toFixed(0)}%</span>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => updateScale(0.1)}>
                            <Maximize2 className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="w-px h-6 bg-slate-200 mx-2" />

                    <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full" onClick={() => removeItem(selectedId)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Inventory Dock (Edit Mode Only - repurposed as 'Add Items') */}
            {isEditMode && (
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-white/90 backdrop-blur border-t p-4 overflow-x-auto z-50">
                    <p className="text-xs font-bold text-muted-foreground mb-2">Drag or Click to Add</p>
                    <div className="flex gap-4 min-w-max px-4">
                        {SHOP_ITEMS.filter(item =>
                            (item.type === 'pot' || item.type === 'decor') &&
                            (item.price === 0 || inventory.includes(item.id)) &&
                            item.id !== 'decor_none'
                        ).map((item) => {
                            return (
                                <button
                                    key={item.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addItemToGarden(item.id);
                                    }}
                                    className="w-20 h-20 bg-slate-50 rounded-xl border-2 border-slate-200 hover:border-emerald-500 flex items-center justify-center transition-all hover:scale-105 active:scale-95 relative group overflow-hidden shadow-sm"
                                    title={item.name}
                                >
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-14 h-14 object-contain" />
                                    ) : (
                                        <span className="text-3xl">🌱</span>
                                    )}
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
