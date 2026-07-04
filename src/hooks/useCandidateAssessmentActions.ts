import { getCustomQuestionsFromJobDescription } from '../utils/companyDashboardUtils';
import { getCustomTestStatusForApp as getCustomAssessmentStatusForApp } from '../utils/candidateAssessmentStatus';
import type {
  CandidateAssessmentDrawerKind,
  CandidateAssessmentListItem,
  CandidateAssessmentState,
  CustomQuestion,
  DiscResult,
  MbtiAnswer,
  MbtiCompletedResult,
  MbtiResult,
  QuestionsResult,
  TemperamentosCompletedResult,
  TemperamentosResult,
} from '../types/candidate';
import type { CompanyApplication, CompanyJob } from '../types/companyDashboard';

interface UseCandidateAssessmentActionsParams {
  vacancies: CompanyJob[];
  setActiveTestApplicationId: (id: string | null) => void;
  setDiscTestState: (state: CandidateAssessmentState) => void;
  setDiscResult: (result: DiscResult | null) => void;
  setActiveMbtiApplicationId: (id: string | null) => void;
  setMbtiAnswers: (answers: Record<number, MbtiAnswer>) => void;
  setCurrentMbtiStageIndex: (index: number) => void;
  setMbtiState: (state: CandidateAssessmentState) => void;
  setMbtiResult: (result: MbtiResult | null) => void;
  setSelectedMbtiResult: (result: MbtiCompletedResult | null) => void;
  setActiveTemperamentosApplicationId: (id: string | null) => void;
  setTemperamentosAnswers: (answers: Record<number, string>) => void;
  setCurrentTemperamentosStageIndex: (index: number) => void;
  setTemperamentosState: (state: CandidateAssessmentState) => void;
  setTemperamentosResult: (result: TemperamentosResult | null) => void;
  setSelectedTemperamentosResult: (result: TemperamentosCompletedResult | null) => void;
  handleStartCustomTest: (application: CompanyApplication) => void;
  setSelectedCustomTestResult: (result: Record<string, string> | null) => void;
  setActiveCustomTestApplicationId: (id: string | null) => void;
  setCustomTestQuestions: (questions: CustomQuestion[]) => void;
  setActiveQuestionsApplicationId: (id: string | null) => void;
  setQuestionsAnswers: (answers: QuestionsResult) => void;
  setCurrentQuestionsCategoryIndex: (index: number) => void;
  setQuestionsState: (state: CandidateAssessmentState) => void;
  setSelectedQuestionsResult: (result: QuestionsResult | null) => void;
  setDrawerTestResult: (result: CandidateAssessmentDrawerKind) => void;
}

export const useCandidateAssessmentActions = ({
  vacancies,
  setActiveTestApplicationId,
  setDiscTestState,
  setDiscResult,
  setActiveMbtiApplicationId,
  setMbtiAnswers,
  setCurrentMbtiStageIndex,
  setMbtiState,
  setMbtiResult,
  setSelectedMbtiResult,
  setActiveTemperamentosApplicationId,
  setTemperamentosAnswers,
  setCurrentTemperamentosStageIndex,
  setTemperamentosState,
  setTemperamentosResult,
  setSelectedTemperamentosResult,
  handleStartCustomTest,
  setSelectedCustomTestResult,
  setActiveCustomTestApplicationId,
  setCustomTestQuestions,
  setActiveQuestionsApplicationId,
  setQuestionsAnswers,
  setCurrentQuestionsCategoryIndex,
  setQuestionsState,
  setSelectedQuestionsResult,
  setDrawerTestResult
}: UseCandidateAssessmentActionsParams) => {
  const handleStartCandidateTest = (item: CandidateAssessmentListItem) => {
    if (item.type === 'DISC') {
      setActiveTestApplicationId(item.app.id);
      setDiscTestState('initial');
    } else if (item.type === 'MBTI') {
      setActiveMbtiApplicationId(item.app.id);
      setMbtiAnswers({});
      setCurrentMbtiStageIndex(0);
      setMbtiState('initial');
    } else if (item.type === 'TEMPERAMENTOS') {
      setActiveTemperamentosApplicationId(item.app.id);
      setTemperamentosAnswers({});
      setCurrentTemperamentosStageIndex(0);
      setTemperamentosState('initial');
    } else if (item.type === 'CUSTOM') {
      handleStartCustomTest(item.app);
    } else {
      setActiveQuestionsApplicationId(item.app.id);
      setQuestionsAnswers({});
      setCurrentQuestionsCategoryIndex(0);
      setQuestionsState('initial');
    }
  };

  const handleViewCandidateTestResult = (item: CandidateAssessmentListItem) => {
    if (item.type === 'DISC') {
      const result = item.data as DiscResult;
      setDiscResult({ D: result.D, I: result.I, S: result.S, C: result.C });
      setActiveTestApplicationId(item.app.id);
      setDrawerTestResult('DISC');
    } else if (item.type === 'MBTI') {
      const result = item.data as MbtiCompletedResult;
      setMbtiResult({ type: result.type, scores: result.scores });
      setActiveMbtiApplicationId(item.app.id);
      setSelectedMbtiResult(result);
      setDrawerTestResult('MBTI');
    } else if (item.type === 'TEMPERAMENTOS') {
      const result = item.data as TemperamentosCompletedResult;
      setTemperamentosResult({ type: result.type, scores: result.scores });
      setActiveTemperamentosApplicationId(item.app.id);
      setSelectedTemperamentosResult(result);
      setDrawerTestResult('TEMPERAMENTOS');
    } else if (item.type === 'CUSTOM') {
      setSelectedCustomTestResult(item.data as Record<string, string>);
      setActiveCustomTestApplicationId(item.app.id);

      const customStatus = getCustomAssessmentStatusForApp(item.app, vacancies);
      let questionList = customStatus.questions || [];
      if (!questionList || questionList.length === 0) {
        const jobDescription = item.app.jobs?.description || item.app.job?.description || '';
        questionList = getCustomQuestionsFromJobDescription(jobDescription);
      }

      setCustomTestQuestions(questionList);
      setDrawerTestResult('CUSTOM');
    } else {
      setSelectedQuestionsResult(item.data as QuestionsResult);
      setActiveQuestionsApplicationId(item.app.id);
      setCurrentQuestionsCategoryIndex(0);
      setDrawerTestResult('QUESTIONS');
    }
  };

  return {
    handleStartCandidateTest,
    handleViewCandidateTestResult
  };
};
