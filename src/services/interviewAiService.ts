import { supabase } from '../lib/supabase';

export type InterviewAiReport = {
  summary?: string;
  strengths?: string[];
  attentionPoints?: string[];
  technicalEvidence?: string[];
  behavioralEvidence?: string[];
  recommendation?: string;
  suggestedNextSteps?: string[];
  confidence?: string;
};

type FinalizeInterviewTranscriptParams = {
  interviewId: string;
  transcript: string;
  candidateName?: string;
  jobTitle?: string;
  companyName?: string;
};

const formatReportText = (report: InterviewAiReport) => {
  const section = (title: string, items?: string[]) => {
    if (!items || items.length === 0) return '';
    return `\n${title}\n${items.map((item) => `- ${item}`).join('\n')}`;
  };

  return [
    report.summary ? `Resumo\n${report.summary}` : '',
    section('Pontos fortes', report.strengths),
    section('Pontos de atenção', report.attentionPoints),
    section('Evidências técnicas', report.technicalEvidence),
    section('Evidências comportamentais', report.behavioralEvidence),
    report.recommendation ? `\nRecomendação\n${report.recommendation}` : '',
    section('Próximos passos sugeridos', report.suggestedNextSteps),
    report.confidence ? `\nConfiança da análise\n${report.confidence}` : '',
  ].filter(Boolean).join('\n');
};

export const finalizeInterviewTranscript = async ({
  interviewId,
  transcript,
  candidateName,
  jobTitle,
  companyName,
}: FinalizeInterviewTranscriptParams) => {
  const normalizedTranscript = transcript.trim();

  if (!interviewId || !normalizedTranscript) {
    return null;
  }

  const transcriptGeneratedAt = new Date().toISOString();

  await supabase
    .from('interviews')
    .update({
      transcript: normalizedTranscript,
      transcript_status: 'captured',
      transcript_generated_at: transcriptGeneratedAt,
    })
    .eq('id', interviewId);

  const { data, error } = await supabase.functions.invoke('analyze-interview', {
    body: {
      transcript: normalizedTranscript,
      candidateName,
      jobTitle,
      companyName,
    },
  });

  if (error) {
    await supabase
      .from('interviews')
      .update({ transcript_status: 'report_failed' })
      .eq('id', interviewId);
    throw error;
  }

  const report = data?.report as InterviewAiReport | undefined;
  const reportText = report ? formatReportText(report) : '';

  await supabase
    .from('interviews')
    .update({
      ai_report: reportText,
      ai_report_json: report || null,
      transcript_status: 'report_ready',
      ai_report_generated_at: new Date().toISOString(),
    })
    .eq('id', interviewId);

  return {
    transcript: normalizedTranscript,
    report,
    reportText,
  };
};