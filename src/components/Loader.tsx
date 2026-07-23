const loaderDots = [
  { className: 'colaborh-loader-dot colaborh-loader-dot-top', color: '#940dff' },
  { className: 'colaborh-loader-dot colaborh-loader-dot-right', color: '#533af6' },
  { className: 'colaborh-loader-dot colaborh-loader-dot-bottom', color: '#ff4b8c' },
  { className: 'colaborh-loader-dot colaborh-loader-dot-left', color: '#63e1a5' },
];

export function LoadingAnimation({
  message = 'Carregando...',
  compact = false,
}: {
  message?: string;
  compact?: boolean;
}) {
  const sizeClass = compact ? 'h-14 w-14' : 'h-20 w-20 md:h-24 md:w-24';
  const dotSizeClass = compact ? 'h-3 w-3' : 'h-4 w-4 md:h-5 md:w-5';

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <style>{`
        @keyframes colaborhLoaderOrbit {
          0%, 100% { transform: rotate(0deg) scale(0.78); opacity: 0.72; }
          8% { transform: rotate(0deg) scale(1); opacity: 1; }
          50% { transform: rotate(180deg) scale(1); opacity: 1; }
          92% { transform: rotate(360deg) scale(1); opacity: 1; }
          96% { transform: rotate(360deg) scale(0.78); opacity: 0.72; }
        }

        @keyframes colaborhLoaderTop {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          48%, 54% { transform: translate(-50%, -50%) translateY(-46%); }
        }

        @keyframes colaborhLoaderRight {
          0%, 100% { transform: translate(-50%, -50%) translateX(0); }
          48%, 54% { transform: translate(-50%, -50%) translateX(46%); }
        }

        @keyframes colaborhLoaderBottom {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          48%, 54% { transform: translate(-50%, -50%) translateY(46%); }
        }

        @keyframes colaborhLoaderLeft {
          0%, 100% { transform: translate(-50%, -50%) translateX(0); }
          48%, 54% { transform: translate(-50%, -50%) translateX(-46%); }
        }

        .colaborh-loader-orbit {
          animation: colaborhLoaderOrbit 1.75s cubic-bezier(.45, 0, .2, 1) infinite;
          transform-origin: 50% 50%;
        }

        .colaborh-loader-dot {
          position: absolute;
          left: 50%;
          top: 50%;
          border-radius: 9999px;
          box-shadow: 0 10px 28px rgba(148, 13, 255, 0.16);
        }

        .colaborh-loader-dot-top { animation: colaborhLoaderTop 1.75s cubic-bezier(.45, 0, .2, 1) infinite; }
        .colaborh-loader-dot-right { animation: colaborhLoaderRight 1.75s cubic-bezier(.45, 0, .2, 1) infinite; }
        .colaborh-loader-dot-bottom { animation: colaborhLoaderBottom 1.75s cubic-bezier(.45, 0, .2, 1) infinite; }
        .colaborh-loader-dot-left { animation: colaborhLoaderLeft 1.75s cubic-bezier(.45, 0, .2, 1) infinite; }
      `}</style>

      <div
        className={`relative ${sizeClass}`}
        role="status"
        aria-label={message || 'Carregando'}
      >
        <div className="absolute inset-0 rounded-full bg-[#f3e5ff]/70 blur-xl" />
        <div className="colaborh-loader-orbit absolute inset-0 rounded-full">
          {loaderDots.map((dot) => (
            <span
              key={dot.className}
              className={`${dot.className} ${dotSizeClass}`}
              style={{ backgroundColor: dot.color }}
            />
          ))}
        </div>
        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_5px_rgba(148,13,255,0.08),0_10px_28px_rgba(83,58,246,0.18)] md:h-4 md:w-4" />
      </div>

      {message && (
        <p className="mt-3 text-[12px] font-semibold text-slate-400">
          {message}
        </p>
      )}
    </div>
  );
}

export default function Loader({
  message = 'Carregando...',
  fullScreen = false,
}: {
  message?: string;
  fullScreen?: boolean;
}) {
  const content = <LoadingAnimation message={message} />;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fbf9ff]">
        {content}
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center py-12">
      {content}
    </div>
  );
}
