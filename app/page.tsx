import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar, Footer } from '@/components/shared';
import { Star, Users, BookOpen, ArrowRight, Shield, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-1.5 mb-6">
            <Zap className="h-4 w-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">
              Trusted by 10,000+ learners
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Real Reviews from{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Real Students
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Make informed decisions about your learning journey with authentic, 
            verified course reviews from fellow students.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/courses">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8">
                Browse Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 text-lg px-8">
                Become a Creator
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Why Choose CourseReviews?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 transition-colors">
            <div className="p-3 bg-purple-500/20 rounded-lg w-fit mb-4">
              <Shield className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Verified Reviews</h3>
            <p className="text-slate-400">
              Only students who&apos;ve actually taken the course can leave reviews. 
              No fake testimonials here.
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 transition-colors">
            <div className="p-3 bg-purple-500/20 rounded-lg w-fit mb-4">
              <Star className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Detailed Ratings</h3>
            <p className="text-slate-400">
              Multi-dimensional ratings covering instructor quality, content, 
              and value for money.
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 transition-colors">
            <div className="p-3 bg-purple-500/20 rounded-lg w-fit mb-4">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Creator Tools</h3>
            <p className="text-slate-400">
              Course creators can manage reviews, generate access links, 
              and build trust with authentic feedback.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          How It Works
        </h2>
        <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
          Simple process for both students and course creators
        </p>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* For Students */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-purple-400 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              For Students
            </h3>
            <div className="space-y-4">
              {[
                { step: '1', title: 'Get Access Link', desc: 'Receive a unique link from your course creator' },
                { step: '2', title: 'Verify Access', desc: 'Click the link to verify you took the course' },
                { step: '3', title: 'Write Review', desc: 'Share your honest experience and help others' },
              ].map(item => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{item.title}</h4>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* For Creators */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-pink-400 flex items-center gap-2">
              <Users className="h-5 w-5" />
              For Creators
            </h3>
            <div className="space-y-4">
              {[
                { step: '1', title: 'Add Your Course', desc: 'Register your course on our platform' },
                { step: '2', title: 'Generate Links', desc: 'Create unique access links for students' },
                { step: '3', title: 'Collect Reviews', desc: 'Get authentic reviews to boost your credibility' },
              ].map(item => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold text-sm">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{item.title}</h4>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-slate-300 mb-8">
            Join thousands of students and creators building trust through authentic reviews.
          </p>
          <Link href="/sign-up">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8">
              Create Your Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
