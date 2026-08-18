import type {
  CompanyApplicant,
  CompanyApplication,
  CompanyJob,
  MbtiReportResult,
  TemperamentosReportResult,
} from '../types/companyDashboard';
import {
  getAssessmentMarkerStatus,
  getCompletedAssessmentBody,
  type AssessmentMarkerStatus,
} from './assessmentMarker';
import { parseCandidatePhoneData } from './companyDashboardUtils';

export type AssessmentStatus = AssessmentMarkerStatus;

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

const parseCompletedJson = <T>(value: string): T | null => {
  try {
    return JSON.parse(getCompletedAssessmentBody(value)) as T;
  } catch {
    return null;
  }
};

export const getAssessmentRows = (companyApplications: CompanyApplication[], jobs: CompanyJob[]): AssessmentRow[] => {
  return companyApplications.map((app) => {
    const phoneStr = app.candidate_phone || '';
    const parsedData = parseCandidatePhoneData(phoneStr);
    const job = jobs.find((jobItem) => jobItem.id === app.job_id);

    const discStatus = getAssessmentMarkerStatus(parsedData.disc);
    let discScores = [0, 0, 0, 0];
    if (discStatus === 'COMPLETED' && parsedData.disc) {
      discScores = getCompletedAssessmentBody(parsedData.disc).split(',').map(Number);
    }

    const mbtiStatus = getAssessmentMarkerStatus(parsedData.mbti);
    let mbtiData: MbtiReportResult | null = null;
    if (mbtiStatus === 'COMPLETED' && parsedData.mbti) {
      mbtiData = parseCompletedJson<MbtiReportResult>(parsedData.mbti);
    }

    const questionsStatus = getAssessmentMarkerStatus(parsedData.questions);
    let questionsResponses: Record<string, unknown> | null = null;
    if (questionsStatus === 'COMPLETED' && parsedData.questions) {
      questionsResponses = parseCompletedJson<Record<string, unknown>>(parsedData.questions);
    }

    const temperamentosStatus = getAssessmentMarkerStatus(parsedData.temperamentos);
    let temperamentosData: TemperamentosReportResult | null = null;
    if (temperamentosStatus === 'COMPLETED' && parsedData.temperamentos) {
      temperamentosData = parseCompletedJson<TemperamentosReportResult>(parsedData.temperamentos);
    }

    const customTestStatus = getAssessmentMarkerStatus(parsedData.customTest);
    let customTestData: unknown = null;
    if (customTestStatus === 'COMPLETED' && parsedData.customTest) {
      customTestData = parseCompletedJson<unknown>(parsedData.customTest);
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
