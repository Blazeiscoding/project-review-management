import Link from 'next/link';
import { BookOpen, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-primary">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">CourseReviews</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              Authentic course reviews from real students. Make informed decisions 
              about your learning journey with verified reviews.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* For Creators */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">For Creators</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sign-up" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Become a Creator
                </Link>
              </li>
              <li>
                <Link href="/creator" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Creator Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground/80 text-sm">
            © {new Date().getFullYear()} CourseReviews. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground/80 hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground/80 hover:text-foreground transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
