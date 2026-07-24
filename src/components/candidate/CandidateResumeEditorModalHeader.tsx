import { ElementType } from 'react';
import {
  Award,
  Briefcase,
  FileText,
  GraduationCap,
  HeartHandshake,
  Languages,
  Star,
  User,
  X,
} from 'lucide-react';

const SECTION_CONFIG: Record<string, { title: string; description: string; icon: ElementType; color: string; soft: string }> = {
  info: { title: 'Dados pessoais', description: 'Atualize suas informações principais.', icon: User, color: '#940dff', soft: '#f3e5ff' },
  summary: { title: 'Resumo profissional', description: 'Conte sua trajetória de forma objetiva.', icon: FileText, color: '#940dff', soft: '#f3e5ff' },
  experience: { title: 'Experiência profissional', description: 'Adicione empresas, cargos e atividades.', icon: Briefcase, color: '#940dff', soft: '#f3e5ff' },
  education: { title: 'Formação acadêmica', description: 'Informe cursos, instituições e status.', icon: GraduationCap, color: '#940dff', soft: '#f3e5ff' },
  skills: { title: 'Habilidades', description: 'Destaque suas principais competências.', icon: Star, color: '#940dff', soft: '#f3e5ff' },
  languages: { title: 'Idiomas', description: 'Liste idiomas e níveis de fluência.', icon: Languages, color: '#940dff', soft: '#f3e5ff' },
  achievements: { title: 'Certificações e cursos', description: 'Inclua cursos, certificados e reconhecimentos.', icon: Award, color: '#940dff', soft: '#f3e5ff' },
  diversity: { title: 'Diversidade', description: 'Preenchimento opcional e protegido.', icon: HeartHandshake, color: '#940dff', soft: '#f3e5ff' },
};

interface CandidateResumeEditorModalHeaderProps {
  activeAccordion: string;
  onClose: () => void;
}

export function CandidateResumeEditorModalHeader({
  activeAccordion,
  onClose,
}: CandidateResumeEditorModalHeaderProps) {
  const section = SECTION_CONFIG[activeAccordion] || SECTION_CONFIG.info;
  const Icon = section.icon;

  return (
    <div className="mb-3 flex shrink-0 items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/80"
          style={{ backgroundColor: section.soft, color: section.color }}
        >
          <Icon size={17} />
        </div>
        <div className="min-w-0">
          <h2 className="text-[18px] font-semibold tracking-tight text-[#343241]">{section.title}</h2>
          <p className="mt-0.5 text-[12px] font-medium leading-snug text-slate-400">{section.description}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-white text-[#940dff] transition-all hover:bg-[#f3e5ff] active:scale-95"
        title="Fechar"
      >
        <X size={17} />
      </button>
    </div>
  );
}