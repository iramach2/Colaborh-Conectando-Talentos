import { Dispatch, SetStateAction } from 'react';
import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  Clock,
  Filter,
  Loader2,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'motion/react';
import { LoadingAnimation } from '../Loader';
import type { CompanyApplication, CompanyJob } from '../../types/companyDashboard';
import { getCurrentJobStages } from '../../utils/companyDashboardUtils';
import { cleanEmojiFromText } from '../../utils/candidateVacancyText';

interface CandidateVacanciesTabProps {
  activeVacancySubTab: 'todas' | 'minhas';
  setActiveVacancySubTab: Dispatch<SetStateAction<'todas' | 'minhas'>>;
  vacancySearch: string;
  setVacancySearch: Dispatch<SetStateAction<string>>;
  setIsFilterSidebarOpen: Dispatch<SetStateAction<boolean>>;
  vacancyModalityFilter: string;
  vacancyContractFilter: string;
  vacancyStateFilter: string;
  vacancyCityFilter: string;
  isFetchingVacancies: boolean;
  vacancyLoadError: string | null;
  setVacancyReloadKey: Dispatch<SetStateAction<number>>;
  vacancies: CompanyJob[];
  filteredVacancies: CompanyJob[];
  appliedJobIds: string[];
  isApplying: string | null;
  handleApply: (job: CompanyJob) => void;
  setSelectedJobForDetails: Dispatch<SetStateAction<CompanyJob | null>>;
  clearVacancyFilters: () => void;
  myApplications: CompanyApplication[];
}

const extractLocation = (job: CompanyJob) => {
  if (job.city && job.state) return `${cleanEmojiFromText(job.city)}, ${cleanEmojiFromText(job.state)}`;
  if (job.city) return cleanEmojiFromText(job.city);
  if (job.state) return cleanEmojiFromText(job.state);

  const locMatch = (job.description || '').match(/Localização:\s*([^\n]+)/i);
  if (locMatch?.[1]) return cleanEmojiFromText(locMatch[1].trim());

  return cleanEmojiFromText(job.modality || 'Remoto');
};

const getJobInitials = (title: string) => {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  return words[0] ? words[0].substring(0, 2).toUpperCase() : 'VG';
};

const cleanJobDescription = (description?: string | null) => cleanEmojiFromText(
  (description || '')
    .split('===ETAPAS_JSON===')[0]
    .replace(/Localização:[^\n]*\n?/gi, '')
    .replace(/Contratação:[^\n]*\n?/gi, '')
    .replace(/Escala:[^\n]*\n?/gi, '')
    .replace(/Idade Mínima:[^\n]*\n?/gi, '')
    .trim(),
);

const formatApplicationDate = (date?: string | null) => {
  if (!date) return 'Recentemente';
  return new Date(date).toLocaleDateString('pt-BR');
};

export function CandidateVacanciesTab({
  activeVacancySubTab,
  setActiveVacancySubTab,
  vacancySearch,
  setVacancySearch,
  setIsFilterSidebarOpen,
  vacancyModalityFilter,
  vacancyContractFilter,
  vacancyStateFilter,
  vacancyCityFilter,
  isFetchingVacancies,
  vacancyLoadError,
  setVacancyReloadKey,
  vacancies,
  filteredVacancies,
  appliedJobIds,
  isApplying,
  handleApply,
  setSelectedJobForDetails,
  clearVacancyFilters,
  myApplications,
}: CandidateVacanciesTabProps) {
  const hasActiveFilters = Boolean(vacancyModalityFilter || vacancyContractFilter || vacancyStateFilter || vacancyCityFilter);
  const tabs = [
    { id: 'todas' as const, label: 'Todas as vagas', count: filteredVacancies.length || vacancies.length },
    { id: 'minhas' as const, label: 'Minhas candidaturas', count: myApplications.length },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-h-[38px] flex-wrap items-center gap-5">
          {tabs.map((tab) => {
            const isActive = activeVacancySubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveVacancySubTab(tab.id)}
                className={`relative flex h-[38px] min-w-[150px] items-center justify-center gap-2 bg-transparent px-4 py-2 text-[12px] font-semibold transition-colors ${
                  isActive ? 'text-[#940dff]' : 'text-slate-500 hover:text-[#940dff]'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[11px] font-semibold ${isActive ? 'text-current' : 'text-slate-400'}`}>
                  {tab.count}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="candidate-vacancies-tab-underline"
                    className="absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-[#940dff]"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {activeVacancySubTab === 'todas' && (
          <div className="flex w-full items-center gap-3 lg:w-auto">
            <div className="relative min-w-0 flex-1 lg:w-[360px] lg:flex-none">
              <input
                type="text"
                value={vacancySearch}
                onChange={(event) => setVacancySearch(event.target.value)}
                placeholder="Pesquisar vagas..."
                className="h-10 w-full rounded-full border border-slate-200/80 bg-white px-4 pl-10 pr-10 text-[12px] font-semibold text-[#343241] shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-[#940dff]/30 focus:ring-4 focus:ring-[#940dff]/10"
              />
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#940dff]" />
              {vacancySearch && (
                <button
                  type="button"
                  onClick={() => setVacancySearch('')}
                  className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-transparent text-slate-400 transition-colors hover:text-[#940dff]"
                  aria-label="Limpar busca"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsFilterSidebarOpen(true)}
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#940dff] bg-[#940dff] text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95"
              title="Filtrar vagas"
            >
              <SlidersHorizontal size={16} />
              {hasActiveFilters && (
                <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#ff4b8c]" />
              )}
            </button>
          </div>
        )}
      </div>

      {activeVacancySubTab === 'todas' ? (
        <AllVacanciesList
          isFetchingVacancies={isFetchingVacancies}
          vacancyLoadError={vacancyLoadError}
          setVacancyReloadKey={setVacancyReloadKey}
          vacancies={vacancies}
          filteredVacancies={filteredVacancies}
          appliedJobIds={appliedJobIds}
          isApplying={isApplying}
          handleApply={handleApply}
          setSelectedJobForDetails={setSelectedJobForDetails}
          clearVacancyFilters={clearVacancyFilters}
        />
      ) : (
        <MyApplicationsList
          vacancies={vacancies}
          myApplications={myApplications}
          setSelectedJobForDetails={setSelectedJobForDetails}
        />
      )}
    </motion.section>
  );
}

function AllVacanciesList({
  isFetchingVacancies,
  vacancyLoadError,
  setVacancyReloadKey,
  vacancies,
  filteredVacancies,
  appliedJobIds,
  isApplying,
  handleApply,
  setSelectedJobForDetails,
  clearVacancyFilters,
}: Pick<
  CandidateVacanciesTabProps,
  | 'isFetchingVacancies'
  | 'vacancyLoadError'
  | 'setVacancyReloadKey'
  | 'vacancies'
  | 'filteredVacancies'
  | 'appliedJobIds'
  | 'isApplying'
  | 'handleApply'
  | 'setSelectedJobForDetails'
  | 'clearVacancyFilters'
>) {
  if (isFetchingVacancies) {
    return (
      <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-12 text-center shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
        <LoadingAnimation message="Buscando melhores oportunidades..." />
      </div>
    );
  }

  if (vacancyLoadError) {
    return (
      <div className="rounded-2xl border border-[#ff4b8c]/20 bg-white/85 p-14 text-center shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff4b8c]/10 text-[#ff4b8c]">
          <AlertTriangle size={24} />
        </div>
        <h3 className="text-[16px] font-semibold text-[#343241]">Não foi possível carregar as vagas</h3>
        <p className="mx-auto mt-2 max-w-xl text-[12px] font-medium text-slate-400">{vacancyLoadError}</p>
        <button
          type="button"
          onClick={() => setVacancyReloadKey((value) => value + 1)}
          className="mt-6 h-8 rounded-xl bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (vacancies.length === 0) {
    return (
      <EmptyVacancies
        icon={Briefcase}
        title="Aguardando oportunidades"
        description="As empresas ainda estão preparando as melhores vagas para você."
      />
    );
  }

  if (filteredVacancies.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-14 text-center shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3e5ff] text-[#940dff]">
          <Filter size={22} />
        </div>
        <h3 className="text-[16px] font-semibold text-[#343241]">Nenhuma vaga encontrada</h3>
        <p className="mx-auto mt-2 max-w-xl text-[12px] font-medium text-slate-400">
          Não encontramos vagas que correspondam aos termos de busca e filtros selecionados.
        </p>
        <button
          type="button"
          onClick={clearVacancyFilters}
          className="mt-6 h-8 rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12"
        >
          Limpar filtros
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/85 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
      <div className="hidden grid-cols-[minmax(260px,1.6fr)_1fr_0.8fr_0.8fr_220px] gap-4 border-b border-slate-100 bg-[#fbfaff] px-5 py-3 text-[11px] font-semibold text-slate-400 lg:grid">
        <span>Vaga</span>
        <span>Local</span>
        <span>Salário</span>
        <span>Jornada</span>
        <span className="text-right">Ações</span>
      </div>
      <div className="divide-y divide-slate-100">
        {filteredVacancies.map((job) => {
          const title = cleanEmojiFromText(job.title || 'Vaga sem título');
          const description = cleanJobDescription(job.description) || 'Nenhuma descrição fornecida para esta oportunidade.';
          const isApplied = Boolean(job.id && appliedJobIds.includes(job.id));
          const isCurrentApplying = isApplying === job.id;

          return (
            <div
              key={job.id || title}
              className="group grid gap-4 px-5 py-4 transition-colors hover:bg-[#fbfaff] lg:grid-cols-[minmax(260px,1.6fr)_1fr_0.8fr_0.8fr_220px] lg:items-center"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 select-none items-center justify-center rounded-2xl border border-[#940dff]/18 bg-[#f3e5ff] text-[12px] font-semibold text-[#940dff]">
                  {getJobInitials(title)}
                </div>
                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() => setSelectedJobForDetails(job)}
                    className="block max-w-full truncate border-0 bg-transparent p-0 text-left text-[14px] font-semibold text-[#343241] transition-colors group-hover:text-[#940dff]"
                    title={title}
                  >
                    {title}
                  </button>
                  <p className="mt-1 text-[12px] font-medium text-slate-400">
                    {cleanEmojiFromText(job.company_name || 'Empresa parceira')}
                  </p>
                  <p className="mt-2 line-clamp-2 text-[12px] font-medium leading-relaxed text-slate-500 lg:hidden">
                    {description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-lg border border-[#940dff]/16 bg-[#f3e5ff] px-2 py-1 text-[10px] font-semibold text-[#940dff]">
                      {cleanEmojiFromText(job.modality || 'Remoto')}
                    </span>
                    {job.contract_type && (
                      <span className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-500">
                        {cleanEmojiFromText(job.contract_type)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <InfoCell icon={MapPin} label="Local" value={extractLocation(job)} />
              <InfoCell label="Salário" value={cleanEmojiFromText(job.salary || 'A combinar')} />
              <InfoCell icon={Clock} label="Jornada" value={cleanEmojiFromText(job.work_schedule || 'A combinar')} />

              <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedJobForDetails(job)}
                  className="h-8 rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12"
                >
                  Detalhes
                </button>
                <button
                  type="button"
                  onClick={() => handleApply(job)}
                  disabled={isApplied || isCurrentApplying}
                  className={`flex h-8 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-semibold transition-all active:scale-95 disabled:cursor-default ${
                    isApplied
                      ? 'border border-[#63e1a5]/20 bg-[#63e1a5]/14 text-[#2f9f6b]'
                      : 'bg-[#940dff] text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] hover:bg-[#8200e6]'
                  }`}
                >
                  {isCurrentApplying && <Loader2 size={13} className="animate-spin" />}
                  {isApplied ? (
                    <>
                      <CheckCircle2 size={13} />
                      Candidatado
                    </>
                  ) : (
                    'Candidatar-se'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MyApplicationsList({
  vacancies,
  myApplications,
  setSelectedJobForDetails,
}: Pick<CandidateVacanciesTabProps, 'vacancies' | 'myApplications' | 'setSelectedJobForDetails'>) {
  if (myApplications.length === 0) {
    return (
      <EmptyVacancies
        icon={Briefcase}
        title="Nenhuma candidatura"
        description="Você ainda não se candidatou a nenhuma vaga."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/85 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
      <div className="hidden grid-cols-[minmax(260px,1.5fr)_1fr_1fr_160px] gap-4 border-b border-slate-100 bg-[#fbfaff] px-5 py-3 text-[11px] font-semibold text-slate-400 lg:grid">
        <span>Vaga</span>
        <span>Status</span>
        <span>Enviado em</span>
        <span className="text-right">Ações</span>
      </div>
      <div className="divide-y divide-slate-100">
        {myApplications.map((app, index) => {
          const job = vacancies.find((vacancy) => vacancy.id === app.job_id) || app.job || app.jobs || null;
          const title = cleanEmojiFromText(job?.title || 'Candidatura enviada');
          const stagesList = job ? getCurrentJobStages(job) : [];
          const currentStatus = app.status || 'Triagem';
          const firstStageName = stagesList[0] || 'Triagem';
          const normalizedStatus = currentStatus === 'Triagem' ? firstStageName : currentStatus;

          return (
            <div
              key={app.id || `${app.job_id}-${index}`}
              className="group grid gap-4 px-5 py-4 transition-colors hover:bg-[#fbfaff] lg:grid-cols-[minmax(260px,1.5fr)_1fr_1fr_160px] lg:items-center"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 select-none items-center justify-center rounded-2xl border border-[#940dff]/18 bg-[#f3e5ff] text-[12px] font-semibold text-[#940dff]">
                  {getJobInitials(title)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-[#343241] group-hover:text-[#940dff]" title={title}>
                    {title}
                  </p>
                  <p className="mt-1 text-[12px] font-medium text-slate-400">
                    {cleanEmojiFromText(job?.company_name || 'Empresa parceira')}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-400 lg:hidden">Status</p>
                <span className="inline-flex h-7 items-center rounded-lg border border-[#940dff]/16 bg-[#f3e5ff] px-3 text-[11px] font-semibold text-[#940dff]">
                  {cleanEmojiFromText(normalizedStatus)}
                </span>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-400 lg:hidden">Enviado em</p>
                <p className="text-[12px] font-medium text-slate-500">{formatApplicationDate(app.created_at)}</p>
              </div>

              <div className="flex justify-start lg:justify-end">
                {job && (
                  <button
                    type="button"
                    onClick={() => setSelectedJobForDetails(job)}
                    className="h-8 rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12"
                  >
                    Ver detalhes
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InfoCell({ icon: Icon, label, value }: { icon?: LucideIcon; label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 lg:hidden">
        {Icon && <Icon size={12} className="text-[#940dff]" />}
        {label}
      </p>
      <p className="truncate text-[12px] font-medium text-slate-500" title={value}>
        {value}
      </p>
    </div>
  );
}

function EmptyVacancies({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-14 text-center shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3e5ff] text-[#940dff]">
        <Icon size={22} />
      </div>
      <h3 className="text-[16px] font-semibold text-[#343241]">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-[12px] font-medium text-slate-400">{description}</p>
    </div>
  );
}