import type { Dispatch, SetStateAction } from 'react';
import { MBTI_QUESTIONS, TEMPERAMENTOS_PROFILES, TEMPERAMENTOS_QUESTIONS } from '../data/assessmentProfiles';
import { ALL_QUESTIONS_LIST } from '../data/profileQuestions';
import {
  getCandidateAssessmentLists,
  getCustomTestStatusForApp as getCustomAssessmentStatusForApp,
} from '../utils/candidateAssessmentStatus';
import { getCustomQuestionsFromJobDescription } from '../utils/companyDashboardUtils';
import { useCandidateAssessmentActions } from './useCandidateAssessmentActions';
import { useCandidateCustomAssessment } from './useCandidateCustomAssessment';
import { useCandidateDiscAssessment } from './useCandidateDiscAssessment';
import { useCandidateMbtiAssessment } from './useCandidateMbtiAssessment';
import { useCandidateQuestionsAssessment } from './useCandidateQuestionsAssessment';
import { useCandidateTemperamentosAssessment } from './useCandidateTemperamentosAssessment';
import type { CandidateAssessmentDrawerKind } from '../types/candidate';
import type { CompanyApplication, CompanyJob } from '../types/companyDashboard';

interface UseCandidateAssessmentsParams {
  applications: CompanyApplication[];
  candidateEmail?: string;
  vacancies: CompanyJob[];
  setApplications: Dispatch<SetStateAction<CompanyApplication[]>>;
  setDrawerTestResult: (result: CandidateAssessmentDrawerKind) => void;
}

export const useCandidateAssessments = ({
  applications,
  candidateEmail,
  vacancies,
  setApplications,
  setDrawerTestResult,
}: UseCandidateAssessmentsParams) => {
  const discAssessment = useCandidateDiscAssessment({
    applications,
    candidateEmail,
    setApplications,
    setDrawerTestResult,
  });

  const questionsAssessment = useCandidateQuestionsAssessment({
    applications,
    candidateEmail,
    questionsList: ALL_QUESTIONS_LIST,
    setApplications,
    setDrawerTestResult,
  });

  const mbtiAssessment = useCandidateMbtiAssessment({
    applications,
    candidateEmail,
    questions: MBTI_QUESTIONS,
    setApplications,
    setDrawerTestResult,
  });

  const temperamentosAssessment = useCandidateTemperamentosAssessment({
    applications,
    candidateEmail,
    questions: TEMPERAMENTOS_QUESTIONS,
    profiles: TEMPERAMENTOS_PROFILES,
    setApplications,
    setDrawerTestResult,
  });

  const customAssessment = useCandidateCustomAssessment({
    applications,
    candidateEmail,
    getCustomTestStatusForApp: (application) => getCustomAssessmentStatusForApp(application, vacancies),
    getCustomQuestionsFromJobDescription,
    setApplications,
    setDrawerTestResult,
  });

  const { pendingTests, completedTests } = getCandidateAssessmentLists(applications, vacancies);

  const assessmentActions = useCandidateAssessmentActions({
    vacancies,
    setActiveTestApplicationId: discAssessment.setActiveTestApplicationId,
    setDiscTestState: discAssessment.setDiscTestState,
    setDiscResult: discAssessment.setDiscResult,
    setActiveMbtiApplicationId: mbtiAssessment.setActiveMbtiApplicationId,
    setMbtiAnswers: mbtiAssessment.setMbtiAnswers,
    setCurrentMbtiStageIndex: mbtiAssessment.setCurrentMbtiStageIndex,
    setMbtiState: mbtiAssessment.setMbtiState,
    setMbtiResult: mbtiAssessment.setMbtiResult,
    setSelectedMbtiResult: mbtiAssessment.setSelectedMbtiResult,
    setActiveTemperamentosApplicationId: temperamentosAssessment.setActiveTemperamentosApplicationId,
    setTemperamentosAnswers: temperamentosAssessment.setTemperamentosAnswers,
    setCurrentTemperamentosStageIndex: temperamentosAssessment.setCurrentTemperamentosStageIndex,
    setTemperamentosState: temperamentosAssessment.setTemperamentosState,
    setTemperamentosResult: temperamentosAssessment.setTemperamentosResult,
    setSelectedTemperamentosResult: temperamentosAssessment.setSelectedTemperamentosResult,
    handleStartCustomTest: customAssessment.handleStartCustomTest,
    setSelectedCustomTestResult: customAssessment.setSelectedCustomTestResult,
    setActiveCustomTestApplicationId: customAssessment.setActiveCustomTestApplicationId,
    setCustomTestQuestions: customAssessment.setCustomTestQuestions,
    setActiveQuestionsApplicationId: questionsAssessment.setActiveQuestionsApplicationId,
    setQuestionsAnswers: questionsAssessment.setQuestionsAnswers,
    setCurrentQuestionsCategoryIndex: questionsAssessment.setCurrentQuestionsCategoryIndex,
    setQuestionsState: questionsAssessment.setQuestionsState,
    setSelectedQuestionsResult: questionsAssessment.setSelectedQuestionsResult,
    setDrawerTestResult,
  });

  return {
    ...discAssessment,
    ...questionsAssessment,
    ...mbtiAssessment,
    ...temperamentosAssessment,
    ...customAssessment,
    pendingTests,
    completedTests,
    ...assessmentActions,
  };
};
