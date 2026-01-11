'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { redeemAccessLink } from '@/lib/actions/access.actions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, LogIn } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ code: string }>;
}

export default function RedeemPage({ params }: PageProps) {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'signin'>('loading');
  const [message, setMessage] = useState('');
  const [courseId, setCourseId] = useState<string | null>(null);
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    async function getCode() {
      const resolvedParams = await params;
      setCode(resolvedParams.code);
    }
    getCode();
  }, [params]);

  useEffect(() => {
    if (!code || !isLoaded) return;

    if (!isSignedIn) {
      setStatus('signin');
      return;
    }

    async function redeem() {
      const result = await redeemAccessLink(code);

      if (result.error) {
        setStatus('error');
        setMessage(result.error);
        return;
      }

      setStatus('success');
      setMessage(result.message || 'Access granted! You can now review this course.');
      setCourseId(result.courseId || null);
    }

    redeem();
  }, [code, isSignedIn, isLoaded]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      
      {/* Orange glow effect */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      
      <Card className="relative w-full max-w-md bg-card/50 backdrop-blur-sm border-border">
        <CardContent className="p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Redeeming Access Link</h2>
              <p className="text-muted-foreground">Please wait...</p>
            </>
          )}

          {status === 'signin' && (
            <>
              <LogIn className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Sign In Required</h2>
              <p className="text-muted-foreground mb-6">
                Please sign in to redeem this access link and review the course.
              </p>
              <div className="flex flex-col gap-3">
                <Link href={`/sign-in?redirect_url=/redeem/${code}`}>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Sign In
                  </Button>
                </Link>
                <Link href={`/sign-up?redirect_url=/redeem/${code}`}>
                  <Button variant="outline" className="w-full border-border text-foreground hover:bg-accent">
                    Create Account
                  </Button>
                </Link>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Access Granted!</h2>
              <p className="text-muted-foreground mb-6">{message}</p>
              <div className="flex flex-col gap-3">
                {courseId && (
                  <Button 
                    onClick={() => router.push(`/courses/${courseId}`)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Go to Course
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/student')}
                  className="border-border text-foreground hover:bg-accent"
                >
                  Go to Dashboard
                </Button>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Redemption Failed</h2>
              <p className="text-muted-foreground mb-6">{message}</p>
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => router.push('/courses')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Browse Courses
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/')}
                  className="border-border text-foreground hover:bg-accent"
                >
                  Go Home
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

