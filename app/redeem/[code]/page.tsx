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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardContent className="p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 text-purple-500 mx-auto mb-4 animate-spin" />
              <h2 className="text-xl font-semibold text-white mb-2">Redeeming Access Link</h2>
              <p className="text-slate-400">Please wait...</p>
            </>
          )}

          {status === 'signin' && (
            <>
              <LogIn className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Sign In Required</h2>
              <p className="text-slate-400 mb-6">
                Please sign in to redeem this access link and review the course.
              </p>
              <div className="flex flex-col gap-3">
                <Link href={`/sign-in?redirect_url=/redeem/${code}`}>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Sign In
                  </Button>
                </Link>
                <Link href={`/sign-up?redirect_url=/redeem/${code}`}>
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300">
                    Create Account
                  </Button>
                </Link>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Access Granted!</h2>
              <p className="text-slate-400 mb-6">{message}</p>
              <div className="flex flex-col gap-3">
                {courseId && (
                  <Button 
                    onClick={() => router.push(`/courses/${courseId}`)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Go to Course
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/student')}
                  className="border-slate-600 text-slate-300"
                >
                  Go to Dashboard
                </Button>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Redemption Failed</h2>
              <p className="text-slate-400 mb-6">{message}</p>
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => router.push('/courses')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Browse Courses
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/')}
                  className="border-slate-600 text-slate-300"
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
