import type { ReactNode } from 'react';
import { Check, ChevronDown, Info } from 'lucide-react';
import { ResumeFieldLabel, ResumeSectionCard, resumeSelectClass } from './CandidateResumeEditorPrimitives';

interface DiversityData {
  pronoun: string;
  genderIdentity: string;
  sexualOrientation: string;
  race: string;
  consent: boolean;
}

interface CandidateResumeDiversityEditorProps {
  diversity?: DiversityData;
  onChange: (diversity: DiversityData) => void;
}

const emptyDiversity: DiversityData = {
  pronoun: '',
  genderIdentity: '',
  sexualOrientation: '',
  race: '',
  consent: false,
};

function SelectField({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: ReactNode }) {
  return (
    <div>
      <ResumeFieldLabel>{label}</ResumeFieldLabel>
      <div className="relative">
        <select value={value} onChange={(event) => onChange(event.target.value)} className={resumeSelectClass}>
          {children}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#940dff]" />
      </div>
    </div>
  );
}

export function CandidateResumeDiversityEditor({ diversity, onChange }: CandidateResumeDiversityEditorProps) {
  const current = { ...emptyDiversity, ...diversity };
  const updateDiversity = (patch: Partial<DiversityData>) => onChange({ ...current, ...patch });

  return (
    <div className="space-y-4">
      <ResumeSectionCard className="!border-0 !bg-white !p-0">
        <div className="flex gap-3 text-[#940dff]">
          <Info size={17} className="mt-0.5 shrink-0" />
          <p className="text-[12px] font-medium leading-relaxed">
            O preenchimento desta seção é opcional. As informações serão usadas em processos que utilizam recursos de diversidade e não serão utilizadas como critério de eliminação.
          </p>
        </div>
      </ResumeSectionCard>

      <ResumeSectionCard className="!border-0 !bg-white !p-0">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SelectField label="Pronome" value={current.pronoun} onChange={(value) => updateDiversity({ pronoun: value })}>
            <option value="">Selecione</option>
            <option value="Ele/Dele">Ele/Dele</option>
            <option value="Ela/Dela">Ela/Dela</option>
            <option value="Neutro">Neutro (Elu/Delu)</option>
            <option value="Outro">Outro</option>
            <option value="Prefiro não responder">Prefiro não responder</option>
          </SelectField>

          <SelectField label="Identidade de gênero" value={current.genderIdentity} onChange={(value) => updateDiversity({ genderIdentity: value })}>
            <option value="">Selecione</option>
            <option value="Cisgênero">Cisgênero</option>
            <option value="Transgênero">Transgênero</option>
            <option value="Não-binário">Não-binário</option>
            <option value="Prefiro não responder">Prefiro não responder</option>
          </SelectField>

          <SelectField label="Orientação sexual" value={current.sexualOrientation} onChange={(value) => updateDiversity({ sexualOrientation: value })}>
            <option value="">Selecione</option>
            <option value="Heterossexual">Heterossexual</option>
            <option value="Homossexual">Homossexual</option>
            <option value="Bissexual">Bissexual</option>
            <option value="Pansexual">Pansexual</option>
            <option value="Assexual">Assexual</option>
            <option value="Outro">Outro</option>
            <option value="Prefiro não responder">Prefiro não responder</option>
          </SelectField>

          <SelectField label="Cor / raça" value={current.race} onChange={(value) => updateDiversity({ race: value })}>
            <option value="">Selecione</option>
            <option value="Branco">Branca</option>
            <option value="Preto">Preta</option>
            <option value="Pardo">Parda</option>
            <option value="Amarelo">Amarela</option>
            <option value="Indígena">Indígena</option>
            <option value="Prefiro não responder">Prefiro não responder</option>
          </SelectField>
        </div>

        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200/70 bg-[#fbfaff] p-4">
          <input
            type="checkbox"
            checked={current.consent}
            onChange={(event) => updateDiversity({ consent: event.target.checked })}
            className="sr-only"
          />
          <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-all ${
            current.consent ? 'border-[#63e1a5] bg-[#63e1a5] text-white' : 'border-slate-300 bg-white text-transparent'
          }`}>
            <Check size={12} className="stroke-[3]" />
          </span>
          <span className="text-[12px] font-medium leading-relaxed text-slate-500">
            Consinto com o tratamento de dados de diversidade para vagas afirmativas.
          </span>
        </label>
      </ResumeSectionCard>
    </div>
  );
}