'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createCourse, updateCourse } from '@/lib/actions/course.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const courseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
  category: z.enum(['development', 'design', 'marketing', 'business', 'photography', 'music', 'other']),
  thumbnail: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormProps {
  mode: 'create' | 'edit';
  course?: {
    _id: string;
    title: string;
    description: string;
    category: string;
    thumbnail?: string;
  };
  onSuccess?: () => void;
}

const categories = [
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'business', label: 'Business' },
  { value: 'photography', label: 'Photography' },
  { value: 'music', label: 'Music' },
  { value: 'other', label: 'Other' },
];

export default function CourseForm({ mode, course, onSuccess }: CourseFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course?.title || '',
      description: course?.description || '',
      category: (course?.category as CourseFormData['category']) || undefined,
      thumbnail: course?.thumbnail || '',
    },
  });

  const selectedCategory = watch('category');

  const onSubmit = async (data: CourseFormData) => {
    setLoading(true);

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    if (data.thumbnail) {
      formData.append('thumbnail', data.thumbnail);
    }

    try {
      let result;
      
      if (mode === 'create') {
        result = await createCourse(formData);
      } else if (course?._id) {
        result = await updateCourse(course._id, formData);
      }

      if (result?.error) {
        toast.error(typeof result.error === 'string' ? result.error : 'Validation error');
        setLoading(false);
        return;
      }

      toast.success(mode === 'create' ? 'Course created!' : 'Course updated!');
      setLoading(false);
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/creator');
        router.refresh();
      }
    } catch {
      toast.error('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-white">Course Title</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="e.g., Complete Web Development Bootcamp"
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary"
        />
        {errors.title && (
          <p className="text-red-400 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-white">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Describe what students will learn in this course..."
          rows={4}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary"
        />
        {errors.description && (
          <p className="text-red-400 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="text-white">Category</Label>
        <Select
          value={selectedCategory}
          onValueChange={(value: CourseFormData['category']) => setValue('category', value)}
        >
          <SelectTrigger className="bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-white/10">
            {categories.map(cat => (
              <SelectItem 
                key={cat.value} 
                value={cat.value}
                className="text-white focus:bg-white/10"
              >
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-red-400 text-sm">{errors.category.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnail" className="text-white">Thumbnail URL (optional)</Label>
        <Input
          id="thumbnail"
          {...register('thumbnail')}
          placeholder="https://example.com/image.jpg"
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary"
        />
        {errors.thumbnail && (
          <p className="text-red-400 text-sm">{errors.thumbnail.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 text-black font-semibold"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {mode === 'create' ? 'Creating...' : 'Updating...'}
          </>
        ) : (
          mode === 'create' ? 'Create Course' : 'Update Course'
        )}
      </Button>
    </form>
  );
}
