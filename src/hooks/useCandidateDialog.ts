import { useState } from 'react';

export type CandidateDialogState = {
  isOpen: boolean;
  type: 'alert' | 'confirm' | 'success';
  title?: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export const useCandidateDialog = () => {
  const [customDialog, setCustomDialog] = useState<CandidateDialogState>({
    isOpen: false,
    type: 'alert',
    message: '',
  });

  const closeCustomDialog = () => {
    setCustomDialog((prev) => ({ ...prev, isOpen: false }));
  };

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
    title: string = 'Confirmacao'
  ) => {
    setCustomDialog({
      isOpen: true,
      type: 'confirm',
      title,
      message,
      onConfirm: () => {
        closeCustomDialog();
        onConfirm();
      },
      onCancel: () => {
        closeCustomDialog();
        if (onCancel) onCancel();
      },
    });
  };

  return {
    customDialog,
    closeCustomDialog,
    showCustomAlert,
    showCustomSuccess,
    showCustomConfirm,
  };
};
