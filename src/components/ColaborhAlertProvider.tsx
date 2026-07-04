import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import {
  inferAlertVariant,
  setColaborhAlertHandler,
  setColaborhConfirmHandler,
  type ColaborhAlertRequest,
  type ColaborhAlertVariant,
  type ColaborhConfirmRequest,
} from '../utils/colaborhAlerts';

type AlertItem = Required<Pick<ColaborhAlertRequest, 'message' | 'variant'>> & {
  id: string;
  title?: string;
  type: 'alert' | 'confirm';
  confirmLabel?: string;
  cancelLabel?: string;
  resolve?: (value: boolean) => void;
};

const AlertContext = createContext(null);

const variantConfig: Record<ColaborhAlertVariant, {
  title: string;
  icon: React.ElementType;
  iconClass: string;
  iconWrapClass: string;
  primaryClass: string;
}> = {
  success: {
    title: 'Tudo certo',
    icon: CheckCircle2,
    iconClass: 'text-[#40b87f]',
    iconWrapClass: 'bg-[#63e1a5]/14 border-[#63e1a5]/24',
    primaryClass: 'bg-[#63e1a5] text-white shadow-[0_10px_22px_rgba(99,225,165,0.22)] hover:bg-[#4bd592]',
  },
  error: {
    title: 'Não foi possível concluir',
    icon: AlertCircle,
    iconClass: 'text-[#ff4b8c]',
    iconWrapClass: 'bg-[#ff4b8c]/10 border-[#ff4b8c]/20',
    primaryClass: 'bg-[#ff4b8c] text-white shadow-[0_10px_22px_rgba(255,75,140,0.18)] hover:bg-[#f0387b]',
  },
  danger: {
    title: 'Confirmar ação',
    icon: TriangleAlert,
    iconClass: 'text-[#ff4b8c]',
    iconWrapClass: 'bg-[#ff4b8c]/10 border-[#ff4b8c]/20',
    primaryClass: 'bg-[#ff4b8c] text-white shadow-[0_10px_22px_rgba(255,75,140,0.18)] hover:bg-[#f0387b]',
  },
  warning: {
    title: 'Atenção',
    icon: TriangleAlert,
    iconClass: 'text-[#ffa303]',
    iconWrapClass: 'bg-[#ffc24b]/16 border-[#ffc24b]/28',
    primaryClass: 'bg-[#940dff] text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] hover:bg-[#8200e6]',
  },
  info: {
    title: 'Aviso',
    icon: Info,
    iconClass: 'text-[#940dff]',
    iconWrapClass: 'bg-[#f3e5ff] border-[#940dff]/18',
    primaryClass: 'bg-[#940dff] text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] hover:bg-[#8200e6]',
  },
};

const createAlertId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const normalizeAlert = (request: ColaborhAlertRequest): AlertItem => ({
  id: createAlertId(),
  type: 'alert',
  message: request.message,
  title: request.title,
  variant: request.variant ?? inferAlertVariant(request.message),
});

export const ColaborhAlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queue, setQueue] = useState<AlertItem[]>([]);
  const activeAlert = queue[0] ?? null;

  const closeActive = useCallback((confirmed = false) => {
    setQueue((previous) => {
      const [current, ...rest] = previous;
      current?.resolve?.(confirmed);
      return rest;
    });
  }, []);

  const pushAlert = useCallback((request: ColaborhAlertRequest) => {
    setQueue((previous) => [...previous, normalizeAlert(request)]);
  }, []);

  const pushConfirm = useCallback((request: ColaborhConfirmRequest) => new Promise<boolean>((resolve) => {
    const variant = request.variant ?? inferAlertVariant(request.message);
    const isDanger = variant === 'danger' || /excluir|remover|deletar/i.test(request.message);

    setQueue((previous) => [...previous, {
      id: createAlertId(),
      type: 'confirm',
      message: request.message,
      title: request.title,
      variant: isDanger ? 'danger' : variant,
      confirmLabel: request.confirmLabel ?? (isDanger ? 'Excluir' : 'Confirmar'),
      cancelLabel: request.cancelLabel ?? 'Cancelar',
      resolve,
    }]);
  }), []);

  useEffect(() => {
    const previousAlert = window.alert;

    setColaborhAlertHandler(pushAlert);
    setColaborhConfirmHandler(pushConfirm);

    window.alert = (message?: unknown) => {
      pushAlert({
        message: String(message ?? ''),
        variant: inferAlertVariant(String(message ?? '')),
      });
    };

    return () => {
      window.alert = previousAlert;
      setColaborhAlertHandler(null);
      setColaborhConfirmHandler(null);
    };
  }, [pushAlert, pushConfirm]);

  const contextValue = useMemo(() => null, []);
  const config = activeAlert ? variantConfig[activeAlert.variant] : null;
  const Icon = config?.icon;

  return (
    <AlertContext.Provider value={contextValue}>
      {children}

      <AnimatePresence>
        {activeAlert && config && Icon && (
          <motion.div
            key={activeAlert.id}
            className="company-dashboard-surface fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/28 px-4 py-6 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={() => activeAlert.type === 'alert' && closeActive(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={`colaborh-alert-title-${activeAlert.id}`}
              className="relative w-full max-w-[420px] rounded-2xl border border-slate-200/70 bg-white/95 p-5 text-left shadow-[0_24px_70px_rgba(15,23,42,0.18)]"
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => closeActive(false)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200/70 bg-white text-slate-400 shadow-sm transition-all hover:border-[#940dff]/20 hover:text-[#940dff] active:scale-95"
                aria-label="Fechar alerta"
              >
                <X size={15} />
              </button>

              <div className="flex items-start gap-4 pr-8">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${config.iconWrapClass}`}>
                  <Icon size={22} className={config.iconClass} />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 id={`colaborh-alert-title-${activeAlert.id}`} className="text-[20px] font-semibold tracking-tight text-[#343241]">
                    {activeAlert.title || config.title}
                  </h2>
                  <p className="mt-2 whitespace-pre-line text-[12px] font-medium leading-5 text-slate-500">
                    {activeAlert.message}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-3">
                {activeAlert.type === 'confirm' && (
                  <button
                    type="button"
                    onClick={() => closeActive(false)}
                    className="h-8 rounded-xl border border-slate-200/80 bg-white px-4 text-[12px] font-semibold text-slate-500 transition-all hover:border-[#940dff]/18 hover:bg-[#f3e5ff] hover:text-[#940dff] active:scale-95"
                  >
                    {activeAlert.cancelLabel}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => closeActive(true)}
                  className={`h-8 rounded-xl px-5 text-[12px] font-semibold transition-all active:scale-95 ${config.primaryClass}`}
                >
                  {activeAlert.type === 'confirm' ? activeAlert.confirmLabel : 'Entendi'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AlertContext.Provider>
  );
};