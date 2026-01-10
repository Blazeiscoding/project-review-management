'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { completeOnboarding } from '@/lib/actions/user.actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Presentation, Loader2 } from 'lucide-react';

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [role, setRole] = useState<'student' | 'creator' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!role) {
      setError('Please select a role');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await completeOnboarding(role);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      router.push(`/${role}`);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Card className="w-full max-w-lg bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">
            Welcome, {user?.firstName || 'there'}! 👋
          </CardTitle>
          <CardDescription className="text-slate-300">
            Select your role to get started with Course Reviews
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`p-6 rounded-lg border-2 text-left transition-all duration-200 ${
                role === 'student'
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${
                  role === 'student' ? 'bg-purple-500' : 'bg-slate-600'
                }`}>
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">Student</h3>
                  <p className="text-sm text-slate-300 mt-1">
                    I want to review courses I&apos;ve taken and help others make informed decisions
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('creator')}
              className={`p-6 rounded-lg border-2 text-left transition-all duration-200 ${
                role === 'creator'
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${
                  role === 'creator' ? 'bg-purple-500' : 'bg-slate-600'
                }`}>
                  <Presentation className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">Course Creator</h3>
                  <p className="text-sm text-slate-300 mt-1">
                    I create courses and want to collect authentic reviews from my students
                  </p>
                </div>
              </div>
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!role || loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
