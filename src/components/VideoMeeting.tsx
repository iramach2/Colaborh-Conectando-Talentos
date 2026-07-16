import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Copy, FileText, Mic, MicOff, PhoneOff, RotateCw, Sparkles, Video, VideoOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { finalizeInterviewTranscript } from '../services/interviewAiService';

interface VideoMeetingProps {
  interviewId?: string;
  enableAiReport?: boolean;
  roomName: string;
  userName: string;
  onClose: () => void;
}

type TranscriptLine = {
  id: string;
  speaker: string;
  text: string;
  createdAt: string;
};

type FinalizedResult = {
  transcript: string;
  reportText?: string;
};

type SignalPayload = {
  roomName: string;
  from: string;
  to?: string;
  type: 'hello' | 'hello-ack' | 'offer' | 'answer' | 'candidate' | 'leave' | 'transcript-line';
  userName?: string;
  data?: unknown;
};

type SpeechRecognitionAlternative = { transcript: string };
type SpeechRecognitionResult = { isFinal: boolean; 0: SpeechRecognitionAlternative };
type SpeechRecognitionEventLike = Event & {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResult>;
};
type SpeechRecognitionInstance = EventTarget & {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;
type WindowWithSpeechRecognition = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
  { urls: ['stun:stun.l.google.com:19302', 'stun:global.stun.twilio.com:3478'] },
];

const parseConfiguredIceServers = () => {
  const rawValue = import.meta.env.VITE_INTERVIEW_ICE_SERVERS;
  if (!rawValue) return DEFAULT_ICE_SERVERS;

  try {
    const parsed = JSON.parse(rawValue) as RTCIceServer[];
    const validServers = parsed.filter((server) => {
      if (!server || typeof server !== 'object') return false;
      if (typeof server.urls === 'string') return server.urls.trim().length > 0;
      return Array.isArray(server.urls) && server.urls.some((url) => typeof url === 'string' && url.trim().length > 0);
    });

    return validServers.length > 0 ? validServers : DEFAULT_ICE_SERVERS;
  } catch (error) {
    console.warn('VITE_INTERVIEW_ICE_SERVERS invalido. Usando STUN publico como fallback.', error);
    return DEFAULT_ICE_SERVERS;
  }
};

const ICE_SERVERS = parseConfiguredIceServers();

const buildLineId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const buildTranscriptText = (lines: TranscriptLine[]) => lines
  .map((line) => `[${new Date(line.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}] ${line.speaker}: ${line.text}`)
  .join('\n');

const makeClientId = () => `peer-${buildLineId()}`;

const getConnectionLabel = (state: RTCPeerConnectionState | 'initializing' | 'waiting' | 'failed') => {
  if (state === 'connected') return 'Conectado';
  if (state === 'connecting') return 'Conectando';
  if (state === 'waiting') return 'Aguardando participante';
  if (state === 'failed' || state === 'disconnected') return 'Conexao instavel';
  return 'Preparando sala';
};

export const VideoMeeting = ({ interviewId, enableAiReport = false, roomName, userName, onClose }: VideoMeetingProps) => {
  const [loading, setLoading] = useState(true);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState | 'initializing' | 'waiting' | 'failed'>('initializing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isTranscriptionEnabled, setIsTranscriptionEnabled] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [transcriptLines, setTranscriptLines] = useState<TranscriptLine[]>([]);
  const [finalizedResult, setFinalizedResult] = useState<FinalizedResult | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const clientIdRef = useRef(makeClientId());
  const remotePeerIdRef = useRef<string | null>(null);
  const hasCreatedOfferRef = useRef(false);
  const isClosingRef = useRef(false);
  const transcriptLinesRef = useRef<TranscriptLine[]>([]);
  const onCloseRef = useRef(onClose);

  const transcriptText = useMemo(() => buildTranscriptText(transcriptLines), [transcriptLines]);
  const connectionLabel = getConnectionLabel(connectionState);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    transcriptLinesRef.current = transcriptLines;
  }, [transcriptLines]);

  const sendSignal = useCallback((payload: Omit<SignalPayload, 'roomName' | 'from'>) => {
    const channel = channelRef.current;
    if (!channel) return;

    void channel.send({
      type: 'broadcast',
      event: 'signal',
      payload: {
        ...payload,
        roomName,
        from: clientIdRef.current,
        userName,
      },
    });
  }, [roomName, userName]);

  const addTranscriptLine = useCallback((line: Omit<TranscriptLine, 'id' | 'createdAt'> & { id?: string; createdAt?: string }, shouldBroadcast = true) => {
    const normalizedText = line.text.trim();
    if (!normalizedText) return;

    const newLine: TranscriptLine = {
      id: line.id || buildLineId(),
      speaker: line.speaker || 'Participante',
      text: normalizedText,
      createdAt: line.createdAt || new Date().toISOString(),
    };

    setTranscriptLines((previous) => {
      const last = previous[previous.length - 1];
      if (last?.speaker === newLine.speaker && last.text === newLine.text) return previous;
      return [...previous, newLine];
    });

    if (shouldBroadcast) {
      sendSignal({ type: 'transcript-line', data: newLine });
    }
  }, [sendSignal]);

  const startSpeechRecognition = useCallback(() => {
    const SpeechRecognition = (window as WindowWithSpeechRecognition).SpeechRecognition || (window as WindowWithSpeechRecognition).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMessage('A transcricao automatica nao esta disponivel neste navegador. Use Google Chrome ou Microsoft Edge.');
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'pt-BR';
    recognition.onresult = (event) => {
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const text = result?.[0]?.transcript || '';
        if (result?.isFinal && text.trim()) {
          addTranscriptLine({ speaker: userName, text });
        }
      }
    };
    recognition.onerror = () => {
      setIsTranscriptionEnabled(false);
    };
    recognition.onend = () => {
      if (!isClosingRef.current && recognitionRef.current === recognition) {
        try {
          recognition.start();
        } catch {
          setIsTranscriptionEnabled(false);
        }
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setIsTranscriptionEnabled(true);
    } catch {
      setIsTranscriptionEnabled(false);
    }
  }, [addTranscriptLine, userName]);

  const stopSpeechRecognition = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsTranscriptionEnabled(false);
  }, []);

  const maybeCreateOffer = useCallback(async () => {
    const pc = peerConnectionRef.current;
    const remotePeerId = remotePeerIdRef.current;
    if (!pc || !remotePeerId || hasCreatedOfferRef.current) return;

    const shouldCreateOffer = clientIdRef.current < remotePeerId;
    if (!shouldCreateOffer) return;

    hasCreatedOfferRef.current = true;
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    sendSignal({ type: 'offer', to: remotePeerId, data: pc.localDescription });
  }, [sendSignal]);

  const handleSignal = useCallback(async (payload: SignalPayload) => {
    if (!payload || payload.roomName !== roomName || payload.from === clientIdRef.current) return;
    if (payload.to && payload.to !== clientIdRef.current) return;

    const pc = peerConnectionRef.current;
    if (!pc) return;

    if (payload.type === 'hello' || payload.type === 'hello-ack') {
      remotePeerIdRef.current = payload.from;
      setConnectionState((state) => state === 'initializing' ? 'waiting' : state);
      if (payload.type === 'hello') {
        sendSignal({ type: 'hello-ack', to: payload.from });
      }
      await maybeCreateOffer();
      return;
    }

    if (payload.type === 'offer') {
      remotePeerIdRef.current = payload.from;
      await pc.setRemoteDescription(payload.data as RTCSessionDescriptionInit);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      sendSignal({ type: 'answer', to: payload.from, data: pc.localDescription });
      return;
    }

    if (payload.type === 'answer') {
      await pc.setRemoteDescription(payload.data as RTCSessionDescriptionInit);
      return;
    }

    if (payload.type === 'candidate' && payload.data) {
      try {
        await pc.addIceCandidate(payload.data as RTCIceCandidateInit);
      } catch (error) {
        console.warn('Erro ao adicionar candidato ICE:', error);
      }
      return;
    }

    if (payload.type === 'leave') {
      setConnectionState('waiting');
      return;
    }

    if (payload.type === 'transcript-line' && payload.data && typeof payload.data === 'object') {
      const line = payload.data as TranscriptLine;
      addTranscriptLine({ speaker: line.speaker, text: line.text, id: line.id, createdAt: line.createdAt }, false);
    }
  }, [addTranscriptLine, maybeCreateOffer, roomName, sendSignal]);

  const finalizeAndClose = useCallback(async () => {
    const currentTranscript = buildTranscriptText(transcriptLinesRef.current);
    isClosingRef.current = true;
    sendSignal({ type: 'leave' });
    stopSpeechRecognition();

    if (!enableAiReport || !interviewId || currentTranscript.trim().length < 20) {
      onCloseRef.current();
      return;
    }

    setIsFinalizing(true);

    try {
      const result = await finalizeInterviewTranscript({
        interviewId,
        transcript: currentTranscript,
        companyName: userName,
      });

      setFinalizedResult({
        transcript: currentTranscript,
        reportText: result?.reportText,
      });
    } catch (error) {
      console.error('Erro ao finalizar transcricao da entrevista:', error);
      alert('A transcricao foi capturada, mas nao foi possivel gerar o relatorio de IA agora. Tente novamente depois.');
      onCloseRef.current();
    } finally {
      setIsFinalizing(false);
    }
  }, [enableAiReport, interviewId, sendSignal, stopSpeechRecognition, userName]);

  useEffect(() => {
    let isCancelled = false;

    const initRoom = async () => {
      setLoading(true);
      setConnectionState('initializing');
      setErrorMessage(null);
      isClosingRef.current = false;

      try {
        const localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        if (isCancelled) {
          localStream.getTracks().forEach((track) => track.stop());
          return;
        }

        localStreamRef.current = localStream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        const remoteStream = new MediaStream();
        remoteStreamRef.current = remoteStream;
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }

        const pc = new RTCPeerConnection({
          iceServers: ICE_SERVERS,
          iceCandidatePoolSize: 10,
        });
        peerConnectionRef.current = pc;

        localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            sendSignal({ type: 'candidate', to: remotePeerIdRef.current || undefined, data: event.candidate.toJSON() });
          }
        };

        pc.ontrack = (event) => {
          event.streams[0]?.getTracks().forEach((track) => {
            if (!remoteStream.getTracks().some((existingTrack) => existingTrack.id === track.id)) {
              remoteStream.addTrack(track);
            }
          });
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        };

        pc.onconnectionstatechange = () => {
          const state = pc.connectionState;
          setConnectionState(state === 'new' ? 'waiting' : state);
        };

        const channel = supabase.channel(`interview-room:${roomName}`, {
          config: { broadcast: { self: false } },
        });
        channelRef.current = channel;

        channel.on('broadcast', { event: 'signal' }, ({ payload }) => {
          void handleSignal(payload as SignalPayload);
        });

        channel.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setConnectionState('waiting');
            sendSignal({ type: 'hello' });
          }
        });

        setLoading(false);
      } catch (error) {
        console.error('Erro ao iniciar sala propria:', error);
        setLoading(false);
        setConnectionState('failed');
        setErrorMessage(error instanceof Error ? error.message : 'Nao foi possivel acessar camera e microfone.');
      }
    };

    void initRoom();

    return () => {
      isCancelled = true;
      isClosingRef.current = true;
      stopSpeechRecognition();
      sendSignal({ type: 'leave' });
      peerConnectionRef.current?.close();
      peerConnectionRef.current = null;
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      remoteStreamRef.current = null;
      if (channelRef.current) {
        void supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [handleSignal, roomName, sendSignal, stopSpeechRecognition]);

  const toggleMic = () => {
    const audioTracks = localStreamRef.current?.getAudioTracks() || [];
    const nextState = !isMicEnabled;
    audioTracks.forEach((track) => { track.enabled = nextState; });
    setIsMicEnabled(nextState);
  };

  const toggleCamera = () => {
    const videoTracks = localStreamRef.current?.getVideoTracks() || [];
    const nextState = !isCameraEnabled;
    videoTracks.forEach((track) => { track.enabled = nextState; });
    setIsCameraEnabled(nextState);
  };

  const toggleTranscription = () => {
    if (isTranscriptionEnabled) {
      stopSpeechRecognition();
      return;
    }
    startSpeechRecognition();
  };

  if (finalizedResult) {
    return (
      <div className="company-dashboard-surface fixed inset-0 z-[220] overflow-y-auto bg-[#fbf9ff] p-6 text-left">
        <div className="mx-auto max-w-5xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[12px] font-semibold text-[#940dff]">Entrevista finalizada</p>
              <h2 className="text-[20px] font-semibold tracking-tight text-[#343241]">Transcricao e relatorio da entrevista</h2>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(`${finalizedResult.transcript}\n\n${finalizedResult.reportText || ''}`)}
                className="flex h-8 items-center gap-2 rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12"
              >
                <Copy size={14} /> Copiar
              </button>
              <button
                type="button"
                onClick={() => onCloseRef.current()}
                className="h-8 rounded-xl bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95"
              >
                Fechar
              </button>
            </div>
          </div>

          <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <article className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f3e5ff] text-[#940dff]"><FileText size={18} /></span>
                <h3 className="text-[18px] font-semibold text-[#343241]">Transcricao</h3>
              </div>
              <pre className="max-h-[65vh] whitespace-pre-wrap rounded-2xl bg-[#fbf9ff] p-4 text-[12px] font-medium leading-6 text-slate-500">{finalizedResult.transcript}</pre>
            </article>

            <article className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#63e1a5]/14 text-[#40b87f]"><Sparkles size={18} /></span>
                <h3 className="text-[18px] font-semibold text-[#343241]">Relatorio IA</h3>
              </div>
              <pre className="max-h-[65vh] whitespace-pre-wrap rounded-2xl bg-[#fbf9ff] p-4 text-[12px] font-medium leading-6 text-slate-500">{finalizedResult.reportText || 'Relatorio nao disponivel.'}</pre>
            </article>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-[#0b1020] font-sans">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#111827] px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#940dff]/16 text-[#b45cff]">
            <Video size={18} />
          </div>
          <div className="min-w-0 text-left">
            <h4 className="truncate text-sm font-semibold text-white">Sala de entrevista Colaborh</h4>
            <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-slate-400">Sala: {roomName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-xl bg-white/8 px-3 py-2 text-[11px] font-semibold text-slate-300 sm:inline-flex">{connectionLabel}</span>
          <button
            type="button"
            onClick={toggleTranscription}
            className={`flex h-9 items-center gap-2 rounded-xl px-3 text-[12px] font-semibold transition-all active:scale-95 ${isTranscriptionEnabled ? 'bg-[#63e1a5]/16 text-[#63e1a5]' : 'bg-white/10 text-slate-300 hover:bg-white/15'}`}
          >
            <Bot size={14} />
            <span className="hidden sm:inline">{isTranscriptionEnabled ? 'Transcricao ativa' : 'Transcrever'}</span>
          </button>
          <button
            type="button"
            onClick={() => void finalizeAndClose()}
            disabled={isFinalizing}
            className="flex h-9 items-center gap-2 rounded-xl border-0 bg-[#ff4b8c]/16 px-3 text-[12px] font-semibold text-[#ff4b8c] shadow-sm transition-all hover:bg-[#ff4b8c]/24 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isFinalizing ? <RotateCw size={14} className="animate-spin" /> : <PhoneOff size={14} />}
            <span className="hidden sm:inline">{isFinalizing ? 'Gerando relatorio...' : 'Sair'}</span>
          </button>
        </div>
      </div>

      {transcriptLines.length > 0 && (
        <div className="border-b border-white/10 bg-[#111827]/95 px-4 py-2 text-left text-[12px] font-medium text-slate-300 sm:px-6">
          <span className="font-semibold text-[#63e1a5]">Transcricao:</span> {transcriptLines[transcriptLines.length - 1]?.speaker}: {transcriptLines[transcriptLines.length - 1]?.text}
        </div>
      )}

      <div className="relative flex flex-1 flex-col gap-4 overflow-hidden p-4 lg:p-6">
        {(loading || errorMessage) && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[#0b1020]/96 px-6 text-center text-slate-300">
            {loading ? (
              <>
                <RotateCw size={24} className="animate-spin text-[#940dff]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Preparando sala de video...</span>
              </>
            ) : (
              <>
                <Video size={24} className="text-[#ff4b8c]" />
                <span className="max-w-sm text-sm font-semibold text-white">{errorMessage}</span>
              </>
            )}
          </div>
        )}

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
          <section className="relative min-h-[320px] overflow-hidden rounded-[24px] border border-white/10 bg-black shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
            <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full bg-black object-cover" />
            {connectionState !== 'connected' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/70 text-center">
                <Video size={28} className="text-[#940dff]" />
                <p className="text-sm font-semibold text-white">{connectionLabel}</p>
                <p className="max-w-xs text-[12px] font-medium leading-5 text-slate-400">A chamada inicia assim que o outro participante entra nesta sala.</p>
              </div>
            )}
          </section>

          <aside className="flex min-h-0 flex-col gap-4">
            <div className="relative h-48 overflow-hidden rounded-[20px] border border-white/10 bg-slate-900 shadow-[0_14px_40px_rgba(0,0,0,0.2)] lg:h-56">
              <video ref={localVideoRef} autoPlay muted playsInline className="h-full w-full bg-slate-900 object-cover" />
              <div className="absolute bottom-3 left-3 rounded-xl bg-black/45 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur">Voce</div>
            </div>

            <div className="rounded-[20px] border border-white/10 bg-white/6 p-4 text-left text-slate-300">
              <p className="text-[12px] font-semibold text-slate-400">Status da sala</p>
              <p className="mt-2 text-[18px] font-semibold text-white">{connectionLabel}</p>
              <p className="mt-2 text-[12px] font-medium leading-5 text-slate-400">Sala propria Colaborh via WebRTC, com suporte a STUN/TURN configuravel.</p>
            </div>
          </aside>
        </div>

        <div className="mx-auto flex shrink-0 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/8 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <button
            type="button"
            onClick={toggleMic}
            className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all active:scale-95 ${isMicEnabled ? 'bg-white/12 text-white hover:bg-white/18' : 'bg-[#ff4b8c] text-white'}`}
            aria-label={isMicEnabled ? 'Desativar microfone' : 'Ativar microfone'}
          >
            {isMicEnabled ? <Mic size={18} /> : <MicOff size={18} />}
          </button>
          <button
            type="button"
            onClick={toggleCamera}
            className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all active:scale-95 ${isCameraEnabled ? 'bg-white/12 text-white hover:bg-white/18' : 'bg-[#ff4b8c] text-white'}`}
            aria-label={isCameraEnabled ? 'Desativar camera' : 'Ativar camera'}
          >
            {isCameraEnabled ? <Video size={18} /> : <VideoOff size={18} />}
          </button>
          <button
            type="button"
            onClick={() => void finalizeAndClose()}
            disabled={isFinalizing}
            className="flex h-11 items-center gap-2 rounded-xl bg-[#ff4b8c] px-5 text-[13px] font-semibold text-white shadow-[0_14px_30px_rgba(255,75,140,0.26)] transition-all hover:bg-[#ec3478] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isFinalizing ? <RotateCw size={16} className="animate-spin" /> : <PhoneOff size={16} />}
            Encerrar
          </button>
        </div>
      </div>
    </div>
  );
};
