import { AlertTriangle, Check, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

export type CandidateDialog = {
  isOpen: boolean;
  type: 'alert' | 'confirm' | 'success';
  title?: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

interface CandidateDialogModalProps {
  dialog: CandidateDialog;
  onClose: () => void;
}

export const CandidateDialogModal = ({ dialog, onClose }: CandidateDialogModalProps) => {
  if (!dialog.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          if (dialog.type !== 'confirm') {
            onClose();
          }
        }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 overflow-hidden flex flex-col z-10 text-left border border-slate-100"
      >
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            dialog.type === 'success'
              ? 'bg-emerald-50 text-emerald-600'
              : dialog.type === 'confirm'
                ? 'bg-[#8959f5]/10 text-[#8959f5]'
                : 'bg-amber-50 text-amber-600'
          }`}>
            {dialog.type === 'success' ? (
              <Check size={20} className="stroke-[2.5]" />
            ) : dialog.type === 'confirm' ? (
              <HelpCircle size={20} className="stroke-[2.5]" />
            ) : (
              <AlertTriangle size={20} className="stroke-[2.5]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1 select-none">
              {dialog.title || (dialog.type === 'success' ? 'Sucesso' : dialog.type === 'confirm' ? 'Confirmacao' : 'Aviso')}
            </h3>
            <p className="text-[11px] font-semibold text-slate-500 leading-relaxed whitespace-pre-line">
              {dialog.message}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
          {dialog.type === 'confirm' ? (
            <>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (dialog.onCancel) dialog.onCancel();
                }}
                className="px-5 py-2.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border border-slate-200/50 hover:border-slate-300"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (dialog.onConfirm) dialog.onConfirm();
                }}
                className="px-5 py-2.5 bg-[#8959f5] hover:bg-[#7846e3] text-white rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-[#8959f5]/15"
              >
                Confirmar
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 bg-[#8959f5] hover:bg-[#7846e3] text-white rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-[#8959f5]/15"
            >
              Entendido
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
