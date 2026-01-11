import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import StarRating from './StarRating';
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardProps {
  review: {
    _id: string;
    title: string;
    content: string;
    overallRating: number;
    ratings: {
      instructorQuality: number;
      contentQuality: number;
      valueForMoney: number;
    };
    images?: string[];
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    student?: {
      firstName: string;
      lastName: string;
      profileImage?: string;
    };
  };
  showStatus?: boolean;
}

export default function ReviewCard({ review, showStatus = false }: ReviewCardProps) {
  const initials = review.student 
    ? `${review.student.firstName[0]}${review.student.lastName[0]}`
    : 'U';

  const statusColors = {
    pending: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
    approved: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    rejected: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={review.student?.profileImage} />
              <AvatarFallback className="bg-muted text-muted-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">
                {review.student 
                  ? `${review.student.firstName} ${review.student.lastName}`
                  : 'Anonymous User'}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StarRating rating={review.overallRating} readonly size="sm" />
            {showStatus && (
              <Badge className={`${statusColors[review.status]} border`}>
                {review.status}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-foreground mb-2">{review.title}</h4>
          <p className="text-muted-foreground text-sm">{review.content}</p>
        </div>

        {/* Detailed Ratings */}
        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Instructor</p>
            <div className="flex items-center justify-center gap-1">
              <StarRating rating={review.ratings.instructorQuality} readonly size="sm" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Content</p>
            <div className="flex items-center justify-center gap-1">
              <StarRating rating={review.ratings.contentQuality} readonly size="sm" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Value</p>
            <div className="flex items-center justify-center gap-1">
              <StarRating rating={review.ratings.valueForMoney} readonly size="sm" />
            </div>
          </div>
        </div>

        {/* Review Images */}
        {review.images && review.images.length > 0 && (
          <div className="flex gap-2 pt-2">
            {review.images.map((img, idx) => (
              <div 
                key={idx}
                className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={img} 
                  alt={`Review image ${idx + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
