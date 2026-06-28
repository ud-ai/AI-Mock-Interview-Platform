'use client';

import { useEffect, useState } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Star, CheckCircle, AlertTriangle, Clock, Share2, Download } from 'lucide-react';

interface ReportPageProps {
  params: {
    id: string;
  };
}

export default function FeedbackReportPage({ params }: ReportPageProps) {
  const { token } = useAuth();
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/interview/sessions/${params.id}/report`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setReportData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchReport();
    }
  }, [token]);

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-[calc(100vh-4rem)] bg-[#f9f9ff] flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 rounded-full border-4 border-[#004ac6]/20 border-t-[#004ac6] animate-spin" />
          <p className="text-[#434655] font-semibold text-sm animate-pulse">Analyzing Interview Session...</p>
        </div>
      </AuthGuard>
    );
  }

  if (!reportData) {
    return (
      <AuthGuard>
        <div className="min-h-[calc(100vh-4rem)] bg-[#f9f9ff] flex flex-col items-center justify-center p-6 space-y-4 text-center max-w-md mx-auto">
          <h2 className="text-[#111c2d] font-bold font-outfit text-xl">Feedback Report Not Found</h2>
          <p className="text-[#434655] text-sm leading-relaxed">
            We couldn't retrieve the report for this interview. It might still be processing.
          </p>
          <Link
            href="/dashboard"
            className="px-6 py-2.5 rounded-xl bg-white border border-[#c3c6d7] hover:bg-slate-50 text-[#111c2d] text-sm font-semibold transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </AuthGuard>
    );
  }

  const { report, session } = reportData;
  const score = report?.overallScore || 0;
  const formattedDate = new Date(session.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <AuthGuard>
      <div className="bg-[#f9f9ff] min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 text-[#111c2d]">
        
        {/* Back navigation & header metadata row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#c3c6d7]/30 pb-6">
          <div className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-1 text-[#434655] hover:text-[#004ac6] transition text-xs font-bold uppercase tracking-wider">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-extrabold font-outfit text-[#111c2d] tracking-tight">
              Interview Summary: {session.jobRole || 'Software Engineer'}
            </h1>
            <p className="text-[#434655] text-xs">
              Session completed on {formattedDate} • Duration: 15 minutes
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 border border-[#c3c6d7] bg-white rounded-xl text-xs font-bold hover:bg-slate-50 transition active:scale-95">
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Report</span>
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-[#004ac6] text-white rounded-xl text-xs font-bold hover:bg-[#003ea8] transition active:scale-95 shadow-sm">
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Primary breakdown grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left card: Overall Score Ring */}
          <div className="md:col-span-4 bg-white p-8 rounded-3xl border border-[#c3c6d7]/20 shadow-sm flex flex-col items-center text-center justify-center space-y-6">
            
            {/* SVG Progress Circle */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="62" stroke="#f0f3ff" strokeWidth="12" fill="transparent" />
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  stroke="#004ac6"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={389.5}
                  strokeDashoffset={389.5 - (389.5 * score) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold font-outfit">{score}</span>
                <span className="text-[10px] text-[#434655] font-semibold uppercase tracking-wider">OUT OF 100</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-lg font-outfit">Overall: {score}/100</h3>
              <p className="text-xs text-[#434655] leading-relaxed">
                {score >= 80
                  ? 'Outstanding performance. You showed high competence in structural logic and communication.'
                  : score >= 60
                  ? 'Solid performance. Some key areas could be polished to make your feedback stand out.'
                  : 'Practice makes perfect. Review the action points below to build confidence.'}
              </p>
            </div>
          </div>

          {/* Right card: Criteria details */}
          <div className="md:col-span-8 bg-white p-8 rounded-3xl border border-[#c3c6d7]/20 shadow-sm flex flex-col justify-between gap-6">
            <h3 className="font-bold font-outfit text-base">Performance Breakdown</h3>

            <div className="space-y-4">
              {/* Communication */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-[#434655]">
                  <span>Communication</span>
                  <span>{score >= 80 ? '92%' : '78%'}</span>
                </div>
                <div className="w-full bg-[#f0f3ff] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#004ac6] h-full rounded-full" style={{ width: score >= 80 ? '92%' : '78%' }} />
                </div>
              </div>

              {/* Technical Depth */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-[#434655]">
                  <span>Technical Depth</span>
                  <span>{score >= 80 ? '85%' : '65%'}</span>
                </div>
                <div className="w-full bg-[#f0f3ff] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#004ac6] h-full rounded-full" style={{ width: score >= 80 ? '85%' : '65%' }} />
                </div>
              </div>

              {/* Clarity */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-[#434655]">
                  <span>Clarity</span>
                  <span>{score >= 80 ? '87%' : '72%'}</span>
                </div>
                <div className="w-full bg-[#f0f3ff] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#004ac6] h-full rounded-full" style={{ width: score >= 80 ? '87%' : '72%' }} />
                </div>
              </div>
            </div>

            {/* Micro rating chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#c3c6d7]/20">
              <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl text-center">
                <span className="text-[9px] text-emerald-800 uppercase tracking-widest font-bold block">Logic</span>
                <span className="text-xs font-bold text-emerald-900 mt-0.5 block">Advanced</span>
              </div>
              <div className="bg-blue-50 border border-blue-100 p-2.5 rounded-xl text-center">
                <span className="text-[9px] text-[#003ea8] uppercase tracking-widest font-bold block">Empathy</span>
                <span className="text-xs font-bold text-[#00174b] mt-0.5 block">High</span>
              </div>
              <div className="bg-purple-50 border border-purple-100 p-2.5 rounded-xl text-center">
                <span className="text-[9px] text-purple-800 uppercase tracking-widest font-bold block">Pacing</span>
                <span className="text-xs font-bold text-purple-900 mt-0.5 block">Steady</span>
              </div>
              <div className="bg-orange-50 border border-orange-100 p-2.5 rounded-xl text-center">
                <span className="text-[9px] text-orange-850 uppercase tracking-widest font-bold block">Structure</span>
                <span className="text-xs font-bold text-orange-950 mt-0.5 block">Good</span>
              </div>
            </div>

          </div>

        </div>

        {/* Detailed feedback list block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Detailed Feedback card */}
          <div className="bg-white p-8 rounded-3xl border border-[#c3c6d7]/20 shadow-sm space-y-6">
            <h3 className="font-bold font-outfit text-base border-b border-[#c3c6d7]/10 pb-2">Detailed Feedback</h3>
            
            {/* Strengths */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md w-fit flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Strengths</span>
              </h4>
              <ul className="space-y-2">
                {report.strengths?.map((str: string, index: number) => (
                  <li key={index} className="text-xs text-[#434655] leading-relaxed flex items-start gap-2">
                    <span className="text-emerald-500 font-bold mt-0.5">•</span>
                    <span>{str}</span>
                  </li>
                )) || (
                  <li className="text-xs text-[#434655] italic">No specific strengths recorded.</li>
                )}
              </ul>
            </div>

            {/* Improvements */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold text-[#bc4800] bg-[#ffdbcd] px-3 py-1 rounded-md w-fit flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Areas to Improve</span>
              </h4>
              <ul className="space-y-2">
                {report.improvements?.map((imp: string, index: number) => (
                  <li key={index} className="text-xs text-[#434655] leading-relaxed flex items-start gap-2">
                    <span className="text-[#bc4800] font-bold mt-0.5">•</span>
                    <span>{imp}</span>
                  </li>
                )) || (
                  <li className="text-xs text-[#434655] italic">No specific improvements recorded.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Session Timeline card */}
          <div className="bg-white p-8 rounded-3xl border border-[#c3c6d7]/20 shadow-sm flex flex-col justify-between gap-6">
            <div>
              <h3 className="font-bold font-outfit text-base border-b border-[#c3c6d7]/10 pb-2 mb-6">Session Timeline</h3>
              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 scrollbar-thin">
                {report.detailedFeedback?.map((item: any, index: number) => (
                  <div key={index} className="flex gap-3 relative pb-2">
                    <div className="p-2 bg-[#f0f3ff] text-[#004ac6] rounded-xl shrink-0 h-fit">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#004ac6]">Question {index + 1}</span>
                        <span className="text-[9px] text-[#434655] bg-[#dee8ff]/30 px-2 py-0.5 rounded-full">
                          Score: {item.score || 8}/10
                        </span>
                      </div>
                      <p className="font-semibold text-xs text-[#111c2d] leading-relaxed">
                        "{item.question}"
                      </p>
                      <p className="text-[10px] text-[#434655] leading-relaxed italic bg-[#f0f3ff]/40 p-2.5 rounded-xl mt-1">
                        {item.critique}
                      </p>
                    </div>
                  </div>
                )) || (
                  <p className="text-xs text-[#434655] italic text-center py-6">No session timeline metrics found.</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#c3c6d7]/20 flex justify-end shrink-0">
              <Link href="/dashboard" className="text-xs text-[#004ac6] font-bold hover:underline">
                View Full Session Transcript
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom CTA Banner */}
        <div className="hero-gradient p-8 rounded-[40px] text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg">
          <div>
            <h3 className="font-bold font-outfit text-lg">Ready to master system design?</h3>
            <p className="text-xs text-[#eeefff] mt-1">
              Based on your feedback, we've curated a specific roadmap to help you expand on trade-offs.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/interview/setup" className="px-6 py-3 bg-white text-[#004ac6] rounded-full font-bold text-xs shadow-md transition hover:bg-slate-50 active:scale-95">
              Start Targeted Practice
            </Link>
            <button className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full font-bold text-xs transition active:scale-95 backdrop-blur-md">
              Review Resources
            </button>
          </div>
        </div>

      </div>
    </AuthGuard>
  );
}
