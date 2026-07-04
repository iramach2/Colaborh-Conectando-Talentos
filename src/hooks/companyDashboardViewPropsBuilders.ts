import type { ReactNode } from 'react';
import type { CompanyDashboardContentProps } from '../components/CompanyDashboard/CompanyDashboardContent';
import type { CompanyDashboardHeaderProps } from '../components/CompanyDashboard/CompanyDashboardHeader';
import type { CompanyDashboardOverlaysProps } from '../components/CompanyDashboard/CompanyDashboardOverlays';
import type { CompanyDashboardSidebarProps } from '../components/CompanyDashboard/CompanyDashboardSidebar';

export type CompanyDashboardViewContext =
  Omit<CompanyDashboardSidebarProps, 'onSelectTab'> & {
    handleSelectTab: CompanyDashboardSidebarProps['onSelectTab'];
  } &
  Omit<CompanyDashboardHeaderProps, 'onStartNewTemplate'> & {
    handleStartNewTemplate: CompanyDashboardHeaderProps['onStartNewTemplate'];
  } &
  CompanyDashboardContentProps['overview'] &
  CompanyDashboardContentProps['vacancies'] &
  CompanyDashboardContentProps['talentBank'] &
  CompanyDashboardContentProps['companiesPanel'] &
  CompanyDashboardContentProps['assessments'] &
  CompanyDashboardContentProps['billing'] & {
    interviewsTabContent: ReactNode;
  } &
  CompanyDashboardOverlaysProps['navigation'] &
  CompanyDashboardOverlaysProps['vacancyPublishing'] &
  CompanyDashboardOverlaysProps['stageConfig'] &
  CompanyDashboardOverlaysProps['notificationsPanel'] &
  CompanyDashboardOverlaysProps['customDialogPanel'] &
  CompanyDashboardOverlaysProps['publishedJob'] &
  Omit<CompanyDashboardOverlaysProps['resumeDrawer'], 'interviewsContent'> &
  CompanyDashboardOverlaysProps['videoMeeting'] &
  Omit<
    CompanyDashboardOverlaysProps['reportModals'],
    'setActiveCategoryTabState' | 'setActiveMbtiTabState' | 'setActiveTemperamentosTabState'
  > &
  CompanyDashboardOverlaysProps['notes'] &
  CompanyDashboardOverlaysProps['chat'] &
  CompanyDashboardOverlaysProps['customTemplateRequest'] &
  CompanyDashboardOverlaysProps['companyRegistration'] &
  CompanyDashboardOverlaysProps['questionnaireBuilder'] &
  CompanyDashboardOverlaysProps['talentFiltersPanel'] &
  CompanyDashboardOverlaysProps['candidateTests'] & {
    candidateInterviewsDrawerContent: ReactNode;
    brazilStates: string[];
  };

export const buildCompanySidebarProps = (context: CompanyDashboardViewContext): CompanyDashboardSidebarProps => ({
  activeTab: context.activeTab,
  isMobileSidebarOpen: context.isMobileSidebarOpen,
  setIsMobileSidebarOpen: context.setIsMobileSidebarOpen,
  selectedCompany: context.selectedCompany,
  companies: context.companies,
  selectedCompanyId: context.selectedCompanyId,
  setSelectedCompanyId: context.setSelectedCompanyId,
  onSelectTab: context.handleSelectTab,
  onLogout: context.onLogout,
});

export const buildCompanyHeaderProps = (context: CompanyDashboardViewContext): CompanyDashboardHeaderProps => ({
  activeTab: context.activeTab,
  setActiveTab: context.setActiveTab,
  setIsMobileSidebarOpen: context.setIsMobileSidebarOpen,
  setIsNotificationsDrawerOpen: context.setIsNotificationsDrawerOpen,
  openMessagesDrawer: context.openMessagesDrawer,
  notifications: context.notifications,
  companyDropdownRef: context.companyDropdownRef,
  profileMenuRef: context.profileMenuRef,
  isCompanyDropdownOpen: context.isCompanyDropdownOpen,
  setIsCompanyDropdownOpen: context.setIsCompanyDropdownOpen,
  isProfileMenuOpen: context.isProfileMenuOpen,
  setIsProfileMenuOpen: context.setIsProfileMenuOpen,
  selectedCompany: context.selectedCompany,
  companies: context.companies,
  selectedCompanyId: context.selectedCompanyId,
  setSelectedCompanyId: context.setSelectedCompanyId,
  companySearchQuery: context.companySearchQuery,
  setCompanySearchQuery: context.setCompanySearchQuery,
  resetCompanyForm: context.resetCompanyForm,
  setIsRegisteringCompany: context.setIsRegisteringCompany,
  onLogout: context.onLogout,
  companyApplications: context.companyApplications,
  customTemplates: context.customTemplates,
  resultsSubTab: context.resultsSubTab,
  setResultsSubTab: context.setResultsSubTab,
  onStartNewTemplate: context.handleStartNewTemplate,
  selectedJob: context.selectedJob,
  jobSearch: context.jobSearch,
  setJobSearch: context.setJobSearch,
  isJobSearchFocused: context.isJobSearchFocused,
  setIsJobSearchFocused: context.setIsJobSearchFocused,
  talentSearch: context.talentSearch,
  setTalentSearch: context.setTalentSearch,
  setIsFilterSidebarOpen: context.setIsFilterSidebarOpen,
});

export const buildCompanyContentProps = (context: CompanyDashboardViewContext): CompanyDashboardContentProps => ({
  activeTab: context.activeTab,
  setActiveTab: context.setActiveTab,
  overview: {
    activeJobsCount: context.activeJobsCount,
    recentJobsCount: context.recentJobsCount,
    totalCandidatesReal: context.totalCandidatesReal,
    recentCandidatesCount: context.recentCandidatesCount,
    candidatesInInterview: context.candidatesInInterview,
    closedOrPausedJobsCount: context.closedOrPausedJobsCount,
    dynamicApplicationData: context.dynamicApplicationData,
    dynamicDistribution: context.dynamicDistribution,
    companyApplications: context.companyApplications,
    dynamicTopSkills: context.dynamicTopSkills,
    setIsRegisteringVacancy: context.setIsRegisteringVacancy,
    setRegisterStep: context.setRegisterStep,
  },
  vacancyCreation: {
    registerStep: context.registerStep,
    setRegisterStep: context.setRegisterStep,
    vacancyForm: context.vacancyForm,
    setVacancyForm: context.setVacancyForm,
    errorMessage: context.errorMessage,
    handleNextStep: context.handleNextStep,
    handlePublish: context.handlePublish,
    isPublishing: context.isPublishing,
  },
  vacancies: {
    selectedJob: context.selectedJob,
    activeJobsCount: context.activeJobsCount,
    pausedJobsCount: context.pausedJobsCount,
    closedJobsCount: context.closedJobsCount,
    jobSubTab: context.jobSubTab,
    setJobSubTab: context.setJobSubTab,
    companyJobs: context.companyJobs,
    isFetchingJobs: context.isFetchingJobs,
    setSelectedJob: context.setSelectedJob,
    jobApplicants: context.jobApplicants,
    isFetchingApplicants: context.isFetchingApplicants,
    handleViewApplicants: context.handleViewApplicants,
    handleUpdateJobStatus: context.handleUpdateJobStatus,
    handleShareJob: context.handleShareJob,
    setIsRegisteringVacancy: context.setIsRegisteringVacancy,
    setRegisterStep: context.setRegisterStep,
    setIsConfiguringStages: context.setIsConfiguringStages,
    handleUpdateApplicantStatus: context.handleUpdateApplicantStatus,
    setSelectedResumeApplicant: context.setSelectedResumeApplicant,
    getFullApplicantInfo: context.getFullApplicantInfo,
    handleRequestDiscTest: context.handleRequestDiscTest,
    handleRequestMbtiTest: context.handleRequestMbtiTest,
    handleRequestTemperamentosTest: context.handleRequestTemperamentosTest,
    handleRequestQuestions: context.handleRequestQuestions,
    handleRequestCustomTest: context.handleRequestCustomTest,
    handleOpenNotes: context.handleOpenNotes,
    handleDeleteJob: context.handleDeleteJob,
    handleOpenChat: context.handleOpenChat,
    jobSearch: context.jobSearch,
    setJobSearch: context.setJobSearch,
    isJobSearchFocused: context.isJobSearchFocused,
    setIsJobSearchFocused: context.setIsJobSearchFocused,
  },
  talentBank: {
    companies: context.companies,
    selectedCompanyId: context.selectedCompanyId,
    talents: context.talents,
    talentFilters: context.talentFilters,
    talentSearch: context.talentSearch,
    talentSubTab: context.talentSubTab,
    setTalentSubTab: context.setTalentSubTab,
    isAiSearching: context.isAiSearching,
    aiPrompt: context.aiPrompt,
    setAiPrompt: context.setAiPrompt,
    handleAiSearch: context.handleAiSearch,
    isFiltersVisible: context.isFiltersVisible,
    setIsFiltersVisible: context.setIsFiltersVisible,
    setTalentFilters: context.setTalentFilters,
    isTalentLoadingCities: context.isTalentLoadingCities,
    talentCities: context.talentCities,
    setTalentSearch: context.setTalentSearch,
    setIsFilterSidebarOpen: context.setIsFilterSidebarOpen,
    filteredTalents: context.filteredTalents,
    isFetchingTalents: context.isFetchingTalents,
    setSelectedResumeApplicant: context.setSelectedResumeApplicant,
    handleToggleSaveTalent: context.handleToggleSaveTalent,
  },
  companiesPanel: {
    companies: context.companies,
    selectedCompanyId: context.selectedCompanyId,
    setSelectedCompanyId: context.setSelectedCompanyId,
    resetCompanyForm: context.resetCompanyForm,
    setIsRegisteringCompany: context.setIsRegisteringCompany,
    handleEditCompany: context.handleEditCompany,
    handleDeleteCompany: context.handleDeleteCompany,
  },
  assessments: {
    isFetchingCompanyApps: context.isFetchingCompanyApps,
    resultsSubTab: context.resultsSubTab,
    setResultsSubTab: context.setResultsSubTab,
    companyApplications: context.companyApplications,
    jobs: context.jobs,
    customTemplates: context.customTemplates,
    isLoadingCustomTemplates: context.isLoadingCustomTemplates,
    handleStartNewTemplate: context.handleStartNewTemplate,
    handleEditCustomTemplate: context.handleEditCustomTemplate,
    handleDeleteCustomTemplate: context.handleDeleteCustomTemplate,
    setSelectedDiscResult: context.setSelectedDiscResult,
    setSelectedMbtiResult: context.setSelectedMbtiResult,
    setIsMbtiModalOpen: context.setIsMbtiModalOpen,
    setSelectedApplicantForQuestions: context.setSelectedApplicantForQuestions,
    setIsQuestionsModalOpen: context.setIsQuestionsModalOpen,
    setSelectedTemperamentosResult: context.setSelectedTemperamentosResult,
    setIsTemperamentosModalOpen: context.setIsTemperamentosModalOpen,
    setSelectedApplicantForCustomTest: context.setSelectedApplicantForCustomTest,
    setIsCustomTestModalOpen: context.setIsCustomTestModalOpen,
  },
  billing: {
    selectedCompany: context.selectedCompany,
    companies: context.companies,
    setCompanies: context.setCompanies,
    jobs: context.jobs,
  },
  interviewsTabContent: context.interviewsTabContent,
});

export const buildCompanyOverlayProps = (context: CompanyDashboardViewContext): CompanyDashboardOverlaysProps => ({
  navigation: {
    activeTab: context.activeTab,
    setActiveTab: context.setActiveTab,
  },
  vacancyPublishing: {
    isRegisteringVacancy: context.isRegisteringVacancy,
    setIsRegisteringVacancy: context.setIsRegisteringVacancy,
    registerStep: context.registerStep,
    setRegisterStep: context.setRegisterStep,
    vacancyForm: context.vacancyForm,
    setVacancyForm: context.setVacancyForm,
    errorMessage: context.errorMessage,
    handleNextStep: context.handleNextStep,
    handlePublish: context.handlePublish,
    isPublishing: context.isPublishing,
  },
  stageConfig: {
    isConfiguringStages: context.isConfiguringStages,
    setIsConfiguringStages: context.setIsConfiguringStages,
    selectedJob: context.selectedJob,
    jobApplicants: context.jobApplicants,
    handleAddNewStage: context.handleAddNewStage,
    handleUpdateJobStages: context.handleUpdateJobStages,
    handleDeleteStage: context.handleDeleteStage,
    handleUpdateJobStageTests: context.handleUpdateJobStageTests,
  },
  notificationsPanel: {
    isNotificationsDrawerOpen: context.isNotificationsDrawerOpen,
    setIsNotificationsDrawerOpen: context.setIsNotificationsDrawerOpen,
  notifications: context.notifications,
    markAllCompanyNotificationsAsRead: context.markAllCompanyNotificationsAsRead,
    loadCompanyNotifications: context.loadCompanyNotifications,
  },
  customDialogPanel: {
    customDialog: context.customDialog,
    setCustomDialog: context.setCustomDialog,
  },
  publishedJob: {
    publishedJobLink: context.publishedJobLink,
    hasCopiedPublishedLink: context.hasCopiedPublishedLink,
    setHasCopiedPublishedLink: context.setHasCopiedPublishedLink,
    clearPublishedJobLink: context.clearPublishedJobLink,
  },
  resumeDrawer: {
    selectedResumeApplicant: context.selectedResumeApplicant,
    resumeDrawerTab: context.resumeDrawerTab,
    setResumeDrawerTab: context.setResumeDrawerTab,
    isExportingResume: context.isExportingResume,
    handleDownloadResume: context.handleDownloadResume,
    setSelectedResumeApplicant: context.setSelectedResumeApplicant,
    interviewsContent: context.candidateInterviewsDrawerContent,
    resumePrintRef: context.resumePrintRef,
    handleUpdateApplicantStatus: context.handleUpdateApplicantStatus,
  },
  videoMeeting: {
    activeVideoMeeting: context.activeVideoMeeting,
    setActiveVideoMeeting: context.setActiveVideoMeeting,
  },
  reportModals: {
    setSelectedDiscResult: context.setSelectedDiscResult,
    setSelectedMbtiResult: context.setSelectedMbtiResult,
    setActiveMbtiTab: context.setActiveMbtiTab,
    setIsMbtiModalOpen: context.setIsMbtiModalOpen,
    setSelectedApplicantForQuestions: context.setSelectedApplicantForQuestions,
    setActiveCategoryTab: context.setActiveCategoryTab,
    setIsQuestionsModalOpen: context.setIsQuestionsModalOpen,
    setSelectedTemperamentosResult: context.setSelectedTemperamentosResult,
    setActiveTemperamentosTab: context.setActiveTemperamentosTab,
    setIsTemperamentosModalOpen: context.setIsTemperamentosModalOpen,
    setSelectedApplicantForCustomTest: context.setSelectedApplicantForCustomTest,
    setIsCustomTestModalOpen: context.setIsCustomTestModalOpen,
    selectedDiscResult: context.selectedDiscResult,
    discModalRef: context.discModalRef,
    isExportingTestPDF: context.isExportingTestPDF,
    handleExportModalToPDF: context.handleExportModalToPDF,
    isQuestionsModalOpen: context.isQuestionsModalOpen,
    selectedApplicantForQuestions: context.selectedApplicantForQuestions,
    questionsModalRef: context.questionsModalRef,
    activeCategoryTab: context.activeCategoryTab,
    setActiveCategoryTabState: context.setActiveCategoryTab,
    isCustomTestModalOpen: context.isCustomTestModalOpen,
    selectedApplicantForCustomTest: context.selectedApplicantForCustomTest,
    isMbtiModalOpen: context.isMbtiModalOpen,
    selectedMbtiResult: context.selectedMbtiResult,
    mbtiModalRef: context.mbtiModalRef,
    activeMbtiTab: context.activeMbtiTab,
    setActiveMbtiTabState: context.setActiveMbtiTab,
    isTemperamentosModalOpen: context.isTemperamentosModalOpen,
    selectedTemperamentosResult: context.selectedTemperamentosResult,
    temperamentosModalRef: context.temperamentosModalRef,
    activeTemperamentosTab: context.activeTemperamentosTab,
    setActiveTemperamentosTabState: context.setActiveTemperamentosTab,
  },
  notes: {
    isNotesModalOpen: context.isNotesModalOpen,
    selectedApplicantForNotes: context.selectedApplicantForNotes,
    tempNotesText: context.tempNotesText,
    setTempNotesText: context.setTempNotesText,
    tempNotesRating: context.tempNotesRating,
    setTempNotesRating: context.setTempNotesRating,
    isSavingNotes: context.isSavingNotes,
    handleSaveNotes: context.handleSaveNotes,
    closeNotes: context.closeNotes,
  },
  chat: {
    isChatDrawerOpen: context.isChatDrawerOpen,
    selectedApplicantForChat: context.selectedApplicantForChat,
    chatMessages: context.chatMessages,
    newMessageText: context.newMessageText,
    setNewMessageText: context.setNewMessageText,
    isSendingMessage: context.isSendingMessage,
    isFetchingChat: context.isFetchingChat,
    handleLoadProfileChat: context.handleLoadProfileChat,
    handleSendMessage: context.handleSendMessage,
    closeChat: context.closeChat,
    openMessagesDrawer: context.openMessagesDrawer,
    companyApplications: context.companyApplications,
    getFullApplicantInfo: context.getFullApplicantInfo,
  },
  customTemplateRequest: {
    isSelectCustomTemplateModalOpen: context.isSelectCustomTemplateModalOpen,
    applicantForRequestCustom: context.applicantForRequestCustom,
    customTemplates: context.customTemplates,
    selectedTemplateIdForRequest: context.selectedTemplateIdForRequest,
    setSelectedTemplateIdForRequest: context.setSelectedTemplateIdForRequest,
    setIsSelectCustomTemplateModalOpen: context.setIsSelectCustomTemplateModalOpen,
    setApplicantForRequestCustom: context.setApplicantForRequestCustom,
    setResultsSubTab: context.setResultsSubTab,
    handleConfirmRequestCustomTest: context.handleConfirmRequestCustomTest,
  },
  companyRegistration: {
    isRegisteringCompany: context.isRegisteringCompany,
    companyForm: context.companyForm,
    setCompanyForm: context.setCompanyForm,
    editingCompanyId: context.editingCompanyId,
    companies: context.companies,
    selectedCompanyId: context.selectedCompanyId,
    setSelectedCompanyId: context.setSelectedCompanyId,
    setIsRegisteringCompany: context.setIsRegisteringCompany,
    handleRegisterCompany: context.handleRegisterCompany,
    handleDeleteCompany: context.handleDeleteCompany,
    handleLogoChange: context.handleLogoChange,
  },
  questionnaireBuilder: {
    isCreatingNewTemplate: context.isCreatingNewTemplate,
    editingTemplateId: context.editingTemplateId,
    customTestTitle: context.customTestTitle,
    setCustomTestTitle: context.setCustomTestTitle,
    customQuestions: context.customQuestions,
    handleCancelTemplateEdit: context.handleCancelTemplateEdit,
    addCustomQuestion: context.addCustomQuestion,
    removeCustomQuestion: context.removeCustomQuestion,
    updateCustomQuestionText: context.updateCustomQuestionText,
    addOptionToChoice: context.addOptionToChoice,
    removeOptionFromChoice: context.removeOptionFromChoice,
    updateOptionText: context.updateOptionText,
    updateCorrectOption: context.updateCorrectOption,
    handleSaveCustomTemplate: context.handleSaveCustomTemplate,
  },
  talentFiltersPanel: {
    isFilterSidebarOpen: context.isFilterSidebarOpen,
    setIsFilterSidebarOpen: context.setIsFilterSidebarOpen,
    talentFilters: context.talentFilters,
    setTalentFilters: context.setTalentFilters,
    brazilStates: context.brazilStates,
    talentCities: context.talentCities,
    isTalentLoadingCities: context.isTalentLoadingCities,
  },
  candidateTests: {
    activeApplicantForTests: context.activeApplicantForTests,
    setActiveApplicantForTests: context.setActiveApplicantForTests,
    showCustomAlert: context.showCustomAlert,
    handleRequestDiscTest: context.handleRequestDiscTest,
    handleRequestQuestions: context.handleRequestQuestions,
    handleRequestMbtiTest: context.handleRequestMbtiTest,
    handleRequestTemperamentosTest: context.handleRequestTemperamentosTest,
  },
});


