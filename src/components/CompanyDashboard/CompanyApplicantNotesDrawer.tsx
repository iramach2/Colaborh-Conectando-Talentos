import { Loader2, StickyNote, X as CloseIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { CompanyApplicant } from '../../types/companyDashboard';

interface CompanyApplicantNotesDrawerProps {
  isOpen: boolean;
  applicant: CompanyApplicant | null;
  notesText: string;
  setNotesText: (value: string) => void;
  isSaving: boolean;
  onSave: () => void;
  onClose: () => void;
}

export function CompanyApplicantNotesDrawer({
  isOpen,
  applicant,
  notesText,
  setNotesText,
  isSaving,
  onSave,
  onClose,
}: CompanyApplicantNotesDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && applicant && (
        <div className="fixed inset-0 z-[120] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-l-[24px] rounded-r-none shadow-2xl overflow-hidden flex flex-col h-full border-l border-slate-100/85 z-10"
          >
            <div className="p-7 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-highlight-50 rounded-2xl flex items-center justify-center text-highlight-600 shadow-sm shrink-0 border border-highlight-100">
                  <StickyNote size={22} className="text-highlight-500" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight">
                    Anotações de Recrutamento
                  </h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5 truncate max-w-[220px]">
                    Candidato: {applicant.candidate_name || applicant.name}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={isSaving}
                className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full transition-all cursor-pointer border border-slate-100 hover:scale-105 active:scale-95 shadow-sm outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-9 h-9"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            <div className="flex-1 p-7 sm:p-9 flex flex-col space-y-4 text-left font-sans overflow-y-auto">
              <div className="flex-1 flex flex-col space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                  Observações sobre o perfil e entrevista
                </label>
                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Digite aqui pontos fortes, observações técnicas, expectativas de contratação ou impressões gerais da entrevista do candidato..."
                  className="w-full flex-1 min-h-[300px] px-4 py-3 text-xs font-bold text-slate-700 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-highlight-500 focus:border-highlight-500 resize-none transition-all placeholder:text-slate-400"
                  maxLength={1500}
                />
                <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  <span>Anotações privadas da empresa</span>
                  <span>{notesText.length}/1500 caracteres</span>
                </div>
              </div>
            </div>

            <div className="p-7 border-t border-slate-100 bg-slate-50/50 flex justify-end items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-black text-[10px] uppercase tracking-widest rounded-full transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={isSaving}
                className="px-8 py-3 bg-gradient-to-r from-primary-600 to-highlight-600 text-white font-black text-[10px] uppercase tracking-widest rounded-full shadow-lg shadow-highlight-100 hover:shadow-highlight-200/50 hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={12} className="animate-spin" /> Salvando...
                  </>
                ) : 'Salvar Anotações'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
