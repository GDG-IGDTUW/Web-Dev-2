import mongoose, { Schema, Model, Document } from 'mongoose';
import { IHabit } from '@/types';

export type HabitDocument = IHabit & Document;

const HabitSchema = new Schema<HabitDocument>({
    // @ts-expect-error - Mongoose ObjectId casting compatible with string ID usage
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    frequency: { type: String, default: 'daily' },
    completedToday: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const Habit: Model<HabitDocument> = mongoose.models.Habit || mongoose.model<HabitDocument>('Habit', HabitSchema);

export default Habit;
