'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { revalidatePath } from 'next/cache';

// Type for serialized user data
export interface UserType {
  _id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'creator' | 'admin';
  profileImage?: string;
  onboardingComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function completeOnboarding(role: 'student' | 'creator') {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    await connectDB();

    // Check if user exists
    let user = await User.findOne({ clerkId: userId });

    // If user doesn't exist yet (webhook might not have fired), create them
    if (!user) {
      const clerkUser = await currentUser();
      
      if (!clerkUser) {
        return { error: 'Could not fetch user data' };
      }

      user = await User.create({
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName || 'User',
        lastName: clerkUser.lastName || '',
        profileImage: clerkUser.imageUrl,
        role,
        onboardingComplete: true,
      });
    } else {
      // Update existing user
      user = await User.findOneAndUpdate(
        { clerkId: userId },
        { role, onboardingComplete: true },
        { new: true }
      );
    }

    revalidatePath('/onboarding');
    return { success: true };
  } catch (error) {
    console.error('Onboarding error:', error);
    return { error: 'Failed to complete onboarding' };
  }
}

export async function getCurrentUser(): Promise<UserType | null> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return null;
    }

    await connectDB();

    const user = await User.findOne({ clerkId: userId }).lean();
    
    return user ? JSON.parse(JSON.stringify(user)) : null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

export async function getUserById(id: string): Promise<UserType | null> {
  try {
    await connectDB();

    const user = await User.findById(id).lean();
    
    return user ? JSON.parse(JSON.stringify(user)) : null;
  } catch (error) {
    console.error('Get user by ID error:', error);
    return null;
  }
}

export async function updateUserRole(
  userId: string, 
  newRole: 'student' | 'creator' | 'admin'
) {
  try {
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      return { error: 'Unauthorized' };
    }

    await connectDB();

    // Check if current user is admin
    const currentUserDoc = await User.findOne({ clerkId });
    
    if (!currentUserDoc || currentUserDoc.role !== 'admin') {
      return { error: 'Unauthorized - Admin access required' };
    }

    await User.findByIdAndUpdate(userId, { role: newRole });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Update user role error:', error);
    return { error: 'Failed to update role' };
  }
}

export async function getAllUsers(): Promise<{ users: UserType[]; error?: string }> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { users: [] };
    }

    await connectDB();

    // Check if current user is admin
    const currentUserDoc = await User.findOne({ clerkId: userId });
    
    if (!currentUserDoc || currentUserDoc.role !== 'admin') {
      return { error: 'Unauthorized - Admin access required', users: [] };
    }

    const users = await User.find({})
      .sort({ createdAt: -1 })
      .lean();

    return { users: JSON.parse(JSON.stringify(users)) };
  } catch (error) {
    console.error('Get all users error:', error);
    return { users: [] };
  }
}

