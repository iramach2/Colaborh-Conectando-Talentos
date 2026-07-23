import { useCallback, useEffect, useState } from 'react';
import { fetchCandidateApplications } from '../services/applicationService';
import type { CompanyApplication } from '../types/companyDashboard';

export const useCandidateApplications = (candidateEmail?: string, candidateName?: string) => {
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [myApplications, setMyApplications] = useState<CompanyApplication[]>([]);

  const reloadCandidateApplications = useCallback(async () => {
    if (!import.meta.env.VITE_SUPABASE_URL || !candidateEmail) return;

    try {
      const hydratedApps = await fetchCandidateApplications(candidateEmail);
      setAppliedJobIds(hydratedApps.map((application: CompanyApplication) => application.job_id).filter(Boolean) as string[]);
      setMyApplications(hydratedApps);
    } catch (error) {
      console.error('Erro ao buscar candidaturas previas do candidato:', error);
    }
  }, [candidateEmail]);

  useEffect(() => {
    if (candidateEmail) {
      reloadCandidateApplications();
    }
  }, [candidateEmail, candidateName, reloadCandidateApplications]);

  return {
    appliedJobIds,
    setAppliedJobIds,
    myApplications,
    setMyApplications,
    reloadCandidateApplications,
  };
};
