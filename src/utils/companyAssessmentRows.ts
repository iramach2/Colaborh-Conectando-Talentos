import type {
  CompanyApplicant,
  CompanyApplication,
  CompanyJob,
  MbtiReportResult,
  TemperamentosReportResult,
} from '../types/companyDashboard';
import { parseCandidatePhoneData } from './companyDashboardUtils';

export type AssessmentStatus = 'NONE' | 'PENDING' | 'COMPLETED';

export type AssessmentRow = CompanyApplicant & {
  job?: CompanyJob;
  discStatus: AssessmentStatus;
  discScores: number[];
  mbtiStatus: AssessmentStatus;
  mbtiData: MbtiReportResult | null;
  questionsStatus: AssessmentStatus;
  questionsResponses: Record<string, unknown> | null;
  temperamentosStatus: AssessmentStatus;
  temperamentosData: TemperamentosReportResult | null;
  customTestStatus: AssessmentStatus;
  customTestData: unknown;
};

const stripCompletedDate = (value: string) => value.split('===DATE===')[0].trim();

const getCompletedBody = (value: string) => stripCompletedDate(value).replace('COMPLETED===', '').trim();

const parseCompletedJson = <T>(value: string): T | null => {
  try {
    return JSON.parse(getCompletedBody(value)) as T;
  } catch {
    return null;
  }
};

export const getAssessmentRows = (companyApplications: CompanyApplication[], jobs: CompanyJob[]): AssessmentRow[] => {
  return companyApplications.map((app) => {
    const phoneStr = app.candidate_phone || '';
    const parsedData = parseCandidatePhoneData(phoneStr);
    const job = jobs.find((jobItem) => jobItem.id === app.job_id);

    let discStatus: AssessmentStatus = 'NONE';
    let discScores = [0, 0, 0, 0];
    if (parsedData.disc) {
      if (parsedData.disc === 'PENDING') discStatus = 'PENDING';
      else if (parsedData.disc.startsWith('COMPLETED===')) {
        discStatus = 'COMPLETED';
        discScores = getCompletedBody(parsedData.disc).split(',').map(Number);
      }
    }

    let mbtiStatus: AssessmentStatus = 'NONE';
    let mbtiData: MbtiReportResult | null = null;
    if (parsedData.mbti) {
      if (parsedData.mbti === 'PENDING') mbtiStatus = 'PENDING';
      else if (parsedData.mbti.startsWith('COMPLETED===')) {
        mbtiStatus = 'COMPLETED';
        mbtiData = parseCompletedJson<MbtiReportResult>(parsedData.mbti);
      }
    }

    let questionsStatus: AssessmentStatus = 'NONE';
    let questionsResponses: Record<string, unknown> | null = null;
    if (parsedData.questions) {
      if (parsedData.questions === 'PENDING') questionsStatus = 'PENDING';
      else if (parsedData.questions.startsWith('COMPLETED===')) {
        questionsStatus = 'COMPLETED';
        questionsResponses = parseCompletedJson<Record<string, unknown>>(parsedData.questions);
      }
    }

    let temperamentosStatus: AssessmentStatus = 'NONE';
    let temperamentosData: TemperamentosReportResult | null = null;
    if (parsedData.temperamentos) {
      if (parsedData.temperamentos === 'PENDING') temperamentosStatus = 'PENDING';
      else if (parsedData.temperamentos.startsWith('COMPLETED===')) {
        temperamentosStatus = 'COMPLETED';
        temperamentosData = parseCompletedJson<TemperamentosReportResult>(parsedData.temperamentos);
      }
    }

    let customTestStatus: AssessmentStatus = 'NONE';
    let customTestData: unknown = null;
    if (parsedData.customTest) {
      if (parsedData.customTest === 'PENDING') customTestStatus = 'PENDING';
      else if (parsedData.customTest.startsWith('COMPLETED===')) {
        customTestStatus = 'COMPLETED';
        customTestData = parseCompletedJson<unknown>(parsedData.customTest);
      }
    }

    return {
      ...app,
      job,
      discStatus,
      discScores,
      mbtiStatus,
      mbtiData,
      questionsStatus,
      questionsResponses,
      temperamentosStatus,
      temperamentosData,
      customTestStatus,
      customTestData,
    };
  }).filter((candidate) =>
    candidate.discStatus !== 'NONE' ||
    candidate.mbtiStatus !== 'NONE' ||
    candidate.questionsStatus !== 'NONE' ||
    candidate.temperamentosStatus !== 'NONE' ||
    candidate.customTestStatus !== 'NONE'
  );
};
