const loaderDots = Array.from({ length: 3 }, (_, index) => index);

export function LoadingAnimation({
  message = 'Carregando...',
  compact = false,
}: {
  message?: string;
  compact?: boolean;
}) {
  const wrapperClass = compact ? 'h-9 w-16' : 'h-12 w-20';
  const dotSizeClass = compact ? 'h-2 w-2' : 'h-3 w-3';

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <style>{`
        @keyframes colaborhLoaderBounce {
          0%, 100% {
            opacity: 0.42;
            transform: translateY(0) scale(0.82);
          }

          46% {
            opacity: 1;
            transform: translateY(-10px) scale(1);
          }

          72% {
            opacity: 0.68;
            transform: translateY(0) scale(0.9);
          }
        }

        .colaborh-loader-dot {
          animation: colaborhLoaderBounce 0.689s cubic-bezier(0.534, 0, 0.465, 1) infinite;
          background: #940dff;
          box-shadow: 0 8px 20px rgba(148, 13, 255, 0.2);
        }
      `}</style>

      <div
        className={`relative flex ${wrapperClass} items-center justify-center gap-2`}
        role="status"
        aria-label={message || 'Carregando'}
      >
        <div className="absolute inset-x-2 top-1/2 h-8 -translate-y-1/2 rounded-full bg-[#940dff]/10 blur-xl" />
        {loaderDots.map((index) => (
          <span
            key={index}
            className={`colaborh-loader-dot relative block ${dotSizeClass} rounded-full`}
            style={{ animationDelay: `${index * 0.115}s` }}
          />
        ))}
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
