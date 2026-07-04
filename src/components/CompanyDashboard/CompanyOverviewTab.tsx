import { motion } from 'motion/react';
import {
  AlertCircle,
  ArrowUpRight,
  Award,
  Briefcase,
  CalendarCheck,
  ClipboardCheck,
  FileText,
  Plus,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import { DashboardAnalyticsCharts, type ChartPoint, type DistributionPoint } from './DashboardAnalyticsCharts';
import type { CompanyApplication } from '../../types/companyDashboard';

export type TopSkillPoint = {
  name: string;
  count: number;
};

interface CompanyOverviewTabProps {
  activeJobsCount: number;
  recentJobsCount: number;
  totalCandidatesReal: number;
  recentCandidatesCount: number;
  candidatesInInterview: number;
  closedOrPausedJobsCount: number;
  dynamicApplicationData: ChartPoint[];
  dynamicDistribution: DistributionPoint[];
  totalApplications: number;
  companyApplications: CompanyApplication[];
  dynamicTopSkills: TopSkillPoint[];
  onCreateVacancy: () => void;
  onOpenTalentBank: () => void;
}

type ColorTone = 'purple' | 'blue' | 'green' | 'yellow' | 'pink';

const cardClass = 'rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]';

const toneMap: Record<ColorTone, { text: string; bg: string; border: string; bar: string }> = {
  purple: { text: 'text-[#940dff]', bg: 'bg-[#f3e5ff]', border: 'border-[#940dff]/18', bar: '#940dff' },
  blue: { text: 'text-[#533af6]', bg: 'bg-[#533af6]/10', border: 'border-[#533af6]/18', bar: '#533af6' },
  green: { text: 'text-[#2f9f6b]', bg: 'bg-[#63e1a5]/14', border: 'border-[#63e1a5]/22', bar: '#63e1a5' },
  yellow: { text: 'text-[#ffa303]', bg: 'bg-[#ffc24b]/16', border: 'border-[#ffc24b]/24', bar: '#ffc24b' },
  pink: { text: 'text-[#ff4b8c]', bg: 'bg-[#ff4b8c]/10', border: 'border-[#ff4b8c]/20', bar: '#ff4b8c' },
};

const normalizeStatus = (status?: string | null) =>
  (status || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const hasResult = (application: CompanyApplication, field: keyof CompanyApplication) =>
  Boolean(application[field]);

const getPercent = (value: number, total: number) => {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
};

export const CompanyOverviewTab = ({
  activeJobsCount,
  recentJobsCount,
  totalCandidatesReal,
  recentCandidatesCount,
  candidatesInInterview,
  closedOrPausedJobsCount,
  dynamicApplicationData,
  dynamicDistribution,
  totalApplications,
  companyApplications,
  dynamicTopSkills,
  onCreateVacancy,
  onOpenTalentBank,
}: CompanyOverviewTabProps) => {
  const hiredCount = companyApplications.filter((application) => {
    const status = normalizeStatus(application.status);
    return status.includes('contrat') || status.includes('admit') || status.includes('aprov');
  }).length;

  const rejectedCount = companyApplications.filter((application) => (
    normalizeStatus(application.status).includes('reprov')
  )).length;

  const assessmentCompletedCount = companyApplications.filter((application) => (
    hasResult(application, 'disc_result') ||
    hasResult(application, 'mbti_result') ||
    hasResult(application, 'questions_result') ||
    hasResult(application, 'temperamentos_result') ||
    hasResult(application, 'custom_test_result')
  )).length;

  const screeningCount = Math.max(totalApplications - candidatesInInterview - hiredCount - rejectedCount, 0);
  const interviewRate = getPercent(candidatesInInterview, totalApplications);
  const hireRate = getPercent(hiredCount, totalApplications);
  const assessmentRate = getPercent(assessmentCompletedCount, totalApplications);
  const opportunityRatio = activeJobsCount > 0 ? Math.round(totalCandidatesReal / activeJobsCount) : 0;

  const metricCards = [
    {
      label: 'Candidaturas no funil',
      value: totalCandidatesReal,
      helper: recentCandidatesCount > 0 ? `+${recentCandidatesCount} nos últimos 7 dias` : 'Sem novas candidaturas na semana',
      icon: Users,
      tone: 'blue' as ColorTone,
    },
    {
      label: 'Vagas abertas',
      value: activeJobsCount,
      helper: recentJobsCount > 0 ? `+${recentJobsCount} novas esta semana` : `${closedOrPausedJobsCount} pausadas ou encerradas`,
      icon: Briefcase,
      tone: 'purple' as ColorTone,
    },
    {
      label: 'Em entrevista',
      value: candidatesInInterview,
      helper: `${interviewRate}% dos candidatos avançaram`,
      icon: CalendarCheck,
      tone: 'green' as ColorTone,
    },
    {
      label: 'Avaliações concluídas',
      value: assessmentCompletedCount,
      helper: `${assessmentRate}% do funil com teste finalizado`,
      icon: ClipboardCheck,
      tone: 'yellow' as ColorTone,
    },
  ];

  const funnelRows = [
    { label: 'Triagem', value: screeningCount, icon: FileText, tone: 'blue' as ColorTone },
    { label: 'Entrevistas', value: candidatesInInterview, icon: CalendarCheck, tone: 'green' as ColorTone },
    { label: 'Contratações', value: hiredCount, icon: UserCheck, tone: 'purple' as ColorTone },
    { label: 'Reprovados', value: rejectedCount, icon: AlertCircle, tone: 'pink' as ColorTone },
  ];

  const insightCards = [
    { title: 'Captação recente', value: recentCandidatesCount, helper: 'novas candidaturas', icon: TrendingUp, tone: 'blue' as ColorTone },
    { title: 'Densidade por vaga', value: opportunityRatio, helper: 'candidatos por vaga ativa', icon: Target, tone: 'purple' as ColorTone },
    { title: 'Taxa de contratação', value: `${hireRate}%`, helper: 'do funil total', icon: Award, tone: 'green' as ColorTone },
  ];

  const priorityHints = [
    totalApplications === 0 ? 'Publique e compartilhe suas vagas para iniciar o funil.' : null,
    candidatesInInterview === 0 && totalApplications > 0 ? 'Há candidatos no funil sem entrevista marcada.' : null,
    assessmentCompletedCount < candidatesInInterview && candidatesInInterview > 0 ? 'Revise candidatos em entrevista que ainda precisam de avaliação.' : null,
    activeJobsCount === 0 ? 'Nenhuma vaga ativa no momento.' : null,
  ].filter(Boolean) as string[];

  const topSkills = dynamicTopSkills.length > 0
    ? dynamicTopSkills
    : [{ name: 'Sem dados suficientes', count: 0 }];

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 pb-10"
    >
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="text-left">
          <h1 className="text-[20px] font-semibold tracking-tight text-[#343241]">Visão geral do recrutamento</h1>
          <p className="mt-1 text-[12px] font-medium text-slate-400">Acompanhe vagas, candidatos, entrevistas e avaliações em andamento.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onOpenTalentBank}
            className="flex h-8 items-center justify-center gap-2 rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12 active:scale-95"
          >
            <Search size={14} />
            Banco de talentos
          </button>
          <button
            type="button"
            onClick={onCreateVacancy}
            className="flex h-8 items-center justify-center gap-2 rounded-xl bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95"
          >
            <Plus size={14} />
            Nova vaga
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((metric) => {
          const MetricIcon = metric.icon;
          const tone = toneMap[metric.tone];

          return (
            <motion.article
              key={metric.label}
              whileHover={{ y: -3 }}
              className={`${cardClass} text-left transition-all hover:border-[#940dff]/18 hover:bg-white`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-slate-400">{metric.label}</p>
                  <strong className="mt-2 block text-[30px] font-semibold leading-none tracking-tight text-[#343241]">{metric.value}</strong>
                </div>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${tone.border} ${tone.bg} ${tone.text}`}>
                  <MetricIcon size={18} />
                </div>
              </div>
              <p className="mt-4 text-[11px] font-medium text-slate-400">{metric.helper}</p>
            </motion.article>
          );
        })}
      </section>

      <DashboardAnalyticsCharts
        applicationData={dynamicApplicationData}
        vacancyDistribution={dynamicDistribution}
        totalApplications={totalApplications}
      />

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
        <div className={`${cardClass} text-left`}>
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-[20px] font-semibold tracking-tight text-[#343241]">Funil operacional</h3>
              <p className="mt-1 text-[12px] font-medium text-slate-400">Distribuição real das candidaturas por momento do processo.</p>
            </div>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#533af6]/18 bg-[#533af6]/10 text-[#533af6]">
              <ArrowUpRight size={15} />
            </span>
          </div>

          <div className="space-y-4">
            {funnelRows.map((row) => {
              const RowIcon = row.icon;
              const percent = getPercent(row.value, totalApplications);
              const tone = toneMap[row.tone];

              return (
                <div key={row.label} className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${tone.border} ${tone.bg} ${tone.text}`}>
                        <RowIcon size={15} />
                      </span>
                      <span className="text-[12px] font-semibold text-[#343241]">{row.label}</span>
                    </div>
                    <span className="text-[12px] font-semibold text-slate-500">{row.value} · {percent}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100/80">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: tone.bar }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`${cardClass} text-left`}>
          <div className="mb-5 flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#ffc24b]/24 bg-[#ffc24b]/16 text-[#ffa303]">
              <Sparkles size={18} />
            </span>
            <div>
              <h3 className="text-[20px] font-semibold tracking-tight text-[#343241]">Sinais de prioridade</h3>
              <p className="mt-1 text-[12px] font-medium text-slate-400">Pontos de atenção para acelerar o recrutamento.</p>
            </div>
          </div>

          <div className="space-y-3">
            {(priorityHints.length > 0 ? priorityHints : ['Funil saudável no momento. Continue acompanhando entrevistas e avaliações.']).map((hint) => (
              <div key={hint} className="flex gap-3 rounded-xl border border-[#ffc24b]/24 bg-[#ffc24b]/16 p-3">
                <AlertCircle size={15} className="mt-0.5 shrink-0 text-[#ffa303]" />
                <p className="text-[12px] font-medium leading-relaxed text-slate-500">{hint}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {insightCards.map((card) => {
              const InsightIcon = card.icon;
              const tone = toneMap[card.tone];

              return (
                <div key={card.title} className="rounded-xl border border-slate-200/70 bg-white p-3 text-center">
                  <InsightIcon size={14} className={`mx-auto mb-2 ${tone.text}`} />
                  <p className="text-[18px] font-semibold leading-none text-[#343241]">{card.value}</p>
                  <p className="mt-1 text-[9px] font-medium leading-tight text-slate-400">{card.helper}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`${cardClass} text-left`}>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#63e1a5]/22 bg-[#63e1a5]/14 text-[#2f9f6b]">
            <Award size={18} />
          </div>
          <div>
            <h3 className="text-[20px] font-semibold tracking-tight text-[#343241]">Competências mais pedidas</h3>
            <p className="mt-0.5 text-[12px] font-medium text-slate-400">Requisitos recorrentes nas vagas cadastradas.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          {topSkills.map((skill) => (
            <div key={skill.name} className="rounded-xl border border-slate-200/70 bg-white p-4">
              <p className="truncate text-[13px] font-semibold text-[#343241]">{skill.name}</p>
              <p className="mt-2 text-[11px] font-medium text-slate-400">{skill.count} vaga{skill.count === 1 ? '' : 's'}</p>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};