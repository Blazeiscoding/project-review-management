import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getCourse } from '@/lib/actions/course.actions';
import { getCourseReviews, checkReviewAccess } from '@/lib/actions/review.actions';
import { Navbar, Footer } from '@/components/shared';
import { ReviewCard, ReviewForm, StarRating } from '@/components/reviews';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Users, Calendar, CheckCircle, Lock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PageProps {
  params: Promise<{ id: string }>;
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

export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const course = await getCourse(id);

  if (!course) {
    notFound();
  }

  const [{ reviews }, { hasAccess, hasReviewed }] = await Promise.all([
    getCourseReviews(id),
    checkReviewAccess(id),
  ]);

  const creatorInitials = course.creator 
    ? `${course.creator.firstName[0]}${course.creator.lastName[0]}`
    : 'C';

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div>
              <Badge className={`${categoryColors[course.category]} border mb-4`}>
                {course.category}
              </Badge>
              
              <h1 className="text-3xl font-bold text-white mb-4">{course.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/50 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-white font-medium">
                    {course.averageRating > 0 ? course.averageRating.toFixed(1) : 'New'}
                  </span>
                  <span>({course.totalReviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Created {formatDistanceToNow(new Date(course.createdAt), { addSuffix: true })}</span>
                </div>
              </div>

              {/* Thumbnail */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10">
                {course.thumbnail ? (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl font-bold text-white/20">
                      {course.title.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">About this Course</h2>
              <p className="text-white/70 whitespace-pre-line">{course.description}</p>
            </div>

            {/* Review Form (if has access) */}
            {hasAccess && !hasReviewed && (
              <ReviewForm courseId={id} courseName={course.title} />
            )}

            {hasReviewed && (
              <Card className="bg-green-500/10 border-green-500/20">
                <CardContent className="flex items-center gap-3 py-4">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <p className="text-green-400">
                    Thank you! You have already submitted a review for this course.
                  </p>
                </CardContent>
              </Card>
            )}

            {!hasAccess && (
              <Card className="bg-white/[0.03] border-white/10">
                <CardContent className="flex items-center gap-3 py-4">
                  <Lock className="h-5 w-5 text-white/50" />
                  <p className="text-white/50">
                    You need an access link from the course creator to submit a review.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Student Reviews ({reviews.length})
              </h2>

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
                </div>
              ) : (
                <Card className="bg-white/[0.03] border-white/10">
                  <CardContent className="text-center py-8">
                    <Star className="h-10 w-10 text-white/20 mx-auto mb-3" />
                    <p className="text-white/50">No reviews yet. Be the first to review!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Creator Card */}
              <Card className="bg-white/[0.03] border-white/10">
                <CardContent className="p-6">
                  <h3 className="text-sm font-medium text-white/50 mb-4">Course Creator</h3>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={course.creator?.profileImage} />
                      <AvatarFallback className="bg-primary text-black font-semibold">
                        {creatorInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-white">
                        {course.creator?.firstName} {course.creator?.lastName}
                      </p>
                      <p className="text-sm text-white/50">Course Creator</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rating Summary */}
              {course.totalReviews > 0 && (
                <Card className="bg-white/[0.03] border-white/10">
                  <CardContent className="p-6">
                    <h3 className="text-sm font-medium text-white/50 mb-4">Rating Summary</h3>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-white mb-2">
                        {course.averageRating.toFixed(1)}
                      </div>
                      <StarRating rating={Math.round(course.averageRating)} readonly />
                      <p className="text-white/50 text-sm mt-2">
                        Based on {course.totalReviews} reviews
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
