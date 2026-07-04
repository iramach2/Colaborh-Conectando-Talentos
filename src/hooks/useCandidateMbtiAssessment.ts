import { Dispatch, SetStateAction, useState } from 'react';
import type { MbtiQuestion } from '../data/assessmentProfiles';
import { supabase } from '../lib/supabase';
import { markAssessmentCompleted } from '../services/assessmentService';
import type {
  CandidateAssessmentDrawerKind,
  CandidateAssessmentState,
  MbtiAnswer,
  MbtiCompletedResult,
  MbtiDimension,
  MbtiResult,
} from '../types/candidate';
import type { CompanyApplication } from '../types/companyDashboard';
import { parseCandidatePhoneData, serializeCandidatePhoneData } from '../utils/candidatePhoneData';

interface UseCandidateMbtiAssessmentParams {
  applications: CompanyApplication[];
  candidateEmail?: string;
  questions: MbtiQuestion[];
  setApplications: Dispatch<SetStateAction<CompanyApplication[]>>;
  setDrawerTestResult: (value: CandidateAssessmentDrawerKind) => void;
}

export const useCandidateMbtiAssessment = ({
  applications,
  candidateEmail,
  questions,
  setApplications,
  setDrawerTestResult,
}: UseCandidateMbtiAssessmentParams) => {
  const [mbtiState, setMbtiState] = useState<CandidateAssessmentState>('none');
  const [activeMbtiApplicationId, setActiveMbtiApplicationId] = useState<string | null>(null);
  const [currentMbtiStageIndex, setCurrentMbtiStageIndex] = useState<number>(0);
  const [mbtiAnswers, setMbtiAnswers] = useState<Record<number, MbtiAnswer>>({});
  const [mbtiResult, setMbtiResult] = useState<MbtiResult | null>(null);
  const [isSavingMbti, setIsSavingMbti] = useState(false);
  const [mbtiErrorMessage, setMbtiErrorMessage] = useState<string | null>(null);
  const [selectedMbtiResult, setSelectedMbtiResult] = useState<MbtiCompletedResult | null>(null);

  const handleFinishMBTITest = async () => {
    const unansweredId = questions.findIndex((question) => {
      const answer = mbtiAnswers[question.id];
      return !answer || answer.a === null || answer.b === null;
    });

    if (unansweredId !== -1) {
      setMbtiErrorMessage(`Por favor, responda a todas as 64 questoes. A questao ${unansweredId + 1} esta com respostas pendentes.`);
      return;
    }

    setMbtiErrorMessage(null);

    try {
      setIsSavingMbti(true);

      let E = 0;
      let I = 0;
      let S = 0;
      let N = 0;
      let T = 0;
      let F = 0;
      let J = 0;
      let P = 0;

      questions.forEach((question) => {
        const answer = mbtiAnswers[question.id];
        const valA = answer.a ?? 0;
        const valB = answer.b ?? 0;

        if (question.optionA.dimension === 'E') E += valA;
        else if (question.optionA.dimension === 'I') I += valA;
        else if (question.optionA.dimension === 'S') S += valA;
        else if (question.optionA.dimension === 'N') N += valA;
        else if (question.optionA.dimension === 'T') T += valA;
        else if (question.optionA.dimension === 'F') F += valA;
        else if (question.optionA.dimension === 'J') J += valA;
        else if (question.optionA.dimension === 'P') P += valA;

        if (question.optionB.dimension === 'E') E += valB;
        else if (question.optionB.dimension === 'I') I += valB;
        else if (question.optionB.dimension === 'S') S += valB;
        else if (question.optionB.dimension === 'N') N += valB;
        else if (question.optionB.dimension === 'T') T += valB;
        else if (question.optionB.dimension === 'F') F += valB;
        else if (question.optionB.dimension === 'J') J += valB;
        else if (question.optionB.dimension === 'P') P += valB;
      });

      let typeResult = '';
      typeResult += E >= I ? 'E' : 'I';
      typeResult += S >= N ? 'S' : 'N';
      typeResult += T >= F ? 'T' : 'F';
      typeResult += J >= P ? 'J' : 'P';

      const mbtiResultData: MbtiCompletedResult = {
        type: typeResult,
        scores: { E, I, S, N, T, F, J, P } as Record<MbtiDimension, number>,
        answers: questions.map((question) => ({
          q: question.id,
          a: mbtiAnswers[question.id]?.a ?? 0,
          b: mbtiAnswers[question.id]?.b ?? 0,
        })),
      };

      setMbtiResult({ type: typeResult, scores: { E, I, S, N, T, F, J, P } as Record<MbtiDimension, number> });

      if (!import.meta.env.VITE_SUPABASE_URL || !activeMbtiApplicationId) {
        setMbtiState('none');
        setSelectedMbtiResult(mbtiResultData);
        setDrawerTestResult('MBTI');
        return;
      }

      const app = applications.find((application) => application.id === activeMbtiApplicationId);
      const parsedData = parseCandidatePhoneData(app?.candidate_phone || '');
      const mbtiVal = `COMPLETED===${JSON.stringify(mbtiResultData)}===DATE===${new Date().toISOString()}`;

      const updatedPhoneVal = serializeCandidatePhoneData(
        parsedData.phone,
        parsedData.disc,
        parsedData.notes,
        parsedData.questions,
        mbtiVal,
        parsedData.temperamentos,
        parsedData.customTest
      );

      const assessmentSaved = await markAssessmentCompleted(
        activeMbtiApplicationId,
        'mbti',
        candidateEmail || '',
        mbtiResultData.answers ? { answers: mbtiResultData.answers } : {},
        mbtiResultData
      );

      if (!assessmentSaved) {
        const { error } = await supabase
          .from('applications')
          .update({ candidate_phone: updatedPhoneVal })
          .eq('id', activeMbtiApplicationId);

        if (error) throw error;
      }

      setApplications((prev) =>
        prev.map((application) =>
          application.id === activeMbtiApplicationId ? { ...application, candidate_phone: updatedPhoneVal } : application
        )
      );
      setMbtiState('none');
      setSelectedMbtiResult(mbtiResultData);
      setDrawerTestResult('MBTI');
    } catch (error) {
      console.error('Erro ao salvar questionario MBTI:', error);
      setMbtiErrorMessage('Erro ao enviar suas respostas para o banco de dados. Por favor, tente novamente.');
    } finally {
      setIsSavingMbti(false);
    }
  };

  return {
    mbtiState,
    setMbtiState,
    activeMbtiApplicationId,
    setActiveMbtiApplicationId,
    currentMbtiStageIndex,
    setCurrentMbtiStageIndex,
    mbtiAnswers,
    setMbtiAnswers,
    mbtiResult,
    setMbtiResult,
    isSavingMbti,
    mbtiErrorMessage,
    setMbtiErrorMessage,
    selectedMbtiResult,
    setSelectedMbtiResult,
    handleFinishMBTITest,
  };
};
