import { z } from 'zod';

/**
 * Environment variable validation
 * Import this file early in your app to fail fast if env vars are missing
 */

const envSchema = z.object({
  // MongoDB
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  
  // Clerk Auth
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1, 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required'),
  CLERK_SECRET_KEY: z.string().min(1, 'CLERK_SECRET_KEY is required'),
  CLERK_WEBHOOK_SECRET: z.string().optional(),
  
  // Clerk URLs (optional, have defaults)
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default('/sign-in'),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default('/sign-up'),
  
  // App Config
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

function validateEnv() {
  const parsed = envSchema.safeParse(process.env);
  
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    const errors = parsed.error.flatten().fieldErrors;
    for (const [key, messages] of Object.entries(errors)) {
      console.error(`  ${key}: ${messages?.join(', ')}`);
    }
    throw new Error('Invalid environment variables. Check your .env file.');
  }
  
  return parsed.data;
}

// Validate on import in development
if (process.env.NODE_ENV !== 'production') {
  validateEnv();
}

export const env = {
  MONGODB_URI: process.env.MONGODB_URI!,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!,
  CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/sign-in',
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || '/sign-up',
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
};

export default env;
