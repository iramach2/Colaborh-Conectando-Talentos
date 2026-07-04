import { useCompanyAssessmentReportModals } from './useCompanyAssessmentReportModals';
import { useCompanyPdfExport } from './useCompanyPdfExport';
import type { CompanyApplicant } from '../types/companyDashboard';

type UseCompanyAssessmentReportStateParams = {
  selectedResumeApplicant: CompanyApplicant | null;
};

export const useCompanyAssessmentReportState = ({
  selectedResumeApplicant,
}: UseCompanyAssessmentReportStateParams) => {
  const pdfExport = useCompanyPdfExport({ selectedResumeApplicant });
  const reportModals = useCompanyAssessmentReportModals();

  return {
    ...pdfExport,
    ...reportModals,
  };
};
