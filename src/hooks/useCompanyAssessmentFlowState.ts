import { useCallback, useState } from 'react';
import type { CompanyApplicant } from '../types/companyDashboard';

export type CompanyAssessmentResultsSubTab = 'relatorios' | 'guia' | 'criar';

export const useCompanyAssessmentFlowState = () => {
  const [resultsSubTab, setResultsSubTab] = useState<CompanyAssessmentResultsSubTab>('relatorios');
  const [isCustomTestModalOpen, setIsCustomTestModalOpen] = useState(false);
  const [selectedApplicantForCustomTest, setSelectedApplicantForCustomTest] = useState<CompanyApplicant | null>(null);

  const [isSelectCustomTemplateModalOpen, setIsSelectCustomTemplateModalOpen] = useState(false);
  const [applicantForRequestCustom, setApplicantForRequestCustom] = useState<CompanyApplicant | null>(null);
  const [selectedTemplateIdForRequest, setSelectedTemplateIdForRequest] = useState<string | null>(null);

  const closeCustomTemplateRequest = useCallback(() => {
    setIsSelectCustomTemplateModalOpen(false);
    setApplicantForRequestCustom(null);
  }, []);

  return {
    resultsSubTab,
    setResultsSubTab,
    isCustomTestModalOpen,
    setIsCustomTestModalOpen,
    selectedApplicantForCustomTest,
    setSelectedApplicantForCustomTest,
    isSelectCustomTemplateModalOpen,
    setIsSelectCustomTemplateModalOpen,
    applicantForRequestCustom,
    setApplicantForRequestCustom,
    selectedTemplateIdForRequest,
    setSelectedTemplateIdForRequest,
    closeCustomTemplateRequest,
  };
};
