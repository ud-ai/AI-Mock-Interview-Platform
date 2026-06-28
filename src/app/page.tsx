'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Star, Lightbulb, PlayCircle, BarChart3, Briefcase, Award } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="bg-[#f9f9ff] text-[#111c2d] min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#dbe1ff] selection:text-[#00174b]">
      
      {/* Hero Section */}
      <header className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(#0053db_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#dbe1ff]/60 border border-[#004ac6]/10 text-[#003ea8] px-4 py-1.5 rounded-full mb-8 text-sm font-semibold">
            <Sparkles className="w-4 h-4 text-[#004ac6] animate-pulse" />
            <span>New: Generative Behavioral Analysis 2.0</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold font-outfit tracking-tight leading-tight mb-6 max-w-4xl mx-auto text-[#111c2d]">
            Master Your Next Interview with <span className="text-[#004ac6] italic">AI</span>.
          </h1>

          <p className="text-[#434655] text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Practice with realistic AI interviewers, get instant feedback, and land your dream job with data-driven preparation.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href={user ? '/dashboard' : '/auth/register'}
              className="hero-gradient text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 text-lg active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#why-choose"
              className="bg-[#dee8ff] text-[#004ac6] px-8 py-4 rounded-xl font-bold hover:bg-[#d8e3fb] transition-all flex items-center justify-center gap-2 text-lg"
            >
              <span>How it Works</span>
            </a>
          </div>

          {/* Hero Visual Mockup */}
          <div className="mt-20 relative max-w-5xl mx-auto group">
            <div className="absolute -inset-4 bg-[#004ac6]/5 blur-3xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-1000" />
            <div className="glass-card p-4 rounded-3xl shadow-2xl animate-float">
              <img
                className="w-full h-auto rounded-2xl border border-[#c3c6d7]/30"
                alt="InterviewAI dashboard mockup"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAf4Kl3w_V2Zecq7QoNYG63IUfYs1xEVky6QxCrBaQ8hfZuPBLyH8jTUCkDYLMVEPlrgnvdHFKM1IC4zkex8ysp-jUHaHWlWe2gSk5PneSne3Xb-D9ENx5VV95KL9ZrwGJKMa8HNVwCKzj4-XftVHvtMh70fKvl1cJdV_qp4YfLOu1PEWRcSVkZWr_BGoIW5RUmwjEhqzu-mKjmBB3kzNzCadHDsCqwHndhqJhunIkakUbrohj6TmST"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Trust Logo Cloud */}
      <section className="py-16 bg-[#f0f3ff]/50 border-y border-[#c3c6d7]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-[#434655] mb-10 tracking-widest uppercase">
            TRUSTED BY PROFESSIONALS AT
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="font-outfit font-bold text-2xl text-[#505f76]">GOOGLE</span>
            <span className="font-outfit font-bold text-2xl text-[#505f76]">META</span>
            <span className="font-outfit font-bold text-2xl text-[#505f76]">AMAZON</span>
            <span className="font-outfit font-bold text-2xl text-[#505f76]">APPLE</span>
            <span className="font-outfit font-bold text-2xl text-[#505f76]">NETFLIX</span>
          </div>
        </div>
      </section>

      {/* Why Choose Section (Bento Grid) */}
      <section id="why-choose" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-outfit text-[#111c2d] mb-4">Why Choose InterviewAI?</h2>
            <p className="text-[#434655] max-w-xl mx-auto text-base">
              Engineered to transform your performance with the most advanced simulation engine in the industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[280px]">
            {/* Bento Card 1: Realistic Simulations */}
            <div className="md:col-span-8 glass-card rounded-3xl p-8 relative overflow-hidden group flex flex-col justify-between">
              <div>
                <div className="bg-[#004ac6]/10 w-12 h-12 rounded-xl flex items-center justify-center text-[#004ac6] mb-6">
                  <PlayCircle className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold font-outfit text-[#111c2d] mb-3">Realistic Simulations</h3>
                <p className="text-[#434655] max-w-md text-sm leading-relaxed">
                  Our AI adapts its persona to match the company culture and difficulty level you select, from startup chill to Big 4 rigorous.
                </p>
              </div>
            </div>

            {/* Bento Card 2: Industry Tracks */}
            <div className="md:col-span-4 bg-[#263143] text-[#ecf1ff] rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center text-[#b4c5ff] mb-6">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-outfit mb-3">Industry Tracks</h3>
                <p className="text-[#c3c6d7] text-xs">Pre-tailored paths for Product, Tech, Design, and Finance.</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs">Product Management</span>
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs">Software Eng</span>
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs">UX Design</span>
              </div>
            </div>

            {/* Bento Card 3: Instant Feedback */}
            <div className="md:col-span-4 glass-card rounded-3xl p-8 flex flex-col justify-center items-center text-center">
              <div className="flex gap-3 mb-6">
                <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Perfect Eye Contact</span>
                </div>
              </div>
              <h3 className="text-xl font-bold font-outfit text-[#111c2d] mb-2">Instant Feedback</h3>
              <p className="text-[#434655] text-xs">Get actionable critiques on body language and content.</p>
            </div>

            {/* Bento Card 4: Analytics */}
            <div className="md:col-span-8 glass-card rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 group">
              <div className="flex-1">
                <div className="bg-[#dee8ff] w-12 h-12 rounded-xl flex items-center justify-center text-[#004ac6] mb-6">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold font-outfit text-[#111c2d] mb-3">Real-time Analytics</h3>
                <p className="text-[#434655] text-sm">Track your sentiment, confidence levels, and keyword frequency as you speak.</p>
              </div>
              <div className="w-full md:w-64 h-40 bg-[#dee8ff]/30 rounded-2xl border border-[#c3c6d7]/30 flex items-center justify-center">
                <div className="flex items-end gap-2 h-20">
                  <div className="w-4 bg-[#004ac6] rounded-t transition-all duration-1000 group-hover:h-16 h-8" />
                  <div className="w-4 bg-[#004ac6] rounded-t transition-all duration-1000 group-hover:h-12 h-14" />
                  <div className="w-4 bg-[#004ac6] rounded-t transition-all duration-1000 group-hover:h-20 h-10" />
                  <div className="w-4 bg-[#004ac6] rounded-t transition-all duration-1000 group-hover:h-10 h-18" />
                  <div className="w-4 bg-[#004ac6] rounded-t transition-all duration-1000 group-hover:h-14 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-[#f0f3ff]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 md:p-16 rounded-[40px] shadow-sm relative overflow-hidden border border-[#c3c6d7]/10">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-bold font-serif leading-none">“</div>
            <div className="relative z-10 max-w-3xl">
              <div className="flex gap-1 text-[#bc4800] mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <h3 className="text-2xl md:text-3xl font-outfit italic mb-8 text-[#111c2d] leading-relaxed">
                "InterviewAI was the secret weapon in my career transition. The feedback on my behavioral answers helped me articulate my value and land a Senior PM role at Google."
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#004ac6]">
                  <img
                    className="w-full h-full object-cover"
                    alt="Alex Chen"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVWth9en6I0l54des4lIUmIbmTwj1V_r2hZlQjvlYf06DGjpQoLZwDu3RrGiycSCFaM1Wdywat-yQmDktX5JNH5_Js5JEzBmqonHL4JTGOAL-_wX5J5nXnuWtp8nkEnRXnFPJaP4X191nwF74TIrSFuL1ZUufgHydu4kMHZUJCxJCjtFEBsY-2qbD5c6UIGMXn-zHr1oXwqADSAPBPA0v1MruTNrFnfuoFFpoi1echqDMfZEmFx94q"
                  />
                </div>
                <div>
                  <p className="font-bold text-lg text-[#111c2d]">Alex Chen</p>
                  <p className="text-[#434655] text-sm">Senior Product Manager at Google</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 overflow-hidden relative">
        <div className="absolute inset-0 hero-gradient -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold font-outfit mb-6">Ready to land your dream job?</h2>
          <p className="text-[#eeefff] mb-10 max-w-xl mx-auto opacity-90 text-base">
            Join 50,000+ professionals who have leveled up their interview game.
          </p>
          <Link
            href={user ? '/dashboard' : '/auth/register'}
            className="bg-white text-[#004ac6] px-10 py-4 rounded-full font-extrabold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all inline-block"
          >
            Get Started Now — It's Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#dee8ff]/50 w-full py-12 px-4 sm:px-6 lg:px-8 border-t border-[#c3c6d7]/30 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
          <div className="max-w-xs">
            <span className="font-display text-2xl font-bold text-[#004ac6] mb-4 block">InterviewAI</span>
            <p className="text-[#434655] text-sm leading-relaxed">
              Elevating careers through intelligent practice and data-driven simulation technology.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-sm">
            <div>
              <h4 className="font-bold text-[#111c2d] mb-4 uppercase tracking-wider text-xs">Platform</h4>
              <ul className="space-y-2">
                <li><Link href="/dashboard" className="text-[#434655] hover:text-[#004ac6] transition-all">Dashboard</Link></li>
                <li><Link href="/interview/setup" className="text-[#434655] hover:text-[#004ac6] transition-all">Practice</Link></li>
                <li><Link href="/dashboard" className="text-[#434655] hover:text-[#004ac6] transition-all">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#111c2d] mb-4 uppercase tracking-wider text-xs">Company</h4>
              <ul className="space-y-2">
                <li><span className="text-[#434655] cursor-default">Careers</span></li>
                <li><span className="text-[#434655] cursor-default">Support</span></li>
                <li><span className="text-[#434655] cursor-default">About Us</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#111c2d] mb-4 uppercase tracking-wider text-xs">Legal</h4>
              <ul className="space-y-2">
                <li><span className="text-[#434655] cursor-default">Privacy Policy</span></li>
                <li><span className="text-[#434655] cursor-default">Terms of Service</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-[#c3c6d7]/30 mt-12 pt-8 text-center text-[#434655] text-xs">
          © 2024 InterviewAI. Elevating careers through intelligent practice.
        </div>
      </footer>
    </div>
  );
}
