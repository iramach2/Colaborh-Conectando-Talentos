/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
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
  DollarSign,
  Clock,
  ArrowLeft,
  Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Login from './components/Login';
import CandidateDashboard from './components/CandidateDashboard';
import CompanyDashboard from './components/CompanyDashboard';
import { supabase } from './lib/supabase';

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginMode, setLoginMode] = useState<'login' | 'register'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'candidate' | 'company' | null>(null);

  const [sharedJobId, setSharedJobId] = useState<string | null>(null);
  const [sharedJobData, setSharedJobData] = useState<any | null>(null);
  const [isLoadingSharedJob, setIsLoadingSharedJob] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('vaga') || params.get('jobId');
    if (id) {
      setSharedJobId(id);
      loadSharedJob(id);
    }
  }, []);

  const loadSharedJob = async (id: string) => {
    setIsLoadingSharedJob(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;

      if (data) {
        const s = (data.status || '').toLowerCase();
        const isActive = s === 'active' || s === 'ativa' || s === '';
        if (isActive) {
          setSharedJobData(data);
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
    setLoginMode('register');
    setShowLogin(true);
  };

  const cleanDescription = (desc: string) => {
    if (!desc) return '';
    return desc.split('===ETAPAS_JSON===')[0].trim();
  };

  const getBenefitsList = (job: any) => {
    const list: string[] = [];
    if (job.benefits) {
      let b = job.benefits;
      if (typeof b === 'string') {
        try {
          b = JSON.parse(b);
        } catch (e) {}
      }
      if (b.vt?.selected) list.push(`Vale Transporte (VT): ${b.vt.value || 'Incluso'}`);
      if (b.va?.selected) list.push(`Vale Alimentação/Refeição (VA/VR): ${b.va.value || 'Incluso'}`);
      if (b.healthInsurance) list.push('Plano de Saúde');
      if (b.dentalPlan) list.push('Plano Odontológico');
    }
    
    if (list.length === 0 && job.description) {
      const lines = job.description.split('\n');
      let inBenefits = false;
      for (const line of lines) {
        if (line.toLowerCase().includes('benefícios:') || line.toLowerCase().includes('beneficios:')) {
          inBenefits = true;
          continue;
        }
        if (inBenefits && line.trim().startsWith('•')) {
          list.push(line.replace('•', '').trim());
        }
      }
    }
    return list;
  };

  const getRequirementsList = (job: any) => {
    if (Array.isArray(job.requirements)) return job.requirements;
    if (typeof job.requirements === 'string') {
      try {
        const parsed = JSON.parse(job.requirements);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
      return job.requirements.split('\n').filter((r: string) => r.trim().length > 0);
    }
    return [];
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Check session on load
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsLoggedIn(true);
        setUserRole(session.user.user_metadata?.role || 'candidate');
      }
    };
    checkSession();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoggedIn && userRole === 'candidate') {
    return <CandidateDashboard onLogout={() => { setIsLoggedIn(false); setUserRole(null); }} />;
  }

  if (isLoggedIn && userRole === 'company') {
    return <CompanyDashboard onLogout={() => { setIsLoggedIn(false); setUserRole(null); }} />;
  }

  if (showLogin) {
    return (
      <Login 
        onBack={() => setShowLogin(false)} 
        initialMode={loginMode}
        onLoginSuccess={(role) => {
          setIsLoggedIn(true);
          setUserRole(role);
          setShowLogin(false);
        }}
      />
    );
  }

  if (!isLoggedIn && sharedJobId) {
    if (isLoadingSharedJob) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Carregando vaga...</p>
          </div>
        </div>
      );
    }

    if (!sharedJobData) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[2rem] shadow-sleek text-center max-w-md border border-slate-100">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <X size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Vaga não encontrada</h3>
            <p className="text-slate-500 text-sm mb-6">O link que você acessou pode ter expirado ou a vaga foi removida.</p>
            <button 
              onClick={() => {
                setSharedJobId(null);
                window.history.pushState({}, '', window.location.origin);
              }}
              className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors text-xs uppercase tracking-wider"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-primary-100 selection:text-primary-700">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 py-3 shadow-sm h-20 flex items-center">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-10 flex justify-between items-center">
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                alt="Colaborh Logo" 
                className="h-10 md:h-12 w-auto object-contain cursor-pointer"
                onClick={() => {
                  setSharedJobId(null);
                  window.history.pushState({}, '', window.location.origin);
                }}
              />
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => { setLoginMode('login'); setShowLogin(true); }}
                className="px-5 py-2.5 text-sm font-bold text-slate-900 border-2 border-slate-200 rounded-full hover:bg-slate-50 hover:border-primary-200 transition-all"
              >
                Entrar
              </button>
              <button 
                onClick={() => { setLoginMode('register'); setShowLogin(true); }}
                className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-bold rounded-full hover:shadow-lg hover:shadow-primary-200 hover:-translate-y-0.5 transition-all"
              >
                Criar Conta
              </button>
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="pt-28 pb-16 flex-grow">
          <div className="max-w-5xl mx-auto px-4 sm:px-10">
            {/* Back Button */}
            <button 
              onClick={() => {
                setSharedJobId(null);
                window.history.pushState({}, '', window.location.origin);
              }}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-xs font-bold uppercase tracking-wider mb-6 transition-colors"
            >
              <ArrowLeft size={16} /> Voltar para o Início
            </button>

            {/* Header Hero Card */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-[2.5rem] p-8 md:p-12 shadow-xl mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Building size={160} strokeWidth={1} />
              </div>
              <div className="relative z-10">
                <span className="px-3 py-1 bg-primary-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm inline-block mb-4">
                  {sharedJobData.modality}
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 uppercase">
                  {sharedJobData.title}
                </h1>
                <p className="text-slate-300 font-semibold text-sm flex items-center gap-2">
                  Empresa Parceira • <MapPin size={16} className="text-primary-400" /> {sharedJobData.city && sharedJobData.state ? `${sharedJobData.city}, ${sharedJobData.state}` : sharedJobData.modality || 'Remoto'}
                </p>
              </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 pb-2 border-b border-slate-100">
                    Descrição da Vaga
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                    {cleanDescription(sharedJobData.description)}
                  </p>
                </div>

                {/* Requirements */}
                {getRequirementsList(sharedJobData).length > 0 && (
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 pb-2 border-b border-slate-100">
                      Requisitos da Vaga
                    </h2>
                    <ul className="grid grid-cols-1 gap-3">
                      {getRequirementsList(sharedJobData).map((req: string, i: number) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-3 font-medium">
                          <span className="text-primary-500 font-bold shrink-0 mt-0.5">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-8">
                {/* Summary Info Card */}
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
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Remuneração</p>
                        <p className="text-sm font-bold text-slate-700">{sharedJobData.salary || 'A combinar'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-highlight-50 flex items-center justify-center text-highlight-500 shrink-0">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Idade Mínima</p>
                        <p className="text-sm font-bold text-slate-700">{sharedJobData.min_age || sharedJobData.minAge || 18} anos</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 shrink-0">
                        <Building size={20} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Regime de Contratação</p>
                        <p className="text-sm font-bold text-slate-700">{sharedJobData.contract_type || 'CLT'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Apply Action Button */}
                  <button 
                    onClick={handleApplyClick}
                    className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300 hover:-translate-y-0.5 active:scale-95 transition-all text-center"
                  >
                    Candidatar-se a esta vaga
                  </button>
                  <p className="text-[9px] font-semibold text-slate-400 text-center uppercase tracking-widest italic">
                    Faça login ou crie sua conta para enviar seu currículo
                  </p>
                </div>

                {/* Benefits Card */}
                {getBenefitsList(sharedJobData).length > 0 && (
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 pb-2 border-b border-slate-100">
                      Benefícios
                    </h3>
                    <ul className="space-y-3">
                      {getBenefitsList(sharedJobData).map((ben: string, i: number) => (
                        <li key={i} className="text-xs text-slate-600 flex items-center gap-2.5 font-semibold">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0"></span>
                          <span>{ben}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-10 text-center text-xs">
            <p>&copy; 2026 Colabora Tecnologia Ltda. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-primary-100 selection:text-primary-700">
      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm' 
            : 'bg-white py-4 border-b border-slate-200'
        } h-20 flex items-center`}
      >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-10">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                alt="Colaborh Logo" 
                className="h-10 md:h-12 w-auto object-contain"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-10">
              <button 
                onClick={() => setShowLogin(false)}
                className={`text-[15px] font-bold transition-all ${!showLogin ? 'text-primary-600 border-b-2 border-primary-500 pb-1' : 'text-slate-600 hover:text-primary-600'}`}
              >
                Home
              </button>
              <a href="#" className="text-[15px] font-semibold text-slate-600 hover:text-primary-600 transition-colors">Quem Somos</a>
              <a href="#" className="text-[15px] font-semibold text-slate-600 hover:text-primary-600 transition-colors">Vagas</a>
              <a href="#" className="text-[15px] font-semibold text-slate-600 hover:text-primary-600 transition-colors">Contato</a>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <button 
                onClick={() => { setLoginMode('login'); setShowLogin(true); }}
                className="px-5 py-2.5 text-sm font-bold text-slate-900 border-2 border-slate-200 rounded-full hover:bg-slate-50 hover:border-primary-200 transition-all"
              >
                Entrar
              </button>
              <button 
                onClick={() => { setLoginMode('register'); setShowLogin(true); }}
                className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-bold rounded-full hover:shadow-lg hover:shadow-primary-200 hover:-translate-y-0.5 transition-all"
              >
                Criar Conta
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-primary-600 transition-colors"
                aria-label="Abrir menu"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-4 md:hidden"
          >
            <div className="flex flex-col space-y-8 text-center">
              <button onClick={() => { setShowLogin(false); setIsMobileMenuOpen(false); }} className="text-2xl font-bold text-primary-600">Home</button>
              <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-slate-900">Quem Somos</a>
              <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-slate-900">Vagas</a>
              <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-slate-900">Contato</a>
              <div className="pt-8 flex flex-col space-y-4">
                <button 
                  onClick={() => { setLoginMode('login'); setShowLogin(true); setIsMobileMenuOpen(false); }}
                  className="w-full py-4 text-lg font-bold border-2 border-slate-200 rounded-full text-slate-900"
                >
                  Entrar
                </button>
                <button 
                  onClick={() => { setLoginMode('register'); setShowLogin(true); setIsMobileMenuOpen(false); }}
                  className="w-full py-4 text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full shadow-lg shadow-primary-200"
                >
                  Criar Conta
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden flex flex-col items-center">
          {/* Abstract Shape from Theme */}
          <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(37,99,235,0.05)_0%,_transparent_70%)] pointer-events-none -z-10" />

          <div className="max-w-4xl mx-auto px-4 sm:px-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl sm:text-6xl lg:text-[64px] font-extrabold leading-[1.1] text-slate-900 tracking-[-2px] mb-6"
            >
              Encontre o seu <span className="text-primary-600 bg-gradient-to-r from-primary-600 to-highlight-500 bg-clip-text text-transparent italic">próximo passo</span> profissional.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-slate-600 mb-10 max-w-[600px] mx-auto leading-relaxed font-medium"
            >
              A Colaborh é a plataforma preferida pelas empresas mais inovadoras do Brasil para encontrar talentos como você.
            </motion.p>

            {/* Search Bar - Sleek Style */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-2.5 rounded-[2rem] shadow-sleek border border-slate-100 w-full max-w-[860px] mx-auto flex flex-col sm:flex-row gap-2"
            >
              <div className="flex-1 flex items-center px-6 border-r border-slate-100 last:border-r-0">
                <Search size={18} className="text-primary-400 mr-3" />
                <input 
                  type="text" 
                  placeholder="Cargo, palavra-chave ou empresa" 
                  className="w-full py-3 bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 font-semibold text-sm"
                />
              </div>
              <div className="flex-1 items-center px-6 border-r border-slate-100 lg:flex hidden">
                <MapPin size={18} className="text-primary-400 mr-3" />
                <input 
                  type="text" 
                  placeholder="Cidade ou Remoto" 
                  className="w-full py-3 bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 font-semibold text-sm"
                />
              </div>
              <button className="bg-gradient-to-r from-primary-600 to-highlight-500 text-white font-bold px-10 py-3.5 rounded-full hover:shadow-lg hover:shadow-highlight-500/20 hover:-translate-y-0.5 transition-all whitespace-nowrap">
                Buscar Vagas
              </button>
            </motion.div>

            {/* Stats Row from Theme */}
            <div className="mt-16 flex justify-center gap-10 md:gap-16">
              <div className="text-center">
                <span className="block text-2xl font-extrabold text-slate-900">12.450+</span>
                <span className="text-[13px] text-slate-600 uppercase tracking-widest mt-1 block">Vagas Ativas</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-extrabold text-slate-900">3.200+</span>
                <span className="text-[13px] text-slate-600 uppercase tracking-widest mt-1 block">Empresas</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-extrabold text-highlight-500">850k</span>
                <span className="text-[13px] text-slate-600 uppercase tracking-widest mt-1 block font-semibold">Candidatos</span>
              </div>
            </div>

            {/* Featured Labels from Theme */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-3 text-sm text-slate-600">
              <span className="font-medium">Buscas em alta:</span>
              <span className="bg-slate-200 px-3 py-1 rounded-full font-medium text-xs text-slate-700">Desenvolvedor React</span>
              <span className="bg-slate-200 px-3 py-1 rounded-full font-medium text-xs text-slate-700">UX Designer</span>
              <span className="bg-slate-200 px-3 py-1 rounded-full font-medium text-xs text-slate-700">Gerente de Projetos</span>
              <span className="bg-slate-200 px-3 py-1 rounded-full font-medium text-xs text-slate-700">Vendas B2B</span>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Vagas Ativas', value: '45k+' },
                { label: 'Candidatos', value: '1.2M+' },
                { label: 'Empresas', value: '12k+' },
                { label: 'Cidades', value: '850+' },
              ].map((stat, i) => (
                <div key={i} className="text-center group">
                  <p className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">{stat.value}</p>
                  <p className="text-sm md:text-base font-semibold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features / Paths */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Path: Candidates */}
            <div className="group bg-gradient-to-br from-primary-600 via-primary-700 to-highlight-600 rounded-[2.5rem] p-8 sm:p-12 text-white relative overflow-hidden transition-transform hover:scale-[1.02] duration-300 shadow-xl shadow-primary-500/20">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Users size={180} strokeWidth={1} />
              </div>
              <div className="relative z-10">
                <p className="text-primary-200 font-bold uppercase tracking-widest text-sm mb-4">Para Candidatos</p>
                <h2 className="text-4xl font-display font-bold mb-6">Ache o trabalho que combina com você.</h2>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center text-primary-50">
                    <CheckCircle2 size={20} className="mr-3 shrink-0" /> Recomendações personalizadas com AI
                  </li>
                  <li className="flex items-center text-primary-50">
                    <CheckCircle2 size={20} className="mr-3 shrink-0" /> Criador de currículos gratuito
                  </li>
                  <li className="flex items-center text-primary-50">
                    <CheckCircle2 size={20} className="mr-3 shrink-0" /> Alertas de vagas em tempo real
                  </li>
                </ul>
                <button 
                  onClick={() => { setLoginMode('register'); setShowLogin(true); }}
                  className="bg-white text-highlight-600 px-8 py-4 rounded-full font-bold flex items-center hover:bg-slate-50 transition-colors shadow-xl shadow-primary-900/10 group/btn"
                >
                  Começar agora
                  <ArrowUpRight size={20} className="ml-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Path: Companies */}
            <div className="group bg-slate-900 rounded-[2.5rem] p-8 sm:p-12 text-white relative overflow-hidden transition-transform hover:scale-[1.02] duration-300">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Building2 size={180} strokeWidth={1} />
              </div>
              <div className="relative z-10">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-4">Para Empresas</p>
                <h2 className="text-4xl font-display font-bold mb-6">Contrate os melhores profissionais.</h2>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center text-slate-300">
                    <CheckCircle2 size={20} className="mr-3 shrink-0" /> Gestão simplificada de candidatos
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckCircle2 size={20} className="mr-3 shrink-0" /> Divulgação em múltiplos canais
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckCircle2 size={20} className="mr-3 shrink-0" /> Filtros avançados por competência
                  </li>
                </ul>
                <button 
                  onClick={() => { setLoginMode('register'); setShowLogin(true); }}
                  className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center hover:bg-primary-700 transition-colors shadow-xl shadow-slate-950/20 group/btn"
                >
                  Anunciar Vaga
                  <ArrowUpRight size={20} className="ml-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <h2 className="text-4xl font-display font-bold text-slate-900 mb-4">Explorar por categoria</h2>
                <p className="text-slate-500 text-lg max-w-xl">
                  Encontre oportunidades nas áreas que mais crescem no mercado hoje.
                </p>
              </div>
              <button className="mt-6 md:mt-0 font-bold text-primary-600 flex items-center hover:underline">
                Ver todas categorias <ChevronRight size={20} className="ml-1" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Tecnologia', jobs: '12.430', icon: '💻' },
                { name: 'Marketing', jobs: '8.120', icon: '📱' },
                { name: 'Design', jobs: '4.500', icon: '🎨' },
                { name: 'Finanças', jobs: '3.200', icon: '💰' },
                { name: 'Vendas', jobs: '9.800', icon: '🤝' },
                { name: 'Saúde', jobs: '15.600', icon: '🏥' },
                { name: 'Educação', jobs: '2.100', icon: '📚' },
                { name: 'Engenharia', jobs: '5.400', icon: '🏗️' },
              ].map((cat, i) => (
                <button 
                  key={i}
                  className="p-8 bg-slate-50 rounded-[2rem] border-2 border-transparent hover:border-primary-200 hover:bg-white hover:shadow-xl hover:shadow-primary-100 transition-all text-left group"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">
                    {cat.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">{cat.name}</h3>
                  <p className="text-slate-500 font-semibold">{cat.jobs} vagas disponíveis</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-8">
            <div className="text-left mb-16 flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Vagas em Destaque</h2>
                <p className="text-slate-500 text-lg max-w-2xl">
                  As melhores oportunidades selecionadas para você com base no seu perfil.
                </p>
              </div>
              <button className="hidden sm:block text-primary-600 font-bold hover:underline">Ver todas</button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[
                { 
                  title: 'Senior Frontend Engineer', 
                  company: 'TechFlow', 
                  location: 'Remoto', 
                  type: 'Full-time', 
                  salary: 'R$ 15k - 22k',
                  logo: 'https://picsum.photos/seed/tech/100/100'
                },
                { 
                  title: 'Product Designer UI/UX', 
                  company: 'CreativeBox', 
                  location: 'São Paulo, SP', 
                  type: 'Híbrido', 
                  salary: 'R$ 8k - 12k',
                  logo: 'https://picsum.photos/seed/creative/100/100'
                },
                { 
                  title: 'Data Analyst Specialist', 
                  company: 'DataViz Solutions', 
                  location: 'Curitiba, PR', 
                  type: 'Remoto', 
                  salary: 'R$ 10k - 16k',
                  logo: 'https://picsum.photos/seed/data/100/100'
                },
              ].map((job, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -8 }}
                  className="bg-white p-7 rounded-[2rem] border-2 border-slate-50 hover:border-primary-200 hover:shadow-sleek transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <img 
                      src={job.logo} 
                      alt={job.company} 
                      className="w-16 h-16 rounded-2xl object-cover shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <span className="px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-xs font-bold uppercase tracking-widest">
                      {job.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-slate-500 font-medium mb-4 flex items-center">
                    {job.company} • <MapPin size={14} className="mx-1" /> {job.location}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="text-primary-600 font-bold">{job.salary}</span>
                    <button className="text-slate-900 font-bold text-sm flex items-center hover:text-primary-600">
                      Ver detalhes <ChevronRight size={16} className="ml-1" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center">
              <button className="px-10 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold rounded-full hover:shadow-xl hover:shadow-slate-200 hover:-translate-y-1 transition-all">
                Explorar todas as vagas
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-1">
                <div className="mb-6">
                  <img 
                    src="/logo.png" 
                    alt="Colaborh Logo" 
                    className="h-10 w-auto object-contain brightness-0 invert"
                  />
                </div>
                <p className="text-sm leading-relaxed text-slate-400">
                  Conectando pessoas e empresas através de tecnologia e empatia. Sua nova jornada profissional começa no Colaborh.
                </p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-6">Para Candidatos</h4>
                <ul className="space-y-4 text-sm">
                  <li><a href="#" className="hover:text-primary-400 transition-colors">Buscar Vagas</a></li>
                  <li><a href="#" className="hover:text-primary-400 transition-colors">Currículo Grátis</a></li>
                  <li><a href="#" className="hover:text-primary-400 transition-colors">Dicas de Carreira</a></li>
                  <li><a href="#" className="hover:text-primary-400 transition-colors">Cursos Gratuitos</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-6">Para Empresas</h4>
                <ul className="space-y-4 text-sm">
                  <li><a href="#" className="hover:text-primary-400 transition-colors">Anunciar Vaga</a></li>
                  <li><a href="#" className="hover:text-primary-400 transition-colors">Planos de Recrutamento</a></li>
                  <li><a href="#" className="hover:text-primary-400 transition-colors">Processos Seletivos</a></li>
                  <li><a href="#" className="hover:text-primary-400 transition-colors">Headhunting</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-6">Suporte</h4>
                <ul className="space-y-4 text-sm">
                  <li><a href="#" className="hover:text-primary-400 transition-colors">Ajuda</a></li>
                  <li><a href="#" className="hover:text-primary-400 transition-colors">Privacidade</a></li>
                  <li><a href="#" className="hover:text-primary-400 transition-colors">Termos de Uso</a></li>
                  <li><a href="#" className="hover:text-primary-400 transition-colors">Contato</a></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-800 text-xs flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
              <p>&copy; 2026 Colabora Tecnologia Ltda. Todos os direitos reservados.</p>
              <div className="flex space-x-6">
                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                <a href="#" className="hover:text-white transition-colors">Instagram</a>
                <a href="#" className="hover:text-white transition-colors">Twitter</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

