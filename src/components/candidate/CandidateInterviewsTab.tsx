import { CalendarDays, Clock, Loader2, Video } from 'lucide-react';
import { motion } from 'motion/react';
import type { CompanyInterview } from '../../types/companyDashboard';

interface CandidateInterviewsTabProps {
  interviews: CompanyInterview[];
  isFetchingInterviews: boolean;
  onJoinInterview: (roomName: string, interviewId?: string) => void;
}

const formatInterviewDate = (value?: string | null) => {
  if (!value) return 'Data a confirmar';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Data a confirmar';
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
};

const formatInterviewTime = (value?: string | null) => {
  if (!value) return 'Horário a confirmar';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Horário a confirmar';
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const getCompanyInitials = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  return words[0] ? words[0].substring(0, 2).toUpperCase() : 'EM';
};

const getStatusMeta = (status?: string | null) => {
  if (status === 'completed') {
    return { label: 'Concluída', dot: 'bg-[#63e1a5]', text: 'text-[#2f9f6b]' };
  }
  if (status === 'cancelled') {
    return { label: 'Cancelada', dot: 'bg-[#ff4b8c]', text: 'text-[#ff4b8c]' };
  }
  return { label: 'Agendada', dot: 'bg-[#940dff]', text: 'text-[#940dff]' };
};

export function CandidateInterviewsTab({
  interviews,
  isFetchingInterviews,
  onJoinInterview,
}: CandidateInterviewsTabProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 text-left"
    >
      {isFetchingInterviews ? (
        <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-14 text-center shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
          <Loader2 className="mx-auto mb-4 animate-spin text-[#940dff]" size={30} />
          <p className="text-[12px] font-semibold text-slate-400">Carregando suas entrevistas...</p>
        </div>
      ) : interviews.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-14 text-center shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3e5ff] text-[#940dff]">
            <Video size={22} />
          </div>
          <h3 className="text-[16px] font-semibold text-[#343241]">Nenhuma entrevista agendada</h3>
          <p className="mx-auto mt-2 max-w-xl text-[12px] font-medium text-slate-400">
            Quando uma empresa agendar uma videoconferência com você, ela aparecerá aqui.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/85 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
          <div className="hidden grid-cols-[minmax(260px,1.4fr)_1fr_0.8fr_0.8fr_180px] gap-4 border-b border-slate-100 bg-[#fbfaff] px-5 py-3 text-[11px] font-semibold text-slate-400 lg:grid">
            <span>Empresa e vaga</span>
            <span>Status</span>
            <span>Data</span>
            <span>Horário</span>
            <span className="text-right">Ações</span>
          </div>

          <div className="divide-y divide-slate-100">
            {interviews.map((item) => {
              const interviewDateTime = item.scheduled_at || item.date_time || item.created_at;
              const companyDisplayName = item.company_name || item.job?.company_name || 'Empresa';
              const jobTitle = item.job?.title || 'Vaga não especificada';
              const statusMeta = getStatusMeta(item.status);
              const isScheduled = item.status === 'scheduled';
              const canJoin = Boolean(isScheduled && item.room_name);

              return (
                <article key={item.id || `${companyDisplayName}-${interviewDateTime}`} className="group grid gap-4 px-5 py-4 transition-colors hover:bg-[#fbfaff] lg:grid-cols-[minmax(260px,1.4fr)_1fr_0.8fr_0.8fr_180px] lg:items-center">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 select-none items-center justify-center rounded-2xl border border-[#940dff]/18 bg-[#f3e5ff] text-[12px] font-semibold text-[#940dff]">
                      {getCompanyInitials(companyDisplayName)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-[14px] font-semibold text-[#343241] group-hover:text-[#940dff]" title={companyDisplayName}>
                        {companyDisplayName}
                      </h3>
                      <p className="mt-1 truncate text-[12px] font-medium text-slate-400" title={jobTitle}>{jobTitle}</p>
                      {item.notes && (
                        <p className="mt-2 line-clamp-2 text-[12px] font-medium leading-relaxed text-slate-500 lg:hidden">{item.notes}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 lg:hidden">Status</p>
                    <span className={`inline-flex items-center gap-2 text-[12px] font-semibold ${statusMeta.text}`}>
                      <span className={`h-2 w-2 rounded-full ${statusMeta.dot}`} />
                      {statusMeta.label}
                    </span>
                  </div>

                  <InfoCell icon={CalendarDays} label="Data" value={formatInterviewDate(interviewDateTime)} />
                  <InfoCell icon={Clock} label="Horário" value={formatInterviewTime(interviewDateTime)} />

                  <div className="flex justify-start lg:justify-end">
                    {isScheduled ? (
                      <button
                        type="button"
                        onClick={() => item.room_name && onJoinInterview(item.room_name, item.id)}
                        disabled={!canJoin}
                        className="flex h-8 items-center gap-2 rounded-xl bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                      >
                        <Video size={14} />
                        Entrar
                      </button>
                    ) : (
                      <span className="text-[12px] font-medium text-slate-400">Sem ação</span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </motion.section>
  );
}

function InfoCell({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 lg:hidden">
        <Icon size={12} className="text-[#940dff]" />
        {label}
      </p>
      <p className="truncate text-[12px] font-medium capitalize text-slate-500" title={value}>{value}</p>
    </div>
  );
}