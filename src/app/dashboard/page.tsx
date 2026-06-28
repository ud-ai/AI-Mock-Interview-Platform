'use client';

import { useEffect, useState } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import { useInterviewSession } from '@/hooks/useInterviewSession';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Home as HomeIcon,
  Video,
  BarChart2,
  Settings,
  HelpCircle,
  LogOut,
  Sparkles,
  RefreshCw,
  Plus,
  Compass,
  CheckCircle,
  Trophy,
  ArrowRight,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const { startSession, loading: startLoading } = useInterviewSession();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/interview/sessions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setSessions(data.sessions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSessions();
    }
  }, [token]);

  // Aggregate metrics
  const completedSessions = sessions.filter((s) => s.status === 'completed');
  const avgScore = completedSessions.length
    ? completedSessions.reduce((acc, curr) => acc + (curr.feedbackReport?.overallScore || 0), 0) /
      completedSessions.length
    : 0;

  const readiness = avgScore >= 80 ? 'High' : avgScore >= 60 ? 'Medium' : 'Low';

  const handleQuickStart = async (roleName: string, type: 'behavioral' | 'technical' | 'system_design' | 'hr_culture') => {
    const res = await startSession(type, roleName);
    if (res) {
      router.push('/interview/session');
    }
  };

  const roleTemplates = [
    {
      title: 'Software Engineer',
      type: 'technical' as const,
      desc: 'Focus on data structures, algorithms, and system design simulations.',
      tags: ['Junior', 'Senior', 'Staff'],
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      badge: 'TECH'
    },
    {
      title: 'Product Manager',
      type: 'behavioral' as const,
      desc: 'Master product sense, execution, and analytical reasoning scenarios.',
      tags: ['L4', 'L5', 'L6+'],
      color: 'bg-slate-50 text-slate-800 border-slate-200',
      badge: 'PRODUCT'
    },
    {
      title: 'Data Scientist',
      type: 'technical' as const,
      desc: 'Tackle machine learning theory, statistics, and business case studies.',
      tags: ['Entry', 'Lead'],
      color: 'bg-orange-50 text-orange-800 border-orange-200',
      badge: 'SCIENCE'
    },
    {
      title: 'Marketing Lead',
      type: 'hr_culture' as const,
      desc: 'Practice brand strategy, growth loops, and creative direction questions.',
      tags: ['Manager', 'Director'],
      color: 'bg-purple-50 text-purple-800 border-purple-200',
      badge: 'GROWTH'
    }
  ];

  return (
    <AuthGuard>
      <div className="bg-[#f9f9ff] min-h-[calc(100vh-4rem)] flex text-[#111c2d] selection:bg-[#dbe1ff]">
        
        {/* Left Navigation Sidebar */}
        <aside className="w-64 shrink-0 bg-white border-r border-[#c3c6d7]/30 p-4 hidden lg:flex flex-col justify-between sticky top-16 h-[calc(100vh-4rem)]">
          <div className="space-y-6">
            {/* User Profile Summary */}
            <div className="flex items-center gap-3 px-2 py-3 border-b border-[#c3c6d7]/20">
              <div className="w-10 h-10 rounded-full bg-[#004ac6] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-sm text-[#111c2d] truncate">{user?.name}</p>
                <p className="text-xs text-[#434655] truncate">{user?.email}</p>
              </div>
            </div>

            {/* Menu Links */}
            <nav className="space-y-1">
              <Link href="/dashboard" className="flex items-center gap-3 bg-[#d0e1fb] text-[#00174b] rounded-xl px-4 py-3 font-semibold text-sm transition">
                <HomeIcon className="w-5 h-5 text-[#004ac6]" />
                <span>Home</span>
              </Link>
              <Link href="/interview/setup" className="flex items-center gap-3 text-[#434655] hover:text-[#004ac6] hover:bg-[#f0f3ff] rounded-xl px-4 py-3 text-sm transition">
                <Video className="w-5 h-5" />
                <span>Practice</span>
              </Link>
              <a href="#" className="flex items-center gap-3 text-[#434655] hover:text-[#004ac6] hover:bg-[#f0f3ff] rounded-xl px-4 py-3 text-sm transition">
                <BarChart2 className="w-5 h-5" />
                <span>Analytics</span>
              </a>
              <a href="#" className="flex items-center gap-3 text-[#434655] hover:text-[#004ac6] hover:bg-[#f0f3ff] rounded-xl px-4 py-3 text-sm transition">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </a>
            </nav>
          </div>

          <div className="space-y-2 border-t border-[#c3c6d7]/20 pt-4">
            <Link
              href="/interview/setup"
              className="w-full py-3 px-4 bg-[#004ac6] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#003ea8] transition active:scale-95 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Start New Mock</span>
            </Link>
            <a href="#" className="flex items-center gap-3 text-[#434655] hover:text-[#004ac6] hover:bg-[#f0f3ff] rounded-xl px-4 py-3 text-sm transition">
              <HelpCircle className="w-5 h-5" />
              <span>Help</span>
            </a>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 text-[#434655] hover:text-rose-600 hover:bg-rose-50 rounded-xl px-4 py-3 text-sm transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Central & Right Content Canvas */}
        <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 overflow-y-auto">
          
          {/* Main Workspace Section */}
          <div className="xl:col-span-8 space-y-8">
            <header className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold font-outfit text-[#111c2d] tracking-tight">
                Hello, {user?.name?.split(' ')[0] || 'Alex'}! Ready for your next mock interview?
              </h2>
              <p className="text-[#434655] text-sm">
                Practice makes perfect. Pick a role and start a simulation tailored to your career goals.
              </p>
            </header>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total Sessions */}
              <div className="bg-white p-5 rounded-2xl border border-[#c3c6d7]/20 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-[#dbe1ff] rounded-xl text-[#004ac6]">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[#434655] text-xs uppercase tracking-wider font-semibold block">Total Sessions</span>
                  <span className="text-2xl font-bold font-outfit text-[#111c2d]">{sessions.length || '0'}</span>
                </div>
              </div>

              {/* Avg Score */}
              <div className="bg-white p-5 rounded-2xl border border-[#c3c6d7]/20 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-[#d3e4fe] rounded-xl text-indigo-700">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[#434655] text-xs uppercase tracking-wider font-semibold block">Avg. Score</span>
                  <span className="text-2xl font-bold font-outfit text-[#111c2d]">
                    {avgScore ? `${Math.round(avgScore)}%` : '--'}
                  </span>
                </div>
              </div>

              {/* Readiness */}
              <div className="bg-white p-5 rounded-2xl border border-[#c3c6d7]/20 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-[#ffdbcd] rounded-xl text-[#943700]">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[#434655] text-xs uppercase tracking-wider font-semibold block">Ready for Interview</span>
                  <span className="text-2xl font-bold font-outfit text-[#111c2d]">{readiness}</span>
                </div>
              </div>
            </div>

            {/* Practice Roles selectors */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-outfit text-[#111c2d]">Select Role to Practice</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roleTemplates.map((role) => (
                  <div key={role.title} className="bg-white p-6 rounded-3xl border border-[#c3c6d7]/20 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="font-bold text-sm text-[#111c2d] font-outfit">{role.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#f0f3ff] text-[#004ac6] border border-[#c3c6d7]/30 uppercase">
                          {role.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#434655] leading-relaxed mb-4">{role.desc}</p>
                      
                      <div className="flex gap-1.5 mb-6">
                        {role.tags.map((tag) => (
                          <span key={tag} className="text-[10px] font-semibold bg-[#f0f3ff] text-[#434655] px-2.5 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleQuickStart(role.title, role.type)}
                      disabled={startLoading}
                      className="w-full py-2.5 rounded-xl bg-[#004ac6] hover:bg-[#003ea8] text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {startLoading ? (
                        <div className="w-3.5 h-3.5 rounded-full border border-white/20 border-t-white animate-spin" />
                      ) : (
                        <>
                          <span>Start Session</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Section */}
          <div className="xl:col-span-4 space-y-6">
            {/* Recent Activity List */}
            <div className="bg-white p-6 rounded-3xl border border-[#c3c6d7]/20 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-[#c3c6d7]/20">
                <h4 className="font-bold font-outfit text-sm text-[#111c2d]">Recent Activity</h4>
                <button onClick={fetchSessions} disabled={loading} className="text-xs text-[#004ac6] font-semibold hover:underline flex items-center gap-1">
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="space-y-4 max-h-64 overflow-y-auto scrollbar-thin">
                {sessions.length === 0 ? (
                  <p className="text-xs text-[#434655] italic text-center py-4">No recent sessions found.</p>
                ) : (
                  sessions.slice(0, 4).map((s) => (
                    <div key={s.id} className="flex items-start gap-3 text-xs">
                      <div className="p-2 rounded-lg bg-[#f0f3ff] text-[#004ac6] shrink-0">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <Link href={s.status === 'completed' ? `/interview/report/${s.id}` : '#'} className="font-semibold text-[#111c2d] hover:underline block truncate">
                          Mock: {s.jobRole || 'Behavioral'}
                        </Link>
                        <p className="text-[#434655] text-[10px] mt-0.5">
                          {s.status === 'completed'
                            ? `Score: ${s.feedbackReport?.overallScore || 'N/A'}/100`
                            : 'In progress'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Upcoming Milestones */}
            <div className="bg-white p-6 rounded-3xl border border-[#c3c6d7]/20 shadow-sm space-y-4">
              <h4 className="font-bold font-outfit text-sm text-[#111c2d]">Upcoming Milestones</h4>
              
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-[#434655] font-semibold mb-1">
                    <span>Behavioral Mastery</span>
                    <span>80%</span>
                  </div>
                  <div className="w-full bg-[#f0f3ff] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#004ac6] h-full rounded-full" style={{ width: '80%' }} />
                  </div>
                  <span className="text-[10px] text-[#434655] mt-1 block">2 sessions until certification</span>
                </div>

                <div>
                  <div className="flex justify-between text-[#434655] font-semibold mb-1">
                    <span>System Design Hero</span>
                    <span>45%</span>
                  </div>
                  <div className="w-full bg-[#f0f3ff] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#004ac6] h-full rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Upgrade banner */}
            <div className="hero-gradient p-6 rounded-3xl text-white shadow-lg space-y-4">
              <h4 className="font-bold font-outfit text-base">Unlock Pro Features</h4>
              <p className="text-xs text-[#eeefff] leading-relaxed">
                Get unlimited mock sessions and live AI feedback on video and speech metrics.
              </p>
              <button className="w-full py-2.5 bg-white text-[#004ac6] rounded-xl font-bold text-xs transition hover:bg-slate-50 active:scale-95">
                Upgrade Now
              </button>
            </div>

          </div>

        </div>

      </div>
    </AuthGuard>
  );
}
