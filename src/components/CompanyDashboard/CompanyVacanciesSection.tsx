import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { MyVacanciesTab } from './tabs/MyVacanciesTab';
import type { CompanyDashboardVacanciesProps } from './CompanyDashboardContent';

export const CompanyVacanciesSection = ({
  selectedJob,
  activeJobsCount,
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
  jobSearch,
  setJobSearch,
  isJobSearchFocused,
  setIsJobSearchFocused,
  onCreateVacancy
}: CompanyDashboardVacanciesProps) => {
  const openVacancyRegistration = () => {
    if (onCreateVacancy) {
      onCreateVacancy();
      return;
    }
    setIsRegisteringVacancy(true);
    setRegisterStep(1);
  };

  return (
    <div className="space-y-6 w-full text-left">
      {selectedJob === null && (
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div className="grid grid-cols-3 gap-3 w-full xl:w-auto">
            {[
              { id: 'active' as const, label: 'Ativas', count: activeJobsCount, activeClass: 'text-[#2f9f6b] border-b-[#63e1a5]', hoverClass: 'hover:text-[#2f9f6b]' },
              { id: 'paused' as const, label: 'Pausadas', count: pausedJobsCount, activeClass: 'text-[#ffa303] border-b-[#ffc24b]', hoverClass: 'hover:text-[#ffa303]' },
              { id: 'closed' as const, label: 'Encerradas', count: closedJobsCount, activeClass: 'text-[#ff4b8c] border-b-[#ff4b8c]', hoverClass: 'hover:text-[#ff4b8c]' }
            ].map((tab) => {
              const isActive = jobSubTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setJobSubTab(tab.id)}
                  className={`relative flex h-[38px] min-w-[150px] items-center justify-center gap-2 bg-transparent px-4 py-2 text-[12px] font-semibold transition-colors ${
                    isActive
                      ? tab.activeClass.replace('border-b-', '')
                      : `text-slate-500 ${tab.hoverClass}`
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[11px] font-semibold ${isActive ? 'text-current' : 'text-slate-400'}`}>
                    {tab.count}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="company-vacancies-status-tab-underline"
                      className={`absolute inset-x-3 bottom-0 h-[3px] rounded-full ${
                        tab.id === 'active' ? 'bg-[#63e1a5]' : tab.id === 'paused' ? 'bg-[#ffc24b]' : 'bg-[#ff4b8c]'
                      }`}
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-3 w-full xl:w-auto">
            <button
              type="button"
              onClick={openVacancyRegistration}
              className="hidden sm:flex items-center justify-center gap-2 px-4 py-2 bg-[#940dff] hover:bg-[#8200e6] text-white rounded-xl text-[12px] font-semibold transition-all duration-300 shadow-[0_10px_22px_rgba(148,13,255,0.22)] active:scale-95 border-0 cursor-pointer shrink-0"
            >
              <Plus size={14} className="stroke-[2.5]" /> Criar vaga
            </button>
          </div>
        </div>
      )}

      <MyVacanciesTab
        jobs={companyJobs}
        isFetchingJobs={isFetchingJobs}
        jobSubTab={jobSubTab}
        selectedJob={selectedJob}
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
        jobSearch={jobSearch}
        setJobSearch={setJobSearch}
        onCreateVacancy={onCreateVacancy}
      />
    </div>
  );
};










