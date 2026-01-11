import Link from 'next/link';
import { Navbar, Footer } from '@/components/shared';
import { Star, Users, BookOpen, ArrowRight, Shield, Zap, Play } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle grid pattern background - theme aware */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--foreground)/0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground)/0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
      
      {/* Orange glow effect behind hero */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
      
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-24 md:py-36">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-muted/50 border border-border rounded-full px-5 py-2 mb-8 backdrop-blur-sm">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground text-sm font-medium tracking-wide">
              Trusted by 10,000+ learners worldwide
            </span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-[1.1] tracking-tight">
            Real Reviews from{' '}
            <span className="text-primary relative">
              Real Students
              {/* Underline accent */}
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary/40 rounded-full" />
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Make informed decisions about your learning journey with authentic, 
            verified course reviews from fellow students.
          </p>
          
          {/* CTA Buttons - ChaiCode Asymmetrical Style */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/courses">
              <button className="group relative bg-primary text-primary-foreground font-semibold text-lg px-8 py-4 rounded-tr-2xl rounded-bl-2xl rounded-tl-md rounded-br-md hover:bg-primary/90 transition-all duration-300 flex items-center gap-2">
                Browse Courses
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/sign-up">
              <button className="border border-border text-foreground font-medium text-lg px-8 py-4 rounded-tl-2xl rounded-br-2xl rounded-tr-md rounded-bl-md hover:bg-muted transition-all duration-300 flex items-center gap-2">
                <Play className="h-5 w-5" />
                Become a Creator
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 border-y border-border py-12">
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-foreground mb-2">10K+</p>
            <p className="text-muted-foreground text-sm uppercase tracking-wider">Active Users</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</p>
            <p className="text-muted-foreground text-sm uppercase tracking-wider">Courses Reviewed</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-foreground mb-2">50K+</p>
            <p className="text-muted-foreground text-sm uppercase tracking-wider">Reviews Posted</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Why Choose CourseReviews?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need to make smarter learning decisions
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Feature Card 1 */}
          <div className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
            <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6 group-hover:bg-primary/20 transition-colors">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Verified Reviews</h3>
            <p className="text-muted-foreground leading-relaxed">
              Only students who&apos;ve actually taken the course can leave reviews. 
              No fake testimonials here.
            </p>
          </div>
          
          {/* Feature Card 2 */}
          <div className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
            <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6 group-hover:bg-primary/20 transition-colors">
              <Star className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Detailed Ratings</h3>
            <p className="text-muted-foreground leading-relaxed">
              Multi-dimensional ratings covering instructor quality, content, 
              and value for money.
            </p>
          </div>
          
          {/* Feature Card 3 */}
          <div className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
            <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6 group-hover:bg-primary/20 transition-colors">
              <Users className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Creator Tools</h3>
            <p className="text-muted-foreground leading-relaxed">
              Course creators can manage reviews, generate access links, 
              and build trust with authentic feedback.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative container mx-auto px-4 py-24 bg-muted/30">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Simple process for both students and course creators
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-16 max-w-4xl mx-auto">
          {/* For Students */}
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              For Students
            </h3>
            <div className="space-y-6">
              {[
                { step: '01', title: 'Get Access Link', desc: 'Receive a unique link from your course creator' },
                { step: '02', title: 'Verify Access', desc: 'Click the link to verify you took the course' },
                { step: '03', title: 'Write Review', desc: 'Share your honest experience and help others' },
              ].map(item => (
                <div key={item.step} className="flex gap-5 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center text-primary font-mono font-bold text-sm group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">{item.title}</h4>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* For Creators */}
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              For Creators
            </h3>
            <div className="space-y-6">
              {[
                { step: '01', title: 'Add Your Course', desc: 'Register your course on our platform' },
                { step: '02', title: 'Generate Links', desc: 'Create unique access links for students' },
                { step: '03', title: 'Collect Reviews', desc: 'Get authentic reviews to boost your credibility' },
              ].map(item => (
                <div key={item.step} className="flex gap-5 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center text-primary font-mono font-bold text-sm group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">{item.title}</h4>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative container mx-auto px-4 py-24">
        {/* Glow effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[300px] bg-primary/10 blur-[120px] rounded-full" />
        </div>
        
        <div className="relative max-w-3xl mx-auto text-center p-12 md:p-16 rounded-3xl bg-card border border-border backdrop-blur-sm">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
            Join thousands of students and creators building trust through authentic reviews.
          </p>
          <Link href="/sign-up">
            <button className="group bg-primary text-primary-foreground font-semibold text-lg px-10 py-4 rounded-tr-2xl rounded-bl-2xl rounded-tl-md rounded-br-md hover:bg-primary/90 transition-all duration-300 flex items-center gap-2 mx-auto">
              Create Your Account
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
