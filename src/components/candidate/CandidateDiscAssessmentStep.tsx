import { Dispatch, SetStateAction } from 'react';
import type { DiscAnswer, DiscQuestion } from '../../types/candidate';

type DiscFactor = 'D' | 'I' | 'S' | 'C';

interface CandidateDiscAssessmentStepProps {
  perguntasDISC: DiscQuestion[];
  currentBlockIndex: number;
  setCurrentBlockIndex: Dispatch<SetStateAction<number>>;
  discAnswers: DiscAnswer[];
  setDiscAnswers: Dispatch<SetStateAction<DiscAnswer[]>>;
  discErrorMessage: string | null;
  setDiscErrorMessage: Dispatch<SetStateAction<string | null>>;
  handleFinishDISCTest: () => void;
}

export function CandidateDiscAssessmentStep({
  perguntasDISC,
  currentBlockIndex,
  setCurrentBlockIndex,
  discAnswers,
  setDiscAnswers,
  discErrorMessage,
  setDiscErrorMessage,
  handleFinishDISCTest,
}: CandidateDiscAssessmentStepProps) {
  const totalQuestions = perguntasDISC.length;
  const block = perguntasDISC[currentBlockIndex];
  const currentAns = discAnswers[currentBlockIndex] || { D: null, I: null, S: null, C: null };
  const isBlockValid = currentAns.D !== null && currentAns.I !== null && currentAns.S !== null && currentAns.C !== null;
  const progressPercent = totalQuestions > 0 ? Math.round(((currentBlockIndex + 1) / totalQuestions) * 100) : 0;

  const handleSelectRank = (factorKey: DiscFactor, rank: number) => {
    setDiscAnswers((prev) => prev.map((ans, idx) => {
      if (idx !== currentBlockIndex) return ans;

      let previousFactorForRank: DiscFactor | null = null;
      if (ans.D === rank) previousFactorForRank = 'D';
      else if (ans.I === rank) previousFactorForRank = 'I';
      else if (ans.S === rank) previousFactorForRank = 'S';
      else if (ans.C === rank) previousFactorForRank = 'C';

      const currentFactorOldRank = ans[factorKey];
      const newAns = { ...ans };
      newAns[factorKey] = rank;

      if (previousFactorForRank && previousFactorForRank !== factorKey) {
        newAns[previousFactorForRank] = currentFactorOldRank;
      }

      return newAns;
    }));
  };

  if (!block) {
    return (
      <section className="mx-auto max-w-4xl rounded-2xl border border-[#ff4b8c]/20 bg-white/85 p-6 text-left shadow-[0_10px_28px_rgba(15,23,42,0.035)] md:p-7">
        <p className="text-[14px] font-semibold text-[#ff4b8c]">Não foi possível carregar esta pergunta.</p>
      </section>
    );
  }

  const factorsList: Array<{ key: DiscFactor; text: string }> = [
    { key: 'D', text: block.opcoes.D },
    { key: 'I', text: block.opcoes.I },
    { key: 'S', text: block.opcoes.S },
    { key: 'C', text: block.opcoes.C },
  ];

  return (
    <section className="mx-auto max-w-4xl rounded-2xl border border-slate-200/70 bg-white/85 p-6 text-left shadow-[0_10px_28px_rgba(15,23,42,0.035)] md:p-7">
      <header>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="inline-flex min-h-8 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff]">
              <span>Pergunta</span>
              <strong>{currentBlockIndex + 1}</strong>
              <span>de</span>
              <strong>{totalQuestions}</strong>
            </span>
            <h2 className="mt-3 max-w-full break-words text-[22px] font-semibold leading-tight tracking-tight text-[#343241] sm:text-[24px]">{block.pergunta}</h2>
          </div>
          <span className="text-[12px] font-semibold text-slate-400">{progressPercent}% concluído</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-[#940dff] transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
      </header>

      <div className="mt-5 rounded-2xl border border-slate-200/70 bg-[#fbfaff] p-4 text-[12px] font-medium leading-relaxed text-slate-500">
        Atribua notas de <strong className="text-[#343241]">4 a 1</strong> para as alternativas. Se escolher uma nota já usada, o sistema troca automaticamente.
      </div>

      {discErrorMessage && (
        <div className="mt-5 rounded-2xl border border-[#ff4b8c]/20 bg-[#ff4b8c]/10 p-4 text-[12px] font-semibold text-[#ff4b8c]">
          {discErrorMessage}
        </div>
      )}

      <div className="mt-6 space-y-3">
        {factorsList.map((factor) => {
          const val = currentAns[factor.key];

          return (
            <div key={factor.key} className="rounded-2xl border border-slate-200/70 bg-white p-4 transition-colors hover:bg-[#fbfaff]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <p className="min-w-0 flex-1 whitespace-normal break-words text-[13px] font-semibold leading-relaxed text-[#343241]">{factor.text}</p>
                <div className="grid shrink-0 grid-cols-4 gap-2">
                  {[4, 3, 2, 1].map((rank) => {
                    const isActive = val === rank;
                    return (
                      <button
                        key={rank}
                        type="button"
                        onClick={() => handleSelectRank(factor.key, rank)}
                        className={`h-10 rounded-xl border px-3 text-[12px] font-semibold transition-all ${
                          isActive
                            ? 'border-[#940dff] bg-[#940dff] text-white shadow-[0_10px_22px_rgba(148,13,255,0.18)]'
                            : 'border-slate-200 bg-white text-slate-500 hover:border-[#940dff]/24 hover:bg-[#f3e5ff] hover:text-[#940dff]'
                        }`}
                      >
                        {rank}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <footer className="mt-7 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={() => currentBlockIndex > 0 && setCurrentBlockIndex((prev) => prev - 1)}
          disabled={currentBlockIndex === 0}
          className="h-8 rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12 disabled:cursor-not-allowed disabled:opacity-45"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => {
            if (!isBlockValid) {
              setDiscErrorMessage('Por favor, atribua notas de 4 a 1 para todas as alternativas da pergunta.');
              return;
            }
            setDiscErrorMessage(null);
            if (currentBlockIndex < totalQuestions - 1) setCurrentBlockIndex((prev) => prev + 1);
            else handleFinishDISCTest();
          }}
          disabled={!isBlockValid}
          className="h-8 rounded-xl bg-[#940dff] px-5 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          {currentBlockIndex === totalQuestions - 1 ? 'Finalizar teste' : 'Próxima questão'}
        </button>
      </footer>
    </section>
  );
}