import { CheckCircle2 } from 'lucide-react';
import { MBTI_PROFILES } from '../../data/assessmentProfiles';
import type { MbtiCompletedResult, MbtiResult } from '../../types/candidate';

interface CandidateMbtiAssessmentCompletedProps {
  mbtiResult: MbtiResult | null;
  selectedMbtiResult: MbtiCompletedResult | null;
  onBackToTests: () => void;
}

export function CandidateMbtiAssessmentCompleted({
  mbtiResult,
  selectedMbtiResult,
  onBackToTests,
}: CandidateMbtiAssessmentCompletedProps) {
  const mbtiScores = mbtiResult?.scores || selectedMbtiResult?.scores || { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  const mbtiType = mbtiResult?.type || selectedMbtiResult?.type || 'ISTJ';
  const profile = MBTI_PROFILES[mbtiType] || MBTI_PROFILES.ISTJ;

  const calcMbtiPercent = (valA: number, valB: number) => {
    const total = valA + valB;
    if (total === 0) return 50;
    return Math.round((valA / total) * 100);
  };

  const pctE = calcMbtiPercent(mbtiScores.E, mbtiScores.I);
  const pctI = 100 - pctE;
  const pctS = calcMbtiPercent(mbtiScores.S, mbtiScores.N);
  const pctN = 100 - pctS;
  const pctT = calcMbtiPercent(mbtiScores.T, mbtiScores.F);
  const pctF = 100 - pctT;
  const pctJ = calcMbtiPercent(mbtiScores.J, mbtiScores.P);
  const pctP = 100 - pctJ;

  const dimensionsList = [
    { leftLabel: 'Extroversão (E)', rightLabel: 'Introversão (I)', leftVal: pctE, rightVal: pctI, dominant: mbtiType[0] },
    { leftLabel: 'Sensação (S)', rightLabel: 'Intuição (N)', leftVal: pctS, rightVal: pctN, dominant: mbtiType[1] },
    { leftLabel: 'Pensamento (T)', rightLabel: 'Sentimento (F)', leftVal: pctT, rightVal: pctF, dominant: mbtiType[2] },
    { leftLabel: 'Julgamento (J)', rightLabel: 'Percepção (P)', leftVal: pctJ, rightVal: pctP, dominant: mbtiType[3] },
  ];

  return (
    <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-sleek border border-white max-w-4xl mx-auto space-y-8 text-left animate-fade-in">
      <div className="text-center">
        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Avaliação MBTI Concluída!</h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Seu Relatório de Personalidade está pronto</p>
      </div>

      <div className={`p-8 rounded-[2.5rem] border ${profile.classColor} space-y-4`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest opacity-80">Seu Tipo de Personalidade</span>
            <h3 className="text-3xl font-black tracking-tight mt-1">{profile.nome}</h3>
            <p className="text-sm font-extrabold opacity-95">{profile.titulo} • Categoria: {profile.categoria}</p>
          </div>
          <span className="px-6 py-2 bg-white/40 border border-white/60 rounded-full text-xs font-black uppercase tracking-widest shadow-xs">
            {profile.categoria}
          </span>
        </div>
        <div className="w-full h-px bg-slate-200/20" />
        <p className="text-xs font-semibold leading-relaxed opacity-90">{profile.desc}</p>
      </div>

      <div className="bg-slate-50/60 border border-slate-100 p-6 rounded-[2.5rem] space-y-6">
        <h3 className="text-md font-black text-slate-900 tracking-tight">Suas Dimensões de Personalidade</h3>

        <div className="space-y-6">
          {dimensionsList.map((dimension, index) => {
            const isLeftDom = dimension.dominant === dimension.leftLabel.substring(dimension.leftLabel.indexOf('(') + 1, dimension.leftLabel.indexOf(')'));

            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-700">
                  <span className={isLeftDom ? 'text-primary-600 font-black' : 'text-slate-400'}>
                    {dimension.leftLabel} • {dimension.leftVal}%
                  </span>
                  <span className={!isLeftDom ? 'text-indigo-600 font-black' : 'text-slate-400'}>
                    {dimension.rightVal}% • {dimension.rightLabel}
                  </span>
                </div>
                <div className="w-full bg-slate-200/70 rounded-full h-3.5 overflow-hidden flex shadow-inner border border-slate-100">
                  <div
                    className={`h-full transition-all duration-500 rounded-l-full ${isLeftDom ? 'bg-[#533af6]' : 'bg-slate-300'}`}
                    style={{ width: `${dimension.leftVal}%` }}
                  />
                  <div
                    className={`h-full transition-all duration-500 rounded-r-full ${!isLeftDom ? 'bg-indigo-500' : 'bg-slate-300'}`}
                    style={{ width: `${dimension.rightVal}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border border-slate-100 rounded-[2.5rem] p-6 space-y-6 bg-white shadow-sm">
        <h3 className="text-md font-black text-slate-900 tracking-tight">Detalhamento Comportamental ({profile.nome})</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Características Principais</span>
            <div className="flex flex-wrap gap-1.5">
              {profile.caracteristicas.map((item, index) => (
                <span key={index} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Pontos Fortes</span>
            <ul className="space-y-1.5">
              {profile.pontosFortes.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-xs font-bold text-slate-600 leading-snug">
                  <span className="text-emerald-500 font-extrabold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-500">Pontos de Atenção</span>
            <ul className="space-y-1.5">
              {profile.pontosAtencao.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-xs font-bold text-slate-600 leading-snug">
                  <span className="text-amber-500 font-extrabold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
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
