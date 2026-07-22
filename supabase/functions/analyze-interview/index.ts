import { GoogleGenAI, Type } from 'npm:@google/genai';

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

const jsonResponse = (req: Request, body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    ...getCorsHeaders(req),
    'Content-Type': 'application/json',
  },
});

const parseJsonFromText = (text: string) => {
  const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
  return JSON.parse(cleaned);
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(req) });
  }

  if (req.method !== 'POST') {
    return jsonResponse(req, { error: 'Method not allowed' }, 405);
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return jsonResponse(req, { error: 'GEMINI_API_KEY is not configured' }, 500);
    }

    const { transcript, candidateName, jobTitle, companyName } = await req.json();
    const transcriptText = String(transcript || '').trim();

    if (transcriptText.length < 20) {
      return jsonResponse(req, { error: 'Transcript is too short to analyze' }, 400);
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = Deno.env.get('GEMINI_MODEL') || 'gemini-3.6-flash';

    const prompt = `Voce e um especialista senior em recrutamento e selecao. Analise a transcricao de uma entrevista de video e gere um relatorio objetivo para a empresa.\n\nContexto:\n- Candidato: ${candidateName || 'Nao informado'}\n- Vaga: ${jobTitle || 'Nao informada'}\n- Empresa: ${companyName || 'Nao informada'}\n\nTranscricao:\n${transcriptText}\n\nRegras:\n- Nao invente informacoes que nao estejam na transcricao.\n- Se a transcricao estiver incompleta, sinalize isso.\n- Foque em evidencias observaveis.\n- Responda em JSON valido.`;

    const result = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            attentionPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            technicalEvidence: { type: Type.ARRAY, items: { type: Type.STRING } },
            behavioralEvidence: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendation: { type: Type.STRING },
            suggestedNextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidence: { type: Type.STRING },
          },
          required: ['summary', 'strengths', 'attentionPoints', 'technicalEvidence', 'behavioralEvidence', 'recommendation', 'suggestedNextSteps', 'confidence'],
        },
      },
    });

    const text = result.text || '';
    const report = parseJsonFromText(text);

    return jsonResponse(req, { report });
  } catch (error) {
    console.error('Interview analysis failed', error);
    return jsonResponse(req, { error: error instanceof Error ? error.message : 'Interview analysis failed' }, 500);
  }
});
