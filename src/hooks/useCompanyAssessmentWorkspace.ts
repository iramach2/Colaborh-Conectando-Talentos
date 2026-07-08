import { useCompanyAssessmentFlowState } from './useCompanyAssessmentFlowState';
import { useCompanyCustomQuestionnaires } from './useCompanyCustomQuestionnaires';

export const useCompanyAssessmentWorkspace = (selectedCompanyId: string, selectedCompanyPlan?: string) => {
  const flowState = useCompanyAssessmentFlowState();
  const customQuestionnaires = useCompanyCustomQuestionnaires(selectedCompanyId, selectedCompanyPlan);

  return {
    ...flowState,
    ...customQuestionnaires,
  };
};