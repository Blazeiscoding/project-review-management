import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Users } from 'lucide-react';

interface CourseCardProps {
  course: {
    _id: string;
    title: string;
    description: string;
    category: string;
    thumbnail?: string;
    averageRating: number;
    totalReviews: number;
    creator?: {
      firstName: string;
      lastName: string;
    };
  };
}

const categoryColors: Record<string, string> = {
  development: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  design: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  marketing: 'bg-green-500/10 text-green-400 border-green-500/20',
  business: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  photography: 'bg-primary/10 text-primary border-primary/20',
  music: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  other: 'bg-white/5 text-white/60 border-white/10',
};

export default function CourseCard({ course }: CourseCardProps) {
  // Guard against incomplete course data
  if (!course || !course.title) {
    return null;
  }

  return (
    <Link href={`/courses/${course._id}`}>
      <Card className="group bg-white/[0.03] border border-white/10 hover:border-primary/50 hover:bg-white/[0.05] transition-all duration-300 overflow-hidden h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl font-bold text-muted-foreground/50">
                {course.title?.charAt(0)?.toUpperCase() || 'C'}
              </div>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className={`${categoryColors[course.category] || categoryColors.other} border`}>
              {course.category || 'other'}
            </Badge>
          </div>
        </div>

        <CardContent className="pt-4 flex-grow">
          <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {course.description}
          </p>
        </CardContent>

        <CardFooter className="pt-0 flex items-center justify-between border-t border-border mt-auto">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-foreground font-medium">
              {course.averageRating > 0 ? course.averageRating.toFixed(1) : 'New'}
            </span>
            <span className="text-muted-foreground text-sm">
              ({course.totalReviews})
            </span>
          </div>

          {/* Creator */}
          {course.creator && (
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Users className="h-4 w-4" />
              <span>{course.creator.firstName} {course.creator.lastName}</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
