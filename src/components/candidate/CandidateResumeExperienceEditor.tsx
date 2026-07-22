import React from 'react';
import { Briefcase, Building, Clock, Sparkles, Trash2, Pencil } from 'lucide-react';
import type { CandidateExperience } from '../../types/candidate';
import { formatExperienceDurationWithPeriod } from '../../utils/candidateResumeCalculations';
import { ResumeEmptyState, ResumeFieldLabel, ResumeGhostButton, ResumePrimaryButton, ResumeSectionCard, resumeInputClass, resumeTextareaClass } from './CandidateResumeEditorPrimitives';

type Experience = CandidateExperience;

interface CandidateResumeExperienceEditorProps {
  experiences: Experience[];
  isFirstJob: boolean;
  showExperienceModal: boolean;
  editingExperience: Experience | null;
  tempExperience: Experience | null;
  calculateDuration: (startDate: string, endDate: string | null | undefined, current: boolean) => string;
  onToggleFirstJob: (isFirstJob: boolean) => void;
  onTempExperienceChange: React.Dispatch<React.SetStateAction<Experience | null>>;
  onSaveExperience: () => void;
  onCancelModal: () => void;
  onEditExperience: (experience: Experience) => void;
  onRemoveExperience: (experienceId: string) => void;
}

export function CandidateResumeExperienceEditor({
  experiences,
  isFirstJob,
  showExperienceModal,
  editingExperience,
  tempExperience,
  calculateDuration,
  onToggleFirstJob,
  onTempExperienceChange,
  onSaveExperience,
  onCancelModal,
  onEditExperience,
  onRemoveExperience,
}: CandidateResumeExperienceEditorProps) {
  if (showExperienceModal) {
    return (
      <ResumeSectionCard>
        <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSaveExperience(); }}>
          <p className="text-[13px] font-semibold text-[#343241]">{editingExperience ? 'Editar experiência' : 'Nova experiência'}</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2"><ResumeFieldLabel>Empresa</ResumeFieldLabel><input value={tempExperience?.company || ''} onChange={(event) => onTempExperienceChange((prev) => prev ? { ...prev, company: event.target.value } : null)} required className={resumeInputClass} placeholder="Ex: Google, Itaú, Ambev..." /></div>
            <div className="md:col-span-2"><ResumeFieldLabel>Cargo</ResumeFieldLabel><input value={tempExperience?.role || ''} onChange={(event) => onTempExperienceChange((prev) => prev ? { ...prev, role: event.target.value } : null)} required className={resumeInputClass} placeholder="Ex: Vendedor, Analista, Coordenador..." /></div>
            <div><ResumeFieldLabel>Data de início</ResumeFieldLabel><input type="date" value={tempExperience?.startDate || ''} onChange={(event) => onTempExperienceChange((prev) => prev ? { ...prev, startDate: event.target.value } : null)} required className={resumeInputClass} /></div>
            <div><ResumeFieldLabel>Data de término</ResumeFieldLabel><input type="date" value={tempExperience?.endDate || ''} onChange={(event) => onTempExperienceChange((prev) => prev ? { ...prev, endDate: event.target.value } : null)} disabled={tempExperience?.current} className={resumeInputClass} /></div>
            <div className="md:col-span-2"><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200/70 bg-[#fbfaff] p-3"><span className={`relative h-5 w-10 rounded-full transition-colors ${tempExperience?.current ? 'bg-[#63e1a5]' : 'bg-slate-200'}`} onClick={() => onTempExperienceChange((prev) => prev ? { ...prev, current: !prev.current, endDate: !prev.current ? '' : prev.endDate } : null)}><span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${tempExperience?.current ? 'translate-x-5' : ''}`} /></span><span className="text-[12px] font-semibold text-slate-500">Trabalho atualmente aqui</span></label></div>
            <div className="md:col-span-2"><ResumeFieldLabel>Principais atividades</ResumeFieldLabel><textarea value={tempExperience?.description || ''} onChange={(event) => onTempExperienceChange((prev) => prev ? { ...prev, description: event.target.value } : null)} required className={`${resumeTextareaClass} min-h-[110px] resize-none`} placeholder="Descreva brevemente suas principais entregas..." /></div>
          </div>
          <div className="flex justify-end gap-2 pt-2"><ResumeGhostButton onClick={onCancelModal}>Cancelar</ResumeGhostButton><ResumePrimaryButton type="submit">Salvar registro</ResumePrimaryButton></div>
        </form>
      </ResumeSectionCard>
    );
  }

  return (
    <div className="space-y-4">
      <ResumeSectionCard><label className="flex cursor-pointer items-center justify-between gap-3"><span><span className="block text-[13px] font-semibold text-[#343241]">Primeiro emprego</span><span className="mt-1 block text-[12px] font-medium text-slate-400">Ative caso ainda não tenha experiência profissional.</span></span><span className={`relative h-5 w-10 rounded-full transition-colors ${isFirstJob ? 'bg-[#63e1a5]' : 'bg-slate-200'}`}><span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${isFirstJob ? 'translate-x-5' : ''}`} /><input type="checkbox" className="hidden" checked={isFirstJob} onChange={(event) => onToggleFirstJob(event.target.checked)} /></span></label></ResumeSectionCard>
      {isFirstJob ? (
        <ResumeSectionCard className="text-center"><div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3e5ff] text-[#940dff]"><Sparkles size={20} /></div><p className="text-[13px] font-semibold text-[#343241]">Pronto para sua primeira oportunidade</p><p className="mt-1 text-[12px] font-medium text-slate-400">Seu currículo dará destaque à formação, habilidades e objetivos.</p></ResumeSectionCard>
      ) : experiences.length === 0 ? (
        <ResumeEmptyState icon={Briefcase} title="Nenhuma experiência adicionada" description="Inclua seus trabalhos anteriores para fortalecer seu currículo." />
      ) : (
        <div className="space-y-3">
          {experiences.map((experience) => (
            <ResumeSectionCard key={experience.id}>
              <div className="flex items-start justify-between gap-3"><div className="flex min-w-0 gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3e5ff] text-[#940dff]"><Building size={18} /></div><div className="min-w-0"><h3 className="text-[14px] font-semibold text-[#343241]">{experience.role}</h3><p className="mt-1 text-[12px] font-semibold text-slate-500">{experience.company}</p><p className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-slate-400"><Clock size={12} />{formatExperienceDurationWithPeriod(experience.startDate, experience.endDate, experience.current) || calculateDuration(experience.startDate, experience.endDate, experience.current)}</p></div></div><div className="flex shrink-0 gap-2"><button type="button" onClick={() => onEditExperience(experience)} className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] text-[#940dff]" aria-label="Editar experiência"><Pencil size={14} /></button><button type="button" onClick={() => onRemoveExperience(experience.id)} className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] text-[#940dff]" aria-label="Remover experiência"><Trash2 size={14} /></button></div></div>
              {experience.description && <p className="mt-4 whitespace-pre-line rounded-2xl bg-[#fbfaff] p-4 text-[12px] font-medium leading-relaxed text-slate-500">{experience.description}</p>}
            </ResumeSectionCard>
          ))}
        </div>
      )}
    </div>
  );
}