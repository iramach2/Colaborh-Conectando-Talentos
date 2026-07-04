import { Dispatch, SetStateAction } from 'react';
import { Loader2 } from 'lucide-react';
import type { CandidateAssessmentState, QuestionsCategories } from '../../types/candidate';

interface CandidateQuestionsAssessmentStepProps {
  questionsCategories: QuestionsCategories;
  currentQuestionsCategoryIndex: number;
  setCurrentQuestionsCategoryIndex: Dispatch<SetStateAction<number>>;
  questionsAnswers: Record<number, string>;
  setQuestionsAnswers: Dispatch<SetStateAction<Record<number, string>>>;
  questionsErrorMessage: string | null;
  setQuestionsErrorMessage: Dispatch<SetStateAction<string | null>>;
  isSavingQuestions: boolean;
  setQuestionsState: Dispatch<SetStateAction<CandidateAssessmentState>>;
  handleFinishQuestions: () => void;
}

export function CandidateQuestionsAssessmentStep({
  questionsCategories,
  currentQuestionsCategoryIndex,
  setCurrentQuestionsCategoryIndex,
  questionsAnswers,
  setQuestionsAnswers,
  questionsErrorMessage,
  setQuestionsErrorMessage,
  isSavingQuestions,
  setQuestionsState,
  handleFinishQuestions,
}: CandidateQuestionsAssessmentStepProps) {
  const categoriesKeys = ['EXPERIENCE', 'CONTRIBUTION', 'TEAMWORK', 'BEHAVIORAL'] as const;
  const currentCategoryKey = categoriesKeys[currentQuestionsCategoryIndex];
  const currentCategory = questionsCategories[currentCategoryKey];
  const startIndex = currentQuestionsCategoryIndex * 5;
  const progressPercent = Math.round(((currentQuestionsCategoryIndex + 1) / 4) * 100);

  const handleAnswerChange = (globalIdx: number, val: string) => {
    setQuestionsAnswers((prev) => ({ ...prev, [globalIdx]: val }));
  };

  const handleNextStep = () => {
    let firstErrorIdx = -1;
    for (let i = startIndex; i < startIndex + 5; i++) {
      const ans = questionsAnswers[i] || '';
      if (ans.trim().length < 10) {
        firstErrorIdx = i;
        break;
      }
    }

    if (firstErrorIdx >= 0) {
      const localIdx = firstErrorIdx - startIndex + 1;
      setQuestionsErrorMessage(`Por favor, responda a pergunta ${localIdx} da categoria atual de forma detalhada (mínimo 10 caracteres).`);
      return;
    }

    setQuestionsErrorMessage(null);
    if (currentQuestionsCategoryIndex < 3) setCurrentQuestionsCategoryIndex((prev) => prev + 1);
    else handleFinishQuestions();
  };

  const handlePrevStep = () => {
    setQuestionsErrorMessage(null);
    if (currentQuestionsCategoryIndex > 0) setCurrentQuestionsCategoryIndex((prev) => prev - 1);
    else setQuestionsState('initial');
  };

  return (
    <section className="mx-auto max-w-4xl rounded-2xl border border-slate-200/70 bg-white/85 p-6 text-left shadow-[0_10px_28px_rgba(15,23,42,0.035)] md:p-7">
      <header>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="inline-flex h-7 items-center rounded-xl border border-[#ffc24b]/26 bg-[#ffc24b]/16 px-3 text-[11px] font-semibold text-[#ffa303]">
              Etapa {currentQuestionsCategoryIndex + 1} de 4
            </span>
            <h2 className="mt-3 text-[20px] font-semibold tracking-tight text-[#343241]">{currentCategory.title}</h2>
          </div>
          <span className="text-[12px] font-semibold text-slate-400">{progressPercent}% concluído</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-[#ffc24b] transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
      </header>

      {questionsErrorMessage && (
        <div className="mt-5 rounded-2xl border border-[#ff4b8c]/20 bg-[#ff4b8c]/10 p-4 text-[12px] font-semibold text-[#ff4b8c]">
          {questionsErrorMessage}
        </div>
      )}

      <div className="mt-6 space-y-4">
        {currentCategory.questions.map((questionText: string, idx: number) => {
          const globalIdx = startIndex + idx;
          const answerText = questionsAnswers[globalIdx] || '';
          const charCount = answerText.trim().length;

          return (
            <article key={globalIdx} className="rounded-2xl border border-slate-200/70 bg-white p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#940dff] text-[11px] font-semibold text-white">{globalIdx + 1}</span>
                <h3 className="text-[14px] font-semibold leading-relaxed text-[#343241]">{questionText}</h3>
              </div>
              <textarea
                value={answerText}
                onChange={(event) => handleAnswerChange(globalIdx, event.target.value)}
                placeholder="Digite sua resposta aqui de forma detalhada..."
                className="mt-4 min-h-[110px] w-full resize-none rounded-2xl border border-slate-200/80 bg-[#fbfaff] p-4 text-[12px] font-medium leading-relaxed text-[#343241] outline-none transition-all placeholder:text-slate-400 focus:border-[#940dff]/30 focus:ring-4 focus:ring-[#940dff]/10"
                maxLength={2000}
              />
              <div className="mt-2 flex items-center justify-between text-[11px] font-semibold">
                <span className={charCount >= 10 ? 'text-[#2f9f6b]' : 'text-slate-400'}>{charCount >= 10 ? 'Resposta válida' : 'Mínimo 10 caracteres'}</span>
                <span className="text-slate-400">{charCount} / 2000</span>
              </div>
            </article>
          );
        })}
      </div>

      <footer className="mt-7 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
        <button type="button" onClick={handlePrevStep} className="h-8 rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12">Anterior</button>
        <button type="button" disabled={isSavingQuestions} onClick={handleNextStep} className="flex h-8 items-center gap-2 rounded-xl bg-[#940dff] px-5 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none">
          {isSavingQuestions ? <><Loader2 size={13} className="animate-spin" /> Salvando...</> : currentQuestionsCategoryIndex === 3 ? 'Finalizar e enviar' : 'Próxima etapa'}
        </button>
      </footer>
    </section>
  );
}