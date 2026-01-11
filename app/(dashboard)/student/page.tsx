import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { getStudentReviews } from '@/lib/actions/review.actions';
import { getStudentAccessibleCourses } from '@/lib/actions/access.actions';
import { Navbar, Footer } from '@/components/shared';
import { CourseCard } from '@/components/courses';
import { ReviewCard, StarRating } from '@/components/reviews';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Star, Link as LinkIcon } from 'lucide-react';

export default async function StudentDashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in');
  }

  if (!user.onboardingComplete) {
    redirect('/onboarding');
  }

  if (user.role !== 'student') {
    redirect(`/${user.role}`);
  }

  const [{ reviews }, { courses }] = await Promise.all([
    getStudentReviews(),
    getStudentAccessibleCourses(),
  ]);

  const pendingReviews = courses.filter(c => !c.hasReviewed);

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole={user.role} />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-muted-foreground">
            Manage your course reviews and accessible courses
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{courses.length}</p>
                <p className="text-muted-foreground text-sm">Accessible Courses</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/[0.03] border-white/10">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <Star className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{reviews.length}</p>
                <p className="text-white/50 text-sm">Reviews Written</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/[0.03] border-white/10">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-yellow-500/10 rounded-xl">
                <LinkIcon className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{pendingReviews.length}</p>
                <p className="text-white/50 text-sm">Pending Reviews</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="bg-muted border border-border p-1">
            <TabsTrigger value="courses" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              My Courses
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              My Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            {courses.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course._id} className="relative">
                    <CourseCard course={course} />
                    {course.hasReviewed ? (
                      <Badge className="absolute top-3 right-3 bg-green-500">
                        Reviewed
                      </Badge>
                    ) : (
                      <Badge className="absolute top-3 right-3 bg-yellow-500">
                        Needs Review
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No courses yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You need an access link from a course creator to review courses.
                  </p>
                  <Link href="/courses" className="text-primary hover:text-primary/80">
                    Browse available courses →
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reviews">
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review._id} className="bg-card border-border">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Link 
                          href={`/courses/${review.course?._id}`}
                          className="text-primary hover:text-primary/80 font-medium"
                        >
                          {review.course?.title}
                        </Link>
                        <Badge 
                          className={
                            review.status === 'approved' 
                              ? 'bg-green-500/10 text-green-500 border-green-500/20'
                              : review.status === 'rejected'
                              ? 'bg-red-500/10 text-red-500 border-red-500/20'
                              : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                          }
                        >
                          {review.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-2">
                        <StarRating rating={review.overallRating} readonly size="sm" />
                      </div>
                      <h4 className="font-medium text-foreground mb-1">{review.title}</h4>
                      <p className="text-muted-foreground text-sm line-clamp-2">{review.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="text-center py-12">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground">
                    Once you have access to a course, you can submit reviews here.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
