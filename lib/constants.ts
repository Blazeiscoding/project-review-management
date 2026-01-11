// Role constants
export const ROLES = {
  STUDENT: 'student',
  CREATOR: 'creator',
  ADMIN: 'admin',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// Review status constants
export const REVIEW_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type ReviewStatus = typeof REVIEW_STATUS[keyof typeof REVIEW_STATUS];

// Course categories
export const COURSE_CATEGORIES = [
  'web-development',
  'mobile-development',
  'data-science',
  'machine-learning',
  'devops',
  'design',
  'business',
  'other',
] as const;

export type CourseCategory = typeof COURSE_CATEGORIES[number];

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
} as const;

// Validation limits
export const LIMITS = {
  TITLE_MIN: 3,
  TITLE_MAX: 100,
  DESCRIPTION_MIN: 10,
  DESCRIPTION_MAX: 5000,
  REVIEW_CONTENT_MIN: 20,
  REVIEW_CONTENT_MAX: 10000,
  MAX_REVIEW_IMAGES: 5,
} as const;
