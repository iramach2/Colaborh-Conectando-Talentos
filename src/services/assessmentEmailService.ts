import { supabase } from '../lib/supabase';

type SendAssessmentEmailParams = {
  to: string;
  candidateName?: string;
  testName: string;
  jobTitle: string;
  companyName?: string;
};

export const sendAssessmentEmail = async ({
  to,
  candidateName,
  testName,
  jobTitle,
  companyName,
}: SendAssessmentEmailParams) => {
  const recipient = to.trim();
  if (!recipient || !recipient.includes('@')) {
    return { ok: false, error: 'E-mail do candidato invalido.' };
  }

  const dashboardUrl = `${window.location.origin}/candidato/testes`;
  const { data, error } = await supabase.functions.invoke('send-assessment-email', {
    body: {
      to: recipient,
      candidateName,
      testName,
      jobTitle,
      companyName,
      dashboardUrl,
    },
  });

  if (error) {
    console.error('Erro ao enviar e-mail de teste:', error);
    return { ok: false, error: error.message };
  }

  return { ok: true, data };
};
