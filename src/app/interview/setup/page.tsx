'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { useInterviewSession } from '@/hooks/useInterviewSession';
import { useRouter } from 'next/navigation';
import { MessageSquare, Code, LayoutGrid, Users, HelpCircle, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

export default function InterviewSetup() {
  const router = useRouter();
  const { startSession, loading } = useInterviewSession();
  const [selectedType, setSelectedType] = useState<'behavioral' | 'technical' | 'system_design' | 'hr_culture'>('behavioral');
  const [customJobRole, setCustomJobRole] = useState('');

  const handleStart = async () => {
    const res = await startSession(selectedType, customJobRole || undefined);
    if (res) {
      router.push('/interview/session');
    }
  };

  const interviewOptions = [
    {
      id: 'behavioral' as const,
      title: 'Behavioral Interview',
      description: 'Focuses on past experiences, STAR framework details, and core leadership competencies.',
      icon: MessageSquare,
      colorClass: 'text-blue-600 bg-blue-50 border-blue-200',
      activeColorClass: 'border-[#004ac6] bg-[#dbe1ff]/30 ring-2 ring-[#004ac6]/20',
    },
    {
      id: 'technical' as const,
      title: 'Technical Coding',
      description: 'Tests algorithms, system logic, complexity trade-offs, and edge case thinking.',
      icon: Code,
      colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      activeColorClass: 'border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20',
    },
    {
      id: 'system_design' as const,
      title: 'System Design',
      description: 'Tests scalable architectures, databases, caching layers, and system fail-safes.',
      icon: LayoutGrid,
      colorClass: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      activeColorClass: 'border-indigo-500 bg-indigo-50/30 ring-2 ring-indigo-500/20',
    },
    {
      id: 'hr_culture' as const,
      title: 'HR & Culture Fit',
      description: 'Focuses on motivations, career path alignment, collaborative style, and conflict resolution.',
      icon: Users,
      colorClass: 'text-purple-600 bg-purple-50 border-purple-200',
      activeColorClass: 'border-purple-500 bg-purple-50/30 ring-2 ring-purple-500/20',
    },
  ];

  return (
    <AuthGuard>
      <div className="bg-[#f9f9ff] min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 relative">
        <div className="text-center">
          <div className="inline-flex p-3 rounded-full bg-[#dee8ff] border border-[#c3c6d7]/30 text-[#004ac6] mb-4">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold font-outfit text-[#111c2d] tracking-tight">Configure Interview Session</h1>
          <p className="text-[#434655] text-sm mt-1">Select your target interview track and specify the job title role</p>
        </div>

        <div className="p-8 rounded-3xl border border-[#c3c6d7]/30 bg-white shadow-sm space-y-6">
          {/* Custom Job Role override */}
          <div className="space-y-1.5">
            <label className="text-[#434655] text-xs font-bold uppercase tracking-wider">Target Job Role (Optional)</label>
            <input
              type="text"
              value={customJobRole}
              onChange={(e) => setCustomJobRole(e.target.value)}
              placeholder="e.g. Software Engineer, Product Manager, UX Lead"
              className="w-full px-4 py-3 rounded-xl border border-[#c3c6d7]/40 bg-white text-[#111c2d] text-sm focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] focus:outline-none transition"
            />
          </div>

          {/* Interview Type list */}
          <div className="space-y-3">
            <label className="text-[#434655] text-xs font-bold uppercase tracking-wider block">Interview track</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interviewOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedType === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedType(opt.id)}
                    className={clsx(
                      'p-5 rounded-3xl border text-left transition duration-300 flex items-start gap-4 hover:bg-slate-50',
                      isSelected ? opt.activeColorClass : 'border-[#c3c6d7]/20 bg-white text-[#434655]'
                    )}
                  >
                    <div className={clsx('p-3 rounded-2xl border shrink-0', opt.colorClass)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[#111c2d] font-bold font-outfit text-sm sm:text-base">{opt.title}</h4>
                      <p className="text-[#434655] text-xs mt-1 leading-relaxed">{opt.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Trigger */}
          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-white bg-[#004ac6] hover:bg-[#003ea8] transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 mt-8 active:scale-95"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            ) : (
              <>
                <span>Begin Mock Interview</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </AuthGuard>
  );
}
