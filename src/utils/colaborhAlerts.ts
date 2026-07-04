export type ColaborhAlertVariant = 'success' | 'error' | 'warning' | 'info' | 'danger';

export type ColaborhAlertRequest = {
  title?: string;
  message: string;
  variant?: ColaborhAlertVariant;
};

export type ColaborhConfirmRequest = ColaborhAlertRequest & {
  confirmLabel?: string;
  cancelLabel?: string;
};

type AlertHandler = (request: ColaborhAlertRequest) => void;
type ConfirmHandler = (request: ColaborhConfirmRequest) => Promise<boolean>;

let alertHandler: AlertHandler | null = null;
let confirmHandler: ConfirmHandler | null = null;

export const setColaborhAlertHandler = (handler: AlertHandler | null) => {
  alertHandler = handler;
};

export const setColaborhConfirmHandler = (handler: ConfirmHandler | null) => {
  confirmHandler = handler;
};

export const inferAlertVariant = (message: string): ColaborhAlertVariant => {
  const normalized = message.toLowerCase();

  if (/(erro|error|não foi possível|nao foi possivel|inválid|expirad|ausente|insuficiente|falhou|failed)/i.test(normalized)) {
    return 'error';
  }

  if (/(excluir|desfeita|tem certeza|mantenha|preencha|informe|escolha|atenção|atencao|grande)/i.test(normalized)) {
    return 'warning';
  }

  if (/(sucesso|salv|cadastrad|confirmad|enviad|realizado|atualizad|publicad)/i.test(normalized)) {
    return 'success';
  }

  return 'info';
};

export const colaborhAlert = (message: unknown, options?: Omit<ColaborhAlertRequest, 'message'>) => {
  const text = String(message ?? '');

  if (alertHandler) {
    alertHandler({
      title: options?.title,
      message: text,
      variant: options?.variant ?? inferAlertVariant(text),
    });
    return;
  }

  window.alert(text);
};

export const colaborhConfirm = async (request: string | ColaborhConfirmRequest): Promise<boolean> => {
  const payload: ColaborhConfirmRequest = typeof request === 'string'
    ? { message: request, variant: inferAlertVariant(request) }
    : { ...request, variant: request.variant ?? inferAlertVariant(request.message) };

  if (confirmHandler) {
    return confirmHandler(payload);
  }

  return window.confirm(payload.message);
};