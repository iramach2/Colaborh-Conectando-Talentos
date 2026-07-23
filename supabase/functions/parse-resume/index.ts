import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const defaultAllowedOrigins = [
  'https://colaborh.com.br',
  'https://www.colaborh.com.br',
  'http://localhost:3000',
  'http://localhost:5173',
];
const getAllowedOrigins = () => {
  const configuredOrigins = Deno.env.get('ALLOWED_ORIGIN')
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  return configuredOrigins?.length ? configuredOrigins : defaultAllowedOrigins;
};
const getCorsHeaders = (req: Request) => {
  const allowedOrigins = getAllowedOrigins();
  const requestOrigin = req.headers.get('Origin') || '';
  const allowOrigin = allowedOrigins.includes('*')
    ? '*'
    : allowedOrigins.includes(requestOrigin)
      ? requestOrigin
      : allowedOrigins[0];
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
};

type ParseResumeRequest = {
  fileName?: string;
  mimeType?: string;
  data?: string;
  text?: string;
};

const resumeSchema = {
  type: 'OBJECT',
  properties: {
    fullName: { type: 'STRING' },
    email: { type: 'STRING' },
    phone: { type: 'STRING' },
    state: { type: 'STRING' },
    city: { type: 'STRING' },
    birthDate: { type: 'STRING' },
    gender: { type: 'STRING' },
    salary: { type: 'STRING' },
    isPcd: { type: 'BOOLEAN' },
    summary: { type: 'STRING' },
    skills: { type: 'ARRAY', items: { type: 'STRING' } },
    experiences: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          company: { type: 'STRING' },
          role: { type: 'STRING' },
          startDate: { type: 'STRING' },
          endDate: { type: 'STRING' },
          current: { type: 'BOOLEAN' },
          description: { type: 'STRING' },
        },
      },
    },
    educations: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          institution: { type: 'STRING' },
          course: { type: 'STRING' },
          status: { type: 'STRING', enum: ['Incompleto', 'Completo', 'Cursando'] },
          gradYear: { type: 'STRING' },
          endDate: { type: 'STRING' },
          period: { type: 'STRING' },
        },
      },
    },
    languages: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          language: { type: 'STRING' },
          level: { type: 'STRING' },
        },
      },
    },
    achievements: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          type: { type: 'STRING' },
          title: { type: 'STRING' },
          description: { type: 'STRING' },
        },
      },
    },
  },
};

const jsonResponse = (req: Request, body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...getCorsHeaders(req),
      'Content-Type': 'application/json',
    },
  });

const summarizeGeminiError = (detail: string) => {
  try {
    const parsed = JSON.parse(detail);
    return parsed?.error?.message || detail.slice(0, 240);
  } catch {
    return detail.slice(0, 240);
  }
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: getCorsHeaders(req) });
  }

  if (req.method !== 'POST') {
    return jsonResponse(req, { error: 'Method not allowed' }, 405);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const authHeader = req.headers.get('Authorization');

  if (!supabaseUrl || !supabaseAnonKey) {
    return jsonResponse(req, { error: 'Supabase auth environment is not configured' }, 500);
  }

  if (!authHeader) {
    return jsonResponse(req, { error: 'Authentication required' }, 401);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return jsonResponse(req, { error: 'Invalid authentication token' }, 401);
  }

  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    return jsonResponse(req, { error: 'GEMINI_API_KEY is not configured' }, 500);
  }

  let payload: ParseResumeRequest;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse(req, { error: 'Invalid JSON body' }, 400);
  }

  const mimeType = payload.mimeType || '';
  const data = payload.data || '';
  const extractedText = typeof payload.text === 'string' ? payload.text.trim() : '';

  if ((!data && !extractedText) || !mimeType) {
    return jsonResponse(req, { error: 'Missing file data or MIME type' }, 400);
  }

  const allowedMimeTypes = new Set([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/png',
  ]);

  if (!allowedMimeTypes.has(mimeType)) {
    return jsonResponse(req, { error: 'Unsupported file type' }, 415);
  }

  if (data.length > 10 * 1024 * 1024) {
    return jsonResponse(req, { error: 'File is too large for resume parsing' }, 413);
  }

  if (extractedText.length > 80_000) {
    return jsonResponse(req, { error: 'Resume text is too large for parsing' }, 413);
  }

  const model = Deno.env.get('GEMINI_MODEL') || 'gemini-3.1-flash-lite';
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const prompt = [
    'Extraia os dados deste curriculo para o formato JSON solicitado, preenchendo todos os campos encontrados no arquivo.',
    'O resumo deve ter pelo menos 300 caracteres quando houver informacao suficiente.',
    "Traduza status de educacao para: 'Completo', 'Incompleto' ou 'Cursando'.",
    "Para idiomas, traduza o nivel para: 'BÃ¡sico', 'IntermediÃ¡rio', 'AvanÃ§ado' ou 'Fluente'.",
    "Para cursos, certificados e reconhecimentos, use achievements com type: 'Curso', 'Certificado', 'Reconhecimento' ou 'Trabalho VoluntÃ¡rio'.",
    'Extraia nome completo, e-mail, telefone, estado como sigla UF, cidade, data de nascimento no formato YYYY-MM-DD, genero, pretensao salarial, PCD, resumo, habilidades, experiencias, formacoes, idiomas e certificacoes/cursos.',
    'Para experiencias, retorne startDate e endDate no formato YYYY-MM-DD. Se o curriculo tiver apenas mes/ano, use o primeiro dia do mes. Se for trabalho atual, current deve ser true e endDate vazio.',
    'Para formacoes e cursos, retorne gradYear com o ano de conclusao ou previsao de conclusao. Se houver periodo completo, tambem preencha period e endDate.',
    'Se um campo nao estiver presente, retorne string vazia, false para booleanos ou lista vazia.',
    'Responda somente o JSON final, sem explicacoes e sem repetir o texto do curriculo.',
  ].join(' ');

  const geminiResponse = await fetch(geminiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: extractedText
            ? [
                { text: prompt },
                { text: 'Texto extraido do curriculo:\n\n' + extractedText },
              ]
            : [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data,
                  },
                },
              ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 4096,
        response_mime_type: 'application/json',
        response_schema: resumeSchema,
      },
    }),
  });

  if (!geminiResponse.ok) {
    const detail = await geminiResponse.text();
    console.error('Gemini request failed', {
      status: geminiResponse.status,
      mimeType,
      fileName: payload.fileName || 'unknown',
      detail: summarizeGeminiError(detail),
    });
    return jsonResponse(req, {
      error: 'Gemini request failed',
      detail: summarizeGeminiError(detail),
    }, 502);
  }

  const geminiJson = await geminiResponse.json();
  const text = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    return jsonResponse(req, { error: 'Gemini returned an empty response' }, 502);
  }

  try {
    return jsonResponse(req, JSON.parse(text));
  } catch {
    console.error('Gemini returned invalid JSON', {
      mimeType,
      fileName: payload.fileName || 'unknown',
      preview: text.slice(0, 240),
    });
    return jsonResponse(req, {
      error: 'Gemini returned invalid JSON',
      detail: 'A resposta da IA nao veio no formato esperado.',
    }, 502);
  }
});

