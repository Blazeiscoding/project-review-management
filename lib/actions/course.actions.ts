'use server';

import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db/mongodb';
import Course, { CourseValidation } from '@/lib/db/models/Course';
import User from '@/lib/db/models/User';
import { revalidatePath } from 'next/cache';

export async function createCourse(formData: FormData) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    await connectDB();

    // Get MongoDB user
    const user = await User.findOne({ clerkId: userId });
    
    if (!user || user.role !== 'creator') {
      return { error: 'Unauthorized - Creator access required' };
    }

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      thumbnail: formData.get('thumbnail') as string || undefined,
    };

    const validatedFields = CourseValidation.safeParse(data);

    if (!validatedFields.success) {
      return { error: validatedFields.error.flatten().fieldErrors };
    }

    const course = await Course.create({
      ...validatedFields.data,
      creator: user._id,
    });

    revalidatePath('/creator');
    return { success: true, courseId: course._id.toString() };
  } catch (error) {
    console.error('Create course error:', error);
    return { error: 'Failed to create course' };
  }
}

export async function updateCourse(courseId: string, formData: FormData) {
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

    // Find course and verify ownership
    const course = await Course.findById(courseId);
    
    if (!course) {
      return { error: 'Course not found' };
    }

    if (course.creator.toString() !== user._id.toString() && user.role !== 'admin') {
      return { error: 'Unauthorized - Not the course owner' };
    }

    const updateData: Record<string, string | undefined> = {};
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const thumbnail = formData.get('thumbnail') as string;
    
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (thumbnail) updateData.thumbnail = thumbnail;

    await Course.findByIdAndUpdate(courseId, updateData);

    revalidatePath('/creator');
    revalidatePath(`/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    console.error('Update course error:', error);
    return { error: 'Failed to update course' };
  }
}

export async function deleteCourse(courseId: string) {
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

    const course = await Course.findById(courseId);
    
    if (!course) {
      return { error: 'Course not found' };
    }

    if (course.creator.toString() !== user._id.toString() && user.role !== 'admin') {
      return { error: 'Unauthorized - Not the course owner' };
    }

    await Course.findByIdAndDelete(courseId);

    revalidatePath('/creator');
    return { success: true };
  } catch (error) {
    console.error('Delete course error:', error);
    return { error: 'Failed to delete course' };
  }
}

export async function getCourse(courseId: string) {
  try {
    await connectDB();

    const course = await Course.findById(courseId)
      .populate('creator', 'firstName lastName profileImage')
      .lean();
    
    return course ? JSON.parse(JSON.stringify(course)) : null;
  } catch (error) {
    console.error('Get course error:', error);
    return null;
  }
}

export async function getAllCourses(filters?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    await connectDB();

    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const skip = (page - 1) * limit;

    // Build query
    const query: Record<string, unknown> = { isActive: true };
    
    if (filters?.category && filters.category !== 'all') {
      query.category = filters.category;
    }
    
    if (filters?.search) {
      query.$text = { $search: filters.search };
    }

    const [courses, total] = await Promise.all([
      Course.find(query)
        .populate('creator', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Course.countDocuments(query),
    ]);

    return { 
      courses: JSON.parse(JSON.stringify(courses)),
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error('Get all courses error:', error);
    return { courses: [], total: 0, pages: 0, currentPage: 1 };
  }
}

export async function getCreatorCourses() {
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

    const courses = await Course.find({ creator: user._id })
      .sort({ createdAt: -1 })
      .lean();

    return { courses: JSON.parse(JSON.stringify(courses)) };
  } catch (error) {
    console.error('Get creator courses error:', error);
    return { courses: [] };
  }
}
