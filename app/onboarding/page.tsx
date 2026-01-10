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
    <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      
      {/* Orange glow behind card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-primary/15 blur-[150px] rounded-full pointer-events-none" />
      
      <Card className="relative w-full max-w-lg bg-white/[0.03] backdrop-blur-sm border-white/10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">
            Welcome, {user?.firstName || 'there'}! 👋
          </CardTitle>
          <CardDescription className="text-white/60">
            Select your role to get started with Course Reviews
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                role === 'student'
                  ? 'border-primary bg-primary/10'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  role === 'student' ? 'bg-primary' : 'bg-white/10'
                }`}>
                  <GraduationCap className={`h-6 w-6 ${role === 'student' ? 'text-black' : 'text-white'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">Student</h3>
                  <p className="text-sm text-white/50 mt-1">
                    I want to review courses I&apos;ve taken and help others make informed decisions
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('creator')}
              className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                role === 'creator'
                  ? 'border-primary bg-primary/10'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  role === 'creator' ? 'bg-primary' : 'bg-white/10'
                }`}>
                  <Presentation className={`h-6 w-6 ${role === 'creator' ? 'text-black' : 'text-white'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">Course Creator</h3>
                  <p className="text-sm text-white/50 mt-1">
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
            className="w-full bg-primary hover:bg-primary/90 text-black font-semibold rounded-tr-2xl rounded-bl-2xl rounded-tl-md rounded-br-md"
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
