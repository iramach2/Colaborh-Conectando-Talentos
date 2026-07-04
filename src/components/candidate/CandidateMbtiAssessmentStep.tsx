import { Dispatch, SetStateAction } from 'react';
import { Loader2 } from 'lucide-react';
import type { MbtiQuestion } from '../../data/assessmentProfiles';
import type { CandidateAssessmentState, MbtiAnswer } from '../../types/candidate';

interface CandidateMbtiAssessmentStepProps {
  mbtiQuestions: MbtiQuestion[];
  currentMbtiStageIndex: number;
  setCurrentMbtiStageIndex: Dispatch<SetStateAction<number>>;
  mbtiAnswers: Record<number, MbtiAnswer>;
  setMbtiAnswers: Dispatch<SetStateAction<Record<number, MbtiAnswer>>>;
  mbtiErrorMessage: string | null;
  setMbtiErrorMessage: Dispatch<SetStateAction<string | null>>;
  isSavingMbti: boolean;
  setMbtiState: Dispatch<SetStateAction<CandidateAssessmentState>>;
  handleFinishMBTITest: () => void;
}

export function CandidateMbtiAssessmentStep({
  mbtiQuestions,
  currentMbtiStageIndex,
  setCurrentMbtiStageIndex,
  mbtiAnswers,
  setMbtiAnswers,
  mbtiErrorMessage,
  setMbtiErrorMessage,
  isSavingMbti,
  setMbtiState,
  handleFinishMBTITest,
}: CandidateMbtiAssessmentStepProps) {
  const stageQuestions = mbtiQuestions.slice(currentMbtiStageIndex * 8, (currentMbtiStageIndex + 1) * 8);
  const progressPercent = Math.round(((currentMbtiStageIndex + 1) / 8) * 100);

  const handleSelectMbtiScore = (qId: number, option: 'a' | 'b', score: number) => {
    setMbtiAnswers((prev) => ({
      ...prev,
      [qId]: {
        a: option === 'a' ? score : (prev[qId]?.a ?? null),
        b: option === 'b' ? score : (prev[qId]?.b ?? null),
      },
    }));
  };

  const handleNextStep = () => {
    const startIndex = currentMbtiStageIndex * 8;
    const stageQs = mbtiQuestions.slice(startIndex, startIndex + 8);
    const firstMissing = stageQs.find((question) => {
      const qAns = mbtiAnswers[question.id];
      return !qAns || qAns.a === null || qAns.b === null;
    });

    if (firstMissing) {
      setMbtiErrorMessage(`Por favor, atribua notas de 0 a 3 para ambas as alternativas da pergunta ${firstMissing.id}.`);
      return;
    }

    setMbtiErrorMessage(null);
    if (currentMbtiStageIndex < 7) {
      setCurrentMbtiStageIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleFinishMBTITest();
    }
  };

  const handlePrevStep = () => {
    setMbtiErrorMessage(null);
    if (currentMbtiStageIndex > 0) {
      setCurrentMbtiStageIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setMbtiState('initial');
    }
  };

  return (
    <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200/70 bg-white/85 p-6 text-left shadow-[0_10px_28px_rgba(15,23,42,0.035)] md:p-7">
      <header>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="inline-flex h-7 items-center rounded-xl border border-[#533af6]/20 bg-[#533af6]/10 px-3 text-[11px] font-semibold text-[#533af6]">
              Etapa {currentMbtiStageIndex + 1} de 8
            </span>
            <h2 className="mt-3 text-[20px] font-semibold tracking-tight text-[#343241]">Dimensões de personalidade MBTI</h2>
          </div>
          <span className="text-[12px] font-semibold text-slate-400">{progressPercent}% concluído</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-[#533af6] transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
      </header>

      <div className="mt-5 rounded-2xl border border-slate-200/70 bg-[#fbfaff] p-4 text-[12px] font-medium leading-relaxed text-slate-500">
        Dê uma nota de <strong className="text-[#343241]">0 a 3</strong> para cada alternativa. 3 = parece muito comigo, 0 = não parece nada comigo.
      </div>

      {mbtiErrorMessage && (
        <div className="mt-5 rounded-2xl border border-[#ff4b8c]/20 bg-[#ff4b8c]/10 p-4 text-[12px] font-semibold text-[#ff4b8c]">
          {mbtiErrorMessage}
        </div>
      )}

      <div className="mt-6 space-y-4">
        {stageQuestions.map((question) => {
          const ans = mbtiAnswers[question.id] || { a: null, b: null };
          return (
            <article key={question.id} className="rounded-2xl border border-slate-200/70 bg-white p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#940dff] text-[11px] font-semibold text-white">{question.id}</span>
                <h3 className="text-[14px] font-semibold leading-relaxed text-[#343241]">{question.text}</h3>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
                <MbtiOptionCard label={question.optionA.text} value={ans.a} onSelect={(score) => handleSelectMbtiScore(question.id, 'a', score)} />
                <MbtiOptionCard label={question.optionB.text} value={ans.b} onSelect={(score) => handleSelectMbtiScore(question.id, 'b', score)} />
              </div>
            </article>
          );
        })}
      </div>

      <footer className="mt-7 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
        <button type="button" onClick={handlePrevStep} className="h-8 rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12">Anterior</button>
        <button type="button" disabled={isSavingMbti} onClick={handleNextStep} className="flex h-8 items-center gap-2 rounded-xl bg-[#940dff] px-5 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none">
          {isSavingMbti ? <><Loader2 size={13} className="animate-spin" /> Salvando...</> : currentMbtiStageIndex === 7 ? 'Finalizar e enviar' : 'Próxima etapa'}
        </button>
      </footer>
    </section>
  );
}

function MbtiOptionCard({ label, value, onSelect }: { label: string; value: number | null; onSelect: (score: number) => void }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-[#fbfaff] p-4">
      <p className="min-h-[42px] text-[12px] font-medium leading-relaxed text-slate-600">{label}</p>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <span className="text-[11px] font-semibold text-slate-400">Sua nota</span>
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((num) => {
            const isActive = value === num;
            return (
              <button key={num} type="button" onClick={() => onSelect(num)} className={`h-8 w-8 rounded-xl border text-[12px] font-semibold transition-all ${isActive ? 'border-[#940dff] bg-[#940dff] text-white' : 'border-slate-200 bg-white text-slate-500 hover:border-[#940dff]/24 hover:bg-[#f3e5ff] hover:text-[#940dff]'}`}>
                {num}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}