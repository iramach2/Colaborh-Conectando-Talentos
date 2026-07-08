import { type ChangeEvent, type Dispatch, type MouseEvent, type SetStateAction, useEffect, useState } from 'react';
import { colaborhConfirm } from '../utils/colaborhAlerts';
import {
  deleteCompany as deleteCompanyRecord,
  saveCompany as saveCompanyRecord,
} from '../services/companyService';
import { getDefaultCreditsForPlan } from '../utils/companyPlans';

export type CompanyForm = {
  razaoSocial: string;
  nomeFantasia: string;
  solicitante: string;
  sector: string;
  logo: string;
};

type ManagedCompany = CompanyForm & {
  id: string;
  plan?: 'starter' | 'growth' | 'enterprise';
  credits?: number;
  savedTalents?: string[];
};

type UseCompanyManagementParams<TOrg extends ManagedCompany> = {
  companies: TOrg[];
  setCompanies: Dispatch<SetStateAction<TOrg[]>>;
  selectedCompanyId: string;
  setSelectedCompanyId: Dispatch<SetStateAction<string>>;
  setIsRegisteringCompany: Dispatch<SetStateAction<boolean>>;
};

const emptyCompanyForm = (): CompanyForm => ({
  razaoSocial: '',
  nomeFantasia: '',
  solicitante: '',
  sector: '',
  logo: '',
});

export const useCompanyManagement = <TOrg extends ManagedCompany>({
  companies,
  setCompanies,
  selectedCompanyId,
  setSelectedCompanyId,
  setIsRegisteringCompany,
}: UseCompanyManagementParams<TOrg>) => {
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [companyForm, setCompanyForm] = useState<CompanyForm>(emptyCompanyForm);

  useEffect(() => {
    if (selectedCompanyId && selectedCompanyId !== 'new') {
      const company = companies.find((item) => item.id === selectedCompanyId);
      if (company) {
        setEditingCompanyId(company.id);
        setCompanyForm({
          razaoSocial: company.razaoSocial,
          nomeFantasia: company.nomeFantasia,
          solicitante: company.solicitante,
          sector: company.sector,
          logo: company.logo || '',
        });
      }
    } else if (selectedCompanyId === 'new') {
      setEditingCompanyId(null);
      setCompanyForm(emptyCompanyForm());
    }
  }, [companies, selectedCompanyId]);

  const resetCompanyForm = () => {
    setEditingCompanyId(null);
    setCompanyForm(emptyCompanyForm());
  };

  const handleRegisterCompany = async () => {
    if (!companyForm.razaoSocial.trim() || !companyForm.nomeFantasia.trim() || !companyForm.solicitante.trim()) {
      alert('Por favor, preencha todos os campos obrigatorios.');
      return;
    }

    if (editingCompanyId) {
      const updatedCompanies = companies.map((company) => {
        if (company.id === editingCompanyId) {
          return {
            ...company,
            razaoSocial: companyForm.razaoSocial,
            nomeFantasia: companyForm.nomeFantasia,
            solicitante: companyForm.solicitante,
            sector: companyForm.sector || 'Geral',
            logo: companyForm.logo,
          };
        }
        return company;
      });

      const updatedCompany = updatedCompanies.find((company) => company.id === editingCompanyId);
      if (updatedCompany) {
        try {
          const savedCompany = await saveCompanyRecord(updatedCompany);
          setCompanies(updatedCompanies.map((company) => (
            company.id === savedCompany.id ? savedCompany as TOrg : company
          )));
        } catch (error) {
          console.warn('Nao foi possivel salvar empresa no Supabase. Mantendo alteracao local:', error);
          setCompanies(updatedCompanies);
        }
      } else {
        setCompanies(updatedCompanies);
      }

      setIsRegisteringCompany(false);
      alert('Empresa atualizada com sucesso!');
      return;
    }

    const newCompany = {
      id: crypto.randomUUID(),
      razaoSocial: companyForm.razaoSocial,
      nomeFantasia: companyForm.nomeFantasia,
      solicitante: companyForm.solicitante,
      sector: companyForm.sector || 'Geral',
      logo: companyForm.logo,
      plan: 'starter' as const,
      credits: getDefaultCreditsForPlan('starter'),
    } as TOrg;

    try {
      const savedCompany = await saveCompanyRecord(newCompany);
      setCompanies([...companies, savedCompany as TOrg]);
      setSelectedCompanyId(savedCompany.id);
    } catch (error) {
      console.warn('Nao foi possivel criar empresa no Supabase. Mantendo cadastro local:', error);
      setCompanies([...companies, newCompany]);
      setSelectedCompanyId(newCompany.id);
    }

    setIsRegisteringCompany(false);
    alert('Empresa cadastrada com sucesso!');
  };

  const handleEditCompany = (company: TOrg, event: MouseEvent) => {
    event.stopPropagation();
    setEditingCompanyId(company.id);
    setCompanyForm({
      razaoSocial: company.razaoSocial,
      nomeFantasia: company.nomeFantasia,
      solicitante: company.solicitante,
      sector: company.sector,
      logo: company.logo || '',
    });
    setIsRegisteringCompany(true);
  };

  const handleDeleteCompany = async (id: string, event: MouseEvent) => {
    event.stopPropagation();
    if (companies.length <= 1) {
      alert('Mantenha pelo menos uma empresa cadastrada.');
      return;
    }

    const confirmed = await colaborhConfirm({
      title: 'Excluir empresa?',
      message: 'Tem certeza de que deseja excluir esta empresa da lista? As vagas cadastradas com este nome continuarão ativas no banco de dados, mas a empresa sairá do seletor e do cadastro.',
      variant: 'danger',
      confirmLabel: 'Excluir',
    });

    if (!confirmed) return;

    try {
        await deleteCompanyRecord(id);
      } catch (error) {
        console.warn('Nao foi possivel excluir empresa no Supabase. Removendo apenas localmente:', error);
      }

      const updatedCompanies = companies.filter((company) => company.id !== id);
      setCompanies(updatedCompanies);
      if (selectedCompanyId === id) {
        setSelectedCompanyId(updatedCompanies[0]?.id || 'new');
      }
  };

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      alert('O arquivo e muito grande! Escolha um logotipo de no maximo 500kb.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCompanyForm((previous) => ({ ...previous, logo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  return {
    companyForm,
    setCompanyForm,
    editingCompanyId,
    resetCompanyForm,
    handleRegisterCompany,
    handleEditCompany,
    handleDeleteCompany,
    handleLogoChange,
  };
};
