import { Check, Plus } from 'lucide-react';

export const RESUME_SECTIONS = [
  { id: 'info', title: 'Dados pessoais', desc: 'Foto de perfil, nome completo, contato, pretens\u00e3o salarial e links de redes sociais.' },
  { id: 'summary', title: 'Resumo profissional', desc: 'Uma apresenta\u00e7\u00e3o objetiva sobre objetivos, conquistas e trajet\u00f3ria profissional.' },
  { id: 'experience', title: 'Experi\u00eancias', desc: 'Hist\u00f3rico de trabalho, cargos anteriores, per\u00edodos e responsabilidades.' },
  { id: 'education', title: 'Forma\u00e7\u00e3o acad\u00eamica', desc: 'Gradua\u00e7\u00f5es, faculdades, cursos t\u00e9cnicos, certifica\u00e7\u00f5es e datas.' },
  { id: 'skills', title: 'Habilidades', desc: 'Compet\u00eancias t\u00e9cnicas ou comportamentais e n\u00edvel de dom\u00ednio.' },
  { id: 'languages', title: 'Idiomas', desc: 'L\u00ednguas estrangeiras que voc\u00ea fala e o n\u00edvel de flu\u00eancia.' },
  { id: 'achievements', title: 'Certifica\u00e7\u00f5es', desc: 'Cursos extracurriculares, workshops, licen\u00e7as profissionais e certificados.' },
  { id: 'diversity', title: 'Diversidade', desc: 'Informa\u00e7\u00f5es opcionais de acessibilidade, g\u00eanero, ra\u00e7a ou orienta\u00e7\u00e3o.' },
];

interface CandidateResumeSectionGridProps {
  isSectionCompleted: (sectionId: string) => boolean;
  onOpenSection: (sectionId: string) => void;
}

export function CandidateResumeSectionGrid({
  isSectionCompleted,
  onOpenSection,
}: CandidateResumeSectionGridProps) {
  return (
    <div className="grid w-full grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
      {RESUME_SECTIONS.map((section) => {
        const isCompleted = isSectionCompleted(section.id);

        return (
          <article
            key={section.id}
            className="group flex min-h-[150px] flex-col justify-between rounded-2xl border border-[#940dff]/12 bg-white p-3 text-left shadow-[0_8px_18px_rgba(148,13,255,0.055)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#940dff]/20 hover:bg-white md:min-h-[140px] md:p-5"
          >
            <div>
              <div className="flex min-h-6 items-start justify-between gap-2 md:gap-3">
                <h3 className="pt-0.5 text-[12px] font-semibold leading-tight text-[#343241] transition-colors group-hover:text-[#940dff] md:text-[14px]">
                  {section.title}
                </h3>
                <span className={`inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-lg px-2 text-[10px] font-semibold ${
                  isCompleted ? 'bg-[#63e1a5] text-white' : 'bg-slate-50 text-slate-400'
                }`}>
                  {isCompleted ? <Check size={11} className="stroke-[3]" /> : 'Pendente'}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-[11px] font-medium leading-relaxed text-slate-400 md:mt-3 md:line-clamp-3 md:text-[12px]">
                {section.desc}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenSection(section.id)}
              className="mt-3 flex h-8 w-full items-center justify-center gap-1.5 rounded-xl border border-[#940dff] bg-white px-2 text-[11px] font-semibold text-[#940dff] transition-all hover:bg-[#f3e5ff] active:scale-[0.98] md:mt-5 md:gap-2 md:px-4 md:text-[12px]"
              title={`Editar ${section.title}`}
            >
              <Plus size={14} />
              {'Editar se\u00e7\u00e3o'}
            </button>
          </article>
        );
      })}
    </div>
  );
}
