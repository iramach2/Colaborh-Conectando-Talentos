import { Dispatch, SetStateAction, useState } from 'react';
import type { TemperamentosQuestion } from '../data/assessmentProfiles';
import { supabase } from '../lib/supabase';
import { markAssessmentCompleted } from '../services/assessmentService';
import type {
  CandidateAssessmentDrawerKind,
  CandidateAssessmentState,
  TemperamentosCompletedResult,
  TemperamentosKey,
  TemperamentosResult,
} from '../types/candidate';
import type { CompanyApplication } from '../types/companyDashboard';
import { parseCandidatePhoneData, serializeCandidatePhoneData } from '../utils/candidatePhoneData';

interface UseCandidateTemperamentosAssessmentParams {
  applications: CompanyApplication[];
  candidateEmail?: string;
  questions: TemperamentosQuestion[];
  profiles: Record<string, unknown>;
  setApplications: Dispatch<SetStateAction<CompanyApplication[]>>;
  setDrawerTestResult: (value: CandidateAssessmentDrawerKind) => void;
}

export const useCandidateTemperamentosAssessment = ({
  applications,
  candidateEmail,
  questions,
  profiles,
  setApplications,
  setDrawerTestResult,
}: UseCandidateTemperamentosAssessmentParams) => {
  const [temperamentosState, setTemperamentosState] = useState<CandidateAssessmentState>('none');
  const [activeTemperamentosApplicationId, setActiveTemperamentosApplicationId] = useState<string | null>(null);
  const [currentTemperamentosStageIndex, setCurrentTemperamentosStageIndex] = useState<number>(0);
  const [temperamentosAnswers, setTemperamentosAnswers] = useState<Record<number, string>>({});
  const [temperamentosResult, setTemperamentosResult] = useState<TemperamentosResult | null>(null);
  const [isSavingTemperamentos, setIsSavingTemperamentos] = useState(false);
  const [temperamentosErrorMessage, setTemperamentosErrorMessage] = useState<string | null>(null);
  const [selectedTemperamentosResult, setSelectedTemperamentosResult] = useState<TemperamentosCompletedResult | null>(null);

  const handleFinishTemperamentosTest = async () => {
    const unansweredId = questions.findIndex((question) => !temperamentosAnswers[question.id]);

    if (unansweredId !== -1) {
      setTemperamentosErrorMessage(`Por favor, responda a todas as 25 questoes. A questao ${unansweredId + 1} esta pendente.`);
      return;
    }

    setTemperamentosErrorMessage(null);

    try {
      setIsSavingTemperamentos(true);

      let I = 0;
      let C = 0;
      let O = 0;
      let A = 0;

      questions.forEach((question) => {
        const choice = temperamentosAnswers[question.id];
        if (choice === 'I') I++;
        else if (choice === 'C') C++;
        else if (choice === 'O') O++;
        else if (choice === 'A') A++;
      });

      const scoreArray = [
        { key: 'I', score: I },
        { key: 'C', score: C },
        { key: 'O', score: O },
        { key: 'A', score: A },
      ].sort((a, b) => b.score - a.score);

      let finalType = scoreArray[0].key;

      if (scoreArray[0].score - scoreArray[1].score <= 1) {
        const k1 = scoreArray[0].key;
        const k2 = scoreArray[1].key;
        const comb1 = `${k1} + ${k2}`;
        const comb2 = `${k2} + ${k1}`;
        if (profiles[comb1]) {
          finalType = comb1;
        } else if (profiles[comb2]) {
          finalType = comb2;
        }
      }

      const temperamentosResultData: TemperamentosCompletedResult = {
        type: finalType,
        scores: { I, C, O, A } as Record<TemperamentosKey, number>,
        answers: questions.map((question) => ({
          q: question.id,
          choice: temperamentosAnswers[question.id],
        })),
      };

      setTemperamentosResult({ type: finalType, scores: { I, C, O, A } as Record<TemperamentosKey, number> });

      if (!import.meta.env.VITE_SUPABASE_URL || !activeTemperamentosApplicationId) {
        setTemperamentosState('none');
        setSelectedTemperamentosResult(temperamentosResultData);
        setDrawerTestResult('TEMPERAMENTOS');
        return;
      }

      const app = applications.find((application) => application.id === activeTemperamentosApplicationId);
      const parsedData = parseCandidatePhoneData(app?.candidate_phone || '');
      const temperamentosVal = `COMPLETED===${JSON.stringify(temperamentosResultData)}===DATE===${new Date().toISOString()}`;

      const updatedPhoneVal = serializeCandidatePhoneData(
        parsedData.phone,
        parsedData.disc,
        parsedData.notes,
        parsedData.questions,
        parsedData.mbti,
        temperamentosVal,
        parsedData.customTest
      );

      const assessmentSaved = await markAssessmentCompleted(
        activeTemperamentosApplicationId,
        'temperamentos',
        candidateEmail || '',
        temperamentosResultData.answers ? { answers: temperamentosResultData.answers } : {},
        temperamentosResultData
      );

      if (!assessmentSaved) {
        const { error } = await supabase
          .from('applications')
          .update({ candidate_phone: updatedPhoneVal })
          .eq('id', activeTemperamentosApplicationId);

        if (error) throw error;
      }

      setApplications((prev) =>
        prev.map((application) =>
          application.id === activeTemperamentosApplicationId ? { ...application, candidate_phone: updatedPhoneVal } : application
        )
      );
      setTemperamentosState('none');
      setSelectedTemperamentosResult(temperamentosResultData);
      setDrawerTestResult('TEMPERAMENTOS');
    } catch (error) {
      console.error('Erro ao salvar teste de temperamentos:', error);
      setTemperamentosErrorMessage('Erro ao enviar suas respostas para o banco de dados. Por favor, tente novamente.');
    } finally {
      setIsSavingTemperamentos(false);
    }
  };

  return {
    temperamentosState,
    setTemperamentosState,
    activeTemperamentosApplicationId,
    setActiveTemperamentosApplicationId,
    currentTemperamentosStageIndex,
    setCurrentTemperamentosStageIndex,
    temperamentosAnswers,
    setTemperamentosAnswers,
    temperamentosResult,
    setTemperamentosResult,
    isSavingTemperamentos,
    temperamentosErrorMessage,
    setTemperamentosErrorMessage,
    selectedTemperamentosResult,
    setSelectedTemperamentosResult,
    handleFinishTemperamentosTest,
  };
};
