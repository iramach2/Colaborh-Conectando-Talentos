import { supabase } from '../lib/supabase';
import type { CompanyJob } from '../types/companyDashboard';
import { JOB_COLUMNS } from './queryColumns';

type SupabaseLikeError = {
  code?: string;
  message?: string;
};

const asSupabaseLikeError = (error: unknown): SupabaseLikeError => (
  typeof error === 'object' && error !== null ? error as SupabaseLikeError : {}
);

const isSchemaColumnError = (error: unknown) => {
  const safeError = asSupabaseLikeError(error);
  return safeError.code === 'PGRST204' ||
  safeError.code === '42703' ||
  (typeof safeError.message === 'string' &&
    (
      (
        safeError.message.toLowerCase().includes('could not find the') &&
        safeError.message.toLowerCase().includes('column')
      ) ||
      (
        safeError.message.toLowerCase().includes('column') &&
        safeError.message.toLowerCase().includes('does not exist')
      )
    ));
};

const getSupabaseErrorMessage = (error: unknown) => {
  if (!error) return 'Erro desconhecido';
  const safeError = asSupabaseLikeError(error);
  if (typeof safeError.message === 'string') return safeError.message;
  try {
    return JSON.stringify(error);
  } catch {
    return 'Erro desconhecido';
  }
};

export const fetchJobs = async () => {
  const { data, error } = await supabase
    .from('jobs')
    .select(JOB_COLUMNS)
    .order('created_at', { ascending: false });

  if (!error) {
    if ((data || []).length > 0) return data || [];

    const rpcFallback = await supabase.rpc('list_active_jobs');
    if (rpcFallback.error) {
      throw new Error(`Nenhuma vaga foi retornada pela consulta direta e o fallback list_active_jobs falhou: ${getSupabaseErrorMessage(rpcFallback.error)}`);
    }
    return rpcFallback.data || [];
  }
  if (!isSchemaColumnError(error)) throw error;

  console.warn('JOB_COLUMNS is ahead of the remote schema. Falling back to jobs.*:', error);
  const fallback = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (!fallback.error && (fallback.data || []).length > 0) return fallback.data || [];

  const rpcFallback = await supabase.rpc('list_active_jobs');
  if (rpcFallback.error) {
    if (fallback.error) throw fallback.error;
    throw new Error(`A consulta jobs.* nao retornou vagas e o fallback list_active_jobs falhou: ${getSupabaseErrorMessage(rpcFallback.error)}`);
  }
  return rpcFallback.data || [];
};

export const fetchJobsForCompany = async (company: { id?: string | null; nomeFantasia?: string | null }) => {
  const jobs = await fetchJobs() as CompanyJob[];
  const companyId = company.id && company.id !== 'new' ? company.id : null;
  const companyName = (company.nomeFantasia || '').trim().toLowerCase();

  return jobs.filter((job) => {
    if (companyId && job.company_id === companyId) return true;
    return Boolean(companyName) && (job.company_name || '').trim().toLowerCase() === companyName;
  });
};

export const fetchJobById = async (jobId: string) => {
  const { data, error } = await supabase
    .from('jobs')
    .select(JOB_COLUMNS)
    .eq('id', jobId)
    .single();

  if (!error) return data;
  if (!isSchemaColumnError(error)) throw error;

  console.warn('JOB_COLUMNS is ahead of the remote schema. Falling back to jobs.* for shared job:', error);
  const fallback = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (fallback.error) throw fallback.error;
  return fallback.data;
};
