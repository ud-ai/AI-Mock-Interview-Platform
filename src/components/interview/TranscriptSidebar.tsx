'use client';

import { useInterviewStore } from '@/store/interviewStore';
import { useRef, useEffect } from 'react';
import { MessageSquare, ChevronRight, ChevronLeft } from 'lucide-react';
import clsx from 'clsx';

interface TranscriptSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function TranscriptSidebar({ isOpen, onToggle }: TranscriptSidebarProps) {
  const { transcript } = useInterviewStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of transcript
  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcript, isOpen]);

  return (
    <div
      className={clsx(
        'fixed top-16 right-0 bottom-0 z-30 flex transition-all duration-300 border-l border-slate-800/80 bg-[#0F172A]/95 backdrop-blur-xl',
        isOpen ? 'w-80 sm:w-96' : 'w-0'
      )}
    >
      {/* Toggle button protruding from left side of drawer */}
      <button
        onClick={onToggle}
        className="absolute top-1/2 -left-8 -translate-y-1/2 p-2 rounded-l-md border-y border-l border-slate-800 bg-[#0F172A]/90 hover:bg-slate-900 text-slate-400 hover:text-white transition"
      >
        {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="flex-1 flex flex-col h-full overflow-hidden p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-800/60 mb-4">
            <MessageSquare className="w-5 h-5 text-violet-400" />
            <h3 className="text-white font-semibold font-outfit text-md">Live Transcript</h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
            {transcript.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                Conversation will appear here...
              </div>
            ) : (
              transcript.map((turn, i) => (
                <div
                  key={i}
                  className={clsx(
                    'flex flex-col gap-1 p-3 rounded-lg text-sm transition-all',
                    turn.role === 'user'
                      ? 'bg-emerald-950/20 border border-emerald-900/30 ml-8 text-emerald-100'
                      : 'bg-violet-950/20 border border-violet-900/30 mr-8 text-violet-100'
                  )}
                >
                  <span
                    className={clsx(
                      'text-xs font-semibold',
                      turn.role === 'user' ? 'text-emerald-400 self-end' : 'text-violet-400'
                    )}
                  >
                    {turn.role === 'user' ? 'You' : 'Interviewer'}
                  </span>
                  <p className="leading-relaxed">{turn.content}</p>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>
        </div>
      )}
    </div>
  );
}
