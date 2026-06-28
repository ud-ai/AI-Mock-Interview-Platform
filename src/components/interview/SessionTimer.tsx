'use client';

import { useEffect } from 'react';
import { useInterviewStore } from '@/store/interviewStore';
import { Clock } from 'lucide-react';

export function SessionTimer() {
  const { timerSeconds, incrementTimer, status } = useInterviewStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status !== 'idle' && status !== 'connecting') {
      interval = setInterval(() => {
        incrementTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, incrementTimer]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-800 bg-[#0F172A]/80 text-slate-300 font-mono text-sm">
      <Clock className="w-4 h-4 text-violet-400 animate-pulse" />
      <span>{formatTime(timerSeconds)}</span>
    </div>
  );
}
