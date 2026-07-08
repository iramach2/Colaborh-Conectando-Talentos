import { useState } from 'react';
import { CompanyRecord, isSupabaseConfigured } from '../services/companyService';
import { getDefaultCreditsForPlan } from '../utils/companyPlans';

const defaultLocalCompany: CompanyRecord = {
  id: '1',
  razaoSocial: 'Colaborh Soluções LTDA',
  nomeFantasia: 'Colaborh',
  solicitante: 'João Silva',
  sector: 'Tecnologia',
  plan: 'starter',
  credits: getDefaultCreditsForPlan('starter'),
};

const loadInitialCompanies = (): CompanyRecord[] => {
  if (isSupabaseConfigured()) return [];

  const saved = localStorage.getItem('colaborh_companies');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((company: CompanyRecord) => ({
          ...company,
          plan: company.plan || 'starter',
          credits: company.credits !== undefined ? company.credits : getDefaultCreditsForPlan(company.plan || 'starter'),
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar empresas do localStorage:', error);
    }
  }

  return [defaultLocalCompany];
};

const loadInitialSelectedCompanyId = () => {
  if (isSupabaseConfigured()) return 'new';

  return localStorage.getItem('colaborh_selected_company_id') || '1';
};

export const useCompanySelectionState = () => {
  const [, setCompanyName] = useState('Empresa Parceira');
  const [companies, setCompanies] = useState<CompanyRecord[]>(loadInitialCompanies);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(loadInitialSelectedCompanyId);
  const selectedCompany = companies.find((company) => company.id === selectedCompanyId) || companies[0] || defaultLocalCompany;

  return {
    setCompanyName,
    companies,
    setCompanies,
    selectedCompany,
    selectedCompanyId,
    setSelectedCompanyId,
  };
};
