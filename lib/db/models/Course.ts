import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { z } from 'zod';

// Zod validation schemas
export const CourseValidation = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title too long'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000, 'Description too long'),
  category: z.enum(['development', 'design', 'marketing', 'business', 'photography', 'music', 'other']),
  thumbnail: z.string().url('Invalid thumbnail URL').optional(),
});

export const CourseUpdateValidation = CourseValidation.partial();

// TypeScript interface
export interface ICourse extends Document {
  title: string;
  description: string;
  category: 'development' | 'design' | 'marketing' | 'business' | 'photography' | 'music' | 'other';
  thumbnail?: string;
  creator: Types.ObjectId;
  averageRating: number;
  totalReviews: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
const CourseSchema = new Schema<ICourse>(
  {
    title: { 
      type: String, 
      required: true,
      trim: true,
      index: 'text'
    },
    description: { 
      type: String, 
      required: true,
      trim: true 
    },
    category: { 
      type: String, 
      enum: ['development', 'design', 'marketing', 'business', 'photography', 'music', 'other'],
      required: true,
      index: true
    },
    thumbnail: { 
      type: String 
    },
    creator: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true
    },
    averageRating: { 
      type: Number, 
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: { 
      type: Number, 
      default: 0,
      min: 0
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
  },
  { timestamps: true }
);

// Compound index for filtering
CourseSchema.index({ category: 1, averageRating: -1 });
CourseSchema.index({ creator: 1, createdAt: -1 });

const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);

export default Course;
