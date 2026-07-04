import { ChevronDown, GraduationCap, Pencil, Trash2 } from 'lucide-react';
import type { CandidateEducation } from '../../types/candidate';
import { ResumeEmptyState, ResumeFieldLabel, ResumeGhostButton, ResumePrimaryButton, ResumeSectionCard, resumeInputClass, resumeSelectClass } from './CandidateResumeEditorPrimitives';

type Education = CandidateEducation;

interface CandidateResumeEducationEditorProps {
  educations: Education[];
  showEducationModal: boolean;
  editingEducation: Education | null;
  onSaveEducation: (education: Education) => void;
  onCancelModal: () => void;
  onEditEducation: (education: Education) => void;
  onRemoveEducation: (educationId: string) => void;
}

export function CandidateResumeEducationEditor({
  educations,
  showEducationModal,
  editingEducation,
  onSaveEducation,
  onCancelModal,
  onEditEducation,
  onRemoveEducation,
}: CandidateResumeEducationEditorProps) {
  if (showEducationModal) {
    return (
      <ResumeSectionCard>
        <form className="space-y-4" onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          onSaveEducation({
            id: editingEducation?.id || crypto.randomUUID(),
            institution: formData.get('institution') as string,
            course: formData.get('course') as string,
            status: formData.get('status') as Education['status'],
            gradYear: formData.get('gradYear') as string,
          });
        }}>
          <p className="text-[13px] font-semibold text-[#343241]">{editingEducation ? 'Editar formação' : 'Nova formação'}</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2"><ResumeFieldLabel>Instituição</ResumeFieldLabel><input name="institution" defaultValue={editingEducation?.institution} required className={resumeInputClass} placeholder="Ex: USP, Senac, Alura..." /></div>
            <div className="md:col-span-2"><ResumeFieldLabel>Curso</ResumeFieldLabel><input name="course" defaultValue={editingEducation?.course} required className={resumeInputClass} placeholder="Ex: Administração, Marketing..." /></div>
            <div><ResumeFieldLabel>Status atual</ResumeFieldLabel><div className="relative"><select name="status" defaultValue={editingEducation?.status || 'Completo'} className={resumeSelectClass}><option value="Completo">Completo</option><option value="Incompleto">Incompleto</option><option value="Cursando">Cursando</option></select><ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#940dff]" /></div></div>
            <div><ResumeFieldLabel>Ano de conclusão</ResumeFieldLabel><input name="gradYear" defaultValue={editingEducation?.gradYear} required className={resumeInputClass} placeholder="Ex: 2024" /></div>
          </div>
          <div className="flex justify-end gap-2 pt-2"><ResumeGhostButton onClick={onCancelModal}>Cancelar</ResumeGhostButton><ResumePrimaryButton type="submit">Salvar formação</ResumePrimaryButton></div>
        </form>
      </ResumeSectionCard>
    );
  }

  return (
    <div className="space-y-3">
      {educations.length === 0 ? (
        <ResumeEmptyState icon={GraduationCap} title="Nenhuma formação adicionada" description="Inclua cursos e instituições para completar seu perfil." />
      ) : (
        educations.map((education) => (
          <ResumeSectionCard key={education.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3e5ff] text-[#940dff]"><GraduationCap size={18} /></div><div className="min-w-0"><h3 className="text-[14px] font-semibold text-[#343241]">{education.course}</h3><p className="mt-1 text-[12px] font-semibold text-slate-500">{education.institution}</p><div className="mt-2 flex flex-wrap items-center gap-2"><span className={`rounded-lg px-2 py-1 text-[10px] font-semibold ${education.status === 'Completo' ? 'bg-[#f3e5ff] text-[#940dff]' : education.status === 'Cursando' ? 'bg-[#f3e5ff] text-[#940dff]' : 'bg-slate-100 text-slate-500'}`}>{education.status}</span><span className="text-[11px] font-medium text-slate-400">Ano: {education.gradYear}</span></div></div></div>
              <div className="flex shrink-0 gap-2"><button type="button" onClick={() => onEditEducation(education)} className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] text-[#940dff]" aria-label="Editar formação"><Pencil size={14} /></button><button type="button" onClick={() => onRemoveEducation(education.id)} className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] text-[#940dff]" aria-label="Remover formação"><Trash2 size={14} /></button></div>
            </div>
          </ResumeSectionCard>
        ))
      )}
    </div>
  );
}