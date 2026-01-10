'use server';

import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db/mongodb';
import AccessLink, { AccessLinkValidation } from '@/lib/db/models/AccessLink';
import ReviewAccess from '@/lib/db/models/ReviewAccess';
import Course from '@/lib/db/models/Course';
import User from '@/lib/db/models/User';
import { revalidatePath } from 'next/cache';
import { nanoid } from 'nanoid';

export async function createAccessLink(data: {
  courseId: string;
  maxUses?: number;
  expiresAt?: Date;
}) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    const validatedFields = AccessLinkValidation.safeParse(data);

    if (!validatedFields.success) {
      return { error: validatedFields.error.flatten().fieldErrors };
    }

    await connectDB();

    const user = await User.findOne({ clerkId: userId });
    
    if (!user || user.role !== 'creator') {
      return { error: 'Unauthorized - Creator access required' };
    }

    // Verify course ownership
    const course = await Course.findById(data.courseId);
    
    if (!course) {
      return { error: 'Course not found' };
    }

    if (course.creator.toString() !== user._id.toString()) {
      return { error: 'Unauthorized - Not the course owner' };
    }

    // Create access link
    const accessLink = await AccessLink.create({
      course: data.courseId,
      code: nanoid(10),
      maxUses: data.maxUses || 100,
      expiresAt: data.expiresAt,
      createdBy: user._id,
    });

    revalidatePath('/creator');
    
    return { 
      success: true, 
      linkId: accessLink._id.toString(),
      code: accessLink.code,
    };
  } catch (error) {
    console.error('Create access link error:', error);
    return { error: 'Failed to create access link' };
  }
}

export async function redeemAccessLink(code: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { error: 'Please sign in to redeem this link' };
    }

    await connectDB();

    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      return { error: 'User not found' };
    }

    // Find access link
    const accessLink = await AccessLink.findOne({ code });
    
    if (!accessLink) {
      return { error: 'Invalid access link' };
    }

    // Check if link is valid
    if (!accessLink.isActive) {
      return { error: 'This link is no longer active' };
    }

    if (accessLink.currentUses >= accessLink.maxUses) {
      return { error: 'This link has reached its maximum uses' };
    }

    if (accessLink.expiresAt && new Date() > accessLink.expiresAt) {
      return { error: 'This link has expired' };
    }

    // Check if user already has access
    const existingAccess = await ReviewAccess.findOne({
      student: user._id,
      course: accessLink.course,
    });

    if (existingAccess) {
      // User already has access, just return success
      return { 
        success: true, 
        courseId: accessLink.course.toString(),
        message: 'You already have access to this course' 
      };
    }

    // Grant access
    await ReviewAccess.create({
      student: user._id,
      course: accessLink.course,
      accessLink: accessLink._id,
    });

    // Increment usage
    accessLink.currentUses += 1;
    await accessLink.save();

    revalidatePath('/student');
    
    return { 
      success: true, 
      courseId: accessLink.course.toString(),
    };
  } catch (error) {
    console.error('Redeem access link error:', error);
    return { error: 'Failed to redeem access link' };
  }
}

export async function getAccessLinks(courseId: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { links: [] };
    }

    await connectDB();

    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      return { links: [] };
    }

    // Verify course ownership
    const course = await Course.findById(courseId);
    
    if (!course || course.creator.toString() !== user._id.toString()) {
      return { links: [] };
    }

    const links = await AccessLink.find({ course: courseId })
      .sort({ createdAt: -1 })
      .lean();

    return { links: JSON.parse(JSON.stringify(links)) };
  } catch (error) {
    console.error('Get access links error:', error);
    return { links: [] };
  }
}

export async function deactivateLink(linkId: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    await connectDB();

    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      return { error: 'User not found' };
    }

    const link = await AccessLink.findById(linkId).populate('course');
    
    if (!link) {
      return { error: 'Link not found' };
    }

    // Verify ownership
    const course = await Course.findById(link.course);
    
    if (!course || course.creator.toString() !== user._id.toString()) {
      return { error: 'Unauthorized' };
    }

    link.isActive = false;
    await link.save();

    revalidatePath('/creator');
    
    return { success: true };
  } catch (error) {
    console.error('Deactivate link error:', error);
    return { error: 'Failed to deactivate link' };
  }
}

export async function getStudentAccessibleCourses() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { courses: [] };
    }

    await connectDB();

    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      return { courses: [] };
    }

    const accessRecords = await ReviewAccess.find({ student: user._id })
      .populate({
        path: 'course',
        populate: { path: 'creator', select: 'firstName lastName' }
      })
      .lean();

    const courses = accessRecords.map(record => ({
      ...record.course,
      hasReviewed: record.hasSubmittedReview,
    }));

    return { courses: JSON.parse(JSON.stringify(courses)) };
  } catch (error) {
    console.error('Get accessible courses error:', error);
    return { courses: [] };
  }
}
