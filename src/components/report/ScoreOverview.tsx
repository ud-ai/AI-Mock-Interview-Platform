'use client';

import { ScoreRing } from '../dashboard/ScoreRing';
import { Award, MessageSquare, Code, LayoutGrid, BrainCircuit } from 'lucide-react';

interface ScoreOverviewProps {
  report: {
    overallScore: number;
    communicationScore: number;
    technicalScore: number | null;
    structureScore: number;
    confidenceScore: number;
    hiringRecommendation: string;
    recommendationReason?: string;
  };
}

export function ScoreOverview({ report }: ScoreOverviewProps) {
  const getHiringColor = (rec: string) => {
    switch (rec) {
      case 'strong yes':
      case 'yes':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'maybe':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'no':
      default:
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Overall Circle Card */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/40 backdrop-blur-md flex flex-col items-center justify-center text-center">
        <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4 font-outfit">Overall Score</h3>
        <ScoreRing score={report.overallScore} size={140} strokeWidth={12} />
        
        <div className="mt-6 w-full pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-slate-400 text-sm font-medium">Recommendation:</span>
          <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase ${getHiringColor(report.hiringRecommendation)}`}>
            {report.hiringRecommendation}
          </span>
        </div>
      </div>

      {/* Subscores breakdown list */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/40 backdrop-blur-md flex flex-col justify-center space-y-4">
        <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider font-outfit">Sub-dimensions</h3>
        
        {/* Communication */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="text-slate-300 text-sm font-medium">Communication</span>
          </div>
          <span className="text-white font-bold font-mono">{report.communicationScore}/100</span>
        </div>

        {/* Technical */}
        {report.technicalScore !== null && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Code className="w-4 h-4" />
              </div>
              <span className="text-slate-300 text-sm font-medium">Technical Depth</span>
            </div>
            <span className="text-white font-bold font-mono">{report.technicalScore}/100</span>
          </div>
        )}

        {/* Structure */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <span className="text-slate-300 text-sm font-medium">Structure (STAR)</span>
          </div>
          <span className="text-white font-bold font-mono">{report.structureScore}/100</span>
        </div>

        {/* Confidence */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <span className="text-slate-300 text-sm font-medium">Confidence</span>
          </div>
          <span className="text-white font-bold font-mono">{report.confidenceScore}/100</span>
        </div>
      </div>

      {/* Decision Rationale */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/40 backdrop-blur-md flex flex-col justify-start">
        <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-3 font-outfit">Hiring Decision Rationale</h3>
        <p className="text-slate-300 text-sm leading-relaxed overflow-y-auto max-h-48 pr-2">
          {report.recommendationReason || 'Evaluating candidate response transcripts against standard competency matrix. Performance demonstrates relevant expertise.'}
        </p>
      </div>
    </div>
  );
}
