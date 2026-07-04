import { Dispatch, SetStateAction } from 'react';
import { Loader2 } from 'lucide-react';
import type { CandidateAssessmentState, CustomQuestion } from '../../types/candidate';

interface CandidateCustomAssessmentStepProps {
  customTestQuestions: CustomQuestion[];
  customTestAnswers: Record<string, string>;
  setCustomTestAnswers: Dispatch<SetStateAction<Record<string, string>>>;
  customTestErrorMessage: string | null;
  isSavingCustomTest: boolean;
  setCustomTestState: Dispatch<SetStateAction<CandidateAssessmentState>>;
  handleFinishCustomTest: () => void;
}

export function CandidateCustomAssessmentStep({
  customTestQuestions,
  customTestAnswers,
  setCustomTestAnswers,
  customTestErrorMessage,
  isSavingCustomTest,
  setCustomTestState,
  handleFinishCustomTest,
}: CandidateCustomAssessmentStepProps) {
  const answeredCount = customTestQuestions.filter((question) => customTestAnswers[question.id]?.trim()).length;
  const progressPercent = customTestQuestions.length > 0 ? Math.round((answeredCount / customTestQuestions.length) * 100) : 0;

  return (
    <section className="mx-auto max-w-4xl rounded-2xl border border-slate-200/70 bg-white/85 p-6 text-left shadow-[0_10px_28px_rgba(15,23,42,0.035)] md:p-7">
      <header>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="inline-flex h-7 items-center rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-3 text-[11px] font-semibold text-[#940dff]">
              Questionário da vaga
            </span>
            <h2 className="mt-3 text-[20px] font-semibold tracking-tight text-[#343241]">Responda às perguntas abaixo</h2>
          </div>
          <span className="text-[12px] font-semibold text-slate-400">{answeredCount} de {customTestQuestions.length}</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-[#940dff] transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
      </header>

      <div className="mt-5 rounded-2xl border border-slate-200/70 bg-[#fbfaff] p-4 text-[12px] font-medium leading-relaxed text-slate-500">
        Responda com atenção. Perguntas de múltipla escolha exigem uma opção, e perguntas descritivas exigem texto.
      </div>

      {customTestErrorMessage && (
        <div className="mt-5 rounded-2xl border border-[#ff4b8c]/20 bg-[#ff4b8c]/10 p-4 text-[12px] font-semibold text-[#ff4b8c]">
          {customTestErrorMessage}
        </div>
      )}

      <div className="mt-6 space-y-4">
        {customTestQuestions.map((question, index) => {
          const selectedAnswer = customTestAnswers[question.id] || '';
          const isChoice = question.type === 'choice';

          return (
            <article key={question.id || index} className="rounded-2xl border border-slate-200/70 bg-white p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#940dff] text-[11px] font-semibold text-white">{index + 1}</span>
                <h3 className="text-[14px] font-semibold leading-relaxed text-[#343241]">{question.question}</h3>
              </div>

              {isChoice ? (
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {(question.options || []).map((option: string, optionIndex: number) => {
                    const isSelected = selectedAnswer === option;
                    return (
                      <button
                        key={optionIndex}
                        type="button"
                        onClick={() => setCustomTestAnswers((prev) => ({ ...prev, [question.id]: option }))}
                        className={`flex min-h-[52px] items-center gap-3 rounded-2xl border p-3 text-left text-[12px] font-medium leading-relaxed transition-all ${
                          isSelected
                            ? 'border-[#940dff]/28 bg-[#f3e5ff] text-[#343241] shadow-sm'
                            : 'border-slate-200 bg-white text-slate-500 hover:border-[#940dff]/24 hover:bg-[#fbfaff]'
                        }`}
                      >
                        <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${isSelected ? 'border-[#940dff] bg-[#940dff]' : 'border-slate-300 bg-white'}`}>
                          {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </span>
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <textarea
                  value={selectedAnswer}
                  onChange={(event) => setCustomTestAnswers((prev) => ({ ...prev, [question.id]: event.target.value }))}
                  placeholder="Digite sua resposta aqui..."
                  className="mt-4 min-h-[110px] w-full resize-y rounded-2xl border border-slate-200/80 bg-[#fbfaff] p-4 text-[12px] font-medium leading-relaxed text-[#343241] outline-none transition-all placeholder:text-slate-400 focus:border-[#940dff]/30 focus:ring-4 focus:ring-[#940dff]/10"
                />
              )}
            </article>
          );
        })}
      </div>

      <footer className="mt-7 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
        <button type="button" onClick={() => setCustomTestState('initial')} className="h-8 rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12">Voltar</button>
        <button type="button" disabled={isSavingCustomTest} onClick={handleFinishCustomTest} className="flex h-8 items-center gap-2 rounded-xl bg-[#940dff] px-5 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none">
          {isSavingCustomTest ? <><Loader2 size={13} className="animate-spin" /> Enviando...</> : 'Finalizar e enviar'}
        </button>
      </footer>
    </section>
  );
}