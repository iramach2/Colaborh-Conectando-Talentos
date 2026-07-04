import { type Dispatch, type SetStateAction, useCallback } from 'react';
import type { CompanyApplicant, CompanyJob } from '../types/companyDashboard';
import { createNotification } from '../utils/notificationUtils';

type UseCompanyAssessmentApplicantUpdatesParams = {
  selectedJob: CompanyJob | null;
  setJobApplicants: Dispatch<SetStateAction<CompanyApplicant[]>>;
};

export const useCompanyAssessmentApplicantUpdates = ({
  selectedJob,
  setJobApplicants,
}: UseCompanyAssessmentApplicantUpdatesParams) => {
  const updateApplicantCandidatePhone = useCallback((applicationId: string, candidatePhone: string) => {
    setJobApplicants((previous) => previous.map((item) => (
      item.id === applicationId ? { ...item, candidate_phone: candidatePhone } : item
    )));
  }, [setJobApplicants]);

  const notifyCandidateAssessmentRequest = useCallback((
    email: string,
    title: string,
    message: string,
    warningContext: string,
  ) => {
    if (email && email !== 'candidato@email.com' && selectedJob) {
      createNotification(
        email,
        'candidate',
        title,
        message,
        selectedJob.id,
      ).catch((err) => console.warn(`Erro ao gerar notificacao de solicitacao de ${warningContext}:`, err));
    }
  }, [selectedJob]);

  return {
    updateApplicantCandidatePhone,
    notifyCandidateAssessmentRequest,
  };
};
