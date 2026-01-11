import { Suspense } from 'react';
import { getAllCourses } from '@/lib/actions/course.actions';
import { Navbar, Footer } from '@/components/shared';
import { CourseCard } from '@/components/courses';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, BookOpen, ArrowUpDown } from 'lucide-react';

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

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'reviews', label: 'Most Reviewed' },
];

interface PageProps {
  searchParams: Promise<{ category?: string; search?: string; page?: string; sort?: string }>;
}

async function CourseList({ category, search, page, sort }: { 
  category?: string; 
  search?: string; 
  page: number;
  sort?: 'newest' | 'rating' | 'reviews';
}) {
  const { courses, total, pages, currentPage } = await getAllCourses({
    category: category && category !== 'all' ? category : undefined,
    search,
    page,
    limit: 12,
    sort: sort || 'newest',
  });

  if (courses.length === 0) {
    return (
      <div className="text-center py-20">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">No courses found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-muted-foreground mb-6">
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
              href={`/courses?page=${p}${category ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}${sort ? `&sort=${sort}` : ''}`}
              className={`px-4 py-2 rounded-lg transition-colors ${
                p === currentPage
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'bg-muted text-muted-foreground hover:bg-accent border border-border'
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
  const sort = (params.sort as 'newest' | 'rating' | 'reviews') || 'newest';

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Browse Courses</h1>
          <p className="text-white/50">
            Discover courses with authentic reviews from real students
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <form action="/courses" method="GET" className="flex-grow max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                name="search"
                placeholder="Search courses..."
                defaultValue={search}
                className="pl-10 bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
            {category !== 'all' && (
              <input type="hidden" name="category" value={category} />
            )}
            {sort !== 'newest' && (
              <input type="hidden" name="sort" value={sort} />
            )}
          </form>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-1">
              {sortOptions.map((option) => (
                <a
                  key={option.value}
                  href={`/courses?sort=${option.value}${category !== 'all' ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}`}
                >
                  <Badge
                    variant={sort === option.value ? 'default' : 'outline'}
                    className={`cursor-pointer transition-all ${
                      sort === option.value
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'border-border text-muted-foreground hover:bg-accent hover:border-border'
                    }`}
                  >
                    {option.label}
                  </Badge>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <a
              key={cat.value}
              href={`/courses?category=${cat.value}${search ? `&search=${search}` : ''}${sort !== 'newest' ? `&sort=${sort}` : ''}`}
            >
              <Badge
                variant={category === cat.value ? 'default' : 'outline'}
                className={`cursor-pointer transition-all ${
                  category === cat.value
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border-border text-muted-foreground hover:bg-accent hover:border-border'
                }`}
              >
                {cat.label}
              </Badge>
            </a>
          ))}
        </div>

        {/* Course List */}
        <Suspense
          fallback={
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-muted border border-border rounded-lg h-72 animate-pulse" />
              ))}
            </div>
          }
        >
          <CourseList category={category} search={search} page={page} sort={sort} />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}
