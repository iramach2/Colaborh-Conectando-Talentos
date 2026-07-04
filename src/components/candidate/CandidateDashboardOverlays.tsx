import React from 'react';
import { NotificationsDrawer } from '../NotificationsDrawer';
import { VideoMeeting } from '../VideoMeeting';
import { CandidateAiParsingOverlay } from './CandidateAiParsingOverlay';
import { CandidateChatDrawer } from './CandidateChatDrawer';
import { CandidateDialogModal, type CandidateDialog } from './CandidateDialogModal';
import { CandidateHiddenResumePrint } from './CandidateHiddenResumePrint';
import { CandidatePhotoCropModal } from './CandidatePhotoCropModal';
import { CandidateResumeEditorModal } from './CandidateResumeEditorModal';
import { CandidateResumePreviewModal } from './CandidateResumePreviewModal';
import { CandidateTestResultContent } from './CandidateTestResultContent';
import { CandidateTestResultDrawer } from './CandidateTestResultDrawer';
import { CandidateVacancyDetailsDrawer } from './CandidateVacancyDetailsDrawer';
import { CandidateVacancyFilterDrawer } from './CandidateVacancyFilterDrawer';
import type { CropPoint, PixelCrop } from '../../hooks/useCandidateProfilePhotoCrop';
import type { ChatMessage } from '../../services/messageService';
import type {
  CandidateAchievement,
  CandidateAssessmentDrawerKind,
  CandidateConversation,
  CandidateEducation,
  CandidateExperience,
  CandidateLanguage,
  CandidateResumeData,
  CustomQuestion,
  DiscResult,
  MbtiCompletedResult,
  MbtiResult,
  QuestionsResult,
  TemperamentosCompletedResult,
  TemperamentosResult,
} from '../../types/candidate';
import type { CompanyApplication, CompanyJob } from '../../types/companyDashboard';
import { calculateCandidateAge, calculateExperienceDuration } from '../../utils/candidateResumeCalculations';
import type { ColaborhNotification } from '../../utils/notificationUtils';

interface CandidateDashboardOverlaysProps {
  imageToCrop: string | null;
  crop: CropPoint;
  zoom: number;
  onCropChange: (crop: CropPoint) => void;
  onCropComplete: (croppedArea: PixelCrop, croppedAreaPixels: PixelCrop) => void;
  onZoomChange: (zoom: number) => void;
  onCancelCrop: () => void;
  onConfirmCrop: () => void;
  selectedJobForDetails: CompanyJob | null;
  myApplications: CompanyApplication[];
  appliedJobIds: Set<string> | string[];
  isApplying: string | null;
  cleanEmojiFromText: (value: string) => string;
  cleanDescription: (value: string) => string;
  getRequirementsList: (job: CompanyJob) => string[];
  getBenefitsList: (job: CompanyJob) => string[];
  onCloseJobDetails: () => void;
  onApply: (job: CompanyJob) => void;
  isFilterSidebarOpen: boolean;
  brazilStates: string[];
  vacancyStateFilter: string;
  setVacancyStateFilter: (value: string) => void;
  vacancyCityFilter: string;
  setVacancyCityFilter: (value: string) => void;
  vacancyCitiesList: string[];
  isLoadingVacancyCities: boolean;
  vacancyModalityFilter: string;
  setVacancyModalityFilter: (value: string) => void;
  vacancyContractFilter: string;
  setVacancyContractFilter: (value: string) => void;
  clearVacancyFilters: () => void;
  onCloseFilters: () => void;
  customDialog: CandidateDialog;
  closeCustomDialog: () => void;
  drawerTestResult: CandidateAssessmentDrawerKind;
  setDrawerTestResult: (value: CandidateAssessmentDrawerKind) => void;
  discResult: DiscResult | null;
  selectedQuestionsResult: QuestionsResult | null;
  currentQuestionsCategoryIndex: number;
  setCurrentQuestionsCategoryIndex: (index: number) => void;
  mbtiResult: MbtiResult | null;
  selectedMbtiResult: MbtiCompletedResult | null;
  temperamentosResult: TemperamentosResult | null;
  selectedTemperamentosResult: TemperamentosCompletedResult | null;
  selectedCustomTestResult: Record<string, string> | null;
  customTestQuestions: CustomQuestion[];
  isNotificationsDrawerOpen: boolean;
  setIsNotificationsDrawerOpen: (value: boolean) => void;
  notifications: ColaborhNotification[];
  markAllCandidateNotificationsAsRead: () => Promise<void>;
  markCandidateNotificationAsRead: (id: string) => Promise<void>;
  deleteCandidateNotification: (id: string) => Promise<void>;
  isCandidateChatDrawerOpen: boolean;
  candidateConversations: CandidateConversation[];
  selectedConversation: CandidateConversation | null;
  candidateChatMessages: ChatMessage[];
  candidateNewMessageText: string;
  isCandidateSendingMessage: boolean;
  closeCandidateChat: () => void;
  openCandidateConversation: (conversation: CandidateConversation) => void;
  setSelectedConversation: (conversation: CandidateConversation | null) => void;
  setCandidateNewMessageText: (value: string) => void;
  handleCandidateSendMessage: () => void;
  isEditModalOpen: boolean;
  activeAccordion: string;
  resumeData: CandidateResumeData;
  cities: string[];
  isLoadingCities: boolean;
  profilePicRef: React.RefObject<HTMLInputElement>;
  showExpModal: boolean;
  showEduModal: boolean;
  showLangModal: boolean;
  showAchModal: boolean;
  editingExp: CandidateExperience | null;
  editingEdu: CandidateEducation | null;
  tempExp: CandidateExperience | null;
  handleProfilePicSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setResumeData: React.Dispatch<React.SetStateAction<CandidateResumeData>>;
  setIsEditModalOpen: (value: boolean) => void;
  setShowExpModal: (value: boolean) => void;
  setShowEduModal: (value: boolean) => void;
  setShowLangModal: (value: boolean) => void;
  setShowAchModal: (value: boolean) => void;
  setEditingExp: (value: CandidateExperience | null) => void;
  setEditingEdu: (value: CandidateEducation | null) => void;
  setTempExp: React.Dispatch<React.SetStateAction<CandidateExperience | null>>;
  handleAddLanguage: (language: string, level: CandidateLanguage['level']) => void;
  handleRemoveLanguage: (id: string) => void;
  handleAddAchievement: (type: CandidateAchievement['type'], title: string, description: string) => void;
  handleRemoveAchievement: (id: string) => void;
  handleSaveToSupabase: () => Promise<void>;
  isPreviewModalOpen: boolean;
  setIsPreviewModalOpen: (value: boolean) => void;
  handleDownloadResume: () => void;
  isParsing: boolean;
  activeVideoMeeting: { roomName: string; userName: string; interviewId?: string } | null;
  setActiveVideoMeeting: (meeting: { roomName: string; userName: string; interviewId?: string } | null) => void;
  resumePrintRef: React.RefObject<HTMLDivElement>;
}

export function CandidateDashboardOverlays({
  imageToCrop,
  crop,
  zoom,
  onCropChange,
  onCropComplete,
  onZoomChange,
  onCancelCrop,
  onConfirmCrop,
  selectedJobForDetails,
  myApplications,
  appliedJobIds,
  isApplying,
  cleanEmojiFromText,
  cleanDescription,
  getRequirementsList,
  getBenefitsList,
  onCloseJobDetails,
  onApply,
  isFilterSidebarOpen,
  brazilStates,
  vacancyStateFilter,
  setVacancyStateFilter,
  vacancyCityFilter,
  setVacancyCityFilter,
  vacancyCitiesList,
  isLoadingVacancyCities,
  vacancyModalityFilter,
  setVacancyModalityFilter,
  vacancyContractFilter,
  setVacancyContractFilter,
  clearVacancyFilters,
  onCloseFilters,
  customDialog,
  closeCustomDialog,
  drawerTestResult,
  setDrawerTestResult,
  discResult,
  selectedQuestionsResult,
  currentQuestionsCategoryIndex,
  setCurrentQuestionsCategoryIndex,
  mbtiResult,
  selectedMbtiResult,
  temperamentosResult,
  selectedTemperamentosResult,
  selectedCustomTestResult,
  customTestQuestions,
  isNotificationsDrawerOpen,
  setIsNotificationsDrawerOpen,
  notifications,
  markAllCandidateNotificationsAsRead,
  markCandidateNotificationAsRead,
  deleteCandidateNotification,
  isCandidateChatDrawerOpen,
  candidateConversations,
  selectedConversation,
  candidateChatMessages,
  candidateNewMessageText,
  isCandidateSendingMessage,
  closeCandidateChat,
  openCandidateConversation,
  setSelectedConversation,
  setCandidateNewMessageText,
  handleCandidateSendMessage,
  isEditModalOpen,
  activeAccordion,
  resumeData,
  cities,
  isLoadingCities,
  profilePicRef,
  showExpModal,
  showEduModal,
  showLangModal,
  showAchModal,
  editingExp,
  editingEdu,
  tempExp,
  handleProfilePicSelect,
  setResumeData,
  setIsEditModalOpen,
  setShowExpModal,
  setShowEduModal,
  setShowLangModal,
  setShowAchModal,
  setEditingExp,
  setEditingEdu,
  setTempExp,
  handleAddLanguage,
  handleRemoveLanguage,
  handleAddAchievement,
  handleRemoveAchievement,
  handleSaveToSupabase,
  isPreviewModalOpen,
  setIsPreviewModalOpen,
  handleDownloadResume,
  isParsing,
  activeVideoMeeting,
  setActiveVideoMeeting,
  resumePrintRef
}: CandidateDashboardOverlaysProps) {
  return (
    <>
      {activeVideoMeeting && (
        <VideoMeeting
          interviewId={activeVideoMeeting.interviewId}
          roomName={activeVideoMeeting.roomName}
          userName={activeVideoMeeting.userName}
          onClose={() => setActiveVideoMeeting(null)}
        />
      )}

      <CandidateHiddenResumePrint
        resumePrintRef={resumePrintRef}
        resumeData={resumeData}
        calculateAge={calculateCandidateAge}
        calculateDuration={calculateExperienceDuration}
      />

      <CandidatePhotoCropModal
        imageToCrop={imageToCrop}
        crop={crop}
        zoom={zoom}
        onCropChange={onCropChange}
        onCropComplete={onCropComplete}
        onZoomChange={onZoomChange}
        onCancel={onCancelCrop}
        onConfirm={onConfirmCrop}
      />

      <CandidateVacancyDetailsDrawer
        job={selectedJobForDetails}
        applications={myApplications}
        appliedJobIds={Array.isArray(appliedJobIds) ? appliedJobIds : Array.from(appliedJobIds)}
        isApplying={isApplying}
        cleanEmojiFromText={cleanEmojiFromText}
        cleanDescription={cleanDescription}
        getRequirementsList={getRequirementsList}
        getBenefitsList={getBenefitsList}
        onClose={onCloseJobDetails}
        onApply={onApply}
      />

      <CandidateVacancyFilterDrawer
        isOpen={isFilterSidebarOpen}
        brazilStates={brazilStates}
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
        onClose={onCloseFilters}
      />

      <CandidateDialogModal dialog={customDialog} onClose={closeCustomDialog} />

      <CandidateTestResultDrawer resultType={drawerTestResult} onClose={() => setDrawerTestResult(null)}>
        <CandidateTestResultContent
          drawerTestResult={drawerTestResult}
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
        />
      </CandidateTestResultDrawer>

      <NotificationsDrawer
        isOpen={isNotificationsDrawerOpen}
        onClose={() => setIsNotificationsDrawerOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={markAllCandidateNotificationsAsRead}
        onMarkAsRead={markCandidateNotificationAsRead}
        onDelete={deleteCandidateNotification}
      />

      <CandidateChatDrawer
        isOpen={isCandidateChatDrawerOpen}
        conversations={candidateConversations}
        selectedConversation={selectedConversation}
        messages={candidateChatMessages}
        newMessageText={candidateNewMessageText}
        isSendingMessage={isCandidateSendingMessage}
        onClose={closeCandidateChat}
        onOpenConversation={openCandidateConversation}
        onBackToConversations={() => setSelectedConversation(null)}
        onMessageTextChange={setCandidateNewMessageText}
        onSendMessage={handleCandidateSendMessage}
      />

      <CandidateResumeEditorModal
        isOpen={isEditModalOpen}
        activeAccordion={activeAccordion}
        resumeData={resumeData}
        brazilStates={brazilStates}
        genderOptions={[
          'Masculino',
          'Feminino',
          'Transgênero',
          'Transexual',
          'Não-binário',
          'Intersexual',
          'Outro',
          'Prefiro não informar'
        ]}
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
        calculateDuration={calculateExperienceDuration}
        handleProfilePicSelect={handleProfilePicSelect}
        setResumeData={setResumeData}
        setIsOpen={setIsEditModalOpen}
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
      />

      <CandidateResumePreviewModal
        isOpen={isPreviewModalOpen}
        resumeData={resumeData}
        calculateAge={calculateCandidateAge}
        calculateDuration={calculateExperienceDuration}
        onClose={() => setIsPreviewModalOpen(false)}
        onDownload={handleDownloadResume}
      />

      <CandidateAiParsingOverlay isVisible={isParsing} />
    </>
  );
}
