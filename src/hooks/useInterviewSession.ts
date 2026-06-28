import { useState } from 'react';
import { useInterviewStore } from '@/store/interviewStore';
import { useAuthStore } from '@/store/authStore';

export function useInterviewSession() {
  const { token } = useAuthStore();
  const {
    currentSessionId,
    setCurrentSessionId,
    setVapiCallConfig,
    setOpeningMessage,
    setTranscript,
    resetSession,
  } = useInterviewStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startSession = async (
    interviewType: 'behavioral' | 'technical' | 'system_design' | 'hr_culture',
    customJobRole?: string
  ): Promise<{ sessionId: string; config: any } | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/interview/session/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ interviewType, customJobRole }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to start interview session');
      }

      setCurrentSessionId(data.sessionId);
      setVapiCallConfig(data.vapiCallConfig);
      setOpeningMessage(data.openingMessage);

      // Pre-populate transcript with opening message so it shows immediately
      if (data.openingMessage) {
        setTranscript([{
          role: 'assistant',
          content: data.openingMessage,
          timestamp: new Date().toISOString(),
        }]);
      }

      return { sessionId: data.sessionId, config: data.vapiCallConfig };
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const endSession = async (sessionId: string): Promise<any | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/interview/session/end', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate feedback report');
      }

      resetSession();
      return data.feedbackReport;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    currentSessionId,
    loading,
    error,
    startSession,
    endSession,
  };
}
