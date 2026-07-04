import { useEffect, useState } from 'react';
import type { CompanyApplicant, CompanyJob } from '../types/companyDashboard';
import { getCompanyTabFromPath, navigateToCompanyTab } from '../utils/appRoutes';

export type CompanyJobSubTab = 'active' | 'paused' | 'closed';

export const useCompanyDashboardUiState = () => {
  const [activeTab, setActiveTabState] = useState(() => getCompanyTabFromPath(window.location.pathname) || 'Dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [activeApplicantForTests, setActiveApplicantForTests] = useState<CompanyApplicant | null>(null);
  const [selectedJob, setSelectedJob] = useState<CompanyJob | null>(null);
  const [jobApplicants, setJobApplicants] = useState<CompanyApplicant[]>([]);

  const [isRegisteringCompany, setIsRegisteringCompany] = useState(false);
  const [isRegisteringVacancy, setIsRegisteringVacancy] = useState(false);
  const [isConfiguringStages, setIsConfiguringStages] = useState(false);

  const [jobSubTab, setJobSubTab] = useState<CompanyJobSubTab>('active');
  const [jobSearch, setJobSearch] = useState('');
  const [isJobSearchFocused, setIsJobSearchFocused] = useState(false);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    navigateToCompanyTab(tab);
  };

  useEffect(() => {
    const handlePopState = () => {
      const routeTab = getCompanyTabFromPath(window.location.pathname);
      if (routeTab) setActiveTabState(routeTab);
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
  };

  return {
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
  };
};
