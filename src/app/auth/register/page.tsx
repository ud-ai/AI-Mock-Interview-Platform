'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Briefcase, Award, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const { register, isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('mid');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isInitialized, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await register(name, email, password, jobRole, experienceLevel);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Registration failed');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f9f9ff] flex items-center justify-center p-4 relative overflow-hidden text-[#111c2d]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[#004ac6]/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="w-full max-w-md p-8 rounded-3xl border border-[#c3c6d7]/30 bg-white shadow-sm space-y-5 my-8">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-full bg-[#dee8ff] border border-[#c3c6d7]/30 text-[#004ac6] mb-1">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit text-[#111c2d]">Create Account</h2>
          <p className="text-[#434655] text-sm">Join the InterviewAI mock session platform</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[#434655] text-xs font-bold uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#434655]" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Mercer"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#c3c6d7]/40 bg-white text-[#111c2d] text-sm focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] focus:outline-none transition"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[#434655] text-xs font-bold uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#434655]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#c3c6d7]/40 bg-white text-[#111c2d] text-sm focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] focus:outline-none transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[#434655] text-xs font-bold uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#434655]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#c3c6d7]/40 bg-white text-[#111c2d] text-sm focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] focus:outline-none transition"
              />
            </div>
          </div>

          {/* Target Job Role */}
          <div className="space-y-1.5">
            <label className="text-[#434655] text-xs font-bold uppercase tracking-wider">Target Job Role</label>
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#434655]" />
              <input
                type="text"
                required
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="Senior Full Stack Engineer"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#c3c6d7]/40 bg-white text-[#111c2d] text-sm focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] focus:outline-none transition"
              />
            </div>
          </div>

          {/* Experience Level */}
          <div className="space-y-1.5">
            <label className="text-[#434655] text-xs font-bold uppercase tracking-wider">Experience Level</label>
            <div className="relative flex items-center bg-white border border-[#c3c6d7]/40 rounded-xl pr-3">
              <Award className="absolute left-3.5 w-4.5 h-4.5 text-[#434655]" />
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full pl-10 py-3 bg-transparent text-[#111c2d] text-sm focus:outline-none cursor-pointer"
              >
                <option value="junior">Junior (0-2 years)</option>
                <option value="mid">Mid-Level (2-5 years)</option>
                <option value="senior">Senior (5-8 years)</option>
                <option value="lead">Lead / Staff (8+ years)</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-[#004ac6] hover:bg-[#003ea8] transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 mt-6 active:scale-95"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-[#434655] pt-2">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#004ac6] font-bold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
