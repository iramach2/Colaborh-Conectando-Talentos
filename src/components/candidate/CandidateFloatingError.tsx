import { X } from 'lucide-react';

interface CandidateFloatingErrorProps {
  message: string | null;
}

export function CandidateFloatingError({ message }: CandidateFloatingErrorProps) {
  if (!message) return null;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-4 bg-red-600 text-white rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
      <X size={20} className="shrink-0" />
      <span className="font-bold text-sm">{message}</span>
    </div>
  );
}
