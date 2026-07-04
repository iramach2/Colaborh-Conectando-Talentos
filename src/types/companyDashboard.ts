import type { TalentProfile } from '../hooks/useCompanyTalentBank';

export type CompanyLike = {
  id?: string;
  nomeFantasia?: string;
  razaoSocial?: string;
  solicitante?: string;
  sector?: string;
  logo?: string;
  plan?: string;
  credits?: number;
  savedTalents?: string[];
};

export type CompanyJob = {
  id?: string;
  company_id?: string | null;
  title?: string | null;
  role?: string | null;
  company_name?: string | null;
  modality?: string | null;
  state?: string | null;
  city?: string | null;
  salary?: string | null;
  salary_min?: string | null;
  salary_max?: string | null;
  remuneration_type?: string | null;
  has_bonus?: boolean | null;
  bonus_type?: string | null;
  bonus_value?: string | null;
  contract_type?: string | null;
  description?: string | null;
  requirements?: string[] | string | null;
  stages?: string[] | string | null;
  stageTests?: Record<string, string[]>;
  work_schedule?: string | null;
  min_age?: number | string | null;
  minAge?: number | string | null;
  is_first_job?: boolean | null;
  is_pcd?: boolean | null;
  pcd_details?: string | null;
  positions?: number | string | null;
  request_reason?: string | null;
  is_urgent?: boolean | null;
  responsibilities?: string | null;
  benefits?: unknown;
  status?: string | null;
  created_at?: string | null;
  candidates_count?: number;
};

export type CompanyApplication = {
  id?: string;
  job_id?: string | null;
  candidate_user_id?: string | null;
  talent_id?: string | null;
  candidate_name?: string | null;
  candidate_email?: string | null;
  candidate_phone?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: string | null;
  city?: string | null;
  state?: string | null;
  profile_pic?: string | null;
  summary?: string | null;
  created_at?: string | null;
  disc_result?: unknown;
  mbti_result?: unknown;
  questions_result?: unknown;
  temperamentos_result?: unknown;
  custom_test_result?: unknown;
  job?: CompanyJob | null;
  jobs?: CompanyJob | null;
};

export type CompanyApplicant = CompanyApplication & {
  talentMatched?: TalentProfile | null;
  notes?: string | null;
  fullApp?: CompanyApplication;
  normalizedStatus?: string;
  discStatus?: string;
  discDate?: string | null;
  D?: number | string;
  I?: number | string;
  S?: number | string;
  C?: number | string;
  questionsStatus?: string;
  questionsDate?: string | null;
  questionsResponses?: unknown;
  mbtiStatus?: string;
  mbtiDate?: string | null;
  mbtiResponses?: Record<string, unknown> & { type?: string };
  temperamentosStatus?: string;
  temperamentosDate?: string | null;
  temperamentosResponses?: Record<string, unknown> & { type?: string };
  customTestStatus?: string;
  customTestDate?: string | null;
  completedAt?: string | null;
  matchScore?: number;
};

export type CompanyInterview = {
  id?: string;
  job_id?: string | null;
  candidate_email?: string | null;
  company_name?: string | null;
  date_time?: string | null;
  scheduled_at?: string | null;
  notes?: string | null;
  status?: string | null;
  room_name?: string | null;
  transcript?: string | null;
  ai_report?: string | null;
  ai_report_json?: unknown;
  transcript_status?: string | null;
  transcript_generated_at?: string | null;
  ai_report_generated_at?: string | null;
  created_at?: string | null;
  job?: Pick<CompanyJob, 'id' | 'title' | 'company_name'> | null;
};

export type CompanyMessage = {
  id?: string;
  application_id?: string | null;
  sender_type?: 'company' | 'candidate' | string;
  sender_name?: string | null;
  content?: string | null;
  message?: string | null;
  read?: boolean | null;
  created_at?: string | null;
};

export type DiscReportResult = {
  applicantName?: string;
  completedAt?: string | null;
  D: number;
  I: number;
  S: number;
  C: number;
};

export type AssessmentAnswer = {
  q?: string | number;
  question?: string;
  answer?: string;
  a?: string;
  b?: string;
  choice?: string;
  value?: string | number;
};

export type MbtiReportResult = {
  applicantName?: string;
  completedAt?: string | null;
  type?: string;
  scores?: Record<string, number>;
  answers?: AssessmentAnswer[];
  responses?: Record<string, unknown>;
};

export type TemperamentosReportResult = {
  applicantName?: string;
  completedAt?: string | null;
  type?: string;
  scores?: Record<string, number>;
  answers?: AssessmentAnswer[];
  responses?: Record<string, unknown>;
};

export type CustomQuestionItem = {
  id?: string;
  text?: string;
  question?: string;
  type?: string;
  options?: string[];
};
