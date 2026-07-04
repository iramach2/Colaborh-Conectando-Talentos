import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { CandidateEducation, CandidateExperience, CandidateResumeData } from '../types/candidate';

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
    current: Boolean(value.current),
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
      Extraia apenas o telefone, estado (sigla UF), cidade, nome completo, resumo, habilidades (lista de strings), experiencias e formacoes.`;

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
      const phone = firstString(parsed.phone, parsed.telefone, parsed.whatsapp, parsed.mobile);
      const state = firstString(parsed.state, parsed.uf, parsed.estado).toUpperCase();
      const city = firstString(parsed.city, parsed.cidade);
      const summary = firstString(parsed.summary, parsed.resumo, parsed.profile, parsed.perfil);
      const skills = firstArray(parsed.skills, parsed.habilidades, parsed.competencias);
      const experiences = firstArray(parsed.experiences, parsed.experiencias, parsed.experience);
      const educations = firstArray(parsed.educations, parsed.formacoes, parsed.education, parsed.educacao);
      const normalizedSkills = skills.filter((skill): skill is string => typeof skill === 'string' && skill.trim().length > 0);
      const normalizedExperiences = experiences
        .map(normalizeExperience)
        .filter((experience): experience is CandidateExperience => Boolean(experience));
      const normalizedEducations = educations
        .map(normalizeEducation)
        .filter((education): education is CandidateEducation => Boolean(education));
      const hasExtractedData = Boolean(
        fullName ||
        phone ||
        state ||
        city ||
        summary ||
        normalizedSkills.length ||
        normalizedExperiences.length ||
        normalizedEducations.length
      );

      if (!hasExtractedData) {
        throw new Error('A IA respondeu, mas nao encontrou dados suficientes no curriculo.');
      }

      onParsed((prev) => ({
        ...prev,
        fullName: (fullName || prev.fullName).toUpperCase(),
        phone: phone || prev.phone,
        state: brazilStates.includes(state) ? state : prev.state,
        city: city || prev.city,
        summary: summary || prev.summary,
        skills: normalizedSkills.length ? normalizedSkills : prev.skills,
        experiences: normalizedExperiences.length ? normalizedExperiences : prev.experiences,
        educations: normalizedEducations.length ? normalizedEducations : prev.educations,
        isFirstJob: normalizedExperiences.length === 0 ? prev.isFirstJob : false,
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
