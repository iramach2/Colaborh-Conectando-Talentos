import nodemailer from 'npm:nodemailer@6.9.16';

const defaultAllowedOrigins = [
  'https://colaborh.com.br',
  'https://www.colaborh.com.br',
  'http://localhost:3000',
  'http://localhost:5173',
];

const text = {
  badge: 'Novo teste dispon\u00edvel',
  title: 'Voc\u00ea recebeu um novo teste',
  hello: 'Ol\u00e1',
  intro: 'A empresa solicitou que voc\u00ea responda uma avalia\u00e7\u00e3o no seu painel Colaborh.',
  test: 'Teste',
  job: 'Vaga',
  company: 'Empresa',
  cta: 'Acessar painel',
  fallback: 'Se o bot\u00e3o n\u00e3o abrir, acesse:',
  subjectPrefix: 'Novo teste para a vaga ',
  plainIntro: 'Voc\u00ea recebeu um novo teste no Colaborh.',
};

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
    Vary: 'Origin',
  };
};

const jsonResponse = (req: Request, body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    ...getCorsHeaders(req),
    'Content-Type': 'application/json',
  },
});

const escapeHtml = (value: unknown) => String(value || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const getString = (value: unknown, fallback = '') => {
  const valueText = typeof value === 'string' ? value.trim() : '';
  return valueText || fallback;
};

type EmailPayload = {
  to?: string;
  candidateName?: string;
  testName?: string;
  jobTitle?: string;
  companyName?: string;
  dashboardUrl?: string;
};

const buildEmailHtml = ({ candidateName, testName, jobTitle, companyName, dashboardUrl }: Required<EmailPayload>) => {
  const safeCandidateName = escapeHtml(candidateName);
  const safeTestName = escapeHtml(testName);
  const safeJobTitle = escapeHtml(jobTitle);
  const safeCompanyName = escapeHtml(companyName);
  const safeDashboardUrl = escapeHtml(dashboardUrl);
  const greeting = safeCandidateName !== 'candidato' ? ', ' + safeCandidateName : '';

  return [
    '<div style="margin:0;padding:0;background:#f8f5ff;font-family:Inter,Arial,sans-serif;color:#343241;">',
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8f5ff;padding:32px 16px;">',
    '<tr><td align="center">',
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #eadcff;border-radius:28px;overflow:hidden;box-shadow:0 18px 42px rgba(83,58,246,0.12);">',
    '<tr><td style="padding:34px 34px 20px;">',
    '<div style="display:inline-block;padding:8px 14px;border-radius:999px;background:#f3e5ff;color:#940dff;font-size:12px;font-weight:700;">' + text.badge + '</div>',
    '<h1 style="margin:20px 0 8px;font-size:28px;line-height:1.18;color:#343241;font-weight:800;">' + text.title + '</h1>',
    '<p style="margin:0;color:#7083a3;font-size:15px;line-height:1.6;">' + text.hello + greeting + '. ' + text.intro + '</p>',
    '</td></tr>',
    '<tr><td style="padding:0 34px 24px;">',
    '<div style="background:#fbfaff;border:1px solid #eadcff;border-radius:22px;padding:20px;">',
    '<p style="margin:0 0 10px;color:#7083a3;font-size:13px;"><strong style="color:#343241;">' + text.test + ':</strong> ' + safeTestName + '</p>',
    '<p style="margin:0 0 10px;color:#7083a3;font-size:13px;"><strong style="color:#343241;">' + text.job + ':</strong> ' + safeJobTitle + '</p>',
    '<p style="margin:0;color:#7083a3;font-size:13px;"><strong style="color:#343241;">' + text.company + ':</strong> ' + safeCompanyName + '</p>',
    '</div>',
    '</td></tr>',
    '<tr><td style="padding:0 34px 34px;">',
    '<a href="' + safeDashboardUrl + '" style="display:inline-block;background:#940dff;color:#ffffff;text-decoration:none;border-radius:999px;padding:14px 24px;font-size:14px;font-weight:800;box-shadow:0 14px 28px rgba(148,13,255,0.22);">' + text.cta + '</a>',
    '<p style="margin:22px 0 0;color:#9aa8bf;font-size:12px;line-height:1.5;">' + text.fallback + '<br><a href="' + safeDashboardUrl + '" style="color:#533af6;word-break:break-all;">' + safeDashboardUrl + '</a></p>',
    '</td></tr>',
    '</table>',
    '</td></tr>',
    '</table>',
    '</div>',
  ].join('');
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(req) });
  }

  if (req.method !== 'POST') {
    return jsonResponse(req, { error: 'Method not allowed' }, 405);
  }

  try {
    const payload = await req.json() as EmailPayload;
    const to = getString(payload.to);

    if (!to || !to.includes('@')) {
      return jsonResponse(req, { error: 'Valid recipient email is required' }, 400);
    }

    const smtpHost = Deno.env.get('SMTP_HOST') || 'smtp.hostinger.com';
    const smtpPort = Number(Deno.env.get('SMTP_PORT') || '465');
    const smtpUser = Deno.env.get('SMTP_USER');
    const smtpPass = Deno.env.get('SMTP_PASS');
    const smtpFrom = Deno.env.get('SMTP_FROM') || smtpUser;

    if (!smtpUser || !smtpPass || !smtpFrom) {
      return jsonResponse(req, { error: 'SMTP credentials are not configured' }, 500);
    }

    const dashboardUrl = getString(payload.dashboardUrl, 'https://colaborh.com.br/candidato/testes');
    const emailData: Required<EmailPayload> = {
      to,
      candidateName: getString(payload.candidateName, 'candidato'),
      testName: getString(payload.testName, 'Teste solicitado'),
      jobTitle: getString(payload.jobTitle, 'Vaga selecionada'),
      companyName: getString(payload.companyName, 'Colaborh'),
      dashboardUrl,
    };

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    const subject = text.subjectPrefix + emailData.jobTitle;
    const greeting = emailData.candidateName !== 'candidato' ? ', ' + emailData.candidateName : '';
    const plainText = [
      text.hello + greeting + '.',
      '',
      text.plainIntro,
      '',
      text.test + ': ' + emailData.testName,
      text.job + ': ' + emailData.jobTitle,
      text.company + ': ' + emailData.companyName,
      '',
      'Acesse seu painel para responder: ' + emailData.dashboardUrl,
    ].join('\n');

    const info = await transporter.sendMail({
      from: smtpFrom,
      to,
      subject,
      text: plainText,
      html: buildEmailHtml(emailData),
    });

    return jsonResponse(req, { ok: true, messageId: info.messageId || null });
  } catch (error) {
    console.error('send-assessment-email error:', error);
    return jsonResponse(req, { error: error instanceof Error ? error.message : 'Unable to send email' }, 500);
  }
});
