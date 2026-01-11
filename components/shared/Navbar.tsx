'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  SignedIn, 
  SignedOut, 
  UserButton,
  SignInButton,
  SignUpButton
} from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import { BookOpen, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavbarProps {
  userRole?: 'student' | 'creator' | 'admin' | null;
}

export default function Navbar({ userRole }: NavbarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  const getDashboardLink = () => {
    if (!userRole) return '/onboarding';
    return `/${userRole}`;
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-sm border-b border-border' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-primary group-hover:bg-primary/90 transition-colors">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:block">
              CourseReviews
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/courses" 
              className={`text-sm font-medium transition-colors ${
                isActive('/courses') 
                  ? 'text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Browse Courses
            </Link>

            <SignedIn>
              <Link 
                href={getDashboardLink()}
                className={`text-sm font-medium transition-colors ${
                  pathname?.startsWith('/student') || 
                  pathname?.startsWith('/creator') || 
                  pathname?.startsWith('/admin')
                    ? 'text-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Dashboard
              </Link>
            </SignedIn>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            <SignedOut>
              <div className="hidden sm:flex items-center gap-3">
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Get Started
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>

            <SignedIn>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'h-9 w-9',
                  }
                }}
              />
            </SignedIn>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="flex flex-col gap-4">
              <Link 
                href="/courses"
                onClick={() => setIsMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground px-2 py-2"
              >
                Browse Courses
              </Link>
              
              <SignedIn>
                <Link 
                  href={getDashboardLink()}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-muted-foreground hover:text-foreground px-2 py-2"
                >
                  Dashboard
                </Link>
              </SignedIn>

              <SignedOut>
                <div className="flex flex-col gap-2 pt-2 border-t border-border">
                  <SignInButton mode="modal">
                    <Button variant="ghost" className="justify-start text-muted-foreground hover:text-foreground">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Get Started
                    </Button>
                  </SignUpButton>
                </div>
              </SignedOut>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
