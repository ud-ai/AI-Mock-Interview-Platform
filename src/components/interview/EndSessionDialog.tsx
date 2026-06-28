'use client';

import { AlertTriangle } from 'lucide-react';

interface EndSessionDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export function EndSessionDialog({ isOpen, onConfirm, onCancel, loading }: EndSessionDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 rounded-2xl border border-slate-800 bg-[#0F172A] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 text-rose-500 mb-4">
          <AlertTriangle className="w-6 h-6" />
          <h3 className="text-lg font-bold font-outfit text-white">End Interview Session?</h3>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          Are you sure you want to end this interview? The AI will immediately stop the session and compile your detailed performance feedback report up to this point.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-rose-600 hover:bg-rose-500 hover:shadow-[0_0_15px_rgba(244,63,94,0.4)] transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <span>End & Evaluate</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
