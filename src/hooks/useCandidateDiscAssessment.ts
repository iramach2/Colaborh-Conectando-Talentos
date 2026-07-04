import { Dispatch, SetStateAction, useState } from 'react';
import { supabase } from '../lib/supabase';
import { markAssessmentCompleted } from '../services/assessmentService';
import type { CandidateAssessmentDrawerKind, DiscAnswer, DiscResult } from '../types/candidate';
import type { CompanyApplication } from '../types/companyDashboard';
import { parseCandidatePhoneData, serializeCandidatePhoneData } from '../utils/candidatePhoneData';

const initialDiscAnswers = () => (
  Array.from({ length: 25 }, () => ({ D: null, I: null, S: null, C: null }))
);

interface UseCandidateDiscAssessmentParams {
  applications: CompanyApplication[];
  candidateEmail?: string;
  setApplications: Dispatch<SetStateAction<CompanyApplication[]>>;
  setDrawerTestResult: (value: CandidateAssessmentDrawerKind) => void;
}

export const useCandidateDiscAssessment = ({
  applications,
  candidateEmail,
  setApplications,
  setDrawerTestResult,
}: UseCandidateDiscAssessmentParams) => {
  const [discTestState, setDiscTestState] = useState<'initial' | 'taking' | 'completed' | 'none'>('none');
  const [currentBlockIndex, setCurrentBlockIndex] = useState<number>(0);
  const [discAnswers, setDiscAnswers] = useState<DiscAnswer[]>(initialDiscAnswers());
  const [discResult, setDiscResult] = useState<DiscResult | null>(null);
  const [activeTestApplicationId, setActiveTestApplicationId] = useState<string | null>(null);
  const [discErrorMessage, setDiscErrorMessage] = useState<string | null>(null);

  const resetDiscAnswers = () => {
    setDiscAnswers(initialDiscAnswers());
    setCurrentBlockIndex(0);
  };

  const handleFinishDISCTest = async () => {
    const unanswered = discAnswers.findIndex((answer) =>
      answer.D === null || answer.I === null || answer.S === null || answer.C === null
    );

    if (unanswered !== -1) {
      setDiscErrorMessage(`Por favor, responda a todas as 25 questoes. A questao ${unanswered + 1} esta pendente.`);
      return;
    }

    setDiscErrorMessage(null);

    let D = 0;
    let I = 0;
    let S = 0;
    let C = 0;

    discAnswers.forEach((answer) => {
      D += answer.D || 0;
      I += answer.I || 0;
      S += answer.S || 0;
      C += answer.C || 0;
    });

    const dPct = Math.min(100, Math.max(0, D));
    const iPct = Math.min(100, Math.max(0, I));
    const sPct = Math.min(100, Math.max(0, S));
    const cPct = Math.min(100, Math.max(0, C));
    const result = { D: dPct, I: iPct, S: sPct, C: cPct };

    setDiscResult(result);

    if (!import.meta.env.VITE_SUPABASE_URL || !activeTestApplicationId) {
      setDiscTestState('none');
      setDrawerTestResult('DISC');
      return;
    }

    try {
      const app = applications.find((application) => application.id === activeTestApplicationId);
      const parsedData = parseCandidatePhoneData(app?.candidate_phone || '');
      const discVal = `COMPLETED===${dPct},${iPct},${sPct},${cPct}===DATE===${new Date().toISOString()}`;

      const serializedDISC = serializeCandidatePhoneData(
        parsedData.phone,
        discVal,
        parsedData.notes,
        parsedData.questions,
        parsedData.mbti,
        parsedData.temperamentos,
        parsedData.customTest
      );

      const assessmentSaved = await markAssessmentCompleted(
        activeTestApplicationId,
        'disc',
        candidateEmail || '',
        { answers: discAnswers },
        result
      );

      if (!assessmentSaved) {
        const { error } = await supabase
          .from('applications')
          .update({ candidate_phone: serializedDISC })
          .eq('id', activeTestApplicationId);

        if (error) throw error;
      }

      setApplications((prev) =>
        prev.map((application) =>
          application.id === activeTestApplicationId ? { ...application, candidate_phone: serializedDISC } : application
        )
      );
      setDiscTestState('none');
      setDrawerTestResult('DISC');
    } catch (error) {
      console.error('Erro ao salvar resultado do teste DISC:', error);
      setDiscErrorMessage('Erro ao enviar suas respostas para o banco de dados. Por favor, tente novamente.');
    }
  };

  return {
    discTestState,
    setDiscTestState,
    currentBlockIndex,
    setCurrentBlockIndex,
    discAnswers,
    setDiscAnswers,
    discResult,
    setDiscResult,
    activeTestApplicationId,
    setActiveTestApplicationId,
    discErrorMessage,
    setDiscErrorMessage,
    resetDiscAnswers,
    handleFinishDISCTest,
  };
};
