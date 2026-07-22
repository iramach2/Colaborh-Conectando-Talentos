import {
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  DollarSign,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import Loader from './Loader';
import type { CompanyJob } from '../types/companyDashboard';
import { cleanDescription, getBenefitsList, getRequirementsList } from '../utils/candidateVacancyText';

type SharedJobPageProps = {
  isLoading: boolean;
  job: CompanyJob | null;
  onBackHome: () => void;
  onLogin: () => void;
  onRegister: () => void;
  onApply: () => void;
};

const formatDate = (value?: string | null) => {
  if (!value) return 'Data não informada';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Data não informada';
  return date.toLocaleDateString('pt-BR');
};

const getLocation = (job: CompanyJob) => {
  if (job.modality === 'Home Office') return 'Home Office';
  if (job.city && job.state) return `${job.city}, ${job.state}`;
  if (job.city) return job.city;
  if (job.state) return job.state;
  return job.modality || 'Local não informado';
};

const getSalary = (job: CompanyJob) => {
  if (job.salary) return job.salary;
  if (job.salary_min || job.salary_max) return `${job.salary_min || 'R$ 0,00'} até ${job.salary_max || 'A combinar'}`;
  return 'A combinar';
};

const getPositions = (job: CompanyJob) => {
  const value = Number(job.positions || 1);
  if (!Number.isFinite(value) || value <= 1) return '1 vaga';
  return `${value} vagas`;
};

const InfoCard = ({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) => (
  <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3e5ff] text-[#940dff]">
      <Icon size={18} />
    </div>
    <p className="text-[11px] font-semibold text-slate-400">{label}</p>
    <p className="mt-1 text-[13px] font-semibold text-[#343241]">{value}</p>
  </div>
);

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)] sm:p-6">
    <h2 className="text-[18px] font-semibold tracking-tight text-[#343241]">{title}</h2>
    <div className="mt-4 text-[13px] font-medium leading-7 text-slate-500">{children}</div>
  </section>
);

export function SharedJobPage({
  isLoading,
  job,
  onBackHome,
  onLogin,
  onRegister,
  onApply,
}: SharedJobPageProps) {
  if (isLoading) {
    return (
      <div className="company-dashboard-surface flex min-h-screen items-center justify-center bg-[#fbf9ff]">
        <Loader message="Carregando vaga..." />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="company-dashboard-surface flex min-h-screen flex-col items-center justify-center bg-[#fbf9ff] p-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200/70 bg-white/85 p-8 text-center shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#ff4b8c]/18 bg-[#ff4b8c]/10 text-[#ff4b8c]">
            <X size={28} />
          </div>
          <h1 className="text-[20px] font-semibold tracking-tight text-[#343241]">Vaga não encontrada</h1>
          <p className="mt-3 text-[13px] font-medium leading-6 text-slate-500">O link pode ter expirado, a vaga pode ter sido removida ou não está mais ativa.</p>
          <button
            type="button"
            onClick={onBackHome}
            className="mt-6 h-10 rounded-full bg-[#940dff] px-5 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  const requirements = getRequirementsList(job);
  const benefits = getBenefitsList(job);
  const description = cleanDescription(job.description || '');
  const location = getLocation(job);

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
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-8 lg:grid-cols-[1fr_360px] lg:px-10 lg:py-12">
            <div>
              <button
                type="button"
                onClick={onBackHome}
                className="mb-6 inline-flex h-8 items-center gap-2 rounded-full border border-slate-200/80 bg-white px-3 text-[12px] font-semibold text-slate-500 transition-all hover:text-[#940dff]"
              >
                <ArrowLeft size={14} /> Voltar
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex h-8 items-center rounded-full border border-[#940dff]/18 bg-[#f3e5ff] px-3 text-[12px] font-semibold text-[#940dff]">
                  {job.modality || 'Modalidade não informada'}
                </span>
                {job.is_urgent && (
                  <span className="inline-flex h-8 items-center rounded-full border border-[#ff4b8c]/18 bg-[#ff4b8c]/10 px-3 text-[12px] font-semibold text-[#ff4b8c]">
                    Urgente
                  </span>
                )}
              </div>

              <h1 className="mt-5 max-w-4xl text-[34px] font-semibold leading-tight tracking-tight text-[#343241] sm:text-[46px]">
                {job.title || 'Vaga disponível'}
              </h1>
              <p className="mt-3 flex flex-wrap items-center gap-2 text-[14px] font-medium text-slate-500">
                <Building2 size={16} className="text-[#940dff]" />
                {job.company_name || 'Empresa parceira'}
                <span className="text-slate-300">•</span>
                <MapPin size={16} className="text-[#940dff]" />
                {location}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <InfoCard icon={DollarSign} label="Remuneração" value={getSalary(job)} />
                <InfoCard icon={Briefcase} label="Contratação" value={job.contract_type || 'Não informado'} />
                <InfoCard icon={Clock} label="Escala" value={job.work_schedule || 'Não informado'} />
                <InfoCard icon={Users} label="Posições" value={getPositions(job)} />
              </div>
            </div>

            <aside className="h-fit rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_18px_50px_rgba(52,50,65,0.08)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3e5ff] text-[#940dff]">
                <UserPlus size={22} />
              </div>
              <h2 className="mt-5 text-[20px] font-semibold tracking-tight text-[#343241]">Candidate-se a esta vaga</h2>
              <p className="mt-2 text-[13px] font-medium leading-6 text-slate-500">Crie sua conta de candidato ou entre para enviar seu currículo para esta oportunidade.</p>
              <button
                type="button"
                onClick={onApply}
                className="mt-5 h-10 w-full rounded-full bg-[#940dff] px-5 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95"
              >
                Candidatar-se
              </button>
              <button
                type="button"
                onClick={onLogin}
                className="mt-3 h-10 w-full rounded-full border border-[#940dff]/16 bg-[#f3e5ff] px-5 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12"
              >
                Já tenho conta
              </button>
              <div className="mt-5 space-y-3 border-t border-slate-200/70 pt-5">
                <p className="flex items-center gap-2 text-[12px] font-medium text-slate-500"><CalendarDays size={15} className="text-[#940dff]" /> Publicada em {formatDate(job.created_at)}</p>
                <p className="flex items-center gap-2 text-[12px] font-medium text-slate-500"><ShieldCheck size={15} className="text-[#63e1a5]" /> Link oficial da Colaborh</p>
              </div>
            </aside>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:px-8 lg:grid-cols-[1fr_360px] lg:px-10 lg:py-10">
          <div className="space-y-5">
            <Section title="Descrição da vaga">
              {description ? (
                <p className="whitespace-pre-line">{description}</p>
              ) : (
                <p>Esta empresa ainda não adicionou uma descrição detalhada para a oportunidade.</p>
              )}
            </Section>

            {job.responsibilities && (
              <Section title="Responsabilidades">
                <p className="whitespace-pre-line">{job.responsibilities}</p>
              </Section>
            )}

            {requirements.length > 0 && (
              <Section title="Requisitos">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {requirements.map((requirement, index) => (
                    <li key={`${requirement}-${index}`} className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="mt-1 shrink-0 text-[#63e1a5]" />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </div>

          <div className="space-y-5">
            <Section title="Resumo">
              <div className="space-y-4">
                <p><span className="font-semibold text-[#343241]">Cargo:</span> {job.role || job.title || 'Não informado'}</p>
                <p><span className="font-semibold text-[#343241]">Local:</span> {location}</p>
                <p><span className="font-semibold text-[#343241]">Idade mínima:</span> {job.min_age || job.minAge || 18} anos</p>
                <p><span className="font-semibold text-[#343241]">Primeiro emprego:</span> {job.is_first_job ? 'Sim' : 'Não'}</p>
                <p><span className="font-semibold text-[#343241]">Vaga PcD:</span> {job.is_pcd ? `Sim${job.pcd_details ? ` - ${job.pcd_details}` : ''}` : 'Não'}</p>
              </div>
            </Section>

            {benefits.length > 0 && (
              <Section title="Benefícios">
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={`${benefit}-${index}`} className="flex items-start gap-2">
                      <Sparkles size={15} className="mt-1 shrink-0 text-[#ffa303]" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/70 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 text-[12px] font-medium text-slate-400 sm:px-8 md:flex-row md:items-center lg:px-10">
          <p>© 2026 Colaborh. Todos os direitos reservados.</p>
          <button type="button" onClick={onBackHome} className="font-semibold text-[#940dff]">Conhecer a plataforma</button>
        </div>
      </footer>
    </div>
  );
}