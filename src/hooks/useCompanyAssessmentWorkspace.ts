import { useCompanyAssessmentFlowState } from './useCompanyAssessmentFlowState';
import { useCompanyCustomQuestionnaires } from './useCompanyCustomQuestionnaires';

export const useCompanyAssessmentWorkspace = (selectedCompanyId: string) => {
  const flowState = useCompanyAssessmentFlowState();
  const customQuestionnaires = useCompanyCustomQuestionnaires(selectedCompanyId);

  return {
    ...flowState,
    ...customQuestionnaires,
  };
};
