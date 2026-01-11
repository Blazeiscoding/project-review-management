import { Card, CardContent } from '@/components/ui/card';

export default function ReviewCardSkeleton() {
  return (
    <Card className="bg-muted/50 border-border animate-pulse">
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="h-10 w-10 bg-muted rounded-full" />
            <div className="space-y-2">
              {/* Name */}
              <div className="h-4 w-24 bg-muted rounded" />
              {/* Date */}
              <div className="h-3 w-16 bg-muted rounded" />
            </div>
          </div>
          {/* Rating */}
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 w-4 bg-muted rounded" />
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="h-5 w-2/3 bg-muted rounded" />

        {/* Content */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-3/4 bg-muted rounded" />
        </div>

        {/* Rating breakdown */}
        <div className="flex gap-4 pt-2">
          <div className="h-3 w-32 bg-muted rounded" />
          <div className="h-3 w-32 bg-muted rounded" />
          <div className="h-3 w-32 bg-muted rounded" />
        </div>
      </CardContent>
    </Card>
  );
}
