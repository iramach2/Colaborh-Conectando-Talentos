import { ReactNode } from 'react';
import { Brain, Briefcase, ChevronRight, Compass, HelpCircle, Plus, Thermometer } from 'lucide-react';
import type { CompanyApplicant, DiscReportResult, MbtiReportResult, TemperamentosReportResult } from '../../types/companyDashboard';
import { parseCandidatePhoneData } from '../../utils/companyDashboardUtils';

interface CompanyCandidateResumeTestsTabProps {
  applicant: CompanyApplicant;
  onViewDisc: (result: DiscReportResult) => void;
  onViewMbti: (result: MbtiReportResult) => void;
  onViewQuestions: (result: CompanyApplicant) => void;
  onViewTemperamentos: (result: TemperamentosReportResult) => void;
  onViewCustom: (result: CompanyApplicant) => void;
  onRequestDisc: (applicant: CompanyApplicant) => void | Promise<void>;
  onRequestMbti: (applicant: CompanyApplicant) => void | Promise<void>;
  onRequestQuestions: (applicant: CompanyApplicant) => void | Promise<void>;
  onRequestTemperamentos: (applicant: CompanyApplicant) => void | Promise<void>;
  onRequestCustom: (applicant: CompanyApplicant) => void | Promise<void>;
}

const statusLabel = (status: string) => {
  if (status === 'COMPLETED') return 'Concluído';
  if (status === 'PENDING') return 'Pendente';
  return 'Não solicitado';
};

const statusClassName = (status: string) => {
  if (status === 'COMPLETED') return 'bg-[#63e1a5]/14 text-[#2f9f6b] border-[#63e1a5]/20';
  if (status === 'PENDING') return 'bg-[#ffc24b]/16 text-[#ffa303] border-[#ffc24b]/22';
  return 'bg-white text-slate-400 border-slate-200/70';
};

function ResultRow({
  icon,
  title,
  description,
  status,
  actionLabel,
  onView,
  onRequest,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  status: string;
  actionLabel?: string;
  onView?: () => void;
  onRequest?: () => void | Promise<void>;
}) {
  return (
    <div className="flex min-h-[150px] flex-col justify-between rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)] transition-all hover:border-[#533af6]/18 hover:bg-white">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/60 bg-white shadow-sm">
              {icon}
            </div>
            <h6 className="truncate text-sm font-semibold tracking-tight text-[#343241]">{title}</h6>
          </div>
          <span className={`hidden shrink-0 rounded-xl border px-3 py-1 text-[11px] font-semibold sm:inline-flex ${statusClassName(status)}`}>
            {statusLabel(status)}
          </span>
        </div>
        <p className="mt-3 max-w-xl text-[12px] font-medium leading-relaxed text-slate-400">{description}</p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className={`inline-flex shrink-0 rounded-xl border px-3 py-1 text-[11px] font-semibold sm:hidden ${statusClassName(status)}`}>
          {statusLabel(status)}
        </span>
        {status === 'COMPLETED' && onView ? (
          <button
            type="button"
            onClick={onView}
            className="flex h-8 items-center justify-center gap-1.5 rounded-xl border border-[#63e1a5] bg-[#63e1a5] px-4 text-[12px] font-semibold text-white shadow-sm transition-all hover:bg-[#50cf93] active:scale-95"
          >
            <span>{actionLabel || 'Ver relatório'}</span>
            <ChevronRight size={13} className="shrink-0" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onRequest}
            disabled={!onRequest || status === 'PENDING'}
            className="flex h-8 items-center justify-center gap-1.5 rounded-xl border border-[#940dff] bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-sm transition-all hover:bg-[#8200e6] active:scale-95 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-white disabled:text-slate-400 disabled:shadow-none"
          >
            <Plus size={13} className="shrink-0" />
            <span>{status === 'PENDING' ? 'Solicitado' : 'Solicitar'}</span>
          </button>
        )}
      </div>
    </div>
  );
}

export function CompanyCandidateResumeTestsTab({
  applicant,
  onViewDisc,
  onViewMbti,
  onViewQuestions,
  onViewTemperamentos,
  onViewCustom,
  onRequestDisc,
  onRequestMbti,
  onRequestQuestions,
  onRequestTemperamentos,
  onRequestCustom,
}: CompanyCandidateResumeTestsTabProps) {
  const parsedData = parseCandidatePhoneData(applicant.candidate_phone || '');

  let discStatus = 'NONE';
  let discScores = [0, 0, 0, 0];
  if (parsedData.disc) {
    if (parsedData.disc === 'PENDING') discStatus = 'PENDING';
    else if (parsedData.disc.startsWith('COMPLETED===')) {
      discStatus = 'COMPLETED';
      discScores = parsedData.disc.replace('COMPLETED===', '').split(',').map(Number);
    }
  }

  const parseJsonStatus = (value?: string) => {
    if (!value) return { status: 'NONE', responses: null };
    if (value === 'PENDING') return { status: 'PENDING', responses: null };
    if (!value.startsWith('COMPLETED===')) return { status: 'NONE', responses: null };

    try {
      return { status: 'COMPLETED', responses: JSON.parse(value.replace('COMPLETED===', '').trim()) };
    } catch {
      return { status: 'COMPLETED', responses: null };
    }
  };

  const mbti = parseJsonStatus(parsedData.mbti);
  const questions = parseJsonStatus(parsedData.questions);
  const temperamentos = parseJsonStatus(parsedData.temperamentos);
  const customTest = parseJsonStatus(parsedData.customTest);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/20 p-6 text-left no-scrollbar">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h5 className="text-sm font-semibold tracking-tight text-[#343241]">Testes realizados</h5>
          <p className="mt-1 text-[12px] font-medium text-slate-400">Acompanhe os testes solicitados e os resultados concluídos.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ResultRow
          icon={<Brain size={18} className="text-[#ff4b8c]" />}
          title="DISC"
          description="Avaliação comportamental baseada em dominância, influência, estabilidade e conformidade."
          status={discStatus}
          actionLabel="Ver relatório"
          onRequest={() => onRequestDisc(applicant)}
          onView={() => onViewDisc({
            applicantName: applicant.candidate_name,
            completedAt: parsedData.discDate || applicant.created_at,
            D: discScores[0],
            I: discScores[1],
            S: discScores[2],
            C: discScores[3],
          })}
        />

        <ResultRow
          icon={<Compass size={18} className="text-[#533af6]" />}
          title="MBTI"
          description="Indicador de tipos psicológicos e traços de personalidade em 16 perfis."
          status={mbti.status}
          actionLabel={mbti.responses ? `Ver perfil (${mbti.responses.type || 'MBTI'})` : 'Ver perfil'}
          onRequest={() => onRequestMbti(applicant)}
          onView={mbti.responses ? () => onViewMbti({
            applicantName: applicant.candidate_name,
            completedAt: parsedData.mbtiDate || applicant.created_at,
            ...mbti.responses,
          }) : undefined}
        />

        <ResultRow
          icon={<HelpCircle size={18} className="text-[#ffa303]" />}
          title="Mapeamento por perguntas"
          description="Perguntas com respostas em vídeo ou texto sobre trajetória, objetivos e contexto profissional."
          status={questions.status}
          actionLabel="Ver respostas"
          onRequest={() => onRequestQuestions(applicant)}
          onView={questions.responses ? () => onViewQuestions({
            candidate_name: applicant.candidate_name,
            questionsResponses: questions.responses,
            completedAt: parsedData.questionsDate || applicant.created_at,
          }) : undefined}
        />

        <ResultRow
          icon={<Thermometer size={18} className="text-[#ff4b8c]" />}
          title="Temperamentos"
          description="Identificação dos temperamentos principais: sanguíneo, colérico, melancólico e fleumático."
          status={temperamentos.status}
          actionLabel={temperamentos.responses ? `Ver perfil (${temperamentos.responses.type || 'TEMP'})` : 'Ver perfil'}
          onRequest={() => onRequestTemperamentos(applicant)}
          onView={temperamentos.responses ? () => onViewTemperamentos({
            applicantName: applicant.candidate_name,
            completedAt: parsedData.temperamentosDate || applicant.created_at,
            ...temperamentos.responses,
          }) : undefined}
        />

        <ResultRow
          icon={<Briefcase size={18} className="text-[#40b87f]" />}
          title="Questionário customizado"
          description="Perguntas específicas e testes técnicos configurados para a vaga."
          status={customTest.status}
          actionLabel="Ver respostas"
          onRequest={() => onRequestCustom(applicant)}
          onView={customTest.responses ? () => onViewCustom({
            candidate_name: applicant.candidate_name,
            completedAt: parsedData.customTestDate || applicant.created_at,
            ...customTest.responses,
          }) : undefined}
        />
      </div>
    </div>
  );
}
