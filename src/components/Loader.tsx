const loaderDots = Array.from({ length: 6 }, (_, index) => index);

export function LoadingAnimation({
  message = 'Carregando...',
  compact = false,
}: {
  message?: string;
  compact?: boolean;
}) {
  const sizeClass = compact ? 'h-14 w-14' : 'h-20 w-20 md:h-24 md:w-24';
  const dotSizeClass = compact ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5 md:h-4 md:w-4';
  const ringSizeClass = compact ? 'h-11 w-11' : 'h-16 w-16 md:h-20 md:w-20';

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <style>{`
        @keyframes colaborhLoaderSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes colaborhLoaderPulse {
          0%, 100% { opacity: 0.18; transform: scale(0.72); }
          42% { opacity: 1; transform: scale(1.08); }
          68% { opacity: 0.48; transform: scale(0.9); }
        }

        .colaborh-loader-ring {
          animation: colaborhLoaderSpin 1.05s linear infinite;
          transform-origin: 50% 50%;
        }

        .colaborh-loader-dot-position {
          position: absolute;
          left: 50%;
          top: 50%;
          transform-origin: 50% 50%;
        }

        .colaborh-loader-dot {
          display: block;
          border-radius: 9999px;
          background: #940dff;
          box-shadow: 0 8px 24px rgba(148, 13, 255, 0.22);
          transform-origin: 50% 50%;
          animation: colaborhLoaderPulse 1.05s ease-in-out infinite;
        }
      `}</style>

      <div
        className={`relative ${sizeClass}`}
        role="status"
        aria-label={message || 'Carregando'}
      >
        <div className="absolute inset-0 rounded-full bg-[#940dff]/10 blur-xl" />
        <div className={`colaborh-loader-ring absolute left-1/2 top-1/2 ${ringSizeClass} -translate-x-1/2 -translate-y-1/2`}>
          {loaderDots.map((index) => {
            const angle = index * 60;
            const radius = compact ? 20 : 30;

            return (
              <span
                key={index}
                className="colaborh-loader-dot-position"
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px)`,
                }}
              >
                <span
                  className={`colaborh-loader-dot ${dotSizeClass}`}
                  style={{ animationDelay: `${index * 0.08}s` }}
                />
              </span>
            );
          })}
        </div>
        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#940dff] shadow-[0_0_0_7px_rgba(148,13,255,0.08)] md:h-4 md:w-4" />
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
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
