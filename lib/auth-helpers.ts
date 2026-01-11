'use server';

import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class UserNotFoundError extends AuthError {
  constructor(message = 'User not found') {
    super(message);
    this.name = 'UserNotFoundError';
  }
}

export class ForbiddenError extends AuthError {
  constructor(message = 'Forbidden - insufficient permissions') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

interface AuthenticatedUser {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _id: any;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  role: 'student' | 'creator' | 'admin';
}

/**
 * Get the authenticated user from Clerk + MongoDB
 * Throws UnauthorizedError if not logged in
 * Throws UserNotFoundError if user doesn't exist in MongoDB
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser> {
  const { userId } = await auth();
  
  if (!userId) {
    throw new UnauthorizedError();
  }

  await connectDB();
  
  const user = await User.findOne({ clerkId: userId }).lean();
  
  if (!user) {
    throw new UserNotFoundError();
  }

  return user as AuthenticatedUser;
}

/**
 * Get authenticated user with specific role requirement
 * Throws ForbiddenError if user doesn't have required role
 */
export async function getAuthenticatedUserWithRole(
  allowedRoles: ('student' | 'creator' | 'admin')[]
): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser();
  
  if (!allowedRoles.includes(user.role)) {
    throw new ForbiddenError(`${allowedRoles.join(' or ')} access required`);
  }

  return user;
}

/**
 * Get authenticated user, returns null if not logged in (non-throwing)
 * Useful for optional auth scenarios
 */
export async function getOptionalAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    return await getAuthenticatedUser();
  } catch {
    return null;
  }
}
