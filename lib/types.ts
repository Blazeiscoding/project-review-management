// Standardized server action response types

export type ActionResponse<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

// Course types
export interface CourseData {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnail?: string;
  creator: {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  averageRating: number;
  totalReviews: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Review types
export interface ReviewData {
  _id: string;
  course: string | CourseData;
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
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
  createdAt: string;
  updatedAt: string;
}

// User types
export interface UserData {
  _id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  role: 'student' | 'creator' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// Access types
export interface ReviewAccessData {
  _id: string;
  student: string | UserData;
  course: string | CourseData;
  hasSubmittedReview: boolean;
  createdAt: string;
}

// Pagination types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  pages: number;
  currentPage: number;
}
