import React from 'react';
import { motion } from 'motion/react';
import { Brain, Compass, FileText, Sparkles } from 'lucide-react';
import { CandidateAssessmentIntroCard } from './CandidateAssessmentIntroCard';
import { CandidateCustomAssessmentCompleted } from './CandidateCustomAssessmentCompleted';
import { CandidateCustomAssessmentStep } from './CandidateCustomAssessmentStep';
import { CandidateDiscAssessmentCompleted } from './CandidateDiscAssessmentCompleted';
import { CandidateDiscAssessmentStep } from './CandidateDiscAssessmentStep';
import { CandidateMbtiAssessmentCompleted } from './CandidateMbtiAssessmentCompleted';
import { CandidateMbtiAssessmentStep } from './CandidateMbtiAssessmentStep';
import { CandidateQuestionsAssessmentCompleted } from './CandidateQuestionsAssessmentCompleted';
import { CandidateQuestionsAssessmentStep } from './CandidateQuestionsAssessmentStep';
import { CandidateTemperamentosAssessmentCompleted } from './CandidateTemperamentosAssessmentCompleted';
import { CandidateTemperamentosAssessmentStep } from './CandidateTemperamentosAssessmentStep';
import { CandidateTestsOverviewTab } from './CandidateTestsOverviewTab';
import { MBTI_QUESTIONS, TEMPERAMENTOS_QUESTIONS } from '../../data/assessmentProfiles';
import { perguntasDISC } from '../../data/discQuestions';
import { QUESTIONS_CATEGORIES } from '../../data/profileQuestions';
import type {
  CandidateAssessmentListItem,
  CandidateAssessmentState,
  CustomQuestion,
  DiscAnswer,
  DiscResult,
  MbtiAnswer,
  MbtiCompletedResult,
  MbtiResult,
  QuestionsResult,
  TemperamentosCompletedResult,
  TemperamentosResult,
} from '../../types/candidate';

export interface CandidateTestsTabProps {
  discTestState: CandidateAssessmentState;
  setDiscTestState: (state: CandidateAssessmentState) => void;
  currentBlockIndex: number;
  setCurrentBlockIndex: (index: number) => void;
  discAnswers: DiscAnswer[];
  setDiscAnswers: (answers: DiscAnswer[]) => void;
  discErrorMessage: string | null;
  setDiscErrorMessage: (message: string | null) => void;
  resetDiscAnswers: () => void;
  handleFinishDISCTest: () => void;
  discResult: DiscResult | null;
  setDiscResult: (result: DiscResult | null) => void;
  questionsState: CandidateAssessmentState;
  setQuestionsState: (state: CandidateAssessmentState) => void;
  questionsAnswers: QuestionsResult;
  setQuestionsAnswers: (answers: QuestionsResult) => void;
  currentQuestionsCategoryIndex: number;
  setCurrentQuestionsCategoryIndex: (index: number) => void;
  questionsErrorMessage: string | null;
  setQuestionsErrorMessage: (message: string | null) => void;
  isSavingQuestions: boolean;
  handleFinishQuestions: () => void;
  selectedQuestionsResult: QuestionsResult | null;
  setSelectedQuestionsResult: (result: QuestionsResult | null) => void;
  mbtiState: CandidateAssessmentState;
  setMbtiState: (state: CandidateAssessmentState) => void;
  currentMbtiStageIndex: number;
  setCurrentMbtiStageIndex: (index: number) => void;
  mbtiAnswers: Record<number, MbtiAnswer>;
  setMbtiAnswers: (answers: Record<number, MbtiAnswer>) => void;
  mbtiErrorMessage: string | null;
  setMbtiErrorMessage: (message: string | null) => void;
  isSavingMbti: boolean;
  handleFinishMBTITest: () => void;
  mbtiResult: MbtiResult | null;
  setMbtiResult: (result: MbtiResult | null) => void;
  selectedMbtiResult: MbtiCompletedResult | null;
  setSelectedMbtiResult: (result: MbtiCompletedResult | null) => void;
  temperamentosState: CandidateAssessmentState;
  setTemperamentosState: (state: CandidateAssessmentState) => void;
  currentTemperamentosStageIndex: number;
  setCurrentTemperamentosStageIndex: (index: number) => void;
  temperamentosAnswers: Record<number, string>;
  setTemperamentosAnswers: (answers: Record<number, string>) => void;
  temperamentosErrorMessage: string | null;
  setTemperamentosErrorMessage: (message: string | null) => void;
  isSavingTemperamentos: boolean;
  handleFinishTemperamentosTest: () => void;
  temperamentosResult: TemperamentosResult | null;
  setTemperamentosResult: (result: TemperamentosResult | null) => void;
  selectedTemperamentosResult: TemperamentosCompletedResult | null;
  setSelectedTemperamentosResult: (result: TemperamentosCompletedResult | null) => void;
  customTestState: CandidateAssessmentState;
  setCustomTestState: (state: CandidateAssessmentState) => void;
  customTestQuestions: CustomQuestion[];
  customTestAnswers: Record<string, string>;
  setCustomTestAnswers: (answers: Record<string, string>) => void;
  customTestErrorMessage: string | null;
  isSavingCustomTest: boolean;
  handleFinishCustomTest: () => void;
  selectedCustomTestResult: Record<string, string> | null;
  setSelectedCustomTestResult: (result: Record<string, string> | null) => void;
  activeTestSubTab: 'pending' | 'completed';
  setActiveTestSubTab: (tab: 'pending' | 'completed') => void;
  pendingTests: CandidateAssessmentListItem[];
  completedTests: CandidateAssessmentListItem[];
  handleStartCandidateTest: (item: CandidateAssessmentListItem) => void;
  handleViewCandidateTestResult: (item: CandidateAssessmentListItem) => void;
}

export function CandidateTestsTab({
  discTestState,
  setDiscTestState,
  currentBlockIndex,
  setCurrentBlockIndex,
  discAnswers,
  setDiscAnswers,
  discErrorMessage,
  setDiscErrorMessage,
  resetDiscAnswers,
  handleFinishDISCTest,
  discResult,
  setDiscResult,
  questionsState,
  setQuestionsState,
  questionsAnswers,
  setQuestionsAnswers,
  currentQuestionsCategoryIndex,
  setCurrentQuestionsCategoryIndex,
  questionsErrorMessage,
  setQuestionsErrorMessage,
  isSavingQuestions,
  handleFinishQuestions,
  selectedQuestionsResult,
  setSelectedQuestionsResult,
  mbtiState,
  setMbtiState,
  currentMbtiStageIndex,
  setCurrentMbtiStageIndex,
  mbtiAnswers,
  setMbtiAnswers,
  mbtiErrorMessage,
  setMbtiErrorMessage,
  isSavingMbti,
  handleFinishMBTITest,
  mbtiResult,
  setMbtiResult,
  selectedMbtiResult,
  setSelectedMbtiResult,
  temperamentosState,
  setTemperamentosState,
  currentTemperamentosStageIndex,
  setCurrentTemperamentosStageIndex,
  temperamentosAnswers,
  setTemperamentosAnswers,
  temperamentosErrorMessage,
  setTemperamentosErrorMessage,
  isSavingTemperamentos,
  handleFinishTemperamentosTest,
  temperamentosResult,
  setTemperamentosResult,
  selectedTemperamentosResult,
  setSelectedTemperamentosResult,
  customTestState,
  setCustomTestState,
  customTestQuestions,
  customTestAnswers,
  setCustomTestAnswers,
  customTestErrorMessage,
  isSavingCustomTest,
  handleFinishCustomTest,
  selectedCustomTestResult,
  setSelectedCustomTestResult,
  activeTestSubTab,
  setActiveTestSubTab,
  pendingTests,
  completedTests,
  handleStartCandidateTest,
  handleViewCandidateTestResult
}: CandidateTestsTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {(() => {
        if (discTestState === 'taking') {
          return (
            <CandidateDiscAssessmentStep
              perguntasDISC={perguntasDISC}
              currentBlockIndex={currentBlockIndex}
              setCurrentBlockIndex={setCurrentBlockIndex}
              discAnswers={discAnswers}
              setDiscAnswers={setDiscAnswers}
              discErrorMessage={discErrorMessage}
              setDiscErrorMessage={setDiscErrorMessage}
              handleFinishDISCTest={handleFinishDISCTest}
            />
          );
        }
        if (discTestState === 'initial') {
          return (
            <CandidateAssessmentIntroCard
              icon={<Brain size={44} />}
              title="Teste de Perfil Comportamental DISC 5.0"
              description={(
                <>
                  Este teste mapeia suas características comportamentais em quatro dimensões: <strong>Dominância</strong>, <strong>Influência</strong>, <strong>Estabilidade</strong> e <strong>Conformidade</strong>. Com isso, conseguimos entender melhor seus pontos fortes e como você se comunica no trabalho.
                </>
              )}
              instructions={[
                'O teste ? composto por 25 blocos com 4 alternativas cada.',
                <span>Para cada bloco, enumere as alternativas de <strong>1 a 4</strong>, onde 4 ? a op??o que MAIS identifica voc? e 1 ? a que MENOS identifica.</span>,
                'Seja honesto e responda pensando em como você age no ambiente de trabalho.',
                'Não há perfil certo ou errado. Todos possuem um valor único!'
              ]}
              startLabel="Começar Avaliação"
              onBack={() => setDiscTestState('none')}
              onStart={() => {
                resetDiscAnswers();
                setDiscTestState('taking');
              }}
            />
          );
        }
        if (discTestState === 'completed' && discResult) {
          return (
            <CandidateDiscAssessmentCompleted
              discResult={discResult}
              onBackToTests={() => {
                setDiscTestState('none');
                setDiscResult(null);
              }}
            />
          );
        }
        if (questionsState === 'initial') {
          return (
            <CandidateAssessmentIntroCard
              icon={<FileText size={44} />}
              title="Mapeamento de Perfil"
              description="Este teste de mapeamento de perfil foi solicitado pela empresa parceira para entender melhor sua trajetória profissional, conquistas, capacidade de entrega e competências comportamentais."
              instructions={[
                'O mapeamento é composto por 20 perguntas de cunho descritivo.',
                'Está dividido em 4 categorias temáticas (5 perguntas em cada).',
                <span>Cada resposta deve ter no mínimo <strong>10 caracteres</strong> para ser válida.</span>,
                'Você pode avançar entre as páginas após preencher as perguntas da etapa atual.',
                'Suas respostas ajudam o recrutador a avaliar seu alinhamento com a cultura da vaga. Dedique um tempo para detalhar suas respostas.'
              ]}
              startLabel="Começar Mapeamento"
              onBack={() => setQuestionsState('none')}
              onStart={() => {
                const initialAnswers: Record<number, string> = {};
                for (let i = 0; i < 20; i++) {
                  initialAnswers[i] = questionsAnswers[i] || '';
                }
                setQuestionsAnswers(initialAnswers);
                setCurrentQuestionsCategoryIndex(0);
                setQuestionsState('taking');
              }}
            />
          );
        }
        if (questionsState === 'taking') {
          return (
            <CandidateQuestionsAssessmentStep
              questionsCategories={QUESTIONS_CATEGORIES}
              currentQuestionsCategoryIndex={currentQuestionsCategoryIndex}
              setCurrentQuestionsCategoryIndex={setCurrentQuestionsCategoryIndex}
              questionsAnswers={questionsAnswers}
              setQuestionsAnswers={setQuestionsAnswers}
              questionsErrorMessage={questionsErrorMessage}
              setQuestionsErrorMessage={setQuestionsErrorMessage}
              isSavingQuestions={isSavingQuestions}
              setQuestionsState={setQuestionsState}
              handleFinishQuestions={handleFinishQuestions}
            />
          );
        }
        if (questionsState === 'completed' && selectedQuestionsResult) {
          return (
            <CandidateQuestionsAssessmentCompleted
              questionsCategories={QUESTIONS_CATEGORIES}
              currentQuestionsCategoryIndex={currentQuestionsCategoryIndex}
              setCurrentQuestionsCategoryIndex={setCurrentQuestionsCategoryIndex}
              selectedQuestionsResult={selectedQuestionsResult}
              onBackToTests={() => {
                setQuestionsState('none');
                setSelectedQuestionsResult(null);
              }}
            />
          );
        }
        if (mbtiState === 'initial') {
          return (
            <CandidateAssessmentIntroCard
              icon={<Sparkles size={44} />}
              title="Teste de Personalidade MBTI"
              description="Este teste baseia-se na teoria dos tipos psicológicos de Carl Jung e no indicador MBTI. Ele identifica suas preferências em 4 dimensões básicas: Extroversão/Introversão, Sensação/Intuição, Pensamento/Sentimento e Julgamento/Percepção, revelando um perfil de 4 letras."
              instructions={[
                <span>O teste é composto por <strong>64 perguntas</strong> divididas em <strong>8 etapas</strong> (8 perguntas por etapa).</span>,
                <span>Em cada pergunta, atribua uma nota de <strong>0 a 3</strong> para ambas as alternativas (Opção A e Opção B).</span>,
                <span>A escala de avaliação é:<br />⬢ <strong>3</strong> = se parece muito comigo<br />⬢ <strong>2</strong> = se parece razoavelmente<br />⬢ <strong>1</strong> = se parece pouco<br />⬢ <strong>0</strong> = não se parece nada comigo</span>,
                'Você avalia cada alternativa independentemente. Seja o mais espontâneo e sincero possível!'
              ]}
              startLabel="Começar Teste MBTI"
              onBack={() => setMbtiState('none')}
              onStart={() => {
                setMbtiAnswers({});
                setCurrentMbtiStageIndex(0);
                setMbtiState('taking');
              }}
            />
          );
        }
        if (mbtiState === 'taking') {
          return (
            <CandidateMbtiAssessmentStep
              mbtiQuestions={MBTI_QUESTIONS}
              currentMbtiStageIndex={currentMbtiStageIndex}
              setCurrentMbtiStageIndex={setCurrentMbtiStageIndex}
              mbtiAnswers={mbtiAnswers}
              setMbtiAnswers={setMbtiAnswers}
              mbtiErrorMessage={mbtiErrorMessage}
              setMbtiErrorMessage={setMbtiErrorMessage}
              isSavingMbti={isSavingMbti}
              setMbtiState={setMbtiState}
              handleFinishMBTITest={handleFinishMBTITest}
            />
          );
        }
        if (mbtiState === 'completed' && (mbtiResult || selectedMbtiResult)) {
          return (
            <CandidateMbtiAssessmentCompleted
              mbtiResult={mbtiResult}
              selectedMbtiResult={selectedMbtiResult}
              onBackToTests={() => {
                setMbtiState('none');
                setMbtiResult(null);
                setSelectedMbtiResult(null);
              }}
            />
          );
        }
        if (temperamentosState === 'initial') {
          return (
            <CandidateAssessmentIntroCard
              icon={<Compass size={44} />}
              title="Teste de Temperamentos e Perfil Comportamental"
              description="Este teste mapeia suas preferências e estilo comportamental predominante com base em 4 perfis fundamentais: Idealista/Criativo (I), Comunicador/Relacional (C), Organizador/Analítico (O) e Executor/Dominante (A)."
              instructions={[
                <span>O teste é composto por <strong>25 perguntas</strong> divididas em <strong>5 etapas</strong> (5 perguntas por etapa).</span>,
                <span>Para cada pergunta, escolha <strong>apenas UMA</strong> alternativa que melhor descreve seu comportamento.</span>,
                'Não há respostas certas ou erradas. Responda de forma sincera e espontânea para obter um resultado fiel ao seu estilo natural!'
              ]}
              startLabel="Começar Avaliação"
              onBack={() => setTemperamentosState('none')}
              onStart={() => {
                setTemperamentosAnswers({});
                setCurrentTemperamentosStageIndex(0);
                setTemperamentosState('taking');
              }}
            />
          );
        }
        if (temperamentosState === 'taking') {
          return (
            <CandidateTemperamentosAssessmentStep
              temperamentosQuestions={TEMPERAMENTOS_QUESTIONS}
              currentTemperamentosStageIndex={currentTemperamentosStageIndex}
              setCurrentTemperamentosStageIndex={setCurrentTemperamentosStageIndex}
              temperamentosAnswers={temperamentosAnswers}
              setTemperamentosAnswers={setTemperamentosAnswers}
              temperamentosErrorMessage={temperamentosErrorMessage}
              setTemperamentosErrorMessage={setTemperamentosErrorMessage}
              isSavingTemperamentos={isSavingTemperamentos}
              setTemperamentosState={setTemperamentosState}
              handleFinishTemperamentosTest={handleFinishTemperamentosTest}
            />
          );
        }
        if (temperamentosState === 'completed' && (temperamentosResult || selectedTemperamentosResult)) {
          return (
            <CandidateTemperamentosAssessmentCompleted
              temperamentosResult={temperamentosResult}
              selectedTemperamentosResult={selectedTemperamentosResult}
              onBackToTests={() => {
                setTemperamentosState('none');
                setTemperamentosResult(null);
                setSelectedTemperamentosResult(null);
              }}
            />
          );
        }
        if (customTestState === 'initial') {
          return (
            <CandidateAssessmentIntroCard
              icon={<FileText size={44} />}
              title="Questionário Customizado"
              description="Este questionário foi elaborado especificamente pela equipe de recrutamento para entender melhor sua adequação aos requisitos específicos desta vaga."
              instructions={[
                <span>Total de perguntas: <strong>{customTestQuestions.length}</strong>.</span>,
                'Responda de forma objetiva e sincera.',
                'Todas as perguntas são de preenchimento obrigatório.',
                'Suas respostas serão encaminhadas diretamente aos recrutadores do processo seletivo.'
              ]}
              startLabel="Iniciar Questionário"
              onBack={() => setCustomTestState('none')}
              onStart={() => setCustomTestState('taking')}
            />
          );
        }
        if (customTestState === 'taking') {
          return (
            <CandidateCustomAssessmentStep
              customTestQuestions={customTestQuestions}
              customTestAnswers={customTestAnswers}
              setCustomTestAnswers={setCustomTestAnswers}
              customTestErrorMessage={customTestErrorMessage}
              isSavingCustomTest={isSavingCustomTest}
              setCustomTestState={setCustomTestState}
              handleFinishCustomTest={handleFinishCustomTest}
            />
          );
        }
        if (customTestState === 'completed' && selectedCustomTestResult) {
          return (
            <CandidateCustomAssessmentCompleted
              customTestQuestions={customTestQuestions}
              selectedCustomTestResult={selectedCustomTestResult}
              onBackToTests={() => {
                setCustomTestState('none');
                setSelectedCustomTestResult(null);
              }}
            />
          );
        }
        return (
          <CandidateTestsOverviewTab
            activeTestSubTab={activeTestSubTab}
            setActiveTestSubTab={setActiveTestSubTab}
            pendingTests={pendingTests}
            completedTests={completedTests}
            onStartTest={handleStartCandidateTest}
            onViewResult={handleViewCandidateTestResult}
          />
        );
      })()}
    </motion.div>
  );
}
