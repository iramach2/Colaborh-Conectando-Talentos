import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Copy, FileText, PhoneOff, RotateCw, Sparkles, Video } from 'lucide-react';
import { finalizeInterviewTranscript } from '../services/interviewAiService';

interface VideoMeetingProps {
  interviewId?: string;
  enableAiReport?: boolean;
  roomName: string;
  userName: string;
  onClose: () => void;
}

type JitsiMeetExternalApi = {
  addEventListener: (eventName: string, callback: (payload?: unknown) => void) => void;
  executeCommand?: (command: string, ...args: unknown[]) => void;
  dispose: () => void;
};

type JitsiMeetExternalApiConstructor = new (
  domain: string,
  options: Record<string, unknown>
) => JitsiMeetExternalApi;

type WindowWithJitsi = Window & {
  JitsiMeetExternalAPI?: JitsiMeetExternalApiConstructor;
};

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

const JITSI_SCRIPT_ID = 'jitsi-external-api-script';
const JITSI_DOMAIN = 'meet.jit.si';

const loadJitsiScript = () => new Promise<void>((resolve, reject) => {
  if ((window as WindowWithJitsi).JitsiMeetExternalAPI) {
    resolve();
    return;
  }

  let script = document.getElementById(JITSI_SCRIPT_ID) as HTMLScriptElement | null;

  const handleLoad = () => resolve();
  const handleError = () => reject(new Error('Não foi possível carregar a API do Jitsi.'));

  if (!script) {
    script = document.createElement('script');
    script.id = JITSI_SCRIPT_ID;
    script.src = `https://${JITSI_DOMAIN}/external_api.js`;
    script.async = true;
    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', handleError, { once: true });
    document.body.appendChild(script);
    return;
  }

  script.addEventListener('load', handleLoad, { once: true });
  script.addEventListener('error', handleError, { once: true });
});

const getPayloadValue = (payload: unknown, keys: string[]) => {
  if (!payload || typeof payload !== 'object') return '';
  const record = payload as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (value && typeof value === 'object') {
      const nested = value as Record<string, unknown>;
      const nestedText = firstString(nested.name, nested.displayName, nested.text, nested.transcript);
      if (nestedText) return nestedText;
    }
  }

  return '';
};

const firstString = (...values: unknown[]) => {
  const found = values.find((value) => typeof value === 'string' && value.trim().length > 0);
  return typeof found === 'string' ? found.trim() : '';
};

const buildTranscriptText = (lines: TranscriptLine[]) => lines
  .map((line) => `[${new Date(line.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}] ${line.speaker}: ${line.text}`)
  .join('\n');

const buildLineId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const VideoMeeting = ({ interviewId, enableAiReport = false, roomName, userName, onClose }: VideoMeetingProps) => {
  const [loading, setLoading] = useState(true);
  const [isTranscriptionEnabled, setIsTranscriptionEnabled] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transcriptLines, setTranscriptLines] = useState<TranscriptLine[]>([]);
  const [finalizedResult, setFinalizedResult] = useState<FinalizedResult | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<JitsiMeetExternalApi | null>(null);
  const onCloseRef = useRef(onClose);
  const transcriptLinesRef = useRef<TranscriptLine[]>([]);

  const transcriptText = useMemo(() => buildTranscriptText(transcriptLines), [transcriptLines]);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    transcriptLinesRef.current = transcriptLines;
  }, [transcriptLines]);

  const addTranscriptLine = (payload: unknown) => {
    const text = getPayloadValue(payload, ['text', 'transcript', 'message', 'final', 'stableText', 'unstableText']);
    if (!text) return;

    const speaker = getPayloadValue(payload, ['participantName', 'speaker', 'name', 'displayName', 'participant']) || 'Participante';
    const lastLine = transcriptLinesRef.current[transcriptLinesRef.current.length - 1];

    if (lastLine?.speaker === speaker && lastLine.text === text) return;

    const newLine: TranscriptLine = {
      id: buildLineId(),
      speaker,
      text,
      createdAt: new Date().toISOString(),
    };

    setTranscriptLines((previous) => [...previous, newLine]);
  };

  const toggleTranscription = () => {
    const api = apiRef.current;
    if (!api?.executeCommand) {
      alert('A transcrição automática não está disponível nesta sala.');
      return;
    }

    try {
      api.executeCommand('toggleSubtitles');
      setIsTranscriptionEnabled((previous) => !previous);
    } catch (error) {
      console.error('Erro ao alternar transcrição:', error);
      alert('Não foi possível ativar a transcrição automática nesta sala.');
    }
  };

  const finalizeAndClose = async () => {
    const currentTranscript = buildTranscriptText(transcriptLinesRef.current);

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
      console.error('Erro ao finalizar transcrição da entrevista:', error);
      alert('A transcrição foi capturada, mas não foi possível gerar o relatório de IA agora. Tente novamente depois.');
      onCloseRef.current();
    } finally {
      setIsFinalizing(false);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    const initJitsi = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        await loadJitsiScript();

        if (isCancelled || !containerRef.current) return;

        const JitsiMeetExternalAPI = (window as WindowWithJitsi).JitsiMeetExternalAPI;
        if (!JitsiMeetExternalAPI) {
          throw new Error('API do Jitsi indisponível.');
        }

        if (apiRef.current) {
          apiRef.current.dispose();
          apiRef.current = null;
        }

        containerRef.current.replaceChildren();

        const api = new JitsiMeetExternalAPI(JITSI_DOMAIN, {
          roomName,
          width: '100%',
          height: '100%',
          parentNode: containerRef.current,
          userInfo: {
            displayName: userName,
          },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            prejoinPageEnabled: false,
            disableDeepLinking: true,
            disableThirdPartyRequests: true,
            toolbarButtons: [
              'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
              'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
              'sharedvideo', 'settings', 'raisehand',
              'videoquality', 'filmstrip', 'tileview', 'videobackgroundblur',
            ],
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_BRAND_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            DEFAULT_BACKGROUND: '#0f172a',
          },
        });

        apiRef.current = api;
        setLoading(false);

        const closeMeeting = () => {
          void finalizeAndClose();
        };

        api.addEventListener('readyToClose', closeMeeting);
        api.addEventListener('videoConferenceLeft', closeMeeting);
        api.addEventListener('transcriptionChunkReceived', addTranscriptLine);
        api.addEventListener('transcriptionReceived', addTranscriptLine);
        api.addEventListener('subtitlesReceived', addTranscriptLine);
        api.addEventListener('transcribingStatusChanged', (payload) => {
          const status = getPayloadValue(payload, ['status', 'state']);
          const isOn = typeof payload === 'object' && payload !== null && Boolean((payload as Record<string, unknown>).on);
          setIsTranscriptionEnabled(isOn || status === 'on' || status === 'started');
        });
      } catch (error) {
        console.error('Erro ao inicializar Jitsi:', error);
        if (!isCancelled) {
          setLoading(false);
          setErrorMessage(error instanceof Error ? error.message : 'Não foi possível iniciar a chamada de vídeo.');
        }
      }
    };

    void initJitsi();

    return () => {
      isCancelled = true;
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
      containerRef.current?.replaceChildren();
    };
  }, [roomName, userName]);

  if (finalizedResult) {
    return (
      <div className="company-dashboard-surface fixed inset-0 z-[220] overflow-y-auto bg-[#fbf9ff] p-6 text-left">
        <div className="mx-auto max-w-5xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[12px] font-semibold text-[#940dff]">Entrevista finalizada</p>
              <h2 className="text-[20px] font-semibold tracking-tight text-[#343241]">Transcrição e relatório da entrevista</h2>
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
                <h3 className="text-[18px] font-semibold text-[#343241]">Transcrição</h3>
              </div>
              <pre className="max-h-[65vh] whitespace-pre-wrap rounded-2xl bg-[#fbf9ff] p-4 text-[12px] font-medium leading-6 text-slate-500">{finalizedResult.transcript}</pre>
            </article>

            <article className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#63e1a5]/14 text-[#40b87f]"><Sparkles size={18} /></span>
                <h3 className="text-[18px] font-semibold text-[#343241]">Relatório IA</h3>
              </div>
              <pre className="max-h-[65vh] whitespace-pre-wrap rounded-2xl bg-[#fbf9ff] p-4 text-[12px] font-medium leading-6 text-slate-500">{finalizedResult.reportText || 'Relatório não disponível.'}</pre>
            </article>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-slate-950 font-sans">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#533af6]/10 text-[#533af6]">
            <Video size={18} />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-bold text-white">Sala de entrevista online</h4>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Sala: {roomName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {enableAiReport && (
            <button
              type="button"
              onClick={toggleTranscription}
              className={`flex h-8 items-center gap-2 rounded-xl px-4 text-[12px] font-semibold transition-all active:scale-95 ${isTranscriptionEnabled ? 'bg-[#63e1a5]/16 text-[#40b87f]' : 'bg-white/10 text-slate-300 hover:bg-white/15'}`}
            >
              <Bot size={14} />
              {isTranscriptionEnabled ? 'Transcrição ativa' : 'Ativar transcrição'}
            </button>
          )}
          <button
            type="button"
            onClick={() => void finalizeAndClose()}
            disabled={isFinalizing}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border-0 bg-rose-600/15 px-4 py-2 text-xs font-bold text-rose-500 shadow-sm outline-none transition-all hover:bg-rose-600/25 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isFinalizing ? <RotateCw size={14} className="animate-spin" /> : <PhoneOff size={14} className="stroke-[2.5]" />}
            <span>{isFinalizing ? 'Gerando relatório...' : 'Sair da chamada'}</span>
          </button>
        </div>
      </div>

      {enableAiReport && transcriptLines.length > 0 && (
        <div className="border-b border-slate-800 bg-slate-900/90 px-6 py-2 text-left text-[12px] font-medium text-slate-300">
          <span className="font-semibold text-[#63e1a5]">Transcrição IA:</span> {transcriptLines[transcriptLines.length - 1]?.speaker}: {transcriptLines[transcriptLines.length - 1]?.text}
        </div>
      )}

      <div className="relative flex-1 bg-[#0f172a]">
        {(loading || errorMessage) && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#0f172a] px-6 text-center text-slate-300">
            {loading ? (
              <>
                <RotateCw size={24} className="animate-spin text-[#533af6]" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Conectando à sala de vídeo...</span>
              </>
            ) : (
              <>
                <Video size={24} className="text-[#ff4b8c]" />
                <span className="max-w-sm text-sm font-semibold text-white">{errorMessage}</span>
              </>
            )}
          </div>
        )}
        <div ref={containerRef} className="h-full w-full" />
      </div>
    </div>
  );
};