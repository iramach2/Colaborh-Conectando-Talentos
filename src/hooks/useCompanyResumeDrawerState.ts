import { useEffect, useState } from 'react';
import type { CompanyApplicant } from '../types/companyDashboard';

export type CompanyResumeDrawerTab = 'curriculo' | 'anotacoes' | 'mensagens' | 'testes' | 'entrevistas';

export const useCompanyResumeDrawerState = () => {
  const [selectedResumeApplicant, setSelectedResumeApplicant] = useState<CompanyApplicant | null>(null);
  const [resumeDrawerTab, setResumeDrawerTab] = useState<CompanyResumeDrawerTab>('curriculo');

  useEffect(() => {
    if (selectedResumeApplicant) {
      setResumeDrawerTab('curriculo');
    }
  }, [selectedResumeApplicant]);

  return {
    selectedResumeApplicant,
    setSelectedResumeApplicant,
    resumeDrawerTab,
    setResumeDrawerTab,
  };
};
