'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createReview } from '@/lib/actions/review.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StarRating from './StarRating';
import { Loader2, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const reviewSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  content: z.string().min(20, 'Review must be at least 20 characters').max(3000),
  overallRating: z.number().min(1, 'Please select an overall rating').max(5),
  instructorQuality: z.number().min(1).max(5),
  contentQuality: z.number().min(1).max(5),
  valueForMoney: z.number().min(1).max(5),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  courseId: string;
  courseName: string;
}

export default function ReviewForm({ courseId, courseName }: ReviewFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      title: '',
      content: '',
      overallRating: 0,
      instructorQuality: 0,
      contentQuality: 0,
      valueForMoney: 0,
    },
  });

  const overallRating = watch('overallRating');
  const instructorQuality = watch('instructorQuality');
  const contentQuality = watch('contentQuality');
  const valueForMoney = watch('valueForMoney');

  const onSubmit = async (data: ReviewFormData) => {
    setLoading(true);

    try {
      const result = await createReview({
        courseId,
        overallRating: data.overallRating,
        ratings: {
          instructorQuality: data.instructorQuality,
          contentQuality: data.contentQuality,
          valueForMoney: data.valueForMoney,
        },
        title: data.title,
        content: data.content,
      });

      if (result?.error) {
        toast.error(typeof result.error === 'string' ? result.error : 'Validation error');
        setLoading(false);
        return;
      }

      toast.success('Review submitted! It will be visible after approval.');
      router.refresh();
    } catch {
      toast.error('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Write a Review for {courseName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Overall Rating */}
          <div className="space-y-3">
            <Label className="text-slate-200">Overall Rating</Label>
            <div className="flex items-center gap-3">
              <StarRating 
                rating={overallRating} 
                onRatingChange={(val) => setValue('overallRating', val)}
                size="lg"
              />
              <span className="text-slate-400 text-sm">
                {overallRating > 0 ? `${overallRating}/5` : 'Select rating'}
              </span>
            </div>
            {errors.overallRating && (
              <p className="text-red-400 text-sm">{errors.overallRating.message}</p>
            )}
          </div>

          {/* Detailed Ratings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-700/30 rounded-lg">
            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">Instructor Quality</Label>
              <StarRating 
                rating={instructorQuality} 
                onRatingChange={(val) => setValue('instructorQuality', val)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">Content Quality</Label>
              <StarRating 
                rating={contentQuality} 
                onRatingChange={(val) => setValue('contentQuality', val)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">Value for Money</Label>
              <StarRating 
                rating={valueForMoney} 
                onRatingChange={(val) => setValue('valueForMoney', val)}
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-200">Review Title</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Summarize your experience..."
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
            {errors.title && (
              <p className="text-red-400 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-slate-200">Your Review</Label>
            <Textarea
              id="content"
              {...register('content')}
              placeholder="Share your detailed experience with this course..."
              rows={5}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
            {errors.content && (
              <p className="text-red-400 text-sm">{errors.content.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
