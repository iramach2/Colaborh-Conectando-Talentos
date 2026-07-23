import { useEffect, useState } from 'react';
import { CandidateDashboardContent } from './candidate/CandidateDashboardContent';
import { CandidateDashboardOverlays } from './candidate/CandidateDashboardOverlays';
import { CandidateDashboardShell } from './candidate/CandidateDashboardShell';
import { useCandidateNotifications } from '../hooks/useCandidateNotifications';
import { useCandidateInterviews } from '../hooks/useCandidateInterviews';
import { useCandidateChat } from '../hooks/useCandidateChat';
import { useCandidateApplications } from '../hooks/useCandidateApplications';
import { useCandidateVacancyFilters } from '../hooks/useCandidateVacancyFilters';
import { useCandidateVacancies } from '../hooks/useCandidateVacancies';
import { useCandidateResumeExport } from '../hooks/useCandidateResumeExport';
import { useBrazilCities } from '../hooks/useBrazilCities';
import { useCandidateProfilePhotoCrop } from '../hooks/useCandidateProfilePhotoCrop';
import { useCandidateResumeSave } from '../hooks/useCandidateResumeSave';
import { useCandidateResumeParser } from '../hooks/useCandidateResumeParser';
import { useCandidateJobApplication } from '../hooks/useCandidateJobApplication';
import { useCandidateResumeProfile } from '../hooks/useCandidateResumeProfile';
import { useCandidatePasswordUpdate } from '../hooks/useCandidatePasswordUpdate';
import { useCandidateShellUi } from '../hooks/useCandidateShellUi';
import { useCandidateDialog } from '../hooks/useCandidateDialog';
import { useCandidateResumeEditorUi } from '../hooks/useCandidateResumeEditorUi';
import { useCandidateSharedVacancyFromUrl } from '../hooks/useCandidateSharedVacancyFromUrl';
import { useCandidateResumeCollections } from '../hooks/useCandidateResumeCollections';
import { useCandidateTabNavigation } from '../hooks/useCandidateTabNavigation';
import { useCandidateAssessments } from '../hooks/useCandidateAssessments';
import { useCandidateTestsTabProps } from '../hooks/useCandidateTestsTabProps';
import type { CandidateAssessmentDrawerKind } from '../types/candidate';
import type { CompanyJob } from '../types/companyDashboard';
import { cleanDescription, cleanEmojiFromText, getBenefitsList, getRequirementsList } from '../utils/candidateVacancyText';
import { BRAZIL_STATES, DF_REGIONS } from '../utils/companyDashboardUtils';
import { calculateCandidateAge, calculateExperienceDuration } from '../utils/candidateResumeCalculations';
import { getReadableErrorMessage } from '../utils/errorUtils';
import { getCandidateTabFromPath, navigateToCandidateTab } from '../utils/appRoutes';


export default function CandidateDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTabState] = useState(() => getCandidateTabFromPath(window.location.pathname) || 'Meu Currículo');
  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    navigateToCandidateTab(tab);
  };

  useEffect(() => {
    const handlePopState = () => {
      const routeTab = getCandidateTabFromPath(window.location.pathname);
      if (routeTab) setActiveTabState(routeTab);
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const {
    isProfileMenuOpen,
    setIsProfileMenuOpen,
    profileMenuRef,
  } = useCandidateShellUi();
  const [activeAccordion, setActiveAccordion] = useState('info');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  const {
    customDialog,
    closeCustomDialog,
    showCustomAlert,
    showCustomSuccess,
    showCustomConfirm,
  } = useCandidateDialog();

  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isUpdatingPassword,
    handleUpdatePassword,
  } = useCandidatePasswordUpdate({
    onAlert: showCustomAlert,
    onSuccess: showCustomSuccess,
  });

  const {
    resumeData,
    setResumeData,
    originalResumeData,
    setOriginalResumeData,
    isResumeDirty,
    setIsResumeDirty,
    isSectionCompleted,
  } = useCandidateResumeProfile();

  const {
    notifications,
    isNotificationsDrawerOpen,
    setIsNotificationsDrawerOpen,
    markAllCandidateNotificationsAsRead,
    markCandidateNotificationAsRead,
    deleteCandidateNotification,
  } = useCandidateNotifications(resumeData.email);


  const {
    interviews,
    isFetchingInterviews,
    activeVideoMeeting,
    setActiveVideoMeeting,
  } = useCandidateInterviews(resumeData.email);

  const {
    isParsing,
    handleAIParse,
  } = useCandidateResumeParser({
    brazilStates: BRAZIL_STATES,
    onParsed: setResumeData,
    onError: (message) => {
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(null), 6000);
    },
    onSuccess: showCustomSuccess,
  });
  const {
    showActionDropdown,
    setShowActionDropdown,
    showExpModal,
    setShowExpModal,
    showEduModal,
    setShowEduModal,
    showLangModal,
    setShowLangModal,
    showAchModal,
    setShowAchModal,
    editingExp,
    setEditingExp,
    editingEdu,
    setEditingEdu,
    tempExp,
    setTempExp,
  } = useCandidateResumeEditorUi();
  const {
    cities,
    isLoadingCities,
  } = useBrazilCities({
    stateCode: resumeData.state,
    dfRegions: DF_REGIONS,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    resumePrintRef,
    handleDownloadResume,
  } = useCandidateResumeExport({
    candidateName: resumeData.fullName,
    onError: (message) => {
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(null), 5000);
    },
  });

  const {
    imageToCrop,
    setImageToCrop,
    crop,
    setCrop,
    zoom,
    setZoom,
    profilePicRef,
    onCropComplete,
    handleApplyCrop,
    handleProfilePicSelect,
  } = useCandidateProfilePhotoCrop((croppedImage) => {
    setResumeData(prev => ({ ...prev, profilePic: croppedImage }));
  });

  const {
    handleAddLanguage,
    handleRemoveLanguage,
    handleAddAchievement,
    handleRemoveAchievement,
  } = useCandidateResumeCollections({ setResumeData });

  const {
    isSaving,
    handleSaveToSupabase,
  } = useCandidateResumeSave({
    resumeData,
    activeAccordion,
    calculateAge: calculateCandidateAge,
    onSaved: (savedResumeData) => {
      setOriginalResumeData(JSON.parse(JSON.stringify(savedResumeData)));
      setIsResumeDirty(false);
    },
    onError: (message, timeoutMs) => {
      setErrorMessage(message || null);
      if (timeoutMs) {
        setTimeout(() => setErrorMessage(null), timeoutMs);
      }
    },
    onSuccess: showCustomSuccess,
  });

  const {
    vacancies,
    isFetchingVacancies,
    vacancyLoadError,
    setVacancyReloadKey,
  } = useCandidateVacancies({
    activeTab,
    getErrorMessage: getReadableErrorMessage,
  });
  const {
    appliedJobIds,
    setAppliedJobIds,
    myApplications,
    setMyApplications,
    reloadCandidateApplications,
  } = useCandidateApplications(resumeData.email, resumeData.fullName);
  const {
    isApplying,
    handleApply,
  } = useCandidateJobApplication({
    resumeData,
    appliedJobIds,
    setAppliedJobIds,
    calculateAge: calculateCandidateAge,
    onError: (message, timeoutMs) => {
      setErrorMessage(message);
      if (timeoutMs) {
        setTimeout(() => setErrorMessage(null), timeoutMs);
      }
    },
    onAlert: showCustomAlert,
    onSuccess: showCustomSuccess,
  });
  const {
    isCandidateChatDrawerOpen,
    setIsCandidateChatDrawerOpen,
    candidateConversations,
    selectedConversation,
    setSelectedConversation,
    candidateChatMessages,
    candidateNewMessageText,
    setCandidateNewMessageText,
    isCandidateSendingMessage,
    unreadChatCount,
    openCandidateConversation,
    closeCandidateChat,
    handleCandidateSendMessage,
  } = useCandidateChat({
    applications: myApplications,
    vacancies,
    candidateEmail: resumeData.email,
    candidateName: resumeData.fullName,
  });
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<CompanyJob | null>(null);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [activeVacancySubTab, setActiveVacancySubTab] = useState<'todas' | 'minhas'>('todas');
  const [drawerTestResult, setDrawerTestResult] = useState<CandidateAssessmentDrawerKind>(null);
  const [activeTestSubTab, setActiveTestSubTab] = useState<'pending' | 'completed'>('pending');

  useEffect(() => {
    if (activeTab === 'Testes') {
      reloadCandidateApplications();
    }
  }, [activeTab, notifications.length, reloadCandidateApplications]);

  const {
    discTestState,
    setDiscTestState,
    currentBlockIndex,
    setCurrentBlockIndex,
    discAnswers,
    setDiscAnswers,
    discResult,
    setDiscResult,
    discErrorMessage,
    setDiscErrorMessage,
    resetDiscAnswers,
    handleFinishDISCTest,
    questionsState,
    setQuestionsState,
    questionsAnswers,
    setQuestionsAnswers,
    currentQuestionsCategoryIndex,
    setCurrentQuestionsCategoryIndex,
    isSavingQuestions,
    questionsErrorMessage,
    setQuestionsErrorMessage,
    selectedQuestionsResult,
    setSelectedQuestionsResult,
    handleFinishQuestions,
    mbtiState,
    setMbtiState,
    currentMbtiStageIndex,
    setCurrentMbtiStageIndex,
    mbtiAnswers,
    setMbtiAnswers,
    mbtiResult,
    setMbtiResult,
    isSavingMbti,
    mbtiErrorMessage,
    setMbtiErrorMessage,
    selectedMbtiResult,
    setSelectedMbtiResult,
    handleFinishMBTITest,
    temperamentosState,
    setTemperamentosState,
    currentTemperamentosStageIndex,
    setCurrentTemperamentosStageIndex,
    temperamentosAnswers,
    setTemperamentosAnswers,
    temperamentosResult,
    setTemperamentosResult,
    isSavingTemperamentos,
    temperamentosErrorMessage,
    setTemperamentosErrorMessage,
    selectedTemperamentosResult,
    setSelectedTemperamentosResult,
    handleFinishTemperamentosTest,
    customTestState,
    setCustomTestState,
    customTestQuestions,
    customTestAnswers,
    setCustomTestAnswers,
    isSavingCustomTest,
    customTestErrorMessage,
    selectedCustomTestResult,
    setSelectedCustomTestResult,
    handleFinishCustomTest,
    pendingTests,
    completedTests,
    handleStartCandidateTest,
    handleViewCandidateTestResult,
  } = useCandidateAssessments({
    applications: myApplications,
    candidateEmail: resumeData.email,
    vacancies,
    setApplications: setMyApplications,
    setDrawerTestResult,
  });


  useCandidateSharedVacancyFromUrl({
    setActiveTab,
    setSelectedJobForDetails,
    setErrorMessage,
  });

  const {
    vacancySearch,
    setVacancySearch,
    vacancyModalityFilter,
    setVacancyModalityFilter,
    vacancyContractFilter,
    setVacancyContractFilter,
    vacancyStateFilter,
    setVacancyStateFilter,
    vacancyCityFilter,
    setVacancyCityFilter,
    vacancyCitiesList,
    isLoadingVacancyCities,
    filteredVacancies,
    clearVacancyFilters,
  } = useCandidateVacancyFilters({
    vacancies,
    dfRegions: DF_REGIONS,
    cleanText: cleanEmojiFromText,
  });

  const { handleSelectTab } = useCandidateTabNavigation({
    activeTab,
    setActiveTab,
    isResumeDirty,
    originalResumeData,
    setResumeData,
    showCustomConfirm,
  });

  const candidateTestsTabProps = useCandidateTestsTabProps({
    discTestState,
    setDiscTestState,
    currentBlockIndex,
    setCurrentBlockIndex,
    discAnswers,
    setDiscAnswers,
    discErrorMessage,
    setDiscErrorMessage,
    resetDiscAnswers,
    handleFinishDISCTest,
    discResult,
    setDiscResult,
    questionsState,
    setQuestionsState,
    questionsAnswers,
    setQuestionsAnswers,
    currentQuestionsCategoryIndex,
    setCurrentQuestionsCategoryIndex,
    questionsErrorMessage,
    setQuestionsErrorMessage,
    isSavingQuestions,
    handleFinishQuestions,
    selectedQuestionsResult,
    setSelectedQuestionsResult,
    mbtiState,
    setMbtiState,
    currentMbtiStageIndex,
    setCurrentMbtiStageIndex,
    mbtiAnswers,
    setMbtiAnswers,
    mbtiErrorMessage,
    setMbtiErrorMessage,
    isSavingMbti,
    handleFinishMBTITest,
    mbtiResult,
    setMbtiResult,
    selectedMbtiResult,
    setSelectedMbtiResult,
    temperamentosState,
    setTemperamentosState,
    currentTemperamentosStageIndex,
    setCurrentTemperamentosStageIndex,
    temperamentosAnswers,
    setTemperamentosAnswers,
    temperamentosErrorMessage,
    setTemperamentosErrorMessage,
    isSavingTemperamentos,
    handleFinishTemperamentosTest,
    temperamentosResult,
    setTemperamentosResult,
    selectedTemperamentosResult,
    setSelectedTemperamentosResult,
    customTestState,
    setCustomTestState,
    customTestQuestions,
    customTestAnswers,
    setCustomTestAnswers,
    customTestErrorMessage,
    isSavingCustomTest,
    handleFinishCustomTest,
    selectedCustomTestResult,
    setSelectedCustomTestResult,
    activeTestSubTab,
    setActiveTestSubTab,
    pendingTests,
    completedTests,
    handleStartCandidateTest,
    handleViewCandidateTestResult,
  });

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <CandidateDashboardShell
        activeTab={activeTab}
        pendingTestsCount={pendingTests.length}
        errorMessage={errorMessage}
        resumeData={resumeData}
        profileMenuRef={profileMenuRef}
        isProfileMenuOpen={isProfileMenuOpen}
        setIsProfileMenuOpen={setIsProfileMenuOpen}
        unreadChatCount={unreadChatCount}
        unreadNotificationsCount={unreadNotificationsCount}
        onSelectTab={handleSelectTab}
        onOpenChat={() => setIsCandidateChatDrawerOpen(true)}
        onOpenNotifications={() => setIsNotificationsDrawerOpen(true)}
        onLogout={onLogout}
      >

        <CandidateDashboardContent
          activeTab={activeTab}
          resumeData={resumeData}
          setResumeData={setResumeData}
          showActionDropdown={showActionDropdown}
          setShowActionDropdown={setShowActionDropdown}
          isSectionCompleted={isSectionCompleted}
          handleAIParse={handleAIParse}
          setIsPreviewModalOpen={setIsPreviewModalOpen}
          handleDownloadResume={handleDownloadResume}
          setActiveAccordion={setActiveAccordion}
          setIsEditModalOpen={setIsEditModalOpen}
          handleProfilePicSelect={handleProfilePicSelect}
          handleSaveToSupabase={handleSaveToSupabase}
          isSaving={isSaving}
          handleUpdatePassword={handleUpdatePassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          isUpdatingPassword={isUpdatingPassword}
          activeVacancySubTab={activeVacancySubTab}
          setActiveVacancySubTab={setActiveVacancySubTab}
          vacancySearch={vacancySearch}
          setVacancySearch={setVacancySearch}
          setIsFilterSidebarOpen={setIsFilterSidebarOpen}
          vacancyModalityFilter={vacancyModalityFilter}
          vacancyContractFilter={vacancyContractFilter}
          vacancyStateFilter={vacancyStateFilter}
          vacancyCityFilter={vacancyCityFilter}
          isFetchingVacancies={isFetchingVacancies}
          vacancyLoadError={vacancyLoadError}
          setVacancyReloadKey={setVacancyReloadKey}
          vacancies={vacancies}
          filteredVacancies={filteredVacancies}
          appliedJobIds={appliedJobIds}
          isApplying={isApplying}
          handleApply={handleApply}
          setSelectedJobForDetails={setSelectedJobForDetails}
          clearVacancyFilters={clearVacancyFilters}
          myApplications={myApplications}
          testsProps={candidateTestsTabProps}
          interviews={interviews}
          isFetchingInterviews={isFetchingInterviews}
          onJoinInterview={(roomName, interviewId) => setActiveVideoMeeting({
            interviewId,
            roomName,
            userName: resumeData.fullName || 'Candidato Colaborh',
          })}
        />
      </CandidateDashboardShell>


      <CandidateDashboardOverlays
        imageToCrop={imageToCrop}
        crop={crop}
        zoom={zoom}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
        onCancelCrop={() => setImageToCrop(null)}
        onConfirmCrop={handleApplyCrop}
        selectedJobForDetails={selectedJobForDetails}
        myApplications={myApplications}
        appliedJobIds={appliedJobIds}
        isApplying={isApplying}
        cleanEmojiFromText={cleanEmojiFromText}
        cleanDescription={cleanDescription}
        getRequirementsList={getRequirementsList}
        getBenefitsList={getBenefitsList}
        onCloseJobDetails={() => setSelectedJobForDetails(null)}
        onApply={handleApply}
        isFilterSidebarOpen={isFilterSidebarOpen}
        brazilStates={BRAZIL_STATES}
        vacancyStateFilter={vacancyStateFilter}
        setVacancyStateFilter={setVacancyStateFilter}
        vacancyCityFilter={vacancyCityFilter}
        setVacancyCityFilter={setVacancyCityFilter}
        vacancyCitiesList={vacancyCitiesList}
        isLoadingVacancyCities={isLoadingVacancyCities}
        vacancyModalityFilter={vacancyModalityFilter}
        setVacancyModalityFilter={setVacancyModalityFilter}
        vacancyContractFilter={vacancyContractFilter}
        setVacancyContractFilter={setVacancyContractFilter}
        clearVacancyFilters={clearVacancyFilters}
        onCloseFilters={() => setIsFilterSidebarOpen(false)}
        customDialog={customDialog}
        closeCustomDialog={closeCustomDialog}
        drawerTestResult={drawerTestResult}
        setDrawerTestResult={setDrawerTestResult}
        discResult={discResult}
        selectedQuestionsResult={selectedQuestionsResult}
        currentQuestionsCategoryIndex={currentQuestionsCategoryIndex}
        setCurrentQuestionsCategoryIndex={setCurrentQuestionsCategoryIndex}
        mbtiResult={mbtiResult}
        selectedMbtiResult={selectedMbtiResult}
        temperamentosResult={temperamentosResult}
        selectedTemperamentosResult={selectedTemperamentosResult}
        selectedCustomTestResult={selectedCustomTestResult}
        customTestQuestions={customTestQuestions}
        isNotificationsDrawerOpen={isNotificationsDrawerOpen}
        setIsNotificationsDrawerOpen={setIsNotificationsDrawerOpen}
        notifications={notifications}
        markAllCandidateNotificationsAsRead={markAllCandidateNotificationsAsRead}
        markCandidateNotificationAsRead={markCandidateNotificationAsRead}
        deleteCandidateNotification={deleteCandidateNotification}
        isCandidateChatDrawerOpen={isCandidateChatDrawerOpen}
        candidateConversations={candidateConversations}
        selectedConversation={selectedConversation}
        candidateChatMessages={candidateChatMessages}
        candidateNewMessageText={candidateNewMessageText}
        isCandidateSendingMessage={isCandidateSendingMessage}
        closeCandidateChat={closeCandidateChat}
        openCandidateConversation={openCandidateConversation}
        setSelectedConversation={setSelectedConversation}
        setCandidateNewMessageText={setCandidateNewMessageText}
        handleCandidateSendMessage={handleCandidateSendMessage}
        isEditModalOpen={isEditModalOpen}
        activeAccordion={activeAccordion}
        resumeData={resumeData}
        cities={cities}
        isLoadingCities={isLoadingCities}
        profilePicRef={profilePicRef}
        showExpModal={showExpModal}
        showEduModal={showEduModal}
        showLangModal={showLangModal}
        showAchModal={showAchModal}
        editingExp={editingExp}
        editingEdu={editingEdu}
        tempExp={tempExp}
        handleProfilePicSelect={handleProfilePicSelect}
        setResumeData={setResumeData}
        setIsEditModalOpen={setIsEditModalOpen}
        setShowExpModal={setShowExpModal}
        setShowEduModal={setShowEduModal}
        setShowLangModal={setShowLangModal}
        setShowAchModal={setShowAchModal}
        setEditingExp={setEditingExp}
        setEditingEdu={setEditingEdu}
        setTempExp={setTempExp}
        handleAddLanguage={handleAddLanguage}
        handleRemoveLanguage={handleRemoveLanguage}
        handleAddAchievement={handleAddAchievement}
        handleRemoveAchievement={handleRemoveAchievement}
        handleSaveToSupabase={handleSaveToSupabase}
        isPreviewModalOpen={isPreviewModalOpen}
        setIsPreviewModalOpen={setIsPreviewModalOpen}
        handleDownloadResume={handleDownloadResume}
        isParsing={isParsing}
        activeVideoMeeting={activeVideoMeeting}
        setActiveVideoMeeting={setActiveVideoMeeting}
        resumePrintRef={resumePrintRef}
      />
    </>
  );
}

