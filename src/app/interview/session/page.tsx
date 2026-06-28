'use client';

import { useEffect, useState } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { useInterviewStore } from '@/store/interviewStore';
import { useInterviewSession } from '@/hooks/useInterviewSession';
import { useVapiSession } from '@/hooks/useVapiSession';
import { useRouter } from 'next/navigation';
import { Mic, MicOff, PhoneOff, ArrowRight, Video, FileText, Settings, User } from 'lucide-react';
import clsx from 'clsx';

export default function VoiceSessionPage() {
  const router = useRouter();
  const { currentSessionId, vapiCallConfig, transcript, openingMessage } = useInterviewStore();
  const { endSession } = useInterviewSession();
  const { status, isMuted, isSimulated, startCall, endCall, toggleMute } = useVapiSession();

  const [activeTab, setActiveTab] = useState<'transcript' | 'notepad'>('transcript');
  const [notepadText, setNotepadText] = useState('');
  const [elapsedTime, setElapsedTime] = useState('00:00');
  const [endingLoader, setEndingLoader] = useState(false);

  // Timer Tick
  useEffect(() => {
    let seconds = 0;
    const interval = setInterval(() => {
      seconds++;
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      setElapsedTime(`${mins}:${secs}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Connect WebRTC Voice session
  useEffect(() => {
    if (currentSessionId && vapiCallConfig) {
      startCall(vapiCallConfig);
    } else {
      router.push('/interview/setup');
    }
    return () => {
      endCall();
    };
  }, [currentSessionId, vapiCallConfig]);

  const handleEndSession = async () => {
    if (!currentSessionId) return;
    const confirmEnd = window.confirm('Are you sure you want to end this interview session?');
    if (!confirmEnd) return;

    setEndingLoader(true);
    await endCall();
    const report = await endSession(currentSessionId);
    setEndingLoader(false);
    if (report) {
      router.push(`/interview/report/${currentSessionId}`);
    } else {
      router.push('/dashboard');
    }
  };

  // Extract latest interviewer speech prompt — use stored openingMessage as immediate fallback
  const latestAssistantMessage = transcript
    .filter((t) => t.role === 'assistant')
    .slice(-1)[0]?.content;
  const latestPrompt = latestAssistantMessage || openingMessage || 'Preparing your first question...';

  return (
    <AuthGuard>
      <div className="bg-[#f9f9ff] text-[#111c2d] min-h-[calc(100vh-4rem)] flex flex-col font-sans overflow-hidden select-none">
        
        {/* Subnav Header info */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-[#c3c6d7]/30 z-30 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="font-outfit text-label-md font-bold text-[#004ac6] tracking-tight">InterviewAI</span>
            <div className="h-4 w-[1px] bg-[#c3c6d7] mx-2" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#111c2d] leading-none">Software Engineering Track</span>
              <span className="text-[9px] text-[#004ac6] font-extrabold uppercase tracking-widest mt-1">
                Behavioral + Technical Round
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-[#d0e1fb]/50 px-4 py-1.5 rounded-full text-xs font-bold text-[#00174b]">
              <span>Time Elapsed: {elapsedTime}</span>
            </div>
            {isSimulated && (
              <span className="text-[10px] font-bold bg-[#ffdbcd] text-[#943700] px-2 py-0.5 rounded border border-[#ffdbcd]">
                Simulated Fallback
              </span>
            )}
            <button className="flex items-center gap-1.5 text-xs text-[#434655] hover:text-[#004ac6] transition">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </header>

        {/* Main interactive grid */}
        <main className="flex-1 flex overflow-hidden p-6 gap-6 min-h-0">
          
          {/* Left panel: Large Interviewer Avatar Box */}
          <section className="flex-1 flex flex-col relative">
            <div className="flex-1 rounded-3xl bg-[#263143] overflow-hidden shadow-xl relative border-4 border-[#d8e3fb] flex flex-col justify-end">
              
              {/* Interviewer Static Image Feed */}
              <div className="absolute inset-0 z-0">
                <img
                  className="w-full h-full object-cover opacity-95"
                  alt="AI Recruiter"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwuRLdIyU7C8RkGMytFqORmYYunlGST-AhOwiSctCD5qLHgnbRw3YPGiGjiLXhR0hz0hz-lpnyBICF_aDk4d4CA2OdB4FMb7IbzIvMWYpTO2n9eqR6nJ_4aTAPEUSgwWIq5E-jYLnxBq-Y6EbzRHJrG7r1ILUyysuXY86yw73mAxNJlcx_AEcu-dnKxG5aiJEu4rHJ9qGVpzBdWuVwwunSGGwITtZtzduOp3Hm5XAL_HQLNAWtcxD7"
                />
              </div>

              {/* Glowing Dynamic waveform visualizer overlay */}
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-end gap-1 h-12 z-10 px-6 py-2 rounded-2xl glass-card">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-[#004ac6] rounded-full animate-pulse"
                    style={{
                      height: '100%',
                      animationDuration: `${0.6 + i * 0.1}s`,
                      animationDelay: `${i * 0.05}s`
                    }}
                  />
                ))}
              </div>

              {/* Webcam PiP window overlay */}
              <div className="absolute top-6 right-6 w-40 aspect-video rounded-xl overflow-hidden border-2 border-white/20 shadow-lg z-20">
                <img
                  className="w-full h-full object-cover"
                  alt="User feed"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-j5IHP9Z5n37ZbTgTAT_Ljs6NZpeDBAXj4g8XFT4BG6ewDILz9p5raKwgLH0t78-t2SQgLcrkxGqCs9SHH2biCyA6g3Z3iX2HMiUB-VpQqfs3aNGY_rerI8VoqZJCeezBZE_8HdrqhlWc9uUt8ROujkBcNdg3anHqt22OnoGq-phaMd5ZjAIaqpnS1hLcZhqLfrPaVLWVXGcCaqtXWVOiLXnWc71erW6ga0Y4AC9rfxYsIfKCgamR"
                />
                <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] text-white font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Live</span>
                </div>
              </div>

              {/* Full controls layout bar overlay */}
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleMute}
                    className={clsx(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95",
                      isMuted ? "bg-rose-600 text-white" : "bg-white/20 hover:bg-white/30 text-white backdrop-blur-md"
                    )}
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={handleEndSession}
                    disabled={endingLoader}
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-all active:scale-95 disabled:opacity-50"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 mx-6 max-w-xl">
                  <p className="text-white font-semibold text-center text-xs bg-black/30 backdrop-blur-md py-2.5 px-4 rounded-xl border border-white/10 italic">
                    "{latestPrompt}"
                  </p>
                </div>

                <button
                  onClick={handleEndSession}
                  className="flex items-center gap-2 px-5 py-3 bg-[#004ac6] hover:bg-[#003ea8] text-white rounded-xl font-bold text-xs shadow-lg transition active:scale-95"
                >
                  <span>Finish Interview</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </section>

          {/* Right sidebar tabbed panel */}
          <aside className="w-80 flex flex-col gap-4 shrink-0 min-h-0">
            {/* Tab header buttons */}
            <div className="flex p-1 bg-[#dee8ff]/60 rounded-xl gap-1 shrink-0">
              <button
                onClick={() => setActiveTab('transcript')}
                className={clsx(
                  'flex-grow py-2 text-xs font-bold rounded-lg transition-all',
                  activeTab === 'transcript' ? 'bg-white shadow-sm text-[#004ac6]' : 'text-[#434655] hover:bg-white/40'
                )}
              >
                Transcript
              </button>
              <button
                onClick={() => setActiveTab('notepad')}
                className={clsx(
                  'flex-grow py-2 text-xs font-bold rounded-lg transition-all',
                  activeTab === 'notepad' ? 'bg-white shadow-sm text-[#004ac6]' : 'text-[#434655] hover:bg-white/40'
                )}
              >
                Notepad
              </button>
            </div>

            {/* Tab: Transcript panel */}
            <div className={clsx('flex-1 flex flex-col bg-white rounded-2xl border border-[#c3c6d7]/30 overflow-hidden shadow-sm min-h-0', activeTab !== 'transcript' && 'hidden')}>
              <div className="p-3 border-b border-[#c3c6d7]/20 flex justify-between items-center bg-[#f0f3ff]/30 shrink-0">
                <span className="text-xs font-bold text-[#434655]">Live Session History</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6] animate-ping" />
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth scrollbar-thin">
                {transcript.map((entry, index) => {
                  const isAI = entry.role === 'assistant';
                  return (
                    <div key={index} className={clsx('flex gap-2.5', !isAI && 'flex-row-reverse')}>
                      <div className={clsx('w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold', isAI ? 'bg-[#dbe1ff] text-[#004ac6]' : 'bg-[#d3e4fe] text-indigo-700')}>
                        {isAI ? 'AI' : 'U'}
                      </div>
                      <div className={clsx('max-w-[75%]', !isAI && 'text-right')}>
                        <span className="text-[10px] text-[#434655] font-semibold">{isAI ? 'Interviewer' : 'You'}</span>
                        <div className={clsx(
                          'p-3 rounded-2xl text-xs leading-relaxed mt-0.5',
                          isAI
                            ? 'bg-[#f0f3ff] rounded-tl-none text-[#434655]'
                            : 'bg-[#dbe1ff]/60 rounded-tr-none text-[#111c2d]'
                        )}>
                          {entry.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tab: Notepad panel */}
            <div className={clsx('flex-1 flex flex-col bg-white rounded-2xl border border-[#c3c6d7]/30 overflow-hidden shadow-sm min-h-0', activeTab !== 'notepad' && 'hidden')}>
              <div className="p-3 border-b border-[#c3c6d7]/20 flex justify-between items-center bg-[#f0f3ff]/30 shrink-0">
                <span className="text-xs font-bold text-[#434655]">Quick Notes</span>
              </div>
              <textarea
                value={notepadText}
                onChange={(e) => setNotepadText(e.target.value)}
                className="flex-grow p-4 bg-transparent border-none focus:ring-0 text-xs leading-relaxed placeholder:text-slate-400 focus:outline-none resize-none"
                placeholder="Jot down keywords or points you want to cover..."
              />
              <div className="p-2 border-t border-[#c3c6d7]/20 bg-[#f0f3ff]/30 flex justify-between items-center shrink-0">
                <span className="text-[10px] text-[#434655]/60 italic">Saved automatically</span>
                <button onClick={() => setNotepadText('')} className="text-[#004ac6] text-[10px] hover:underline font-semibold">
                  Clear
                </button>
              </div>
            </div>

            {/* Tips widget panel */}
            <div className="bg-[#dee8ff]/30 rounded-2xl p-4 border border-[#004ac6]/10 shrink-0">
              <div className="flex items-start gap-2.5">
                <FileText className="w-5 h-5 text-[#004ac6] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#004ac6] mb-1 font-outfit">Interview Tip</h4>
                  <p className="text-[10px] text-[#434655] leading-relaxed">
                    Focus on the STAR method (Situation, Task, Action, Result) for this behavioral question.
                  </p>
                </div>
              </div>
            </div>

          </aside>
        </main>
      </div>
    </AuthGuard>
  );
}
