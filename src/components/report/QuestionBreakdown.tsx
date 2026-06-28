'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';
import clsx from 'clsx';

interface FeedbackEntry {
  question: string;
  answer: string;
  feedback: string;
  score: number;
}

interface QuestionBreakdownProps {
  entries: FeedbackEntry[];
}

export function QuestionBreakdown({ entries }: QuestionBreakdownProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold font-outfit text-lg border-b border-slate-800 pb-3 mb-4">
        Question-by-Question Deep Dive
      </h3>

      {entries.length === 0 ? (
        <p className="text-slate-500 text-sm italic">No question breakdown entries recorded for this session.</p>
      ) : (
        entries.map((entry, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-xl border border-slate-800/80 bg-[#0F172A]/20 overflow-hidden transition-all duration-300"
            >
              {/* Accordion Trigger */}
              <button
                onClick={() => toggleOpen(i)}
                className="w-full flex items-center justify-between p-5 text-left bg-[#0F172A]/40 hover:bg-[#0F172A]/75 transition"
              >
                <div className="flex-1 pr-4">
                  <span className="text-xs font-semibold text-violet-400">Question {i + 1}</span>
                  <h4 className="text-white font-medium text-sm sm:text-base mt-1 line-clamp-1">{entry.question}</h4>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-amber-400 font-mono text-sm font-semibold">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{entry.score}/10</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Accordion Content */}
              <div
                className={clsx(
                  'transition-all duration-300 ease-in-out border-slate-800/80',
                  isOpen ? 'max-h-[1000px] border-t p-5 space-y-4' : 'max-h-0'
                )}
              >
                {isOpen && (
                  <>
                    {/* Full Question */}
                    <div>
                      <h5 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Question asked:</h5>
                      <p className="text-white font-medium text-sm mt-1">{entry.question}</p>
                    </div>

                    {/* Candidate's Answer */}
                    <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800/40">
                      <h5 className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Your response:</h5>
                      <p className="text-slate-200 text-sm mt-1.5 leading-relaxed italic">"{entry.answer}"</p>
                    </div>

                    {/* AI Feedback */}
                    <div className="p-4 rounded-lg bg-violet-950/5 border border-violet-900/10">
                      <h5 className="text-violet-400 text-xs font-semibold uppercase tracking-wider">AI Evaluation:</h5>
                      <p className="text-slate-300 text-sm mt-1.5 leading-relaxed">{entry.feedback}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
