import { CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { perfisDISC } from '../../data/assessmentProfiles';

interface CandidateDiscAssessmentCompletedProps {
  discResult: {
    D: number;
    I: number;
    S: number;
    C: number;
  };
  onBackToTests: () => void;
}

export function CandidateDiscAssessmentCompleted({
  discResult,
  onBackToTests,
}: CandidateDiscAssessmentCompletedProps) {
  const { D, I, S, C } = discResult;
  const scoresList = [
    { key: 'D' as const, label: 'Dominância (D)', val: D, color: 'bg-rose-500', textColor: 'text-rose-600', classColor: 'text-rose-600 bg-rose-50 border-rose-100', profile: perfisDISC.D },
    { key: 'I' as const, label: 'Influência (I)', val: I, color: 'bg-indigo-500', textColor: 'text-indigo-600', classColor: 'text-indigo-600 bg-indigo-50 border-indigo-100', profile: perfisDISC.I },
    { key: 'S' as const, label: 'Estabilidade (S)', val: S, color: 'bg-emerald-500', textColor: 'text-emerald-600', classColor: 'text-emerald-600 bg-emerald-50 border-emerald-100', profile: perfisDISC.S },
    { key: 'C' as const, label: 'Conformidade (C)', val: C, color: 'bg-amber-500', textColor: 'text-amber-600', classColor: 'text-amber-600 bg-amber-50 border-amber-100', profile: perfisDISC.C },
  ];

  const sortedScores = [...scoresList].sort((a, b) => b.val - a.val);
  const predominant = sortedScores[0];
  const secondary = sortedScores[1];

  const k1 = predominant.key;
  const k2 = secondary.key;
  let combinationText = '';
  if ((k1 === 'D' && k2 === 'I') || (k1 === 'I' && k2 === 'D')) {
    combinationText = 'Líder comunicador, persuasivo e competitivo.';
  } else if ((k1 === 'D' && k2 === 'C') || (k1 === 'C' && k2 === 'D')) {
    combinationText = 'Estratégico, exigente e focado em alta performance.';
  } else if ((k1 === 'I' && k2 === 'S') || (k1 === 'S' && k2 === 'I')) {
    combinationText = 'Comunicador empático e colaborativo.';
  } else if ((k1 === 'S' && k2 === 'C') || (k1 === 'C' && k2 === 'S')) {
    combinationText = 'Organizado, confiável e analítico.';
  } else if ((k1 === 'D' && k2 === 'S') || (k1 === 'S' && k2 === 'D')) {
    combinationText = 'Liderança equilibrada e firme.';
  } else if ((k1 === 'I' && k2 === 'C') || (k1 === 'C' && k2 === 'I')) {
    combinationText = 'Criativo com pensamento analítico.';
  }

  const getClassificationBand = (value: number) => {
    if (value <= 39) return { label: 'Baixa tendência', color: 'text-slate-400 bg-slate-50 border-slate-200' };
    if (value <= 69) return { label: 'Tendência moderada', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { label: 'Perfil muito forte e predominante', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-sleek border border-white max-w-4xl mx-auto space-y-8 text-left">
      <div className="text-center">
        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Avaliação Concluída com Sucesso!</h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Seu Relatório de Perfil DISC 5.0 está pronto</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-6 rounded-3xl border ${predominant.classColor}`}>
          <span className="text-[9px] font-black uppercase tracking-widest opacity-80">Perfil Predominante</span>
          <h3 className="text-xl font-black tracking-tight mt-1">{predominant.profile.nome}</h3>
          <p className="text-xs font-semibold leading-relaxed mt-2 opacity-90">{predominant.profile.desc}</p>
        </div>
        <div className={`p-6 rounded-3xl border ${secondary.classColor}`}>
          <span className="text-[9px] font-black uppercase tracking-widest opacity-80">Perfil Secundário</span>
          <h3 className="text-xl font-black tracking-tight mt-1">{secondary.profile.nome}</h3>
          <p className="text-xs font-semibold leading-relaxed mt-2 opacity-90">{secondary.profile.desc}</p>
        </div>
      </div>

      {combinationText && (
        <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-3xl text-left">
          <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500">Combinação de Perfil</span>
          <h4 className="text-md font-black text-indigo-950 mt-1">{predominant.profile.label} + {secondary.profile.label}</h4>
          <p className="text-xs font-bold text-indigo-800/90 mt-1 leading-relaxed">{combinationText}</p>
        </div>
      )}

      <div className="bg-slate-50/60 border border-slate-100 p-6 rounded-[2.5rem] space-y-6">
        <h3 className="text-md font-black text-slate-900 tracking-tight">Equilíbrio dos Fatores (DISC)</h3>
        <div className="space-y-5">
          {scoresList.map((factor) => {
            const band = getClassificationBand(factor.val);
            return (
              <div key={factor.key} className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="font-black uppercase tracking-wider">{factor.label}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${band.color}`}>
                      {band.label}
                    </span>
                  </div>
                  <span className="font-black text-xs text-slate-900">{factor.val}%</span>
                </div>
                <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${factor.val}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full ${factor.color} rounded-full`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border border-slate-100 rounded-[2.5rem] p-6 space-y-6 bg-white shadow-sm">
        <h3 className="text-md font-black text-slate-900 tracking-tight">Detalhamento Comportamental: {predominant.profile.label}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Características Principais</span>
            <div className="flex flex-wrap gap-1.5">
              {predominant.profile.caracteristicas.map((item, index) => (
                <span key={index} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Pontos Fortes</span>
            <ul className="space-y-1.5">
              {predominant.profile.pontosFortes.map((item, index) => (
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
              {predominant.profile.pontosAtencao.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-xs font-bold text-slate-600 leading-snug">
                  <span className="text-amber-500 font-extrabold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500">Motivadores</span>
            <ul className="space-y-1.5">
              {predominant.profile.motivadores.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-xs font-bold text-slate-600 leading-snug">
                  <span className="text-indigo-500 font-extrabold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 md:col-span-2 border-t border-slate-50 pt-4 mt-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-rose-500">Comportamento Sob Pressão</span>
            <ul className="space-y-1.5 mt-1">
              {predominant.profile.sobPressao.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-xs font-bold text-slate-600 leading-snug">
                  <span className="text-rose-500 font-extrabold mt-0.5">•</span>
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
