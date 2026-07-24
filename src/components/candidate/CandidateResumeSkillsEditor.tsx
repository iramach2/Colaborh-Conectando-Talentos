import { Plus, X } from 'lucide-react';
import { ResumeFieldLabel, ResumeSectionCard, resumeInputClass } from './CandidateResumeEditorPrimitives';

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
    <ResumeSectionCard className="!border-0 !bg-white !p-0">
      <div className="space-y-4">
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
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12 active:scale-95"
              aria-label="Adicionar habilidade"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {skills.length === 0 ? (
          <div className="px-4 py-6 text-center">
            <p className="text-[13px] font-semibold text-[#343241]">Nenhuma habilidade adicionada</p>
            <p className="mx-auto mt-1 max-w-xs text-[12px] font-medium text-slate-400">Adicione competências técnicas ou comportamentais.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={`${skill}-${index}`} className="inline-flex h-8 items-center gap-2 rounded-xl border border-[#63e1a5]/35 bg-[#63e1a5]/14 px-3 text-[12px] font-semibold text-[#2f9f6b]">
                {skill}
                <button
                  type="button"
                  onClick={() => onChange(skills.filter((_, skillIndex) => skillIndex !== index))}
                  className="flex h-4 w-4 items-center justify-center rounded-full border-0 bg-transparent text-[#2f9f6b] transition-colors hover:text-[#23845a]"
                  aria-label={`Remover ${skill}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </ResumeSectionCard>
  );
}
