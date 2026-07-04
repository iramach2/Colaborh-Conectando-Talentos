import { type Dispatch, type SetStateAction, useEffect } from 'react';
import type { CompanyJob } from '../types/companyDashboard';

export const useCompanySelectedJobReset = (
  selectedCompanyId: string,
  setSelectedJob: Dispatch<SetStateAction<CompanyJob | null>>,
) => {
  useEffect(() => {
    setSelectedJob(null);
  }, [selectedCompanyId, setSelectedJob]);
};
