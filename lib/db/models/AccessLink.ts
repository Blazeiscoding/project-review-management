import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { z } from 'zod';
import { nanoid } from 'nanoid';

// Zod validation schemas
export const AccessLinkValidation = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  maxUses: z.number().min(1, 'Minimum 1 use').max(1000, 'Maximum 1000 uses').optional().default(100),
  expiresAt: z.date().optional(),
});

// TypeScript interface
export interface IAccessLink extends Document {
  course: Types.ObjectId;
  code: string;
  maxUses: number;
  currentUses: number;
  expiresAt?: Date;
  isActive: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
const AccessLinkSchema = new Schema<IAccessLink>(
  {
    course: { 
      type: Schema.Types.ObjectId, 
      ref: 'Course', 
      required: true,
      index: true
    },
    code: { 
      type: String, 
      required: true, 
      unique: true,
      index: true,
      default: () => nanoid(10)
    },
    maxUses: { 
      type: Number, 
      default: 100,
      min: 1
    },
    currentUses: { 
      type: Number, 
      default: 0,
      min: 0
    },
    expiresAt: { 
      type: Date 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    createdBy: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
  },
  { timestamps: true }
);

// Virtual to check if link is valid
AccessLinkSchema.virtual('isValid').get(function() {
  if (!this.isActive) return false;
  if (this.currentUses >= this.maxUses) return false;
  if (this.expiresAt && new Date() > this.expiresAt) return false;
  return true;
});

const AccessLink: Model<IAccessLink> = mongoose.models.AccessLink || mongoose.model<IAccessLink>('AccessLink', AccessLinkSchema);

export default AccessLink;
