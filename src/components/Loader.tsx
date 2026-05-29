import React from 'react';

export default function Loader({ 
  message = 'Carregando...', 
  fullScreen = false 
}: { 
  message?: string; 
  fullScreen?: boolean;
}) {
  const content = (
    <div className="flex flex-col items-center justify-center scale-75 md:scale-90">
      <div className="loader-container">
        <div className="center-dot"></div>
        <div className="rotating-c"></div>
      </div>
      {message && (
        <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px] animate-pulse text-center">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1a1a1a]">
        {content}
      </div>
    );
  }

  return (
    <div className="py-12 flex items-center justify-center w-full">
      {content}
    </div>
  );
}
