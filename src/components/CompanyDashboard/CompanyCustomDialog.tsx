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

const dialogTone = {
  success: 'bg-[#63e1a5]/14 text-[#2f9f6b]',
  confirm: 'bg-[#f3e5ff] text-[#940dff]',
  alert: 'bg-[#ff4b8c]/10 text-[#ff4b8c]',
};

export const CompanyCustomDialog = ({ customDialog, setCustomDialog }: CompanyCustomDialogProps) => {
  if (!customDialog.isOpen) return null;

  const closeDialog = () => setCustomDialog(previous => ({ ...previous, isOpen: false }));
  const title = customDialog.title || (customDialog.type === 'success' ? 'Sucesso' : customDialog.type === 'confirm' ? 'Confirmação' : 'Aviso');

  return (
    <div className="company-dashboard-surface fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          if (customDialog.type !== 'confirm') closeDialog();
        }}
        className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        transition={{ type: 'spring', damping: 24, stiffness: 260 }}
        className="relative z-10 flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 text-left shadow-[0_18px_50px_rgba(106,66,220,0.10)]"
      >
        <div className="flex items-start gap-3">
          <div className={'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ' + dialogTone[customDialog.type]}>
            {customDialog.type === 'success' ? (
              <Check size={19} className="stroke-[2.5]" />
            ) : customDialog.type === 'confirm' ? (
              <HelpCircle size={19} className="stroke-[2.5]" />
            ) : (
              <AlertTriangle size={19} className="stroke-[2.5]" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="select-none text-[20px] font-semibold leading-tight tracking-tight text-[#343241]">
              {title}
            </h3>
            <p className="mt-1.5 whitespace-pre-line text-[12px] font-medium leading-relaxed text-slate-500">
              {customDialog.message}
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2 border-t border-slate-200/70 pt-4">
          {customDialog.type === 'confirm' ? (
            <>
              <button
                type="button"
                onClick={() => {
                  closeDialog();
                  customDialog.onCancel?.();
                }}
                className="h-8 rounded-xl border border-slate-200/80 bg-white px-4 text-[12px] font-semibold text-slate-500 transition-all hover:bg-slate-50 hover:text-[#343241] active:scale-95"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => customDialog.onConfirm?.()}
                className="h-8 rounded-xl bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95"
              >
                Confirmar
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={closeDialog}
              className="h-8 rounded-xl bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95"
            >
              Entendido
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
