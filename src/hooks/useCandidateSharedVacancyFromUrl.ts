import { useEffect } from 'react';
import { fetchJobById } from '../services/jobService';
import { hydrateJobsWithWorkflow } from '../services/jobWorkflowService';
import type { CompanyJob } from '../types/companyDashboard';
import { getSharedJobIdFromLocation } from '../utils/appRoutes';

interface UseCandidateSharedVacancyFromUrlParams {
  setActiveTab: (tab: string) => void;
  setSelectedJobForDetails: (job: CompanyJob | null) => void;
  setErrorMessage: (message: string) => void;
}

export const useCandidateSharedVacancyFromUrl = ({
  setActiveTab,
  setSelectedJobForDetails,
  setErrorMessage
}: UseCandidateSharedVacancyFromUrlParams) => {
  useEffect(() => {
    const sharedJobId = getSharedJobIdFromLocation();
    if (!sharedJobId) return;

    setActiveTab('Vagas');
    if (!import.meta.env.VITE_SUPABASE_URL) return;

    fetchJobById(sharedJobId)
      .then(async (data) => {
        if (!data) return;
        const status = (data.status || '').toLowerCase();
        const isActive = status === 'active' || status === 'ativa' || status === '';
        if (isActive) {
          const [hydratedJob] = await hydrateJobsWithWorkflow([data]);
          setSelectedJobForDetails(hydratedJob || data);
        } else {
          alert('Esta vaga nao esta ativa no momento.');
        }
      })
      .catch((error) => {
        console.error('Erro ao carregar vaga compartilhada:', error);
        setErrorMessage('Nao foi possivel carregar a vaga compartilhada.');
      });
  }, [setActiveTab, setErrorMessage, setSelectedJobForDetails]);
};
