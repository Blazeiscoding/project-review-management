import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// TypeScript interface
export interface IReviewAccess extends Document {
  student: Types.ObjectId;
  course: Types.ObjectId;
  accessLink: Types.ObjectId;
  hasSubmittedReview: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
const ReviewAccessSchema = new Schema<IReviewAccess>(
  {
    student: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true
    },
    course: { 
      type: Schema.Types.ObjectId, 
      ref: 'Course', 
      required: true,
      index: true
    },
    accessLink: { 
      type: Schema.Types.ObjectId, 
      ref: 'AccessLink', 
      required: true 
    },
    hasSubmittedReview: { 
      type: Boolean, 
      default: false 
    },
  },
  { timestamps: true }
);

// Prevent duplicate access records
ReviewAccessSchema.index({ student: 1, course: 1 }, { unique: true });

const ReviewAccess: Model<IReviewAccess> = mongoose.models.ReviewAccess || mongoose.model<IReviewAccess>('ReviewAccess', ReviewAccessSchema);

export default ReviewAccess;
