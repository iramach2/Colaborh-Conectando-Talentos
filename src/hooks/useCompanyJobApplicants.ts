import { type Dispatch, type SetStateAction, useCallback, useState } from 'react';
import { fetchApplicationsForJob } from '../services/applicationService';
import type { CompanyApplicant, CompanyApplication, CompanyJob } from '../types/companyDashboard';
import { getCurrentJobStages } from '../utils/companyDashboardUtils';

type UseCompanyJobApplicantsParams = {
  hydrateApplicationsWithNotes: (applications: CompanyApplication[]) => Promise<CompanyApplicant[]>;
  setJobApplicants: Dispatch<SetStateAction<CompanyApplicant[]>>;
  setSelectedJob: Dispatch<SetStateAction<CompanyJob | null>>;
  setActiveStageTab: Dispatch<SetStateAction<string>>;
};

export const useCompanyJobApplicants = ({
  hydrateApplicationsWithNotes,
  setJobApplicants,
  setSelectedJob,
  setActiveStageTab,
}: UseCompanyJobApplicantsParams) => {
  const [isFetchingApplicants, setIsFetchingApplicants] = useState(false);

  const fetchApplicants = useCallback(async (jobId: string) => {
    setIsFetchingApplicants(true);
    try {
      const hydratedApplicants = await hydrateApplicationsWithNotes(
        await fetchApplicationsForJob(jobId),
      );
      setJobApplicants(hydratedApplicants);
    } catch (err) {
      console.error('[DEBUG] Erro em fetchApplicants:', err);
      setJobApplicants([]);
    } finally {
      setIsFetchingApplicants(false);
    }
  }, [hydrateApplicationsWithNotes, setJobApplicants]);

  const handleViewApplicants = useCallback((job: CompanyJob) => {
    setSelectedJob(job);
    if (job.id) fetchApplicants(job.id);

    const stagesList = getCurrentJobStages(job);
    setActiveStageTab(stagesList[0] || 'Triagem');
  }, [fetchApplicants, setActiveStageTab, setSelectedJob]);

  return {
    isFetchingApplicants,
    fetchApplicants,
    handleViewApplicants,
  };
};
