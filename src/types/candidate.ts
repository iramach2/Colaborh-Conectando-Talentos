import type { ChatMessage } from '../services/messageService';
import type { CompanyApplication, CompanyJob } from './companyDashboard';

export type CandidateExperience = {
  id: string;
  role: string;
  company: string;
  duration?: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
};

export type CandidateEducation = {
  id: string;
  course: string;
  institution: string;
  status: 'Incompleto' | 'Completo' | 'Cursando' | string;
  gradYear: string;
};

export type CandidateLanguage = {
  id: string;
  language: string;
  level: string;
};

export type CandidateAchievement = {
  id: string;
  type: string;
  title: string;
  description: string;
};

export type CandidateDiversity = {
  pronoun: string;
  genderIdentity: string;
  sexualOrientation: string;
  race: string;
  consent: boolean;
};

export type CandidateResumeData = {
  fullName: string;
  email: string;
  phone: string;
  state: string;
  gender: string;
  summary: string;
  isPcd: boolean;
  cid: string;
  isFirstJob: boolean;
  birthDate: string;
  city: string;
  salary: string;
  skills: string[];
  experiences: CandidateExperience[];
  educations: CandidateEducation[];
  profilePic: string;
  languages: CandidateLanguage[];
  achievements: CandidateAchievement[];
  diversity: CandidateDiversity;
};

export type CandidateConversation = {
  id: string;
  application: CompanyApplication;
  job?: CompanyJob;
  messages: ChatMessage[];
  lastMessage?: ChatMessage;
  unreadCount: number;
};

export type CandidateAssessmentKind = 'DISC' | 'MBTI' | 'TEMPERAMENTOS' | 'CUSTOM' | 'QUESTIONS';

export type CandidateAssessmentDrawerKind = CandidateAssessmentKind | null;

export type CandidateAssessmentState = 'initial' | 'taking' | 'completed' | 'none';

export type DiscAnswer = {
  D: number | null;
  I: number | null;
  S: number | null;
  C: number | null;
};

export type DiscResult = {
  D: number;
  I: number;
  S: number;
  C: number;
};

export type DiscQuestion = {
  pergunta: string;
  opcoes: Record<'D' | 'I' | 'S' | 'C', string>;
};

export type MbtiDimension = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

export type MbtiAnswer = {
  a: number | null;
  b: number | null;
};

export type MbtiResult = {
  type: string;
  scores: Record<MbtiDimension, number>;
};

export type MbtiAnswerPayload = {
  q: number;
  a: number;
  b: number;
};

export type MbtiCompletedResult = MbtiResult & {
  status?: string;
  answers?: MbtiAnswerPayload[] | null;
};

export type TemperamentosKey = 'I' | 'C' | 'O' | 'A';

export type TemperamentosResult = {
  type: string;
  scores: Record<TemperamentosKey, number>;
};

export type TemperamentosAnswerPayload = {
  q: number;
  choice: string;
};

export type TemperamentosCompletedResult = TemperamentosResult & {
  status?: string;
  answers?: TemperamentosAnswerPayload[] | null;
};

export type QuestionsResult = Record<number, string>;

export type CustomQuestion = {
  id: string;
  question: string;
  type?: 'choice' | 'text' | string;
  options?: string[];
  correctOptionIndex?: number | null;
};

export type QuestionsCategoryKey = 'EXPERIENCE' | 'CONTRIBUTION' | 'TEAMWORK' | 'BEHAVIORAL';

export type QuestionsCategory = {
  title: string;
  questions: string[];
};

export type QuestionsCategories = Record<QuestionsCategoryKey, QuestionsCategory>;

export type CustomTestStatus = {
  status: 'PENDING' | 'COMPLETED' | 'NONE';
  title: string;
  questions: CustomQuestion[];
  answers: Record<string, string> | null;
};

export type CandidateAssessmentListItem = {
  id: string;
  type: CandidateAssessmentKind;
  app: CompanyApplication;
  jobTitle: string;
  companyName: string;
  data?: DiscResult | QuestionsResult | MbtiCompletedResult | TemperamentosCompletedResult | Record<string, string> | null;
};
