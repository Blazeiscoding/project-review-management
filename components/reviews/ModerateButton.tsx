'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { moderateReview } from '@/lib/actions/review.actions';
import { toast } from 'sonner';

interface ModerateButtonProps {
  reviewId: string;
  action: 'approved' | 'rejected';
}

export function ModerateButton({ reviewId, action }: ModerateButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await moderateReview(reviewId, action);
      
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(`Review ${action}!`);
        router.refresh(); // Force immediate UI update
      }
    });
  };

  return (
    <Button 
      onClick={handleClick}
      disabled={isPending}
      size="sm" 
      variant={action === 'approved' ? 'default' : 'destructive'}
      className={action === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : action === 'approved' ? (
        <><CheckCircle className="h-4 w-4 mr-1" /> Approve</>
      ) : (
        <><XCircle className="h-4 w-4 mr-1" /> Reject</>
      )}
    </Button>
  );
}

