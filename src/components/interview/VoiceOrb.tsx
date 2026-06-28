'use client';

import { useInterviewStore } from '@/store/interviewStore';
import { Sparkles, Mic, Volume2, Hourglass } from 'lucide-react';
import clsx from 'clsx';

export function VoiceOrb() {
  const { status } = useInterviewStore();

  return (
    <div className="flex flex-col items-center justify-center py-12 select-none">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Glow Layer 3 (Large Aura) */}
        <div
          className={clsx(
            'absolute inset-0 rounded-full blur-3xl opacity-20 transition-all duration-1000 scale-125',
            status === 'interviewer-speaking' && 'bg-violet-500 scale-150 animate-pulse',
            status === 'candidate-turn' && 'bg-emerald-500 scale-150 animate-pulse',
            (status === 'connecting' || status === 'processing') && 'bg-amber-500 scale-135 animate-pulse',
            status === 'idle' && 'bg-slate-700'
          )}
        />

        {/* Glow Layer 2 (Middle Aura) */}
        <div
          className={clsx(
            'absolute inset-4 rounded-full blur-2xl opacity-40 transition-all duration-700',
            status === 'interviewer-speaking' && 'bg-indigo-500 scale-110',
            status === 'candidate-turn' && 'bg-teal-400 scale-110',
            (status === 'connecting' || status === 'processing') && 'bg-yellow-500',
            status === 'idle' && 'bg-slate-800'
          )}
        />

        {/* Glow Layer 1 (Inner Aura) */}
        <div
          className={clsx(
            'absolute inset-8 rounded-full blur-md transition-all duration-500',
            status === 'interviewer-speaking' && 'bg-violet-600 shadow-[0_0_50px_rgba(139,92,246,0.6)]',
            status === 'candidate-turn' && 'bg-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.6)]',
            (status === 'connecting' || status === 'processing') && 'bg-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.5)]',
            status === 'idle' && 'bg-slate-700'
          )}
        />

        {/* Core Orb Sphere */}
        <div
          className={clsx(
            'absolute w-36 h-36 rounded-full flex items-center justify-center transition-all duration-500 border border-white/10 backdrop-blur-xl shadow-2xl',
            status === 'interviewer-speaking' && 'bg-gradient-to-tr from-violet-900/80 to-purple-600/80 scale-105',
            status === 'candidate-turn' && 'bg-gradient-to-tr from-emerald-950/80 to-emerald-500/80 scale-105',
            (status === 'connecting' || status === 'processing') && 'bg-gradient-to-tr from-amber-900/80 to-yellow-500/80',
            status === 'idle' && 'bg-gradient-to-tr from-slate-900/80 to-slate-700/80'
          )}
        >
          {/* Animated Central Icon */}
          {status === 'interviewer-speaking' && (
            <Volume2 className="w-12 h-12 text-purple-200 animate-bounce" />
          )}
          {status === 'candidate-turn' && (
            <Mic className="w-12 h-12 text-emerald-100 animate-pulse" />
          )}
          {(status === 'connecting' || status === 'processing') && (
            <Hourglass className="w-12 h-12 text-yellow-100 animate-spin" />
          )}
          {status === 'idle' && (
            <Sparkles className="w-12 h-12 text-slate-400" />
          )}
        </div>
      </div>
    </div>
  );
}
