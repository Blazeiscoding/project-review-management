# CourseReviews 📚

A modern course review management platform built with Next.js 16, enabling students to share authentic reviews and course creators to manage feedback.

## ✨ Features

- **Verified Student Reviews** - Only students with access links can review courses
- **Multi-dimensional Ratings** - Rate instructor quality, content quality, and value for money
- **Creator Dashboard** - Course creators can manage courses and generate access links
- **Admin Panel** - Full user, course, and review moderation capabilities
- **Modern UI** - ChaiCode-inspired dark theme with smooth animations

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Authentication**: Clerk
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + shadcn/ui
- **Validation**: Zod
- **Forms**: React Hook Form

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- MongoDB instance (local or MongoDB Atlas)
- Clerk account

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SECRET=whsec_... (optional, for webhooks)

# Clerk URLs (optional, have defaults)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# App Configuration (optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation

```bash
# Install dependencies
bun install

# Run development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
├── app/                  # Next.js App Router pages
│   ├── (auth)/          # Auth pages (sign-in, sign-up)
│   ├── (dashboard)/     # Dashboard pages (admin, creator, student)
│   ├── api/             # API routes (webhooks)
│   ├── courses/         # Course pages
│   └── redeem/          # Access link redemption
├── components/          # React components
│   ├── courses/         # Course-related components
│   ├── reviews/         # Review-related components
│   ├── shared/          # Shared components (Navbar, Footer)
│   └── ui/              # shadcn/ui components
├── lib/                 # Utilities and server logic
│   ├── actions/         # Server Actions
│   ├── db/              # Database models and connection
│   ├── auth-helpers.ts  # Authentication utilities
│   ├── constants.ts     # App constants
│   ├── env.ts           # Environment validation
│   └── types.ts         # TypeScript types
└── public/              # Static assets
```

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **Student** | Browse courses, redeem access links, write reviews |
| **Creator** | Create courses, generate access links, moderate reviews |
| **Admin** | Full access: manage users, courses, and all reviews |

## 🔗 Key Features

### For Students
1. Receive access link from course creator
2. Redeem link to verify course enrollment
3. Write detailed reviews with ratings

### For Creators
1. Add courses to the platform
2. Generate unique access links for students
3. Moderate reviews on their courses

### For Admins
1. Manage all users and roles
2. Delete courses if needed
3. Moderate all reviews platform-wide

## 📝 License

MIT © 2026
