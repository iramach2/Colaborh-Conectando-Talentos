import React from 'react';
import { Loader2 } from 'lucide-react';

interface CandidateComingSoonPanelProps {
  activeTab: string;
}

export function CandidateComingSoonPanel({ activeTab }: CandidateComingSoonPanelProps) {
  return (
    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] shadow-sleek relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-600 to-indigo-600" />
      <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-10">
        <Loader2 size={40} className="text-primary-600 animate-spin" />
      </div>
      <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Módulo em Desenvolvimento</h2>
      <p className="text-slate-500 font-medium max-w-sm text-center px-10">Estamos preparando a melhor experiência para você gerenciar suas {activeTab}.</p>
    </div>
  );
}
