import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { getCreatorCourses } from '@/lib/actions/course.actions';
import { getAccessLinks } from '@/lib/actions/access.actions';
import { getPendingReviews } from '@/lib/actions/review.actions';
import { Navbar, Footer } from '@/components/shared';
import { CreateCourseDialog } from '@/components/courses';
import { ReviewCard, ModerateButton } from '@/components/reviews';
import AccessLinkManager from '@/components/courses/AccessLinkManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Star, Users, Eye, CheckCircle } from 'lucide-react';

export default async function CreatorDashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in');
  }

  if (!user.onboardingComplete) {
    redirect('/onboarding');
  }

  if (user.role !== 'creator') {
    redirect(`/${user.role}`);
  }

  const [{ courses }, { reviews: pendingReviews }] = await Promise.all([
    getCreatorCourses(),
    getPendingReviews(),
  ]);

  // Get all access links for all courses
  const courseLinksPromises = courses.map(async (course) => {
    const { links } = await getAccessLinks(course._id);
    return { courseId: course._id, links };
  });
  const allCourseLinks = await Promise.all(courseLinksPromises);
  const courseLinksMap = Object.fromEntries(
    allCourseLinks.map(({ courseId, links }) => [courseId, links])
  );

  const totalReviews = courses.reduce((sum, c) => sum + c.totalReviews, 0);
  const avgRating = courses.length > 0
    ? courses.reduce((sum, c) => sum + c.averageRating, 0) / courses.filter(c => c.averageRating > 0).length || 0
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole={user.role} />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Creator Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your courses and collect reviews
            </p>
          </div>
          
          <CreateCourseDialog />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-slide-up">
          <Card className="bg-card border-border">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{courses.length}</p>
                <p className="text-muted-foreground text-sm">Courses</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <Star className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalReviews}</p>
                <p className="text-muted-foreground text-sm">Total Reviews</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-yellow-500/10 rounded-xl">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {avgRating > 0 ? avgRating.toFixed(1) : '-'}
                </p>
                <p className="text-muted-foreground text-sm">Avg Rating</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingReviews.length}</p>
                <p className="text-muted-foreground text-sm">Pending Reviews</p>
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
            <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Pending Reviews
              {pendingReviews.length > 0 && (
                <Badge className="ml-2 bg-primary text-black">{pendingReviews.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            {courses.length > 0 ? (
              <div className="space-y-8">
                {courses.map((course) => (
                  <Card key={course._id} className="bg-card border-border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-foreground">{course.title}</CardTitle>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="border-border">
                              {course.category}
                            </Badge>
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              {course.averageRating > 0 ? course.averageRating.toFixed(1) : 'New'} 
                              ({course.totalReviews} reviews)
                            </span>
                          </div>
                        </div>
                        <Link href={`/courses/${course._id}`}>
                          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <AccessLinkManager 
                        courseId={course._id} 
                        courseName={course.title}
                        links={courseLinksMap[course._id] || []}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No courses yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first course to start collecting reviews.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending">
            {pendingReviews.length > 0 ? (
              <div className="space-y-4">
                {pendingReviews.map((review) => (
                  <div key={review._id} className="relative">
                    <ReviewCard review={review} showStatus />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <ModerateButton reviewId={review._id} action="approved" />
                      <ModerateButton reviewId={review._id} action="rejected" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">All caught up!</h3>
                  <p className="text-muted-foreground">
                    No reviews pending moderation.
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
