import { type Dispatch, type SetStateAction, useCallback } from 'react';
import { getCompanyPlanLimits, getDefaultCreditsForPlan, getPlanUpgradeMessage } from '../utils/companyPlans';

type CompanyWithCredits = {
  id: string;
  plan?: string;
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

    const limits = getCompanyPlanLimits(selectedCompany);

    if (!limits.canUseAssessments) {
      alert(getPlanUpgradeMessage('Envio de testes para candidatos'));
      setActiveTab('Faturamento');
      return false;
    }

    if (limits.unlimitedAssessmentCredits) {
      return true;
    }

    const currentCredits = selectedCompany.credits !== undefined
      ? selectedCompany.credits
      : getDefaultCreditsForPlan(selectedCompany.plan);

    if (currentCredits <= 0) {
      alert('Limite mensal de 15 testes atingido para o plano Profissional. Faça upgrade para o plano Ilimitado ou aguarde a renovação mensal.');
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