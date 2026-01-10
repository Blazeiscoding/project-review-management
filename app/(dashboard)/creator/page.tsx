import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { getCreatorCourses } from '@/lib/actions/course.actions';
import { getAccessLinks } from '@/lib/actions/access.actions';
import { getPendingReviews } from '@/lib/actions/review.actions';
import { Navbar, Footer } from '@/components/shared';
import { CourseForm } from '@/components/courses';
import { ReviewCard, ModerateButton } from '@/components/reviews';
import AccessLinkManager from '@/components/courses/AccessLinkManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { BookOpen, Star, Users, Plus, Eye, CheckCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-900">
      <Navbar userRole={user.role} />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Creator Dashboard
            </h1>
            <p className="text-slate-400">
              Manage your courses and collect reviews
            </p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                New Course
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Course</DialogTitle>
              </DialogHeader>
              <CourseForm mode="create" />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{courses.length}</p>
                <p className="text-slate-400 text-sm">Courses</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Star className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalReviews}</p>
                <p className="text-slate-400 text-sm">Total Reviews</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Star className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {avgRating > 0 ? avgRating.toFixed(1) : '-'}
                </p>
                <p className="text-slate-400 text-sm">Avg Rating</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Users className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{pendingReviews.length}</p>
                <p className="text-slate-400 text-sm">Pending Reviews</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="bg-slate-800 p-1">
            <TabsTrigger value="courses" className="data-[state=active]:bg-purple-600">
              My Courses
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-purple-600">
              Pending Reviews
              {pendingReviews.length > 0 && (
                <Badge className="ml-2 bg-orange-500">{pendingReviews.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            {courses.length > 0 ? (
              <div className="space-y-8">
                {courses.map((course) => (
                  <Card key={course._id} className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white">{course.title}</CardTitle>
                          <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                            <Badge variant="outline" className="border-slate-600">
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
                          <Button variant="ghost" className="text-slate-400">
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
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No courses yet</h3>
                  <p className="text-slate-400 mb-4">
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
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">All caught up!</h3>
                  <p className="text-slate-400">
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
