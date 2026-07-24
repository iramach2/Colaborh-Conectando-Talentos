import { CheckCircle2, Clock3 } from 'lucide-react';
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
          <div className="min-w-0 flex-1">
            <p className="max-w-2xl text-[12px] font-medium leading-relaxed text-slate-400">
              {'Complete as se\u00e7\u00f5es do seu perfil para deixar seu curr\u00edculo mais claro para as empresas.'}
            </p>
          </div>

          <CandidateResumeActionMenu
            showActionDropdown={showActionDropdown}
            setShowActionDropdown={setShowActionDropdown}
            onAIParse={onAIParse}
            onDownloadResume={onDownloadResume}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
          <div className="col-span-2 rounded-2xl border border-[#940dff] bg-[#940dff] p-4 text-white shadow-[0_14px_30px_rgba(148,13,255,0.22)] md:col-span-1">
            <p className="text-[11px] font-semibold text-white/85">Progresso</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-2xl font-semibold text-white">{completionPercentage}%</span>
              <span className="pb-1 text-[12px] font-medium text-white/75">preenchido</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/25">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#63e1a5] bg-[#63e1a5] p-4 text-white shadow-[0_14px_30px_rgba(99,225,165,0.22)]">
            <div className="flex items-center gap-2 text-white">
              <CheckCircle2 size={16} />
              <p className="text-[11px] font-semibold">{'Se\u00e7\u00f5es completas'}</p>
            </div>
            <p className="mt-2 text-2xl font-semibold text-white">{completedSections}</p>
          </div>

          <div className="rounded-2xl border border-[#ffc24b] bg-[#ffc24b] p-4 text-white shadow-[0_14px_30px_rgba(255,194,75,0.24)]">
            <div className="flex items-center gap-2 text-white">
              <Clock3 size={16} />
              <p className="text-[11px] font-semibold">Pendentes</p>
            </div>
            <p className="mt-2 text-2xl font-semibold text-white">{pendingSections}</p>
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
