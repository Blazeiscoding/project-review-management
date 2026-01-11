import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Manrope, Geist_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const manrope = Manrope({
  variable: '--font-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'CourseReviews - Authentic Course Reviews from Real Students',
  description: 'Make informed decisions about your learning journey with authentic, verified course reviews from fellow students.',
  keywords: ['course reviews', 'online courses', 'student reviews', 'course ratings'],
  openGraph: {
    title: 'CourseReviews - Authentic Course Reviews from Real Students',
    description: 'Make informed decisions about your learning journey with authentic, verified course reviews from fellow students.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${manrope.variable} ${geistMono.variable} font-sans antialiased`}>
          {children}
          <Toaster position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  )
}
