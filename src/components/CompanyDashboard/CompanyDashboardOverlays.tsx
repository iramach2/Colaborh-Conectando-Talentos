import React from 'react';
import { AnimatePresence } from 'motion/react';
import { markNotificationAsRead, deleteNotification, type ColaborhNotification } from '../../utils/notificationUtils';
import { getCurrentJobStages } from '../../utils/companyDashboardUtils';
import { NotificationsDrawer } from '../NotificationsDrawer';
import { OverlayFallback } from './CompanyDashboardLayout';
import { CompanyCandidateProfileDrawer } from './CompanyCandidateProfileDrawer';
import { CompanyChatDrawer } from './CompanyChatDrawer';
import { CompanyCandidateTestsDrawer } from './CompanyCandidateTestsDrawer';
import { CompanyCustomDialog } from './CompanyCustomDialog';
import { CompanyCustomQuestionnaireDrawer } from './CompanyCustomQuestionnaireDrawer';
import { CompanyCustomTemplateRequestModal } from './CompanyCustomTemplateRequestModal';
import { CompanyDiscReportModal } from './CompanyDiscReportModal';
import { CompanyHiddenResumePrint } from './CompanyHiddenResumePrint';
import { CompanyMbtiReportModal } from './CompanyMbtiReportModal';
import { CompanyPublishedJobLinkModal } from './CompanyPublishedJobLinkModal';
import { CompanyQuestionsReportModal } from './CompanyQuestionsReportModal';
import { CompanyRegistrationDrawer } from './CompanyRegistrationDrawer';
import { CompanyTalentFiltersDrawer } from './CompanyTalentFiltersDrawer';
import { CompanyTemperamentosReportModal } from './CompanyTemperamentosReportModal';
import { VideoMeeting } from '../VideoMeeting';
import type { CompanyCustomDialogState } from '../../hooks/useCompanyCustomDialog';
import type { ChatMessage } from '../../services/messageService';
import type { CompanyForm } from '../../hooks/useCompanyManagement';
import type { CompanyRecord } from '../../services/companyService';
import type { CustomQuestion, CustomQuestionnaire } from '../../services/customQuestionnaireService';
import type { TalentFilters } from '../../hooks/useCompanyTalentBank';
import type {
  CompanyApplicant,
  CompanyApplication,
  CompanyJob,
  DiscReportResult,
  MbtiReportResult,
  TemperamentosReportResult,
} from '../../types/companyDashboard';
import type { VacancyFormData } from '../../utils/vacancyPayload';

const ManageStagesModal = React.lazy(() => import('./modals/ManageStagesModal').then((module) => ({ default: module.ManageStagesModal })));
const CustomQuestionsModal = React.lazy(() => import('./modals/CustomQuestionsModal').then((module) => ({ default: module.CustomQuestionsModal })));
const CreateVacancyTab = React.lazy(() => import('./tabs/CreateVacancyTab').then((module) => ({ default: module.CreateVacancyTab })));

export type CompanyDashboardOverlayNavigationProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export type CompanyDashboardPublishedJobProps = {
  publishedJobLink: string | null;
  hasCopiedPublishedLink: boolean;
  setHasCopiedPublishedLink: (hasCopied: boolean) => void;
  clearPublishedJobLink: () => void;
};

export type CompanyDashboardVideoMeetingProps = {
  activeVideoMeeting: { roomName: string; userName: string; interviewId?: string } | null;
  setActiveVideoMeeting: (meeting: { roomName: string; userName: string; interviewId?: string } | null) => void;
};

export type CompanyDashboardNotificationsPanelProps = {
  isNotificationsDrawerOpen: boolean;
  setIsNotificationsDrawerOpen: (isOpen: boolean) => void;
  notifications: ColaborhNotification[];
  markAllCompanyNotificationsAsRead: () => Promise<void>;
  loadCompanyNotifications: () => void | Promise<void>;
};

export type CompanyDashboardCustomDialogPanelProps = {
  customDialog: CompanyCustomDialogState;
  setCustomDialog: React.Dispatch<React.SetStateAction<CompanyCustomDialogState>>;
};

export type CompanyDashboardNotesProps = {
  isNotesModalOpen: boolean;
  selectedApplicantForNotes: CompanyApplicant | null;
  tempNotesText: string;
  setTempNotesText: (text: string) => void;
  tempNotesRating: number;
  setTempNotesRating: (rating: number) => void;
  isSavingNotes: boolean;
  handleSaveNotes: () => void | Promise<void>;
  closeNotes: () => void;
};

export type CompanyDashboardChatProps = {
  isChatDrawerOpen: boolean;
  selectedApplicantForChat: CompanyApplicant | null;
  chatMessages: ChatMessage[];
  newMessageText: string;
  setNewMessageText: (text: string) => void;
  isSendingMessage: boolean;
  isFetchingChat: boolean;
  handleLoadProfileChat: (applicant: CompanyApplicant) => void | Promise<void>;
  handleSendMessage: () => void | Promise<void>;
  closeChat: () => void;
  openMessagesDrawer: () => void;
  companyApplications: CompanyApplication[];
  getFullApplicantInfo: (applicant: CompanyApplication) => CompanyApplicant;
};

export type CompanyDashboardTalentFiltersPanelProps = {
  isFilterSidebarOpen: boolean;
  setIsFilterSidebarOpen: (isOpen: boolean) => void;
  talentFilters: TalentFilters;
  setTalentFilters: React.Dispatch<React.SetStateAction<TalentFilters>>;
  brazilStates: string[];
  talentCities: string[];
  isTalentLoadingCities: boolean;
};

export type CompanyDashboardCandidateTestsProps = {
  activeApplicantForTests: CompanyApplicant | null;
  setActiveApplicantForTests: (applicant: CompanyApplicant | null) => void;
  showCustomAlert: (message: string, title?: string) => void;
  handleRequestDiscTest: (applicant: CompanyApplicant) => void | Promise<void>;
  handleRequestQuestions: (applicant: CompanyApplicant) => void | Promise<void>;
  handleRequestMbtiTest: (applicant: CompanyApplicant) => void | Promise<void>;
  handleRequestTemperamentosTest: (applicant: CompanyApplicant) => void | Promise<void>;
};

export type CompanyDashboardCompanyRegistrationProps = {
  isRegisteringCompany: boolean;
  companyForm: CompanyForm;
  setCompanyForm: React.Dispatch<React.SetStateAction<CompanyForm>>;
  editingCompanyId: string | null;
  companies: CompanyRecord[];
  selectedCompanyId: string;
  setSelectedCompanyId: React.Dispatch<React.SetStateAction<string>>;
  setIsRegisteringCompany: (isOpen: boolean) => void;
  handleRegisterCompany: () => void | Promise<void>;
  handleDeleteCompany: (id: string, event: React.MouseEvent) => void | Promise<void>;
  handleLogoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export type CompanyDashboardVacancyPublishingProps = {
  isRegisteringVacancy: boolean;
  setIsRegisteringVacancy: (isOpen: boolean) => void;
  registerStep: number;
  setRegisterStep: (step: number | ((previous: number) => number)) => void;
  vacancyForm: VacancyFormData;
  setVacancyForm: React.Dispatch<React.SetStateAction<VacancyFormData>>;
  errorMessage: string | null;
  handleNextStep: () => void;
  handlePublish: () => void | Promise<void>;
  isPublishing: boolean;
};

export type CompanyDashboardCustomTemplateRequestProps = {
  isSelectCustomTemplateModalOpen: boolean;
  applicantForRequestCustom: CompanyApplicant | null;
  customTemplates: CustomQuestionnaire[];
  selectedTemplateIdForRequest: string | null;
  setSelectedTemplateIdForRequest: (id: string | null) => void;
  setIsSelectCustomTemplateModalOpen: (isOpen: boolean) => void;
  setApplicantForRequestCustom: (applicant: CompanyApplicant | null) => void;
  setResultsSubTab: (tab: 'relatorios' | 'guia' | 'criar') => void;
  handleConfirmRequestCustomTest: (applicant: CompanyApplicant, template: CustomQuestionnaire) => void | Promise<void>;
};

export type CompanyDashboardQuestionnaireBuilderProps = {
  isCreatingNewTemplate: boolean;
  editingTemplateId: string | null;
  customTestTitle: string;
  setCustomTestTitle: React.Dispatch<React.SetStateAction<string>>;
  customQuestions: CustomQuestion[];
  handleCancelTemplateEdit: () => void;
  addCustomQuestion: (type: 'text' | 'choice') => void;
  removeCustomQuestion: (id: string) => void;
  updateCustomQuestionText: (id: string, text: string) => void;
  addOptionToChoice: (id: string) => void;
  removeOptionFromChoice: (id: string, index: number) => void;
  updateOptionText: (id: string, index: number, text: string) => void;
  updateCorrectOption: (id: string, index: number) => void;
  handleSaveCustomTemplate: () => void | Promise<void>;
};

export type CompanyDashboardStageConfigProps = {
  isConfiguringStages: boolean;
  setIsConfiguringStages: (isOpen: boolean) => void;
  selectedJob: CompanyJob | null;
  jobApplicants: CompanyApplicant[];
  handleAddNewStage: (stageName: string) => void | Promise<void>;
  handleUpdateJobStages: (jobId: string, stages: string[]) => void | Promise<CompanyJob | void>;
  handleDeleteStage: (stageName: string) => void | Promise<void>;
  handleUpdateJobStageTests: (jobId: string, stageTests: Record<string, string[]>) => void | Promise<CompanyJob | void>;
};

export type CompanyDashboardResumeDrawerProps = {
  selectedResumeApplicant: CompanyApplicant | null;
  resumeDrawerTab: 'curriculo' | 'anotacoes' | 'mensagens' | 'testes' | 'entrevistas';
  setResumeDrawerTab: (tab: 'curriculo' | 'anotacoes' | 'mensagens' | 'testes' | 'entrevistas') => void;
  isExportingResume: boolean;
  handleDownloadResume: () => void | Promise<void>;
  setSelectedResumeApplicant: (applicant: CompanyApplicant | null) => void;
  interviewsContent: React.ReactNode;
  resumePrintRef: React.RefObject<HTMLDivElement>;
  handleUpdateApplicantStatus: (applicationId: string, status: string) => void | Promise<void>;
};

export type CompanyDashboardReportModalsProps = {
  setSelectedDiscResult: (result: DiscReportResult | null) => void;
  setSelectedMbtiResult: (result: MbtiReportResult | null) => void;
  setActiveMbtiTab: (tab: 'PERFIL' | 'DIMENSOES' | 'AUDITORIA') => void;
  setIsMbtiModalOpen: (isOpen: boolean) => void;
  setSelectedApplicantForQuestions: (applicant: CompanyApplicant | null) => void;
  setActiveCategoryTab: (tab: string) => void;
  setIsQuestionsModalOpen: (isOpen: boolean) => void;
  setSelectedTemperamentosResult: (result: TemperamentosReportResult | null) => void;
  setActiveTemperamentosTab: (tab: 'PERFIL' | 'DISTRIBUICAO' | 'AUDITORIA') => void;
  setIsTemperamentosModalOpen: (isOpen: boolean) => void;
  setSelectedApplicantForCustomTest: (applicant: CompanyApplicant | null) => void;
  setIsCustomTestModalOpen: (isOpen: boolean) => void;
  selectedDiscResult: DiscReportResult | null;
  discModalRef: React.RefObject<HTMLDivElement>;
  isExportingTestPDF: boolean;
  handleExportModalToPDF: (elementRef: React.RefObject<HTMLDivElement>, fileName: string) => Promise<void>;
  isQuestionsModalOpen: boolean;
  selectedApplicantForQuestions: CompanyApplicant | null;
  questionsModalRef: React.RefObject<HTMLDivElement>;
  activeCategoryTab: string;
  setActiveCategoryTabState: (tab: string) => void;
  isCustomTestModalOpen: boolean;
  selectedApplicantForCustomTest: CompanyApplicant | null;
  isMbtiModalOpen: boolean;
  selectedMbtiResult: MbtiReportResult | null;
  mbtiModalRef: React.RefObject<HTMLDivElement>;
  activeMbtiTab: 'PERFIL' | 'DIMENSOES' | 'AUDITORIA';
  setActiveMbtiTabState: (tab: 'PERFIL' | 'DIMENSOES' | 'AUDITORIA') => void;
  isTemperamentosModalOpen: boolean;
  selectedTemperamentosResult: TemperamentosReportResult | null;
  temperamentosModalRef: React.RefObject<HTMLDivElement>;
  activeTemperamentosTab: 'PERFIL' | 'DISTRIBUICAO' | 'AUDITORIA';
  setActiveTemperamentosTabState: (tab: 'PERFIL' | 'DISTRIBUICAO' | 'AUDITORIA') => void;
};

export interface CompanyDashboardOverlaysProps {
  navigation: CompanyDashboardOverlayNavigationProps;
  vacancyPublishing: CompanyDashboardVacancyPublishingProps;
  stageConfig: CompanyDashboardStageConfigProps;
  notificationsPanel: CompanyDashboardNotificationsPanelProps;
  customDialogPanel: CompanyDashboardCustomDialogPanelProps;
  publishedJob: CompanyDashboardPublishedJobProps;
  resumeDrawer: CompanyDashboardResumeDrawerProps;
  videoMeeting: CompanyDashboardVideoMeetingProps;
  reportModals: CompanyDashboardReportModalsProps;
  notes: CompanyDashboardNotesProps;
  chat: CompanyDashboardChatProps;
  customTemplateRequest: CompanyDashboardCustomTemplateRequestProps;
  companyRegistration: CompanyDashboardCompanyRegistrationProps;
  questionnaireBuilder: CompanyDashboardQuestionnaireBuilderProps;
  talentFiltersPanel: CompanyDashboardTalentFiltersPanelProps;
  candidateTests: CompanyDashboardCandidateTestsProps;
}

export const CompanyDashboardOverlays = ({
  navigation,
  vacancyPublishing,
  stageConfig,
  notificationsPanel,
  customDialogPanel,
  publishedJob,
  resumeDrawer,
  videoMeeting,
  reportModals,
  notes,
  chat,
  customTemplateRequest,
  companyRegistration,
  questionnaireBuilder,
  talentFiltersPanel,
  candidateTests,
}: CompanyDashboardOverlaysProps) => {
  const { activeTab, setActiveTab } = navigation;

  const {
    isRegisteringVacancy,
    setIsRegisteringVacancy,
    registerStep,
    setRegisterStep,
    vacancyForm,
    setVacancyForm,
    errorMessage,
    handleNextStep,
    handlePublish,
    isPublishing,
  } = vacancyPublishing;

  const {
    isConfiguringStages,
    setIsConfiguringStages,
    selectedJob,
    jobApplicants,
    handleAddNewStage,
    handleUpdateJobStages,
    handleDeleteStage,
    handleUpdateJobStageTests,
  } = stageConfig;

  const {
    isNotificationsDrawerOpen,
    setIsNotificationsDrawerOpen,
    notifications,
    markAllCompanyNotificationsAsRead,
    loadCompanyNotifications,
  } = notificationsPanel;

  const { customDialog, setCustomDialog } = customDialogPanel;

  const {
    publishedJobLink,
    hasCopiedPublishedLink,
    setHasCopiedPublishedLink,
    clearPublishedJobLink,
  } = publishedJob;

  const {
    selectedResumeApplicant,
    resumeDrawerTab,
    setResumeDrawerTab,
    isExportingResume,
    handleDownloadResume,
    setSelectedResumeApplicant,
    interviewsContent,
    resumePrintRef,
    handleUpdateApplicantStatus,
  } = resumeDrawer;
  const {
    activeVideoMeeting,
    setActiveVideoMeeting,
  } = videoMeeting;

  const {
    setSelectedDiscResult,
    setSelectedMbtiResult,
    setActiveMbtiTab,
    setIsMbtiModalOpen,
    setSelectedApplicantForQuestions,
    setActiveCategoryTab,
    setIsQuestionsModalOpen,
    setSelectedTemperamentosResult,
    setActiveTemperamentosTab,
    setIsTemperamentosModalOpen,
    setSelectedApplicantForCustomTest,
    setIsCustomTestModalOpen,
    selectedDiscResult,
    discModalRef,
    isExportingTestPDF,
    handleExportModalToPDF,
    isQuestionsModalOpen,
    selectedApplicantForQuestions,
    questionsModalRef,
    activeCategoryTab,
    setActiveCategoryTabState,
    isCustomTestModalOpen,
    selectedApplicantForCustomTest,
    isMbtiModalOpen,
    selectedMbtiResult,
    mbtiModalRef,
    activeMbtiTab,
    setActiveMbtiTabState,
    isTemperamentosModalOpen,
    selectedTemperamentosResult,
    temperamentosModalRef,
    activeTemperamentosTab,
    setActiveTemperamentosTabState,
  } = reportModals;

  const {
    tempNotesText,
    setTempNotesText,
    tempNotesRating,
    setTempNotesRating,
    isSavingNotes,
    handleSaveNotes,
  } = notes;

  const {
    isChatDrawerOpen,
    selectedApplicantForChat,
    chatMessages,
    newMessageText,
    setNewMessageText,
    isSendingMessage,
    isFetchingChat,
    handleLoadProfileChat,
    handleSendMessage,
    closeChat,
    companyApplications,
    getFullApplicantInfo,
  } = chat;

  const {
    isSelectCustomTemplateModalOpen,
    applicantForRequestCustom,
    customTemplates,
    selectedTemplateIdForRequest,
    setSelectedTemplateIdForRequest,
    setIsSelectCustomTemplateModalOpen,
    setApplicantForRequestCustom,
    setResultsSubTab,
    handleConfirmRequestCustomTest,
  } = customTemplateRequest;

  const {
    isRegisteringCompany,
    companyForm,
    setCompanyForm,
    editingCompanyId,
    companies,
    selectedCompanyId,
    setSelectedCompanyId,
    setIsRegisteringCompany,
    handleRegisterCompany,
    handleDeleteCompany,
    handleLogoChange,
  } = companyRegistration;

  const {
    isCreatingNewTemplate,
    editingTemplateId,
    customTestTitle,
    setCustomTestTitle,
    customQuestions,
    handleCancelTemplateEdit,
    addCustomQuestion,
    removeCustomQuestion,
    updateCustomQuestionText,
    addOptionToChoice,
    removeOptionFromChoice,
    updateOptionText,
    updateCorrectOption,
    handleSaveCustomTemplate,
  } = questionnaireBuilder;

  const {
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    talentFilters,
    setTalentFilters,
    brazilStates,
    talentCities,
    isTalentLoadingCities,
  } = talentFiltersPanel;

  const {
    activeApplicantForTests,
    setActiveApplicantForTests,
    showCustomAlert,
    handleRequestDiscTest,
    handleRequestQuestions,
    handleRequestMbtiTest,
    handleRequestTemperamentosTest,
  } = candidateTests;

  return (
    <React.Suspense fallback={<OverlayFallback />}>
      {activeVideoMeeting && (
        <VideoMeeting
          interviewId={activeVideoMeeting.interviewId}
          enableAiReport
          roomName={activeVideoMeeting.roomName}
          userName={activeVideoMeeting.userName}
          onClose={() => setActiveVideoMeeting(null)}
        />
      )}
    <AnimatePresence>
      {isRegisteringVacancy && (
        <CreateVacancyTab
          isOpen={isRegisteringVacancy}
          onClose={() => {
            setIsRegisteringVacancy(false);
            setRegisterStep(1);
          }}
          registerStep={registerStep}
          setRegisterStep={setRegisterStep}
          vacancyForm={vacancyForm}
          setVacancyForm={setVacancyForm}
          errorMessage={errorMessage}
          handleNextStep={handleNextStep}
          handlePublish={handlePublish}
          isPublishing={isPublishing}
        />
      )}

      {isConfiguringStages && (
        <ManageStagesModal
          isOpen={isConfiguringStages}
          onClose={() => setIsConfiguringStages(false)}
          job={selectedJob}
          jobApplicants={jobApplicants}
          customTemplates={customTemplates}
          onAddNewStage={handleAddNewStage}
          onReorderStages={(newStages) => handleUpdateJobStages(selectedJob.id, newStages)}
          onDeleteStage={handleDeleteStage}
          onUpdateStageTests={handleUpdateJobStageTests}
        />
      )}

      <NotificationsDrawer
        isOpen={isNotificationsDrawerOpen}
        onClose={() => setIsNotificationsDrawerOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={async () => {
          await markAllCompanyNotificationsAsRead();
        }}
        onMarkAsRead={async (id) => {
          await markNotificationAsRead(id);
          loadCompanyNotifications();
        }}
        onDelete={async (id) => {
          await deleteNotification(id);
          loadCompanyNotifications();
        }}
      />
      <CompanyCustomDialog customDialog={customDialog} setCustomDialog={setCustomDialog} />
      <CompanyPublishedJobLinkModal
        publishedJobLink={publishedJobLink}
        hasCopiedPublishedLink={hasCopiedPublishedLink}
        setHasCopiedPublishedLink={setHasCopiedPublishedLink}
        onClose={() => {
          clearPublishedJobLink();
          setActiveTab('Minhas Vagas');
        }}
      />

      <CompanyCandidateProfileDrawer
        applicant={selectedResumeApplicant}
        activeTab={resumeDrawerTab}
        setActiveTab={setResumeDrawerTab}
        isExportingResume={isExportingResume}
        onDownloadResume={handleDownloadResume}
        onClose={() => setSelectedResumeApplicant(null)}
        profileMode={activeTab === 'Banco de Talentos' ? 'talentBank' : 'process'}
        notesText={tempNotesText}
        setNotesText={setTempNotesText}
        notesRating={tempNotesRating}
        setNotesRating={setTempNotesRating}
        isSavingNotes={isSavingNotes}
        onSaveNotes={handleSaveNotes}
        chatMessages={chatMessages}
        newMessageText={newMessageText}
        setNewMessageText={setNewMessageText}
        isSendingMessage={isSendingMessage}
        isFetchingChat={isFetchingChat}
        onOpenMessages={handleLoadProfileChat}
        onSendMessage={handleSendMessage}
        interviewsContent={interviewsContent}
        onViewDisc={setSelectedDiscResult}
        onViewMbti={(result) => {
          setSelectedMbtiResult(result);
          setActiveMbtiTab('PERFIL');
          setIsMbtiModalOpen(true);
        }}
        onViewQuestions={(result) => {
          setSelectedApplicantForQuestions(result);
          setActiveCategoryTab('EXPERIENCE');
          setIsQuestionsModalOpen(true);
        }}
        onViewTemperamentos={(result) => {
          setSelectedTemperamentosResult(result);
          setActiveTemperamentosTab('PERFIL');
          setIsTemperamentosModalOpen(true);
        }}
        onViewCustom={(result) => {
          setSelectedApplicantForCustomTest(result);
          setIsCustomTestModalOpen(true);
        }}
        onRequestDisc={handleRequestDiscTest}
        onRequestMbti={handleRequestMbtiTest}
        onRequestQuestions={handleRequestQuestions}
        onRequestTemperamentos={handleRequestTemperamentosTest}
        onRequestCustom={(application) => {
          setApplicantForRequestCustom(application);
          setIsSelectCustomTemplateModalOpen(true);
        }}
        stageOptions={getCurrentJobStages(selectedJob)}
        onUpdateApplicantStatus={async (applicationId, status) => {
          await handleUpdateApplicantStatus(applicationId, status);
          setSelectedResumeApplicant(selectedResumeApplicant ? { ...selectedResumeApplicant, status } : null);
        }}
      />
      <CompanyDiscReportModal
        result={selectedDiscResult}
        modalRef={discModalRef}
        isExportingPDF={isExportingTestPDF}
        onExportPDF={handleExportModalToPDF}
        onClose={() => setSelectedDiscResult(null)}
      />
      <CompanyQuestionsReportModal
        isOpen={isQuestionsModalOpen}
        applicant={selectedApplicantForQuestions}
        modalRef={questionsModalRef}
        activeCategoryTab={activeCategoryTab}
        setActiveCategoryTab={setActiveCategoryTabState}
        isExportingPDF={isExportingTestPDF}
        onExportPDF={handleExportModalToPDF}
        onClose={() => {
          setIsQuestionsModalOpen(false);
          setSelectedApplicantForQuestions(null);
        }}
      />

      <CustomQuestionsModal
        isOpen={isCustomTestModalOpen}
        onClose={() => {
          setIsCustomTestModalOpen(false);
          setSelectedApplicantForCustomTest(null);
        }}
        applicant={selectedApplicantForCustomTest}
        selectedJob={selectedJob}
        customTemplates={customTemplates}
        onExportPDF={handleExportModalToPDF}
        isExportingPDF={isExportingTestPDF}
      />
      <CompanyMbtiReportModal
        isOpen={isMbtiModalOpen}
        result={selectedMbtiResult}
        modalRef={mbtiModalRef}
        activeTab={activeMbtiTab}
        setActiveTab={setActiveMbtiTabState}
        isExportingPDF={isExportingTestPDF}
        onExportPDF={handleExportModalToPDF}
        onClose={() => {
          setIsMbtiModalOpen(false);
          setSelectedMbtiResult(null);
        }}
      />
      <CompanyTemperamentosReportModal
        isOpen={isTemperamentosModalOpen}
        result={selectedTemperamentosResult}
        modalRef={temperamentosModalRef}
        activeTab={activeTemperamentosTab}
        setActiveTab={setActiveTemperamentosTabState}
        isExportingPDF={isExportingTestPDF}
        onExportPDF={handleExportModalToPDF}
        onClose={() => {
          setIsTemperamentosModalOpen(false);
          setSelectedTemperamentosResult(null);
        }}
      />
      <CompanyCustomTemplateRequestModal
        isOpen={isSelectCustomTemplateModalOpen}
        applicant={applicantForRequestCustom}
        customTemplates={customTemplates}
        selectedTemplateId={selectedTemplateIdForRequest}
        setSelectedTemplateId={setSelectedTemplateIdForRequest}
        onClose={() => {
          setIsSelectCustomTemplateModalOpen(false);
          setApplicantForRequestCustom(null);
          setSelectedTemplateIdForRequest(null);
        }}
        onConfirm={handleConfirmRequestCustomTest}
        onGoToCreateTemplates={() => {
          setIsSelectCustomTemplateModalOpen(false);
          setApplicantForRequestCustom(null);
          setSelectedTemplateIdForRequest(null);
          setActiveTab('Avaliações');
          setResultsSubTab('criar');
        }}
      />
      <CompanyRegistrationDrawer
        isOpen={isRegisteringCompany}
        companyForm={companyForm}
        setCompanyForm={setCompanyForm}
        editingCompanyId={editingCompanyId}
        companies={companies}
        selectedCompanyId={selectedCompanyId}
        setSelectedCompanyId={setSelectedCompanyId}
        onClose={() => setIsRegisteringCompany(false)}
        onSave={handleRegisterCompany}
        onDeleteCompany={handleDeleteCompany}
        onLogoChange={handleLogoChange}
      />
      <CompanyCustomQuestionnaireDrawer
        isOpen={isCreatingNewTemplate}
        editingTemplateId={editingTemplateId}
        customTestTitle={customTestTitle}
        setCustomTestTitle={setCustomTestTitle}
        customQuestions={customQuestions}
        onClose={handleCancelTemplateEdit}
        onAddQuestion={addCustomQuestion}
        onRemoveQuestion={removeCustomQuestion}
        onUpdateQuestionText={updateCustomQuestionText}
        onAddOption={addOptionToChoice}
        onRemoveOption={removeOptionFromChoice}
        onUpdateOptionText={updateOptionText}
        onUpdateCorrectOption={updateCorrectOption}
        onSave={handleSaveCustomTemplate}
      />

      <CompanyTalentFiltersDrawer
        isOpen={isFilterSidebarOpen}
        filters={talentFilters}
        setFilters={setTalentFilters}
        brazilStates={brazilStates}
        cities={talentCities}
        isLoadingCities={isTalentLoadingCities}
        onClose={() => setIsFilterSidebarOpen(false)}
        onApply={() => {
          setIsFilterSidebarOpen(false);
          if (activeTab !== 'Banco de Talentos') {
            setActiveTab('Banco de Talentos');
          }
        }}
      />

      <CompanyCandidateTestsDrawer
        applicant={activeApplicantForTests}
        selectedJob={selectedJob}
        onClose={() => setActiveApplicantForTests(null)}
        onApplicantChange={setActiveApplicantForTests}
        onAlert={showCustomAlert}
        onRequestDisc={handleRequestDiscTest}
        onRequestQuestions={handleRequestQuestions}
        onRequestMbti={handleRequestMbtiTest}
        onRequestTemperamentos={handleRequestTemperamentosTest}
        onViewDisc={setSelectedDiscResult}
        onViewQuestions={(applicant) => {
          setSelectedApplicantForQuestions(applicant);
          setActiveCategoryTab('EXPERIENCE');
          setIsQuestionsModalOpen(true);
        }}
        onViewMbti={(result) => {
          setSelectedMbtiResult(result);
          setActiveMbtiTab('PERFIL');
          setIsMbtiModalOpen(true);
        }}
        onViewTemperamentos={(result) => {
          setSelectedTemperamentosResult(result);
          setActiveTemperamentosTab('PERFIL');
          setIsTemperamentosModalOpen(true);
        }}
        onViewCustom={(applicant) => {
          setSelectedApplicantForCustomTest(applicant);
          setIsCustomTestModalOpen(true);
        }}
        onRequestCustom={(application) => {
          setApplicantForRequestCustom(application);
          setIsSelectCustomTemplateModalOpen(true);
        }}
      />
      <CompanyChatDrawer
        isOpen={isChatDrawerOpen}
        applicant={selectedApplicantForChat}
        applicants={companyApplications.map(getFullApplicantInfo)}
        messages={chatMessages}
        newMessageText={newMessageText}
        setNewMessageText={setNewMessageText}
        isSendingMessage={isSendingMessage}
        isFetchingChat={isFetchingChat}
        onSelectApplicant={handleLoadProfileChat}
        onSendMessage={handleSendMessage}
        onClose={closeChat}
      />
      <CompanyHiddenResumePrint applicant={selectedResumeApplicant} resumePrintRef={resumePrintRef} />
    </AnimatePresence>
  </React.Suspense>
  );
};
