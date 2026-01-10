import Link from 'next/link';
import { BookOpen, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-purple-600">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">CourseReviews</span>
            </Link>
            <p className="text-slate-400 text-sm max-w-md">
              Authentic course reviews from real students. Make informed decisions 
              about your learning journey with verified reviews.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* For Creators */}
          <div>
            <h3 className="font-semibold text-white mb-4">For Creators</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sign-up" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Become a Creator
                </Link>
              </li>
              <li>
                <Link href="/creator" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Creator Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} CourseReviews. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-white transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
