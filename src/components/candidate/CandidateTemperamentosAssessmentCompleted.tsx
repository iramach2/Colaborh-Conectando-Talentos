import { CheckCircle2 } from 'lucide-react';
import { TEMPERAMENTOS_PROFILES } from '../../data/assessmentProfiles';
import type { TemperamentosCompletedResult, TemperamentosResult } from '../../types/candidate';

interface CandidateTemperamentosAssessmentCompletedProps {
  temperamentosResult: TemperamentosResult | null;
  selectedTemperamentosResult: TemperamentosCompletedResult | null;
  onBackToTests: () => void;
}

export function CandidateTemperamentosAssessmentCompleted({
  temperamentosResult,
  selectedTemperamentosResult,
  onBackToTests,
}: CandidateTemperamentosAssessmentCompletedProps) {
  const result = temperamentosResult || selectedTemperamentosResult || { type: 'I', scores: { I: 0, C: 0, O: 0, A: 0 } };
  const profileType = result.type;
  const scores = result.scores || { I: 0, C: 0, O: 0, A: 0 };
  const profile = TEMPERAMENTOS_PROFILES[profileType] || TEMPERAMENTOS_PROFILES.I;

  const totalAnswers = scores.I + scores.C + scores.O + scores.A;
  const calcPercent = (val: number) => {
    if (totalAnswers === 0) return 0;
    return Math.round((val / totalAnswers) * 100);
  };

  const listProfiles = [
    { label: 'Idealista / Criativo (I)', val: scores.I, pct: calcPercent(scores.I), color: '#3b82f6' },
    { label: 'Comunicador / Relacional (C)', val: scores.C, pct: calcPercent(scores.C), color: '#ec4899' },
    { label: 'Organizador / Analítico (O)', val: scores.O, pct: calcPercent(scores.O), color: '#10b981' },
    { label: 'Executor / Dominante (A)', val: scores.A, pct: calcPercent(scores.A), color: '#ef4444' },
  ];

  return (
    <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-sleek border border-white max-w-4xl mx-auto space-y-8 text-left animate-fade-in">
      <div className="text-center">
        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Avaliação de Perfil Concluída!</h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Seu Relatório de Perfil Comportamental está pronto</p>
      </div>

      <div className="p-8 rounded-[2.5rem] border border-primary-100 bg-gradient-to-r from-primary-50/20 to-indigo-50/20 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-primary-600">Seu Estilo Predominante</span>
            <h3 className="text-3xl font-black tracking-tight mt-1 text-slate-900">{profile.name}</h3>
            <p className="text-sm font-extrabold text-indigo-600 mt-0.5">{profile.title}</p>
          </div>
          <span className="px-6 py-2 bg-white border border-primary-200 rounded-full text-xs font-black uppercase tracking-widest text-primary-700 shadow-2xs">
            {profileType}
          </span>
        </div>
        <div className="w-full h-px bg-slate-200/50" />
        <p className="text-xs font-semibold leading-relaxed text-slate-600">{profile.description}</p>
      </div>

      <div className="bg-slate-50/60 border border-slate-100 p-6 rounded-[2.5rem] space-y-6">
        <h3 className="text-md font-black text-slate-900 tracking-tight">Distribuição dos Estilos</h3>

        <div className="space-y-4">
          {listProfiles.map((item, index) => (
            <div key={index} className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-700">
                <span>{item.label}</span>
                <span className="font-black text-slate-900">{item.val} pts ({item.pct}%)</span>
              </div>
              <div className="w-full bg-slate-200/50 rounded-full h-3 overflow-hidden flex border border-slate-100">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-slate-100 rounded-[2.5rem] p-6 space-y-6 bg-white shadow-sm">
        <h3 className="text-md font-black text-slate-900 tracking-tight">Detalhamento Comportamental</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Pontos Fortes</span>
            <ul className="space-y-2">
              {profile.strengths.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-xs font-semibold text-slate-600 leading-snug">
                  <span className="text-emerald-500 font-extrabold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-600">Pontos de Atenção</span>
            <ul className="space-y-2">
              {profile.weaknesses.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-xs font-semibold text-slate-600 leading-snug">
                  <span className="text-amber-500 font-extrabold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 md:col-span-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600">Ambiente de Trabalho Ideal</span>
            <div className="flex flex-wrap gap-2 pt-1">
              {profile.environments.map((item, index) => (
                <span key={index} className="px-3.5 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <button
          type="button"
          onClick={onBackToTests}
          className="px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-slate-200"
        >
          Voltar para Testes
        </button>
      </div>
    </div>
  );
}
