import { supabase } from '../lib/supabase';

const isSupabaseConfigured = () =>
  Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

type StageRow = {
  job_id: string;
  name: string;
  position: number;
};

type StageTestRow = {
  job_id: string;
  stage_name: string;
  test_key: string;
  trigger_mode: string;
};

export const saveJobStages = async (jobId: string, stages: string[]): Promise<boolean> => {
  if (!isSupabaseConfigured() || !jobId) return false;

  try {
    await supabase.from('job_stages').delete().eq('job_id', jobId);

    if (stages.length === 0) return true;

    const { error } = await supabase
      .from('job_stages')
      .insert(stages.map((name, position) => ({
        job_id: jobId,
        name,
        position,
      })));

    if (error) throw error;
    return true;
  } catch (error) {
    console.warn('Nao foi possivel sincronizar etapas no Supabase:', error);
    return false;
  }
};

export const saveJobStageTests = async (
  jobId: string,
  stageTests: Record<string, string[]>,
): Promise<boolean> => {
  if (!isSupabaseConfigured() || !jobId) return false;

  try {
    await supabase.from('job_stage_tests').delete().eq('job_id', jobId);

    const rows = Object.entries(stageTests).flatMap(([stageName, tests]) =>
      tests.map((test) => {
        const [rawKey, second, third] = test.split(':');
        const rawTrigger = rawKey === 'customizado' && third ? third : (second || 'auto');
        const testKey = rawKey === 'perguntas'
          ? 'questions'
          : rawKey === 'customizado'
            ? 'custom'
            : rawKey;

        return {
          job_id: jobId,
          stage_name: stageName,
          test_key: testKey,
          trigger_mode: rawTrigger === 'manual' ? 'manual' : 'auto',
        };
      })
    );

    if (rows.length === 0) return true;

    const { error } = await supabase.from('job_stage_tests').insert(rows);
    if (error) throw error;
    return true;
  } catch (error) {
    console.warn('Nao foi possivel sincronizar testes por etapa no Supabase:', error);
    return false;
  }
};

const toLegacyTestKey = (key: string) => {
  if (key === 'questions') return 'perguntas';
  if (key === 'custom') return 'customizado';
  return key;
};

export const hydrateJobsWithWorkflow = async <T extends { id?: string; stages?: unknown; stageTests?: unknown; description?: string }>(
  jobs: T[],
): Promise<T[]> => {
  if (!isSupabaseConfigured() || jobs.length === 0) return jobs;

  const jobIds = jobs.map((job) => job.id).filter((id): id is string => Boolean(id));
  if (jobIds.length === 0) return jobs;

  try {
    const [{ data: stageRows, error: stagesError }, { data: testRows, error: testsError }] = await Promise.all([
      supabase
        .from('job_stages')
        .select('job_id, name, position')
        .in('job_id', jobIds)
        .order('position', { ascending: true }),
      supabase
        .from('job_stage_tests')
        .select('job_id, stage_name, test_key, trigger_mode')
        .in('job_id', jobIds),
    ]);

    if (stagesError) throw stagesError;
    if (testsError) throw testsError;

    const stagesByJob = ((stageRows || []) as StageRow[]).reduce<Record<string, string[]>>((acc, row) => {
      acc[row.job_id] ||= [];
      acc[row.job_id].push(row.name);
      return acc;
    }, {});

    const testsByJob = ((testRows || []) as StageTestRow[]).reduce<Record<string, Record<string, string[]>>>((acc, row) => {
      acc[row.job_id] ||= {};
      acc[row.job_id][row.stage_name] ||= [];
      acc[row.job_id][row.stage_name].push(`${toLegacyTestKey(row.test_key)}:${row.trigger_mode}`);
      return acc;
    }, {});

    return jobs.map((job) => {
      const stages = stagesByJob[job.id || ''];
      const stageTests = testsByJob[job.id || ''];
      if (!stages && !stageTests) return job;

      return {
        ...job,
        stages: stages || job.stages,
        stageTests: stageTests || job.stageTests,
      };
    });
  } catch (error) {
    console.warn('Nao foi possivel hidratar vagas com workflow normalizado:', error);
    return jobs;
  }
};
