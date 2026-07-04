import { useEffect, useState } from 'react';
import { fetchJobs } from '../services/jobService';
import { hydrateJobsWithWorkflow } from '../services/jobWorkflowService';
import type { CompanyJob } from '../types/companyDashboard';

interface UseCandidateVacanciesParams {
  activeTab: string;
  getErrorMessage: (error: unknown) => string;
}

export const useCandidateVacancies = ({
  activeTab,
  getErrorMessage,
}: UseCandidateVacanciesParams) => {
  const [vacancies, setVacancies] = useState<CompanyJob[]>([]);
  const [isFetchingVacancies, setIsFetchingVacancies] = useState(false);
  const [vacancyLoadError, setVacancyLoadError] = useState<string | null>(null);
  const [vacancyReloadKey, setVacancyReloadKey] = useState(0);

  useEffect(() => {
    async function loadVacancies() {
      if (!import.meta.env.VITE_SUPABASE_URL) return;

      setIsFetchingVacancies(true);
      setVacancyLoadError(null);
      try {
        const data = await fetchJobs();

        const hydratedJobs = await hydrateJobsWithWorkflow(data || []);
        const activeJobs = hydratedJobs.filter((vacancy: CompanyJob) => {
          const status = (vacancy.status || '').toLowerCase().trim();
          return ['', 'active', 'ativa', 'published', 'publicada', 'open', 'aberta'].includes(status);
        });

        const params = new URLSearchParams(window.location.search);
        const sharedJobId = params.get('vaga') || params.get('jobId');
        let sortedVacancies = activeJobs;

        if (sharedJobId) {
          sortedVacancies = [...sortedVacancies].sort((a, b) => {
            if (a.id === sharedJobId) return -1;
            if (b.id === sharedJobId) return 1;
            return 0;
          });
        }

        setVacancies(sortedVacancies);
      } catch (error) {
        console.error('Erro ao buscar vagas do Supabase:', error);
        setVacancyLoadError(getErrorMessage(error));
        setVacancies([]);
      } finally {
        setIsFetchingVacancies(false);
      }
    }

    loadVacancies();
  }, [activeTab, getErrorMessage, vacancyReloadKey]);

  return {
    vacancies,
    isFetchingVacancies,
    vacancyLoadError,
    setVacancyReloadKey,
  };
};
