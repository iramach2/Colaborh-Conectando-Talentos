import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import {
  Briefcase,
  CalendarDays,
  Copy,
  MapPin,
  MoreVertical,
  Plus,
  Share2,
  Trash2,
  Users,
} from 'lucide-react';
import { cleanEmojiFromText } from '../../../utils/companyDashboardUtils';
import type { CompanyJob } from '../../../types/companyDashboard';
import { LoadingAnimation } from '../../Loader';

type JobSubTab = 'active' | 'paused' | 'closed';

interface MyVacanciesListViewProps {
  jobs: CompanyJob[];
  isFetchingJobs: boolean;
  jobSubTab: JobSubTab;
  searchTerm: string;
  activeDropdownJobId: string | null;
  setActiveDropdownJobId: React.Dispatch<React.SetStateAction<string | null>>;
  handleViewApplicants: (job: CompanyJob) => void;
  handleUpdateJobStatus: (jobId: string, status: string) => void;
  handleShareJob: (job: CompanyJob) => void;
  handleDeleteJob: (jobId: string, jobTitle: string) => void;
  setIsRegisteringVacancy: (val: boolean) => void;
  setRegisterStep: (step: number) => void;
  onCreateVacancy?: () => void;
}

const normalizeStatus = (status?: string | null) =>
  (status || '').toLowerCase().trim();

const getJobInitials = (title?: string | null) => {
  if (!title) return 'VA';
  const cleanTitle = cleanEmojiFromText(title);
  const words = cleanTitle.trim().split(/\s+/).filter((word) => word.length > 0);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return cleanTitle.substring(0, 2).toUpperCase();
};

const getStatusMeta = (status?: string | null) => {
  const normalized = normalizeStatus(status);
  if (['paused', 'pausada'].includes(normalized)) {
    return { label: 'Pausada', dot: '#ffc24b', bg: 'bg-[#ffc24b]/16', text: 'text-[#ffa303]' };
  }
  if (['closed', 'encerrada'].includes(normalized)) {
    return { label: 'Encerrada', dot: '#ff4b8c', bg: 'bg-[#ff4b8c]/10', text: 'text-[#ff4b8c]' };
  }
  return { label: 'Ativa', dot: '#63e1a5', bg: 'bg-[#63e1a5]/14', text: 'text-[#40b87f]' };
};

const isSubTabMatch = (job: CompanyJob, jobSubTab: JobSubTab) => {
  const normalizedStatus = normalizeStatus(job.status);
  if (jobSubTab === 'active') {
    return ['', 'active', 'ativa', 'published', 'publicada', 'open', 'aberta'].includes(normalizedStatus);
  }
  if (jobSubTab === 'paused') return ['paused', 'pausada'].includes(normalizedStatus);
  return ['closed', 'encerrada'].includes(normalizedStatus);
};

const filterJobs = (jobs: CompanyJob[], jobSubTab: JobSubTab, searchTerm: string) => (
  jobs.filter((job) => {
    if (!isSubTabMatch(job, jobSubTab)) return false;
    if (searchTerm.trim() === '') return true;

    const query = searchTerm.toLowerCase();
    return [
      job.title,
      job.role,
      job.modality,
      job.city,
      job.state,
      job.contract_type,
    ].some((value) => value?.toLowerCase().includes(query));
  })
);

const formatDate = (date?: string | null) => (
  date ? new Date(date).toLocaleDateString('pt-BR') : 'Recentemente'
);

const getLocationLabel = (job: CompanyJob) => {
  const cityState = [job.city, job.state].filter(Boolean).join(', ');
  return cityState || 'Local não informado';
};

const getPositionsLabel = (positions?: number | string | null) => {
  const value = Number(positions || 1);
  if (!Number.isFinite(value) || value <= 1) return '1 vaga';
  return `${value} vagas`;
};

const statusOptions = [
  { label: 'Ativa', value: 'active', color: 'bg-[#63e1a5]' },
  { label: 'Pausada', value: 'paused', color: 'bg-[#ffc24b]' },
  { label: 'Encerrada', value: 'closed', color: 'bg-[#ff4b8c]' },
];

type DropdownPosition = {
  top: number;
  left: number;
};

export const MyVacanciesListView: React.FC<MyVacanciesListViewProps> = ({
  jobs,
  isFetchingJobs,
  jobSubTab,
  searchTerm,
  activeDropdownJobId,
  setActiveDropdownJobId,
  handleViewApplicants,
  handleUpdateJobStatus,
  handleShareJob,
  handleDeleteJob,
  setIsRegisteringVacancy,
  setRegisterStep,
  onCreateVacancy,
}) => {
  const [dropdownPosition, setDropdownPosition] = React.useState<DropdownPosition | null>(null);

  const filteredJobs = React.useMemo(
    () => filterJobs(jobs, jobSubTab, searchTerm),
    [jobs, jobSubTab, searchTerm],
  );

  const renderEmptyState = (title: string, description: string, showCreateButton = false) => (
    <div className="bg-white/85 backdrop-blur-md border border-slate-200/70 p-16 rounded-2xl text-center shadow-[0_10px_28px_rgba(15,23,42,0.035)] select-none">
      <div className="w-14 h-14 bg-[#533af6]/10 text-[#533af6] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/50 shadow-sm">
        <Briefcase size={24} className="stroke-[2]" />
      </div>
      <h3 className="text-lg font-semibold text-[#343241] tracking-tight mb-1">{title}</h3>
      <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6 font-medium leading-relaxed">{description}</p>
      {showCreateButton && (
        <button
          onClick={() => {
            if (onCreateVacancy) {
              onCreateVacancy();
              return;
            }
            setIsRegisteringVacancy(true);
            setRegisterStep(1);
          }}
          className="px-6 py-2.5 bg-[#940dff] hover:bg-[#8200e6] text-white rounded-xl font-semibold text-[12px] shadow-md shadow-[#940dff]/15 hover:shadow-lg transition-all cursor-pointer border-0"
        >
          Publicar primeira vaga
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-4 pb-20 sm:pb-0">
      <motion.div
        key="minhas-vagas-list"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full flex flex-col gap-6"
      >
        {isFetchingJobs ? (
          <div className="py-16 text-center">
            <LoadingAnimation message="Carregando suas vagas..." />
          </div>
        ) : jobs.length > 0 ? (
          filteredJobs.length === 0 ? (
            renderEmptyState(
              searchTerm.trim() !== '' ? 'Nenhuma vaga encontrada' : 'Nenhuma vaga nesta categoria',
              searchTerm.trim() !== '' ? 'Não encontramos vagas correspondentes à sua pesquisa.' : 'Não encontramos vagas com o status selecionado.',
            )
          ) : (
            <div className="w-full overflow-visible text-left">
              <div className="hidden xl:grid grid-cols-[minmax(240px,0.9fr)_110px_minmax(130px,0.7fr)_minmax(130px,0.7fr)_120px_110px_120px_246px] items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                <span>Vaga</span>
                <span className="text-center">Status</span>
                <span className="inline-flex items-center justify-center gap-1.5"><MapPin size={12} /> Local</span>
                <span className="inline-flex items-center justify-center gap-1.5"><Copy size={12} /> Modalidade</span>
                <span className="inline-flex items-center justify-center gap-1.5"><CalendarDays size={12} /> Criada em</span>
                <span className="inline-flex items-center justify-center gap-1.5"><Users size={12} /> Candidatos</span>
                <span className="inline-flex items-center justify-center gap-1.5"><Briefcase size={12} /> Posições</span>
                <span className="sr-only">Ações</span>
              </div>
              <div className="overflow-visible rounded-2xl border border-slate-200/70 bg-white/75 shadow-[0_10px_28px_rgba(15,23,42,0.035)] divide-y divide-slate-200/80">
              {filteredJobs.map((job, index) => {
                const title = cleanEmojiFromText(job.title || 'Vaga sem título');
                const status = getStatusMeta(job.status);
                const candidatesCount = job.candidates_count || 0;
                const rowKey = job.id || `${title}-${index}`;

                return (
                  <motion.div
                    key={rowKey}
                    whileHover={{ y: -2 }}
                    className={`backdrop-blur-md px-4 py-4 sm:py-3 hover:bg-white transition-all duration-300 group relative ${index === 0 ? 'rounded-t-2xl' : ''} ${index === filteredJobs.length - 1 ? 'rounded-b-2xl' : ''} ${index % 2 === 0 ? 'bg-white/95' : 'bg-slate-50/60'}`}
                  >
                    <div className="xl:hidden">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#940dff]/18 bg-[#f3e5ff] text-[12px] font-semibold text-[#940dff] select-none">
                            {getJobInitials(title)}
                          </div>
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => handleViewApplicants(job)}
                              className="block max-w-full truncate border-0 bg-transparent p-0 text-left text-[13px] font-semibold tracking-tight text-[#343241] transition-colors group-hover:text-[#940dff] cursor-pointer"
                              title={title}
                            >
                              {title}
                            </button>
                            <p className="mt-1 truncate text-[11px] font-medium text-slate-400">
                              {cleanEmojiFromText(job.role || job.contract_type || 'Cargo operacional')}
                            </p>
                          </div>
                        </div>

                        <span className={'inline-flex shrink-0 items-center gap-2 text-[12px] font-medium ' + status.text}>
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: status.dot }} />
                          {status.label}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl border border-slate-100 bg-white/70 p-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Local</p>
                          <p className="mt-1 truncate text-[12px] font-medium text-slate-500">{cleanEmojiFromText(getLocationLabel(job))}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Modalidade</p>
                          <p className="mt-1 truncate text-[12px] font-medium text-slate-500">{cleanEmojiFromText(job.modality || 'Não informada')}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Candidatos</p>
                          <p className="mt-1 text-[12px] font-semibold text-[#343241]">{candidatesCount}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Posições</p>
                          <p className="mt-1 text-[12px] font-medium text-slate-500">{getPositionsLabel(job.positions)}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                        <button
                          onClick={() => handleViewApplicants(job)}
                          className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12 active:scale-95 cursor-pointer whitespace-nowrap"
                          title="Ver processo seletivo"
                        >
                          Ver processo
                        </button>
                        <button
                          onClick={() => handleShareJob(job)}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-0 bg-[#533af6]/10 text-[#533af6] transition-all hover:bg-[#533af6]/15 cursor-pointer"
                          title="Compartilhar vaga"
                        >
                          <Share2 size={13} className="stroke-[2.5]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteJob(job.id || '', job.title || 'Vaga')}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-0 bg-slate-50 text-slate-400 transition-all hover:bg-[#ff4b8c]/10 hover:text-[#ff4b8c] cursor-pointer"
                          title="Excluir vaga"
                        >
                          <Trash2 size={13} className="stroke-[2.5]" />
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            if (activeDropdownJobId === job.id) {
                              setActiveDropdownJobId(null);
                              setDropdownPosition(null);
                              return;
                            }

                            const rect = event.currentTarget.getBoundingClientRect();
                            const menuWidth = 224;
                            const menuHeight = 190;
                            const gap = 8;
                            const top = rect.bottom + menuHeight + gap > window.innerHeight
                              ? Math.max(16, rect.top - menuHeight - gap)
                              : rect.bottom + gap;
                            const left = Math.min(
                              Math.max(16, rect.right - menuWidth),
                              window.innerWidth - menuWidth - 16,
                            );

                            setDropdownPosition({ top, left });
                            setActiveDropdownJobId(job.id || null);
                          }}
                          className={
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-0 transition-all cursor-pointer outline-none ' +
                            (activeDropdownJobId === job.id
                              ? 'bg-[#533af6]/10 text-[#533af6]'
                              : 'bg-slate-50 text-slate-400 hover:bg-[#533af6]/10 hover:text-[#533af6]')
                          }
                          title="Opções da vaga"
                        >
                          <MoreVertical size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="hidden xl:grid xl:grid-cols-[minmax(240px,0.9fr)_110px_minmax(130px,0.7fr)_minmax(130px,0.7fr)_120px_110px_120px_246px] gap-3 xl:items-center">
                      <div className="col-span-2 flex min-w-0 items-center gap-3 pr-24 xl:col-span-1 xl:pr-0">
                        <div className="w-11 h-11 bg-[#f3e5ff] text-[#940dff] rounded-2xl flex items-center justify-center font-semibold text-[12px] shrink-0 border border-[#940dff]/18 select-none">
                          {getJobInitials(title)}
                        </div>
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => handleViewApplicants(job)}
                            className="text-left text-[13px] font-semibold text-[#343241] tracking-tight group-hover:text-[#940dff] transition-colors truncate block max-w-full border-0 bg-transparent p-0 cursor-pointer"
                            title={title}
                          >
                            {title}
                          </button>
                          <p className="text-[11px] font-medium text-slate-400 truncate mt-1">
                            {cleanEmojiFromText(job.role || job.contract_type || 'Cargo operacional')}
                          </p>
                        </div>
                      </div>

                      <div className="absolute right-4 top-5 flex items-center justify-center xl:static">
                        <span className={`inline-flex w-fit items-center gap-2 text-[12px] font-medium ${status.text}`}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: status.dot }} />
                          {status.label}
                        </span>
                      </div>

                      <span className="col-span-2 truncate text-left text-[12px] font-medium text-slate-500 sm:col-span-1 xl:col-span-1 xl:text-center">
                        {cleanEmojiFromText(getLocationLabel(job))}
                      </span>

                      <span className="text-[12px] font-medium text-slate-500 truncate text-center max-w-full">
                        {cleanEmojiFromText(job.modality || 'Não informada')}
                      </span>

                      <span className="hidden text-center text-[12px] font-medium text-slate-500 sm:block">
                        {formatDate(job.created_at)}
                      </span>

                      <span className="text-left text-[12px] font-semibold text-[#343241] xl:text-center">
                        {candidatesCount}
                      </span>

                      <span className="text-left text-[12px] font-medium text-slate-500 xl:text-center">
                        {getPositionsLabel(job.positions)}
                      </span>

                      <div className="col-span-2 flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row xl:col-span-1 xl:justify-end xl:border-t-0 xl:pt-0 xl:items-center">

                        <div className="flex items-center justify-between gap-2 sm:justify-end">
                          <button
                            onClick={() => handleViewApplicants(job)}
                            className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12 active:scale-95 cursor-pointer whitespace-nowrap sm:flex-none"
                            title="Ver processo seletivo"
                          >
                            Ver processo
                          </button>
                          <button
                            onClick={() => handleShareJob(job)}
                            className="w-9 h-9 bg-[#533af6]/10 text-[#533af6] hover:bg-[#533af6]/15 rounded-xl border-0 transition-all cursor-pointer flex items-center justify-center shrink-0"
                            title="Compartilhar vaga"
                          >
                            <Share2 size={13} className="stroke-[2.5]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteJob(job.id || '', job.title || 'Vaga')}
                            className="w-9 h-9 bg-slate-50 text-slate-400 hover:bg-[#ff4b8c]/10 hover:text-[#ff4b8c] rounded-xl border-0 transition-all cursor-pointer flex items-center justify-center shrink-0"
                            title="Excluir vaga"
                          >
                            <Trash2 size={13} className="stroke-[2.5]" />
                          </button>
                          <div className="relative shrink-0 z-[70]">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                if (activeDropdownJobId === job.id) {
                                  setActiveDropdownJobId(null);
                                  setDropdownPosition(null);
                                  return;
                                }

                                const rect = event.currentTarget.getBoundingClientRect();
                                const menuWidth = 224;
                                const menuHeight = 190;
                                const gap = 8;
                                const top = rect.bottom + menuHeight + gap > window.innerHeight
                                  ? Math.max(16, rect.top - menuHeight - gap)
                                  : rect.bottom + gap;
                                const left = Math.min(
                                  Math.max(16, rect.right - menuWidth),
                                  window.innerWidth - menuWidth - 16,
                                );

                                setDropdownPosition({ top, left });
                                setActiveDropdownJobId(job.id || null);
                              }}
                              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer border-0 outline-none ${
                                activeDropdownJobId === job.id
                                  ? 'bg-[#533af6]/10 text-[#533af6]'
                                  : 'hover:bg-[#533af6]/10 text-slate-400 hover:text-[#533af6]'
                              }`}
                              title="Opções da vaga"
                            >
                              <MoreVertical size={16} />
                            </button>

                            {activeDropdownJobId === job.id && dropdownPosition && typeof document !== 'undefined' && createPortal(
                              <>
                                <div
                                  className="fixed inset-0 z-[9998] bg-transparent"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setActiveDropdownJobId(null);
                                    setDropdownPosition(null);
                                  }}
                                />
                                <div
                                  className="company-dashboard-surface fixed z-[9999] w-56 rounded-2xl border border-white/80 bg-white/95 backdrop-blur-md p-2 text-left shadow-[0_18px_50px_rgba(106,66,220,0.16)]"
                                  style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
                                  onClick={(event) => event.stopPropagation()}
                                >

                                  <div className="mb-1 border-b border-slate-100 px-3 py-2 select-none">
                                    <p className="text-[12px] font-semibold text-[#940dff]">Alterar status</p>
                                    <p className="mt-0.5 text-[12px] font-medium text-slate-400">Atualize a situação desta vaga</p>
                                  </div>
                                  <div className="space-y-1 pt-1">
                                    {statusOptions.map((option) => (
                                      <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                          handleUpdateJobStatus(job.id || '', option.value);
                                          setActiveDropdownJobId(null);
                                          setDropdownPosition(null);
                                        }}
                                        className="flex h-9 w-full items-center gap-2 rounded-xl border-0 px-3 text-left text-[12px] font-semibold text-slate-500 transition-all hover:bg-[#f3e5ff]/55 hover:text-[#343241] cursor-pointer"
                                      >
                                        <span className={`w-2 h-2 rounded-full ${option.color}`} />
                                        {option.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </>,
                              document.body,
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              </div>
            </div>
          )
        ) : (
          renderEmptyState(
            'Nenhuma vaga publicada',
            'Você ainda não criou nenhuma oportunidade. Comece criando sua primeira vaga.',
            true,
          )
        )}
      </motion.div>

      <button
        type="button"
        onClick={() => {
          if (onCreateVacancy) {
            onCreateVacancy();
            return;
          }
          setIsRegisteringVacancy(true);
          setRegisterStep(1);
        }}
        className="fixed bottom-5 right-5 z-[80] flex h-12 w-12 items-center justify-center rounded-full border border-[#940dff] bg-[#940dff] text-white shadow-[0_16px_34px_rgba(148,13,255,0.28)] transition-all hover:bg-[#8200e6] active:scale-95 sm:hidden"
        title="Criar vaga"
      >
        <Plus size={22} className="stroke-[2.5]" />
      </button>
    </div>
  );
};




















