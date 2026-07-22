/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useState, useEffect, useCallback, type ReactNode } from 'react';
import { 
  Search, 
  Briefcase, 
  Users, 
  Building2, 
  ChevronRight, 
  Menu, 
  X,
  ArrowUpRight,
  CheckCircle2,
  TrendingUp,
  Globe,
  Building,
  Award,
  Cpu,
  FileText,
  Brain,
  Layers,
  MessageSquare,
  Check,
  Zap,
  Star,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Loader from './components/Loader';
import { SharedJobPage } from './components/SharedJobPage';
import { supabase } from './lib/supabase';
import { hydrateJobsWithWorkflow } from './services/jobWorkflowService';
import { fetchJobById } from './services/jobService';
import type { CompanyJob } from './types/companyDashboard';
import { simulatorQuestions, useLandingDemoSimulator, type DemoTab } from './hooks/useLandingDemoSimulator';
import { getSharedJobIdFromLocation, isLoginPath, isRegisterPath, isResetPasswordPath, pushAppPath } from './utils/appRoutes';

const Login = lazy(() => import('./components/Login'));
const CandidateDashboard = lazy(() => import('./components/CandidateDashboard'));
const CompanyDashboard = lazy(() => import('./components/CompanyDashboard'));

const LazyScreen = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<Loader fullScreen message="Carregando painel..." />}>
    {children}
  </Suspense>
);


export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginMode, setLoginMode] = useState<'login' | 'register' | 'forgot' | 'reset-password'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'candidate' | 'company' | null>(null);

  const [sharedJobId, setSharedJobId] = useState<string | null>(null);
  const [sharedJobData, setSharedJobData] = useState<CompanyJob | null>(null);
  const [isLoadingSharedJob, setIsLoadingSharedJob] = useState(false);

  const {
    demoTab,
    setDemoTab,
    testStep,
    setTestStep,
    testAnswers,
    setTestAnswers,
    kanbanCandidates,
    iaSearchQuery,
    iaSearchStep,
    iaResults,
    getSimulatorResult,
  } = useLandingDemoSimulator();

  useEffect(() => {
    const syncSharedJobRoute = () => {
      const id = getSharedJobIdFromLocation();
      if (id) {
        setSharedJobId(id);
        loadSharedJob(id);
        return;
      }

      setSharedJobId(null);
      setSharedJobData(null);
    };

    syncSharedJobRoute();
    window.addEventListener('popstate', syncSharedJobRoute);
    return () => window.removeEventListener('popstate', syncSharedJobRoute);
  }, []);

  useEffect(() => {
    const syncAuthRoute = () => {
      if (isResetPasswordPath()) {
        setLoginMode('reset-password');
        setShowLogin(true);
        return;
      }

      if (isLoginPath()) {
        setLoginMode('login');
        setShowLogin(true);
        return;
      }

      if (isRegisterPath()) {
        setLoginMode('register');
        setShowLogin(true);
      }
    };

    syncAuthRoute();
    window.addEventListener('popstate', syncAuthRoute);
    return () => window.removeEventListener('popstate', syncAuthRoute);
  }, []);

  const loadSharedJob = async (id: string) => {
    setIsLoadingSharedJob(true);
    try {
      const data = await fetchJobById(id);

      if (data) {
        const s = (data.status || '').toLowerCase();
        const isActive = ['', 'active', 'ativa', 'published', 'publicada', 'open', 'aberta'].includes(s);
        if (isActive) {
          const [hydratedJob] = await hydrateJobsWithWorkflow([data]);
          setSharedJobData(hydratedJob || data);
        } else {
          alert('Esta vaga não está ativa no momento.');
          // Remove query param from URL without reloading
          const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
          window.history.pushState({ path: newUrl }, '', newUrl);
          setSharedJobId(null);
          setSharedJobData(null);
        }
      }
    } catch (err) {
      console.error('Erro ao carregar vaga compartilhada:', err);
    } finally {
      setIsLoadingSharedJob(false);
    }
  };

  const handleApplyClick = () => {
    if (isLoggedIn && userRole === 'candidate' && sharedJobId) {
      setSharedJobId(null);
      pushAppPath(`/candidato/vagas?vaga=${encodeURIComponent(sharedJobId)}`);
      return;
    }

    if (isLoggedIn && userRole === 'company') {
      alert('Para se candidatar, entre com uma conta de candidato.');
      return;
    }

    setLoginMode('register');
    setShowLogin(true);
  };


  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro ao encerrar sessão:', error);
    } finally {
      if (typeof window !== 'undefined') {
        for (const storage of [window.localStorage, window.sessionStorage]) {
          Object.keys(storage)
            .filter((key) => key.startsWith('sb-') || key.toLowerCase().includes('supabase'))
            .forEach((key) => storage.removeItem(key));
        }
      }

      setIsLoggedIn(false);
      setUserRole(null);
      setShowLogin(false);
      setSharedJobId(null);
      setSharedJobData(null);
      pushAppPath('/', true);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsLoggedIn(true);
        setUserRole(session.user.user_metadata?.role || 'candidate');
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setUserRole(session.user.user_metadata?.role || 'candidate');
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    });

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  if (showLogin && loginMode === 'reset-password') {
    return (
      <LazyScreen>
        <Login
          onBack={() => { setShowLogin(false); pushAppPath('/'); }}
          initialMode={loginMode}
          onLoginSuccess={(role) => {
            setIsLoggedIn(true);
            setUserRole(role);
            setShowLogin(false);
          }}
        />
      </LazyScreen>
    );
  }

  if (showLogin) {
    return (
      <LazyScreen>
        <Login
          onBack={() => { setShowLogin(false); pushAppPath('/'); }}
          initialMode={loginMode}
          onLoginSuccess={(role) => {
            setIsLoggedIn(true);
            setUserRole(role);
            setShowLogin(false);
          }}
        />
      </LazyScreen>
    );
  }

  if (sharedJobId) {
    const goBackHome = () => {
      setSharedJobId(null);
      pushAppPath('/', true);
    };

    return (
      <SharedJobPage
        isLoading={isLoadingSharedJob}
        job={sharedJobData}
        onBackHome={goBackHome}
        onLogin={() => { setLoginMode('login'); setShowLogin(true); }}
        onRegister={() => { setLoginMode('register'); setShowLogin(true); }}
        onApply={handleApplyClick}
      />
    );
  }

  if (isLoggedIn && userRole === 'candidate') {
    return (
      <LazyScreen>
        <CandidateDashboard onLogout={handleLogout} />
      </LazyScreen>
    );
  }

  if (isLoggedIn && userRole === 'company') {
    return (
      <LazyScreen>
        <CompanyDashboard onLogout={handleLogout} />
      </LazyScreen>
    );
  }


  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-slate-900 selection:bg-primary-100 selection:text-primary-700">
      {/* Navigation */}
      <nav
        className={[
          'fixed left-0 right-0 top-0 z-50 flex h-16 items-center border-b transition-all duration-300',
          isScrolled
            ? 'border-slate-200/80 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl'
            : 'border-slate-200/70 bg-white/92 backdrop-blur-md'
        ].join(' ')}
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="Colaborh Logo"
                className="h-8 w-auto cursor-pointer object-contain md:h-9"
                onClick={() => {
                  setSharedJobId(null);
                  pushAppPath('/', true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden h-10 items-center gap-1 rounded-xl border border-slate-200/70 bg-[#fbf9ff]/80 p-1 shadow-[0_10px_24px_rgba(15,23,42,0.035)] md:flex">
              <button
                onClick={() => {
                  setSharedJobId(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="h-8 rounded-lg bg-[#f3e5ff] px-3 text-[12px] font-semibold text-[#940dff] transition-colors"
              >
                Início
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="h-8 rounded-lg px-3 text-[12px] font-semibold text-slate-500 transition-colors hover:bg-[#f3e5ff] hover:text-[#940dff]"
              >
                Funcionalidades
              </button>
              <button
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                className="h-8 rounded-lg px-3 text-[12px] font-semibold text-slate-500 transition-colors hover:bg-[#f3e5ff] hover:text-[#940dff]"
              >
                Demonstração
              </button>
              <button
                onClick={() => document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' })}
                className="h-8 rounded-lg px-3 text-[12px] font-semibold text-slate-500 transition-colors hover:bg-[#f3e5ff] hover:text-[#940dff]"
              >
                Simulador
              </button>
              <button
                onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
                className="h-8 rounded-lg px-3 text-[12px] font-semibold text-slate-500 transition-colors hover:bg-[#f3e5ff] hover:text-[#940dff]"
              >
                Planos
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="hidden items-center gap-3 md:flex">
              <button
                onClick={() => { setLoginMode('login'); setShowLogin(true); pushAppPath('/login'); }}
                className="h-10 rounded-xl border border-slate-200/80 bg-white px-4 text-[13px] font-semibold text-slate-600 transition-all hover:border-[#940dff]/20 hover:bg-[#fbf9ff] hover:text-[#940dff]"
              >
                Entrar
              </button>
              <button
                onClick={() => { setLoginMode('register'); setShowLogin(true); pushAppPath('/cadastro'); }}
                className="h-10 rounded-xl bg-[#940dff] px-5 text-[13px] font-semibold text-white shadow-[0_14px_30px_rgba(148,13,255,0.26)] transition-all hover:bg-[#8200e6] active:scale-95"
              >
                Criar Conta
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-500 shadow-[0_8px_20px_rgba(15,23,42,0.06)] transition-colors hover:text-[#940dff]"
                aria-label="Abrir menu"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-3 top-[76px] z-40 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_24px_60px_rgba(52,50,65,0.16)] backdrop-blur-xl md:hidden"
          >
            <div className="grid gap-2">
              <button
                onClick={() => { setShowLogin(false); setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="h-11 rounded-xl bg-[#f3e5ff] px-4 text-left text-[14px] font-semibold text-[#940dff]"
              >
                Início
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="h-11 rounded-xl px-4 text-left text-[14px] font-semibold text-slate-600 transition-colors hover:bg-[#f3e5ff] hover:text-[#940dff]"
              >
                Funcionalidades
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="h-11 rounded-xl px-4 text-left text-[14px] font-semibold text-slate-600 transition-colors hover:bg-[#f3e5ff] hover:text-[#940dff]"
              >
                Demonstração
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="h-11 rounded-xl px-4 text-left text-[14px] font-semibold text-slate-600 transition-colors hover:bg-[#f3e5ff] hover:text-[#940dff]"
              >
                Simulador
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="h-11 rounded-xl px-4 text-left text-[14px] font-semibold text-slate-600 transition-colors hover:bg-[#f3e5ff] hover:text-[#940dff]"
              >
                Planos
              </button>
              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                <button
                  onClick={() => { setLoginMode('login'); setShowLogin(true); setIsMobileMenuOpen(false); pushAppPath('/login'); }}
                  className="h-10 rounded-xl border border-slate-200/80 bg-white text-[13px] font-semibold text-slate-600"
                >
                  Entrar
                </button>
                <button
                  onClick={() => { setLoginMode('register'); setShowLogin(true); setIsMobileMenuOpen(false); pushAppPath('/cadastro'); }}
                  className="h-10 rounded-xl bg-[#940dff] text-[13px] font-semibold text-white shadow-[0_14px_30px_rgba(148,13,255,0.24)]"
                >
                  Criar Conta
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="company-dashboard-surface bg-[#fbf9ff] pt-16 text-[#343241]">
        <section className="relative overflow-hidden border-b border-[#940dff]/10 bg-[#fbf9ff]">
          <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_50%_0%,rgba(148,13,255,0.18),transparent_55%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:py-24">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8">
              <div className="inline-flex h-8 items-center gap-2 rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff] shadow-[0_10px_22px_rgba(148,13,255,0.08)]">
                <Zap size={14} /> Recrutamento, seleção e avaliação em um só lugar
              </div>

              <div className="space-y-5">
                <h1 className="max-w-3xl text-[42px] font-semibold leading-[1.03] tracking-tight text-[#343241] sm:text-[58px] lg:text-[68px]">
                  O sistema para empresas que querem contratar com mais clareza.
                </h1>
                <p className="max-w-2xl text-[16px] font-medium leading-8 text-slate-500 sm:text-[18px]">
                  Publique vagas ilimitadas, organize candidatos em etapas, envie testes, agende entrevistas, converse pelo chat, acesse WhatsApp, baixe currículos e tome decisões com relatórios no mesmo painel.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button onClick={() => { setLoginMode('register'); setShowLogin(true); pushAppPath('/cadastro'); }} className="h-11 rounded-xl bg-[#940dff] px-6 text-[13px] font-semibold text-white shadow-[0_14px_30px_rgba(148,13,255,0.26)] transition-all hover:bg-[#8200e6] active:scale-95">
                  Começar grátis
                </button>
                <button onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })} className="h-11 rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-6 text-[13px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12">
                  Ver planos
                </button>
                <button onClick={() => document.getElementById('product')?.scrollIntoView({ behavior: 'smooth' })} className="h-11 rounded-xl border border-slate-200/80 bg-white px-6 text-[13px] font-semibold text-slate-500 transition-all hover:text-[#940dff]">
                  Conhecer recursos
                </button>
              </div>

              <div className="grid max-w-2xl grid-cols-3 gap-3 pt-2">
                {[
                  ['Vagas', 'ilimitadas'],
                  ['15 testes', 'no Profissional'],
                  ['R$ 119,90', 'plano mensal']
                ].map(([value, label]) => (
                  <div key={value} className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
                    <p className="text-[18px] font-semibold text-[#343241]">{value}</p>
                    <p className="mt-1 text-[12px] font-medium text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }} className="relative">
              <div className="rounded-[28px] border border-slate-200/70 bg-white/85 p-4 shadow-[0_24px_80px_rgba(52,50,65,0.12)]">
                <div className="rounded-2xl bg-[#fbf9ff] p-5">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[12px] font-semibold text-[#940dff]">Dashboard da empresa</p>
                      <h2 className="mt-1 text-[20px] font-semibold tracking-tight text-[#343241]">Visão geral do recrutamento</h2>
                    </div>
                    <div className="flex gap-2">
                      <span className="h-9 w-9 rounded-xl bg-[#940dff] shadow-[0_10px_22px_rgba(148,13,255,0.22)]" />
                      <span className="h-9 w-9 rounded-xl bg-[#ff4b8c] shadow-[0_10px_22px_rgba(255,75,140,0.18)]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      ['Candidaturas', '128', '#940dff'],
                      ['Entrevistas', '24', '#63e1a5'],
                      ['Testes enviados', '86', '#ff4b8c']
                    ].map(([label, value, color]) => (
                      <div key={label} className="rounded-2xl border border-slate-200/70 bg-white p-4">
                        <p className="text-[11px] font-semibold text-slate-400">{label}</p>
                        <p className="mt-3 text-[28px] font-semibold text-[#343241]">{value}</p>
                        <div className="mt-3 h-1.5 rounded-full bg-slate-100"><div className="h-full w-2/3 rounded-full" style={{ backgroundColor: color }} /></div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-200/70 bg-white p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-[13px] font-semibold text-[#343241]">Processo seletivo</p>
                      <span className="rounded-xl bg-[#f3e5ff] px-3 py-1 text-[11px] font-semibold text-[#940dff]">Em andamento</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        ['Análise de currículo', '42 candidatos', '#940dff'],
                        ['Teste comportamental', '18 candidatos', '#ff4b8c'],
                        ['Entrevista', '9 candidatos', '#63e1a5']
                      ].map(([stage, count, color]) => (
                        <div key={stage} className="flex items-center gap-3 rounded-2xl bg-[#fbf9ff] p-3">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[12px] font-semibold text-[#343241]">{stage}</p>
                            <p className="text-[11px] font-medium text-slate-400">{count}</p>
                          </div>
                          <ChevronRight size={16} className="text-slate-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="product" className="border-b border-slate-200/70 bg-white py-20">
          <div className="mx-auto max-w-7xl px-6 sm:px-10">
            <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <p className="text-[12px] font-semibold text-[#940dff]">Produto completo</p>
                <h2 className="mt-3 text-[34px] font-semibold leading-tight tracking-tight text-[#343241] sm:text-[44px]">Tudo que criamos para tirar seu RH do improviso.</h2>
              </div>
              <p className="max-w-md text-[14px] font-medium leading-7 text-slate-500">A Colaborh cobre o fluxo completo: atrair, organizar, avaliar, entrevistar, conversar, comparar e decidir.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { title: 'Publicação de vagas', desc: 'Crie vagas ilimitadas, links compartilháveis e etapas do processo.', icon: Briefcase, color: 'text-[#940dff] bg-[#f3e5ff]' },
                { title: 'Banco de talentos', desc: 'Encontre candidatos, salve perfis e acesse currículos completos.', icon: Search, color: 'text-[#533af6] bg-[#533af6]/10' },
                { title: 'Funil seletivo', desc: 'Etapas em abas, candidatos em lista e ações rápidas sem bagunça.', icon: Layers, color: 'text-[#940dff] bg-[#f3e5ff]' },
                { title: 'Ações em massa', desc: 'Mude etapa, envie testes, baixe PDFs e reprove selecionados.', icon: CheckCircle2, color: 'text-[#63e1a5] bg-[#63e1a5]/14' },
                { title: 'Testes comportamentais', desc: 'DISC, MBTI, Temperamentos e mapeamentos personalizados.', icon: Brain, color: 'text-[#ff4b8c] bg-[#ff4b8c]/10' },
                { title: 'Entrevistas', desc: 'Calendário, horários livres, sala de vídeo e histórico por candidato.', icon: Play, color: 'text-[#ffa303] bg-[#ffc24b]/16' },
                { title: 'Mensagens', desc: 'Chat com recibo de leitura e central de conversas da empresa.', icon: MessageSquare, color: 'text-[#533af6] bg-[#533af6]/10' },
                { title: 'Relatórios', desc: 'Resultados, estrelas, notas, entrevistas e dados para decisão.', icon: TrendingUp, color: 'text-[#63e1a5] bg-[#63e1a5]/14' }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.title} whileHover={{ y: -4 }} className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
                    <div className={'mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ' + item.color}><Icon size={22} /></div>
                    <h3 className="text-[16px] font-semibold tracking-tight text-[#343241]">{item.title}</h3>
                    <p className="mt-3 text-[12px] font-medium leading-6 text-slate-500">{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#fbf9ff] py-20">
          <div className="mx-auto max-w-7xl px-6 sm:px-10">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="rounded-3xl border border-slate-200/70 bg-white/85 p-8 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
                <p className="text-[12px] font-semibold text-[#940dff]">Fluxo inteligente</p>
                <h2 className="mt-3 text-[32px] font-semibold leading-tight tracking-tight text-[#343241]">Da vaga publicada ao candidato contratado.</h2>
                <p className="mt-4 text-[14px] font-medium leading-7 text-slate-500">Um processo seletivo precisa de método. A Colaborh organiza cada etapa para sua empresa enxergar quem avançou, quem precisa responder teste, quem foi entrevistado e quem foi reprovado.</p>
                <button onClick={() => { setLoginMode('register'); setShowLogin(true); pushAppPath('/cadastro'); }} className="mt-8 h-10 rounded-xl bg-[#940dff] px-5 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95">Criar conta grátis</button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ['1', 'Publique a vaga', 'Cadastre cargo, salário, benefícios, requisitos, etapas e link público.'],
                  ['2', 'Receba candidaturas', 'Candidatos aparecem no funil com currículo, contato, localização e histórico.'],
                  ['3', 'Avalie com testes', 'Envie avaliações manualmente ou automaticamente por etapa do processo.'],
                  ['4', 'Decida com contexto', 'Compare relatórios, notas, entrevistas, mensagens e classificação por estrelas.']
                ].map(([step, title, desc]) => (
                  <div key={step} className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
                    <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-xl bg-[#f3e5ff] text-[13px] font-semibold text-[#940dff]">{step}</div>
                    <h3 className="text-[16px] font-semibold tracking-tight text-[#343241]">{title}</h3>
                    <p className="mt-3 text-[12px] font-medium leading-6 text-slate-500">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200/70 bg-white py-20">
          <div className="mx-auto max-w-7xl px-6 sm:px-10">
            <div className="mb-10 max-w-2xl">
              <p className="text-[12px] font-semibold text-[#940dff]">Avaliações e relatórios</p>
              <h2 className="mt-3 text-[34px] font-semibold leading-tight tracking-tight text-[#343241] sm:text-[44px]">Não escolha candidatos só pelo currículo.</h2>
              <p className="mt-4 text-[14px] font-medium leading-7 text-slate-500">Use testes e questionários para enxergar comportamento, comunicação, perfil profissional e aderência ao cargo.</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-4">
              {[
                ['DISC 5.0', 'Mapeia tendências de dominância, influência, estabilidade e conformidade.', '#63e1a5', Brain],
                ['MBTI', 'Categoriza perfis psicológicos e estilos de tomada de decisão.', '#533af6', Award],
                ['Temperamentos', 'Identifica perfil emocional e estilo de reação em ambiente profissional.', '#ff4b8c', Zap],
                ['Questionários', 'Crie perguntas abertas ou de múltipla escolha com resposta correta.', '#ffa303', FileText]
              ].map(([title, desc, color, icon]) => {
                const Icon = icon as typeof Brain;
                return (
                  <div key={String(title)} className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-[0_8px_18px_rgba(15,23,42,0.08)]" style={{ color: String(color) }}><Icon size={22} /></div>
                    <h3 className="text-[16px] font-semibold tracking-tight text-[#343241]">{title}</h3>
                    <p className="mt-3 text-[12px] font-medium leading-6 text-slate-500">{desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="demo" className="bg-[#fbf9ff] py-20">
          <div className="mx-auto max-w-7xl px-6 sm:px-10">
            <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <p className="text-[12px] font-semibold text-[#940dff]">Produto em ação</p>
                <h2 className="mt-3 text-[34px] font-semibold leading-tight tracking-tight text-[#343241] sm:text-[44px]">Veja o que a empresa ganha no dia a dia.</h2>
              </div>
              <div className="flex overflow-x-auto border-b border-slate-200/80">
                {[
                  { id: 'kanban' as DemoTab, label: 'Funil seletivo' },
                  { id: 'ia' as DemoTab, label: 'Banco de talentos' },
                  { id: 'testes' as DemoTab, label: 'Relatórios' }
                ].map((tab) => {
                  const active = demoTab === tab.id;
                  return (
                    <button key={tab.id} onClick={() => setDemoTab(tab.id)} className={(active ? 'text-[#940dff]' : 'text-slate-500 hover:text-[#940dff]') + ' relative h-[38px] min-w-[150px] bg-transparent px-4 py-2 text-[12px] font-semibold transition-colors'}>
                      {tab.label}
                      {active && <motion.span layoutId="landing-product-tab" className="absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-[#940dff]" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_20px_60px_rgba(52,50,65,0.08)]">
              {demoTab === 'kanban' && (
                <div className="grid gap-3 md:grid-cols-4">
                  {['Análise de currículo', 'Testes', 'Entrevistas', 'Finalistas'].map((stage, index) => (
                    <div key={stage} className="rounded-2xl bg-[#fbf9ff] p-4">
                      <div className="mb-4 flex h-[38px] items-center justify-between border-b border-slate-200/80 text-[12px] font-semibold text-[#343241]">
                        <span>{stage}</span><span className="text-slate-400">{index + 1}</span>
                      </div>
                      <div className="space-y-3">
                        {kanbanCandidates.slice(0, index === 0 ? 2 : 1).map((candidate) => (
                          <div key={candidate.id + stage} className="rounded-2xl border border-slate-200/70 bg-white p-4">
                            <p className="truncate text-[12px] font-semibold text-[#343241]">{candidate.name}</p>
                            <p className="mt-1 truncate text-[11px] font-medium text-slate-400">{candidate.role}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {demoTab === 'ia' && (
                <div className="mx-auto max-w-3xl space-y-4 py-4">
                  <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200/80 bg-[#fbf9ff] px-4 text-[13px] font-medium text-slate-500"><Search size={17} className="text-[#940dff]" />{iaSearchQuery || 'Buscar talentos por cargo, habilidade ou cidade...'}</div>
                  <p className="text-[12px] font-semibold text-slate-400">{iaSearchStep === 2 ? 'Buscando talentos compatíveis...' : 'Candidatos encontrados no banco de talentos'}</p>
                  {iaResults.map((item) => (
                    <div key={item.name} className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white p-4">
                      <div><p className="text-[13px] font-semibold text-[#343241]">{item.name}</p><p className="mt-1 text-[11px] font-medium text-slate-400">{item.xp} - {item.skills}</p></div>
                      <span className="rounded-xl bg-[#f3e5ff] px-3 py-1 text-[12px] font-semibold text-[#940dff]">{item.match}% match</span>
                    </div>
                  ))}
                </div>
              )}

              {demoTab === 'testes' && (
                <div className="grid gap-4 lg:grid-cols-3">
                  {[
                    ['Perfil comportamental', 'DISC, MBTI e Temperamentos em relatórios claros.'],
                    ['Notas internas', 'Anote percepções e classifique candidatos com estrelas.'],
                    ['Histórico completo', 'Mensagens, entrevistas, testes e decisões por candidato.']
                  ].map(([title, desc]) => (
                    <div key={title} className="rounded-2xl border border-slate-200/70 bg-[#fbf9ff] p-5">
                      <p className="text-[16px] font-semibold tracking-tight text-[#343241]">{title}</p>
                      <p className="mt-3 text-[12px] font-medium leading-6 text-slate-500">{desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="plans" className="border-y border-slate-200/70 bg-white py-20">
          <div className="mx-auto max-w-7xl px-6 sm:px-10">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="text-[12px] font-semibold text-[#940dff]">Planos comerciais</p>
              <h2 className="mt-3 text-[34px] font-semibold leading-tight tracking-tight text-[#343241] sm:text-[44px]">Comece grátis. Assine quando quiser seleção avançada.</h2>
              <p className="mt-4 text-[14px] font-medium leading-7 text-slate-500">O plano gratuito serve para publicar vagas. Os planos pagos liberam testes, entrevistas, mensagens, WhatsApp, downloads e recursos avançados.</p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {[
                { name: 'Gratuito', price: 'R$ 0', desc: 'Para publicar vagas e começar a captar candidatos.', cta: 'Começar grátis', highlight: false, items: ['Vagas ilimitadas', 'Visualização básica de candidatos', 'Sem testes, entrevistas, mensagens e downloads'] },
                { name: 'Profissional', price: 'R$ 119,90/mês', desc: 'Para empresas que precisam avaliar e entrevistar melhor.', cta: 'Assinar Profissional', highlight: true, items: ['Vagas ilimitadas', '15 envios de testes por mês', '3 questionários personalizados', 'Entrevistas, mensagens, WhatsApp e PDFs'] },
                { name: 'Ilimitado', price: 'R$ 249,90/mês', desc: 'Para operações com grande volume e uso contínuo.', cta: 'Falar com consultor', highlight: false, items: ['Tudo do Profissional', 'Testes ilimitados', 'Questionários ilimitados', 'Recursos avançados sem limite'] }
              ].map((plan) => (
                <div key={plan.name} className={(plan.highlight ? 'border-[#940dff]/40 shadow-[0_18px_50px_rgba(148,13,255,0.14)]' : 'border-slate-200/70 shadow-[0_10px_28px_rgba(15,23,42,0.035)]') + ' relative rounded-3xl border bg-white p-6'}>
                  {plan.highlight && <span className="absolute -top-3 left-6 rounded-xl bg-[#940dff] px-3 py-1 text-[11px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)]">Mais recomendado</span>}
                  <p className="text-[18px] font-semibold text-[#343241]">{plan.name}</p>
                  <p className="mt-4 text-[30px] font-semibold tracking-tight text-[#343241]">{plan.price}</p>
                  <p className="mt-3 min-h-12 text-[12px] font-medium leading-6 text-slate-500">{plan.desc}</p>
                  <div className="my-5 h-px bg-slate-200/80" />
                  <ul className="space-y-3">
                    {plan.items.map((item) => <li key={item} className="flex gap-2 text-[12px] font-medium text-slate-500"><Check size={15} className="mt-0.5 shrink-0 text-[#63e1a5]" />{item}</li>)}
                  </ul>
                  <button onClick={() => { setLoginMode('register'); setShowLogin(true); pushAppPath('/cadastro'); }} className={(plan.highlight ? 'bg-[#940dff] text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] hover:bg-[#8200e6]' : 'border border-[#940dff]/16 bg-[#f3e5ff] text-[#940dff] hover:border-[#940dff]/28 hover:bg-[#940dff]/12') + ' mt-7 h-10 w-full rounded-xl px-4 text-[12px] font-semibold transition-all active:scale-95'}>{plan.cta}</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#fbf9ff] py-20">
          <div className="mx-auto max-w-5xl px-6 text-center sm:px-10">
            <div className="rounded-[32px] border border-[#940dff]/16 bg-white/85 p-8 shadow-[0_24px_70px_rgba(148,13,255,0.12)] sm:p-12">
              <p className="text-[12px] font-semibold text-[#940dff]">Pronto para testar?</p>
              <h2 className="mx-auto mt-3 max-w-3xl text-[34px] font-semibold leading-tight tracking-tight text-[#343241] sm:text-[48px]">Crie sua conta e publique sua primeira vaga hoje.</h2>
              <p className="mx-auto mt-4 max-w-2xl text-[14px] font-medium leading-7 text-slate-500">Você começa gratuitamente, sem precisar ativar os recursos pagos. Quando sua operação crescer, os planos avançados liberam toda a inteligência da plataforma.</p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button onClick={() => { setLoginMode('register'); setShowLogin(true); pushAppPath('/cadastro'); }} className="h-11 rounded-xl bg-[#940dff] px-6 text-[13px] font-semibold text-white shadow-[0_14px_30px_rgba(148,13,255,0.26)] transition-all hover:bg-[#8200e6] active:scale-95">Começar grátis</button>
                <button onClick={() => { setLoginMode('login'); setShowLogin(true); pushAppPath('/login'); }} className="h-11 rounded-xl border border-slate-200/80 bg-white px-6 text-[13px] font-semibold text-slate-500 transition-all hover:text-[#940dff]">Já tenho conta</button>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-200/70 bg-white py-10 text-left">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-6 sm:px-10 md:flex-row md:items-center">
            <div className="space-y-3">
              <img src="/logo.png" alt="Colaborh Logo" className="h-9 w-auto object-contain" />
              <p className="max-w-md text-[12px] font-medium leading-6 text-slate-500">Recrutamento e seleção com vagas, candidatos, testes, entrevistas, mensagens e relatórios no mesmo sistema.</p>
            </div>
            <div className="flex flex-wrap gap-5 text-[12px] font-semibold text-slate-500">
              <a href="#product" className="hover:text-[#940dff]">Funcionalidades</a>
              <a href="#demo" className="hover:text-[#940dff]">Produto</a>
              <a href="#plans" className="hover:text-[#940dff]">Planos</a>
              <button onClick={() => { setLoginMode('register'); setShowLogin(true); pushAppPath('/cadastro'); }} className="text-[#940dff]">Criar conta</button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}




