import { Suspense } from 'react';
import { getAllCourses } from '@/lib/actions/course.actions';
import { Navbar, Footer } from '@/components/shared';
import { CourseCard } from '@/components/courses';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen } from 'lucide-react';

const categories = [
  { value: 'all', label: 'All' },
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'business', label: 'Business' },
  { value: 'photography', label: 'Photography' },
  { value: 'music', label: 'Music' },
  { value: 'other', label: 'Other' },
];

interface PageProps {
  searchParams: Promise<{ category?: string; search?: string; page?: string }>;
}

async function CourseList({ category, search, page }: { 
  category?: string; 
  search?: string; 
  page: number;
}) {
  const { courses, total, pages, currentPage } = await getAllCourses({
    category: category && category !== 'all' ? category : undefined,
    search,
    page,
    limit: 12,
  });

  if (courses.length === 0) {
    return (
      <div className="text-center py-20">
        <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
        <p className="text-slate-400">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-slate-400 mb-6">
        Showing {courses.length} of {total} courses
      </p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/courses?page=${p}${category ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}`}
              className={`px-4 py-2 rounded-lg transition-colors ${
                p === currentPage
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function CoursesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const category = params.category || 'all';
  const search = params.search;
  const page = parseInt(params.page || '1', 10);

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Browse Courses</h1>
          <p className="text-slate-400">
            Discover courses with authentic reviews from real students
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <form action="/courses" method="GET" className="flex-grow max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                name="search"
                placeholder="Search courses..."
                defaultValue={search}
                className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
            {category !== 'all' && (
              <input type="hidden" name="category" value={category} />
            )}
          </form>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <a
                key={cat.value}
                href={`/courses?category=${cat.value}${search ? `&search=${search}` : ''}`}
              >
                <Badge
                  variant={category === cat.value ? 'default' : 'outline'}
                  className={`cursor-pointer ${
                    category === cat.value
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </Badge>
              </a>
            ))}
          </div>
        </div>

        {/* Course List */}
        <Suspense
          fallback={
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-800 rounded-lg h-72 animate-pulse" />
              ))}
            </div>
          }
        >
          <CourseList category={category} search={search} page={page} />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}
