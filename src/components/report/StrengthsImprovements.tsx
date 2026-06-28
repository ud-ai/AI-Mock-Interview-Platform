'use client';

import { CheckCircle2, AlertCircle } from 'lucide-react';

interface StrengthsImprovementsProps {
  strengths: string[];
  improvements: string[];
}

export function StrengthsImprovements({ strengths, improvements }: StrengthsImprovementsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Strengths card */}
      <div className="p-6 rounded-2xl border border-emerald-900/30 bg-emerald-950/5 backdrop-blur-md">
        <h3 className="text-emerald-400 font-bold font-outfit text-base flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          Key Strengths
        </h3>
        <ul className="space-y-3.5">
          {strengths.map((str, i) => (
            <li key={i} className="text-slate-300 text-sm leading-relaxed pl-5 relative before:content-[''] before:absolute before:left-1 before:top-2.5 before:w-1.5 before:h-1.5 before:bg-emerald-500 before:rounded-full">
              {str}
            </li>
          ))}
        </ul>
      </div>

      {/* Improvements card */}
      <div className="p-6 rounded-2xl border border-rose-900/30 bg-rose-950/5 backdrop-blur-md">
        <h3 className="text-rose-400 font-bold font-outfit text-base flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-rose-400" />
          Areas for Improvement
        </h3>
        <ul className="space-y-3.5">
          {improvements.map((imp, i) => (
            <li key={i} className="text-slate-300 text-sm leading-relaxed pl-5 relative before:content-[''] before:absolute before:left-1 before:top-2.5 before:w-1.5 before:h-1.5 before:bg-rose-500 before:rounded-full">
              {imp}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
