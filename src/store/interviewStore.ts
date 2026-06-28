import { create } from 'zustand';
import { TranscriptTurn } from '@/types/interview';

export type SessionStatus = 'idle' | 'connecting' | 'interviewer-speaking' | 'candidate-turn' | 'processing';

interface InterviewStateStore {
  currentSessionId: string | null;
  status: SessionStatus;
  transcript: TranscriptTurn[];
  timerSeconds: number;
  openingMessage: string;
  vapiCallConfig: any;
  setCurrentSessionId: (id: string | null) => void;
  setStatus: (status: SessionStatus) => void;
  setTranscript: (turns: TranscriptTurn[]) => void;
  addTranscriptTurn: (turn: TranscriptTurn) => void;
  setVapiCallConfig: (config: any) => void;
  setOpeningMessage: (msg: string) => void;
  setTimerSeconds: (secs: number) => void;
  incrementTimer: () => void;
  resetSession: () => void;
}

export const useInterviewStore = create<InterviewStateStore>((set) => ({
  currentSessionId: null,
  status: 'idle',
  transcript: [],
  timerSeconds: 0,
  openingMessage: '',
  vapiCallConfig: null,
  setCurrentSessionId: (id) => set({ currentSessionId: id }),
  setStatus: (status) => set({ status }),
  setTranscript: (transcript) => set({ transcript }),
  addTranscriptTurn: (turn) => set((state) => ({ transcript: [...state.transcript, turn] })),
  setVapiCallConfig: (vapiCallConfig) => set({ vapiCallConfig }),
  setOpeningMessage: (openingMessage) => set({ openingMessage }),
  setTimerSeconds: (timerSeconds) => set({ timerSeconds }),
  incrementTimer: () => set((state) => ({ timerSeconds: state.timerSeconds + 1 })),
  resetSession: () => set({
    currentSessionId: null,
    status: 'idle',
    transcript: [],
    timerSeconds: 0,
    openingMessage: '',
    vapiCallConfig: null,
  }),
}));
