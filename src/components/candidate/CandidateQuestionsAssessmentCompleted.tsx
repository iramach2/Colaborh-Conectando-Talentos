import { Dispatch, SetStateAction } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { QuestionsCategories, QuestionsResult } from '../../types/candidate';

interface CandidateQuestionsAssessmentCompletedProps {
  questionsCategories: QuestionsCategories;
  currentQuestionsCategoryIndex: number;
  setCurrentQuestionsCategoryIndex: Dispatch<SetStateAction<number>>;
  selectedQuestionsResult: QuestionsResult;
  onBackToTests: () => void;
}

export function CandidateQuestionsAssessmentCompleted({
  questionsCategories,
  currentQuestionsCategoryIndex,
  setCurrentQuestionsCategoryIndex,
  selectedQuestionsResult,
  onBackToTests,
}: CandidateQuestionsAssessmentCompletedProps) {
  const categoriesKeys = ['EXPERIENCE', 'CONTRIBUTION', 'TEAMWORK', 'BEHAVIORAL'] as const;
  const currentCategoryKey = categoriesKeys[currentQuestionsCategoryIndex];
  const currentCategory = questionsCategories[currentCategoryKey];
  const startIndex = currentQuestionsCategoryIndex * 5;

  return (
    <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-sleek border border-white max-w-4xl mx-auto space-y-8 text-left">
      <div className="text-center">
        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Mapeamento de Perfil Enviado!</h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Suas respostas do mapeamento de perfil profissional estão gravadas</p>
      </div>

      <div className="flex border-b border-slate-100 bg-slate-50/50 p-1.5 rounded-2xl gap-2 overflow-x-auto scrollbar-none">
        {categoriesKeys.map((catKey, index) => {
          const cat = questionsCategories[catKey];
          const isActive = currentQuestionsCategoryIndex === index;
          return (
            <button
              key={catKey}
              type="button"
              onClick={() => setCurrentQuestionsCategoryIndex(index)}
              className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider whitespace-nowrap transition-all flex-1 ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-100'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              style={isActive ? { borderLeft: '3px solid #533af6' } : {}}
            >
              {cat.title}
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {currentCategory.questions.map((questionText: string, index: number) => {
          const globalIdx = startIndex + index;
          const answerText = selectedQuestionsResult[globalIdx] || 'Nenhuma resposta gravada.';

          return (
            <div key={globalIdx} className="p-6 rounded-3xl border border-slate-100 bg-slate-50/30 space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center text-white shrink-0 mt-0.5" style={{ backgroundColor: '#533af6' }}>
                  {globalIdx + 1}
                </span>
                <h4 className="font-extrabold text-slate-800 text-sm leading-snug">
                  {questionText}
                </h4>
              </div>
              <div className="p-4 bg-white border border-slate-100 rounded-2xl text-xs font-semibold text-slate-600 leading-relaxed whitespace-pre-line shadow-xs">
                {answerText}
              </div>
            </div>
          );
        })}
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
