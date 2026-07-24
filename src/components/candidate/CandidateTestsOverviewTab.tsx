import { Dispatch, SetStateAction } from 'react';
import { Award, Brain, CheckCircle2, Compass, FileText, Sparkles, type LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import type { CandidateAssessmentKind, CandidateAssessmentListItem } from '../../types/candidate';

interface CandidateTestsOverviewTabProps {
  activeTestSubTab: 'pending' | 'completed';
  setActiveTestSubTab: Dispatch<SetStateAction<'pending' | 'completed'>>;
  pendingTests: CandidateAssessmentListItem[];
  completedTests: CandidateAssessmentListItem[];
  onStartTest: (item: CandidateAssessmentListItem) => void;
  onViewResult: (item: CandidateAssessmentListItem) => void;
}

type TestVisual = {
  title: string;
  completedTitle: string;
  Icon: LucideIcon;
  color: string;
  soft: string;
  border: string;
};

const TEST_VISUALS: Record<CandidateAssessmentKind, TestVisual> = {
  DISC: {
    title: 'Teste de Perfil DISC 5.0',
    completedTitle: 'DISC 5.0 concluído',
    Icon: Brain,
    color: '#63e1a5',
    soft: 'rgba(99, 225, 165, 0.14)',
    border: 'rgba(99, 225, 165, 0.26)',
  },
  MBTI: {
    title: 'Teste de Personalidade MBTI',
    completedTitle: 'MBTI concluído',
    Icon: Sparkles,
    color: '#533af6',
    soft: 'rgba(83, 58, 246, 0.12)',
    border: 'rgba(83, 58, 246, 0.22)',
  },
  TEMPERAMENTOS: {
    title: 'Teste de Temperamentos e Perfil',
    completedTitle: 'Temperamentos concluído',
    Icon: Compass,
    color: '#ff4b8c',
    soft: 'rgba(255, 75, 140, 0.10)',
    border: 'rgba(255, 75, 140, 0.22)',
  },
  CUSTOM: {
    title: 'Questionário Customizado',
    completedTitle: 'Questionário Customizado concluído',
    Icon: FileText,
    color: '#940dff',
    soft: '#f3e5ff',
    border: 'rgba(148, 13, 255, 0.18)',
  },
  QUESTIONS: {
    title: 'Mapeamento de Perfil',
    completedTitle: 'Mapeamento de Perfil concluído',
    Icon: FileText,
    color: '#ffa303',
    soft: 'rgba(255, 194, 75, 0.16)',
    border: 'rgba(255, 194, 75, 0.26)',
  },
};

function getVisual(type: CandidateAssessmentKind) {
  return TEST_VISUALS[type] || TEST_VISUALS.QUESTIONS;
}

function getPendingDescription(item: CandidateAssessmentListItem) {
  if (item.type === 'DISC') return `Solicitado por ${item.companyName}. Responda para mapear seu perfil comportamental e prosseguir no processo seletivo.`;
  if (item.type === 'MBTI') return `Solicitado por ${item.companyName}. Responda ao teste de 65 perguntas para mapear suas dimensões de personalidade.`;
  if (item.type === 'TEMPERAMENTOS') return `Solicitado por ${item.companyName}. Responda ao teste de 25 perguntas para mapear seu perfil comportamental e de temperamento.`;
  if (item.type === 'CUSTOM') return `Solicitado por ${item.companyName}. Responda ao questionário específico criado para esta vaga.`;
  return `Solicitado por ${item.companyName}. Responda ao mapeamento de perfil de 20 perguntas para prosseguir no processo seletivo.`;
}

function getCompletedDescription(item: CandidateAssessmentListItem) {
  if (item.type === 'DISC') return `Avaliação de perfil comportamental concluída com sucesso para a vaga da ${item.companyName}.`;
  if (item.type === 'MBTI') return `Teste de dimensões de personalidade concluído com sucesso para a vaga da ${item.companyName}.`;
  if (item.type === 'TEMPERAMENTOS') return `Teste de temperamentos e perfil comportamental concluído com sucesso para a vaga da ${item.companyName}.`;
  if (item.type === 'CUSTOM') return `Questionário customizado respondido com sucesso para a vaga da ${item.companyName}.`;
  return `Mapeamento de perfil descritivo concluído com sucesso para a vaga da ${item.companyName}.`;
}

export function CandidateTestsOverviewTab({
  activeTestSubTab,
  setActiveTestSubTab,
  pendingTests,
  completedTests,
  onStartTest,
  onViewResult,
}: CandidateTestsOverviewTabProps) {
  const tabs = [
    { id: 'pending' as const, label: 'Pendentes', count: pendingTests.length, activeClass: 'text-[#ffa303]', underlineClass: 'bg-[#ffc24b]' },
    { id: 'completed' as const, label: 'Concluídos', count: completedTests.length, activeClass: 'text-[#2f9f6b]', underlineClass: 'bg-[#63e1a5]' },
  ];
  const visibleTests = activeTestSubTab === 'pending' ? pendingTests : completedTests;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex min-h-[38px] flex-wrap items-center gap-5">
        {tabs.map((tab) => {
          const isActive = activeTestSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTestSubTab(tab.id)}
              className={`relative flex h-[38px] min-w-[150px] items-center justify-center gap-2 bg-transparent px-4 py-2 text-[12px] font-semibold transition-colors ${
                isActive ? tab.activeClass : 'text-slate-500 hover:text-[#940dff]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[11px] font-semibold ${isActive ? 'text-current' : 'text-slate-400'}`}>{tab.count}</span>
              {isActive && (
                <motion.span
                  layoutId="candidate-tests-tab-underline"
                  className={`absolute inset-x-3 bottom-0 h-[3px] rounded-full ${tab.underlineClass}`}
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {visibleTests.length === 0 ? (
        <EmptyTestsState completed={activeTestSubTab === 'completed'} />
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {visibleTests.map((item) => (
            <div key={item.id}>
              <AssessmentCard
                item={item}
                completed={activeTestSubTab === 'completed'}
                onStartTest={onStartTest}
                onViewResult={onViewResult}
              />
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
}

function AssessmentCard({
  item,
  completed,
  onStartTest,
  onViewResult,
}: {
  item: CandidateAssessmentListItem;
  completed: boolean;
  onStartTest: (item: CandidateAssessmentListItem) => void;
  onViewResult: (item: CandidateAssessmentListItem) => void;
}) {
  const visual = getVisual(item.type);
  const title = completed ? visual.completedTitle : visual.title;
  const description = completed ? getCompletedDescription(item) : getPendingDescription(item);
  const Icon = visual.Icon;

  return (
    <article className="group rounded-2xl border border-[#940dff]/12 bg-white p-5 shadow-[0_8px_18px_rgba(148,13,255,0.055)] transition-all hover:border-[#940dff]/20 hover:shadow-[0_10px_22px_rgba(148,13,255,0.075)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border shadow-[0_6px_14px_rgba(148,13,255,0.06)]"
            style={{ backgroundColor: visual.soft, borderColor: visual.border, color: visual.color }}
          >
            <Icon size={21} />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-[16px] font-semibold text-[#343241] transition-colors group-hover:text-[#940dff]" title={title}>
              {title}
            </h3>
            <p className="mt-1 text-[12px] font-semibold text-slate-400">Vaga: {item.jobTitle}</p>
          </div>
        </div>
        <span
          className="shrink-0 rounded-xl border px-3 py-1.5 text-[11px] font-semibold"
          style={{ backgroundColor: completed ? 'rgba(99, 225, 165, 0.14)' : visual.soft, borderColor: completed ? 'rgba(99, 225, 165, 0.24)' : visual.border, color: completed ? '#2f9f6b' : visual.color }}
        >
          {completed ? 'Concluído' : 'Pendente'}
        </span>
      </div>

      <p className="mt-4 min-h-[42px] text-[12px] font-medium leading-relaxed text-slate-500">{description}</p>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="text-[12px] font-medium text-slate-400">Solicitado pela empresa</p>
        <button
          type="button"
          onClick={() => (completed ? onViewResult(item) : onStartTest(item))}
          className={completed
            ? 'h-8 rounded-full border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12'
            : 'h-8 rounded-full bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95'}
        >
          {completed ? 'Ver resultado' : 'Começar teste'}
        </button>
      </div>
    </article>
  );
}

function EmptyTestsState({ completed }: { completed: boolean }) {
  const Icon = completed ? Award : CheckCircle2;
  return (
    <div className="rounded-2xl border border-[#940dff]/12 bg-white p-14 text-center shadow-[0_8px_18px_rgba(148,13,255,0.055)]">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f3e5ff] text-[#940dff]">
        <Icon size={22} />
      </div>
      <h3 className="text-[16px] font-semibold text-[#343241]">
        {completed ? 'Nenhum teste concluído' : 'Nenhum teste pendente'}
      </h3>
      <p className="mx-auto mt-2 max-w-xl text-[12px] font-medium text-slate-400">
        {completed ? 'Quando você concluir uma avaliação, ela aparecerá aqui.' : 'Você não tem avaliações pendentes no momento.'}
      </p>
    </div>
  );
}
