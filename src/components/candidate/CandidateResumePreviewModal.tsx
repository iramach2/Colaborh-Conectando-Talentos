import { Download, Eye, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { CandidateResumeData } from '../../types/candidate';
import { ResumeA4Preview } from './ResumeA4Preview';

interface CandidateResumePreviewModalProps {
  isOpen: boolean;
  resumeData: CandidateResumeData;
  calculateAge: (birthDate: string) => string | number;
  calculateDuration: (startDate: string, endDate: string | null | undefined, current: boolean) => string;
  onClose: () => void;
  onDownload: () => void;
}

export function CandidateResumePreviewModal({
  isOpen,
  resumeData,
  calculateAge,
  calculateDuration,
  onClose,
  onDownload,
}: CandidateResumePreviewModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto">
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="bg-white/95 backdrop-blur-md rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col relative overflow-hidden shadow-2xl border border-white/20 z-[10000] text-left"
          >
            <div className="w-full flex items-center justify-between p-6 border-b border-slate-200/50 shrink-0 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#533af6]/10 text-[#533af6] flex items-center justify-center">
                  <Eye size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                    Visualização do Currículo
                  </h2>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                    Este é o formato oficial A4 gerado pela plataforma
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onDownload}
                  className="px-4 py-2 bg-[#533af6] hover:bg-[#4128df] text-white rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer border-0 flex items-center gap-2 active:scale-95"
                  title="Baixar PDF"
                >
                  <Download size={14} />
                  <span className="hidden sm:inline">Baixar PDF</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all cursor-pointer border-0"
                  title="Fechar"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-100/40 flex justify-center items-start">
              <div className="resume-preview-container flex justify-center w-full min-h-fit">
                <ResumeA4Preview
                  resumeData={resumeData}
                  calculateAge={calculateAge}
                  calculateDuration={calculateDuration}
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
