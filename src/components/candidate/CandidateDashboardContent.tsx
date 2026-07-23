import type { ChangeEvent, Dispatch, FormEvent, SetStateAction } from 'react';
import { CandidateComingSoonPanel } from './CandidateComingSoonPanel';
import { CandidateInterviewsTab } from './CandidateInterviewsTab';
import { CandidateResumeTab } from './CandidateResumeTab';
import { CandidateSettingsTab } from './CandidateSettingsTab';
import { CandidateTestsTab, type CandidateTestsTabProps } from './CandidateTestsTab';
import { CandidateVacanciesTab } from './CandidateVacanciesTab';
import type { CandidateResumeData } from '../../types/candidate';
import type { CompanyApplication, CompanyInterview, CompanyJob } from '../../types/companyDashboard';
import { calculateCandidateAge } from '../../utils/candidateResumeCalculations';

interface CandidateDashboardContentProps {
  activeTab: string;
  resumeData: CandidateResumeData;
  setResumeData: Dispatch<SetStateAction<CandidateResumeData>>;
  showActionDropdown: boolean;
  setShowActionDropdown: (value: boolean) => void;
  isSectionCompleted: (sectionId: string) => boolean;
  handleAIParse: (file: File) => void | Promise<void>;
  setIsPreviewModalOpen: (value: boolean) => void;
  handleDownloadResume: () => void;
  setActiveAccordion: (value: string) => void;
  setIsEditModalOpen: (value: boolean) => void;
  handleProfilePicSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSaveToSupabase: () => Promise<boolean>;
  isSaving: boolean;
  handleUpdatePassword: (event: FormEvent) => void | Promise<void>;
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  isUpdatingPassword: boolean;
  activeVacancySubTab: 'todas' | 'minhas';
  setActiveVacancySubTab: (value: 'todas' | 'minhas') => void;
  vacancySearch: string;
  setVacancySearch: (value: string) => void;
  setIsFilterSidebarOpen: (value: boolean) => void;
  vacancyModalityFilter: string;
  vacancyContractFilter: string;
  vacancyStateFilter: string;
  vacancyCityFilter: string;
  isFetchingVacancies: boolean;
  vacancyLoadError: string | null;
  setVacancyReloadKey: Dispatch<SetStateAction<number>>;
  vacancies: CompanyJob[];
  filteredVacancies: CompanyJob[];
  appliedJobIds: string[];
  isApplying: string | null;
  handleApply: (job: CompanyJob) => void;
  setSelectedJobForDetails: Dispatch<SetStateAction<CompanyJob | null>>;
  clearVacancyFilters: () => void;
  myApplications: CompanyApplication[];
  testsProps: CandidateTestsTabProps;
  interviews: CompanyInterview[];
  isFetchingInterviews: boolean;
  onJoinInterview: (roomName: string, interviewId?: string) => void;
}

export function CandidateDashboardContent({
  activeTab,
  resumeData,
  setResumeData,
  showActionDropdown,
  setShowActionDropdown,
  isSectionCompleted,
  handleAIParse,
  setIsPreviewModalOpen,
  handleDownloadResume,
  setActiveAccordion,
  setIsEditModalOpen,
  handleProfilePicSelect,
  handleSaveToSupabase,
  isSaving,
  handleUpdatePassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  isUpdatingPassword,
  activeVacancySubTab,
  setActiveVacancySubTab,
  vacancySearch,
  setVacancySearch,
  setIsFilterSidebarOpen,
  vacancyModalityFilter,
  vacancyContractFilter,
  vacancyStateFilter,
  vacancyCityFilter,
  isFetchingVacancies,
  vacancyLoadError,
  setVacancyReloadKey,
  vacancies,
  filteredVacancies,
  appliedJobIds,
  isApplying,
  handleApply,
  setSelectedJobForDetails,
  clearVacancyFilters,
  myApplications,
  testsProps,
  interviews,
  isFetchingInterviews,
  onJoinInterview
}: CandidateDashboardContentProps) {
  return (
    <main className="relative z-10 flex-1 px-4 pb-28 pt-3 sm:px-6 lg:px-10 lg:pb-10 lg:pt-5">
      <div className="w-full">
        {activeTab === 'Meu Currículo' ? (
          <CandidateResumeTab
            showActionDropdown={showActionDropdown}
            setShowActionDropdown={setShowActionDropdown}
            isSectionCompleted={isSectionCompleted}
            onAIParse={handleAIParse}
            onOpenPreview={() => {
              setIsPreviewModalOpen(true);
              setShowActionDropdown(false);
            }}
            onDownloadResume={() => {
              handleDownloadResume();
              setShowActionDropdown(false);
            }}
            onOpenSection={(sectionId) => {
              setActiveAccordion(sectionId);
              setIsEditModalOpen(true);
            }}
          />
        ) : activeTab === 'Configurações' ? (
          <CandidateSettingsTab
            resumeData={resumeData}
            setResumeData={setResumeData}
            calculateAge={calculateCandidateAge}
            handleProfilePicSelect={handleProfilePicSelect}
            handleSaveToSupabase={handleSaveToSupabase}
            isSaving={isSaving}
            handleUpdatePassword={handleUpdatePassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            isUpdatingPassword={isUpdatingPassword}
          />
        ) : activeTab === 'Vagas' ? (
          <CandidateVacanciesTab
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
          />
        ) : activeTab === 'Testes' ? (
          <CandidateTestsTab {...testsProps} />
        ) : activeTab === 'Entrevistas' ? (
          <CandidateInterviewsTab
            interviews={interviews}
            isFetchingInterviews={isFetchingInterviews}
            onJoinInterview={onJoinInterview}
          />
        ) : (
          <CandidateComingSoonPanel activeTab={activeTab} />
        )}
      </div>
    </main>
  );
}
