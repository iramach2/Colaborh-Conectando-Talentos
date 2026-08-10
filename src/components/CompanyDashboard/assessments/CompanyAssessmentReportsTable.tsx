import { Award, User } from 'lucide-react';
import type {
  CompanyApplicant,
  DiscReportResult,
  MbtiReportResult,
  TemperamentosReportResult,
} from '../../../types/companyDashboard';
import type { AssessmentRow, AssessmentStatus } from '../../../utils/companyAssessmentRows';
import { parseCandidatePhoneData } from '../../../utils/companyDashboardUtils';

interface CompanyAssessmentReportsTableProps {
  candidatesWithTests: AssessmentRow[];
  setSelectedDiscResult: (result: DiscReportResult | null) => void;
  setSelectedMbtiResult: (result: MbtiReportResult | null) => void;
  setIsMbtiModalOpen: (isOpen: boolean) => void;
  setSelectedApplicantForQuestions: (applicant: CompanyApplicant | null) => void;
  setIsQuestionsModalOpen: (isOpen: boolean) => void;
  setSelectedTemperamentosResult: (result: TemperamentosReportResult | null) => void;
  setIsTemperamentosModalOpen: (isOpen: boolean) => void;
  setSelectedApplicantForCustomTest: (applicant: CompanyApplicant | null) => void;
  setIsCustomTestModalOpen: (isOpen: boolean) => void;
}

const resultButtonTones = {
  purple: 'border-[#940dff]/16 bg-[#f3e5ff] text-[#940dff] hover:border-[#940dff]/28 hover:bg-[#940dff]/12',
  pink: 'border-[#ff4b8c]/18 bg-[#ff4b8c]/10 text-[#ff4b8c] hover:border-[#ff4b8c]/30 hover:bg-[#ff4b8c]/14',
  green: 'border-[#63e1a5]/24 bg-[#63e1a5]/14 text-[#40b87f] hover:border-[#63e1a5]/34 hover:bg-[#63e1a5]/18',
  blue: 'border-[#533af6]/18 bg-[#533af6]/10 text-[#533af6] hover:border-[#533af6]/30 hover:bg-[#533af6]/14',
  yellow: 'border-[#ffc24b]/24 bg-[#ffc24b]/16 text-[#ffa303] hover:border-[#ffc24b]/34 hover:bg-[#ffc24b]/20',
};

type ResultButtonTone = keyof typeof resultButtonTones;

type AssessmentAction = {
  label: string;
  status: AssessmentStatus;
  tone: ResultButtonTone;
  onView: () => void;
};

const resultButtonBase = 'h-8 rounded-xl border px-4 text-[12px] font-semibold transition-all active:scale-95';

const renderStatusCell = (status: AssessmentStatus, onViewClick: () => void, tone: ResultButtonTone = 'purple') => {
  if (status === 'NONE') {
    return <span className="text-[12px] font-medium text-slate-300">-</span>;
  }

  if (status === 'PENDING') {
    return (
      <span className="inline-flex h-8 items-center justify-center rounded-xl border border-[#ffc24b]/20 bg-[#ffc24b]/16 px-3 text-[12px] font-semibold text-[#ffa303]">
        Pendente
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onViewClick}
      className={`mx-auto flex items-center justify-center ${resultButtonBase} ${resultButtonTones[tone]}`}
    >
      Ver resultado
    </button>
  );
};

const renderMobileAssessmentAction = (action: AssessmentAction) => {
  if (action.status === 'PENDING') {
    return (
      <div key={action.label} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white/75 px-3 py-2">
        <span className="text-[12px] font-semibold text-[#343241]">{action.label}</span>
        <span className="inline-flex h-8 items-center justify-center rounded-xl border border-[#ffc24b]/20 bg-[#ffc24b]/16 px-3 text-[12px] font-semibold text-[#ffa303]">
          Pendente
        </span>
      </div>
    );
  }

  return (
    <div key={action.label} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white/75 px-3 py-2">
      <span className="text-[12px] font-semibold text-[#343241]">{action.label}</span>
      <button
        type="button"
        onClick={action.onView}
        className={`flex items-center justify-center ${resultButtonBase} ${resultButtonTones[action.tone]}`}
      >
        Ver resultado
      </button>
    </div>
  );
};

export const CompanyAssessmentReportsTable = ({
  candidatesWithTests,
  setSelectedDiscResult,
  setSelectedMbtiResult,
  setIsMbtiModalOpen,
  setSelectedApplicantForQuestions,
  setIsQuestionsModalOpen,
  setSelectedTemperamentosResult,
  setIsTemperamentosModalOpen,
  setSelectedApplicantForCustomTest,
  setIsCustomTestModalOpen,
}: CompanyAssessmentReportsTableProps) => {
  const getAssessmentActions = (app: AssessmentRow): AssessmentAction[] => {
    const actions: AssessmentAction[] = [
      {
        label: 'DISC',
        status: app.discStatus,
        tone: 'green',
        onView: () => {
          setSelectedDiscResult({
            applicantName: app.candidate_name || app.name || undefined,
            D: app.discScores[0],
            I: app.discScores[1],
            S: app.discScores[2],
            C: app.discScores[3],
          });
        },
      },
      {
        label: 'MBTI',
        status: app.mbtiStatus,
        tone: 'blue',
        onView: () => {
          setSelectedMbtiResult({ ...app.mbtiData, completedAt: app.created_at });
          setIsMbtiModalOpen(true);
        },
      },
      {
        label: 'Mapeamento',
        status: app.questionsStatus,
        tone: 'yellow',
        onView: () => {
          setSelectedApplicantForQuestions({
            candidate_name: app.candidate_name || app.name,
            questionsResponses: app.questionsResponses,
          });
          setIsQuestionsModalOpen(true);
        },
      },
      {
        label: 'Temperamentos',
        status: app.temperamentosStatus,
        tone: 'pink',
        onView: () => {
          setSelectedTemperamentosResult({ ...app.temperamentosData, completedAt: app.created_at });
          setIsTemperamentosModalOpen(true);
        },
      },
      {
        label: 'Customizado',
        status: app.customTestStatus,
        tone: 'purple',
        onView: () => {
          setSelectedApplicantForCustomTest(app);
          setIsCustomTestModalOpen(true);
        },
      },
    ];

    return actions.filter((action) => action.status !== 'NONE');
  };

  if (candidatesWithTests.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/80 bg-white/85 p-10 text-center shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3e5ff] text-[#940dff]">
          <Award size={24} />
        </div>
        <h3 className="text-[18px] font-semibold text-[#343241]">Nenhum teste iniciado</h3>
        <p className="mt-2 max-w-md text-[12px] font-medium leading-relaxed text-slate-500">
          Nenhum candidato desta empresa possui solicitações ou respostas de testes no momento.
        </p>
        <div className="mt-6 rounded-2xl border border-slate-200/70 bg-[#fbfaff] p-4 text-left text-[12px] font-medium leading-relaxed text-slate-500">
          Para solicitar um teste, acesse <span className="font-semibold text-[#343241]">Minhas Vagas</span>, abra o processo seletivo de uma vaga e solicite a avaliação no perfil do candidato.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="hidden lg:block">
        <div className="grid min-w-[1040px] grid-cols-[1.5fr_1.1fr_repeat(5,0.9fr)] items-center gap-4 px-5 text-[11px] font-semibold text-slate-500">
          <span>Candidato</span>
          <span>Vaga</span>
          <span className="text-center">DISC</span>
          <span className="text-center">MBTI</span>
          <span className="text-center">Mapeamento</span>
          <span className="text-center">Temperamentos</span>
          <span className="text-center">Customizado</span>
        </div>

        <div className="mt-3 overflow-x-auto rounded-2xl border border-slate-200/70 bg-white/90 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
          <div className="min-w-[1040px] divide-y divide-slate-100">
            {candidatesWithTests.map((app) => (
              <div key={app.id} className="grid grid-cols-[1.5fr_1.1fr_repeat(5,0.9fr)] items-center gap-4 px-5 py-4 transition-colors hover:bg-[#fbfaff]">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#940dff]/18 bg-[#f3e5ff] text-[#940dff]">
                    {app.profile_pic ? (
                      <img src={app.profile_pic} alt={app.candidate_name || app.name || 'Candidato'} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User size={18} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-[#343241]">{app.candidate_name || app.name}</p>
                    <p className="truncate text-[12px] font-medium text-slate-400">{parseCandidatePhoneData(app.candidate_phone).phone || 'Telefone não informado'}</p>
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-[#343241]">{app.job?.title || 'Oportunidade'}</p>
                  <p className="truncate text-[12px] font-medium text-slate-400">{app.job?.modality || 'Presencial'}</p>
                </div>

                <div className="text-center">{renderStatusCell(app.discStatus, getAssessmentActions(app)[0]?.onView || (() => undefined), 'green')}</div>
                <div className="text-center">{renderStatusCell(app.mbtiStatus, getAssessmentActions(app).find((item) => item.label === 'MBTI')?.onView || (() => undefined), 'blue')}</div>
                <div className="text-center">{renderStatusCell(app.questionsStatus, getAssessmentActions(app).find((item) => item.label === 'Mapeamento')?.onView || (() => undefined), 'yellow')}</div>
                <div className="text-center">{renderStatusCell(app.temperamentosStatus, getAssessmentActions(app).find((item) => item.label === 'Temperamentos')?.onView || (() => undefined), 'pink')}</div>
                <div className="text-center">{renderStatusCell(app.customTestStatus, getAssessmentActions(app).find((item) => item.label === 'Customizado')?.onView || (() => undefined))}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 shadow-[0_10px_28px_rgba(15,23,42,0.035)] lg:hidden">
        <div className="divide-y divide-slate-100">
          {candidatesWithTests.map((app) => {
            const phone = parseCandidatePhoneData(app.candidate_phone).phone || 'Telefone não informado';
            const actions = getAssessmentActions(app);

            return (
              <article key={app.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#940dff]/18 bg-[#f3e5ff] text-[#940dff]">
                    {app.profile_pic ? (
                      <img src={app.profile_pic} alt={app.candidate_name || app.name || 'Candidato'} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User size={18} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-[#343241]">{app.candidate_name || app.name || 'Candidato sem nome'}</p>
                    <p className="mt-0.5 truncate text-[12px] font-medium text-slate-400">{phone}</p>
                    <div className="mt-3 rounded-2xl border border-slate-200/70 bg-[#fbfaff] px-3 py-2">
                      <p className="truncate text-[12px] font-semibold text-[#343241]">{app.job?.title || 'Oportunidade'}</p>
                      <p className="mt-0.5 truncate text-[12px] font-medium text-slate-400">{app.job?.modality || 'Presencial'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-2">
                  {actions.map(renderMobileAssessmentAction)}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};
