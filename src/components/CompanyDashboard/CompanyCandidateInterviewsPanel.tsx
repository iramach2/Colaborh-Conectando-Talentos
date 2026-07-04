import { useMemo, useState } from 'react';
import { CalendarClock, Check, ChevronLeft, ChevronRight, Video, X as CloseIcon } from 'lucide-react';
import type { CompanyApplicant, CompanyInterview, CompanyJob, CompanyLike } from '../../types/companyDashboard';

interface CompanyCandidateInterviewsPanelProps {
  applicant: CompanyApplicant | null;
  selectedJob: CompanyJob | null;
  companyJobs: CompanyJob[];
  interviews: CompanyInterview[];
  selectedCompany: CompanyLike | null;
  handleCreateInterview: (jobId: string, candidateEmail: string, dateTime: string, notes: string) => Promise<void>;
  handleUpdateInterviewStatus: (id: string, status: 'completed' | 'cancelled') => void | Promise<void>;
  setActiveVideoMeeting: (meeting: { roomName: string; userName: string; interviewId?: string }) => void;
}

const statusStyle = (status: string) => {
  if (status === 'scheduled') return 'border-[#ffc24b]/30 bg-[#ffc24b]/16 text-[#ffa303]';
  if (status === 'completed') return 'border-[#63e1a5]/25 bg-[#63e1a5]/14 text-[#2f9f6b]';
  return 'border-[#ff4b8c]/20 bg-[#ff4b8c]/10 text-[#ff4b8c]';
};

const statusLabel = (status: string) => {
  if (status === 'scheduled') return 'Agendada';
  if (status === 'completed') return 'Concluída';
  return 'Cancelada';
};

const pad = (value: number) => String(value).padStart(2, '0');

const toDateKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const toTimeKey = (date: Date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

const buildLocalDateTimeValue = (dateKey: string, time: string) => new Date(`${dateKey}T${time}:00`).toISOString();

const formatMonthTitle = (date: Date) => date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

const formatInterviewDate = (value: string) => new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

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

export const CompanyCandidateInterviewsPanel = ({
  applicant,
  selectedJob,
  companyJobs,
  interviews,
  selectedCompany,
  handleCreateInterview,
  handleUpdateInterviewStatus,
  setActiveVideoMeeting
}: CompanyCandidateInterviewsPanelProps) => {
  const today = useMemo(() => new Date(), []);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDateKey, setSelectedDateKey] = useState(() => toDateKey(today));
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [notes, setNotes] = useState('');

  if (!applicant) return null;

  const companyJobIds = companyJobs.map(job => job.id);
  const candidateEmail = applicant.candidate_email || applicant.email;
  const companyInterviews = interviews.filter(item => companyJobIds.includes(item.job_id));
  const scheduledCompanyInterviews = companyInterviews.filter(item => item.status === 'scheduled');
  const candidateInterviews = companyInterviews.filter(item => item.candidate_email === candidateEmail);
  const matchedJob = selectedJob || companyJobs.find(job => job.id === applicant.job_id);

  const calendarDays = getCalendarDays(visibleMonth);
  const interviewsByDate = scheduledCompanyInterviews.reduce<Record<string, CompanyInterview[]>>((acc, item) => {
    const date = new Date(item.date_time);
    const key = toDateKey(date);
    acc[key] = [...(acc[key] || []), item];
    return acc;
  }, {});

  const selectedDayInterviews = [...(interviewsByDate[selectedDateKey] || [])]
    .sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime());
  const selectedDateTime = buildLocalDateTimeValue(selectedDateKey, selectedTime);
  const hasTimeConflict = selectedDayInterviews.some(item => toTimeKey(new Date(item.date_time)) === selectedTime);

  const goToPreviousMonth = () => {
    setVisibleMonth((previous) => new Date(previous.getFullYear(), previous.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setVisibleMonth((previous) => new Date(previous.getFullYear(), previous.getMonth() + 1, 1));
  };

  return (
    <div className="space-y-4">
      {matchedJob && (
        <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)] text-left">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold tracking-tight text-[#343241]">Agendar entrevista</h4>
              <p className="mt-1 text-[12px] font-medium text-slate-400">Escolha um dia e horário livre acompanhando as entrevistas já marcadas.</p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#533af6]/15 bg-white text-[#533af6] shadow-sm">
              <CalendarClock size={18} />
            </div>
          </div>

          <form
            onSubmit={async (event) => {
              event.preventDefault();

              if (hasTimeConflict) {
                alert('Já existe uma entrevista marcada para esta data e horário. Escolha outro horário.');
                return;
              }

              if (!matchedJob.id || !candidateEmail) {
                alert('Nao foi possivel identificar a vaga ou o e-mail do candidato.');
                return;
              }

              await handleCreateInterview(matchedJob.id, candidateEmail, selectedDateTime, notes);
              setNotes('');
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
              <div className="rounded-2xl border border-slate-200/70 bg-[#fbf9ff] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={goToPreviousMonth}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/80 bg-white text-slate-400 shadow-sm transition-all hover:bg-[#f3e5ff] hover:text-[#940dff] active:scale-95 cursor-pointer"
                    aria-label="Mês anterior"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <h5 className="text-sm font-semibold capitalize tracking-tight text-[#343241]">{formatMonthTitle(visibleMonth)}</h5>
                  <button
                    type="button"
                    onClick={goToNextMonth}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/80 bg-white text-slate-400 shadow-sm transition-all hover:bg-[#f3e5ff] hover:text-[#940dff] active:scale-95 cursor-pointer"
                    aria-label="Próximo mês"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-400">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => <span key={day}>{day}</span>)}
                </div>

                <div className="mt-2 grid grid-cols-7 gap-1.5">
                  {calendarDays.map((day) => {
                    const dayKey = toDateKey(day);
                    const isCurrentMonth = day.getMonth() === visibleMonth.getMonth();
                    const isSelected = dayKey === selectedDateKey;
                    const dayInterviews = interviewsByDate[dayKey] || [];

                    return (
                      <button
                        key={dayKey}
                        type="button"
                        onClick={() => setSelectedDateKey(dayKey)}
                        className={`relative flex aspect-square min-h-0 flex-col items-center justify-center rounded-xl border text-[12px] font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#940dff] bg-[#940dff] text-white shadow-sm'
                            : isCurrentMonth
                              ? 'border-white/80 bg-white text-slate-500 hover:border-[#f3e5ff] hover:text-[#940dff]'
                              : 'border-transparent bg-transparent text-slate-300'
                        }`}
                      >
                        <span>{day.getDate()}</span>
                        {dayInterviews.length > 0 && (
                          <span className={`mt-1 rounded-full px-1.5 text-[9px] font-semibold ${isSelected ? 'bg-white/20 text-white' : 'bg-[#ffc24b]/16 text-[#ffa303]'}`}>
                            {dayInterviews.length}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/70 bg-white p-4">
                <div className="mb-4">
                  <h5 className="text-sm font-semibold tracking-tight text-[#343241]">Horários do dia</h5>
                  <p className="mt-1 text-[12px] font-medium text-slate-400">
                    {new Date(`${selectedDateKey}T12:00`).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
                  </p>
                </div>

                <div className="mb-4 max-h-[190px] space-y-2 overflow-y-auto pr-1 no-scrollbar">
                  {selectedDayInterviews.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-[#fbf9ff] px-3 py-4 text-center text-[12px] font-medium text-slate-400">
                      Nenhuma entrevista marcada neste dia.
                    </div>
                  ) : (
                    selectedDayInterviews.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#ffc24b]/24 bg-[#ffc24b]/10 px-3 py-2">
                        <span className="text-[12px] font-semibold text-[#ffa303]">{toTimeKey(new Date(item.date_time))}</span>
                        <span className="truncate text-[11px] font-medium text-slate-500">{item.candidate_email}</span>
                      </div>
                    ))
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold text-slate-400">Novo horário</label>
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(event) => setSelectedTime(event.target.value)}
                      className={`h-8 w-full rounded-xl border bg-white px-3 text-[12px] font-medium outline-none transition-all focus:ring-4 ${hasTimeConflict ? 'border-[#ff4b8c]/35 text-[#ff4b8c] focus:border-[#ff4b8c]/45 focus:ring-[#ff4b8c]/10' : 'border-slate-200 text-slate-500 focus:border-[#533af6]/50 focus:ring-[#533af6]/10'}`}
                    />
                    {hasTimeConflict && (
                      <p className="mt-1.5 text-[11px] font-medium text-[#ff4b8c]">Este horário já está ocupado.</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold text-slate-400">Instruções para o candidato</label>
                    <textarea
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder="Ex: trazer portfólio, preparar apresentação ou escolher um local silencioso."
                      rows={3}
                      className="min-h-[88px] w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-medium leading-relaxed text-slate-500 outline-none transition-all placeholder:text-slate-300 focus:border-[#533af6]/50 focus:ring-4 focus:ring-[#533af6]/10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={hasTimeConflict}
                className="flex h-8 items-center justify-center gap-2 rounded-xl border border-[#940dff] bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-sm transition-all hover:bg-[#8200e6] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                <CalendarClock size={14} />
                Agendar entrevista
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)] text-left">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold tracking-tight text-[#343241]">Entrevistas agendadas</h4>
            <p className="mt-1 text-[12px] font-medium text-slate-400">Acompanhe histórico, status e acesso às salas de vídeo.</p>
          </div>
          <span className="shrink-0 whitespace-nowrap rounded-xl border border-[#f3e5ff] bg-[#f3e5ff] px-2.5 py-1 text-[11px] font-semibold text-[#940dff] sm:px-3">
            {candidateInterviews.length} {candidateInterviews.length === 1 ? 'entrevista' : 'entrevistas'}
          </span>
        </div>

        {candidateInterviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 px-4 py-8 text-center text-[12px] font-medium text-slate-400">
            Nenhuma entrevista agendada com este candidato.
          </div>
        ) : (
          <div className="space-y-3">
            {candidateInterviews.map((item) => {
              const formattedDate = formatInterviewDate(item.date_time);

              return (
                <article key={item.id} className="rounded-2xl border border-slate-200/70 bg-white p-4 transition-all hover:border-[#533af6]/18">
                  <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold tracking-tight text-[#343241]">{formattedDate}</span>
                        <span className={`rounded-xl border px-3 py-1 text-[11px] font-semibold ${statusStyle(item.status)}`}>
                          {statusLabel(item.status)}
                        </span>
                      </div>
                      {item.notes && (
                        <p className="mt-3 whitespace-pre-line rounded-xl border border-slate-100 bg-[#fbf9ff] p-3 text-[12px] font-medium leading-relaxed text-slate-500">
                          {item.notes}
                        </p>
                      )}
                    </div>

                    {item.status === 'scheduled' && (
                      <div className="flex shrink-0 flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveVideoMeeting({ interviewId: item.id, roomName: item.room_name, userName: selectedCompany?.nomeFantasia || 'Empresa Colaborh' })}
                          className="flex h-8 items-center justify-center gap-1.5 rounded-xl border border-[#533af6] bg-[#533af6] px-4 text-[12px] font-semibold text-white transition-all hover:bg-[#4326e5] cursor-pointer"
                        >
                          <Video size={14} /> Entrar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateInterviewStatus(item.id, 'completed')}
                          className="flex h-8 items-center justify-center gap-1.5 rounded-xl border border-[#63e1a5]/25 bg-[#63e1a5]/14 px-4 text-[12px] font-semibold text-[#2f9f6b] transition-all hover:bg-[#63e1a5]/20 cursor-pointer"
                        >
                          <Check size={14} /> Concluir
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateInterviewStatus(item.id, 'cancelled')}
                          className="flex h-8 items-center justify-center gap-1.5 rounded-xl border border-[#ff4b8c]/20 bg-[#ff4b8c]/10 px-4 text-[12px] font-semibold text-[#ff4b8c] transition-all hover:bg-[#ff4b8c]/15 cursor-pointer"
                        >
                          <CloseIcon size={14} /> Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
