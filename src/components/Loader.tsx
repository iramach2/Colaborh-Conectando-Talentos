export function LoadingAnimation({
  message = 'Carregando...',
  compact = false,
}: {
  message?: string;
  compact?: boolean;
}) {
  const sizeClass = compact ? 'h-14 w-14' : 'h-20 w-20 md:h-24 md:w-24';
  const centerSizeClass = compact ? 'h-4 w-4' : 'h-6 w-6';

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className={`relative ${sizeClass}`} role="status" aria-label={message || 'Carregando'}>
        <div className="absolute inset-0 rounded-full border-[10px] border-[#f3e5ff]" />
        <div className="absolute inset-0 animate-spin rounded-full border-[10px] border-transparent border-l-[#940dff] border-b-[#533af6] [animation-duration:1.05s]" />
        <div className="absolute inset-[22%] rounded-full bg-[#fbf9ff] shadow-[inset_0_0_0_1px_rgba(148,13,255,0.08)]" />
        <div className={`absolute left-1/2 top-1/2 ${centerSizeClass} -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-[#533af6] shadow-[0_0_22px_rgba(83,58,246,0.35)]`} />
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
