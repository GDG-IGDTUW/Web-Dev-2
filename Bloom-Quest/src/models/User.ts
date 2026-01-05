import mongoose, { Schema, Model, Document } from 'mongoose';
import { IUser } from '@/types';

// Create a type that combines the shared interface with Mongoose's Document
export type UserDocument = IUser & Document;

const UserSchema = new Schema<UserDocument>({
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false }, // Login via password
    name: { type: String, default: 'Gardener' },
    createdAt: { type: Date, default: Date.now },

    // Plant System
    plantType: { type: String, default: 'sunflower' },
    plantStage: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },

    // Engagement
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: Date.now },
    lastChallengeCompleted: { type: Date }, // Track when the challenge was last done

    // Economy & Garden
    coins: { type: Number, default: 0 },
    inventory: { type: [String], default: [] }, // Array of item IDs
    equippedItems: {
        pot: { type: String, default: 'basic' },
        decor: { type: String, default: 'none' },
        background: { type: String, default: 'default' }
    },
    placedItems: {
        type: [{
            itemId: String,
            instanceId: String,
            x: Number,
            y: Number,
            scale: { type: Number, default: 1 },
            rotation: { type: Number, default: 0 }
        }],
        default: []
    },
    dailyStats: {
        type: [{
            date: String,
            xpGained: { type: Number, default: 0 },
            habitsCompleted: { type: Number, default: 0 },
            focusMinutes: { type: Number, default: 0 }
        }],
        default: []
    }
});

const User: Model<UserDocument> = mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);

export default User;
