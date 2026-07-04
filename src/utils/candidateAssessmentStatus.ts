import { parseCandidatePhoneData } from './candidatePhoneData';
import type {
  CandidateAssessmentListItem,
  CustomQuestion,
  CustomTestStatus,
  DiscResult,
  MbtiCompletedResult,
  QuestionsResult,
  TemperamentosCompletedResult,
} from '../types/candidate';
import type { CompanyApplication, CompanyJob } from '../types/companyDashboard';

type DiscStatus = ({ status: 'PENDING' | 'NONE' } & DiscResult) | ({ status: 'COMPLETED' } & DiscResult);
type QuestionsStatus = { status: 'PENDING' | 'NONE'; answers: null } | { status: 'COMPLETED'; answers: QuestionsResult };
type MbtiStatus =
  | { status: 'PENDING' | 'NONE'; type: string; scores: null; answers: null }
  | ({ status: 'COMPLETED' } & MbtiCompletedResult);
type TemperamentosStatus =
  | { status: 'PENDING' | 'NONE'; type: string; scores: null; answers: null }
  | ({ status: 'COMPLETED' } & TemperamentosCompletedResult);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const parseCustomQuestionList = (value: unknown): CustomQuestion[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!isRecord(item)) return null;
      const id = typeof item.id === 'string' ? item.id : String(item.id || '');
      const question = typeof item.question === 'string' ? item.question : '';
      return id && question ? { id, question } : null;
    })
    .filter((item): item is CustomQuestion => Boolean(item));
};

const parseStringRecord = (value: unknown): Record<string, string> | null => {
  if (!isRecord(value)) return null;

  return Object.fromEntries(
    Object.entries(value).map(([key, entryValue]) => [key, typeof entryValue === 'string' ? entryValue : String(entryValue ?? '')])
  );
};

export const getDiscStatusForApp = (application: CompanyApplication): DiscStatus => {
  const phoneVal = application.candidate_phone || '';
  let discVal = '';

  if (phoneVal.includes('===DISC===')) {
    discVal = phoneVal.split('===DISC===')[1].split('===NOTES===')[0].split('===QUESTIONS===')[0].trim();
  }

  if (discVal) {
    if (discVal === 'PENDING') {
      return { status: 'PENDING', D: 0, I: 0, S: 0, C: 0 };
    }

    if (discVal.startsWith('COMPLETED===')) {
      const scores = discVal.replace('COMPLETED===', '').split(',').map(Number);
      return {
        status: 'COMPLETED',
        D: scores[0] || 0,
        I: scores[1] || 0,
        S: scores[2] || 0,
        C: scores[3] || 0,
      };
    }
  }

  return { status: 'NONE', D: 0, I: 0, S: 0, C: 0 };
};

export const getQuestionsStatusForApp = (application: CompanyApplication): QuestionsStatus => {
  const phoneVal = application.candidate_phone || '';
  let questionsVal = '';

  if (phoneVal.includes('===QUESTIONS===')) {
    questionsVal = phoneVal.split('===QUESTIONS===')[1].split('===DISC===')[0].split('===NOTES===')[0].trim();
  }

  if (questionsVal) {
    if (questionsVal === 'PENDING') {
      return { status: 'PENDING', answers: null };
    }

    if (questionsVal.startsWith('COMPLETED===')) {
      try {
        const jsonStr = questionsVal.replace('COMPLETED===', '').trim();
        const answers = JSON.parse(jsonStr) as QuestionsResult;
        return { status: 'COMPLETED', answers };
      } catch (error) {
        console.error('Erro ao fazer parse do JSON de respostas:', error);
        return { status: 'NONE', answers: null };
      }
    }
  }

  return { status: 'NONE', answers: null };
};

export const getMbtiStatusForApp = (application: CompanyApplication): MbtiStatus => {
  const parsed = parseCandidatePhoneData(application.candidate_phone || '');
  const mbtiVal = parsed.mbti;

  if (mbtiVal) {
    if (mbtiVal === 'PENDING') {
      return { status: 'PENDING', type: '', scores: null, answers: null };
    }

    if (mbtiVal.startsWith('COMPLETED===')) {
      try {
        const jsonStr = mbtiVal.replace('COMPLETED===', '').trim();
        const data = JSON.parse(jsonStr) as MbtiCompletedResult;
        return {
          status: 'COMPLETED',
          type: data.type,
          scores: data.scores,
          answers: data.answers,
        };
      } catch (error) {
        console.error('Erro ao fazer parse do JSON de MBTI:', error);
        return { status: 'NONE', type: '', scores: null, answers: null };
      }
    }
  }

  return { status: 'NONE', type: '', scores: null, answers: null };
};

export const getTemperamentosStatusForApp = (application: CompanyApplication): TemperamentosStatus => {
  const parsed = parseCandidatePhoneData(application.candidate_phone || '');
  const tempVal = parsed.temperamentos;

  if (tempVal) {
    if (tempVal === 'PENDING') {
      return { status: 'PENDING', type: '', scores: null, answers: null };
    }

    if (tempVal.startsWith('COMPLETED===')) {
      try {
        const jsonStr = tempVal.replace('COMPLETED===', '').trim();
        const data = JSON.parse(jsonStr) as TemperamentosCompletedResult;
        return {
          status: 'COMPLETED',
          type: data.type,
          scores: data.scores,
          answers: data.answers,
        };
      } catch (error) {
        console.error('Erro ao fazer parse do JSON de Temperamentos:', error);
        return { status: 'NONE', type: '', scores: null, answers: null };
      }
    }
  }

  return { status: 'NONE', type: '', scores: null, answers: null };
};

export const getCustomTestStatusForApp = (application: CompanyApplication, vacancies: CompanyJob[] = []): CustomTestStatus => {
  const parsed = parseCandidatePhoneData(application.candidate_phone || '');
  const customVal = parsed.customTest;

  if (customVal) {
    if (customVal === 'PENDING') {
      const job = vacancies.find((vacancy) => vacancy.id === application.job_id);
      const parsedCustomFromDesc = (() => {
        if (job?.description && job.description.includes('===CUSTOM_TEST_JSON===')) {
          try {
            const part = job.description.split('===CUSTOM_TEST_JSON===')[1].split('===FIM_CUSTOM_TEST===')[0];
            return JSON.parse(part) as { title?: string; questions?: unknown };
          } catch (error) {
            console.error('Error parsing custom test from description:', error);
          }
        }
        return null;
      })();

      return {
        status: 'PENDING',
        title: parsedCustomFromDesc?.title || 'Questionario Customizado',
        questions: parseCustomQuestionList(parsedCustomFromDesc?.questions),
        answers: null,
      };
    }

    if (customVal.startsWith('COMPLETED:::')) {
      try {
        const jsonStr = customVal.replace('COMPLETED:::', '').trim();
        const data = JSON.parse(jsonStr) as { title?: string; questions?: unknown; responses?: unknown };
        return {
          status: 'COMPLETED',
          title: data.title || 'Questionario Customizado',
          questions: parseCustomQuestionList(data.questions),
          answers: parseStringRecord(data.responses),
        };
      } catch (error) {
        console.error('Erro ao fazer parse do JSON de questionario customizado:', error);
      }
    } else if (customVal.startsWith('COMPLETED===')) {
      try {
        const jsonStr = customVal.replace('COMPLETED===', '').trim();
        const data = JSON.parse(jsonStr) as { responses?: unknown };
        return {
          status: 'COMPLETED',
          title: 'Questionario Customizado',
          questions: [],
          answers: parseStringRecord(data.responses),
        };
      } catch (error) {
        console.error('Erro ao fazer parse do JSON legado de questionario customizado:', error);
      }
    }
  }

  return { status: 'NONE', title: '', questions: [], answers: null };
};

export const getCandidateAssessmentLists = (applications: CompanyApplication[], vacancies: CompanyJob[]) => {
  const pendingTests: CandidateAssessmentListItem[] = [];
  const completedTests: CandidateAssessmentListItem[] = [];

  applications.forEach((application) => {
    const job = vacancies.find((vacancy) => vacancy.id === application.job_id);
    const jobTitle = job?.title || 'Oportunidade';
    const companyName = job?.company_name || 'Empresa Parceira';

    const discStatus = getDiscStatusForApp(application);
    if (discStatus.status === 'PENDING') {
      pendingTests.push({ id: `${application.id}-DISC`, type: 'DISC', app: application, jobTitle, companyName });
    } else if (discStatus.status === 'COMPLETED') {
      completedTests.push({ id: `${application.id}-DISC`, type: 'DISC', app: application, jobTitle, companyName, data: discStatus });
    }

    const questionsStatus = getQuestionsStatusForApp(application);
    if (questionsStatus.status === 'PENDING') {
      pendingTests.push({ id: `${application.id}-QUESTIONS`, type: 'QUESTIONS', app: application, jobTitle, companyName });
    } else if (questionsStatus.status === 'COMPLETED') {
      completedTests.push({ id: `${application.id}-QUESTIONS`, type: 'QUESTIONS', app: application, jobTitle, companyName, data: questionsStatus.answers });
    }

    const mbtiStatus = getMbtiStatusForApp(application);
    if (mbtiStatus.status === 'PENDING') {
      pendingTests.push({ id: `${application.id}-MBTI`, type: 'MBTI', app: application, jobTitle, companyName });
    } else if (mbtiStatus.status === 'COMPLETED') {
      completedTests.push({ id: `${application.id}-MBTI`, type: 'MBTI', app: application, jobTitle, companyName, data: mbtiStatus });
    }

    const temperamentosStatus = getTemperamentosStatusForApp(application);
    if (temperamentosStatus.status === 'PENDING') {
      pendingTests.push({ id: `${application.id}-TEMPERAMENTOS`, type: 'TEMPERAMENTOS', app: application, jobTitle, companyName });
    } else if (temperamentosStatus.status === 'COMPLETED') {
      completedTests.push({ id: `${application.id}-TEMPERAMENTOS`, type: 'TEMPERAMENTOS', app: application, jobTitle, companyName, data: temperamentosStatus });
    }

    const customTestStatus = getCustomTestStatusForApp(application, vacancies);
    if (customTestStatus.status === 'PENDING') {
      pendingTests.push({ id: `${application.id}-CUSTOM`, type: 'CUSTOM', app: application, jobTitle, companyName });
    } else if (customTestStatus.status === 'COMPLETED') {
      completedTests.push({ id: `${application.id}-CUSTOM`, type: 'CUSTOM', app: application, jobTitle, companyName, data: customTestStatus.answers });
    }
  });

  return {
    pendingTests,
    completedTests,
  };
};
