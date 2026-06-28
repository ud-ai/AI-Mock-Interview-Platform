'use client';

import { useInterviewStore } from '@/store/interviewStore';
import clsx from 'clsx';

export function StatusBanner() {
  const { status } = useInterviewStore();

  const getStatusText = () => {
    switch (status) {
      case 'connecting':
        return 'Connecting to audio stream...';
      case 'interviewer-speaking':
        return 'Interviewer is speaking...';
      case 'candidate-turn':
        return 'Your turn — Speak now';
      case 'processing':
        return 'Evaluating your response...';
      case 'idle':
      default:
        return 'Ready to begin';
    }
  };

  return (
    <div className="w-full max-w-md text-center py-4 px-6 rounded-xl border border-slate-800 bg-[#0F172A]/40 backdrop-blur-md">
      <p
        className={clsx(
          'text-sm font-semibold tracking-wide font-outfit uppercase',
          status === 'interviewer-speaking' && 'text-violet-400',
          status === 'candidate-turn' && 'text-emerald-400 animate-pulse',
          (status === 'connecting' || status === 'processing') && 'text-amber-400',
          status === 'idle' && 'text-slate-400'
        )}
      >
        {getStatusText()}
      </p>
      {status === 'candidate-turn' && (
        <span className="text-xs text-slate-400 mt-1 block">Speak into your microphone. We are listening.</span>
      )}
    </div>
  );
}
