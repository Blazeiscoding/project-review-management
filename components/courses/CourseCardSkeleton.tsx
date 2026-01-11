import { Card, CardContent, CardFooter } from '@/components/ui/card';

export default function CourseCardSkeleton() {
  return (
    <Card className="bg-muted/50 border-border overflow-hidden h-full flex flex-col animate-pulse">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted" />

      <CardContent className="pt-4 flex-grow space-y-3">
        {/* Title */}
        <div className="h-6 bg-muted rounded w-3/4" />
        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between border-t border-border mt-auto">
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-muted rounded" />
          <div className="h-4 w-12 bg-muted rounded" />
        </div>
        {/* Creator */}
        <div className="h-4 w-24 bg-muted rounded" />
      </CardFooter>
    </Card>
  );
}
