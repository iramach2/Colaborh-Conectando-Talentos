import { supabase } from '../lib/supabase';

export type CustomQuestion = {
  id: string;
  type: 'text' | 'choice';
  question: string;
  options?: string[];
  correctOptionIndex?: number | null;
};

export type CustomQuestionnaire = {
  id: string;
  companyId: string;
  title: string;
  questions: CustomQuestion[];
  createdAt: string;
  updatedAt?: string;
};

type CustomQuestionnaireRow = {
  id: string;
  company_id: string;
  title: string;
  questions: CustomQuestion[];
  created_at: string;
  updated_at: string | null;
};

const COLUMNS = 'id, company_id, title, questions, created_at, updated_at' as const;

const isSupabaseConfigured = () =>
  Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const getCurrentUserId = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user?.id || null;
};

const toQuestionnaire = (row: CustomQuestionnaireRow): CustomQuestionnaire => ({
  id: row.id,
  companyId: row.company_id,
  title: row.title,
  questions: Array.isArray(row.questions) ? row.questions : [],
  createdAt: row.created_at,
  updatedAt: row.updated_at || undefined,
});

export const fetchCustomQuestionnaires = async (companyId?: string | null): Promise<CustomQuestionnaire[]> => {
  if (!isSupabaseConfigured() || !companyId || companyId === 'new') return [];

  const { data, error } = await supabase
    .from('custom_questionnaires')
    .select(COLUMNS)
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map((row) => toQuestionnaire(row as CustomQuestionnaireRow));
};

export const saveCustomQuestionnaire = async (
  questionnaire: Omit<CustomQuestionnaire, 'companyId' | 'createdAt'> & {
    companyId?: string | null;
    createdAt?: string;
  },
): Promise<CustomQuestionnaire> => {
  if (!isSupabaseConfigured() || !questionnaire.companyId || questionnaire.companyId === 'new') {
    return {
      ...questionnaire,
      companyId: questionnaire.companyId || 'new',
      createdAt: questionnaire.createdAt || new Date().toISOString(),
    };
  }

  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('custom_questionnaires')
    .upsert({
      id: questionnaire.id,
      company_id: questionnaire.companyId,
      title: questionnaire.title,
      questions: questionnaire.questions,
      created_by: userId,
      updated_at: new Date().toISOString(),
    })
    .select(COLUMNS)
    .single();

  if (error) throw error;
  return toQuestionnaire(data as CustomQuestionnaireRow);
};

export const deleteCustomQuestionnaire = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured() || !id || !isUuid(id)) return;

  const { error } = await supabase
    .from('custom_questionnaires')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
