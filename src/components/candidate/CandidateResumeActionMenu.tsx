import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Brain, Download, MoreHorizontal } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface CandidateResumeActionMenuProps {
  showActionDropdown: boolean;
  setShowActionDropdown: Dispatch<SetStateAction<boolean>>;
  onAIParse: (file: File) => void;
  onDownloadResume: () => void;
}

export function CandidateResumeActionMenu({
  showActionDropdown,
  setShowActionDropdown,
  onAIParse,
  onDownloadResume,
}: CandidateResumeActionMenuProps) {
  const handleAIUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onAIParse(file);
    }
    setShowActionDropdown(false);
    event.target.value = '';
  };

  const openUpload = () => document.getElementById('ai-resume-upload')?.click();

  const menuActions = [
    { label: 'Preencher com IA', icon: Brain, onClick: openUpload },
    { label: 'Baixar PDF', icon: Download, onClick: onDownloadResume },
  ];

  return (
    <>
      <input
        type="file"
        id="ai-resume-upload"
        className="hidden"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        onChange={handleAIUpload}
      />

      <div className="hidden items-center gap-3 md:flex">
        <button
          type="button"
          onClick={openUpload}
          className="flex h-8 items-center justify-center gap-2 rounded-xl border border-[#940dff] bg-white px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:bg-[#f3e5ff] active:scale-95"
        >
          <Brain size={14} />
          Preencher com IA
        </button>
        <button
          type="button"
          onClick={onDownloadResume}
          className="flex h-8 items-center justify-center gap-2 rounded-xl bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95"
        >
          <Download size={14} />
          Baixar PDF
        </button>
      </div>

      <div className="relative md:hidden">
        <button
          type="button"
          onClick={() => setShowActionDropdown(!showActionDropdown)}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-500 shadow-sm transition-all hover:border-[#940dff]/20 hover:text-[#940dff]"
          title="Mais opções"
        >
          <MoreHorizontal size={17} />
        </button>

        <AnimatePresence>
          {showActionDropdown && (
            <>
              <div
                className="fixed inset-0 z-40 bg-transparent"
                onClick={() => setShowActionDropdown(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="company-dashboard-surface absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-slate-200/70 bg-white/95 p-2 text-left shadow-[0_18px_50px_rgba(106,66,220,0.10)] backdrop-blur-md"
              >
                {menuActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      type="button"
                      onClick={() => {
                        action.onClick();
                        if (action.label !== 'Preencher com IA') {
                          setShowActionDropdown(false);
                        }
                      }}
                      className="flex h-10 w-full items-center gap-3 rounded-xl border-0 bg-transparent px-3 text-left text-[12px] font-semibold text-slate-500 transition-all hover:bg-[#f3e5ff] hover:text-[#940dff]"
                    >
                      <Icon size={15} />
                      <span>{action.label}</span>
                    </button>
                  );
                })}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
