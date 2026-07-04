import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import type { CustomQuestionnaire } from '../../services/customQuestionnaireService';
import type { CompanyApplication } from '../../types/companyDashboard';
import { parseCandidatePhoneData } from '../../utils/companyDashboardUtils';

interface CompanyAssessmentSubnavProps {
  isVisible: boolean;
  companyApplications: CompanyApplication[];
  customTemplates: CustomQuestionnaire[];
  resultsSubTab: 'relatorios' | 'guia' | 'criar';
  setResultsSubTab: (tab: 'relatorios' | 'guia' | 'criar') => void;
  onStartNewTemplate: () => void;
}

export const CompanyAssessmentSubnav = ({
  isVisible,
  companyApplications,
  customTemplates,
  resultsSubTab,
  setResultsSubTab,
  onStartNewTemplate
}: CompanyAssessmentSubnavProps) => {
  if (!isVisible) return null;

  const candidatesWithTestsCount = companyApplications.map(app => {
    const phoneStr = app.candidate_phone || '';
    const parsedData = parseCandidatePhoneData(phoneStr);
    const discStatus = parsedData.disc ? (parsedData.disc.startsWith('COMPLETED===') ? 'COMPLETED' : parsedData.disc === 'PENDING' ? 'PENDING' : 'NONE') : 'NONE';
    const mbtiStatus = parsedData.mbti ? (parsedData.mbti.startsWith('COMPLETED===') ? 'COMPLETED' : parsedData.mbti === 'PENDING' ? 'PENDING' : 'NONE') : 'NONE';
    const questionsStatus = parsedData.questions ? (parsedData.questions.startsWith('COMPLETED===') ? 'COMPLETED' : parsedData.questions === 'PENDING' ? 'PENDING' : 'NONE') : 'NONE';
    const temperamentosStatus = parsedData.temperamentos ? (parsedData.temperamentos.startsWith('COMPLETED===') ? 'COMPLETED' : parsedData.temperamentos === 'PENDING' ? 'PENDING' : 'NONE') : 'NONE';
    const customTestStatus = parsedData.customTest ? (parsedData.customTest.startsWith('COMPLETED===') ? 'COMPLETED' : parsedData.customTest === 'PENDING' ? 'PENDING' : 'NONE') : 'NONE';

    return {
      discStatus,
      mbtiStatus,
      questionsStatus,
      temperamentosStatus,
      customTestStatus
    };
  }).filter(candidate =>
    candidate.discStatus !== 'NONE' ||
    candidate.mbtiStatus !== 'NONE' ||
    candidate.questionsStatus !== 'NONE' ||
    candidate.temperamentosStatus !== 'NONE' ||
    candidate.customTestStatus !== 'NONE'
  ).length;

  const tabs = [
    { id: 'relatorios' as const, label: 'Relatórios', count: candidatesWithTestsCount },
    { id: 'criar' as const, label: 'Biblioteca de testes', count: customTemplates.length },
    { id: 'guia' as const, label: 'Guia de testes', count: 4 }
  ];

  return (
    <div className="company-dashboard-surface flex w-full items-center justify-between gap-4 bg-transparent">
      <div className="-mx-4 flex items-center gap-3 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
        {tabs.map((tab) => {
          const isActive = resultsSubTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setResultsSubTab(tab.id)}
              className={`relative flex h-[38px] min-w-[150px] shrink-0 items-center justify-center gap-2 bg-transparent px-4 py-2 text-[12px] font-semibold transition-colors sm:shrink ${
                isActive
                  ? 'text-[#940dff]'
                  : 'text-slate-500 hover:text-[#940dff]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[11px] font-semibold ${isActive ? 'text-current' : 'text-slate-400'}`}>
                {tab.count}
              </span>
              {isActive && (
                <motion.span
                  layoutId="company-assessments-tab-underline"
                  className="absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-[#940dff]"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onStartNewTemplate}
        className="hidden h-8 shrink-0 items-center gap-2 rounded-xl bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95 sm:flex"
      >
        <Plus size={14} className="stroke-[2.5]" />
        Criar questionário
      </button>


      <button
        type="button"
        onClick={onStartNewTemplate}
        className="fixed bottom-5 right-5 z-[80] flex h-12 w-12 items-center justify-center rounded-full border border-[#940dff] bg-[#940dff] text-white shadow-[0_14px_30px_rgba(148,13,255,0.28)] transition-all hover:bg-[#8200e6] active:scale-95 sm:hidden"
        title="Criar questionário"
        aria-label="Criar questionário"
      >
        <Plus size={22} className="stroke-[2.5]" />
      </button>
    </div>
  );
};