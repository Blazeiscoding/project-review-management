'use server';

import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db/mongodb';
import Review, { ReviewValidation } from '@/lib/db/models/Review';
import ReviewAccess from '@/lib/db/models/ReviewAccess';
import Course from '@/lib/db/models/Course';
import User from '@/lib/db/models/User';
import { revalidatePath } from 'next/cache';

export async function createReview(data: {
  courseId: string;
  overallRating: number;
  ratings: {
    instructorQuality: number;
    contentQuality: number;
    valueForMoney: number;
  };
  title: string;
  content: string;
  images?: string[];
}) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    const validatedFields = ReviewValidation.safeParse(data);

    if (!validatedFields.success) {
      return { error: validatedFields.error.flatten().fieldErrors };
    }

    await connectDB();

    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      return { error: 'User not found' };
    }

    // Check if user has access
    const hasAccess = await ReviewAccess.findOne({
      student: user._id,
      course: data.courseId,
    });

    if (!hasAccess) {
      return { error: 'You do not have access to review this course' };
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      student: user._id,
      course: data.courseId,
    });

    if (existingReview) {
      return { error: 'You have already reviewed this course' };
    }

    // Create review
    const review = await Review.create({
      course: data.courseId,
      student: user._id,
      overallRating: data.overallRating,
      ratings: data.ratings,
      title: data.title,
      content: data.content,
      images: data.images || [],
      status: 'pending',
    });

    // Update course statistics
    await updateCourseRatings(data.courseId);

    // Mark as submitted
    hasAccess.hasSubmittedReview = true;
    await hasAccess.save();

    revalidatePath(`/courses/${data.courseId}`);
    return { success: true, reviewId: review._id.toString() };
  } catch (error) {
    console.error('Create review error:', error);
    return { error: 'Failed to create review' };
  }
}

async function updateCourseRatings(courseId: string) {
  const reviews = await Review.find({ 
    course: courseId, 
    status: 'approved' 
  });

  const totalReviews = reviews.length;
  
  if (totalReviews === 0) {
    await Course.findByIdAndUpdate(courseId, {
      averageRating: 0,
      totalReviews: 0,
    });
    return;
  }

  const avgRating = reviews.reduce((sum, r) => sum + r.overallRating, 0) / totalReviews;

  await Course.findByIdAndUpdate(courseId, {
    averageRating: Math.round(avgRating * 10) / 10,
    totalReviews,
  });
}

export async function getCourseReviews(courseId: string) {
  try {
    await connectDB();

    const reviews = await Review.find({ 
      course: courseId, 
      status: 'approved' 
    })
      .populate('student', 'firstName lastName profileImage')
      .sort({ createdAt: -1 })
      .lean();

    return { reviews: JSON.parse(JSON.stringify(reviews)) };
  } catch (error) {
    console.error('Get course reviews error:', error);
    return { reviews: [] };
  }
}

export async function getStudentReviews() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { reviews: [] };
    }

    await connectDB();

    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      return { reviews: [] };
    }

    const reviews = await Review.find({ student: user._id })
      .populate('course', 'title thumbnail')
      .sort({ createdAt: -1 })
      .lean();

    return { reviews: JSON.parse(JSON.stringify(reviews)) };
  } catch (error) {
    console.error('Get student reviews error:', error);
    return { reviews: [] };
  }
}

export async function getPendingReviews(courseId?: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { reviews: [] };
    }

    await connectDB();

    const user = await User.findOne({ clerkId: userId });
    
    if (!user || (user.role !== 'creator' && user.role !== 'admin')) {
      return { reviews: [] };
    }

    // Build query based on role
    interface ReviewQuery {
      status: string;
      course?: string;
    }
    
    const query: ReviewQuery = { status: 'pending' };
    
    // If creator and courseId provided, filter by course ownership
    if (user.role === 'creator') {
      if (courseId) {
        const course = await Course.findById(courseId);
        if (!course || course.creator.toString() !== user._id.toString()) {
          return { reviews: [] };
        }
        query.course = courseId;
      } else {
        // Get all courses by this creator
        const creatorCourses = await Course.find({ creator: user._id });
        const courseIds = creatorCourses.map(c => c._id);
        
        // Find reviews for these courses
        const reviews = await Review.find({ 
          status: 'pending',
          course: { $in: courseIds }
        })
          .populate('course', 'title')
          .populate('student', 'firstName lastName profileImage')
          .sort({ createdAt: -1 })
          .lean();
          
        return { reviews: JSON.parse(JSON.stringify(reviews)) };
      }
    }

    const reviews = await Review.find(query)
      .populate('course', 'title')
      .populate('student', 'firstName lastName profileImage')
      .sort({ createdAt: -1 })
      .lean();

    return { reviews: JSON.parse(JSON.stringify(reviews)) };
  } catch (error) {
    console.error('Get pending reviews error:', error);
    return { reviews: [] };
  }
}

export async function moderateReview(
  reviewId: string, 
  status: 'approved' | 'rejected'
) {
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

    const review = await Review.findById(reviewId).populate('course');
    
    if (!review) {
      return { error: 'Review not found' };
    }

    // Check permissions - admin can moderate any, creator can moderate their own courses
    const course = await Course.findById(review.course);
    
    if (user.role !== 'admin') {
      if (user.role !== 'creator' || course?.creator.toString() !== user._id.toString()) {
        return { error: 'Unauthorized to moderate this review' };
      }
    }

    review.status = status;
    await review.save();

    // Update course ratings if approved
    if (status === 'approved') {
      await updateCourseRatings(review.course.toString());
    }

    revalidatePath('/creator');
    revalidatePath('/admin');
    revalidatePath(`/courses/${review.course}`);
    
    return { success: true };
  } catch (error) {
    console.error('Moderate review error:', error);
    return { error: 'Failed to moderate review' };
  }
}

export async function checkReviewAccess(courseId: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { hasAccess: false, hasReviewed: false };
    }

    await connectDB();

    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      return { hasAccess: false, hasReviewed: false };
    }

    const access = await ReviewAccess.findOne({
      student: user._id,
      course: courseId,
    });

    if (!access) {
      return { hasAccess: false, hasReviewed: false };
    }

    return { 
      hasAccess: true, 
      hasReviewed: access.hasSubmittedReview 
    };
  } catch (error) {
    console.error('Check review access error:', error);
    return { hasAccess: false, hasReviewed: false };
  }
}
