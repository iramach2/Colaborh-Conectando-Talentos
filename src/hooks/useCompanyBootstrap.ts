import { type Dispatch, type SetStateAction, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  ensureCompanyForCurrentUser,
  fetchCompanies,
  isSupabaseConfigured,
  type CompanyRecord,
} from '../services/companyService';

type CompanyLike = CompanyRecord & {
  id: string;
};

type UseCompanyBootstrapParams<TOrg extends CompanyLike> = {
  companies: TOrg[];
  selectedCompanyId: string;
  setCompanies: Dispatch<SetStateAction<TOrg[]>>;
  setSelectedCompanyId: Dispatch<SetStateAction<string>>;
  setCompanyName: Dispatch<SetStateAction<string>>;
};

export const useCompanyBootstrap = <TOrg extends CompanyLike>({
  companies,
  selectedCompanyId,
  setCompanies,
  setSelectedCompanyId,
  setCompanyName,
}: UseCompanyBootstrapParams<TOrg>) => {
  useEffect(() => {
    document.documentElement.style.backgroundColor = '#f3f4f6';
    document.body.style.backgroundColor = '#f3f4f6';
    return () => {
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadRemoteCompanies() {
      try {
        const remoteCompanies = await fetchCompanies();
        if (!isMounted) return;

        if (remoteCompanies.length > 0) {
          setCompanies(remoteCompanies as TOrg[]);
          setSelectedCompanyId((currentId) => (
            remoteCompanies.some((company) => company.id === currentId)
              ? currentId
              : remoteCompanies[0].id
          ));
        } else if (isSupabaseConfigured()) {
          const ensuredCompany = await ensureCompanyForCurrentUser();
          if (!isMounted) return;

          if (ensuredCompany) {
            setCompanies([ensuredCompany as TOrg]);
            setSelectedCompanyId(ensuredCompany.id);
          } else {
            setCompanies([]);
            setSelectedCompanyId('new');
          }
        }
      } catch (error) {
        console.warn('Nao foi possivel carregar empresas do Supabase. Usando cache local:', error);
      }
    }

    loadRemoteCompanies();
    return () => {
      isMounted = false;
    };
  }, [setCompanies, setSelectedCompanyId]);

  useEffect(() => {
    if (isSupabaseConfigured()) return;
    localStorage.setItem('colaborh_companies', JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    if (isSupabaseConfigured()) return;
    localStorage.setItem('colaborh_selected_company_id', selectedCompanyId);
  }, [selectedCompanyId]);

  useEffect(() => {
    async function loadCompanyInfo() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const metadata = session.user.user_metadata;
          const name = metadata?.company_name || metadata?.full_name || 'Empresa Parceira';
          setCompanyName(name);
        }
      } catch (err) {
        console.error('Erro ao buscar dados da sessao no painel da empresa:', err);
      }
    }

    loadCompanyInfo();
  }, [setCompanyName]);
};
