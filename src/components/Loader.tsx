import { useState } from 'react';

const loaderDots = Array.from({ length: 8 }, (_, index) => index);

export function LoadingAnimation({
  message = 'Carregando...',
  compact = false,
}: {
  message?: string;
  compact?: boolean;
}) {
  const [useFallback, setUseFallback] = useState(false);
  const sizeClass = compact ? 'h-14 w-14' : 'h-20 w-20 md:h-24 md:w-24';
  const dotSizeClass = compact ? 'h-2 w-2' : 'h-2.5 w-2.5 md:h-3 md:w-3';
  const ringSizeClass = compact ? 'h-10 w-10' : 'h-14 w-14 md:h-16 md:w-16';

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <style>{`
        @keyframes colaborhLoaderSpin {
          0% { transform: rotate(-10deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes colaborhLoaderPulse {
          0%, 100% { opacity: 0.24; transform: scale(0.76); }
          45% { opacity: 1; transform: scale(1.18); }
          72% { opacity: 0.46; transform: scale(0.92); }
        }

        .colaborh-loader-ring {
          animation: colaborhLoaderSpin 0.95s linear infinite;
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
          box-shadow: 0 8px 22px rgba(148, 13, 255, 0.24);
          transform-origin: 50% 50%;
          animation: colaborhLoaderPulse 0.95s ease-in-out infinite;
        }

        .colaborh-loader-video {
          display: block;
          height: 100%;
          width: 100%;
          object-fit: contain;
          filter: hue-rotate(118deg) saturate(3.2) brightness(1.08) contrast(1.12) drop-shadow(0 10px 24px rgba(148, 13, 255, 0.22));
        }
      `}</style>

      <div
        className={`relative ${sizeClass}`}
        role="status"
        aria-label={message || 'Carregando'}
      >
        {!useFallback ? (
          <video
            className="colaborh-loader-video"
            src="/colaborh-loading.mp4"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            onError={() => setUseFallback(true)}
          />
        ) : (
          <>
            <div className="absolute inset-0 rounded-full bg-[#940dff]/10 blur-xl" />
            <div className={`colaborh-loader-ring absolute left-1/2 top-1/2 ${ringSizeClass} -translate-x-1/2 -translate-y-1/2`}>
              {loaderDots.map((index) => {
                const angle = index * 45;
                const radius = compact ? 19 : 28;

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
                      style={{ animationDelay: `${index * 0.06}s` }}
                    />
                  </span>
                );
              })}
            </div>
          </>
        )}
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
