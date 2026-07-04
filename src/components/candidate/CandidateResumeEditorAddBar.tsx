import { Plus } from 'lucide-react';
import { ResumeSecondaryButton } from './CandidateResumeEditorPrimitives';

interface CandidateResumeEditorAddBarProps {
  activeAccordion: string;
  isFirstJob: boolean;
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

export function CandidateResumeEditorAddBar({
  activeAccordion,
  isFirstJob,
  onAddExperience,
  onAddEducation,
  onAddLanguage,
  onAddAchievement,
}: CandidateResumeEditorAddBarProps) {
  if (!['experience', 'education', 'languages', 'achievements'].includes(activeAccordion)) {
    return null;
  }

  return (
    <div className="flex justify-end">
      {activeAccordion === 'experience' && !isFirstJob && (
        <AddButton title="Adicionar experiência" onClick={onAddExperience} />
      )}
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