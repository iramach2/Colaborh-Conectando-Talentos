import { MBTI_PROFILES, TEMPERAMENTOS_PROFILES, perfisDISC } from '../../data/assessmentProfiles';
import { QUESTIONS_CATEGORIES } from '../../data/profileQuestions';
import type {
  CandidateAssessmentDrawerKind,
  CustomQuestion,
  DiscResult,
  MbtiCompletedResult,
  MbtiResult,
  QuestionsResult,
  TemperamentosCompletedResult,
  TemperamentosResult,
} from '../../types/candidate';

interface CandidateTestResultContentProps {
  drawerTestResult: CandidateAssessmentDrawerKind;
  discResult: DiscResult | null;
  selectedQuestionsResult: QuestionsResult | null;
  currentQuestionsCategoryIndex: number;
  setCurrentQuestionsCategoryIndex: (value: number) => void;
  mbtiResult: MbtiResult | null;
  selectedMbtiResult: MbtiCompletedResult | null;
  temperamentosResult: TemperamentosResult | null;
  selectedTemperamentosResult: TemperamentosCompletedResult | null;
  selectedCustomTestResult: Record<string, string> | null;
  customTestQuestions: CustomQuestion[];
}

export function CandidateTestResultContent({
  drawerTestResult,
  discResult,
  selectedQuestionsResult,
  currentQuestionsCategoryIndex,
  setCurrentQuestionsCategoryIndex,
  mbtiResult,
  selectedMbtiResult,
  temperamentosResult,
  selectedTemperamentosResult,
  selectedCustomTestResult,
  customTestQuestions,
}: CandidateTestResultContentProps) {
  if (drawerTestResult === 'DISC' && discResult) {
      const { D, I, S, C } = discResult;
      const scoresList = [
        { key: 'D' as const, label: 'Dominância (D)', val: D, color: 'bg-rose-500', textColor: 'text-rose-600', classColor: 'text-rose-600 bg-rose-50/50 border-rose-100', profile: perfisDISC.D },
        { key: 'I' as const, label: 'Influência (I)', val: I, color: 'bg-[#533af6]', textColor: 'text-[#533af6]', classColor: 'text-[#533af6] bg-indigo-50/50 border-indigo-100', profile: perfisDISC.I },
        { key: 'S' as const, label: 'Estabilidade (S)', val: S, color: 'bg-emerald-500', textColor: 'text-emerald-600', classColor: 'text-emerald-600 bg-emerald-50/50 border-emerald-100', profile: perfisDISC.S },
        { key: 'C' as const, label: 'Conformidade (C)', val: C, color: 'bg-amber-500', textColor: 'text-amber-600', classColor: 'text-amber-600 bg-amber-50/50 border-amber-100', profile: perfisDISC.C }
      ];

      const sortedScores = [...scoresList].sort((a, b) => b.val - a.val);
      const predominant = sortedScores[0];
      const secondary = sortedScores[1];

      let combinationText = "";
      const k1 = predominant.key;
      const k2 = secondary.key;
      if ((k1 === 'D' && k2 === 'I') || (k1 === 'I' && k2 === 'D')) {
        combinationText = "Líder comunicador, persuasivo e competitivo.";
      } else if ((k1 === 'D' && k2 === 'C') || (k1 === 'C' && k2 === 'D')) {
        combinationText = "Estratégico, exigente e focado em alta performance.";
      } else if ((k1 === 'I' && k2 === 'S') || (k1 === 'S' && k2 === 'I')) {
        combinationText = "Comunicador empático e colaborativo.";
      } else if ((k1 === 'S' && k2 === 'C') || (k1 === 'C' && k2 === 'S')) {
        combinationText = "Organizado, confiável e analítico.";
      } else if ((k1 === 'D' && k2 === 'S') || (k1 === 'S' && k2 === 'D')) {
        combinationText = "Liderança equilibrada e firme.";
      } else if ((k1 === 'I' && k2 === 'C') || (k1 === 'C' && k2 === 'I')) {
        combinationText = "Criativo com pensamento analítico.";
      }

      const getClassificationBand = (v: number) => {
        if (v <= 39) return { label: "Baixa tendência", color: "text-slate-400 bg-slate-50 border-slate-200" };
        if (v <= 69) return { label: "Tendência moderada", color: "text-amber-600 bg-amber-50 border-amber-200" };
        return { label: "Predominante", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
      };

      return (
        <div className="space-y-6 text-left pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-6 rounded-[12px] border ${predominant.classColor} relative overflow-hidden`}>
              <span className="text-[9px] font-black uppercase tracking-widest opacity-80">Perfil Predominante</span>
              <h3 className="text-md font-black tracking-tight mt-1 uppercase">{predominant.profile.nome}</h3>
              <p className="text-xs font-medium leading-relaxed mt-2 text-slate-600">{predominant.profile.desc}</p>
            </div>
            <div className={`p-6 rounded-[12px] border ${secondary.classColor} relative overflow-hidden`}>
              <span className="text-[9px] font-black uppercase tracking-widest opacity-80">Perfil Secundário</span>
              <h3 className="text-md font-black tracking-tight mt-1 uppercase">{secondary.profile.nome}</h3>
              <p className="text-xs font-medium leading-relaxed mt-2 text-slate-600">{secondary.profile.desc}</p>
            </div>
          </div>

          {combinationText && (
            <div className="p-6 bg-indigo-50/40 border border-indigo-100/60 rounded-[12px] text-left">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#533af6]">Combinação de Perfil</span>
              <h4 className="text-xs font-black text-indigo-950 mt-1">{predominant.profile.label} + {secondary.profile.label}</h4>
              <p className="text-xs font-medium text-indigo-800 mt-1 leading-relaxed">{combinationText}</p>
            </div>
          )}

          <div className="bg-white border border-slate-100 p-6 rounded-[12px] shadow-sm space-y-6">
            <h3 className="text-xs font-black text-slate-800 tracking-tight uppercase">Equilíbrio dos Fatores (DISC)</h3>
            <div className="space-y-4">
              {scoresList.map(f => {
                const band = getClassificationBand(f.val);
                return (
                  <div key={f.key} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="font-black uppercase tracking-wider">{f.label}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black border uppercase tracking-wider ${band.color}`}>
                          {band.label}
                        </span>
                      </div>
                      <span className="font-black text-xs text-slate-900">{f.val}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/30">
                      <div 
                        className={`h-full ${f.color} rounded-full transition-all duration-500`}
                        style={{ width: `${f.val}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border border-slate-100 rounded-[12px] p-6 space-y-5 bg-white shadow-sm">
            <h3 className="text-xs font-black text-slate-800 tracking-tight uppercase">Detalhamento Comportamental</h3>
            <div className="space-y-4 text-xs font-semibold text-slate-600 leading-relaxed">
              <div>
                <span className="font-black text-slate-800 block text-[10px] uppercase tracking-wider mb-1">Características Principais</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {predominant.profile.caracteristicas.map((c, i) => (
                    <span key={i} className="px-3 py-1 bg-[#533af6]/5 border border-[#533af6]/10 rounded-full text-[9px] font-black text-[#533af6] uppercase tracking-wider">{c}</span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-emerald-50/20 border border-emerald-100 p-5 rounded-[12px]">
                  <span className="font-black text-emerald-800 block text-[10px] uppercase tracking-wider mb-2">Pontos Fortes</span>
                  <ul className="list-disc pl-4 space-y-1.5 mt-2 text-emerald-800 font-medium">
                    {predominant.profile.pontosFortes.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
                <div className="bg-rose-50/20 border border-rose-100 p-5 rounded-[12px]">
                  <span className="font-black text-rose-800 block text-[10px] uppercase tracking-wider mb-2">Pontos de Atenção</span>
                  <ul className="list-disc pl-4 space-y-1.5 mt-2 text-rose-800 font-medium">
                    {predominant.profile.pontosAtencao.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (drawerTestResult === 'QUESTIONS' && selectedQuestionsResult) {
      const categoriesKeys = ['EXPERIENCE', 'CONTRIBUTION', 'TEAMWORK', 'BEHAVIORAL'] as const;
      const currentCategoryKey = categoriesKeys[currentQuestionsCategoryIndex];
      const currentCategory = QUESTIONS_CATEGORIES[currentCategoryKey];
      const startIndex = currentQuestionsCategoryIndex * 5;

      return (
        <div className="space-y-6 text-left pb-10">
          <div className="flex border border-slate-100 bg-white p-1.5 rounded-[12px] gap-1 overflow-x-auto scrollbar-none shadow-sm">
            {categoriesKeys.map((catKey, idx) => {
              const cat = QUESTIONS_CATEGORIES[catKey];
              const isActive = currentQuestionsCategoryIndex === idx;
              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => setCurrentQuestionsCategoryIndex(idx)}
                  className={`px-4 py-2.5 rounded-[8px] text-[9px] font-black uppercase tracking-wider whitespace-nowrap transition-all flex-1 cursor-pointer ${
                    isActive
                      ? 'bg-[#533af6] text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {cat.title}
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            {currentCategory.questions.map((questionText, idx) => {
              const globalIdx = startIndex + idx;
              const answerText = selectedQuestionsResult[globalIdx] || 'Nenhuma resposta gravada.';

              return (
                <div key={globalIdx} className="p-5 rounded-[12px] border border-slate-100 bg-white space-y-3 shadow-xs">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center text-white shrink-0 mt-0.5 bg-[#533af6]">
                      {globalIdx + 1}
                    </span>
                    <h4 className="font-black text-slate-800 text-xs leading-snug">
                      {questionText}
                    </h4>
                  </div>
                  <div className="p-4 bg-slate-50/55 border border-slate-100/60 rounded-xl text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-line">
                    {answerText}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (drawerTestResult === 'MBTI' && (mbtiResult || selectedMbtiResult)) {
      const mbtiScores = mbtiResult?.scores || selectedMbtiResult?.scores || { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
      const mbtiType = mbtiResult?.type || selectedMbtiResult?.type || "ISTJ";
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
        { leftLabel: "Extroversão (E)", rightLabel: "Introversão (I)", leftVal: pctE, rightVal: pctI },
        { leftLabel: "Sensação (S)", rightLabel: "Intuição (N)", leftVal: pctS, rightVal: pctN },
        { leftLabel: "Pensamento (T)", rightLabel: "Sentimento (F)", leftVal: pctT, rightVal: pctF },
        { leftLabel: "Julgamento (J)", rightLabel: "Percepção (P)", leftVal: pctJ, rightVal: pctP }
      ];

      return (
        <div className="space-y-6 text-left pb-10">
          <div className={`p-6 rounded-[12px] border ${profile.classColor} space-y-4 relative overflow-hidden`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest opacity-80">Seu Tipo de Personalidade</span>
                <h3 className="text-xl font-black tracking-tight mt-1 uppercase">{profile.nome}</h3>
                <p className="text-xs font-black text-[#533af6] uppercase tracking-wider mt-0.5">{profile.titulo} • Categoria: {profile.categoria}</p>
              </div>
            </div>
            <div className="w-full h-px bg-slate-200/30" />
            <p className="text-xs font-medium leading-relaxed text-slate-600 opacity-90">{profile.desc}</p>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-[12px] space-y-6 shadow-sm">
            <h3 className="text-xs font-black text-slate-800 tracking-tight uppercase">Suas Dimensões de Personalidade</h3>
            <div className="space-y-5">
              {dimensionsList.map((dim, idx) => {
                const charCode = mbtiType[idx];
                const isLeftDom = dim.leftLabel.includes(`(${charCode})`);

                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-700">
                      <span className={isLeftDom ? 'text-[#533af6] font-black text-xs' : 'text-slate-400 font-medium'}>
                        {dim.leftLabel} • {dim.leftVal}%
                      </span>
                      <span className={!isLeftDom ? 'text-[#533af6] font-black text-xs' : 'text-slate-400 font-medium'}>
                        {dim.rightLabel} • {dim.rightVal}%
                      </span>
                    </div>
                    <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/30">
                      {/* Divisor do meio */}
                      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-300 z-10" />
                      {/* Barra de preferência */}
                      {isLeftDom ? (
                        <div 
                          className="absolute right-1/2 h-full bg-[#533af6] rounded-l-full transition-all duration-500"
                          style={{ left: `${100 - dim.leftVal}%` }}
                        />
                      ) : (
                        <div 
                          className="absolute left-1/2 h-full bg-[#533af6] rounded-r-full transition-all duration-500"
                          style={{ right: `${100 - dim.rightVal}%` }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (drawerTestResult === 'TEMPERAMENTOS' && (temperamentosResult || selectedTemperamentosResult)) {
      const tResult = temperamentosResult || selectedTemperamentosResult;
      const profileType = tResult.type;
      const scores = tResult.scores || { I: 0, C: 0, O: 0, A: 0 };
      const profile = TEMPERAMENTOS_PROFILES[profileType] || TEMPERAMENTOS_PROFILES.I;

      const totalAnswers = scores.I + scores.C + scores.O + scores.A;
      const calcPercent = (val: number) => {
        if (totalAnswers === 0) return 0;
        return Math.round((val / totalAnswers) * 100);
      };

      const listProfiles = [
        { label: "Idealista / Criativo (I)", val: scores.I, pct: calcPercent(scores.I), color: '#533af6' },
        { label: "Comunicador / Relacional (C)", val: scores.C, pct: calcPercent(scores.C), color: '#8959f5' },
        { label: "Organizador / Analítico (O)", val: scores.O, pct: calcPercent(scores.O), color: '#10b981' },
        { label: "Executor / Dominante (A)", val: scores.A, pct: calcPercent(scores.A), color: '#f43f5e' }
      ];

      return (
        <div className="space-y-6 text-left pb-10">
          <div className="p-6 rounded-[12px] border border-primary-100 bg-white space-y-4 shadow-sm relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#533af6]">Seu Estilo Predominante</span>
                <h3 className="text-xl font-black tracking-tight mt-1 text-slate-900 uppercase">{profile.name}</h3>
                <p className="text-xs font-black text-[#8959f5] uppercase tracking-wider mt-0.5">{profile.title}</p>
              </div>
            </div>
            <div className="w-full h-px bg-slate-200/50" />
            <p className="text-xs font-medium leading-relaxed text-slate-600">{profile.description}</p>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-[12px] space-y-6 shadow-sm">
            <h3 className="text-xs font-black text-slate-800 tracking-tight uppercase">Distribuição dos Estilos</h3>
            <div className="space-y-4">
              {listProfiles.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-700">
                    <span className="font-black uppercase tracking-wider">{item.label}</span>
                    <span className="font-black text-xs text-slate-900">{item.val} pts ({item.pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex border border-slate-200/20">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ width: `${item.pct}%`, backgroundColor: item.color }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (drawerTestResult === 'CUSTOM' && selectedCustomTestResult) {
      return (
        <div className="space-y-6 text-left pb-10">
          <div className="space-y-4">
            {customTestQuestions.map((q, idx) => {
              const answerText = selectedCustomTestResult[q.id] || 'Nenhuma resposta gravada.';
              return (
                <div key={q.id || idx} className="p-5 rounded-[12px] border border-slate-100 bg-white space-y-3 shadow-xs">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center text-white bg-[#533af6] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <h4 className="font-black text-slate-800 text-xs leading-snug">
                      {q.question}
                    </h4>
                  </div>
                  <div className="p-4 bg-slate-50/50 border border-slate-100/60 rounded-xl text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-line">
                    {answerText}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="text-center py-10">
        <p className="text-slate-400 text-xs font-semibold">Nenhum resultado carregado ou teste inválido.</p>
      </div>
    );
}
