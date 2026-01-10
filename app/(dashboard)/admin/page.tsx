import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, getAllUsers, updateUserRole } from '@/lib/actions/user.actions';
import { getAllCourses } from '@/lib/actions/course.actions';
import { getPendingReviews } from '@/lib/actions/review.actions';
import { Navbar, Footer } from '@/components/shared';
import { ReviewCard, ModerateButton } from '@/components/reviews';
import { DeleteCourseButton } from '@/components/courses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Users, BookOpen, Star, Shield, CheckCircle, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

async function RoleSelector({ userId, currentRole }: { userId: string; currentRole: string }) {
  async function handleRoleChange(formData: FormData) {
    'use server';
    const newRole = formData.get('role') as 'student' | 'creator' | 'admin';
    await updateUserRole(userId, newRole);
  }

  return (
    <form action={handleRoleChange} className="flex items-center gap-2">
      <Select name="role" defaultValue={currentRole}>
        <SelectTrigger className="w-28 bg-white/5 border-white/10 text-white text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-white/10">
          <SelectItem value="student" className="text-white">Student</SelectItem>
          <SelectItem value="creator" className="text-white">Creator</SelectItem>
          <SelectItem value="admin" className="text-white">Admin</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-black font-medium">
        Update
      </Button>
    </form>
  );
}

export default async function AdminDashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in');
  }

  if (user.role !== 'admin') {
    redirect(user.onboardingComplete ? `/${user.role}` : '/onboarding');
  }

  const [{ users }, { courses, total: totalCourses }, { reviews: pendingReviews }] = await Promise.all([
    getAllUsers(),
    getAllCourses({ limit: 100 }),
    getPendingReviews(),
  ]);

  const studentCount = users.filter(u => u.role === 'student').length;
  const creatorCount = users.filter(u => u.role === 'creator').length;

  return (
    <div className="min-h-screen bg-black">
      <Navbar userRole={user.role} />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            Admin Dashboard
          </h1>
          <p className="text-white/50">
            Manage users, courses, and review moderation
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/[0.03] border-white/10">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{users.length}</p>
                <p className="text-white/50 text-sm">Total Users</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/[0.03] border-white/10">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <BookOpen className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalCourses}</p>
                <p className="text-white/50 text-sm">Total Courses</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/[0.03] border-white/10">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-yellow-500/10 rounded-xl">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{pendingReviews.length}</p>
                <p className="text-white/50 text-sm">Pending Reviews</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/[0.03] border-white/10">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{studentCount}/{creatorCount}</p>
                <p className="text-white/50 text-sm">Students/Creators</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 p-1">
            <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              Users
            </TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              Courses
              <Badge className="ml-2 bg-green-500/20 text-green-400">{totalCourses}</Badge>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              Pending Reviews
              {pendingReviews.length > 0 && (
                <Badge className="ml-2 bg-primary text-black">{pendingReviews.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-white/[0.03] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-white/50">User</TableHead>
                      <TableHead className="text-white/50">Email</TableHead>
                      <TableHead className="text-white/50">Role</TableHead>
                      <TableHead className="text-white/50">Joined</TableHead>
                      <TableHead className="text-white/50">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u._id} className="border-white/10 hover:bg-white/[0.02]">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={u.profileImage} />
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {u.firstName[0]}{u.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-white">{u.firstName} {u.lastName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-white/50">{u.email}</TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              u.role === 'admin' 
                                ? 'bg-primary/10 text-primary border border-primary/20' 
                                : u.role === 'creator'
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'bg-green-500/10 text-green-400 border border-green-500/20'
                            }
                          >
                            {u.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white/50">
                          {formatDistanceToNow(new Date(u.createdAt), { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                          <RoleSelector userId={u._id} currentRole={u.role} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <Card className="bg-white/[0.03] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Course Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-white/50">Course</TableHead>
                      <TableHead className="text-white/50">Category</TableHead>
                      <TableHead className="text-white/50">Creator</TableHead>
                      <TableHead className="text-white/50">Rating</TableHead>
                      <TableHead className="text-white/50">Reviews</TableHead>
                      <TableHead className="text-white/50">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course._id} className="border-white/10 hover:bg-white/[0.02]">
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-white font-medium truncate">{course.title}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-white/5 text-white/70 border border-white/10">
                            {course.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white/50">
                          {course.creator ? `${course.creator.firstName} ${course.creator.lastName}` : 'Unknown'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-white">
                              {course.averageRating > 0 ? course.averageRating.toFixed(1) : '-'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-white/50">{course.totalReviews}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link href={`/courses/${course._id}`}>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-white/50 hover:text-white hover:bg-white/10"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </Link>
                            <DeleteCourseButton courseId={course._id} courseName={course.title} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
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
              <Card className="bg-white/[0.03] border-white/10">
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">All caught up!</h3>
                  <p className="text-white/50">
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
