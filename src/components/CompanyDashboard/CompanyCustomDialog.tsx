import { type Dispatch, type SetStateAction } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Check, HelpCircle } from 'lucide-react';

type CustomDialogState = {
  isOpen: boolean;
  title?: string;
  message: string;
  type: 'alert' | 'confirm' | 'success';
  onConfirm?: () => void;
  onCancel?: () => void;
};

interface CompanyCustomDialogProps {
  customDialog: CustomDialogState;
  setCustomDialog: Dispatch<SetStateAction<CustomDialogState>>;
}

export const CompanyCustomDialog = ({
  customDialog,
  setCustomDialog
}: CompanyCustomDialogProps) => {
  if (!customDialog.isOpen) return null;

  const closeDialog = () => setCustomDialog(previous => ({ ...previous, isOpen: false }));

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          if (customDialog.type !== 'confirm') {
            closeDialog();
          }
        }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col z-10 text-left border border-slate-100"
      >
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            customDialog.type === 'success'
              ? 'bg-[#63e1a5]/14 text-[#40b87f]'
              : customDialog.type === 'confirm'
                ? 'bg-[#8959f5]/10 text-[#8959f5]'
                : 'bg-[#ffc24b]/16 text-[#ffa303]'
          }`}>
            {customDialog.type === 'success' ? (
              <Check size={20} className="stroke-[2.5]" />
            ) : customDialog.type === 'confirm' ? (
              <HelpCircle size={20} className="stroke-[2.5]" />
            ) : (
              <AlertTriangle size={20} className="stroke-[2.5]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1 select-none">
              {customDialog.title || (customDialog.type === 'success' ? 'Sucesso' : customDialog.type === 'confirm' ? 'Confirmação' : 'Aviso')}
            </h3>
            <p className="text-[11px] font-semibold text-slate-500 leading-relaxed whitespace-pre-line">
              {customDialog.message}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
          {customDialog.type === 'confirm' ? (
            <>
              <button
                type="button"
                onClick={() => {
                  closeDialog();
                  customDialog.onCancel?.();
                }}
                className="px-4 py-2 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border border-slate-200/50 hover:border-slate-300"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  customDialog.onConfirm?.();
                }}
                className="px-4 py-2 bg-[#8959f5] hover:bg-[#7846e3] text-white rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-[#8959f5]/15"
              >
                Confirmar
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={closeDialog}
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
