import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Plus, SlidersHorizontal, Trash2, UserRoundCheck } from 'lucide-react';
import type { VacancyFormData } from '../../../utils/vacancyPayload';
import { VacancyFieldLabel, vacancyInputClass, vacancySelectClass } from './createVacancyStyles';

const commonRequirements = [
  'Experiência prévia',
  'Inglês Intermediário',
  'Disponibilidade de horário',
  'Proatividade',
  'Trabalho em equipe',
];

interface CreateVacancyStepRequirementsProps {
  vacancyForm: VacancyFormData;
  setVacancyForm: React.Dispatch<React.SetStateAction<VacancyFormData>>;
  newRequirement: string;
  setNewRequirement: React.Dispatch<React.SetStateAction<string>>;
}

const SectionTitle = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="mb-5 flex items-center gap-3 text-left">
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#63e1a5]/14 text-[#2f9f6b]">{icon}</div>
    <div>
      <h3 className="text-[18px] font-semibold text-[#343241]">{title}</h3>
      <p className="mt-1 text-[12px] font-medium text-slate-400">{description}</p>
    </div>
  </div>
);

export const CreateVacancyStepRequirements: React.FC<CreateVacancyStepRequirementsProps> = ({
  vacancyForm,
  setVacancyForm,
  newRequirement,
  setNewRequirement,
}) => (
  <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[0.85fr_1.15fr]">
      <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
        <SectionTitle icon={<SlidersHorizontal size={18} />} title="Configurações da vaga" description="Informe volume, motivo e critérios gerais." />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="text-left">
            <VacancyFieldLabel>Vagas disponíveis <span className="text-[#ff4b8c]">*</span></VacancyFieldLabel>
            <input type="number" min="1" value={vacancyForm.positions} onChange={(event) => setVacancyForm((prev) => ({ ...prev, positions: event.target.value }))} placeholder="Ex: 2" className={vacancyInputClass} />
          </div>

          <div className="text-left">
            <VacancyFieldLabel>Motivo da requisição <span className="text-[#ff4b8c]">*</span></VacancyFieldLabel>
            <div className="relative">
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select value={vacancyForm.requestReason} onChange={(event) => setVacancyForm((prev) => ({ ...prev, requestReason: event.target.value }))} className={vacancySelectClass}>
                <option value="">Selecione o motivo</option>
                <option value="Aumento de Quadro">Aumento de Quadro (Nova Posição)</option>
                <option value="Substituicao">Substituição (Reposição de Funcionário)</option>
                <option value="Projeto Temporario">Projeto Temporário</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="flex cursor-pointer select-none items-start gap-3 rounded-2xl border border-slate-200/70 bg-[#fbf9ff] p-4 text-left">
            <input type="checkbox" checked={vacancyForm.isFirstJob} onChange={(event) => setVacancyForm((prev) => ({ ...prev, isFirstJob: event.target.checked }))} className="mt-0.5 h-4 w-4 cursor-pointer rounded border-slate-300 text-[#63e1a5] focus:ring-[#63e1a5]" />
            <div>
              <span className="block text-[13px] font-semibold text-[#343241]">Aceita 1º emprego?</span>
              <span className="mt-1 block text-[12px] font-medium text-slate-400">Ideal para iniciantes no mercado.</span>
            </div>
          </label>

          <label className="flex cursor-pointer select-none items-start gap-3 rounded-2xl border border-slate-200/70 bg-[#fbf9ff] p-4 text-left">
            <input type="checkbox" checked={vacancyForm.isPcd} onChange={(event) => setVacancyForm((prev) => ({ ...prev, isPcd: event.target.checked }))} className="mt-0.5 h-4 w-4 cursor-pointer rounded border-slate-300 text-[#63e1a5] focus:ring-[#63e1a5]" />
            <div>
              <span className="block text-[13px] font-semibold text-[#343241]">Vaga também para PcD?</span>
              <span className="mt-1 block text-[12px] font-medium text-slate-400">Sinalize inclusão no processo seletivo.</span>
            </div>
          </label>
        </div>

        {vacancyForm.isPcd && (
          <div className="mt-4 text-left">
            <VacancyFieldLabel>Detalhes sobre a PcD</VacancyFieldLabel>
            <input type="text" value={vacancyForm.pcdDetails} onChange={(event) => setVacancyForm((prev) => ({ ...prev, pcdDetails: event.target.value }))} placeholder="Ex: Acessibilidade física, auditiva, visual leve..." className={vacancyInputClass} />
          </div>
        )}

        <div className="mt-4 rounded-2xl border border-slate-200/70 bg-[#fbf9ff] p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[12px] font-semibold text-slate-500">Idade mínima</span>
            <span className="text-[12px] font-semibold text-[#2f9f6b]">{vacancyForm.minAge} anos</span>
          </div>
          <input type="range" min="16" max="50" value={vacancyForm.minAge} onChange={(event) => setVacancyForm((prev) => ({ ...prev, minAge: parseInt(event.target.value) }))} className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-[#63e1a5]" />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
        <SectionTitle icon={<UserRoundCheck size={18} />} title="Requisitos da vaga" description="Selecione requisitos comuns ou adicione critérios específicos." />

        <div className="flex flex-wrap gap-2">
          {commonRequirements.map((requirement) => {
            const isSelected = vacancyForm.requirements.includes(requirement);
            return (
              <button key={requirement} type="button" onClick={() => {
                if (isSelected) setVacancyForm((prev) => ({ ...prev, requirements: prev.requirements.filter((item) => item !== requirement) }));
                else setVacancyForm((prev) => ({ ...prev, requirements: [...prev.requirements, requirement] }));
              }} className={`h-8 rounded-xl border px-3 text-[12px] font-semibold transition-all ${isSelected ? 'border-[#63e1a5]/25 bg-[#63e1a5]/14 text-[#2f9f6b]' : 'border-white/70 bg-white text-slate-500 hover:border-[#63e1a5]/25 hover:bg-[#63e1a5]/10 hover:text-[#2f9f6b]'}`}>
                {requirement}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex gap-2">
          <input type="text" value={newRequirement} onChange={(event) => setNewRequirement(event.target.value)} placeholder="Outro requisito (ex: Certificação Scrum Master)..." className={`${vacancyInputClass} flex-1`} onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              if (newRequirement.trim()) {
                setVacancyForm((prev) => ({ ...prev, requirements: [...prev.requirements, newRequirement.trim()] }));
                setNewRequirement('');
              }
            }
          }} />
          {newRequirement && <button type="button" onClick={() => { setVacancyForm((prev) => ({ ...prev, requirements: [...prev.requirements, newRequirement.trim()] })); setNewRequirement(''); }} className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#63e1a5] text-white shadow-[0_10px_22px_rgba(99,225,165,0.18)] transition-all hover:bg-[#40b87f] active:scale-95"><Plus size={14} /></button>}
        </div>

        {vacancyForm.requirements.length > 0 && (
          <div className="mt-4 rounded-2xl border border-slate-200/70 bg-[#fbf9ff] p-4">
            <div className="flex flex-wrap gap-2">
              {vacancyForm.requirements.map((requirement, index) => (
                <div key={index} className="flex h-8 items-center gap-2 rounded-xl border border-[#63e1a5]/20 bg-[#63e1a5]/14 px-3 text-[11px] font-semibold text-[#2f9f6b]">
                  <span>{requirement}</span>
                  <button type="button" onClick={() => setVacancyForm((prev) => ({ ...prev, requirements: prev.requirements.filter((_, itemIndex) => itemIndex !== index) }))} className="text-[#40b87f]/70 hover:text-[#ff4b8c]"><Trash2 size={12} /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  </motion.div>
);
