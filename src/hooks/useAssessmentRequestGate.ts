import { useCallback } from 'react';
import type { CompanyApplication, CompanyJob } from '../types/companyDashboard';
import {
  getCurrentJobStages,
  getCurrentJobStageTests,
} from '../utils/companyDashboardUtils';

export const useAssessmentRequestGate = (selectedJob: CompanyJob | null) => {
  const canRequestAssessment = useCallback((application: CompanyApplication, testKey: string) => {
    const currentStatus = application?.status;
    const stagesList = getCurrentJobStages(selectedJob);
    const defaultStage = stagesList[0] || 'Triagem';
    const normalizedStatus = (
      !currentStatus ||
      currentStatus === 'Triagem' ||
      !stagesList.includes(currentStatus)
    )
      ? defaultStage
      : currentStatus;

    const currentStageTests = getCurrentJobStageTests(selectedJob);
    const testsForStage = currentStageTests[normalizedStatus] || [];
    const hasTestInStage = testsForStage.some((test) => test.split(':')[0] === testKey);

    return normalizedStatus === 'Testes' || hasTestInStage;
  }, [selectedJob]);

  return { canRequestAssessment };
};
