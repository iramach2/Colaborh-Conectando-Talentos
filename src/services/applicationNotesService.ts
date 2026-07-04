import { supabase } from '../lib/supabase';

type ApplicationNoteRow = {
  application_id: string;
  notes: string;
};

const isSupabaseConfigured = () =>
  Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

const getCurrentUserId = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user?.id || null;
};

export const fetchApplicationNotes = async (applicationIds: string[]) => {
  const ids = applicationIds.filter(Boolean);
  if (!isSupabaseConfigured() || ids.length === 0) return {};

  try {
    const { data, error } = await supabase
      .from('application_notes')
      .select('application_id, notes')
      .in('application_id', ids);

    if (error) throw error;

    return (data || []).reduce<Record<string, string>>((acc, row) => {
      const note = row as ApplicationNoteRow;
      acc[note.application_id] = note.notes || '';
      return acc;
    }, {});
  } catch (error) {
    console.warn('Nao foi possivel carregar notas das candidaturas:', error);
    return {};
  }
};

export const saveApplicationNote = async (applicationId: string, notes: string) => {
  if (!isSupabaseConfigured() || !applicationId) return false;

  try {
    const updatedBy = await getCurrentUserId();
    const { error } = await supabase
      .from('application_notes')
      .upsert({
        application_id: applicationId,
        notes,
        updated_by: updatedBy,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'application_id',
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.warn('Nao foi possivel salvar nota da candidatura:', error);
    return false;
  }
};
