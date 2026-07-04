import { Award, ChevronDown, X } from 'lucide-react';
import type { CandidateAchievement } from '../../types/candidate';
import { ResumeEmptyState, ResumeFieldLabel, ResumeGhostButton, ResumePrimaryButton, ResumeSectionCard, resumeInputClass, resumeSelectClass, resumeTextareaClass } from './CandidateResumeEditorPrimitives';

type AchievementType = 'Certificado' | 'Curso' | 'Reconhecimento' | 'Trabalho Voluntário';

interface CandidateResumeAchievementsEditorProps {
  achievements?: CandidateAchievement[];
  showAchModal: boolean;
  onAddAchievement: (type: CandidateAchievement['type'], title: string, description: string) => void;
  onRemoveAchievement: (id: string) => void;
  onCloseModal: () => void;
}

export function CandidateResumeAchievementsEditor({
  achievements,
  showAchModal,
  onAddAchievement,
  onRemoveAchievement,
  onCloseModal,
}: CandidateResumeAchievementsEditorProps) {
  if (showAchModal) {
    return (
      <ResumeSectionCard>
        <form className="space-y-4" onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          onAddAchievement(
            formData.get('type') as AchievementType,
            formData.get('title') as string,
            formData.get('description') as string,
          );
          onCloseModal();
        }}>
          <div>
            <ResumeFieldLabel>Tipo</ResumeFieldLabel>
            <div className="relative">
              <select name="type" defaultValue="Curso" className={resumeSelectClass}>
                <option value="Curso">Curso</option>
                <option value="Certificado">Certificado</option>
                <option value="Reconhecimento">Reconhecimento</option>
                <option value="Trabalho Voluntário">Trabalho Voluntário</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#940dff]" />
            </div>
          </div>
          <div>
            <ResumeFieldLabel>Título</ResumeFieldLabel>
            <input name="title" required className={resumeInputClass} placeholder="Ex: UX Design Avançado, Scrum Master..." />
          </div>
          <div>
            <ResumeFieldLabel>Descrição opcional</ResumeFieldLabel>
            <textarea name="description" className={`${resumeTextareaClass} h-24 resize-none`} placeholder="Ex: Carga horária de 40h, emitido pela plataforma X..." />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <ResumeGhostButton onClick={onCloseModal}>Cancelar</ResumeGhostButton>
            <ResumePrimaryButton type="submit">Adicionar</ResumePrimaryButton>
          </div>
        </form>
      </ResumeSectionCard>
    );
  }

  return (
    <ResumeSectionCard>
      {(!achievements || achievements.length === 0) ? (
        <ResumeEmptyState icon={Award} title="Nenhuma conquista adicionada" description="Inclua cursos, certificados e reconhecimentos." />
      ) : (
        <div className="space-y-3">
          {achievements.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white p-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[13px] font-semibold text-[#343241]">{item.title}</p>
                  <span className="rounded-lg border border-[#940dff]/16 bg-[#f3e5ff] px-2 py-1 text-[10px] font-semibold text-[#940dff]">{item.type}</span>
                </div>
                {item.description && <p className="mt-1 text-[12px] font-medium leading-relaxed text-slate-400">{item.description}</p>}
              </div>
              <button type="button" onClick={() => onRemoveAchievement(item.id)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] text-[#940dff] transition-all hover:bg-[#940dff]/12" aria-label="Remover certificação">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </ResumeSectionCard>
  );
}