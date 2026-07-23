import { supabase } from '../lib/supabase';
import { parseCandidatePhoneData } from '../utils/companyDashboardUtils';

export type AssessmentType = 'disc' | 'questions' | 'mbti' | 'temperamentos' | 'custom';
export type AssessmentStatus = 'pending' | 'completed' | 'cancelled';

type AssessmentRow = {
  application_id: string;
  assessment_type: AssessmentType;
  status: AssessmentStatus;
  responses: Record<string, unknown> | null;
  result: Record<string, unknown> | null;
  completed_at: string | null;
};

type AssessmentPayload = {
  applicationId: string;
  candidateEmail?: string;
  assessmentType: AssessmentType;
  status: AssessmentStatus;
  responses?: Record<string, unknown>;
  result?: Record<string, unknown>;
  completedAt?: string | null;
};

const isSupabaseConfigured = () =>
  Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

const getCurrentUserId = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user?.id || null;
};

const markerByType: Record<AssessmentType, string> = {
  disc: 'DISC',
  questions: 'QUESTIONS',
  mbti: 'MBTI',
  temperamentos: 'TEMPERAMENTOS',
  custom: 'CUSTOM_TEST',
};

const toLegacyAssessmentValue = (assessment: AssessmentRow): string => {
  if (assessment.status === 'pending') {
    if (assessment.assessment_type === 'custom' && assessment.result) {
      const payload = {
        title: assessment.result.title || 'Questionario Customizado',
        questions: assessment.result.questions || [],
      };
      return `PENDING:::${JSON.stringify(payload)}`;
    }
    return 'PENDING';
  }

  if (assessment.status !== 'completed') return '';

  const completedAt = assessment.completed_at || new Date().toISOString();
  const result = assessment.result || {};
  const responses = assessment.responses || {};

  if (assessment.assessment_type === 'disc') {
    const d = result.D ?? result.d ?? 0;
    const i = result.I ?? result.i ?? 0;
    const s = result.S ?? result.s ?? 0;
    const c = result.C ?? result.c ?? 0;
    return `COMPLETED===${d},${i},${s},${c}===DATE===${completedAt}`;
  }

  if (assessment.assessment_type === 'questions') {
    return `COMPLETED===${JSON.stringify(responses.answers || responses)}===DATE===${completedAt}`;
  }

  if (assessment.assessment_type === 'custom') {
    return `COMPLETED===${JSON.stringify(result.responses ? result : responses)}===DATE===${completedAt}`;
  }

  return `COMPLETED===${JSON.stringify(result)}===DATE===${completedAt}`;
};

export const hydrateApplicationsWithAssessments = async <T extends { id?: string; candidate_phone?: string; candidate_email?: string | null; email?: string | null }>(
  applications: T[],
): Promise<T[]> => {
  if (!isSupabaseConfigured() || applications.length === 0) return applications;

  const applicationIds = applications
    .map((app) => app.id)
    .filter((id): id is string => Boolean(id));

  if (applicationIds.length === 0) return applications;

  try {
    let { data, error } = await supabase
      .from('application_assessments')
      .select('application_id, assessment_type, status, responses, result, completed_at')
      .in('application_id', applicationIds);

    if (error || !data || data.length === 0) {
      const candidateEmailApplication = applications.find((app) => app.candidate_email || app.email);
      const candidateEmail = candidateEmailApplication?.candidate_email
        || candidateEmailApplication?.email
        || '';

      if (candidateEmail) {
        const rpcResult = await supabase.rpc('list_candidate_assessments', {
          candidate_email_input: candidateEmail,
        });

        if (!rpcResult.error) {
          data = (rpcResult.data || []).filter((row: AssessmentRow) => applicationIds.includes(row.application_id));
          error = null;
        }
      }
    }

    if (error) throw error;
    if (!data || data.length === 0) return applications;

    const assessmentsByApplication = (data as AssessmentRow[]).reduce<Record<string, AssessmentRow[]>>((acc, row) => {
      acc[row.application_id] ||= [];
      acc[row.application_id].push(row);
      return acc;
    }, {});

    return applications.map((app) => {
      const assessments = assessmentsByApplication[app.id || ''];
      if (!assessments || assessments.length === 0) return app;

      let candidatePhone = app.candidate_phone || '';
      for (const assessment of assessments) {
        const marker = markerByType[assessment.assessment_type];
        if (candidatePhone.includes(`===${marker}===`)) continue;

        const legacyValue = toLegacyAssessmentValue(assessment);
        if (legacyValue) {
          candidatePhone = `${candidatePhone.trim()} ===${marker}===${legacyValue}`.trim();
        }
      }

      return { ...app, candidate_phone: candidatePhone };
    });
  } catch (error) {
    console.warn('Nao foi possivel hidratar candidaturas com assessments:', error);
    return applications;
  }
};

export const upsertAssessment = async ({
  applicationId,
  candidateEmail,
  assessmentType,
  status,
  responses = {},
  result = {},
  completedAt = null,
}: AssessmentPayload): Promise<boolean> => {
  if (!isSupabaseConfigured() || !applicationId) return false;

  try {
    const requestedBy = await getCurrentUserId();
    const { error } = await supabase
      .from('application_assessments')
      .upsert({
        application_id: applicationId,
        candidate_email: candidateEmail || null,
        assessment_type: assessmentType,
        status,
        requested_by: requestedBy,
        completed_at: completedAt,
        responses,
        result,
      }, {
        onConflict: 'application_id,assessment_type',
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.warn('Nao foi possivel sincronizar assessment no Supabase:', error);
    return false;
  }
};

export const markAssessmentPending = async (
  applicationId: string,
  assessmentType: AssessmentType,
  candidateEmail?: string,
  result: Record<string, unknown> = {},
) => upsertAssessment({
  applicationId,
  candidateEmail,
  assessmentType,
  status: 'pending',
  result,
});

export const markAssessmentPendingWithLegacyFallback = async (
  applicationId: string,
  assessmentType: AssessmentType,
  candidateEmail: string | undefined,
  legacyCandidatePhone: string,
  result: Record<string, unknown> = {},
) => {
  const assessmentSaved = await markAssessmentPending(applicationId, assessmentType, candidateEmail, result);

  const { error } = await supabase
    .from('applications')
    .update({ candidate_phone: legacyCandidatePhone })
    .eq('id', applicationId);

  if (error && !assessmentSaved) throw error;
  if (error) {
    console.warn('Assessment salvo, mas nao foi possivel atualizar marcador legado da candidatura:', error);
  }
};

export const markAssessmentCompleted = async (
  applicationId: string,
  assessmentType: AssessmentType,
  candidateEmail?: string,
  responses: Record<string, unknown> = {},
  result: Record<string, unknown> = {},
) => upsertAssessment({
  applicationId,
  candidateEmail,
  assessmentType,
  status: 'completed',
  responses,
  result,
  completedAt: new Date().toISOString(),
});

export const fetchPreviousCompletedAssessmentLegacyValue = async (
  candidateEmail: string | undefined,
  assessmentType: AssessmentType,
) => {
  const normalizedEmail = (candidateEmail || '').trim().toLowerCase();
  if (!isSupabaseConfigured() || !normalizedEmail || normalizedEmail === 'candidato@email.com') return '';

  try {
    const { data, error } = await supabase
      .from('application_assessments')
      .select('application_id, assessment_type, status, responses, result, completed_at')
      .eq('assessment_type', assessmentType)
      .eq('status', 'completed')
      .ilike('candidate_email', normalizedEmail)
      .order('completed_at', { ascending: false, nullsFirst: false })
      .limit(1);

    if (error) throw error;
    const [assessment] = (data || []) as AssessmentRow[];
    return assessment ? toLegacyAssessmentValue(assessment) : '';
  } catch (error) {
    console.warn('Nao foi possivel buscar assessment anterior normalizado:', error);
    return '';
  }
};

export const findPreviousCompletedAssessmentLegacyValue = async (
  candidateEmail: string | undefined,
  assessmentType: AssessmentType,
  talentId?: string,
) => {
  const normalizedEmail = (candidateEmail || '').trim().toLowerCase();
  let foundValue = await fetchPreviousCompletedAssessmentLegacyValue(normalizedEmail, assessmentType);
  let resolvedTalentId = talentId;

  if (!foundValue && !resolvedTalentId && normalizedEmail && normalizedEmail !== 'candidato@email.com') {
    const { data: talentData } = await supabase
      .from('talents')
      .select('id')
      .eq('email', normalizedEmail)
      .single();

    resolvedTalentId = talentData?.id;
  }

  if (!foundValue && resolvedTalentId) {
    const { data: previousApplications } = await supabase
      .from('applications')
      .select('candidate_phone')
      .eq('talent_id', resolvedTalentId);

    const markerKey = assessmentType === 'custom' ? 'customTest' : assessmentType;
    for (const application of previousApplications || []) {
      const parsed = parseCandidatePhoneData(application.candidate_phone || '');
      const legacyValue = parsed[markerKey as keyof typeof parsed];
      if (typeof legacyValue === 'string' && legacyValue.startsWith('COMPLETED===')) {
        foundValue = legacyValue;
        break;
      }
    }
  }

  return foundValue;
};

const parseJsonSafely = (value: string): unknown => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const parseLegacyCompletedValue = (legacyValue: string) => {
  const dateMarker = '===DATE===';
  const dateIndex = legacyValue.indexOf(dateMarker);
  const completedAt = dateIndex >= 0
    ? legacyValue.slice(dateIndex + dateMarker.length)
    : new Date().toISOString();
  const valueWithoutDate = dateIndex >= 0 ? legacyValue.slice(0, dateIndex) : legacyValue;

  if (valueWithoutDate.startsWith('COMPLETED:::')) {
    return {
      body: parseJsonSafely(valueWithoutDate.slice('COMPLETED:::'.length)),
      completedAt,
    };
  }

  if (valueWithoutDate.startsWith('COMPLETED===')) {
    return {
      body: parseJsonSafely(valueWithoutDate.slice('COMPLETED==='.length)),
      completedAt,
    };
  }

  return {
    body: valueWithoutDate,
    completedAt,
  };
};

export const markAssessmentCompletedFromLegacy = async (
  applicationId: string,
  assessmentType: AssessmentType,
  candidateEmail: string | undefined,
  legacyValue: string,
) => {
  const parsed = parseLegacyCompletedValue(legacyValue);
  let responses: Record<string, unknown> = {};
  let result: Record<string, unknown> = {};

  if (assessmentType === 'disc' && typeof parsed.body === 'string') {
    const [D = 0, I = 0, S = 0, C = 0] = parsed.body.split(',').map((item) => Number(item) || 0);
    result = { D, I, S, C };
  } else if (Array.isArray(parsed.body)) {
    responses = { answers: parsed.body };
    result = { answers: parsed.body };
  } else if (parsed.body && typeof parsed.body === 'object') {
    result = parsed.body as Record<string, unknown>;
    responses = 'answers' in result ? { answers: result.answers } : result;
  } else {
    result = { value: parsed.body };
  }

  return upsertAssessment({
    applicationId,
    candidateEmail,
    assessmentType,
    status: 'completed',
    responses,
    result,
    completedAt: parsed.completedAt,
  });
};

export const markAssessmentCompletedFromLegacyWithFallback = async (
  applicationId: string,
  assessmentType: AssessmentType,
  candidateEmail: string | undefined,
  legacyValue: string,
  legacyCandidatePhone: string,
) => {
  const assessmentSaved = await markAssessmentCompletedFromLegacy(
    applicationId,
    assessmentType,
    candidateEmail,
    legacyValue
  );

  const { error } = await supabase
    .from('applications')
    .update({ candidate_phone: legacyCandidatePhone })
    .eq('id', applicationId);

  if (error && !assessmentSaved) throw error;
  if (error) {
    console.warn('Assessment importado, mas nao foi possivel atualizar marcador legado da candidatura:', error);
  }
};
