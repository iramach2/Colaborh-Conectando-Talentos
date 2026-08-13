import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardSectionFallback } from './CompanyDashboardLayout';
import { CompanyAssessmentsSection } from './CompanyAssessmentsSection';
import { CompanyCompaniesTab } from './CompanyCompaniesTab';
import { CompanyOverviewTab, type TopSkillPoint } from './CompanyOverviewTab';
import { CompanyTalentBankSection } from './CompanyTalentBankSection';
import { CompanyVacanciesSection } from './CompanyVacanciesSection';
import type { ChartPoint, DistributionPoint } from './DashboardAnalyticsCharts';
import type { VacancyFormData } from '../../utils/vacancyPayload';
import type { CompanyRecord } from '../../services/companyService';
import type { CustomQuestionnaire } from '../../services/customQuestionnaireService';
import type { TalentFilters, TalentProfile } from '../../hooks/useCompanyTalentBank';
import type {
  CompanyApplicant,
  CompanyApplication,
  CompanyJob,
  CompanyLike,
  DiscReportResult,
  MbtiReportResult,
  TemperamentosReportResult,
} from '../../types/companyDashboard';

type JobStatus = 'active' | 'paused' | 'closed' | string;

const SettingsTab = React.lazy(() => import('./tabs/SettingsTab').then((module) => ({ default: module.SettingsTab })));
const BillingTab = React.lazy(() => import('./tabs/BillingTab').then((module) => ({ default: module.BillingTab })));
const CreateVacancyTab = React.lazy(() => import('./tabs/CreateVacancyTab').then((module) => ({ default: module.CreateVacancyTab })));

export type CompanyDashboardOverviewProps = {
  activeJobsCount: number;
  recentJobsCount: number;
  totalCandidatesReal: number;
  recentCandidatesCount: number;
  candidatesInInterview: number;
  closedOrPausedJobsCount: number;
  dynamicApplicationData: ChartPoint[];
  dynamicDistribution: DistributionPoint[];
  companyApplications: CompanyApplication[];
  dynamicTopSkills: TopSkillPoint[];
  setIsRegisteringVacancy: (isOpen: boolean) => void;
  setRegisterStep: (step: number) => void;
};

export type CompanyDashboardBillingProps = {
  selectedCompany: CompanyRecord | null;
  companies: CompanyRecord[];
  setCompanies: React.Dispatch<React.SetStateAction<CompanyRecord[]>>;
  jobs: CompanyJob[];
};

export type CompanyDashboardVacancyCreationProps = {
  registerStep: number;
  setRegisterStep: (step: number | ((prev: number) => number)) => void;
  vacancyForm: VacancyFormData;
  setVacancyForm: React.Dispatch<React.SetStateAction<VacancyFormData>>;
  errorMessage: string | null;
  handleNextStep: () => void;
  handlePublish: () => void;
  isPublishing?: boolean;
};

export type CompanyDashboardCompaniesPanelProps = {
  companies: CompanyRecord[];
  selectedCompanyId: string;
  setSelectedCompanyId: (id: string) => void;
  resetCompanyForm: () => void;
  setIsRegisteringCompany: (isOpen: boolean) => void;
  handleEditCompany: (company: CompanyRecord, event: React.MouseEvent) => void;
  handleDeleteCompany: (id: string, event: React.MouseEvent) => void | Promise<void>;
};

export type CompanyDashboardAssessmentsProps = {
  isFetchingCompanyApps: boolean;
  resultsSubTab: 'relatorios' | 'guia' | 'criar';
  setResultsSubTab: (tab: 'relatorios' | 'guia' | 'criar') => void;
  companyApplications: CompanyApplication[];
  jobs: CompanyJob[];
  customTemplates: CustomQuestionnaire[];
  isLoadingCustomTemplates: boolean;
  handleStartNewTemplate: () => void;
  handleEditCustomTemplate: (template: CustomQuestionnaire) => void;
  handleDeleteCustomTemplate: (templateId: string) => void | Promise<void>;
  setSelectedDiscResult: (result: DiscReportResult | null) => void;
  setSelectedMbtiResult: (result: MbtiReportResult | null) => void;
  setIsMbtiModalOpen: (isOpen: boolean) => void;
  setSelectedApplicantForQuestions: (applicant: CompanyApplicant | null) => void;
  setIsQuestionsModalOpen: (isOpen: boolean) => void;
  setSelectedTemperamentosResult: (result: TemperamentosReportResult | null) => void;
  setIsTemperamentosModalOpen: (isOpen: boolean) => void;
  setSelectedApplicantForCustomTest: (applicant: CompanyApplicant | null) => void;
  setIsCustomTestModalOpen: (isOpen: boolean) => void;
};

export type CompanyDashboardTalentBankProps = {
  companies: CompanyRecord[];
  selectedCompanyId: string;
  talents: TalentProfile[];
  talentFilters: TalentFilters;
  talentSearch: string;
  talentSubTab: 'all' | 'saved';
  setTalentSubTab: React.Dispatch<React.SetStateAction<'all' | 'saved'>>;
  isAiSearching: boolean;
  aiPrompt: string;
  setAiPrompt: React.Dispatch<React.SetStateAction<string>>;
  handleAiSearch: () => void;
  isFiltersVisible: boolean;
  setIsFiltersVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setTalentFilters: React.Dispatch<React.SetStateAction<TalentFilters>>;
  isTalentLoadingCities: boolean;
  talentCities: string[];
  setTalentSearch: React.Dispatch<React.SetStateAction<string>>;
  setIsFilterSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filteredTalents: TalentProfile[];
  isFetchingTalents: boolean;
  setSelectedResumeApplicant: React.Dispatch<React.SetStateAction<CompanyApplicant | null>>;
  handleToggleSaveTalent: (talentId: string) => void;
  canUseDirectWhatsApp: boolean;
  onPlanFeatureBlocked: (feature: string) => void;
};

export type CompanyJobSubTab = 'active' | 'paused' | 'closed';

export type CompanyDashboardVacanciesProps = {
  selectedJob: CompanyJob | null;
  activeJobsCount: number;
  pausedJobsCount: number;
  closedJobsCount: number;
  jobSubTab: CompanyJobSubTab;
  setJobSubTab: React.Dispatch<React.SetStateAction<CompanyJobSubTab>>;
  companyJobs: CompanyJob[];
  isFetchingJobs: boolean;
  setSelectedJob: React.Dispatch<React.SetStateAction<CompanyJob | null>>;
  jobApplicants: CompanyApplicant[];
  isFetchingApplicants: boolean;
  handleViewApplicants: (job: CompanyJob) => void | Promise<void>;
  handleUpdateJobStatus: (jobId: string, status: JobStatus) => void | Promise<void>;
  handleShareJob: (job: CompanyJob) => void;
  setIsRegisteringVacancy: React.Dispatch<React.SetStateAction<boolean>>;
  setRegisterStep: React.Dispatch<React.SetStateAction<number>>;
  setIsConfiguringStages: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateApplicantStatus: (applicationId: string, status: string) => void | Promise<void>;
  setSelectedResumeApplicant: React.Dispatch<React.SetStateAction<CompanyApplicant | null>>;
  getFullApplicantInfo: (applicant: CompanyApplication) => CompanyApplicant;
  handleRequestDiscTest: (applicant: CompanyApplicant) => void | Promise<void>;
  handleRequestMbtiTest: (applicant: CompanyApplicant) => void | Promise<void>;
  handleRequestTemperamentosTest: (applicant: CompanyApplicant) => void | Promise<void>;
  handleRequestQuestions: (applicant: CompanyApplicant) => void | Promise<void>;
  handleRequestCustomTest: (applicant: CompanyApplicant) => void | Promise<void>;
  handleOpenNotes: (applicant: CompanyApplication) => void;
  handleDeleteJob: (jobId: string, jobTitle: string) => void | Promise<void>;
  handleOpenChat: (applicant: CompanyApplication) => void;
  canDownloadResumes: boolean;
  canUseDirectWhatsApp: boolean;
  onPlanFeatureBlocked: (feature: string) => void;
  jobSearch: string;
  setJobSearch: React.Dispatch<React.SetStateAction<string>>;
  isJobSearchFocused: boolean;
  setIsJobSearchFocused: React.Dispatch<React.SetStateAction<boolean>>;
  onCreateVacancy?: () => void;
};

export interface CompanyDashboardContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  overview: CompanyDashboardOverviewProps;
  vacancies: CompanyDashboardVacanciesProps;
  talentBank: CompanyDashboardTalentBankProps;
  companiesPanel: CompanyDashboardCompaniesPanelProps;
  assessments: CompanyDashboardAssessmentsProps;
  billing: CompanyDashboardBillingProps;
  vacancyCreation: CompanyDashboardVacancyCreationProps;
  interviewsTabContent: React.ReactNode;
}

export const CompanyDashboardContent = ({
  activeTab,
  setActiveTab,
  overview,
  vacancies,
  talentBank,
  companiesPanel,
  assessments,
  billing,
  vacancyCreation,
  interviewsTabContent,
}: CompanyDashboardContentProps) => {
  const {
    activeJobsCount,
    recentJobsCount,
    totalCandidatesReal,
    recentCandidatesCount,
    candidatesInInterview,
    closedOrPausedJobsCount,
    dynamicApplicationData,
    dynamicDistribution,
    companyApplications,
    dynamicTopSkills,
    setIsRegisteringVacancy,
    setRegisterStep,
  } = overview;

  const {
    selectedJob,
    pausedJobsCount,
    closedJobsCount,
    jobSubTab,
    setJobSubTab,
    companyJobs,
    isFetchingJobs,
    setSelectedJob,
    jobApplicants,
    isFetchingApplicants,
    handleViewApplicants,
    handleUpdateJobStatus,
    handleShareJob,
    setIsConfiguringStages,
    handleUpdateApplicantStatus,
    setSelectedResumeApplicant,
    getFullApplicantInfo,
    handleRequestDiscTest,
    handleRequestMbtiTest,
    handleRequestTemperamentosTest,
    handleRequestQuestions,
    handleRequestCustomTest,
    handleOpenNotes,
    handleDeleteJob,
    handleOpenChat,
    canDownloadResumes,
    canUseDirectWhatsApp: canUseVacancyDirectWhatsApp,
    onPlanFeatureBlocked,
    jobSearch,
    setJobSearch,
    isJobSearchFocused,
    setIsJobSearchFocused,
  } = vacancies;

  const {
    companies,
    selectedCompanyId,
    talents,
    talentFilters,
    talentSearch,
    talentSubTab,
    setTalentSubTab,
    isAiSearching,
    aiPrompt,
    setAiPrompt,
    handleAiSearch,
    isFiltersVisible,
    setIsFiltersVisible,
    setTalentFilters,
    isTalentLoadingCities,
    talentCities,
    setTalentSearch,
    setIsFilterSidebarOpen,
    filteredTalents,
    isFetchingTalents,
    handleToggleSaveTalent,
    canUseDirectWhatsApp: canUseTalentDirectWhatsApp,
    onPlanFeatureBlocked: onTalentPlanFeatureBlocked,
  } = talentBank;

  const {
    setSelectedCompanyId,
    resetCompanyForm,
    setIsRegisteringCompany,
    handleEditCompany,
    handleDeleteCompany,
  } = companiesPanel;

  const {
    isFetchingCompanyApps,
    resultsSubTab,
    setResultsSubTab,
    jobs,
    customTemplates,
    isLoadingCustomTemplates,
    handleStartNewTemplate,
    handleEditCustomTemplate,
    handleDeleteCustomTemplate,
    setSelectedDiscResult,
    setSelectedMbtiResult,
    setIsMbtiModalOpen,
    setSelectedApplicantForQuestions,
    setIsQuestionsModalOpen,
    setSelectedTemperamentosResult,
    setIsTemperamentosModalOpen,
    setSelectedApplicantForCustomTest,
    setIsCustomTestModalOpen,
  } = assessments;

  const {
    selectedCompany,
    setCompanies,
  } = billing;

  return (  <main className="flex-1 p-6 pt-3 lg:pt-5 lg:pb-10 lg:px-12 relative transition-all duration-300 z-10 min-w-0 overflow-x-hidden">
    <div className="w-full">
      <React.Suspense fallback={<DashboardSectionFallback />}>
        <AnimatePresence mode="wait">
          {activeTab === 'Dashboard' && (
            <CompanyOverviewTab
              activeJobsCount={activeJobsCount}
              recentJobsCount={recentJobsCount}
              totalCandidatesReal={totalCandidatesReal}
              recentCandidatesCount={recentCandidatesCount}
              candidatesInInterview={candidatesInInterview}
              closedOrPausedJobsCount={closedOrPausedJobsCount}
              dynamicApplicationData={dynamicApplicationData}
              dynamicDistribution={dynamicDistribution}
              totalApplications={companyApplications.length}
              companyApplications={companyApplications}
              dynamicTopSkills={dynamicTopSkills}
              onCreateVacancy={() => {
                setActiveTab('Cadastrar Vaga');
                setRegisterStep(1);
              }}
              onOpenTalentBank={() => setActiveTab('Banco de Talentos')}
            />
          )}

          {activeTab === 'Minhas Vagas' && (
            <CompanyVacanciesSection
              selectedJob={selectedJob}
              activeJobsCount={activeJobsCount}
              pausedJobsCount={pausedJobsCount}
              closedJobsCount={closedJobsCount}
              jobSubTab={jobSubTab}
              setJobSubTab={setJobSubTab}
              companyJobs={companyJobs}
              isFetchingJobs={isFetchingJobs}
              setSelectedJob={setSelectedJob}
              jobApplicants={jobApplicants}
              isFetchingApplicants={isFetchingApplicants}
              handleViewApplicants={handleViewApplicants}
              handleUpdateJobStatus={handleUpdateJobStatus}
              handleShareJob={handleShareJob}
              setIsRegisteringVacancy={setIsRegisteringVacancy}
              setRegisterStep={setRegisterStep}
              setIsConfiguringStages={setIsConfiguringStages}
              handleUpdateApplicantStatus={handleUpdateApplicantStatus}
              setSelectedResumeApplicant={setSelectedResumeApplicant}
              getFullApplicantInfo={getFullApplicantInfo}
              handleRequestDiscTest={handleRequestDiscTest}
              handleRequestMbtiTest={handleRequestMbtiTest}
              handleRequestTemperamentosTest={handleRequestTemperamentosTest}
              handleRequestQuestions={handleRequestQuestions}
              handleRequestCustomTest={handleRequestCustomTest}
              handleOpenNotes={handleOpenNotes}
              handleDeleteJob={handleDeleteJob}
              handleOpenChat={handleOpenChat}
              canDownloadResumes={canDownloadResumes}
              canUseDirectWhatsApp={canUseVacancyDirectWhatsApp}
              onPlanFeatureBlocked={onPlanFeatureBlocked}
              jobSearch={jobSearch}
              setJobSearch={setJobSearch}
              isJobSearchFocused={isJobSearchFocused}
              setIsJobSearchFocused={setIsJobSearchFocused}
              onCreateVacancy={() => {
                setActiveTab('Cadastrar Vaga');
                setRegisterStep(1);
              }}
            />
          )}

          {activeTab === 'Cadastrar Vaga' && (
            <CreateVacancyTab
              isOpen={true}
              onClose={() => setActiveTab('Minhas Vagas')}
              registerStep={vacancyCreation.registerStep}
              setRegisterStep={vacancyCreation.setRegisterStep}
              vacancyForm={vacancyCreation.vacancyForm}
              setVacancyForm={vacancyCreation.setVacancyForm}
              errorMessage={vacancyCreation.errorMessage}
              handleNextStep={vacancyCreation.handleNextStep}
              handlePublish={vacancyCreation.handlePublish}
              isPublishing={vacancyCreation.isPublishing}
              presentation="page"
            />
          )}

          {activeTab === 'Banco de Talentos' && (
            <CompanyTalentBankSection
              companies={companies}
              selectedCompanyId={selectedCompanyId}
              talents={talents}
              talentFilters={talentFilters}
              talentSearch={talentSearch}
              talentSubTab={talentSubTab}
              setTalentSubTab={setTalentSubTab}
              isAiSearching={isAiSearching}
              aiPrompt={aiPrompt}
              setAiPrompt={setAiPrompt}
              handleAiSearch={handleAiSearch}
              isFiltersVisible={isFiltersVisible}
              setIsFiltersVisible={setIsFiltersVisible}
              setTalentFilters={setTalentFilters}
              isTalentLoadingCities={isTalentLoadingCities}
              talentCities={talentCities}
              setTalentSearch={setTalentSearch}
              setIsFilterSidebarOpen={setIsFilterSidebarOpen}
              filteredTalents={filteredTalents}
              isFetchingTalents={isFetchingTalents}
              setSelectedResumeApplicant={setSelectedResumeApplicant}
              handleToggleSaveTalent={handleToggleSaveTalent}
              canUseDirectWhatsApp={canUseTalentDirectWhatsApp}
              onPlanFeatureBlocked={onTalentPlanFeatureBlocked}
            />
          )}

          {activeTab === 'Empresas' && (
            <CompanyCompaniesTab
              companies={companies}
              selectedCompanyId={selectedCompanyId}
              setSelectedCompanyId={setSelectedCompanyId}
              resetCompanyForm={resetCompanyForm}
              setIsRegisteringCompany={setIsRegisteringCompany}
              handleEditCompany={handleEditCompany}
              handleDeleteCompany={handleDeleteCompany}
            />
          )}

          {activeTab === 'Avaliações' && (
            <CompanyAssessmentsSection
              isFetchingCompanyApps={isFetchingCompanyApps}
              resultsSubTab={resultsSubTab}
              setResultsSubTab={setResultsSubTab}
              companyApplications={companyApplications}
              jobs={jobs}
              customTemplates={customTemplates}
              isLoadingCustomTemplates={isLoadingCustomTemplates}
              onStartNewTemplate={handleStartNewTemplate}
              onEditCustomTemplate={handleEditCustomTemplate}
              onDeleteCustomTemplate={handleDeleteCustomTemplate}
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
          )}

          {activeTab === 'Configurações' && (
            <SettingsTab />
          )}

          {activeTab === 'Faturamento' && (
            <BillingTab
              company={selectedCompany}
              companies={companies}
              setCompanies={setCompanies}
              jobs={jobs}
            />
          )}

          {activeTab === 'Entrevistas' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full flex-1"
            >
              {interviewsTabContent}
            </motion.div>
          )}
        </AnimatePresence>
      </React.Suspense>
    </div>
  </main>
  );
};
