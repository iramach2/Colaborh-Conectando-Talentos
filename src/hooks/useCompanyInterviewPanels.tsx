import { CompanyCandidateInterviewsPanel } from '../components/CompanyDashboard/CompanyCandidateInterviewsPanel';
import { CompanyInterviewsTab } from '../components/CompanyDashboard/CompanyInterviewsTab';
import type { InterviewStatus } from './useCompanyInterviews';
import type { CompanyApplicant, CompanyApplication, CompanyInterview, CompanyJob, CompanyLike } from '../types/companyDashboard';
import { cleanEmojiFromText } from '../utils/companyDashboardUtils';

type UseCompanyInterviewPanelsParams = {
  companyJobs: CompanyJob[];
  jobs: CompanyJob[];
  interviews: CompanyInterview[];
  jobApplicants: CompanyApplicant[];
  selectedCompany: CompanyLike | null;
  getFullApplicantInfo: (applicant: CompanyApplication) => CompanyApplicant;
  setActiveVideoMeeting: (meeting: { roomName: string; userName: string; interviewId?: string } | null) => void;
  handleUpdateInterviewStatus: (id: string, status: InterviewStatus) => void | Promise<void>;
  selectedResumeApplicant: CompanyApplicant | null;
  selectedJob: CompanyJob | null;
  handleCreateInterview: (jobId: string, candidateEmail: string, dateTime: string, notes: string) => Promise<void>;
};

export const useCompanyInterviewPanels = ({
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
}: UseCompanyInterviewPanelsParams) => {
  const interviewsTabContent = (
    <CompanyInterviewsTab
      companyJobs={companyJobs}
      jobs={jobs}
      interviews={interviews}
      jobApplicants={jobApplicants}
      selectedCompany={selectedCompany}
      getFullApplicantInfo={getFullApplicantInfo}
      cleanEmojiFromText={cleanEmojiFromText}
      setActiveVideoMeeting={setActiveVideoMeeting}
      handleUpdateInterviewStatus={handleUpdateInterviewStatus}
    />
  );

  const candidateInterviewsDrawerContent = (
    <CompanyCandidateInterviewsPanel
      applicant={selectedResumeApplicant}
      selectedJob={selectedJob}
      companyJobs={companyJobs}
      interviews={interviews}
      selectedCompany={selectedCompany}
      handleCreateInterview={handleCreateInterview}
      handleUpdateInterviewStatus={handleUpdateInterviewStatus}
      setActiveVideoMeeting={setActiveVideoMeeting}
    />
  );

  return {
    interviewsTabContent,
    candidateInterviewsDrawerContent,
  };
};
