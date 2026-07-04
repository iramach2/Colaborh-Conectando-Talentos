import { Plus, X } from 'lucide-react';
import { ResumeFieldLabel, ResumeSectionCard, ResumeEmptyState, resumeInputClass } from './CandidateResumeEditorPrimitives';
import { Star } from 'lucide-react';

interface CandidateResumeSkillsEditorProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export function CandidateResumeSkillsEditor({ skills, onChange }: CandidateResumeSkillsEditorProps) {
  const addSkill = (input: HTMLInputElement) => {
    const value = input.value.trim();
    if (value && !skills.includes(value)) {
      onChange([...skills, value]);
      input.value = '';
    }
  };

  return (
    <ResumeSectionCard>
      <div className="space-y-4">
        {skills.length === 0 ? (
          <ResumeEmptyState icon={Star} title="Nenhuma habilidade adicionada" description="Adicione competências técnicas ou comportamentais." />
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={`${skill}-${index}`} className="inline-flex h-8 items-center gap-2 rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-3 text-[12px] font-semibold text-[#940dff]">
                {skill}
                <button
                  type="button"
                  onClick={() => onChange(skills.filter((_, skillIndex) => skillIndex !== index))}
                  className="flex h-4 w-4 items-center justify-center rounded-full border-0 bg-transparent text-[#940dff] transition-colors hover:text-[#940dff]"
                  aria-label={`Remover ${skill}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        <div>
          <ResumeFieldLabel>Nova habilidade</ResumeFieldLabel>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ex: React, Excel, Inglês..."
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  addSkill(event.currentTarget);
                }
              }}
              className={resumeInputClass}
            />
            <button
              type="button"
              onClick={(event) => {
                const input = event.currentTarget.previousElementSibling as HTMLInputElement;
                addSkill(input);
              }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#940dff] text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95"
              aria-label="Adicionar habilidade"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </ResumeSectionCard>
  );
}