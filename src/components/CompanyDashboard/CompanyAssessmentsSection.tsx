import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import type { CustomQuestionnaire } from '../../services/customQuestionnaireService';
import type {
  CompanyApplicant,
  CompanyApplication,
  CompanyJob,
  DiscReportResult,
  MbtiReportResult,
  TemperamentosReportResult,
} from '../../types/companyDashboard';
import { CompanyAssessmentReportsTable } from './assessments/CompanyAssessmentReportsTable';
import { CompanyAssessmentGuide } from './assessments/CompanyAssessmentGuide';
import { CompanyCustomAssessmentsLibrary } from './assessments/CompanyCustomAssessmentsLibrary';
import { CompanyAssessmentSubnav } from './CompanyAssessmentSubnav';
import { getAssessmentRows } from '../../utils/companyAssessmentRows';

interface CompanyAssessmentsSectionProps {
  isFetchingCompanyApps: boolean;
  resultsSubTab: 'relatorios' | 'guia' | 'criar';
  setResultsSubTab: (tab: 'relatorios' | 'guia' | 'criar') => void;
  companyApplications: CompanyApplication[];
  jobs: CompanyJob[];
  customTemplates: CustomQuestionnaire[];
  isLoadingCustomTemplates: boolean;
  onStartNewTemplate: () => void;
  onEditCustomTemplate: (template: CustomQuestionnaire) => void;
  onDeleteCustomTemplate: (templateId: string) => void | Promise<void>;
  setSelectedDiscResult: (result: DiscReportResult | null) => void;
  setSelectedMbtiResult: (result: MbtiReportResult | null) => void;
  setIsMbtiModalOpen: (isOpen: boolean) => void;
  setSelectedApplicantForQuestions: (applicant: CompanyApplicant | null) => void;
  setIsQuestionsModalOpen: (isOpen: boolean) => void;
  setSelectedTemperamentosResult: (result: TemperamentosReportResult | null) => void;
  setIsTemperamentosModalOpen: (isOpen: boolean) => void;
  setSelectedApplicantForCustomTest: (applicant: CompanyApplicant | null) => void;
  setIsCustomTestModalOpen: (isOpen: boolean) => void;
}

export const CompanyAssessmentsSection = ({
  isFetchingCompanyApps,
  resultsSubTab,
  setResultsSubTab,
  companyApplications,
  jobs,
  customTemplates,
  isLoadingCustomTemplates,
  onStartNewTemplate,
  onEditCustomTemplate,
  onDeleteCustomTemplate,
  setSelectedDiscResult,
  setSelectedMbtiResult,
  setIsMbtiModalOpen,
  setSelectedApplicantForQuestions,
  setIsQuestionsModalOpen,
  setSelectedTemperamentosResult,
  setIsTemperamentosModalOpen,
  setSelectedApplicantForCustomTest,
  setIsCustomTestModalOpen
}: CompanyAssessmentsSectionProps) => {
  const renderReports = () => {
    const candidatesWithTests = getAssessmentRows(companyApplications, jobs);

    return (
      <CompanyAssessmentReportsTable
        candidatesWithTests={candidatesWithTests}
        setSelectedDiscResult={setSelectedDiscResult}
        setSelectedMbtiResult={setSelectedMbtiResult}
        setIsMbtiModalOpen={setIsMbtiModalOpen}
        setSelectedApplicantForQuestions={setSelectedApplicantForQuestions}
        setIsQuestionsModalOpen={setIsQuestionsModalOpen}
        setSelectedTemperamentosResult={setSelectedTemperamentosResult}
        setIsTemperamentosModalOpen={setIsTemperamentosModalOpen}
        setSelectedApplicantForCustomTest={setSelectedApplicantForCustomTest}
        setIsCustomTestModalOpen={setIsCustomTestModalOpen}
      />
    );
  };

  const renderGuide = () => <CompanyAssessmentGuide />;

  const renderCustomLibrary = () => (
    <CompanyCustomAssessmentsLibrary
      customTemplates={customTemplates}
      isLoadingCustomTemplates={isLoadingCustomTemplates}
      onEditCustomTemplate={onEditCustomTemplate}
      onDeleteCustomTemplate={onDeleteCustomTemplate}
    />
  );

  const renderContent = () => {
    if (resultsSubTab === 'relatorios') return renderReports();
    if (resultsSubTab === 'guia') return renderGuide();
    return renderCustomLibrary();
  };

  return (
    <motion.div
      key="avaliacoes"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="company-dashboard-surface w-full space-y-5 text-left"
    >
      <CompanyAssessmentSubnav
        isVisible
        companyApplications={companyApplications}
        customTemplates={customTemplates}
        resultsSubTab={resultsSubTab}
        setResultsSubTab={setResultsSubTab}
        onStartNewTemplate={onStartNewTemplate}
      />
      {isFetchingCompanyApps ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-slate-200/70 bg-white/85 p-10 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3e5ff] text-[#940dff]">
            <Loader2 size={26} className="animate-spin" />
          </div>
          <p className="text-[13px] font-semibold text-[#343241]">Carregando relatórios</p>
          <p className="mt-1 text-[12px] font-medium text-slate-400">Buscando avaliações e respostas dos candidatos.</p>
        </div>
      ) : (
        renderContent()
      )}
    </motion.div>
  );
};