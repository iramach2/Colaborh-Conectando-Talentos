import React from 'react';
import { motion } from 'motion/react';
import { ListChecks, Plus, Trash2 } from 'lucide-react';
import type { VacancyFormData } from '../../../utils/vacancyPayload';

interface CreateVacancyStepStagesProps {
  vacancyForm: VacancyFormData;
  setVacancyForm: React.Dispatch<React.SetStateAction<VacancyFormData>>;
  newStage: string;
  setNewStage: React.Dispatch<React.SetStateAction<string>>;
}

const inputClass = 'h-10 w-full rounded-xl border border-slate-200/80 bg-white px-4 text-[12px] font-medium text-[#343241] outline-none transition-all placeholder:text-slate-400 focus:border-[#940dff]/35 focus:ring-2 focus:ring-[#940dff]/10';

export const CreateVacancyStepStages: React.FC<CreateVacancyStepStagesProps> = ({ vacancyForm, setVacancyForm, newStage, setNewStage }) => {
  const addStage = () => {
    if (!newStage.trim()) return;
    const trimmedStage = newStage.trim();
    setVacancyForm((prev) => ({ ...prev, stages: [...prev.stages, trimmedStage] }));
    setNewStage('');
  };

  return (
    <motion.div key="step5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
        <div className="mb-5 flex items-center gap-3 text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f3e5ff] text-[#940dff]"><ListChecks size={18} /></div>
          <div>
            <h3 className="text-[18px] font-semibold text-[#343241]">Processo seletivo</h3>
            <p className="mt-1 text-[12px] font-medium text-slate-400">Defina as etapas que a pessoa candidata irá percorrer.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_0.85fr]">
          <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 divide-y divide-slate-100">
            {vacancyForm.stages.map((stage, index) => {
              const isResumeReview = stage === 'Analise de Curriculo' || stage === 'Análise de Currículo';
              return (
                <div key={`${stage}-${index}`} className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-[#fbf9ff]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f3e5ff] text-[12px] font-semibold text-[#940dff]">{index + 1}</div>
                  <div className="min-w-0 text-left">
                    <p className="truncate text-[13px] font-semibold text-[#343241]">{stage}</p>
                    <p className="mt-0.5 text-[11px] font-medium text-slate-400">{isResumeReview ? 'Etapa padrão da vaga' : 'Etapa personalizada'}</p>
                  </div>
                  {!isResumeReview ? (
                    <button type="button" onClick={() => setVacancyForm((prev) => ({ ...prev, stages: prev.stages.filter((_, stageIndex) => stageIndex !== index) }))} className="ml-auto flex h-8 w-8 items-center justify-center rounded-xl border border-[#ff4b8c]/18 bg-[#ff4b8c]/10 text-[#ff4b8c] transition-all hover:bg-[#ff4b8c]/14" title="Remover etapa">
                      <Trash2 size={14} />
                    </button>
                  ) : (
                    <span className="ml-auto inline-flex h-8 items-center rounded-xl border border-[#63e1a5]/25 bg-[#63e1a5]/14 px-3 text-[11px] font-semibold text-[#2f9f6b]">Obrigatória</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-[#fbf9ff] p-4 text-left">
            <p className="text-[14px] font-semibold text-[#343241]">Adicionar nova etapa</p>
            <div className="mt-3 flex gap-2">
              <input type="text" value={newStage} onChange={(event) => setNewStage(event.target.value)} placeholder="Ex: Dinâmica em grupo..." className={`${inputClass} flex-1`} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addStage(); } }} />
              <button type="button" onClick={addStage} className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#940dff] text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95"><Plus size={14} /></button>
            </div>
            <p className="mt-3 text-[12px] font-medium leading-relaxed text-slate-400">A etapa inicial de análise de currículo é padrão e não pode ser removida.</p>
          </div>
        </div>
      </section>
    </motion.div>
  );
};
