import { type Dispatch, type SetStateAction } from 'react';
import { supabase } from '../lib/supabase';
import type { CompanyJob } from '../types/companyDashboard';

type UseCompanyJobActionsParams = {
  setJobs: Dispatch<SetStateAction<CompanyJob[]>>;
  showCustomAlert: (message: string, title?: string) => void;
  showCustomSuccess: (message: string, title?: string) => void;
  showCustomConfirm: (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    title?: string,
  ) => void;
};

export const useCompanyJobActions = ({
  setJobs,
  showCustomAlert,
  showCustomSuccess,
  showCustomConfirm,
}: UseCompanyJobActionsParams) => {
  const handleShareJob = (job: CompanyJob) => {
    const shareUrl = `${window.location.origin}?vaga=${job.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      showCustomSuccess(`Link de candidatura copiado! Vaga: "${job.title}". Divulgue para potenciais candidatos.`, 'Link Copiado');
    }).catch((err) => {
      console.error('Erro ao copiar link:', err);
      try {
        const textInput = document.createElement('input');
        textInput.value = shareUrl;
        document.body.appendChild(textInput);
        textInput.select();
        document.execCommand('copy');
        document.body.removeChild(textInput);
        showCustomSuccess('Link copiado com sucesso!', 'Link Copiado');
      } catch (fallbackErr) {
        console.error('Erro no fallback de copia:', fallbackErr);
        showCustomAlert('Nao foi possivel copiar o link de candidatura.', 'Erro');
      }
    });
  };

  const handleUpdateJobStatus = async (jobId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: newStatus })
        .eq('id', jobId);

      if (error) throw error;

      setJobs((previousJobs) => previousJobs.map((job) => (
        job.id === jobId ? { ...job, status: newStatus } : job
      )));

      const portugueseStatus = newStatus === 'active' ? 'Ativa' : newStatus === 'paused' ? 'Pausada' : 'Encerrada';
      showCustomSuccess(`Status da vaga atualizado para "${portugueseStatus}"!`);
    } catch (err) {
      console.error('Erro ao atualizar status da vaga:', err);
      showCustomAlert('Nao foi possivel atualizar o status da vaga.', 'Erro');
    }
  };

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    showCustomConfirm(
      `Tem certeza de que deseja excluir permanentemente a vaga "${jobTitle}"? Esta acao nao pode ser desfeita.`,
      async () => {
        try {
          const { error: appsError } = await supabase
            .from('applications')
            .delete()
            .eq('job_id', jobId);

          if (appsError) {
            console.warn('Erro ao excluir candidaturas associadas:', appsError);
          }

          const { error } = await supabase
            .from('jobs')
            .delete()
            .eq('id', jobId);

          if (error) throw error;

          setJobs((previousJobs) => previousJobs.filter((job) => job.id !== jobId));
          showCustomSuccess(`Vaga "${jobTitle}" excluida com sucesso!`);
        } catch (err) {
          console.error('Erro ao excluir vaga:', err);
          showCustomAlert('Nao foi possivel excluir a vaga.', 'Erro');
        }
      },
      undefined,
      'Excluir Vaga',
    );
  };

  return {
    handleShareJob,
    handleUpdateJobStatus,
    handleDeleteJob,
  };
};
