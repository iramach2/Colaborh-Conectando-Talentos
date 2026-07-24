import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { CandidateAchievement, CandidateEducation, CandidateExperience, CandidateLanguage, CandidateResumeData } from '../types/candidate';

const Type = {
  OBJECT: 'object',
  STRING: 'string',
  ARRAY: 'array',
  BOOLEAN: 'boolean',
} as const;

type ResumeInlineData = {
  data?: string;
  mimeType?: string;
  fileName?: string;
};

type ResumeContentPart = {
  inlineData?: ResumeInlineData;
  text?: string;
};

type ResumeGenerateContentParams = {
  model?: string;
  contents?: Array<{
    parts?: ResumeContentPart[];
  }>;
  config?: unknown;
};

const ai = {
  models: {
    generateContent: async ({ contents }: ResumeGenerateContentParams) => {
      const parseEndpoint = import.meta.env.VITE_RESUME_PARSE_ENDPOINT;
      if (!parseEndpoint) {
        throw new Error('Leitura por IA indisponível: configure VITE_RESUME_PARSE_ENDPOINT.');
      }

      const inlineData = contents?.[0]?.parts?.find((part) => part.inlineData)?.inlineData;
      if (!inlineData?.data || !inlineData?.mimeType) {
        throw new Error('Arquivo inválido para leitura por IA.');
      }

      const requestBody = JSON.stringify({
        fileName: inlineData.fileName,
        mimeType: inlineData.mimeType,
        data: inlineData.data,
        text: inlineData.mimeType === 'text/plain' ? atob(inlineData.data) : undefined,
      });
      const callParseEndpoint = (accessToken: string) => fetch(parseEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });

      const { data: sessionData } = await supabase.auth.getSession();
      let accessToken = sessionData.session?.access_token;
      if (!accessToken) {
        throw new Error('Sessão expirada. Entre novamente para usar a leitura por IA.');
      }

      let response = await callParseEndpoint(accessToken);
      if (response.status === 401) {
        const { data: refreshedData, error: refreshError } = await supabase.auth.refreshSession();
        accessToken = refreshedData.session?.access_token;
        if (refreshError || !accessToken) {
          throw new Error('Sessão expirada. Entre novamente para usar a leitura por IA.');
        }
        response = await callParseEndpoint(accessToken);
      }
      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        console.error('Resume parse endpoint failed', {
          status: response.status,
          error: errorBody?.error,
          detail: errorBody?.detail,
        });
        throw new Error(getResumeParseErrorMessage(errorBody?.error, errorBody?.detail, response.status));
      }

      const parsedResponse = await response.json();
      return { text: JSON.stringify(parsedResponse) };
    },
  },
};

const firstString = (...values: unknown[]) => {
  const found = values.find((value) => typeof value === 'string' && value.trim().length > 0);
  return typeof found === 'string' ? found.trim() : '';
};

const firstArray = (...values: unknown[]) => {
  const found = values.find((value) => Array.isArray(value));
  return Array.isArray(found) ? found : [];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const normalizeBoolean = (value: unknown) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return ['sim', 's', 'true', '1', 'pcd', 'pessoa com deficiencia', 'pessoa com deficiência'].includes(normalized);
  }
  return false;
};

const monthMap: Record<string, string> = {
  jan: '01', janeiro: '01',
  fev: '02', fevereiro: '02',
  mar: '03', marco: '03',
  abr: '04', abril: '04',
  mai: '05', maio: '05',
  jun: '06', junho: '06',
  jul: '07', julho: '07',
  ago: '08', agosto: '08',
  set: '09', setembro: '09',
  out: '10', outubro: '10',
  nov: '11', novembro: '11',
  dez: '12', dezembro: '12',
};

const stripAccents = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const normalizeDate = (value: unknown) => {
  const raw = firstString(value);
  if (!raw) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  const trimmed = stripAccents(raw.trim().toLowerCase());
  if (['atual', 'presente', 'hoje', 'current'].includes(trimmed)) return '';

  const brDate = trimmed.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})$/);
  if (brDate) {
    const [, day, month, year] = brDate;
    const normalizedYear = year.length === 2 ? '19' + year : year;
    return normalizedYear.padStart(4, '0') + '-' + month.padStart(2, '0') + '-' + day.padStart(2, '0');
  }

  const monthYear = trimmed.match(/^([a-z]{3,9})[\s\/.-]+(\d{2,4})$/);
  if (monthYear) {
    const [, monthName, year] = monthYear;
    const month = monthMap[monthName.slice(0, 3)] || monthMap[monthName];
    if (month) {
      const normalizedYear = year.length === 2 ? '20' + year : year;
      return normalizedYear.padStart(4, '0') + '-' + month + '-01';
    }
  }

  const numericMonthYear = trimmed.match(/^(\d{1,2})[\/.-](\d{2,4})$/);
  if (numericMonthYear) {
    const [, month, year] = numericMonthYear;
    const normalizedYear = year.length === 2 ? '20' + year : year;
    return normalizedYear.padStart(4, '0') + '-' + month.padStart(2, '0') + '-01';
  }

  const yearOnly = trimmed.match(/^(19|20)\d{2}$/);
  if (yearOnly) return trimmed + '-01-01';

  return '';
};

const extractYear = (...values: unknown[]) => {
  const raw = firstString(...values);
  const normalizedDate = normalizeDate(raw);
  if (normalizedDate) return normalizedDate.slice(0, 4);
  const matches = raw.match(/(19|20)\d{2}/g);
  return matches?.at(-1) || raw;
};

const normalizeLanguageLevel = (value: unknown) => {
  const level = firstString(value).toLowerCase();
  if (level.includes('flu')) return 'Fluente';
  if (level.includes('avan')) return 'Avançado';
  if (level.includes('inter')) return 'Intermediário';
  return 'Básico';
};

const normalizeAchievementType = (value: unknown) => {
  const type = firstString(value).toLowerCase();
  if (type.includes('cert')) return 'Certificado';
  if (type.includes('recon')) return 'Reconhecimento';
  if (type.includes('volunt')) return 'Trabalho Voluntário';
  return 'Curso';
};


const getResumeParseErrorMessage = (error?: string, detail?: string, status?: number) => {
  const rawMessage = [error, detail].filter(Boolean).join(' ').toLowerCase();

  if (status === 401 || rawMessage.includes('invalid authentication token') || rawMessage.includes('sessão expirada')) {
    return 'Sua sessão expirou. Entre novamente na sua conta e tente preencher o currículo com IA.';
  }

  if (status === 413 || rawMessage.includes('too large')) {
    return 'O arquivo é muito grande para leitura por IA. Envie um currículo menor ou em PDF mais leve.';
  }

  if (rawMessage.includes('quota') || rawMessage.includes('rate limit')) {
    return 'A leitura por IA atingiu o limite de uso no momento. Tente novamente mais tarde.';
  }

  if (rawMessage.includes('model') && (rawMessage.includes('not found') || rawMessage.includes('no longer available'))) {
    return 'O modelo de IA configurado não está disponível. Atualize o modelo da função antes de tentar novamente.';
  }

  if (rawMessage.includes('invalid json') || rawMessage.includes('empty response')) {
    return 'A IA não conseguiu interpretar este currículo. Tente enviar um PDF mais simples ou revisar o arquivo.';
  }

  if (rawMessage.includes('after retry') || rawMessage.includes('finish_reason') || rawMessage.includes('terminou com o motivo')) {
    return detail
      ? `A IA não conseguiu interpretar o currículo após duas tentativas. ${detail}`
      : 'A IA não conseguiu interpretar o currículo após duas tentativas. Tente usar outro arquivo.';
  }

  if (rawMessage.includes('failed to fetch')) {
    return 'Não foi possível conectar ao leitor de currículo. Verifique sua conexão e tente novamente.';
  }

  return 'Não foi possível preencher o currículo com IA agora. Tente novamente em alguns instantes.';
};
const normalizeExperience = (value: unknown): CandidateExperience | null => {
  if (!isRecord(value)) return null;

  const rawStartDate = firstString(value.startDate, value.start, value.inicio);
  const rawEndDate = firstString(value.endDate, value.end, value.fim);
  const startDate = normalizeDate(rawStartDate);
  const endDate = normalizeDate(rawEndDate);
  const current = normalizeBoolean(value.current) || ['atual', 'presente', 'hoje', 'current'].includes(stripAccents(rawEndDate.trim().toLowerCase()));
  const duration = firstString(value.duration, value.periodo) || [rawStartDate || startDate, current ? 'Atual' : (rawEndDate || endDate)].filter(Boolean).join(' - ');

  return {
    id: crypto.randomUUID(),
    role: firstString(value.role, value.cargo, value.position),
    company: firstString(value.company, value.empresa),
    duration,
    startDate,
    endDate,
    current,
    description: firstString(value.description, value.descricao, value.activities, value.atividades),
  };
};

const normalizeEducation = (value: unknown): CandidateEducation | null => {
  if (!isRecord(value)) return null;

  return {
    id: crypto.randomUUID(),
    course: firstString(value.course, value.curso),
    institution: firstString(value.institution, value.instituicao, value.school),
    status: firstString(value.status, value.situacao),
    gradYear: extractYear(value.gradYear, value.year, value.ano, value.endDate, value.end, value.fim, value.conclusao, value.previsaoConclusao, value.periodo),
  };
};

const normalizeLanguage = (value: unknown): CandidateLanguage | null => {
  if (typeof value === 'string') {
    const language = value.trim();
    return language ? { id: crypto.randomUUID(), language, level: 'Básico' } : null;
  }
  if (!isRecord(value)) return null;

  const language = firstString(value.language, value.idioma, value.name, value.nome);
  if (!language) return null;

  return {
    id: crypto.randomUUID(),
    language,
    level: normalizeLanguageLevel(value.level ?? value.nivel ?? value.proficiency),
  };
};

const normalizeAchievement = (value: unknown): CandidateAchievement | null => {
  if (typeof value === 'string') {
    const title = value.trim();
    return title ? { id: crypto.randomUUID(), type: 'Curso', title, description: '' } : null;
  }
  if (!isRecord(value)) return null;

  const title = firstString(value.title, value.titulo, value.course, value.curso, value.name, value.nome);
  if (!title) return null;

  return {
    id: crypto.randomUUID(),
    type: normalizeAchievementType(value.type ?? value.tipo),
    title,
    description: firstString(value.description, value.descricao, value.institution, value.instituicao, value.issuer, value.emissor),
  };
};

interface UseCandidateResumeParserParams {
  brazilStates: string[];
  onParsed: (updater: (currentResumeData: CandidateResumeData) => CandidateResumeData) => void;
  getCurrentResumeData?: () => CandidateResumeData;
  onAutoSave?: (resumeData: CandidateResumeData) => Promise<boolean>;
  onError: (message: string) => void;
  onSuccess: (message: string, title?: string) => void;
}

export const useCandidateResumeParser = ({
  brazilStates,
  onParsed,
  getCurrentResumeData,
  onAutoSave,
  onError,
  onSuccess,
}: UseCandidateResumeParserParams) => {
  const [isParsing, setIsParsing] = useState(false);

  const handleAIParse = async (file: File) => {
    setIsParsing(true);
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
      });
      reader.readAsDataURL(file);
      const base64Data = await base64Promise;

      const prompt = `Extraia os dados deste currículo para o formato JSON solicitado.
      Certifique-se de que o resumo tenha pelo menos 300 caracteres.
      Traduza status de educação para: 'Completo', 'Incompleto' ou 'Cursando'.
      Extraia telefone, e-mail, estado (sigla UF), cidade, nome completo, data de nascimento, gênero, pretensão salarial, PCD, resumo, habilidades, experiências, formações, idiomas e certificações/cursos. Para experiências, retorne startDate e endDate no formato YYYY-MM-DD, usando o primeiro dia do mes quando houver apenas mes/ano. Para formações/cursos, retorne gradYear com o ano de conclusao ou previsao de conclusao.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: [{ parts: [{ inlineData: { data: base64Data, mimeType: file.type, fileName: file.name } }, { text: prompt }] }],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              fullName: { type: Type.STRING },
              phone: { type: Type.STRING },
              state: { type: Type.STRING },
              city: { type: Type.STRING },
              summary: { type: Type.STRING },
              skills: { type: Type.ARRAY, items: { type: Type.STRING } },
              experiences: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    company: { type: Type.STRING },
                    role: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                    current: { type: Type.BOOLEAN },
                    description: { type: Type.STRING },
                  },
                },
              },
              educations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    institution: { type: Type.STRING },
                    course: { type: Type.STRING },
                    status: { type: Type.STRING, enum: ['Incompleto', 'Completo', 'Cursando'] },
                    gradYear: { type: Type.STRING },
                  },
                },
              },
            },
          },
        },
      });

      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(response.text) as Record<string, unknown>;
      } catch {
        throw new Error('invalid json');
      }
      const fullName = firstString(parsed.fullName, parsed.name, parsed.nome, parsed.nomeCompleto);
      const email = firstString(parsed.email, parsed.eMail, parsed.mail);
      const phone = firstString(parsed.phone, parsed.telefone, parsed.whatsapp, parsed.mobile);
      const state = firstString(parsed.state, parsed.uf, parsed.estado).toUpperCase();
      const city = firstString(parsed.city, parsed.cidade);
      const birthDate = normalizeDate(parsed.birthDate ?? parsed.birth_date ?? parsed.dataNascimento ?? parsed.nascimento);
      const gender = firstString(parsed.gender, parsed['gênero'], parsed.sexo);
      const salary = firstString(parsed.salary, parsed.salario, parsed['pretensãoSalarial'], parsed['pretensão_salarial']);
      const isPcd = normalizeBoolean(parsed.isPcd ?? parsed.is_pcd ?? parsed.pcd);
      const summary = firstString(parsed.summary, parsed.resumo, parsed.profile, parsed.perfil);
      const skills = firstArray(parsed.skills, parsed.habilidades, parsed.competencias);
      const experiences = firstArray(parsed.experiences, parsed['experiências'], parsed.experience);
      const educations = firstArray(parsed.educations, parsed['formações'], parsed.education, parsed['educação']);
      const languages = firstArray(parsed.languages, parsed.idiomas);
      const achievements = firstArray(parsed.achievements, parsed['certificações'], parsed.certifications, parsed.cursos, parsed.conquistas);
      const normalizedSkills = skills.filter((skill): skill is string => typeof skill === 'string' && skill.trim().length > 0);
      const normalizedExperiences = experiences
        .map(normalizeExperience)
        .filter((experience): experience is CandidateExperience => Boolean(experience));
      const normalizedEducations = educations
        .map(normalizeEducation)
        .filter((education): education is CandidateEducation => Boolean(education));
      const normalizedLanguages = languages
        .map(normalizeLanguage)
        .filter((language): language is CandidateLanguage => Boolean(language));
      const normalizedAchievements = achievements
        .map(normalizeAchievement)
        .filter((achievement): achievement is CandidateAchievement => Boolean(achievement));
      const hasExtractedData = Boolean(
        fullName ||
        email ||
        phone ||
        state ||
        city ||
        birthDate ||
        gender ||
        salary ||
        isPcd ||
        summary ||
        normalizedSkills.length ||
        normalizedExperiences.length ||
        normalizedEducations.length ||
        normalizedLanguages.length ||
        normalizedAchievements.length
      );

      if (!hasExtractedData) {
        throw new Error('A IA respondeu, mas não encontrou dados suficientes no currículo.');
      }

      const buildNextResumeData = (prev: CandidateResumeData): CandidateResumeData => ({
        ...prev,
        fullName: (fullName || prev.fullName).toUpperCase(),
        email: email || prev.email,
        phone: phone || prev.phone,
        state: brazilStates.includes(state) ? state : prev.state,
        city: city || prev.city,
        birthDate: birthDate || prev.birthDate,
        gender: gender || prev.gender,
        salary: salary || prev.salary,
        isPcd: isPcd || prev.isPcd,
        summary: summary || prev.summary,
        skills: normalizedSkills.length ? normalizedSkills : prev.skills,
        experiences: normalizedExperiences.length ? normalizedExperiences : prev.experiences,
        educations: normalizedEducations.length ? normalizedEducations : prev.educations,
        languages: normalizedLanguages.length ? normalizedLanguages : prev.languages,
        achievements: normalizedAchievements.length ? normalizedAchievements : prev.achievements,
        isFirstJob: normalizedExperiences.length > 0 ? false : prev.isFirstJob,
      });

      const nextResumeData = getCurrentResumeData ? buildNextResumeData(getCurrentResumeData()) : null;
      onParsed(nextResumeData ? () => nextResumeData : buildNextResumeData);

      if (nextResumeData && onAutoSave) {
        const saved = await onAutoSave(nextResumeData);
        if (!saved) {
          return;
        }
        onSuccess('Dados extraídos e salvos com sucesso.', 'Currículo preenchido');
        return;
      }

      onSuccess('Dados extraídos com sucesso. Revise as informações antes de salvar.', 'Currículo preenchido');
    } catch (error) {
      console.error('Error parsing:', error);
      const message = error instanceof Error
        ? getResumeParseErrorMessage(error.message)
        : 'Não foi possível ler o currículo com IA.';
      onError(message);
    } finally {
      setIsParsing(false);
    }
  };

  return {
    isParsing,
    handleAIParse,
  };
};

