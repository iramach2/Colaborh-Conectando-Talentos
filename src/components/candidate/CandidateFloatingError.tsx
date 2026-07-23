import { X } from 'lucide-react';

interface CandidateFloatingErrorProps {
  message: string | null;
}

export function CandidateFloatingError({ message }: CandidateFloatingErrorProps) {
  if (!message) return null;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] max-h-[40vh] w-[min(92vw,720px)] overflow-y-auto px-6 py-4 bg-red-600 text-white rounded-2xl shadow-2xl flex items-start gap-3">
      <X size={20} className="shrink-0" />
      <span className="min-w-0 whitespace-normal break-words text-sm font-bold leading-relaxed">{message}</span>
    </div>
  );
}

