import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  DollarSign,
  Loader2,
  MapPin,
  Search,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import Loader from './Loader';
import type { CompanyJob } from '../types/companyDashboard';
import { fetchJobs } from '../services/jobService';
import { hydrateJobsWithWorkflow } from '../services/jobWorkflowService';
import { cleanEmojiFromText } from '../utils/candidateVacancyText';

type PublicJobsPageProps = {
  onBackHome: () => void;
  onLogin: () => void;
  onRegister: () => void;
  onApply: (job: CompanyJob) => void;
};

const isActiveJob = (job: CompanyJob) => {
  const status = (job.status || '').toLowerCase().trim();
  return ['', 'active', 'ativa', 'published', 'publicada', 'open', 'aberta'].includes(status);
};

const getJobInitials = (title?: string | null) => {
  const cleanTitle = cleanEmojiFromText(title || 'Vaga');
  const words = cleanTitle.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  return words[0] ? words[0].substring(0, 2).toUpperCase() : 'VG';
};

const getLocation = (job: CompanyJob) => {
  if (job.modality === 'Home Office') return 'Home Office';
  if (job.city && job.state) return `${cleanEmojiFromText(job.city)}, ${cleanEmojiFromText(job.state)}`;
  if (job.city) return cleanEmojiFromText(job.city);
  if (job.state) return cleanEmojiFromText(job.state);
  return cleanEmojiFromText(job.modality || 'Local não informado');
};

const getSalary = (job: CompanyJob) => {
  if (job.salary) return cleanEmojiFromText(job.salary);
  if (job.salary_min || job.salary_max) return `${job.salary_min || 'R$ 0,00'} até ${job.salary_max || 'A combinar'}`;
  return 'A combinar';
};

const openJobPage = (job: CompanyJob) => {
  if (!job.id) return;
  window.location.assign('/vaga/' + encodeURIComponent(job.id));
};

export function PublicJobsPage({ onBackHome, onLogin, onRegister, onApply }: PublicJobsPageProps) {
  const [jobs, setJobs] = useState<CompanyJob[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadJobs() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchJobs();
        const hydrated = await hydrateJobsWithWorkflow(data || []);
        const activeJobs = hydrated.filter(isActiveJob);

        if (isMounted) setJobs(activeJobs);
      } catch (err) {
        console.error('Erro ao carregar vagas públicas:', err);
        if (isMounted) {
          setError('Não foi possível carregar as vagas no momento. Tente novamente em alguns instantes.');
          setJobs([]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadJobs();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredJobs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return jobs;

    return jobs.filter((job) => {
      const haystack = [
        job.title,
        job.role,
        job.company_name,
        job.city,
        job.state,
        job.modality,
        job.contract_type,
        job.work_schedule,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [jobs, search]);

  const handleApply = (job: CompanyJob) => {
    setApplyingId(job.id || null);
    onApply(job);
    window.setTimeout(() => setApplyingId(null), 600);
  };

  return (
    <div className="company-dashboard-surface min-h-screen bg-[#fbf9ff] text-[#343241] selection:bg-[#f3e5ff] selection:text-[#940dff]">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/88 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-8 lg:px-10">
          <button type="button" onClick={onBackHome} className="flex items-center gap-3">
            <img src="/logo.png" alt="Colaborh" className="h-8 w-auto object-contain" />
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onLogin}
              className="h-9 rounded-full border border-slate-200/80 bg-white px-4 text-[12px] font-semibold text-slate-500 transition-all hover:border-[#940dff]/20 hover:text-[#940dff]"
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={onRegister}
              className="hidden h-9 rounded-full bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95 sm:inline-flex sm:items-center"
            >
              Criar conta
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-slate-200/70 bg-[#fbf9ff]">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 lg:px-10 lg:py-12">
            <button
              type="button"
              onClick={onBackHome}
              className="mb-6 inline-flex h-8 items-center gap-2 rounded-full border border-slate-200/80 bg-white px-3 text-[12px] font-semibold text-slate-500 transition-all hover:text-[#940dff]"
            >
              <ArrowLeft size={14} /> Voltar
            </button>

            <div className="grid gap-6 lg:grid-cols-[1fr_420px] lg:items-end">
              <div>
                <p className="text-[12px] font-semibold text-[#940dff]">Oportunidades abertas</p>
                <h1 className="mt-3 text-[36px] font-semibold leading-tight tracking-tight text-[#343241] sm:text-[50px]">
                  Vagas disponíveis na Colaborh
                </h1>
                <p className="mt-4 max-w-2xl text-[14px] font-medium leading-7 text-slate-500">
                  Veja todas as vagas ativas cadastradas pelas empresas e candidate-se com seu currículo dentro da plataforma.
                </p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Pesquisar vaga, cidade ou empresa..."
                  className="h-11 w-full rounded-full border border-slate-200/80 bg-white px-5 pl-11 pr-11 text-[13px] font-semibold text-[#343241] shadow-[0_10px_28px_rgba(15,23,42,0.035)] outline-none transition-all placeholder:text-slate-400 focus:border-[#940dff]/30 focus:ring-4 focus:ring-[#940dff]/10"
                />
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#940dff]" />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:text-[#940dff]"
                    aria-label="Limpar busca"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="mb-4 flex items-center gap-3 px-1">
            <span className="h-2.5 w-2.5 rounded-full bg-[#63e1a5]" />
            <p className="text-[12px] font-semibold text-slate-500">
              <span className="text-[#343241]">{filteredJobs.length}</span> {filteredJobs.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
            </p>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-12 text-center shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
              <Loader message="Carregando vagas..." />
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-[#ff4b8c]/20 bg-white/85 p-14 text-center shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff4b8c]/10 text-[#ff4b8c]">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-[16px] font-semibold text-[#343241]">Não foi possível carregar as vagas</h2>
              <p className="mx-auto mt-2 max-w-xl text-[12px] font-medium text-slate-400">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-6 h-9 rounded-full bg-[#940dff] px-5 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95"
              >
                Tentar novamente
              </button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-14 text-center shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3e5ff] text-[#940dff]">
                <Briefcase size={22} />
              </div>
              <h2 className="text-[16px] font-semibold text-[#343241]">Nenhuma vaga encontrada</h2>
              <p className="mx-auto mt-2 max-w-xl text-[12px] font-medium text-slate-400">
                Tente ajustar sua busca ou volte mais tarde para conferir novas oportunidades.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/85 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
              <div className="hidden grid-cols-[minmax(260px,1.6fr)_1fr_0.8fr_0.8fr_220px] gap-4 border-b border-slate-100 bg-[#fbfaff] px-5 py-3 text-[11px] font-semibold text-slate-400 lg:grid">
                <span>Vaga</span>
                <span>Local</span>
                <span>Salário</span>
                <span>Jornada</span>
                <span className="text-right">Ações</span>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredJobs.map((job) => {
                  const title = cleanEmojiFromText(job.title || 'Vaga sem título');
                  const isCurrentApplying = applyingId === job.id;

                  return (
                    <motion.div
                      key={job.id || title}
                      whileHover={{ y: -1 }}
                      className="group grid gap-4 px-5 py-4 transition-colors hover:bg-[#fbfaff] lg:grid-cols-[minmax(260px,1.6fr)_1fr_0.8fr_0.8fr_220px] lg:items-center"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 select-none items-center justify-center rounded-2xl border border-[#940dff]/18 bg-[#f3e5ff] text-[12px] font-semibold text-[#940dff]">
                          {getJobInitials(title)}
                        </div>
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => openJobPage(job)}
                            className="block max-w-full truncate border-0 bg-transparent p-0 text-left text-[14px] font-semibold text-[#343241] transition-colors group-hover:text-[#940dff]"
                            title={title}
                          >
                            {title}
                          </button>
                          <p className="mt-1 text-[12px] font-medium text-slate-400">
                            {cleanEmojiFromText(job.company_name || 'Empresa parceira')}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="rounded-lg border border-[#940dff]/16 bg-[#f3e5ff] px-2 py-1 text-[10px] font-semibold text-[#940dff]">
                              {cleanEmojiFromText(job.modality || 'Modalidade não informada')}
                            </span>
                            {job.contract_type && (
                              <span className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-500">
                                {cleanEmojiFromText(job.contract_type)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <InfoCell icon={MapPin} label="Local" value={getLocation(job)} />
                      <InfoCell icon={DollarSign} label="Salário" value={getSalary(job)} />
                      <InfoCell icon={Clock} label="Jornada" value={cleanEmojiFromText(job.work_schedule || 'A combinar')} />

                      <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
                        <button
                          type="button"
                          onClick={() => openJobPage(job)}
                          className="h-8 rounded-full border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12"
                        >
                          Detalhes
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApply(job)}
                          className="flex h-8 items-center justify-center gap-2 rounded-full bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95"
                        >
                          {isCurrentApplying && <Loader2 size={13} className="animate-spin" />}
                          Candidatar-se
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function InfoCell({ icon: Icon, label, value }: { icon?: typeof MapPin; label: string; value: string }) {
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
