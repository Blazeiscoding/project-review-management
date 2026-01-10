'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CourseForm } from '@/components/courses';
import { Plus } from 'lucide-react';

export default function CreateCourseDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-black font-semibold">
          <Plus className="h-4 w-4 mr-2" />
          New Course
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-white/10 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Course</DialogTitle>
        </DialogHeader>
        <CourseForm mode="create" onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
