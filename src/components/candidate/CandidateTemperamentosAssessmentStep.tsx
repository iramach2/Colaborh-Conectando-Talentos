import { Dispatch, SetStateAction } from 'react';
import { Loader2 } from 'lucide-react';
import type { TemperamentosQuestion } from '../../data/assessmentProfiles';
import type { CandidateAssessmentState, TemperamentosKey } from '../../types/candidate';

interface CandidateTemperamentosAssessmentStepProps {
  temperamentosQuestions: TemperamentosQuestion[];
  currentTemperamentosStageIndex: number;
  setCurrentTemperamentosStageIndex: Dispatch<SetStateAction<number>>;
  temperamentosAnswers: Record<number, string>;
  setTemperamentosAnswers: Dispatch<SetStateAction<Record<number, string>>>;
  temperamentosErrorMessage: string | null;
  setTemperamentosErrorMessage: Dispatch<SetStateAction<string | null>>;
  isSavingTemperamentos: boolean;
  setTemperamentosState: Dispatch<SetStateAction<CandidateAssessmentState>>;
  handleFinishTemperamentosTest: () => void;
}

export function CandidateTemperamentosAssessmentStep({
  temperamentosQuestions,
  currentTemperamentosStageIndex,
  setCurrentTemperamentosStageIndex,
  temperamentosAnswers,
  setTemperamentosAnswers,
  temperamentosErrorMessage,
  setTemperamentosErrorMessage,
  isSavingTemperamentos,
  setTemperamentosState,
  handleFinishTemperamentosTest,
}: CandidateTemperamentosAssessmentStepProps) {
  const stageQuestions = temperamentosQuestions.slice(currentTemperamentosStageIndex * 5, (currentTemperamentosStageIndex + 1) * 5);
  const progressPercent = Math.round(((currentTemperamentosStageIndex + 1) / 5) * 100);
  const isStageCompleted = stageQuestions.every((question) => temperamentosAnswers[question.id]);

  const handleSelectTemperamentosAnswer = (qId: number, profileKey: TemperamentosKey) => {
    setTemperamentosAnswers((prev) => ({ ...prev, [qId]: profileKey }));
  };

  const handlePrevStep = () => {
    setTemperamentosErrorMessage(null);
    if (currentTemperamentosStageIndex > 0) {
      setCurrentTemperamentosStageIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setTemperamentosState('initial');
    }
  };

  const handleNextStep = () => {
    if (!isStageCompleted) {
      setTemperamentosErrorMessage('Por favor, responda a todas as perguntas desta etapa antes de avançar.');
      return;
    }

    setTemperamentosErrorMessage(null);
    if (currentTemperamentosStageIndex < 4) {
      setCurrentTemperamentosStageIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleFinishTemperamentosTest();
    }
  };

  return (
    <section className="mx-auto max-w-4xl rounded-2xl border border-slate-200/70 bg-white/85 p-6 text-left shadow-[0_10px_28px_rgba(15,23,42,0.035)] md:p-7">
      <header>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="inline-flex h-7 items-center rounded-xl border border-[#ff4b8c]/18 bg-[#ff4b8c]/10 px-3 text-[11px] font-semibold text-[#ff4b8c]">
              Etapa {currentTemperamentosStageIndex + 1} de 5
            </span>
            <h2 className="mt-3 text-[20px] font-semibold tracking-tight text-[#343241]">Temperamentos e perfil comportamental</h2>
          </div>
          <span className="text-[12px] font-semibold text-slate-400">{progressPercent}% concluído</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-[#ff4b8c] transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
      </header>

      <div className="mt-5 rounded-2xl border border-slate-200/70 bg-[#fbfaff] p-4 text-[12px] font-medium leading-relaxed text-slate-500">
        Selecione uma alternativa para cada pergunta. Escolha a opção que melhor representa seu comportamento natural.
      </div>

      {temperamentosErrorMessage && (
        <div className="mt-5 rounded-2xl border border-[#ff4b8c]/20 bg-[#ff4b8c]/10 p-4 text-[12px] font-semibold text-[#ff4b8c]">
          {temperamentosErrorMessage}
        </div>
      )}

      <div className="mt-6 space-y-4">
        {stageQuestions.map((question) => {
          const selectedAnswer = temperamentosAnswers[question.id];
          return (
            <article key={question.id} className="rounded-2xl border border-slate-200/70 bg-white p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#940dff] text-[11px] font-semibold text-white">
                  {question.id}
                </span>
                <h3 className="text-[14px] font-semibold leading-relaxed text-[#343241]">{question.text}</h3>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                {Object.entries(question.options).map(([profileKey, optionText]) => {
                  const isSelected = selectedAnswer === profileKey;
                  return (
                    <button
                      key={profileKey}
                      type="button"
                      onClick={() => handleSelectTemperamentosAnswer(question.id, profileKey as TemperamentosKey)}
                      className={`flex min-h-[52px] items-center gap-3 rounded-2xl border p-3 text-left text-[12px] font-medium leading-relaxed transition-all ${
                        isSelected
                          ? 'border-[#940dff]/28 bg-[#f3e5ff] text-[#343241] shadow-sm'
                          : 'border-slate-200 bg-white text-slate-500 hover:border-[#940dff]/24 hover:bg-[#fbfaff]'
                      }`}
                    >
                      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${isSelected ? 'border-[#940dff] bg-[#940dff]' : 'border-slate-300 bg-white'}`}>
                        {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                      <span>{optionText as string}</span>
                    </button>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>

      <footer className="mt-7 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
        <button type="button" onClick={handlePrevStep} className="h-8 rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12">Anterior</button>
        <button
          type="button"
          disabled={!isStageCompleted || isSavingTemperamentos}
          onClick={handleNextStep}
          className="flex h-8 items-center gap-2 rounded-xl bg-[#940dff] px-5 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          {isSavingTemperamentos ? <><Loader2 size={13} className="animate-spin" /> Salvando...</> : currentTemperamentosStageIndex === 4 ? 'Finalizar e enviar' : 'Próxima etapa'}
        </button>
      </footer>
    </section>
  );
}