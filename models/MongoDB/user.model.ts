import { Schema, model, models } from 'mongoose';

export interface User {
  email: string;
  password: string;
}

const userSchema = new Schema<User>({
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true },
});

export const userModel = models.User || model<User>('User', userSchema);
