import mongoose, { Schema, Model, Document } from 'mongoose';
import { IChallenge } from '@/types';

export type ChallengeDocument = IChallenge & Document;

const ChallengeSchema = new Schema<ChallengeDocument>({
    date: { type: String, required: true, unique: true }, // One challenge per day
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    xp: { type: Number, default: 50 },
});

const Challenge: Model<ChallengeDocument> = mongoose.models.Challenge || mongoose.model<ChallengeDocument>('Challenge', ChallengeSchema);

export default Challenge;
