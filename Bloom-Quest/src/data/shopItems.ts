export type ShopItemType = 'pot' | 'decor' | 'background';

export interface ShopItem {
    id: string;
    name: string;
    description: string;
    price: number;
    type: ShopItemType;
    image?: string; // Optional URL or emoji
    cssClass?: string; // For applying styles
}

export const SHOP_ITEMS: ShopItem[] = [
    // Pots
    { id: 'pot_clay', name: 'Clay Pot', description: 'A classic starting pot.', price: 0, type: 'pot', image: '/items/pot_clay.png' },
    { id: 'pot_ceramic', name: 'Ceramic White', description: 'Clean and modern.', price: 50, type: 'pot', image: '/items/pot_ceramic.png' },
    { id: 'pot_neon', name: 'Neon Cyber', description: 'Glows in the dark.', price: 0, type: 'pot', image: '/items/pot_neon.png' },
    { id: 'pot_tulip', name: 'Potted Tulips', description: 'Lovely pink tulips.', price: 0, type: 'pot', image: '/items/plant_tulip.png' },
    { id: 'pot_rose', name: 'Potted Roses', description: 'Romantic red roses.', price: 0, type: 'pot', image: '/items/plant_rose.png' },
    { id: 'pot_daisy', name: 'Potted Daisies', description: 'Cheerful white daisies.', price: 0, type: 'pot', image: '/items/plant_daisy.png' },
    { id: 'pot_sunflower', name: 'Potted Sunflowers', description: 'Bright and sunny.', price: 0, type: 'pot', image: '/items/plant_sunflower.png' },
    { id: 'pot_spider_lily', name: 'Red Spider Lily', description: 'Mysterious and beautiful.', price: 0, type: 'pot', image: '/items/pot_spider_lily.png' },

    // Decor
    { id: 'decor_none', name: 'No Decor', description: 'Clean slate.', price: 0, type: 'decor' },
    { id: 'decor_bench', name: 'Wooden Bench', description: 'A cozy spot to rest.', price: 200, type: 'decor', image: '/items/decor_bench.png' },
    { id: 'decor_birdbath', name: 'Stone Birdbath', description: 'Attracts local birds.', price: 250, type: 'decor', image: '/items/decor_birdbath.png' },
    { id: 'decor_frog', name: 'Friendly Frog', description: 'Ribbit ribbit.', price: 100, type: 'decor', image: '/items/decor_frog.png' },
    { id: 'decor_cat', name: 'Sleeping Cat', description: 'Purrfectly cozy.', price: 300, type: 'decor', image: '/items/decor_cat.png' },
    { id: 'decor_archway', name: 'Garden Arch', description: 'A grand entrance.', price: 400, type: 'decor', image: '/items/decor_archway.png' },
    { id: 'decor_mailbox', name: 'Cute Mailbox', description: 'You have mail!', price: 0, type: 'decor', image: '/items/decor_mailbox.png' },
    { id: 'decor_firepit', name: 'Stone Fire Pit', description: 'Warmth for the night.', price: 350, type: 'decor', image: '/items/decor_firepit.png' },
    { id: 'decor_gnome', name: 'Garden Gnome', description: 'A cheery friend.', price: 150, type: 'decor', image: '/items/decor_gnome.png' },
    { id: 'decor_stones', name: 'Zen Stones', description: 'Peace and balance.', price: 100, type: 'decor', image: '/items/decor_stones.png' },
    { id: 'decor_mushrooms', name: 'Magic Mushrooms', description: 'A touch of fantasy.', price: 250, type: 'decor', image: '/items/decor_mushrooms.png' },

    // Backgrounds
    { id: 'bg_default', name: 'Sunny Day', description: 'Default bright garden.', price: 0, type: 'background', image: '/items/bg_default.png' },
    { id: 'bg_night', name: 'Midnight', description: 'Peaceful night sky.', price: 5, type: 'background', image: '/items/bg_night.png' },
    { id: 'bg_cherry_blossom', name: 'Cherry Blossom', description: 'Pink petals in the breeze.', price: 0, type: 'background', image: '/items/bg_cherry_blossom.jpg' },
    { id: 'bg_rain', name: 'Rainy Mood', description: 'Cozy rain sounds.', price: 300, type: 'background', image: '/items/bg_rain.png' },
];
