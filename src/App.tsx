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
import Login from './components/Login';
import CandidateDashboard from './components/CandidateDashboard';
import CompanyDashboard from './components/CompanyDashboard';
import { supabase } from './lib/supabase';

const simulatorQuestions = [
  {
    question: "Como você prefere estruturar e planejar suas tarefas diárias?",
    options: [
      { text: "Prefiro seguir uma lista detalhada, processos claros e regras definidas.", type: "C" },
      { text: "Prefiro ter flexibilidade, improvisar e focar em novas ideias criativas.", type: "I" }
    ]
  },
  {
    question: "Em reuniões de equipe ou tomada de decisões, qual é sua atitude?",
    options: [
      { text: "Sou direto ao ponto, foco nos resultados e defendo o meu ponto de vista.", type: "D" },
      { text: "Busco a harmonia da equipe, ouço a opinião de todos e evito conflitos.", type: "S" }
    ]
  },
  {
    question: "Como você reage quando ocorrem mudanças imprevistas em um projeto?",
    options: [
      { text: "Analiso friamente os novos dados, fatos e riscos para me reorganizar.", type: "C" },
      { text: "Sinto-me entusiasmado com a novidade e gosto de mobilizar as pessoas.", type: "I" }
    ]
  }
];

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

  // Estados para a nova Landing Page Interativa
  const [demoTab, setDemoTab] = useState<'kanban' | 'ia' | 'testes'>('kanban');
  
  // Simulador de Mini-teste Comportamental
  const [testStep, setTestStep] = useState(0); // 0: Começar, 1: Q1, 2: Q2, 3: Q3, 4: Resultado
  const [testAnswers, setTestAnswers] = useState<string[]>([]);
  
  // Loops de animação para o Kanban no simulador
  const [kanbanCandidates, setKanbanCandidates] = useState([
    { id: 1, name: "Ana Silva", role: "Frontend Developer", stage: "triagem" },
    { id: 2, name: "Carlos Rocha", role: "Product Manager", stage: "testes" },
    { id: 3, name: "Mariana Souza", role: "UI/UX Designer", stage: "entrevista" },
    { id: 4, name: "Lucas Lima", role: "QA Engineer", stage: "aprovado" }
  ]);
  
  // Loop de busca por IA do simulador
  const [iaSearchQuery, setIaSearchQuery] = useState("");
  const [iaSearchStep, setIaSearchStep] = useState(0); // 0: Idle, 1: Digitando, 2: Buscando, 3: Concluído
  const [iaResults, setIaResults] = useState<any[]>([]);

  useEffect(() => {
    if (demoTab !== 'kanban') return;
    const interval = setInterval(() => {
      setKanbanCandidates(prev => {
        const updated = [...prev];
        const nextStages: Record<string, string> = {
          triagem: 'testes',
          testes: 'entrevista',
          entrevista: 'aprovado',
          aprovado: 'triagem'
        };
        const randomIndex = Math.floor(Math.random() * updated.length);
        const cand = updated[randomIndex];
        updated[randomIndex] = {
          ...cand,
          stage: nextStages[cand.stage]
        };
        return updated;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [demoTab]);

  useEffect(() => {
    if (demoTab !== 'ia') return;
    setIaSearchStep(0);
    setIaSearchQuery("");
    setIaResults([]);
    
    let isMounted = true;
    const runSimulation = async () => {
      await new Promise(r => setTimeout(r, 800));
      if (!isMounted) return;
      
      const text = "Buscar UX Designer Senior especializado em mobile";
      setIaSearchStep(1);
      for (let i = 1; i <= text.length; i++) {
        await new Promise(r => setTimeout(r, 60));
        if (!isMounted) return;
        setIaSearchQuery(text.substring(0, i));
      }
      
      await new Promise(r => setTimeout(r, 500));
      if (!isMounted) return;
      setIaSearchStep(2);
      
      await new Promise(r => setTimeout(r, 1200));
      if (!isMounted) return;
      setIaSearchStep(3);
      setIaResults([
        { name: "Beatriz M.", match: 98, xp: "6 anos de xp", skills: "Figma, Design System, Swift" },
        { name: "Rodrigo F.", match: 89, xp: "4 anos de xp", skills: "Figma, UX Research, Material UI" }
      ]);
    };
    
    runSimulation();
    const interval = setInterval(() => {
      if (isMounted) runSimulation();
    }, 12000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [demoTab]);

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

  const getSimulatorResult = () => {
    const counts = { D: 0, I: 0, S: 0, C: 0 };
    testAnswers.forEach(ans => {
      if (ans in counts) {
        counts[ans as keyof typeof counts]++;
      }
    });

    let highest: 'D' | 'I' | 'S' | 'C' = 'C';
    let max = -1;
    (Object.keys(counts) as Array<'D' | 'I' | 'S' | 'C'>).forEach(k => {
      if (counts[k] > max) {
        max = counts[k];
        highest = k;
      }
    });

    const profiles = {
      D: {
        title: "Executor Focado (Dominância)",
        desc: "Você é focado em resultados, direto e motivado por desafios. Toma decisões rápidas e gosta de liderar processos de mudança.",
        tips: "Ideal para posições de liderança, vendas corporativas e gestão de projetos dinâmicos."
      },
      I: {
        title: "Comunicador Inspirador (Influência)",
        desc: "Você é entusiasmado, comunicativo e voltado para relações interpessoais. Gosta de colaborar e motivar a equipe.",
        tips: "Ideal para áreas de marketing, recursos humanos, design e relacionamento com o cliente."
      },
      S: {
        title: "Planejador Diplomático (Estabilidade)",
        desc: "Você é paciente, excelente ouvinte e valoriza a cooperação. Gosta de ritmo constante, processos organizados e ambientes previsíveis.",
        tips: "Ideal para operações estruturadas, suporte ao cliente, consultoria e desenvolvimento contínuo."
      },
      C: {
        title: "Analista Detalhista (Conformidade)",
        desc: "Você é lógico, detalhista e focado na qualidade. Valoriza a precisão, fatos concretos, regras bem estabelecidas e segurança.",
        tips: "Ideal para tecnologia, desenvolvimento de software, finanças, compliance e controle de qualidade."
      }
    };

    return profiles[highest];
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-slate-900 selection:bg-primary-100 selection:text-primary-700">
      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/85 backdrop-blur-md border-b border-slate-200/80 py-3 shadow-sm' 
            : 'bg-white py-4 border-b border-slate-200'
        } h-20 flex items-center`}
      >
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-10">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                alt="Colaborh Logo" 
                className="h-10 md:h-12 w-auto object-contain cursor-pointer"
                onClick={() => {
                  setSharedJobId(null);
                  window.history.pushState({}, '', window.location.origin);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 lg:space-x-10">
              <button 
                onClick={() => {
                  setSharedJobId(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[15px] font-bold text-primary-600 border-b-2 border-primary-500 pb-1 cursor-pointer bg-transparent border-0 outline-none"
              >
                Início
              </button>
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-[15px] font-semibold text-slate-600 hover:text-primary-600 transition-colors cursor-pointer bg-transparent border-0 outline-none"
              >
                Funcionalidades
              </button>
              <button 
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-[15px] font-semibold text-slate-600 hover:text-primary-600 transition-colors cursor-pointer bg-transparent border-0 outline-none"
              >
                Demonstração
              </button>
              <button 
                onClick={() => document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-[15px] font-semibold text-slate-600 hover:text-primary-600 transition-colors cursor-pointer bg-transparent border-0 outline-none"
              >
                Simulador
              </button>
              <button 
                onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-[15px] font-semibold text-slate-600 hover:text-primary-600 transition-colors cursor-pointer bg-transparent border-0 outline-none"
              >
                Planos
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <button 
                onClick={() => { setLoginMode('login'); setShowLogin(true); }}
                className="px-5 py-2.5 text-sm font-bold text-slate-900 border-2 border-slate-200 rounded-full hover:bg-slate-50 hover:border-primary-200 transition-all cursor-pointer bg-transparent"
              >
                Entrar
              </button>
              <button 
                onClick={() => { setLoginMode('register'); setShowLogin(true); }}
                className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-bold rounded-full hover:shadow-lg hover:shadow-primary-200 hover:-translate-y-0.5 transition-all cursor-pointer border-0"
              >
                Criar Conta
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-primary-600 transition-colors cursor-pointer bg-transparent border-0"
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
            className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden flex flex-col justify-start"
          >
            <div className="flex flex-col space-y-6 text-center">
              <button 
                onClick={() => { setShowLogin(false); setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="text-xl font-bold text-primary-600 bg-transparent border-0"
              >
                Início
              </button>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }} 
                className="text-xl font-bold text-slate-900 bg-transparent border-0"
              >
                Funcionalidades
              </button>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' }); }} 
                className="text-xl font-bold text-slate-900 bg-transparent border-0"
              >
                Demonstração
              </button>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' }); }} 
                className="text-xl font-bold text-slate-900 bg-transparent border-0"
              >
                Simulador
              </button>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' }); }} 
                className="text-xl font-bold text-slate-900 bg-transparent border-0"
              >
                Planos
              </button>
              <div className="pt-6 flex flex-col space-y-4">
                <button 
                  onClick={() => { setLoginMode('login'); setShowLogin(true); setIsMobileMenuOpen(false); }}
                  className="w-full py-3.5 text-lg font-bold border-2 border-slate-200 rounded-full text-slate-900 cursor-pointer bg-transparent"
                >
                  Entrar
                </button>
                <button 
                  onClick={() => { setLoginMode('register'); setShowLogin(true); setIsMobileMenuOpen(false); }}
                  className="w-full py-3.5 text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full shadow-lg shadow-primary-200 cursor-pointer border-0"
                >
                  Criar Conta
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden flex flex-col items-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white w-full border-b border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary-900/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="max-w-6xl mx-auto px-6 sm:px-10 text-center relative z-10 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-primary-950/60 border border-primary-800/40 rounded-full text-[10px] font-black uppercase tracking-widest text-primary-300"
            >
              <Zap size={12} className="text-primary-400" /> Recrutamento Avançado para Empresas
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold leading-[1.05] tracking-tight text-white mb-6 uppercase"
            >
              Contrate 4x mais rápido com <br className="hidden lg:block"/>
              <span className="text-[#8b5cf6] bg-gradient-to-r from-primary-400 to-highlight-500 bg-clip-text text-transparent italic">Inteligência Comportamental</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed font-semibold"
            >
              A única plataforma que unifica o Kanban de triagem visual, testes comportamentais avançados (DISC, MBTI e Temperamentos) e busca inteligente de candidatos por IA em um único lugar.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
            >
              <button 
                onClick={() => { setLoginMode('register'); setShowLogin(true); }}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-black text-xs uppercase tracking-widest rounded-full shadow-lg shadow-primary-500/20 hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer border-0"
              >
                Sou Empresa (Começar Grátis)
              </button>
              <button 
                onClick={() => { setLoginMode('register'); setShowLogin(true); }}
                className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-widest rounded-full border border-slate-700 hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer bg-transparent"
              >
                Sou Candidato (Cadastrar Currículo)
              </button>
              <button 
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-8 py-4 bg-transparent text-slate-300 hover:text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 hover:underline transition-all cursor-pointer border-0 outline-none"
              >
                Ver Demonstração <ArrowUpRight size={14} />
              </button>
            </motion.div>

            {/* Quick Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-12 flex flex-wrap justify-center items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-t border-slate-900/60 max-w-4xl mx-auto"
            >
              <span className="flex items-center gap-2">
                <Check size={14} className="text-primary-500" /> Sem Cartão de Crédito
              </span>
              <span className="flex items-center gap-2">
                <Check size={14} className="text-primary-500" /> 5 Créditos de Testes Grátis
              </span>
              <span className="flex items-center gap-2">
                <Check size={14} className="text-primary-500" /> Setup em 2 Minutos
              </span>
            </motion.div>
          </div>
        </section>

        {/* Demo Section (Interactive Showcase) */}
        <section id="demo" className="py-24 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 sm:px-10">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-xs font-black text-primary-600 uppercase tracking-widest">Painel Interativo</h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight uppercase">
                Experimente a Plataforma em Tempo Real
              </p>
              <p className="text-slate-500 font-semibold text-sm leading-relaxed">
                Clique nas abas abaixo para ver como o dashboard simplifica, acelera e qualifica os seus processos de recrutamento.
              </p>
            </div>

            {/* Browser Mockup Wrapper */}
            <div className="bg-slate-950 rounded-[10px] border border-slate-800 shadow-2xl overflow-hidden flex flex-col w-full max-w-5xl mx-auto">
              {/* Browser Top Bar */}
              <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-800/80">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="bg-slate-950/80 px-8 py-1 rounded-md text-[10px] text-slate-500 font-mono select-none">
                  app.colaborh.com/dashboard
                </div>
                <div className="w-12" />
              </div>

              {/* Selector Tabs Inside Mockup */}
              <div className="flex bg-slate-900 border-b border-slate-800/60 overflow-x-auto shrink-0 no-scrollbar">
                {[
                  { id: 'kanban', label: 'Pipeline Kanban', icon: Layers },
                  { id: 'ia', label: 'Busca Inteligente por IA', icon: Cpu },
                  { id: 'testes', label: 'Testes de Perfil', icon: Brain }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setDemoTab(tab.id as any)}
                      className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 outline-none cursor-pointer bg-transparent ${
                        demoTab === tab.id
                          ? 'border-primary-500 text-white bg-slate-950/30'
                          : 'border-transparent text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon size={14} className={demoTab === tab.id ? 'text-[#8b5cf6]' : 'text-slate-500'} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Mockup Canvas */}
              <div className="p-6 md:p-8 min-h-[420px] bg-slate-900/25 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {demoTab === 'kanban' && (
                    <motion.div
                      key="demo-kanban"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full text-left"
                    >
                      {[
                        { id: 'triagem', label: 'Triagem', bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
                        { id: 'testes', label: 'Testes Enviados', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
                        { id: 'entrevista', label: 'Entrevista', bg: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
                        { id: 'aprovado', label: 'Contratado', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' }
                      ].map((col) => {
                        const items = kanbanCandidates.filter(c => c.stage === col.id);
                        return (
                          <div key={col.id} className="bg-slate-900/50 p-4 rounded-[10px] border border-slate-800/60 flex flex-col gap-3 min-h-[200px]">
                            <div className={`px-2.5 py-1.5 rounded-[10px] border text-[9px] font-black uppercase tracking-wider ${col.bg} flex justify-between items-center`}>
                              <span>{col.label}</span>
                              <span className="font-extrabold">{items.length}</span>
                            </div>

                            <div className="flex flex-col gap-2 flex-grow overflow-y-auto">
                              <AnimatePresence>
                                {items.map((item) => (
                                  <motion.div
                                    key={item.id}
                                    layoutId={`candidate-${item.id}`}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ type: 'spring', stiffness: 220, damping: 25 }}
                                    className="bg-slate-950 p-3.5 rounded-[10px] border border-slate-800 hover:border-primary-500/40 shadow-sm space-y-2 select-none"
                                  >
                                    <div className="font-bold text-slate-100 text-xs uppercase truncate">{item.name}</div>
                                    <div className="text-[10px] text-slate-500 font-semibold truncate">{item.role}</div>
                                    <div className="flex gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                                      <span className="text-[8px] font-bold text-primary-400 uppercase tracking-wide">Status: Ok</span>
                                    </div>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}

                  {demoTab === 'ia' && (
                    <motion.div
                      key="demo-ia"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="w-full max-w-2xl mx-auto space-y-6 text-left"
                    >
                      {/* Search Bar Visual */}
                      <div className="bg-slate-950 p-4 rounded-[10px] border border-slate-800 flex items-center gap-3">
                        <Cpu size={16} className="text-primary-500" />
                        <div className="text-xs font-mono font-bold text-slate-100 flex-grow select-none">
                          {iaSearchQuery}
                          {iaSearchStep === 1 && <span className="w-1.5 h-4 ml-0.5 bg-primary-500 inline-block animate-pulse" />}
                        </div>
                        {iaSearchStep === 2 && (
                          <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin shrink-0" />
                        )}
                      </div>

                      {/* Search Results Visual */}
                      <div className="space-y-3">
                        {iaSearchStep >= 2 && (
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest select-none">
                            {iaSearchStep === 2 ? "Buscando correspondências..." : "Resultados obtidos via IA"}
                          </p>
                        )}
                        <AnimatePresence>
                          {iaResults.map((cand, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-slate-950 p-5 rounded-[10px] border border-slate-800 flex justify-between items-center gap-4 hover:border-primary-500/25 transition-all"
                            >
                              <div className="space-y-1.5">
                                <h4 className="font-extrabold text-slate-100 text-xs uppercase tracking-tight">{cand.name}</h4>
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{cand.xp} • {cand.skills}</p>
                              </div>
                              <span className="px-3 py-1.5 bg-primary-950 text-primary-400 border border-primary-800/40 rounded-full text-[10px] font-black tracking-wider uppercase shrink-0">
                                Match {cand.match}%
                              </span>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}

                  {demoTab === 'testes' && (
                    <motion.div
                      key="demo-testes"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="w-full max-w-xl mx-auto bg-slate-950 p-6 rounded-[10px] border border-slate-800 flex flex-col md:flex-row gap-6 text-left"
                    >
                      {/* Left Block */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <span className="px-2 py-0.5 bg-primary-950 text-primary-400 border border-primary-800/40 rounded-md text-[8px] font-black uppercase tracking-wider inline-block">
                            Candidato Analisado
                          </span>
                          <h4 className="font-extrabold text-slate-100 text-sm uppercase tracking-tight mt-1">Felipe de Souza</h4>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Desenvolvedor Backend Pleno</p>
                        </div>
                        <div className="p-3 bg-slate-900 rounded-[10px] border border-slate-800/60 text-[10px] font-bold text-slate-300 leading-relaxed">
                          <strong>Perfil MBTI:</strong> INTJ (Arquiteto)<br/>
                          <strong>DISC Principal:</strong> Conformidade (C)<br/>
                          <strong>Temperamento:</strong> Melancólico Analítico
                        </div>
                      </div>

                      {/* Right Block (DISC Bars) */}
                      <div className="flex-1 flex flex-col justify-center space-y-3">
                        <h5 className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Gráfico DISC da IA</h5>
                        {[
                          { dim: 'D', val: 85, color: '#f43f5e', label: 'Dominância (D)' },
                          { dim: 'I', val: 40, color: '#eab308', label: 'Influência (I)' },
                          { dim: 'S', val: 50, color: '#0ea5e9', label: 'Estabilidade (S)' },
                          { dim: 'C', val: 90, color: '#8b5cf6', label: 'Conformidade (C)' }
                        ].map((bar) => (
                          <div key={bar.dim} className="space-y-1">
                            <div className="flex justify-between text-[9px] font-bold text-slate-400">
                              <span>{bar.label}</span>
                              <span>{bar.val}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${bar.val}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: bar.color }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* Features Highlights Grid */}
        <section id="features" className="py-24 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 sm:px-10">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-xs font-black text-primary-600 uppercase tracking-widest">Recursos Inovadores</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight uppercase">
                Funcionalidades Feitas Para Converter
              </h3>
              <p className="text-slate-500 font-semibold text-sm leading-relaxed">
                Toda a infraestrutura que o seu setor de Recursos Humanos necessita para atrair os candidatos adequados e otimizar a tomada de decisões corporativas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Triagem com IA",
                  desc: "Busque no banco de talentos usando termos livres. A Inteligência Artificial analisa o contexto dos currículos e ranqueia por afinidade.",
                  icon: Cpu,
                  color: "text-indigo-600 bg-indigo-50 border-indigo-100"
                },
                {
                  title: "Suíte de Testes DISC & MBTI",
                  desc: "Solicite testes comportamentais completos. Veja o resultado consolidado e relatórios descritivos de forma automatizada no Kanban.",
                  icon: Brain,
                  color: "text-rose-600 bg-rose-50 border-rose-100"
                },
                {
                  title: "Pipeline Visual Kanban",
                  desc: "Acompanhe candidaturas de forma arrastável. Mude o status do candidato com ações rápidas para organizar as etapas de triagem.",
                  icon: Layers,
                  color: "text-violet-600 bg-violet-50 border-violet-100"
                },
                {
                  title: "Notificações Automatizadas",
                  desc: "Mantenha o alinhamento completo. O sistema notifica candidatos de alterações de etapa e envia lembretes de pendências automaticamente.",
                  icon: MessageSquare,
                  color: "text-sky-600 bg-sky-50 border-sky-100"
                },
                {
                  title: "Questionários Customizados",
                  desc: "Crie questionários específicos utilizando o nosso construtor lateral (drawer), organizando perguntas de texto ou múltipla escolha.",
                  icon: FileText,
                  color: "text-emerald-600 bg-emerald-50 border-emerald-100"
                },
                {
                  title: "Gestão Multicompanhia",
                  desc: "Cadastre diferentes marcas e empresas parceiras. Tenha isolamento de dados cadastrais e faturamento corporativo unificado.",
                  icon: Building,
                  color: "text-amber-600 bg-amber-50 border-amber-100"
                }
              ].map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <motion.div
                    key={i}
                    whileHover={{ y: -6 }}
                    className="bg-white p-8 rounded-[10px] border border-slate-200/60 shadow-xs flex flex-col gap-6 text-left hover:border-primary-500/30 hover:shadow-md transition-all group"
                  >
                    <div className={`w-12 h-12 rounded-[10px] flex items-center justify-center border shrink-0 ${feat.color}`}>
                      <Icon size={22} className="stroke-[2]" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-tight group-hover:text-primary-600 transition-colors">
                        {feat.title}
                      </h4>
                      <p className="text-xs text-slate-550 leading-relaxed font-semibold">
                        {feat.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Interactive Simulator Section */}
        <section id="simulator" className="py-24 bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-6 sm:px-10">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-xs font-black text-primary-600 uppercase tracking-widest">Teste Interativo</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight uppercase">
                Simulador de Análise Comportamental
              </h3>
              <p className="text-slate-500 font-semibold text-sm leading-relaxed">
                Responda a 3 perguntas rápidas para ter uma amostra do funcionamento do nosso mapeamento comportamental psicométrico.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-8 md:p-12 rounded-[10px] shadow-sm max-w-2xl mx-auto text-left">
              <AnimatePresence mode="wait">
                {testStep === 0 && (
                  <motion.div
                    key="step-start"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="text-center space-y-6"
                  >
                    <div className="w-16 h-16 bg-primary-50 text-primary-600 border border-primary-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <Brain size={28} className="stroke-[2.5]" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-slate-900 text-base uppercase tracking-tight">Qual é o seu estilo comportamental?</h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                        Este simulador simplificado demonstrará como calculamos a compatibilidade de cargos e os traços dominantes dos candidatos.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setTestStep(1); setTestAnswers([]); }}
                      className="px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-black text-[10px] uppercase tracking-widest rounded-full shadow-md active:scale-95 transition-all cursor-pointer border-0"
                    >
                      Iniciar Simulador
                    </button>
                  </motion.div>
                )}

                {testStep >= 1 && testStep <= 3 && (() => {
                  const q = simulatorQuestions[testStep - 1];
                  return (
                    <motion.div
                      key={`step-${testStep}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {/* Step Indicator */}
                      <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Simulador Comportamental</span>
                        <span>Pergunta {testStep} de 3</span>
                      </div>

                      {/* Question Text */}
                      <h4 className="font-extrabold text-slate-800 text-sm leading-relaxed uppercase tracking-tight pl-1">
                        {q.question}
                      </h4>

                      {/* Options List */}
                      <div className="flex flex-col gap-3">
                        {q.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => {
                              const newAns = [...testAnswers, opt.type];
                              setTestAnswers(newAns);
                              setTestStep(prev => prev + 1);
                            }}
                            className="p-5 bg-white hover:bg-primary-50 text-left border border-slate-200 hover:border-primary-300 rounded-[10px] text-xs font-bold text-slate-700 transition-all cursor-pointer active:scale-[0.99] select-none"
                          >
                            {opt.text}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  );
                })()}

                {testStep === 4 && (() => {
                  const res = getSimulatorResult();
                  return (
                    <motion.div
                      key="step-result"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                          <Check size={18} className="stroke-[2.5]" />
                        </div>
                        <div>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Resultado da Prévia</span>
                          <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-tight">{res.title}</h4>
                        </div>
                      </div>

                      <div className="p-5 bg-white border border-slate-200/80 rounded-[10px] space-y-4">
                        <p className="text-xs text-slate-650 leading-relaxed font-semibold font-sans">
                          {res.desc}
                        </p>
                        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-[10px] text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                          <strong className="text-slate-800">Uso do Perfil:</strong> {res.tips}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setTestStep(0)}
                          className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-[10px] uppercase tracking-widest rounded-full transition-all cursor-pointer border-0"
                        >
                          Refazer Teste
                        </button>
                        <button
                          type="button"
                          onClick={() => { setLoginMode('register'); setShowLogin(true); }}
                          className="flex-1 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-black text-[10px] uppercase tracking-widest rounded-full shadow-md active:scale-95 transition-all cursor-pointer border-0"
                        >
                          Contratar com este Perfil
                        </button>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Pricing/Plans Section */}
        <section id="plans" className="py-24 bg-slate-50 border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-6 sm:px-10">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <h2 className="text-xs font-black text-primary-600 uppercase tracking-widest">Nossos Planos</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight uppercase">
                Planos de Assinatura Flexíveis
              </h3>
              <p className="text-slate-500 font-semibold text-sm leading-relaxed">
                Escolha o plano ideal para as necessidades de recrutamento do seu negócio e comece a testar talentos agora mesmo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {/* Plan: Starter */}
              <div className="bg-white p-8 rounded-[10px] border border-slate-200 flex flex-col justify-between text-left hover:shadow-md transition-shadow">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Starter</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Para pequenos times</p>
                  </div>
                  <div className="flex items-baseline gap-1 select-none">
                    <span className="text-3xl font-extrabold text-slate-900">Grátis</span>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    Comece a experimentar a plataforma com todas as funcionalidades inclusas sem custos recorrentes.
                  </p>
                  <div className="border-t border-slate-100 my-4" />
                  <ul className="space-y-3.5 text-xs text-slate-650 font-bold">
                    <li className="flex items-center gap-2.5">
                      <Check size={14} className="text-emerald-500 shrink-0" />
                      <span>5 créditos de testes comportamentais</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check size={14} className="text-emerald-500 shrink-0" />
                      <span>Limite de até 2 vagas ativas</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check size={14} className="text-emerald-500 shrink-0" />
                      <span>Kanban de triagem visual</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-slate-350 line-through decoration-slate-300">
                      <X size={14} className="text-slate-300 shrink-0" />
                      <span>Busca com Inteligência Artificial</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => { setLoginMode('register'); setShowLogin(true); }}
                  className="w-full py-3.5 mt-8 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-[10px] uppercase tracking-widest rounded-full transition-all cursor-pointer border-0"
                >
                  Começar Teste Grátis
                </button>
              </div>

              {/* Plan: Growth (Recommended) */}
              <div className="bg-white p-8 rounded-[10px] border-2 border-primary-500 flex flex-col justify-between text-left relative shadow-lg shadow-primary-500/5">
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-500 text-white rounded-full text-[8.5px] font-black uppercase tracking-widest shadow-sm">
                  Mais Recomendado
                </span>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Growth</h4>
                    <p className="text-xs text-primary-600 font-black uppercase tracking-wider mt-0.5">Recrutamento acelerado</p>
                  </div>
                  <div className="flex items-baseline gap-1 select-none">
                    <span className="text-sm font-extrabold text-slate-500">R$</span>
                    <span className="text-4xl font-black text-slate-900">149</span>
                    <span className="text-xs font-bold text-slate-400">/mês</span>
                  </div>
                  <p className="text-xs text-slate-550 font-semibold leading-relaxed">
                    Perfeito para empresas em crescimento constante que precisam qualificar sua equipe de RH com testes.
                  </p>
                  <div className="border-t border-slate-100 my-4" />
                  <ul className="space-y-3.5 text-xs text-slate-650 font-bold">
                    <li className="flex items-center gap-2.5">
                      <Check size={14} className="text-primary-500 shrink-0" />
                      <span className="text-slate-900 font-extrabold">30 créditos de testes por mês</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check size={14} className="text-primary-500 shrink-0" />
                      <span>Limite de até 8 vagas ativas</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check size={14} className="text-primary-500 shrink-0" />
                      <span>Busca inteligente com IA</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check size={14} className="text-primary-500 shrink-0" />
                      <span>Banco de talentos completo</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check size={14} className="text-primary-500 shrink-0" />
                      <span>Suporte prioritário e chat</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => { setLoginMode('register'); setShowLogin(true); }}
                  className="w-full py-3.5 mt-8 bg-primary-600 hover:bg-primary-700 text-white font-black text-[10px] uppercase tracking-widest rounded-full shadow-md active:scale-95 transition-all cursor-pointer border-0"
                >
                  Assinar Plano Growth
                </button>
              </div>

              {/* Plan: Enterprise */}
              <div className="bg-white p-8 rounded-[10px] border border-slate-200 flex flex-col justify-between text-left hover:shadow-md transition-shadow">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Enterprise</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Demanda customizada</p>
                  </div>
                  <div className="flex items-baseline gap-1 select-none">
                    <span className="text-3xl font-extrabold text-slate-900">Personalizado</span>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    Para grandes corporações que necessitam de integrações de software dedicadas e alta volumetria.
                  </p>
                  <div className="border-t border-slate-100 my-4" />
                  <ul className="space-y-3.5 text-xs text-slate-650 font-bold">
                    <li className="flex items-center gap-2.5">
                      <Check size={14} className="text-emerald-500 shrink-0" />
                      <span>Vagas ativas ilimitadas</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check size={14} className="text-emerald-500 shrink-0" />
                      <span>Créditos de testes ilimitados</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check size={14} className="text-emerald-500 shrink-0" />
                      <span>Integração customizada com outros softwares</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check size={14} className="text-emerald-500 shrink-0" />
                      <span>Gerente de contas dedicado</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => alert("Entre em contato com nosso time comercial em comercial@colaborh.com")}
                  className="w-full py-3.5 mt-8 bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-widest rounded-full transition-all cursor-pointer border-0"
                >
                  Falar Com Consultor
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials (Social Proof) */}
        <section className="py-24 bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-6 sm:px-10">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-xs font-black text-primary-600 uppercase tracking-widest">Casos de Sucesso</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight uppercase">
                Quem Utiliza e Recomenda
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {[
                {
                  quote: "Reduzimos em 70% o tempo gasto na triagem inicial de currículos. A busca inteligente do banco de talentos por IA nos traz as pessoas exatas que precisamos.",
                  author: "Regina Vasconcelos",
                  role: "Head de Talent Acquisition na TechFlow"
                },
                {
                  quote: "A facilidade de poder disparar testes DISC e MBTI diretamente pelo pipeline Kanban do processo seletivo transformou a qualidade das nossas contratações.",
                  author: "Marcelo Albuquerque",
                  role: "Gerente de Recursos Humanos na CreativeBox"
                }
              ].map((t, i) => (
                <div key={i} className="bg-slate-50 p-8 rounded-[10px] border border-slate-200/60 shadow-xs space-y-4 flex flex-col justify-between">
                  <p className="text-xs text-slate-650 leading-relaxed font-semibold italic">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center font-black text-xs text-primary-700">
                      {t.author.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-900 text-xs uppercase tracking-tight">{t.author}</h5>
                      <p className="text-[10px] text-slate-400 font-semibold">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900 text-left">
          <div className="max-w-7xl mx-auto px-6 sm:px-10">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-1 space-y-6">
                <div>
                  <img 
                    src="/logo.png" 
                    alt="Colaborh Logo" 
                    className="h-10 w-auto object-contain brightness-0 invert"
                  />
                </div>
                <p className="text-xs leading-relaxed text-slate-400 font-semibold">
                  Conectando talentos e empresas através de dados inteligentes de perfil e comportamento. O futuro da contratação corporativa.
                </p>
              </div>
              <div>
                <h4 className="text-white text-xs font-black uppercase tracking-wider mb-6">Funcionalidades</h4>
                <ul className="space-y-4 text-xs font-semibold">
                  <li><a href="#features" className="hover:text-primary-400 transition-colors">Triagem por IA</a></li>
                  <li><a href="#demo" className="hover:text-primary-400 transition-colors">Pipeline Kanban</a></li>
                  <li><a href="#simulator" className="hover:text-primary-400 transition-colors">Testes Comportamentais</a></li>
                  <li><a href="#features" className="hover:text-primary-400 transition-colors">Questionários Customizados</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white text-xs font-black uppercase tracking-wider mb-6">Empresa</h4>
                <ul className="space-y-4 text-xs font-semibold">
                  <li><a href="#plans" className="hover:text-primary-400 transition-colors">Planos de Assinatura</a></li>
                  <li><a href="#" className="hover:text-primary-400 transition-colors">Termos de Serviço</a></li>
                  <li><a href="#" className="hover:text-primary-400 transition-colors">Política de Privacidade</a></li>
                  <li><a href="#" className="hover:text-primary-400 transition-colors">Contato Comercial</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white text-xs font-black uppercase tracking-wider mb-6">Sobre o Portal</h4>
                <p className="text-xs leading-relaxed font-semibold">
                  Desenvolvido com foco em alta performance e experiência corporativa. © 2026 Colabora Tecnologia Ltda.
                </p>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-900 text-xs flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
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
