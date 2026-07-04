import { supabase } from '../lib/supabase';

export interface CompanyRecord {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  solicitante: string;
  sector: string;
  logo?: string;
  plan?: 'starter' | 'growth' | 'enterprise';
  credits?: number;
  savedTalents?: string[];
}

type CompanyRow = {
  id: string;
  legal_name: string | null;
  trade_name: string;
  contact_name: string | null;
  industry: string | null;
  logo_url: string | null;
  plan: 'starter' | 'growth' | 'enterprise' | null;
  credits: number | null;
  saved_talents: string[] | null;
};

const toCompanyRecord = (row: CompanyRow): CompanyRecord => ({
  id: row.id,
  razaoSocial: row.legal_name || row.trade_name,
  nomeFantasia: row.trade_name,
  solicitante: row.contact_name || '',
  sector: row.industry || 'Geral',
  logo: row.logo_url || '',
  plan: row.plan || 'starter',
  credits: row.credits ?? 5,
  savedTalents: row.saved_talents || [],
});

const getCurrentUserId = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user?.id || null;
};

const toCompanyPayload = (company: CompanyRecord, ownerUserId?: string | null) => ({
  id: company.id,
  owner_user_id: ownerUserId,
  legal_name: company.razaoSocial,
  trade_name: company.nomeFantasia,
  contact_name: company.solicitante,
  industry: company.sector || 'Geral',
  logo_url: company.logo || null,
  plan: company.plan || 'starter',
  credits: company.credits ?? 5,
  saved_talents: company.savedTalents || [],
});

export const isSupabaseConfigured = () =>
  Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

export const fetchCompanies = async (): Promise<CompanyRecord[]> => {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase
    .from('companies')
    .select('id, legal_name, trade_name, contact_name, industry, logo_url, plan, credits, saved_talents')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []).map((row) => toCompanyRecord(row as CompanyRow));
};

export const ensureCompanyForCurrentUser = async (): Promise<CompanyRecord | null> => {
  if (!isSupabaseConfigured()) return null;

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user || user.user_metadata?.role !== 'company') return null;

  const existingCompanies = await fetchCompanies();
  if (existingCompanies.length > 0) return existingCompanies[0];

  const companyName = user.user_metadata?.company_name || user.user_metadata?.full_name;
  if (!companyName) return null;

  const company: CompanyRecord = {
    id: crypto.randomUUID(),
    razaoSocial: companyName,
    nomeFantasia: companyName,
    solicitante: user.user_metadata?.full_name || companyName,
    sector: 'Geral',
    logo: '',
    plan: 'starter',
    credits: 5,
    savedTalents: [],
  };

  return saveCompany(company);
};

export const saveCompany = async (company: CompanyRecord): Promise<CompanyRecord> => {
  if (!isSupabaseConfigured()) return company;

  const ownerUserId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('companies')
    .upsert(toCompanyPayload(company, ownerUserId))
    .select('id, legal_name, trade_name, contact_name, industry, logo_url, plan, credits, saved_talents')
    .single();

  if (error) throw error;
  return toCompanyRecord(data as CompanyRow);
};

export const deleteCompany = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured()) return;

  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const saveCompanies = async (companies: CompanyRecord[]): Promise<void> => {
  if (!isSupabaseConfigured()) return;

  const ownerUserId = await getCurrentUserId();
  const { error } = await supabase
    .from('companies')
    .upsert(companies.map((company) => toCompanyPayload(company, ownerUserId)));

  if (error) throw error;
};
