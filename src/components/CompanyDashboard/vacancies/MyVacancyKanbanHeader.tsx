import React from 'react';
import { CalendarDays, ChevronLeft, Settings, X } from 'lucide-react';
import { cleanEmojiFromText } from '../../../utils/companyDashboardUtils';
import type { CompanyJob } from '../../../types/companyDashboard';

interface MyVacancyKanbanHeaderProps {
  selectedJob: CompanyJob;
  applicantsCount: number;
  stagesCount: number;
  rejectedCount: number;
  isRejectedView: boolean;
  onBack: () => void;
  onConfigureStages: () => void;
  onToggleRejectedView: () => void;
}

const MetricPill = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center gap-2 px-1 py-1">
    <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</span>
    <span className="text-sm font-semibold text-[#343241]">{value}</span>
  </div>
);

const formatCreatedAt = (value?: string | null) => {
  if (!value) return 'Data de criação não informada';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Data de criação não informada';
  return `Criada em ${new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)}`;
};

export const MyVacancyKanbanHeader: React.FC<MyVacancyKanbanHeaderProps> = ({
  selectedJob,
  applicantsCount,
  stagesCount,
  rejectedCount,
  isRejectedView,
  onBack,
  onConfigureStages,
  onToggleRejectedView,
}) => (
  <section className="px-1 py-2 text-left">
    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onBack}
          className="w-[38px] h-[38px] bg-[#940dff] text-white hover:bg-[#8200e6] rounded-full flex items-center justify-center transition-all outline-none cursor-pointer border border-[#940dff] shrink-0 shadow-[0_10px_22px_rgba(148,13,255,0.22)] active:scale-95"
          title="Voltar para vagas"
        >
          <ChevronLeft size={17} className="stroke-[2.5]" />
        </button>

        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-[#343241] tracking-tight leading-tight truncate">
            {cleanEmojiFromText(selectedJob.title || 'Vaga sem título')}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400 truncate">
            <CalendarDays size={13} /> {formatCreatedAt(selectedJob.created_at)}
          </p>
        </div>
      </div>

      <div className="flex w-full items-center gap-2 xl:w-auto xl:justify-end shrink-0">
        <div className="flex items-center gap-2">
          <MetricPill label="Candidatos" value={applicantsCount} />
          <MetricPill label="Etapas" value={stagesCount} />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span id="kanban-mobile-bulk-actions-slot" className="flex sm:hidden" />
        <button
          type="button"
          onClick={onConfigureStages}
          className="flex h-10 w-10 items-center justify-center gap-2 rounded-xl border border-[#940dff] bg-[#940dff] p-0 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] outline-none transition-all hover:bg-[#8200e6] active:scale-95 sm:h-8 sm:w-auto sm:px-4"
          title="Configurações"
        >
          <Settings size={14} className="stroke-[2.5]" /> <span className="hidden sm:inline">Configurações</span>
        </button>
        <button
          type="button"
          onClick={onToggleRejectedView}
          className="flex h-10 w-10 items-center justify-center gap-2 rounded-xl border border-[#ff4b8c] bg-[#ff4b8c] p-0 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(255,75,140,0.18)] outline-none transition-all hover:bg-[#e83a78] active:scale-95 sm:h-8 sm:w-auto sm:px-4"
          title={isRejectedView ? 'Voltar' : 'Reprovados'}
        >
          <X size={14} className="stroke-[2.5]" />
          <span className="hidden sm:inline">{isRejectedView ? 'Voltar' : `Reprovados${rejectedCount > 0 ? ` ${rejectedCount}` : ''}`}</span>
        </button>
        </div>
      </div>
    </div>
  </section>
);



