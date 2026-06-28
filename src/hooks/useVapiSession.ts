import { useEffect, useRef, useState } from 'react';
import { useInterviewStore } from '@/store/interviewStore';
import { useAuthStore } from '@/store/authStore';

// Web Speech API interfaces for TS compiler
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

export function useVapiSession() {
  const {
    currentSessionId,
    status,
    vapiCallConfig,
    openingMessage,
    setStatus,
    addTranscriptTurn,
    setCurrentSessionId,
  } = useInterviewStore();

  const { token } = useAuthStore();
  const [isMuted, setIsMuted] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);

  const vapiRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisUtteranceRef = useRef<any>(null);

  // Initialize Vapi SDK or native fallback
  const startCall = async (config: any) => {
    const vapiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;

    if (vapiKey && vapiKey !== 'your-vapi-public-key') {
      setIsSimulated(false);
      setStatus('connecting');

      // Safety timeout: if Vapi doesn't connect in 5s, fall back to simulation
      const vapiTimeout = setTimeout(() => {
        console.warn('Vapi connection timeout — falling back to browser simulation');
        try { vapiRef.current?.stop(); } catch (_) {}
        vapiRef.current = null;
        setupSimulation(config);
      }, 5000);

      try {
        const Vapi = (await import('@vapi-ai/web')).default;
        if (!vapiRef.current) {
          vapiRef.current = new Vapi(vapiKey);
        }

        const vapi = vapiRef.current;

        vapi.start(config.assistantId || {
          model: {
            provider: 'google',
            model: 'gemini-1.5-flash',
            messages: [
              {
                role: 'system',
                content: 'You are an expert AI interviewer. Ask insightful questions and evaluate answers professionally.',
              },
            ],
          },
          voice: {
            provider: 'playht',
            voiceId: 'jennifer',
          },
          firstMessage: config.firstMessage,
        });

        vapi.on('call-start', () => {
          clearTimeout(vapiTimeout);
          setStatus('interviewer-speaking');
          addTranscriptTurn({
            role: 'assistant',
            content: config.firstMessage,
            timestamp: new Date().toISOString(),
          });
        });

        vapi.on('speech-start', () => setStatus('interviewer-speaking'));
        vapi.on('speech-end', () => setStatus('candidate-turn'));

        vapi.on('message', (message: any) => {
          if (message.type === 'transcript' && message.transcriptType === 'final') {
            addTranscriptTurn({
              role: message.role === 'assistant' ? 'assistant' : 'user',
              content: message.transcript,
              timestamp: new Date().toISOString(),
            });
          }
        });

        vapi.on('error', (err: any) => {
          clearTimeout(vapiTimeout);
          console.warn('Vapi error, falling back to browser simulation:', err);
          try { vapiRef.current?.stop(); } catch (_) {}
          vapiRef.current = null;
          setupSimulation(config);
        });
      } catch (err) {
        clearTimeout(vapiTimeout);
        console.error('Failed to load Vapi Web SDK, falling back to simulation:', err);
        setupSimulation(config);
      }
    } else {
      setupSimulation(config);
    }
  };

  // Web Speech API simulation fallback
  const setupSimulation = (config: any) => {
    setIsSimulated(true);
    setStatus('connecting');

    setTimeout(() => {
      setStatus('interviewer-speaking');
      speakSimulationText(config.firstMessage, () => {
        setStatus('candidate-turn');
        startSpeechRecognition();
      });

      addTranscriptTurn({
        role: 'assistant',
        content: config.firstMessage,
        timestamp: new Date().toISOString(),
      });
    }, 1500);
  };

  const speakSimulationText = (text: string, onEnd: () => void) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      onEnd();
      return;
    }

    // Cancel ongoing synthesis
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    synthesisUtteranceRef.current = utterance;

    // Use a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google'));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onend = () => {
      onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Synthesis error:', e);
      onEnd();
    };

    window.speechSynthesis.speak(utterance);
  };

  const startSpeechRecognition = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser. Please type or use Chrome.');
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const rec = new SpeechRecognition();
    recognitionRef.current = rec;
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setStatus('candidate-turn');
    };

    rec.onresult = async (event: SpeechRecognitionEvent) => {
      const transcriptText = event.results[0][0].transcript;
      setStatus('processing');
      
      addTranscriptTurn({
        role: 'user',
        content: transcriptText,
        timestamp: new Date().toISOString(),
      });

      // Send to the backend mock responder
      try {
        const res = await fetch(`/api/interview/respond?sessionId=${currentSessionId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'user',
                content: transcriptText,
              },
            ],
          }),
        });

        const data = await res.json();
        const nextText = data.choices?.[0]?.message?.content || '';

        addTranscriptTurn({
          role: 'assistant',
          content: nextText,
          timestamp: new Date().toISOString(),
        });

        setStatus('interviewer-speaking');
        speakSimulationText(nextText, () => {
          // Check if session has finished
          if (nextText.includes('concludes our mock interview') || nextText.includes('Good luck!')) {
            endCall();
          } else {
            setStatus('candidate-turn');
            startSpeechRecognition();
          }
        });
      } catch (err) {
        console.error('Simulation response error:', err);
        setStatus('candidate-turn');
      }
    };

    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        // Keep listening
        try { rec.start(); } catch(_) {}
      }
    };

    try {
      rec.start();
    } catch (_) {}
  };

  const endCall = async () => {
    if (isSimulated) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else if (vapiRef.current) {
      vapiRef.current.stop();
    }
    setStatus('idle');
  };

  const toggleMute = () => {
    if (isSimulated) {
      if (recognitionRef.current) {
        if (isMuted) {
          recognitionRef.current.start();
        } else {
          recognitionRef.current.stop();
        }
      }
    } else if (vapiRef.current) {
      vapiRef.current.setMuted(!isMuted);
    }
    setIsMuted(!isMuted);
  };

  // Clean up synthesis and recognition on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return {
    status,
    isMuted,
    isSimulated,
    startCall,
    endCall,
    toggleMute,
  };
}
