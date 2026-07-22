export function LoadingAnimation({
  message = 'Carregando...',
  compact = false,
}: {
  message?: string;
  compact?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <video
        src="/loading.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={`${compact ? 'h-16 w-16' : 'h-24 w-24 md:h-28 md:w-28'} object-contain`}
      />
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
