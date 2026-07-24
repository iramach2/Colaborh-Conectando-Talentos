import { Plus } from 'lucide-react';
import { ResumeSecondaryButton } from './CandidateResumeEditorPrimitives';

interface CandidateResumeEditorAddBarProps {
  activeAccordion: string;
  isFirstJob: boolean;
  experiencesCount: number;
  onToggleFirstJob: (isFirstJob: boolean) => void;
  onAddExperience: () => void;
  onAddEducation: () => void;
  onAddLanguage: () => void;
  onAddAchievement: () => void;
}

function AddButton({ title, onClick }: { title: string; onClick: () => void }) {
  return (
    <ResumeSecondaryButton onClick={onClick} title={title}>
      <Plus size={14} />
      Incluir
    </ResumeSecondaryButton>
  );
}

function FirstJobToggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <span>
        <span className="block text-[13px] font-semibold text-[#343241]">Primeiro emprego</span>
      </span>
      <span className={
        'relative h-5 w-10 rounded-full transition-colors ' +
        (checked ? 'bg-[#63e1a5]' : 'bg-slate-200')
      }>
        <span className={
          'absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ' +
          (checked ? 'translate-x-5' : '')
        } />
        <input
          type="checkbox"
          className="hidden"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
      </span>
    </label>
  );
}

export function CandidateResumeEditorAddBar({
  activeAccordion,
  isFirstJob,
  experiencesCount,
  onToggleFirstJob,
  onAddExperience,
  onAddEducation,
  onAddLanguage,
  onAddAchievement,
}: CandidateResumeEditorAddBarProps) {
  if (!['experience', 'education', 'languages', 'achievements'].includes(activeAccordion)) {
    return null;
  }

  if (activeAccordion === 'experience') {
    const hasExperiences = experiencesCount > 0;

    return (
      <div className="flex items-center justify-between gap-3">
        {!hasExperiences ? (
          <FirstJobToggle checked={isFirstJob} onChange={onToggleFirstJob} />
        ) : (
          <span aria-hidden="true" />
        )}
        {!isFirstJob && <AddButton title="Adicionar experiência" onClick={onAddExperience} />}
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      {activeAccordion === 'education' && (
        <AddButton title="Adicionar formação" onClick={onAddEducation} />
      )}
      {activeAccordion === 'languages' && (
        <AddButton title="Adicionar idioma" onClick={onAddLanguage} />
      )}
      {activeAccordion === 'achievements' && (
        <AddButton title="Adicionar conquista" onClick={onAddAchievement} />
      )}
    </div>
  );
}
