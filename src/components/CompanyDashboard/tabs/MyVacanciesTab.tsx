import React from 'react';
import { motion } from 'motion/react';
import { 
  getCurrentJobStages, 
  getCurrentJobStageTests,
} from '../../../utils/companyDashboardUtils';
import type { CompanyApplicant, CompanyApplication, CompanyJob } from '../../../types/companyDashboard';
import { MyVacanciesListView } from '../vacancies/MyVacanciesListView';
import { MyVacancyKanbanHeader } from '../vacancies/MyVacancyKanbanHeader';
import { MyVacancyKanbanColumns } from '../vacancies/MyVacancyKanbanColumns';

interface MyVacanciesTabProps {
  jobs: CompanyJob[];
  isFetchingJobs: boolean;
  jobSubTab: 'active' | 'paused' | 'closed';
  selectedJob: CompanyJob | null;
  setSelectedJob: (job: CompanyJob | null) => void;
  jobApplicants: CompanyApplicant[];
  isFetchingApplicants: boolean;
  handleViewApplicants: (job: CompanyJob) => void;
  handleUpdateJobStatus: (jobId: string, status: string) => void;
  handleShareJob: (job: CompanyJob) => void;
  setIsRegisteringVacancy: (val: boolean) => void;
  setRegisterStep: (step: number) => void;
  setIsConfiguringStages: (val: boolean) => void;
  handleUpdateApplicantStatus: (appId: string, newStatus: string) => void;
  setSelectedResumeApplicant: (applicant: CompanyApplicant | null) => void;
  getFullApplicantInfo: (applicant: CompanyApplication) => CompanyApplicant;
  handleRequestDiscTest: (applicant: CompanyApplicant) => void;
  handleRequestMbtiTest: (applicant: CompanyApplicant) => void;
  handleRequestTemperamentosTest: (applicant: CompanyApplicant) => void;
  handleRequestQuestions: (applicant: CompanyApplicant) => void;
  handleRequestCustomTest: (applicant: CompanyApplicant) => void;
  handleOpenNotes: (applicant: CompanyApplication) => void;
  handleDeleteJob: (jobId: string, jobTitle: string) => void;
  handleOpenChat: (applicant: CompanyApplication) => void;
  jobSearch: string;
  setJobSearch: (val: string) => void;
  onCreateVacancy?: () => void;
}

export const MyVacanciesTab: React.FC<MyVacanciesTabProps> = ({
  jobs,
  isFetchingJobs,
  jobSubTab,
  selectedJob,
  setSelectedJob,
  jobApplicants,
  isFetchingApplicants,
  handleViewApplicants,
  handleUpdateJobStatus,
  handleShareJob,
  setIsRegisteringVacancy,
  setRegisterStep,
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
  jobSearch: searchTerm,
  setJobSearch: setSearchTerm,
  onCreateVacancy,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [activeDropdownJobId, setActiveDropdownJobId] = React.useState<string | null>(null);
  const [isRejectedView, setIsRejectedView] = React.useState(false);

  const kanbanContainerRef = React.useRef<HTMLDivElement>(null);
  const [activeColumnIndex, setActiveColumnIndex] = React.useState(0);
  const [isDraggingMinimap, setIsDraggingMinimap] = React.useState(false);
  const startXRef = React.useRef(0);
  const startScrollLeftRef = React.useRef(0);

  const allColumns = selectedJob ? getCurrentJobStages(selectedJob) : [];
  const rejectedApplicantsCount = React.useMemo(() => (
    jobApplicants.filter((applicant) => ['reprovado', 'desclassificado'].includes(String(applicant.status || '').toLowerCase().trim())).length
  ), [jobApplicants]);
  const activeApplicantsCount = Math.max(jobApplicants.length - rejectedApplicantsCount, 0);
  const hasMovedRef = React.useRef(false);

  React.useEffect(() => {
    if (selectedJob) setSearchTerm('');
  }, [selectedJob?.id, setSearchTerm]);

  const handleMinimapMouseDown = (e: React.MouseEvent) => {
    setIsDraggingMinimap(true);
    startXRef.current = e.clientX;
    hasMovedRef.current = false;
    if (kanbanContainerRef.current) {
      startScrollLeftRef.current = kanbanContainerRef.current.scrollLeft;
    }
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingMinimap || !kanbanContainerRef.current) return;
      const deltaX = e.clientX - startXRef.current;
      
      if (Math.abs(deltaX) > 10) {
        hasMovedRef.current = true;
      }
      
      const container = kanbanContainerRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll <= 0) return;
      
      const minimapWidth = allColumns.length * 36;
      const scrollFactor = maxScroll / (minimapWidth || 1);
      
      container.scrollLeft = startScrollLeftRef.current + (deltaX * scrollFactor);
    };

    const handleMouseUp = () => {
      setIsDraggingMinimap(false);
    };

    if (isDraggingMinimap) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingMinimap, allColumns.length]);

  const handleKanbanScroll = () => {
    if (!kanbanContainerRef.current) return;
    const container = kanbanContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const containerRect = container.getBoundingClientRect();
    
    let maxVisibleWidth = 0;
    let activeIndex = 0;
    
    const children = (Array.from(container.children) as HTMLElement[]).filter(el => el.hasAttribute('data-kanban-column'));
    children.forEach((child, index) => {
      const el = child as HTMLElement;
      const elRect = el.getBoundingClientRect();
      const elLeft = elRect.left - containerRect.left + scrollLeft;
      const elWidth = el.offsetWidth;
      
      const visibleLeft = Math.max(scrollLeft, elLeft);
      const visibleRight = Math.min(scrollLeft + containerWidth, elLeft + elWidth);
      const visibleWidth = Math.max(0, visibleRight - visibleLeft);
      
      if (visibleWidth > maxVisibleWidth) {
        maxVisibleWidth = visibleWidth;
        activeIndex = index;
      }
    });
    
    setActiveColumnIndex(activeIndex);
  };

  const handleScrollToColumn = (colIndex: number) => {
    if (!kanbanContainerRef.current) return;
    const container = kanbanContainerRef.current;
    const children = (Array.from(container.children) as HTMLElement[]).filter(el => el.hasAttribute('data-kanban-column'));
    const colElement = children[colIndex] as HTMLElement;
    if (colElement) {
      const containerRect = container.getBoundingClientRect();
      const colRect = colElement.getBoundingClientRect();
      const relativeLeft = colRect.left - containerRect.left + container.scrollLeft;
      
      container.scrollTo({
        left: relativeLeft - 16,
        behavior: 'smooth'
      });
      setActiveColumnIndex(colIndex);
    }
  };

  React.useEffect(() => {
    if (selectedJob !== null) {
      const timer = setTimeout(() => {
        handleKanbanScroll();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedJob, jobApplicants]);

  if (selectedJob === null) {
    return (
      <MyVacanciesListView
        jobs={jobs}
        isFetchingJobs={isFetchingJobs}
        jobSubTab={jobSubTab}
        searchTerm={searchTerm}
        activeDropdownJobId={activeDropdownJobId}
        setActiveDropdownJobId={setActiveDropdownJobId}
        handleViewApplicants={handleViewApplicants}
        handleUpdateJobStatus={handleUpdateJobStatus}
        handleShareJob={handleShareJob}
        handleDeleteJob={handleDeleteJob}
        setIsRegisteringVacancy={setIsRegisteringVacancy}
        setRegisterStep={setRegisterStep}
        onCreateVacancy={onCreateVacancy}
      />
    );
  }


  return (
    <motion.div
      key="triagem-kanban"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 w-full max-w-full"
    >
      <MyVacancyKanbanHeader
        selectedJob={selectedJob}
        applicantsCount={activeApplicantsCount}
        stagesCount={allColumns.length}
        rejectedCount={rejectedApplicantsCount}
        isRejectedView={isRejectedView}
        onBack={() => setSelectedJob(null)}
        onConfigureStages={() => setIsConfiguringStages(true)}
        onToggleRejectedView={() => setIsRejectedView((current) => !current)}
      />

      <MyVacancyKanbanColumns
        selectedJob={selectedJob}
        stages={allColumns}
        stageTests={getCurrentJobStageTests(selectedJob)}
        jobApplicants={jobApplicants}
        isFetchingApplicants={isFetchingApplicants}
        candidateSearch={searchTerm}
        kanbanContainerRef={kanbanContainerRef}
        onKanbanScroll={handleKanbanScroll}
        handleUpdateApplicantStatus={handleUpdateApplicantStatus}
        isRejectedView={isRejectedView}
        getFullApplicantInfo={getFullApplicantInfo}
        setSelectedResumeApplicant={setSelectedResumeApplicant}
        handleRequestDiscTest={handleRequestDiscTest}
        handleRequestMbtiTest={handleRequestMbtiTest}
        handleRequestTemperamentosTest={handleRequestTemperamentosTest}
        handleRequestQuestions={handleRequestQuestions}
        handleRequestCustomTest={handleRequestCustomTest}
      />
    </motion.div>
  );
};





