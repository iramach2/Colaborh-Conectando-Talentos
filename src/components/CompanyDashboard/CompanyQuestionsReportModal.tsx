import { RefObject } from 'react';
import { Clock, FileText, Loader2, X as CloseIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { CompanyApplicant } from '../../types/companyDashboard';
import { ALL_QUESTIONS_LIST, formatDate, QUESTIONS_CATEGORIES } from '../../utils/companyDashboardUtils';

interface CompanyQuestionsReportModalProps {
  isOpen: boolean;
  applicant: CompanyApplicant | null;
  modalRef: RefObject<HTMLDivElement>;
  activeCategoryTab: string;
  setActiveCategoryTab: (tab: string) => void;
  isExportingPDF: boolean;
  onExportPDF: (ref: RefObject<HTMLElement>, filename: string) => void;
  onClose: () => void;
}

export function CompanyQuestionsReportModal({
  isOpen,
  applicant,
  modalRef,
  activeCategoryTab,
  setActiveCategoryTab,
  isExportingPDF,
  onExportPDF,
  onClose,
}: CompanyQuestionsReportModalProps) {
  if (!isOpen || !applicant) return null;

  const category = QUESTIONS_CATEGORIES[activeCategoryTab as keyof typeof QUESTIONS_CATEGORIES];
  const responses = applicant.questionsResponses || {};
  const applicantName = applicant.candidate_name || applicant.name;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-slate-100"
        >
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#fbf9ff]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#533af6]/10 rounded-2xl flex items-center justify-center text-[#533af6] shadow-sm shrink-0 border border-[#533af6]/15" style={{ borderColor: 'rgba(83, 58, 246, 0.2)' }}>
                <FileText size={22} style={{ color: '#533af6' }} />
              </div>
              <div>
                <h4 className="text-sm font-semibold tracking-tight text-[#343241] leading-tight">
                  Mapeamento de Perfil
                </h4>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                  <p className="text-[12px] font-medium text-slate-400 pb-0.5">
                    Candidato: {applicantName}
                  </p>
                  <span className="text-[10px] text-slate-300 font-bold">•</span>
                  <p className="text-[12px] font-medium text-[#533af6] flex items-center gap-1">
                    <Clock size={10} /> Realizado em: {formatDate(applicant.completedAt || applicant.created_at)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => onExportPDF(modalRef, `Mapeamento_Perfil_${applicantName}`)}
                disabled={isExportingPDF}
                className="flex h-8 items-center justify-center gap-2 rounded-xl border border-[#940dff] bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-sm transition-all hover:bg-[#8200e6] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer whitespace-nowrap"
              >
                {isExportingPDF ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                {isExportingPDF ? 'Gerando...' : 'Baixar PDF'}
              </button>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/80 bg-white text-slate-400 shadow-sm transition-all hover:bg-[#f3e5ff] hover:text-[#940dff] active:scale-95 cursor-pointer"
              >
                <CloseIcon size={16} />
              </button>
            </div>
          </div>

          <div className="flex border-b border-slate-100 bg-white px-6 py-2 overflow-x-auto gap-2 shrink-0 no-scrollbar">
            {Object.entries(QUESTIONS_CATEGORIES).map(([key, cat]) => {
              const isActive = activeCategoryTab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveCategoryTab(key)}
                  className={`h-8 px-4 text-[12px] font-semibold rounded-xl transition-all whitespace-nowrap outline-none cursor-pointer border ${
                    isActive
                      ? 'border-[#f3e5ff] bg-[#f3e5ff] text-[#940dff] shadow-sm'
                      : 'border-white/80 bg-white text-slate-500 hover:border-[#f3e5ff] hover:text-[#940dff]'
                  }`}
                >
                  {cat.title}
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 text-left font-sans bg-[#fbf9ff]">
            {category && (
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-slate-400 mb-4">
                  {category.title}
                </h3>

                <div className="space-y-4">
                  {category.questions.map((question: string, index: number) => {
                    const globalIndex = ALL_QUESTIONS_LIST.indexOf(question);
                    const responseText = responses[globalIndex] || responses[globalIndex.toString()] || 'Nenhuma resposta enviada para esta pergunta.';

                    return (
                      <div
                        key={index}
                        className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-2 hover:border-slate-200 transition-all text-left"
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className="flex items-center justify-center w-6 h-6 rounded-xl text-[11px] font-semibold shrink-0 text-white"
                            style={{ backgroundColor: '#533af6' }}
                          >
                            {globalIndex + 1}
                          </span>
                          <h4 className="text-xs font-bold text-slate-800 leading-normal pt-0.5">
                            {question}
                          </h4>
                        </div>

                        <div className="pl-9 border-l-2 border-slate-100 mt-2">
                          <p className="text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
                            {responseText}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 bg-[#fbf9ff] flex justify-center items-center shrink-0">
            <p className="text-[11px] font-medium text-slate-400 text-center">
              Mapeamento de Perfil • 20 Perguntas
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
