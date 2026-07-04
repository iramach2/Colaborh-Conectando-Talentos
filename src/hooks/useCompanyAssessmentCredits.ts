import { type Dispatch, type SetStateAction, useCallback } from 'react';

type CompanyWithCredits = {
  id: string;
  credits?: number;
};

type UseCompanyAssessmentCreditsParams<TOrg extends CompanyWithCredits> = {
  companies: TOrg[];
  selectedCompanyId: string;
  setCompanies: Dispatch<SetStateAction<TOrg[]>>;
  setActiveTab: (tab: string) => void;
};

export const useCompanyAssessmentCredits = <TOrg extends CompanyWithCredits>({
  companies,
  selectedCompanyId,
  setCompanies,
  setActiveTab,
}: UseCompanyAssessmentCreditsParams<TOrg>) => {
  const validateAndDeductCredit = useCallback((): boolean => {
    const selectedCompany = companies.find((company) => company.id === selectedCompanyId);
    if (!selectedCompany) return false;

    const currentCredits = selectedCompany.credits !== undefined ? selectedCompany.credits : 5;

    if (currentCredits <= 0) {
      alert('Saldo de creditos insuficiente para solicitar este teste comportamental! Adquira mais creditos na aba Faturamento.');
      setActiveTab('Faturamento');
      return false;
    }

    setCompanies((currentCompanies) => currentCompanies.map((company) => {
      if (company.id === selectedCompanyId) {
        return {
          ...company,
          credits: Math.max(0, currentCredits - 1),
        };
      }

      return company;
    }));

    return true;
  }, [companies, selectedCompanyId, setActiveTab, setCompanies]);

  return { validateAndDeductCredit };
};
