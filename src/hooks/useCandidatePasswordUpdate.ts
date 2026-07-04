import { FormEvent, useState } from 'react';
import { supabase } from '../lib/supabase';

interface UseCandidatePasswordUpdateParams {
  onAlert: (message: string, title?: string) => void;
  onSuccess: (message: string, title?: string) => void;
}

export const useCandidatePasswordUpdate = ({
  onAlert,
  onSuccess,
}: UseCandidatePasswordUpdateParams) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdatePassword = async (event: FormEvent) => {
    event.preventDefault();

    if (!newPassword) {
      onAlert('Por favor, digite a nova senha.', 'Campo Obrigatorio');
      return;
    }

    if (newPassword.length < 6) {
      onAlert('A nova senha deve conter pelo menos 6 caracteres.', 'Senha Curta');
      return;
    }

    if (newPassword !== confirmPassword) {
      onAlert('A nova senha e a confirmacao nao coincidem.', 'Senhas Diferentes');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      onSuccess('Senha atualizada com sucesso!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Ocorreu um erro ao atualizar sua senha.';
      onAlert(message, 'Erro ao Atualizar');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isUpdatingPassword,
    handleUpdatePassword,
  };
};
