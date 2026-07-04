import { useMemo, useState } from 'react';
import { CalendarClock, Check, ChevronLeft, ChevronRight, Clock, Mail, Video, X as CloseIcon } from 'lucide-react';
import type { CompanyApplicant, CompanyApplication, CompanyInterview, CompanyJob, CompanyLike } from '../../types/companyDashboard';

interface CompanyInterviewsTabProps {
  companyJobs: CompanyJob[];
  jobs: CompanyJob[];
  interviews: CompanyInterview[];
  jobApplicants: CompanyApplicant[];
  selectedCompany: CompanyLike | null;
  getFullApplicantInfo: (applicant: CompanyApplication) => CompanyApplicant;
  cleanEmojiFromText: (text: string) => string;
  setActiveVideoMeeting: (meeting: { roomName: string; userName: string; interviewId?: string }) => void;
  handleUpdateInterviewStatus: (id: string, status: 'completed' | 'cancelled') => void | Promise<void>;
}

const pad = (value: number) => String(value).padStart(2, '0');
const toDateKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const toTimeKey = (date: Date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;
const getInterviewDate = (item: CompanyInterview) => item.scheduled_at || item.date_time || item.created_at || '';
const formatMonthTitle = (date: Date) => date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
const formatFullDate = (dateKey: string) => new Date(`${dateKey}T12:00`).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

const getCalendarDays = (visibleMonth: Date) => {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
};

const statusStyle = (status?: string | null) => {
  if (status === 'scheduled') return 'border-[#ffc24b]/24 bg-[#ffc24b]/16 text-[#ffa303]';
  if (status === 'completed') return 'border-[#63e1a5]/25 bg-[#63e1a5]/14 text-[#2f9f6b]';
  return 'border-[#ff4b8c]/20 bg-[#ff4b8c]/10 text-[#ff4b8c]';
};

const statusLabel = (status?: string | null) => {
  if (status === 'scheduled') return 'Agendada';
  if (status === 'completed') return 'Concluída';
  return 'Cancelada';
};

export const CompanyInterviewsTab = ({
  companyJobs,
  jobs,
  interviews,
  jobApplicants,
  selectedCompany,
  getFullApplicantInfo,
  cleanEmojiFromText,
  setActiveVideoMeeting,
  handleUpdateInterviewStatus
}: CompanyInterviewsTabProps) => {
  const today = useMemo(() => new Date(), []);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDateKey, setSelectedDateKey] = useState(() => toDateKey(today));

  const companyJobIds = companyJobs.map(job => job.id);
  const filteredInterviews = interviews
    .filter(item => companyJobIds.includes(item.job_id || ''))
    .filter(item => Boolean(getInterviewDate(item)))
    .sort((a, b) => new Date(getInterviewDate(a)).getTime() - new Date(getInterviewDate(b)).getTime());

  const calendarDays = getCalendarDays(visibleMonth);
  const interviewsByDate = filteredInterviews.reduce<Record<string, CompanyInterview[]>>((acc, item) => {
    const key = toDateKey(new Date(getInterviewDate(item)));
    acc[key] = [...(acc[key] || []), item];
    return acc;
  }, {});

  const selectedDayInterviews = [...(interviewsByDate[selectedDateKey] || [])]
    .sort((a, b) => new Date(getInterviewDate(a)).getTime() - new Date(getInterviewDate(b)).getTime());
  const scheduledCount = filteredInterviews.filter(item => item.status === 'scheduled').length;
  const completedCount = filteredInterviews.filter(item => item.status === 'completed').length;
  const cancelledCount = filteredInterviews.filter(item => item.status === 'cancelled').length;

  const goToPreviousMonth = () => {
    setVisibleMonth((previous) => new Date(previous.getFullYear(), previous.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setVisibleMonth((previous) => new Date(previous.getFullYear(), previous.getMonth() + 1, 1));
  };

  const getCandidateName = (item: CompanyInterview) => {
    const candidate = jobApplicants.find(applicant => {
      const info = getFullApplicantInfo(applicant);
      return info?.email === item.candidate_email || info?.candidate_email === item.candidate_email;
    });

    if (!candidate) return item.candidate_email || 'Candidato não identificado';
    const info = getFullApplicantInfo(candidate);
    return info.candidate_name || info.name || item.candidate_email || 'Candidato não identificado';
  };

  const getJobTitle = (item: CompanyInterview) => {
    const matchedJob = jobs.find(job => job.id === item.job_id) || companyJobs.find(job => job.id === item.job_id);
    return matchedJob ? cleanEmojiFromText(matchedJob.title) : 'Vaga indisponível';
  };

  return (
    <div className="company-dashboard-surface space-y-5 text-left">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
          <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-[18px] font-semibold text-[#343241]">Calendário de entrevistas</h3>
              <p className="mt-1 text-[12px] font-medium text-slate-400">Veja os dias ocupados e acompanhe a agenda da empresa.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200/70 bg-white text-slate-400 shadow-sm transition-all hover:bg-[#f3e5ff] hover:text-[#940dff] active:scale-95"
                aria-label="Mês anterior"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="min-w-[150px] text-center text-[14px] font-semibold capitalize text-[#343241]">{formatMonthTitle(visibleMonth)}</span>
              <button
                type="button"
                onClick={goToNextMonth}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200/70 bg-white text-slate-400 shadow-sm transition-all hover:bg-[#f3e5ff] hover:text-[#940dff] active:scale-95"
                aria-label="Próximo mês"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-[#fbf9ff] p-4">
            <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-semibold text-slate-400">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => <span key={day}>{day}</span>)}
            </div>

            <div className="mt-3 grid grid-cols-7 gap-2">
              {calendarDays.map((day) => {
                const dayKey = toDateKey(day);
                const isCurrentMonth = day.getMonth() === visibleMonth.getMonth();
                const isSelected = dayKey === selectedDateKey;
                const dayInterviews = interviewsByDate[dayKey] || [];
                const hasScheduled = dayInterviews.some(item => item.status === 'scheduled');

                return (
                  <button
                    key={dayKey}
                    type="button"
                    onClick={() => setSelectedDateKey(dayKey)}
                    className={`relative flex min-h-[76px] flex-col items-center justify-center rounded-2xl border text-[12px] font-semibold transition-all active:scale-[0.98] ${
                      isSelected
                        ? 'border-[#940dff] bg-[#940dff] text-white shadow-[0_10px_22px_rgba(148,13,255,0.18)]'
                        : isCurrentMonth
                          ? 'border-white/80 bg-white text-slate-500 hover:border-[#940dff]/18 hover:text-[#940dff]'
                          : 'border-transparent bg-transparent text-slate-300'
                    }`}
                  >
                    <span>{day.getDate()}</span>
                    {dayInterviews.length > 0 && (
                      <span className={`mt-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-2 text-[10px] font-semibold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : hasScheduled
                            ? 'bg-[#ffc24b]/16 text-[#ffa303]'
                            : 'bg-[#63e1a5]/14 text-[#2f9f6b]'
                      }`}>
                        {dayInterviews.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
            <h3 className="text-[16px] font-semibold text-[#343241]">Resumo</h3>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-[#ffc24b]/24 bg-[#ffc24b]/16 p-3 text-center">
                <p className="text-[18px] font-semibold text-[#ffa303]">{scheduledCount}</p>
                <p className="mt-1 text-[11px] font-semibold text-[#ffa303]">Agendadas</p>
              </div>
              <div className="rounded-2xl border border-[#63e1a5]/25 bg-[#63e1a5]/14 p-3 text-center">
                <p className="text-[18px] font-semibold text-[#2f9f6b]">{completedCount}</p>
                <p className="mt-1 text-[11px] font-semibold text-[#2f9f6b]">Concluídas</p>
              </div>
              <div className="rounded-2xl border border-[#ff4b8c]/20 bg-[#ff4b8c]/10 p-3 text-center">
                <p className="text-[18px] font-semibold text-[#ff4b8c]">{cancelledCount}</p>
                <p className="mt-1 text-[11px] font-semibold text-[#ff4b8c]">Canceladas</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[16px] font-semibold text-[#343241]">Agenda do dia</h3>
                <p className="mt-1 text-[12px] font-medium capitalize text-slate-400">{formatFullDate(selectedDateKey)}</p>
              </div>
              <span className="rounded-xl border border-[#f3e5ff] bg-[#f3e5ff] px-3 py-1 text-[11px] font-semibold text-[#940dff]">
                {selectedDayInterviews.length}
              </span>
            </div>

            {selectedDayInterviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-[#fbf9ff] px-4 py-10 text-center">
                <CalendarClock size={24} className="mx-auto mb-3 text-slate-300" />
                <p className="text-[12px] font-medium text-slate-400">Nenhuma entrevista marcada neste dia.</p>
              </div>
            ) : (
              <div className="max-h-[530px] space-y-3 overflow-y-auto pr-1 no-scrollbar">
                {selectedDayInterviews.map((item) => {
                  const dateValue = getInterviewDate(item);
                  const roomName = item.room_name || '';

                  return (
                    <article key={item.id || `${item.candidate_email}-${dateValue}`} className="rounded-2xl border border-slate-200/70 bg-white p-4 transition-all hover:border-[#940dff]/18">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#343241]"><Clock size={14} /> {toTimeKey(new Date(dateValue))}</span>
                            <span className={`rounded-xl border px-3 py-1 text-[11px] font-semibold ${statusStyle(item.status)}`}>{statusLabel(item.status)}</span>
                          </div>
                          <p className="mt-3 truncate text-[13px] font-semibold text-[#343241]">{getCandidateName(item)}</p>
                          <p className="mt-1 truncate text-[12px] font-medium text-slate-400">{getJobTitle(item)}</p>
                          {item.candidate_email && (
                            <p className="mt-2 flex items-center gap-1.5 truncate text-[12px] font-medium text-slate-400"><Mail size={13} /> {item.candidate_email}</p>
                          )}
                        </div>
                      </div>

                      {item.notes && (
                        <p className="mt-3 whitespace-pre-line rounded-xl border border-slate-100 bg-[#fbf9ff] p-3 text-[12px] font-medium leading-relaxed text-slate-500">
                          {item.notes}
                        </p>
                      )}

                      {item.status === 'scheduled' && (
                        <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                          <button
                            type="button"
                            onClick={() => setActiveVideoMeeting({ interviewId: item.id, roomName, userName: selectedCompany?.nomeFantasia || 'Empresa Colaborh' })}
                            disabled={!roomName}
                            className="flex h-8 items-center justify-center gap-1.5 rounded-xl bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Video size={14} /> Entrar
                          </button>
                          <button
                            type="button"
                            onClick={() => item.id && handleUpdateInterviewStatus(item.id, 'completed')}
                            className="flex h-8 items-center justify-center gap-1.5 rounded-xl border border-[#63e1a5]/25 bg-[#63e1a5]/14 px-4 text-[12px] font-semibold text-[#2f9f6b] transition-all hover:bg-[#63e1a5]/20 active:scale-95"
                          >
                            <Check size={14} /> Concluir
                          </button>
                          <button
                            type="button"
                            onClick={() => item.id && handleUpdateInterviewStatus(item.id, 'cancelled')}
                            className="flex h-8 items-center justify-center gap-1.5 rounded-xl border border-[#ff4b8c]/20 bg-[#ff4b8c]/10 px-4 text-[12px] font-semibold text-[#ff4b8c] transition-all hover:bg-[#ff4b8c]/15 active:scale-95"
                          >
                            <CloseIcon size={14} /> Cancelar
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </aside>
      </div>

      <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-[16px] font-semibold text-[#343241]">Todas as entrevistas</h3>
            <p className="mt-1 text-[12px] font-medium text-slate-400">Histórico completo da empresa selecionada.</p>
          </div>
          <span className="rounded-xl border border-[#f3e5ff] bg-[#f3e5ff] px-3 py-1 text-[11px] font-semibold text-[#940dff]">{filteredInterviews.length}</span>
        </div>

        {filteredInterviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-[#fbf9ff] px-4 py-10 text-center">
            <Video size={26} className="mx-auto mb-3 text-slate-300" />
            <p className="text-[13px] font-semibold text-[#343241]">Nenhuma entrevista agendada</p>
            <p className="mt-2 text-[12px] font-medium text-slate-400">Agende entrevistas pelo perfil do candidato dentro do processo seletivo.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[920px]">
              <div className="grid grid-cols-[0.7fr_1.2fr_1fr_1fr_0.7fr_220px] items-center gap-4 px-5 pb-3 text-[11px] font-semibold text-slate-500">
                <span>Horário</span>
                <span>Candidato</span>
                <span>Vaga</span>
                <span>E-mail</span>
                <span className="text-center">Status</span>
                <span className="text-right">Ações</span>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
                <div className="divide-y divide-slate-100">
                  {filteredInterviews.map((item) => {
                    const dateValue = getInterviewDate(item);
                    const roomName = item.room_name || '';
                    return (
                      <div key={item.id || `${item.candidate_email}-${dateValue}`} className="grid grid-cols-[0.7fr_1.2fr_1fr_1fr_0.7fr_220px] items-center gap-4 px-5 py-4 transition-colors hover:bg-[#fbfaff]">
                        <span className="text-[12px] font-medium text-slate-500">{new Date(dateValue).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                        <span className="truncate text-[13px] font-semibold text-[#343241]">{getCandidateName(item)}</span>
                        <span className="truncate text-[12px] font-medium text-slate-500">{getJobTitle(item)}</span>
                        <span className="truncate text-[12px] font-medium text-slate-400">{item.candidate_email || '-'}</span>
                        <span className={`mx-auto rounded-xl border px-3 py-1 text-[11px] font-semibold ${statusStyle(item.status)}`}>{statusLabel(item.status)}</span>
                        <div className="flex justify-end gap-2">
                          {item.status === 'scheduled' ? (
                            <>
                              <button type="button" onClick={() => setActiveVideoMeeting({ interviewId: item.id, roomName, userName: selectedCompany?.nomeFantasia || 'Empresa Colaborh' })} disabled={!roomName} className="h-8 rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12 disabled:cursor-not-allowed disabled:opacity-50">Entrar</button>
                              <button type="button" onClick={() => item.id && handleUpdateInterviewStatus(item.id, 'completed')} className="h-8 rounded-xl border border-[#63e1a5]/25 bg-[#63e1a5]/14 px-4 text-[12px] font-semibold text-[#2f9f6b] transition-all hover:bg-[#63e1a5]/20">Concluir</button>
                              <button type="button" onClick={() => item.id && handleUpdateInterviewStatus(item.id, 'cancelled')} className="h-8 rounded-xl border border-[#ff4b8c]/20 bg-[#ff4b8c]/10 px-4 text-[12px] font-semibold text-[#ff4b8c] transition-all hover:bg-[#ff4b8c]/15">Cancelar</button>
                            </>
                          ) : (
                            <span className="text-[12px] font-medium text-slate-300">-</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};