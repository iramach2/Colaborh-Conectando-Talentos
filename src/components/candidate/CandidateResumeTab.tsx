import { CheckCircle2, Clock3, FileText } from 'lucide-react';
import { CandidateResumeActionMenu } from './CandidateResumeActionMenu';
import { CandidateResumeSectionGrid, RESUME_SECTIONS } from './CandidateResumeSectionGrid';

interface CandidateResumeTabProps {
  showActionDropdown: boolean;
  setShowActionDropdown: (show: boolean) => void;
  isSectionCompleted: (sectionId: string) => boolean;
  onAIParse: (file: File) => void | Promise<void>;
  onOpenPreview: () => void;
  onDownloadResume: () => void;
  onOpenSection: (sectionId: string) => void;
}

export function CandidateResumeTab({
  showActionDropdown,
  setShowActionDropdown,
  isSectionCompleted,
  onAIParse,
  onOpenPreview,
  onDownloadResume,
  onOpenSection,
}: CandidateResumeTabProps) {
  const completedSections = RESUME_SECTIONS.filter((section) => isSectionCompleted(section.id)).length;
  const pendingSections = RESUME_SECTIONS.length - completedSections;
  const completionPercentage = Math.round((completedSections / RESUME_SECTIONS.length) * 100);

  return (
    <section className="w-full space-y-5 pb-12">
      <div className="p-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#940dff]/18 bg-[#f3e5ff] text-[#940dff]">
              <FileText size={19} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[20px] font-semibold tracking-tight text-[#343241]">Edição de currículo</h2>
              <p className="mt-1 max-w-2xl text-[12px] font-medium leading-relaxed text-slate-400">
                Complete as seções do seu perfil para deixar seu currículo mais claro para as empresas.
              </p>
            </div>
          </div>

          <CandidateResumeActionMenu
            showActionDropdown={showActionDropdown}
            setShowActionDropdown={setShowActionDropdown}
            onAIParse={onAIParse}
            onOpenPreview={onOpenPreview}
            onDownloadResume={onDownloadResume}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.025)]">
            <p className="text-[11px] font-semibold text-slate-400">Progresso</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-2xl font-semibold text-[#343241]">{completionPercentage}%</span>
              <span className="pb-1 text-[12px] font-medium text-slate-400">preenchido</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#940dff] transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#63e1a5]/18 bg-[#63e1a5]/[0.08] p-4">
            <div className="flex items-center gap-2 text-[#2f9f6b]">
              <CheckCircle2 size={16} />
              <p className="text-[11px] font-semibold">Seções completas</p>
            </div>
            <p className="mt-2 text-2xl font-semibold text-[#343241]">{completedSections}</p>
          </div>

          <div className="rounded-2xl border border-[#ffc24b]/24 bg-[#ffc24b]/[0.10] p-4">
            <div className="flex items-center gap-2 text-[#ffa303]">
              <Clock3 size={16} />
              <p className="text-[11px] font-semibold">Pendentes</p>
            </div>
            <p className="mt-2 text-2xl font-semibold text-[#343241]">{pendingSections}</p>
          </div>
        </div>
      </div>

      <CandidateResumeSectionGrid
        isSectionCompleted={isSectionCompleted}
        onOpenSection={onOpenSection}
      />
    </section>
  );
}