import { useState } from 'react';

export type CompanyCustomDialogState = {
  isOpen: boolean;
  type: 'alert' | 'confirm' | 'success';
  title?: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export const useCompanyCustomDialog = () => {
  const [customDialog, setCustomDialog] = useState<CompanyCustomDialogState>({
    isOpen: false,
    type: 'alert',
    message: '',
  });

  const showCustomAlert = (message: string, title: string = 'Aviso') => {
    setCustomDialog({
      isOpen: true,
      type: 'alert',
      title,
      message,
    });
  };

  const showCustomSuccess = (message: string, title: string = 'Sucesso') => {
    setCustomDialog({
      isOpen: true,
      type: 'success',
      title,
      message,
    });
  };

  const showCustomConfirm = (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    title: string = 'Confirmação'
  ) => {
    setCustomDialog({
      isOpen: true,
      type: 'confirm',
      title,
      message,
      onConfirm: () => {
        setCustomDialog((previous) => ({ ...previous, isOpen: false }));
        onConfirm();
      },
      onCancel: () => {
        setCustomDialog((previous) => ({ ...previous, isOpen: false }));
        onCancel?.();
      },
    });
  };

  return {
    customDialog,
    setCustomDialog,
    showCustomAlert,
    showCustomSuccess,
    showCustomConfirm,
  };
};
