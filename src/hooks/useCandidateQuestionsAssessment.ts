import { Dispatch, SetStateAction, useState } from 'react';
import { supabase } from '../lib/supabase';
import { markAssessmentCompleted } from '../services/assessmentService';
import type { CandidateAssessmentDrawerKind, CandidateAssessmentState, QuestionsResult } from '../types/candidate';
import type { CompanyApplication } from '../types/companyDashboard';
import { parseCandidatePhoneData, serializeCandidatePhoneData } from '../utils/candidatePhoneData';

interface UseCandidateQuestionsAssessmentParams {
  applications: CompanyApplication[];
  candidateEmail?: string;
  questionsList: string[];
  setApplications: Dispatch<SetStateAction<CompanyApplication[]>>;
  setDrawerTestResult: (value: CandidateAssessmentDrawerKind) => void;
}

export const useCandidateQuestionsAssessment = ({
  applications,
  candidateEmail,
  questionsList,
  setApplications,
  setDrawerTestResult,
}: UseCandidateQuestionsAssessmentParams) => {
  const [questionsState, setQuestionsState] = useState<CandidateAssessmentState>('none');
  const [activeQuestionsApplicationId, setActiveQuestionsApplicationId] = useState<string | null>(null);
  const [questionsAnswers, setQuestionsAnswers] = useState<QuestionsResult>({});
  const [currentQuestionsCategoryIndex, setCurrentQuestionsCategoryIndex] = useState<number>(0);
  const [isSavingQuestions, setIsSavingQuestions] = useState(false);
  const [questionsErrorMessage, setQuestionsErrorMessage] = useState<string | null>(null);
  const [selectedQuestionsResult, setSelectedQuestionsResult] = useState<QuestionsResult | null>(null);

  const handleFinishQuestions = async () => {
    const emptyQuestionIndex = questionsList.findIndex((_, index) => {
      const response = questionsAnswers[index];
      return !response || response.trim().length < 10;
    });

    if (emptyQuestionIndex !== -1) {
      setQuestionsErrorMessage(`Por favor, responda de forma descritiva a todas as 20 perguntas. A pergunta ${emptyQuestionIndex + 1} esta em branco ou com resposta muito curta (minimo 10 caracteres).`);
      return;
    }

    if (!import.meta.env.VITE_SUPABASE_URL || !activeQuestionsApplicationId) {
      setQuestionsState('none');
      setDrawerTestResult('QUESTIONS');
      return;
    }

    try {
      setIsSavingQuestions(true);
      setQuestionsErrorMessage(null);

      const app = applications.find((application) => application.id === activeQuestionsApplicationId);
      const parsedData = parseCandidatePhoneData(app?.candidate_phone || '');
      const jsonResponses = JSON.stringify(questionsAnswers);
      const questionsVal = `COMPLETED===${jsonResponses}===DATE===${new Date().toISOString()}`;

      const updatedPhoneVal = serializeCandidatePhoneData(
        parsedData.phone,
        parsedData.disc,
        parsedData.notes,
        questionsVal,
        parsedData.mbti,
        parsedData.temperamentos,
        parsedData.customTest
      );

      const assessmentSaved = await markAssessmentCompleted(
        activeQuestionsApplicationId,
        'questions',
        candidateEmail || '',
        { answers: questionsAnswers },
        { answers: questionsAnswers }
      );

      if (!assessmentSaved) {
        const { error } = await supabase
          .from('applications')
          .update({ candidate_phone: updatedPhoneVal })
          .eq('id', activeQuestionsApplicationId);

        if (error) throw error;
      }

      setApplications((prev) =>
        prev.map((application) =>
          application.id === activeQuestionsApplicationId ? { ...application, candidate_phone: updatedPhoneVal } : application
        )
      );
      setQuestionsState('none');
      setSelectedQuestionsResult(questionsAnswers);
      setDrawerTestResult('QUESTIONS');
    } catch (error) {
      console.error('Erro ao salvar questionario:', error);
      setQuestionsErrorMessage('Erro ao enviar suas respostas para o banco de dados. Por favor, tente novamente.');
    } finally {
      setIsSavingQuestions(false);
    }
  };

  return {
    questionsState,
    setQuestionsState,
    activeQuestionsApplicationId,
    setActiveQuestionsApplicationId,
    questionsAnswers,
    setQuestionsAnswers,
    currentQuestionsCategoryIndex,
    setCurrentQuestionsCategoryIndex,
    isSavingQuestions,
    questionsErrorMessage,
    setQuestionsErrorMessage,
    selectedQuestionsResult,
    setSelectedQuestionsResult,
    handleFinishQuestions,
  };
};
