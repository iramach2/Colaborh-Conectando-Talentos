import { useCompanyNotifications } from '../hooks/useCompanyNotifications';
import { useCompanyChat } from '../hooks/useCompanyChat';
import { useEffect } from 'react';
import { useCompanyInterviews } from '../hooks/useCompanyInterviews';
import { useCompanyJobs } from '../hooks/useCompanyJobs';
import { useCompanyDashboardMetrics } from '../hooks/useCompanyDashboardMetrics';
import { useCompanyApplicantNotes } from '../hooks/useCompanyApplicantNotes';
import { useAssessmentRequestGate } from '../hooks/useAssessmentRequestGate';
import { useCompanyAssessmentCredits } from '../hooks/useCompanyAssessmentCredits';
import { useCompanyAssessmentRequests } from '../hooks/useCompanyAssessmentRequests';
import { useCompanyAssessmentApplicantUpdates } from '../hooks/useCompanyAssessmentApplicantUpdates';
import { useCompanyJobWorkflow } from '../hooks/useCompanyJobWorkflow';
import { useCompanyJobApplicants } from '../hooks/useCompanyJobApplicants';
import { useCompanyTalentBank } from '../hooks/useCompanyTalentBank';
import { useCompanyManagement } from '../hooks/useCompanyManagement';
import { useCompanyJobActions } from '../hooks/useCompanyJobActions';
import { useCompanyVacancyPublishing } from '../hooks/useCompanyVacancyPublishing';
import { useCompanyApplicantStatus } from '../hooks/useCompanyApplicantStatus';
import { useCompanyCustomDialog } from '../hooks/useCompanyCustomDialog';
import { useCompanyDashboardHeaderState } from '../hooks/useCompanyDashboardHeaderState';
import { useCompanyResumeDrawerState } from '../hooks/useCompanyResumeDrawerState';
import { useCompanyDashboardUiState } from '../hooks/useCompanyDashboardUiState';
import { useCompanyApplicantResolver } from '../hooks/useCompanyApplicantResolver';
import { useCompanySelectedJobReset } from '../hooks/useCompanySelectedJobReset';
import { useCompanyInterviewPanels } from '../hooks/useCompanyInterviewPanels';
import { useCompanyAssessmentReportState } from '../hooks/useCompanyAssessmentReportState';
import { useCompanySessionState } from '../hooks/useCompanySessionState';
import { useCompanyAssessmentWorkspace } from '../hooks/useCompanyAssessmentWorkspace';
import { useCompanyDashboardViewProps } from '../hooks/useCompanyDashboardViewProps';
import { getCompanyPlanLimits, getPlanUpgradeMessage } from '../utils/companyPlans';
import { CompanyDashboardShell } from './CompanyDashboard/CompanyDashboardShell';
import { 
  BRAZIL_STATES, 
  formatDate, 
  calculateAiMatchScore, 
  getCurrentJobStages, 
} from '../utils/companyDashboardUtils';
import {
  hydrateApplicationsWithAssessments,
} from '../services/assessmentService';


interface CompanyDashboardProps {
  onLogout: () => void;
}

export default function CompanyDashboard({ onLogout }: CompanyDashboardProps) {
  const {
    activeTab,
    setActiveTab,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    activeApplicantForTests,
    setActiveApplicantForTests,
    selectedJob,
    setSelectedJob,
    jobApplicants,
    setJobApplicants,
    isRegisteringCompany,
    setIsRegisteringCompany,
    isRegisteringVacancy,
    setIsRegisteringVacancy,
    isConfiguringStages,
    setIsConfiguringStages,
    jobSubTab,
    setJobSubTab,
    jobSearch,
    setJobSearch,
    isJobSearchFocused,
    setIsJobSearchFocused,
    isFiltersVisible,
    setIsFiltersVisible,
    handleSelectTab,
  } = useCompanyDashboardUiState();
  const { canRequestAssessment } = useAssessmentRequestGate(selectedJob);
  const {
    updateApplicantCandidatePhone,
    notifyCandidateAssessmentRequest,
  } = useCompanyAssessmentApplicantUpdates({
    selectedJob,
    setJobApplicants,
  });
  const {
    companies,
    setCompanies,
    selectedCompany,
    selectedCompanyId,
    setSelectedCompanyId,
  } = useCompanySessionState();
  const {
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
    customQuestions,
    customTemplates,
    editingTemplateId,
    isCreatingNewTemplate,
    customTestTitle,
    isLoadingCustomTemplates,
    setCustomTestTitle,
    addCustomQuestion,
    removeCustomQuestion,
    updateCustomQuestionText,
    addOptionToChoice,
    removeOptionFromChoice,
    updateOptionText,
    updateCorrectOption,
    handleSaveCustomTemplate,
    handleEditCustomTemplate,
    handleDeleteCustomTemplate,
    handleStartNewTemplate,
    handleCancelTemplateEdit,
  } = useCompanyAssessmentWorkspace(selectedCompanyId, selectedCompany?.plan);

  const {
    companyDropdownRef,
    profileMenuRef,
    isCompanyDropdownOpen,
    setIsCompanyDropdownOpen,
    isProfileMenuOpen,
    setIsProfileMenuOpen,
    companySearchQuery,
    setCompanySearchQuery,
  } = useCompanyDashboardHeaderState();

  const { validateAndDeductCredit } = useCompanyAssessmentCredits({
    companies,
    selectedCompanyId,
    setCompanies,
    setActiveTab,
  });
  const {
    handleRequestDiscTest,
    handleRequestQuestions,
    handleRequestMbtiTest,
    handleRequestTemperamentosTest,
    handleRequestCustomTest,
    handleConfirmRequestCustomTest,
  } = useCompanyAssessmentRequests({
    selectedJob,
    canRequestAssessment,
    validateAndDeductCredit,
    updateApplicantCandidatePhone,
    notifyCandidateAssessmentRequest,
    closeCustomTemplateRequest,
  });
  const {
    selectedResumeApplicant,
    setSelectedResumeApplicant,
    resumeDrawerTab,
    setResumeDrawerTab,
  } = useCompanyResumeDrawerState();
  const {
    isExportingResume,
    isExportingTestPDF,
    resumePrintRef,
    discModalRef,
    mbtiModalRef,
    temperamentosModalRef,
    questionsModalRef,
    handleDownloadResume,
    handleExportModalToPDF,
    selectedDiscResult,
    setSelectedDiscResult,
    isQuestionsModalOpen,
    setIsQuestionsModalOpen,
    selectedApplicantForQuestions,
    setSelectedApplicantForQuestions,
    activeCategoryTab,
    setActiveCategoryTab,
    selectedMbtiResult,
    setSelectedMbtiResult,
    isMbtiModalOpen,
    setIsMbtiModalOpen,
    activeMbtiTab,
    setActiveMbtiTab,
    selectedTemperamentosResult,
    setSelectedTemperamentosResult,
    isTemperamentosModalOpen,
    setIsTemperamentosModalOpen,
    activeTemperamentosTab,
    setActiveTemperamentosTab,
  } = useCompanyAssessmentReportState({ selectedResumeApplicant });

  const {
    talents,
    filteredTalents,
    isFetchingTalents,
    talentSubTab,
    setTalentSubTab,
    talentSearch,
    setTalentSearch,
    isAiSearching,
    aiPrompt,
    setAiPrompt,
    talentFilters,
    setTalentFilters,
    talentCities,
    isTalentLoadingCities,
    handleToggleSaveTalent,
    handleAiSearch,
  } = useCompanyTalentBank({
    companies,
    selectedCompanyId,
    setCompanies,
  });

  const getFullApplicantInfo = useCompanyApplicantResolver(talents);

  useEffect(() => {
    setSelectedResumeApplicant((currentApplicant) => {
      if (!currentApplicant || currentApplicant.talentMatched) return currentApplicant;

      const resolvedApplicant = getFullApplicantInfo(currentApplicant);
      return resolvedApplicant.talentMatched ? resolvedApplicant : currentApplicant;
    });
  }, [getFullApplicantInfo, setSelectedResumeApplicant]);

  const {
    isNotesModalOpen,
    selectedApplicantForNotes,
    tempNotesText,
    setTempNotesText,
    tempNotesRating,
    setTempNotesRating,
    isSavingNotes,
    hydrateApplicationsWithNotes,
    handleOpenNotes,
    handleSaveNotes,
    closeNotes,
  } = useCompanyApplicantNotes(
    getFullApplicantInfo,
    selectedResumeApplicant,
    setSelectedResumeApplicant,
    setJobApplicants
  );
  const {
    isChatDrawerOpen,
    selectedApplicantForChat,
    chatMessages,
    newMessageText,
    setNewMessageText,
    isSendingMessage,
    isFetchingChat,
    handleOpenChat,
    handleLoadProfileChat,
    openMessagesDrawer,
    handleSendMessage,
    closeChat,
  } = useCompanyChat(selectedJob, getFullApplicantInfo, selectedCompany);

  const {
    customDialog,
    setCustomDialog,
    showCustomAlert,
    showCustomSuccess,
    showCustomConfirm,
  } = useCompanyCustomDialog();
  const {
    companyForm,
    setCompanyForm,
    editingCompanyId,
    resetCompanyForm,
    handleRegisterCompany,
    handleEditCompany,
    handleDeleteCompany,
    handleLogoChange,
  } = useCompanyManagement({
    companies,
    setCompanies,
    selectedCompanyId,
    setSelectedCompanyId,
    setIsRegisteringCompany,
  });

  const {
    jobs,
    setJobs,
    companyJobs,
    isFetchingJobs,
    companyApplications,
    isFetchingCompanyApps,
  } = useCompanyJobs(selectedCompany, selectedCompanyId, activeTab, hydrateApplicationsWithNotes);
  const {
    activeStageTab,
    setActiveStageTab,
    handleUpdateJobStages,
    handleUpdateJobStageTests,
    handleAddNewStage,
    handleDeleteStage,
  } = useCompanyJobWorkflow({
    jobs,
    setJobs,
    selectedJob,
    setSelectedJob,
    jobApplicants,
    showCustomAlert,
    showCustomConfirm,
  });
  const {
    isFetchingApplicants,
    handleViewApplicants,
  } = useCompanyJobApplicants({
    hydrateApplicationsWithNotes,
    setJobApplicants,
    setSelectedJob,
    setActiveStageTab,
  });
  const {
    handleShareJob,
    handleUpdateJobStatus,
    handleDeleteJob,
  } = useCompanyJobActions({
    setJobs,
    showCustomAlert,
    showCustomSuccess,
    showCustomConfirm,
  });
  const {
    registerStep,
    setRegisterStep,
    vacancyForm,
    setVacancyForm,
    isPublishing,
    publishedJobLink,
    hasCopiedPublishedLink,
    setHasCopiedPublishedLink,
    errorMessage,
    handleNextStep,
    handlePublish,
    clearPublishedJobLink,
  } = useCompanyVacancyPublishing({
    selectedCompany,
    companyJobs,
    setJobs,
    setJobSubTab,
    setActiveTab,
    setIsRegisteringVacancy,
  });
  const {
    notifications,
    isNotificationsDrawerOpen,
    setIsNotificationsDrawerOpen,
    loadCompanyNotifications,
    markAllCompanyNotificationsAsRead,
  } = useCompanyNotifications(selectedCompany, companyJobs);

  const {
    activeJobsCount,
    pausedJobsCount,
    closedJobsCount,
    totalCandidatesReal,
    candidatesInInterview,
    closedOrPausedJobsCount,
    recentCandidatesCount,
    recentJobsCount,
    dynamicDistribution,
    dynamicApplicationData,
    dynamicTopSkills,
  } = useCompanyDashboardMetrics(companyJobs, companyApplications);
  const { handleUpdateApplicantStatus } = useCompanyApplicantStatus({
    selectedJob,
    jobApplicants,
    setJobApplicants,
    getFullApplicantInfo,
    customTemplates,
    handleRequestDiscTest,
    handleRequestMbtiTest,
    handleRequestTemperamentosTest,
    handleRequestQuestions,
    handleRequestCustomTest,
  });
  const {
    interviews,
    activeVideoMeeting,
    setActiveVideoMeeting,
    handleCreateInterview,
    handleUpdateInterviewStatus,
  } = useCompanyInterviews(
    selectedCompany,
    selectedCompanyId,
    activeTab,
    jobApplicants,
    getFullApplicantInfo,
    handleUpdateApplicantStatus
  );
  // Close job details/applicants/Kanban when switching company
  useCompanySelectedJobReset(selectedCompanyId, setSelectedJob);

  const {
    interviewsTabContent,
    candidateInterviewsDrawerContent,
  } = useCompanyInterviewPanels({
    companyJobs,
    jobs,
    interviews,
    jobApplicants,
    selectedCompany,
    getFullApplicantInfo,
    setActiveVideoMeeting,
    handleUpdateInterviewStatus,
    selectedResumeApplicant,
    selectedJob,
    handleCreateInterview,
  });

  const selectedCompanyPlanLimits = getCompanyPlanLimits(selectedCompany);
  const handlePlanFeatureBlocked = (feature: string) => {
    showCustomAlert(getPlanUpgradeMessage(feature), 'Plano gratuito');
    setActiveTab('Faturamento');
  };

  const handleDownloadResumeWithPlanGate = () => {
    if (!selectedCompanyPlanLimits.canDownloadResumes) {
      handlePlanFeatureBlocked('Download de curr?culos dos candidatos');
      return;
    }
    return handleDownloadResume();
  };

  const { sidebarProps, headerProps, contentProps, overlayProps } = useCompanyDashboardViewProps({
    activeTab,
    setActiveTab,
    onLogout,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    handleSelectTab,
    showCustomAlert,
    setIsNotificationsDrawerOpen,
    companyDropdownRef,
    profileMenuRef,
    isCompanyDropdownOpen,
    setIsCompanyDropdownOpen,
    isProfileMenuOpen,
    setIsProfileMenuOpen,
    companySearchQuery,
    setCompanySearchQuery,
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
    canDownloadResumes: selectedCompanyPlanLimits.canDownloadResumes,
    canUseDirectWhatsApp: selectedCompanyPlanLimits.canUseDirectWhatsApp,
    onPlanFeatureBlocked: handlePlanFeatureBlocked,
    jobSearch,
    setJobSearch,
    isJobSearchFocused,
    setIsJobSearchFocused,
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
    setSelectedCompanyId,
    resetCompanyForm,
    setIsRegisteringCompany,
    handleEditCompany,
    handleDeleteCompany,
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
    selectedCompany,
    setCompanies,
    interviewsTabContent,
    isRegisteringVacancy,
    registerStep,
    vacancyForm,
    setVacancyForm,
    errorMessage,
    handleNextStep,
    handlePublish,
    isPublishing,
    isConfiguringStages,
    handleAddNewStage,
    handleUpdateJobStages,
    handleDeleteStage,
    handleUpdateJobStageTests,
    isNotificationsDrawerOpen,
    notifications,
    markAllCompanyNotificationsAsRead,
    loadCompanyNotifications,
    customDialog,
    setCustomDialog,
    publishedJobLink,
    hasCopiedPublishedLink,
    setHasCopiedPublishedLink,
    clearPublishedJobLink,
    selectedResumeApplicant,
    resumeDrawerTab,
    setResumeDrawerTab,
    isExportingResume,
    handleDownloadResume: handleDownloadResumeWithPlanGate,
    candidateInterviewsDrawerContent,
    activeVideoMeeting,
    setActiveVideoMeeting,
    resumePrintRef,
    setActiveMbtiTab,
    setActiveCategoryTab,
    setActiveTemperamentosTab,
    selectedDiscResult,
    discModalRef,
    isExportingTestPDF,
    handleExportModalToPDF,
    isQuestionsModalOpen,
    selectedApplicantForQuestions,
    questionsModalRef,
    activeCategoryTab,
    isCustomTestModalOpen,
    selectedApplicantForCustomTest,
    isMbtiModalOpen,
    selectedMbtiResult,
    mbtiModalRef,
    activeMbtiTab,
    isTemperamentosModalOpen,
    selectedTemperamentosResult,
    temperamentosModalRef,
    activeTemperamentosTab,
    isNotesModalOpen,
    selectedApplicantForNotes,
    tempNotesText,
    setTempNotesText,
    tempNotesRating,
    setTempNotesRating,
    isSavingNotes,
    handleSaveNotes,
    closeNotes,
    isChatDrawerOpen,
    selectedApplicantForChat,
    chatMessages,
    newMessageText,
    setNewMessageText,
    isSendingMessage,
    isFetchingChat,
    handleLoadProfileChat,
    openMessagesDrawer,
    handleSendMessage,
    closeChat,
    isSelectCustomTemplateModalOpen,
    applicantForRequestCustom,
    selectedTemplateIdForRequest,
    setSelectedTemplateIdForRequest,
    setIsSelectCustomTemplateModalOpen,
    setApplicantForRequestCustom,
    handleConfirmRequestCustomTest,
    isRegisteringCompany,
    companyForm,
    setCompanyForm,
    editingCompanyId,
    handleRegisterCompany,
    handleLogoChange,
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
    isFilterSidebarOpen,
    brazilStates: BRAZIL_STATES,
    activeApplicantForTests,
    setActiveApplicantForTests,
  });
  return (
    <CompanyDashboardShell
      sidebarProps={sidebarProps}
      headerProps={headerProps}
      contentProps={contentProps}
      overlayProps={overlayProps}
    />
  );
}

