import { supabase } from '../lib/supabase';
import { hydrateApplicationsWithAssessments } from './assessmentService';
import { APPLICATION_COLUMNS } from './queryColumns';

const isSupabaseConfigured = () =>
  Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

const mergeById = <T extends { id?: string }>(rows: T[]) => {
  const map = new Map<string, T>();
  rows.forEach((row) => {
    if (row.id) map.set(row.id, row);
  });
  return Array.from(map.values());
};

export const fetchCandidateApplications = async (email: string) => {
  if (!isSupabaseConfigured() || !email) return [];

  const normalizedEmail = email.toLowerCase().trim();

  const result = await supabase
    .from('applications')
    .select(APPLICATION_COLUMNS)
    .eq('candidate_email', normalizedEmail);
  const firstError = result.error;
  if (firstError) {
    console.warn('Nao foi possivel buscar candidaturas diretamente. Tentando RPC list_candidate_applications:', firstError);
  }

  const merged = mergeById(result.data || []);
  if (merged.length > 0) {
    return hydrateApplicationsWithAssessments(merged);
  }

  const rpcResult = await supabase.rpc('list_candidate_applications', {
    candidate_email_input: normalizedEmail,
  });

  if (rpcResult.error) {
    if (firstError) throw firstError;
    throw rpcResult.error;
  }

  const rpcMerged = mergeById(rpcResult.data || []);
  return hydrateApplicationsWithAssessments(rpcMerged);
};

export const fetchApplicationsForJob = async (jobId: string) => {
  if (!isSupabaseConfigured() || !jobId) return [];

  const { data, error } = await supabase
    .from('applications')
    .select(APPLICATION_COLUMNS)
    .eq('job_id', jobId);

  if (!error && (data || []).length > 0) {
    return hydrateApplicationsWithAssessments(data || []);
  }

  if (error) {
    console.warn('Nao foi possivel buscar candidaturas diretamente. Tentando RPC list_job_applications:', error);
  }

  const rpcResult = await supabase.rpc('list_job_applications', { target_job_id: jobId });
  if (rpcResult.error) {
    if (error) throw error;
    throw rpcResult.error;
  }

  return hydrateApplicationsWithAssessments(rpcResult.data || []);
};
