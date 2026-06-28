'use client';

import Link from 'next/link';
import { Calendar, Briefcase, Star } from 'lucide-react';

interface SessionCardProps {
  session: {
    id: string;
    interviewType: string;
    jobRole: string;
    status: string;
    startedAt: string;
    feedbackReport?: {
      overallScore: number;
      hiringRecommendation: string;
    } | null;
  };
}

export function SessionCard({ session }: SessionCardProps) {
  const formattedDate = new Date(session.startedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const getHiringColor = (rec: string) => {
    switch (rec) {
      case 'strong yes':
      case 'yes':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'maybe':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'no':
      default:
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    }
  };

  const getInterviewTypeName = (type: string) => {
    switch (type) {
      case 'system_design':
        return 'System Design';
      case 'technical':
        return 'Technical Coding';
      case 'hr_culture':
        return 'HR & Culture';
      case 'behavioral':
      default:
        return 'Behavioral';
    }
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-800/80 bg-[#0F172A]/40 hover:bg-[#0F172A]/70 backdrop-blur-md transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400">
          <Briefcase className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-white font-bold font-outfit text-base">{session.jobRole}</h4>
          <div className="flex flex-wrap items-center gap-3 text-slate-400 text-xs mt-1.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700/60 font-medium">
              {getInterviewTypeName(session.interviewType)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-slate-800/80">
        {session.feedbackReport ? (
          <>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-violet-400" />
              <span className="text-white font-bold font-outfit">{session.feedbackReport.overallScore}/100</span>
            </div>
            <div className={`px-2.5 py-1 rounded-full border text-xs font-semibold uppercase ${getHiringColor(session.feedbackReport.hiringRecommendation)}`}>
              {session.feedbackReport.hiringRecommendation}
            </div>
            <Link
              href={`/interview/report/${session.id}`}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition border border-slate-700/60"
            >
              View Report
            </Link>
          </>
        ) : (
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <span className="text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full uppercase">
              {session.status === 'active' ? 'In Progress' : 'Incomplete'}
            </span>
            {session.status === 'active' && (
              <Link
                href="/interview/session"
                className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition shadow-[0_0_15px_rgba(139,92,246,0.2)]"
              >
                Resume
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
