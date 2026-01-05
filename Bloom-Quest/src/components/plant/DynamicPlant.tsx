import { motion, Variants } from 'framer-motion';

interface DynamicPlantProps {
    stage: number; // 0 (Seed), 1 (Sprout), 2 (Bud), 3 (Bloom)
    type?: string;
    className?: string;
    style?: React.CSSProperties;
    potType?: string;
    decorType?: string;
}

export default function DynamicPlant({ stage, className, style, potType = 'pot_clay', decorType = 'decor_none' }: DynamicPlantProps) {
    // Animation Variants
    const stemVariants: Variants = {
        seed: { height: 0, transition: { duration: 0.5 } },
        sprout: { height: 60, transition: { duration: 1, ease: 'easeOut' } },
        bud: { height: 120, transition: { duration: 1, ease: 'easeOut' } },
        bloom: { height: 150, transition: { duration: 1, ease: 'easeOut' } },
    };

    const leafLeftVariants = {
        seed: { scale: 0, opacity: 0 },
        sprout: { scale: 1, opacity: 1, rotate: -45, transition: { delay: 0.5, duration: 0.5 } },
        bud: { scale: 1.2, opacity: 1, rotate: -45, transition: { duration: 0.5 } },
        bloom: { scale: 1.2, opacity: 1, rotate: -45 },
    };

    const leafRightVariants = {
        seed: { scale: 0, opacity: 0 },
        sprout: { scale: 0, opacity: 0 },
        bud: { scale: 1.2, opacity: 1, rotate: 45, transition: { delay: 0.2, duration: 0.5 } },
        bloom: { scale: 1.2, opacity: 1, rotate: 45 },
    };

    const flowerHeadVariants: Variants = {
        seed: { scale: 0, opacity: 0 },
        sprout: { scale: 0, opacity: 0 },
        bud: {
            scale: 0.8,
            opacity: 1,
            backgroundColor: '#10b981',
            borderRadius: '50% 50% 50% 0%',
            rotate: 45,
            transition: { delay: 0.5, duration: 0.5 }
        },
        bloom: {
            scale: 1,
            opacity: 1,
            backgroundColor: '#78350f', // Dark brown for sunflower center
            borderRadius: '50%',
            rotate: 0,
            transition: { duration: 0.8, type: 'spring', bounce: 0.5 }
        },
    };

    const petalVariants = {
        seed: { scale: 0, opacity: 0 },
        sprout: { scale: 0, opacity: 0 },
        bud: { scale: 0, opacity: 0 },
        bloom: { scale: 1, opacity: 1, transition: { delay: 0.2, duration: 0.5, staggerChildren: 0.1 } },
    };

    const currentVariant = stage === 0 ? 'seed' : stage === 1 ? 'sprout' : stage === 2 ? 'bud' : 'bloom';

    // Pot Styles
    const getPotStyle = () => {
        switch (potType) {
            case 'pot_gold': return 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 border-yellow-600';
            case 'pot_neon': return 'bg-black border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]';
            case 'pot_ceramic': return 'bg-white border-2 border-gray-200';
            default: return 'bg-gradient-to-t from-amber-700 to-amber-600 border-amber-800'; // Clay default
        }
    };

    return (
        <div className={`relative flex items-end justify-center w-48 h-64 overflow-visible ${className || ''}`} style={style}>
            {/* Decor Render */}
            {decorType === 'decor_stones' && (
                <div className="absolute bottom-2 left-6 w-8 h-6 bg-stone-400 rounded-full z-20 shadow-lg" />
            )}
            {decorType === 'decor_gnome' && (
                <div className="absolute bottom-0 -right-8 w-12 h-16 bg-red-500 z-20 rounded-t-full shadow-lg flex items-center justify-center text-xs text-white p-1">
                    👺
                </div>
            )}

            {/* Pot Render (Replaces Dirt Mound for Stage > 0 usually, but we keep dirt for Seed) */}
            <div className={`absolute bottom-0 w-32 h-24 rounded-b-3xl rounded-t-sm z-10 shadow-2xl ${getPotStyle()}`}>
                <div className="absolute top-0 w-full h-4 bg-black/20" />
            </div>

            {/* Dirt/Soil Top */}
            <div className="absolute bottom-20 w-28 h-6 bg-amber-900/90 rounded-[50%] z-10" />

            {/* Stem - Gradient for cylindrical look */}
            <motion.div
                className="w-4 bg-gradient-to-r from-emerald-800 via-emerald-600 to-emerald-500 rounded-full origin-bottom relative z-0 shadow-lg"
                variants={stemVariants}
                initial="seed"
                animate={currentVariant}
            >
                {/* Left Leaf - Organic shape & Gradient */}
                <motion.div
                    className="absolute bottom-10 -left-6 w-12 h-6 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-tl-none rounded-tr-[50px] rounded-bl-[50px] rounded-br-[10px] origin-right shadow-sm border-t border-emerald-400/30"
                    variants={leafLeftVariants}
                />
                {/* Right Leaf - Organic shape & Gradient */}
                <motion.div
                    className="absolute bottom-20 -right-6 w-12 h-6 bg-gradient-to-bl from-emerald-500 to-emerald-700 rounded-tr-none rounded-tl-[50px] rounded-br-[50px] rounded-bl-[10px] origin-left shadow-sm border-t border-emerald-400/30"
                    variants={leafRightVariants}
                />

                {/* Flower Head Container */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 flex items-center justify-center pointer-events-none">

                    {/* Petals Container */}
                    <motion.div
                        className="absolute w-32 h-32 flex items-center justify-center z-0"
                        variants={petalVariants}
                    >
                        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                            <motion.div
                                key={deg}
                                className="absolute w-6 h-14 bg-gradient-to-t from-yellow-500 via-yellow-400 to-yellow-200 rounded-[50%_50%_0_50%] origin-bottom shadow-md"
                                style={{
                                    rotate: deg,
                                    paddingBottom: '30px',
                                    bottom: '50%',
                                }}
                            />
                        ))}
                    </motion.div>

                    {/* Center of the flower */}
                    <motion.div
                        className="relative z-20 w-14 h-14 shadow-[inset_0_2px_10px_rgba(0,0,0,0.6)] border-4 border-amber-900/50"
                        variants={flowerHeadVariants}
                    >
                        {/* Seed texture details */}
                        {stage === 3 && (
                            <div className="w-full h-full rounded-full opacity-50 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-800 via-black to-black scale-90" />
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
