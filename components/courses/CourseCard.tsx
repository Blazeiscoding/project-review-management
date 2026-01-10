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
  development: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  design: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  marketing: 'bg-green-500/20 text-green-400 border-green-500/30',
  business: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  photography: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  music: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  other: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course._id}`}>
      <Card className="group bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 overflow-hidden h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-slate-700">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl font-bold text-slate-600">
                {course.title.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className={`${categoryColors[course.category]} border`}>
              {course.category}
            </Badge>
          </div>
        </div>

        <CardContent className="pt-4 flex-grow">
          <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
            {course.title}
          </h3>
          <p className="text-slate-400 text-sm line-clamp-2">
            {course.description}
          </p>
        </CardContent>

        <CardFooter className="pt-0 flex items-center justify-between border-t border-slate-700/50 mt-auto">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-white font-medium">
              {course.averageRating > 0 ? course.averageRating.toFixed(1) : 'New'}
            </span>
            <span className="text-slate-500 text-sm">
              ({course.totalReviews})
            </span>
          </div>

          {/* Creator */}
          {course.creator && (
            <div className="flex items-center gap-1 text-slate-400 text-sm">
              <Users className="h-4 w-4" />
              <span>{course.creator.firstName} {course.creator.lastName}</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
