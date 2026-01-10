import mongoose, { Schema, Document, Model } from 'mongoose';
import { z } from 'zod';

// Zod validation schemas
export const UserValidation = z.object({
  clerkId: z.string().min(1, 'Clerk ID is required'),
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  role: z.enum(['student', 'creator', 'admin']).default('student'),
  profileImage: z.string().url().optional(),
});

export const OnboardingValidation = z.object({
  role: z.enum(['student', 'creator'], {
    required_error: 'Please select a role',
  }),
});

// TypeScript interface
export interface IUser extends Document {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'creator' | 'admin';
  profileImage?: string;
  onboardingComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
const UserSchema = new Schema<IUser>(
  {
    clerkId: { 
      type: String, 
      required: true, 
      unique: true,
      index: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      index: true 
    },
    firstName: { 
      type: String, 
      required: true 
    },
    lastName: { 
      type: String, 
      required: true 
    },
    role: { 
      type: String, 
      enum: ['student', 'creator', 'admin'], 
      default: 'student' 
    },
    profileImage: { 
      type: String 
    },
    onboardingComplete: { 
      type: Boolean, 
      default: false 
    },
  },
  { timestamps: true }
);

// Prevent model recompilation in development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
