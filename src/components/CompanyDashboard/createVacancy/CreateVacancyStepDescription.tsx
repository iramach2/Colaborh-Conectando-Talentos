import React from 'react';
import { motion } from 'motion/react';
import { FileText } from 'lucide-react';
import type { VacancyFormData } from '../../../utils/vacancyPayload';

interface CreateVacancyStepDescriptionProps {
  vacancyForm: VacancyFormData;
  setVacancyForm: React.Dispatch<React.SetStateAction<VacancyFormData>>;
}

const textareaClass = 'min-h-[220px] w-full resize-y rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-[12px] font-medium leading-relaxed text-[#343241] outline-none transition-all placeholder:text-slate-400 focus:border-[#940dff]/35 focus:ring-2 focus:ring-[#940dff]/10';

const TextAreaField = ({ label, value, placeholder, helper, onChange }: {
  label: string;
  value: string;
  placeholder: string;
  helper: string;
  onChange: (value: string) => void;
}) => (
  <div className="flex flex-col gap-1.5 text-left">
    <label className="text-[12px] font-semibold text-slate-500">{label} <span className="text-[#ff4b8c]">*</span></label>
    <textarea rows={8} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={textareaClass} />
    <p className="text-[11px] font-medium leading-normal text-slate-400">{helper}</p>
  </div>
);

export const CreateVacancyStepDescription: React.FC<CreateVacancyStepDescriptionProps> = ({ vacancyForm, setVacancyForm }) => (
  <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
    <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
      <div className="mb-5 flex items-center gap-3 text-left">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#533af6]/10 text-[#533af6]"><FileText size={18} /></div>
        <div>
          <h3 className="text-[18px] font-semibold text-[#343241]">Descrição da vaga</h3>
          <p className="mt-1 text-[12px] font-medium text-slate-400">Explique a oportunidade e as principais responsabilidades.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <TextAreaField label="Descrição da vaga" value={vacancyForm.description} onChange={(value) => setVacancyForm((prev) => ({ ...prev, description: value }))} placeholder="Escreva sobre a vaga, cultura da empresa e a equipe..." helper="Use esse campo para apresentar o contexto da oportunidade e o que torna a vaga atrativa." />
        <TextAreaField label="Descrição de atribuições" value={vacancyForm.responsibilities} onChange={(value) => setVacancyForm((prev) => ({ ...prev, responsibilities: value }))} placeholder="Descreva as responsabilidades, atribuições e experiências desejáveis..." helper="Liste as atividades do dia a dia e as experiências esperadas para a pessoa candidata." />
      </div>
    </section>
  </motion.div>
);
