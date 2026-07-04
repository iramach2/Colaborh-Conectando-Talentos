import { useCompanyBootstrap } from './useCompanyBootstrap';
import { useCompanySelectionState } from './useCompanySelectionState';

export const useCompanySessionState = () => {
  const {
    setCompanyName,
    companies,
    setCompanies,
    selectedCompany,
    selectedCompanyId,
    setSelectedCompanyId,
  } = useCompanySelectionState();

  useCompanyBootstrap({
    companies,
    selectedCompanyId,
    setCompanies,
    setSelectedCompanyId,
    setCompanyName,
  });

  return {
    companies,
    setCompanies,
    selectedCompany,
    selectedCompanyId,
    setSelectedCompanyId,
  };
};
