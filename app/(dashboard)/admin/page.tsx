import { redirect } from 'next/navigation';
import { getCurrentUser, getAllUsers, updateUserRole } from '@/lib/actions/user.actions';
import { getAllCourses } from '@/lib/actions/course.actions';
import { getPendingReviews, moderateReview } from '@/lib/actions/review.actions';
import { Navbar, Footer } from '@/components/shared';
import { ReviewCard, ModerateButton } from '@/components/reviews';
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
import { Users, BookOpen, Star, Shield, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

async function RoleSelector({ userId, currentRole }: { userId: string; currentRole: string }) {
  async function handleRoleChange(formData: FormData) {
    'use server';
    const newRole = formData.get('role') as 'student' | 'creator' | 'admin';
    await updateUserRole(userId, newRole);
  }

  return (
    <form action={handleRoleChange}>
      <Select name="role" defaultValue={currentRole}>
        <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-slate-700 border-slate-600">
          <SelectItem value="student" className="text-white">Student</SelectItem>
          <SelectItem value="creator" className="text-white">Creator</SelectItem>
          <SelectItem value="admin" className="text-white">Admin</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" size="sm" className="ml-2 bg-purple-600 hover:bg-purple-700">
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
    <div className="min-h-screen bg-slate-900">
      <Navbar userRole={user.role} />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Shield className="h-8 w-8 text-purple-500" />
            Admin Dashboard
          </h1>
          <p className="text-slate-400">
            Manage users, courses, and review moderation
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{users.length}</p>
                <p className="text-slate-400 text-sm">Total Users</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalCourses}</p>
                <p className="text-slate-400 text-sm">Total Courses</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Star className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{pendingReviews.length}</p>
                <p className="text-slate-400 text-sm">Pending Reviews</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{studentCount}/{creatorCount}</p>
                <p className="text-slate-400 text-sm">Students/Creators</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-slate-800 p-1">
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-600">
              Users
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-purple-600">
              Pending Reviews
              {pendingReviews.length > 0 && (
                <Badge className="ml-2 bg-orange-500">{pendingReviews.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-400">User</TableHead>
                      <TableHead className="text-slate-400">Email</TableHead>
                      <TableHead className="text-slate-400">Role</TableHead>
                      <TableHead className="text-slate-400">Joined</TableHead>
                      <TableHead className="text-slate-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u._id} className="border-slate-700">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={u.profileImage} />
                              <AvatarFallback className="bg-slate-700 text-white text-xs">
                                {u.firstName[0]}{u.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-white">{u.firstName} {u.lastName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-400">{u.email}</TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              u.role === 'admin' 
                                ? 'bg-purple-500/20 text-purple-400' 
                                : u.role === 'creator'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-green-500/20 text-green-400'
                            }
                          >
                            {u.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-400">
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
