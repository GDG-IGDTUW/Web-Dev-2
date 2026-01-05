export interface IUser {
    _id: string;
    email: string;
    password?: string; // Needed for auth
    name: string;
    createdAt: Date;
    plantType: string;
    plantStage: number;
    xp: number;
    streak: number;
    lastActiveDate: Date;
    lastChallengeCompleted?: Date;
    coins: number;
    inventory: string[];
    equippedItems: {
        pot: string;
        decor: string;
        background: string;
    };
    placedItems: {
        itemId: string;
        instanceId: string;
        x: number;
        y: number;
        scale?: number;
        rotation?: number;
    }[];
    dailyStats: {
        date: string;
        xpGained: number;
        habitsCompleted: number;
        focusMinutes: number;
    }[];
}

export interface IHabit {
    _id: string;
    userId: string; // Mongoose will handle ObjectId casting
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    frequency: 'daily';
    completedToday: boolean;
    createdAt: Date;
}

export interface IChallenge {
    _id: string;
    date: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    xp: number;
}
