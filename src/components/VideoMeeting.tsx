import React, { useEffect, useRef, useState } from 'react';
import { Video, PhoneOff, RotateCw } from 'lucide-react';

interface VideoMeetingProps {
  roomName: string;
  userName: string;
  onClose: () => void;
}

export const VideoMeeting = ({ roomName, userName, onClose }: VideoMeetingProps) => {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);

  useEffect(() => {
    const scriptId = 'jitsi-external-api-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initJitsi = () => {
      if (!containerRef.current) return;
      setLoading(false);

      try {
        const domain = 'meet.jit.si';
        const options = {
          roomName: roomName,
          width: '100%',
          height: '100%',
          parentNode: containerRef.current,
          userInfo: {
            displayName: userName
          },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            prejoinPageEnabled: false,
            disableDeepLinking: true,
            toolbarButtons: [
              'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
              'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
              'sharedvideo', 'settings', 'raisehand',
              'videoquality', 'filmstrip', 'tileview', 'videobackgroundblur'
            ]
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_BRAND_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            DEFAULT_BACKGROUND: '#0f172a'
          }
        };

        const api = new (window as any).JitsiMeetExternalAPI(domain, options);
        apiRef.current = api;

        api.addEventListener('readyToClose', () => {
          onClose();
        });

        api.addEventListener('videoConferenceLeft', () => {
          onClose();
        });
      } catch (err) {
        console.error('Erro ao inicializar Jitsi:', err);
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = () => {
        initJitsi();
      };
      document.body.appendChild(script);
    } else {
      if ((window as any).JitsiMeetExternalAPI) {
        initJitsi();
      } else {
        script.onload = () => initJitsi();
      }
    }

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
      }
    };
  }, [roomName, userName, onClose]);

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col font-sans">
      {/* Top Header da Sala */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#533af6]/10 flex items-center justify-center text-[#533af6]">
            <Video size={18} />
          </div>
          <div className="text-left">
            <h4 className="text-white text-sm font-bold">Sala de Entrevista Online</h4>
            <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Sala: {roomName}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 px-4 py-2 bg-rose-600/15 hover:bg-rose-600/25 text-rose-500 rounded-full text-xs font-bold transition-all cursor-pointer border-0 outline-none shadow-sm"
        >
          <PhoneOff size={14} className="stroke-[2.5]" />
          <span>Sair da Chamada</span>
        </button>
      </div>

      {/* Container de Vídeo */}
      <div className="flex-1 relative bg-[#0f172a]">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0f172a] text-slate-300 z-10">
            <RotateCw size={24} className="animate-spin text-[#533af6]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Conectando à sala de vídeo...</span>
          </div>
        )}
        <div ref={containerRef} className="w-full h-full" id="jitsi-container" />
      </div>
    </div>
  );
};
