import { Dispatch, SetStateAction, useState } from 'react';
import { supabase } from '../lib/supabase';
import { markAssessmentCompleted } from '../services/assessmentService';
import type {
  CandidateAssessmentDrawerKind,
  CandidateAssessmentState,
  CustomQuestion,
  CustomTestStatus,
} from '../types/candidate';
import type { CompanyApplication } from '../types/companyDashboard';
import { parseCandidatePhoneData, serializeCandidatePhoneData } from '../utils/candidatePhoneData';

interface UseCandidateCustomAssessmentParams {
  applications: CompanyApplication[];
  candidateEmail?: string;
  getCustomTestStatusForApp: (application: CompanyApplication) => CustomTestStatus;
  getCustomQuestionsFromJobDescription: (description: string) => CustomQuestion[];
  setApplications: Dispatch<SetStateAction<CompanyApplication[]>>;
  setDrawerTestResult: (value: CandidateAssessmentDrawerKind) => void;
}

export const useCandidateCustomAssessment = ({
  applications,
  candidateEmail,
  getCustomTestStatusForApp,
  getCustomQuestionsFromJobDescription,
  setApplications,
  setDrawerTestResult,
}: UseCandidateCustomAssessmentParams) => {
  const [customTestState, setCustomTestState] = useState<CandidateAssessmentState>('none');
  const [activeCustomTestApplicationId, setActiveCustomTestApplicationId] = useState<string | null>(null);
  const [customTestQuestions, setCustomTestQuestions] = useState<CustomQuestion[]>([]);
  const [customTestAnswers, setCustomTestAnswers] = useState<Record<string, string>>({});
  const [isSavingCustomTest, setIsSavingCustomTest] = useState(false);
  const [customTestErrorMessage, setCustomTestErrorMessage] = useState<string | null>(null);
  const [selectedCustomTestResult, setSelectedCustomTestResult] = useState<Record<string, string> | null>(null);

  const handleStartCustomTest = (application: CompanyApplication) => {
    const customTestStatus = getCustomTestStatusForApp(application);
    let questionList = customTestStatus.questions || [];

    if (!questionList || questionList.length === 0) {
      const jobDescription = application.jobs?.description || application.job?.description || '';
      questionList = getCustomQuestionsFromJobDescription(jobDescription);
    }

    setCustomTestQuestions(questionList);
    setCustomTestAnswers({});
    setActiveCustomTestApplicationId(application.id);
    setCustomTestErrorMessage(null);
    setCustomTestState('initial');
  };

  const handleFinishCustomTest = async () => {
    const unansweredQuestion = customTestQuestions.find((question) => {
      const answer = customTestAnswers[question.id];
      return !answer || answer.trim().length === 0;
    });

    if (unansweredQuestion) {
      setCustomTestErrorMessage(`Por favor, responda a todas as perguntas do questionario. A pergunta "${unansweredQuestion.question}" esta pendente.`);
      return;
    }

    setCustomTestErrorMessage(null);

    if (!import.meta.env.VITE_SUPABASE_URL || !activeCustomTestApplicationId) {
      setCustomTestState('none');
      setSelectedCustomTestResult(customTestAnswers);
      setDrawerTestResult('CUSTOM');
      return;
    }

    try {
      setIsSavingCustomTest(true);

      const app = applications.find((application) => application.id === activeCustomTestApplicationId);
      const parsedData = parseCandidatePhoneData(app?.candidate_phone || '');
      const customStatus = getCustomTestStatusForApp(app);
      const completedQuestions = customStatus.questions?.length
        ? customStatus.questions
        : customTestQuestions;
      const completedPayload = {
        title: customStatus.title || 'Questionario Customizado',
        questions: completedQuestions,
        responses: customTestAnswers,
      };

      let customTestVal = '';
      if (completedQuestions.length > 0) {
        customTestVal = `COMPLETED:::${JSON.stringify(completedPayload)}===DATE===${new Date().toISOString()}`;
      } else {
        const payload = {
          responses: customTestAnswers,
        };
        customTestVal = `COMPLETED===${JSON.stringify(payload)}===DATE===${new Date().toISOString()}`;
      }

      const updatedPhoneVal = serializeCandidatePhoneData(
        parsedData.phone,
        parsedData.disc,
        parsedData.notes,
        parsedData.questions,
        parsedData.mbti,
        parsedData.temperamentos,
        customTestVal
      );

      const assessmentSaved = await markAssessmentCompleted(
        activeCustomTestApplicationId,
        'custom',
        candidateEmail || '',
        { responses: customTestAnswers },
        completedPayload
      );

      if (!assessmentSaved) {
        const { error } = await supabase
          .from('applications')
          .update({ candidate_phone: updatedPhoneVal })
          .eq('id', activeCustomTestApplicationId);

        if (error) throw error;
      }

      setApplications((prev) =>
        prev.map((application) =>
          application.id === activeCustomTestApplicationId ? { ...application, candidate_phone: updatedPhoneVal } : application
        )
      );
      setCustomTestState('none');
      setSelectedCustomTestResult(customTestAnswers);
      setDrawerTestResult('CUSTOM');
    } catch (error) {
      console.error('Erro ao salvar questionario customizado:', error);
      setCustomTestErrorMessage('Erro ao enviar suas respostas. Por favor, tente novamente.');
    } finally {
      setIsSavingCustomTest(false);
    }
  };

  return {
    customTestState,
    setCustomTestState,
    activeCustomTestApplicationId,
    setActiveCustomTestApplicationId,
    customTestQuestions,
    setCustomTestQuestions,
    customTestAnswers,
    setCustomTestAnswers,
    isSavingCustomTest,
    customTestErrorMessage,
    setCustomTestErrorMessage,
    selectedCustomTestResult,
    setSelectedCustomTestResult,
    handleStartCustomTest,
    handleFinishCustomTest,
  };
};
