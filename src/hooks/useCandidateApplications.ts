import { useEffect, useState } from 'react';
import { fetchCandidateApplications } from '../services/applicationService';
import type { CompanyApplication } from '../types/companyDashboard';

export const useCandidateApplications = (candidateEmail?: string, candidateName?: string) => {
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [myApplications, setMyApplications] = useState<CompanyApplication[]>([]);

  useEffect(() => {
    async function loadCandidateCandidacies() {
      if (!import.meta.env.VITE_SUPABASE_URL || !candidateEmail) return;

      try {
        const hydratedApps = await fetchCandidateApplications(candidateEmail);
        setAppliedJobIds(hydratedApps.map((application: CompanyApplication) => application.job_id).filter(Boolean) as string[]);
        setMyApplications(hydratedApps);
      } catch (error) {
        console.error('Erro ao buscar candidaturas previas do candidato:', error);
      }
    }

    if (candidateEmail) {
      loadCandidateCandidacies();
    }
  }, [candidateEmail, candidateName]);

  return {
    appliedJobIds,
    setAppliedJobIds,
    myApplications,
    setMyApplications,
  };
};
