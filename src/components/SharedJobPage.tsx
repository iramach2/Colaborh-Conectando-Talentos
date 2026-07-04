import { ArrowLeft, Building, Clock, DollarSign, MapPin, X } from 'lucide-react';
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Carregando vaga...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-[2rem] shadow-sleek text-center max-w-md border border-slate-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <X size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Vaga nao encontrada</h3>
          <p className="text-slate-500 text-sm mb-6">O link que voce acessou pode ter expirado ou a vaga foi removida.</p>
          <button
            type="button"
            onClick={onBackHome}
            className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors text-xs uppercase tracking-wider"
          >
            Voltar ao Inicio
          </button>
        </div>
      </div>
    );
  }

  const requirements = getRequirementsList(job);
  const benefits = getBenefitsList(job);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-primary-100 selection:text-primary-700">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 py-3 shadow-sm h-20 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-10 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="Colaborh Logo"
              className="h-10 md:h-12 w-auto object-contain cursor-pointer"
              onClick={onBackHome}
            />
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onLogin}
              className="px-5 py-2.5 text-sm font-bold text-slate-900 border-2 border-slate-200 rounded-full hover:bg-slate-50 hover:border-primary-200 transition-all"
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={onRegister}
              className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-bold rounded-full hover:shadow-lg hover:shadow-primary-200 hover:-translate-y-0.5 transition-all"
            >
              Criar Conta
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-16 flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-10">
          <button
            type="button"
            onClick={onBackHome}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-xs font-bold uppercase tracking-wider mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> Voltar para o Inicio
          </button>

          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-[2.5rem] p-8 md:p-12 shadow-xl mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Building size={160} strokeWidth={1} />
            </div>
            <div className="relative z-10">
              <span className="px-3 py-1 bg-primary-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm inline-block mb-4">
                {job.modality}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 uppercase">
                {job.title}
              </h1>
              <p className="text-slate-300 font-semibold text-sm flex items-center gap-2">
                Empresa Parceira <span aria-hidden="true">•</span>
                <MapPin size={16} className="text-primary-400" />
                {job.city && job.state ? `${job.city}, ${job.state}` : job.modality || 'Remoto'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 pb-2 border-b border-slate-100">
                  Descricao da Vaga
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                  {cleanDescription(job.description || '')}
                </p>
              </div>

              {requirements.length > 0 && (
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 pb-2 border-b border-slate-100">
                    Requisitos da Vaga
                  </h2>
                  <ul className="grid grid-cols-1 gap-3">
                    {requirements.map((requirement, index) => (
                      <li key={index} className="text-sm text-slate-600 flex items-start gap-3 font-medium">
                        <span className="text-primary-500 font-bold shrink-0 mt-0.5">•</span>
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100">
                  Resumo
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                      <DollarSign size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Remuneracao</p>
                      <p className="text-sm font-bold text-slate-700">{job.salary || 'A combinar'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-highlight-50 flex items-center justify-center text-highlight-500 shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Idade Minima</p>
                      <p className="text-sm font-bold text-slate-700">{job.min_age || job.minAge || 18} anos</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 shrink-0">
                      <Building size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Regime de Contratacao</p>
                      <p className="text-sm font-bold text-slate-700">{job.contract_type || 'CLT'}</p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onApply}
                  className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300 hover:-translate-y-0.5 active:scale-95 transition-all text-center"
                >
                  Candidatar-se a esta vaga
                </button>
                <p className="text-[9px] font-semibold text-slate-400 text-center uppercase tracking-widest italic">
                  Faca login ou crie sua conta para enviar seu curriculo
                </p>
              </div>

              {benefits.length > 0 && (
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 pb-2 border-b border-slate-100">
                    Beneficios
                  </h3>
                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="text-xs text-slate-600 flex items-center gap-2.5 font-semibold">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-10 text-center text-xs">
          <p>&copy; 2026 Colabora Tecnologia Ltda. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
