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
        throw new Error('Leitura por IA indisponivel: configure VITE_RESUME_PARSE_ENDPOINT.');
      }

      const inlineData = contents?.[0]?.parts?.find((part) => part.inlineData)?.inlineData;
      if (!inlineData?.data || !inlineData?.mimeType) {
        throw new Error('Arquivo invalido para leitura por IA.');
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) {
        throw new Error('Sessao expirada. Entre novamente para usar a leitura por IA.');
      }

      const response = await fetch(parseEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: inlineData.fileName,
          mimeType: inlineData.mimeType,
          data: inlineData.data,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const detail = typeof errorBody?.detail === 'string' ? `: ${errorBody.detail}` : '';
        throw new Error(`${errorBody?.error || 'Nao foi possivel processar o curriculo pelo endpoint seguro.'}${detail}`);
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

const normalizeDate = (value: unknown) => {
  const raw = firstString(value);
  if (!raw) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  const brDate = raw.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})$/);
  if (brDate) {
    const [, day, month, year] = brDate;
    const normalizedYear = year.length === 2 ? '19' + year : year;
    return normalizedYear.padStart(4, '0') + '-' + month.padStart(2, '0') + '-' + day.padStart(2, '0');
  }

  return raw;
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

const normalizeExperience = (value: unknown): CandidateExperience | null => {
  if (!isRecord(value)) return null;

  const startDate = firstString(value.startDate, value.start, value.inicio);
  const endDate = firstString(value.endDate, value.end, value.fim);
  const duration = firstString(value.duration, value.periodo) || [startDate, endDate].filter(Boolean).join(' - ');

  return {
    id: crypto.randomUUID(),
    role: firstString(value.role, value.cargo, value.position),
    company: firstString(value.company, value.empresa),
    duration,
    startDate,
    endDate,
    current: normalizeBoolean(value.current),
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
    gradYear: firstString(value.gradYear, value.year, value.ano),
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
  onError: (message: string) => void;
  onSuccess: (message: string, title?: string) => void;
}

export const useCandidateResumeParser = ({
  brazilStates,
  onParsed,
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

      const prompt = `Extraia os dados deste curriculo para o formato JSON solicitado.
      Certifique-se de que o resumo tenha pelo menos 300 caracteres.
      Traduza status de educacao para: 'Completo', 'Incompleto' ou 'Cursando'.
      Extraia telefone, e-mail, estado (sigla UF), cidade, nome completo, data de nascimento, genero, pretensao salarial, PCD, resumo, habilidades, experiencias, formacoes, idiomas e certificacoes/cursos.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
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

      const parsed = JSON.parse(response.text) as Record<string, unknown>;
      const fullName = firstString(parsed.fullName, parsed.name, parsed.nome, parsed.nomeCompleto);
      const email = firstString(parsed.email, parsed.eMail, parsed.mail);
      const phone = firstString(parsed.phone, parsed.telefone, parsed.whatsapp, parsed.mobile);
      const state = firstString(parsed.state, parsed.uf, parsed.estado).toUpperCase();
      const city = firstString(parsed.city, parsed.cidade);
      const birthDate = normalizeDate(parsed.birthDate ?? parsed.birth_date ?? parsed.dataNascimento ?? parsed.nascimento);
      const gender = firstString(parsed.gender, parsed.genero, parsed.sexo);
      const salary = firstString(parsed.salary, parsed.salario, parsed.pretensaoSalarial, parsed.pretensao_salarial);
      const isPcd = normalizeBoolean(parsed.isPcd ?? parsed.is_pcd ?? parsed.pcd);
      const summary = firstString(parsed.summary, parsed.resumo, parsed.profile, parsed.perfil);
      const skills = firstArray(parsed.skills, parsed.habilidades, parsed.competencias);
      const experiences = firstArray(parsed.experiences, parsed.experiencias, parsed.experience);
      const educations = firstArray(parsed.educations, parsed.formacoes, parsed.education, parsed.educacao);
      const languages = firstArray(parsed.languages, parsed.idiomas);
      const achievements = firstArray(parsed.achievements, parsed.certificacoes, parsed.certifications, parsed.cursos, parsed.conquistas);
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
        throw new Error('A IA respondeu, mas nao encontrou dados suficientes no curriculo.');
      }

      onParsed((prev) => ({
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
      }));
      onSuccess('Dados extraidos com sucesso. Revise as informacoes antes de salvar.', 'Curriculo preenchido');
    } catch (error) {
      console.error('Error parsing:', error);
      const message = error instanceof Error ? error.message : 'Nao foi possivel ler o curriculo com IA.';
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
