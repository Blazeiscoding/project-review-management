import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { z } from 'zod';

// Zod validation schemas
export const ReviewValidation = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  overallRating: z.number().min(1, 'Minimum rating is 1').max(5, 'Maximum rating is 5'),
  ratings: z.object({
    instructorQuality: z.number().min(1).max(5),
    contentQuality: z.number().min(1).max(5),
    valueForMoney: z.number().min(1).max(5),
  }),
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title too long'),
  content: z.string().min(20, 'Review must be at least 20 characters').max(3000, 'Review too long'),
  images: z.array(z.string().url()).max(3, 'Maximum 3 images allowed').optional(),
});

// TypeScript interface
export interface IReview extends Document {
  course: Types.ObjectId;
  student: Types.ObjectId;
  overallRating: number;
  ratings: {
    instructorQuality: number;
    contentQuality: number;
    valueForMoney: number;
  };
  title: string;
  content: string;
  images: string[];
  status: 'pending' | 'approved' | 'rejected';
  creatorReply?: {
    content: string;
    createdAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
const ReviewSchema = new Schema<IReview>(
  {
    course: { 
      type: Schema.Types.ObjectId, 
      ref: 'Course', 
      required: true,
      index: true
    },
    student: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true
    },
    overallRating: { 
      type: Number, 
      required: true,
      min: 1,
      max: 5
    },
    ratings: {
      instructorQuality: { type: Number, required: true, min: 1, max: 5 },
      contentQuality: { type: Number, required: true, min: 1, max: 5 },
      valueForMoney: { type: Number, required: true, min: 1, max: 5 },
    },
    title: { 
      type: String, 
      required: true,
      trim: true
    },
    content: { 
      type: String, 
      required: true,
      trim: true
    },
    images: [{ 
      type: String 
    }],
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'], 
      default: 'pending',
      index: true
    },
    creatorReply: {
      content: { type: String, trim: true },
      createdAt: { type: Date },
    },
  },
  { timestamps: true }
);

// Prevent duplicate reviews
ReviewSchema.index({ course: 1, student: 1 }, { unique: true });
// Compound index for status queries (used in getPendingReviews, getCourseReviews)
ReviewSchema.index({ course: 1, status: 1 });
ReviewSchema.index({ status: 1, createdAt: -1 });

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;

