import { Languages, X, ChevronDown } from 'lucide-react';
import type { CandidateLanguage } from '../../types/candidate';
import { ResumeEmptyState, ResumeFieldLabel, ResumeGhostButton, ResumePrimaryButton, ResumeSectionCard, resumeInputClass, resumeSelectClass } from './CandidateResumeEditorPrimitives';

type LanguageLevel = 'Básico' | 'Intermediário' | 'Avançado' | 'Fluente';

interface CandidateResumeLanguagesEditorProps {
  languages?: CandidateLanguage[];
  showLangModal: boolean;
  onAddLanguage: (language: string, level: CandidateLanguage['level']) => void;
  onRemoveLanguage: (id: string) => void;
  onCloseModal: () => void;
}

export function CandidateResumeLanguagesEditor({
  languages,
  showLangModal,
  onAddLanguage,
  onRemoveLanguage,
  onCloseModal,
}: CandidateResumeLanguagesEditorProps) {
  if (showLangModal) {
    return (
      <ResumeSectionCard className="!border-0 !bg-white !p-0">
        <form className="space-y-4" onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          onAddLanguage(
            formData.get('language') as string,
            formData.get('level') as LanguageLevel,
          );
          onCloseModal();
        }}>
          <div>
            <ResumeFieldLabel>Idioma</ResumeFieldLabel>
            <input name="language" required className={resumeInputClass} placeholder="Ex: Inglês, Espanhol, Alemão..." />
          </div>
          <div>
            <ResumeFieldLabel>Nível de proficiência</ResumeFieldLabel>
            <div className="relative">
              <select name="level" defaultValue="Básico" className={resumeSelectClass}>
                <option value="Básico">Básico</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
                <option value="Fluente">Fluente</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#940dff]" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <ResumeGhostButton onClick={onCloseModal}>Cancelar</ResumeGhostButton>
            <ResumePrimaryButton type="submit" className="shadow-none">Adicionar</ResumePrimaryButton>
          </div>
        </form>
      </ResumeSectionCard>
    );
  }

  return (
    <ResumeSectionCard className="!border-0 !bg-white !p-0">
      {(!languages || languages.length === 0) ? (
        <ResumeEmptyState icon={Languages} title="Nenhum idioma adicionado" description="Inclua idiomas e o nível de fluência." />
      ) : (
        <div className="flex flex-wrap gap-2">
          {languages.map((item) => (
            <span key={item.id} className="inline-flex h-8 items-center gap-2 rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-3 text-[12px] font-semibold text-[#940dff]">
              {item.language}
              <span className="rounded-lg bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-[#940dff]">{item.level}</span>
              <button type="button" onClick={() => onRemoveLanguage(item.id)} className="flex h-4 w-4 items-center justify-center border-0 bg-transparent text-[#940dff] hover:text-[#940dff]" aria-label={`Remover ${item.language}`}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </ResumeSectionCard>
  );
}