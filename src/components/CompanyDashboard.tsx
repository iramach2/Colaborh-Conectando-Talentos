import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Users, 
  Briefcase, 
  BarChart3, 
  Search, 
  Settings, 
  LogOut, 
  Plus, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle,
  ChevronRight,
  Filter,
  Menu,
  Eye,
  MoreVertical,
  Mail,
  Calendar,
  User,
  Share2,
  FileText,
  PlusCircle,
  Building,
  Phone,
  Trash2,
  Check,
  ChevronLeft,
  Pencil,
  Upload,
  Sparkles,
  Zap,
  Cpu,
  BrainCircuit,
  Brain,
  MessageSquare,
  ChevronDown,
  X as CloseIcon,
  Loader2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Award,
  PieChart as PieChartIcon,
  StickyNote,
  Compass,
  Bell,
  GraduationCap,
  ChevronUp,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { perfisDISC, MBTI_PROFILES, MBTI_QUESTIONS, MbtiProfile, MbtiQuestion, TEMPERAMENTOS_PROFILES, TEMPERAMENTOS_QUESTIONS } from './CandidateDashboard';
import { supabase } from '../lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const APPLICATION_DATA = [
  { name: 'Seg', applications: 45, views: 120 },
  { name: 'Ter', applications: 52, views: 150 },
  { name: 'Qua', applications: 38, views: 110 },
  { name: 'Qui', applications: 65, views: 180 },
  { name: 'Sex', applications: 48, views: 140 },
  { name: 'Sab', applications: 20, views: 70 },
  { name: 'Dom', applications: 15, views: 50 },
];

const VACANCY_DISTRIBUTION = [
  { name: 'Triagem', value: 40, color: '#6366f1' },
  { name: 'Entrevista', value: 30, color: '#10b981' },
  { name: 'Teste', value: 20, color: '#f59e0b' },
  { name: 'Contratado', value: 10, color: '#8b5cf6' },
];

const TOP_SKILLS = [
  { name: 'React', count: 85 },
  { name: 'Vendas', count: 72 },
  { name: 'Liderança', count: 45 },
  { name: 'Inglês', count: 38 },
  { name: 'Design', count: 32 },
];

const BRAZIL_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const DF_REGIONS = [
  'Brasília (Plano Piloto)', 'Águas Claras', 'Ceilândia', 'Taguatinga', 'Samambaia', 'Guará', 'Gama',
  'Vicente Pires', 'Sobradinho', 'Sobradinho II', 'Planaltina', 'Santa Maria', 'São Sebastião',
  'Recanto das Emas', 'Riacho Fundo', 'Riacho Fundo II', 'Núcleo Bandeirante', 'Cruzeiro',
  'Lago Norte', 'Lago Sul', 'Jardim Botânico', 'Itapoã', 'Paranoá', 'Park Way', 'SCIA/Estrutural',
  'SIA', 'Varjão', 'Brazlândia', 'Fercal', 'Arniqueira', 'Sol Nascente/Pôr do Sol',
  // Cidades do Entorno (RIDE)
  'Valparaíso de Goiás', 'Luziânia', 'Novo Gama', 'Cidade Ocidental', 'Águas Lindas de Goiás',
  'Santo Antônio do Descoberto', 'Formosa', 'Planaltina de Goiás', 'Cristalina', 'Padre Bernardo'
].sort();

export const parseCandidatePhoneData = (phoneStr: string) => {
  if (!phoneStr) return { phone: '', disc: '', notes: '', questions: '', mbti: '', temperamentos: '', customTest: '', discDate: null, questionsDate: null, mbtiDate: null, temperamentosDate: null, customTestDate: null };
  
  const extractValueAndDate = (str: string) => {
    if (!str) return { value: '', date: null };
    if (str.includes('===DATE===')) {
      const parts = str.split('===DATE===');
      return { value: parts[0].trim(), date: parts[1].trim() };
    }
    return { value: str.trim(), date: null };
  };

  let phone = phoneStr.split('===DISC===')[0].split('===NOTES===')[0].split('===QUESTIONS===')[0].split('===MBTI===')[0].split('===TEMPERAMENTOS===')[0].split('===CUSTOM_TEST===')[0].trim();
  
  let notes = '';
  if (phoneStr.includes('===NOTES===')) {
    const afterNotes = phoneStr.split('===NOTES===')[1];
    notes = afterNotes.split('===DISC===')[0].split('===QUESTIONS===')[0].split('===MBTI===')[0].split('===TEMPERAMENTOS===')[0].split('===CUSTOM_TEST===')[0].trim();
  }
  
  let disc = '';
  if (phoneStr.includes('===DISC===')) {
    const afterDisc = phoneStr.split('===DISC===')[1];
    disc = afterDisc.split('===NOTES===')[0].split('===QUESTIONS===')[0].split('===MBTI===')[0].split('===TEMPERAMENTOS===')[0].split('===CUSTOM_TEST===')[0].trim();
  }

  let questions = '';
  if (phoneStr.includes('===QUESTIONS===')) {
    const afterQuestions = phoneStr.split('===QUESTIONS===')[1];
    questions = afterQuestions.split('===DISC===')[0].split('===NOTES===')[0].split('===MBTI===')[0].split('===TEMPERAMENTOS===')[0].split('===CUSTOM_TEST===')[0].trim();
  }

  let mbti = '';
  if (phoneStr.includes('===MBTI===')) {
    const afterMbti = phoneStr.split('===MBTI===')[1];
    mbti = afterMbti.split('===DISC===')[0].split('===NOTES===')[0].split('===QUESTIONS===')[0].split('===TEMPERAMENTOS===')[0].split('===CUSTOM_TEST===')[0].trim();
  }

  let temperamentos = '';
  if (phoneStr.includes('===TEMPERAMENTOS===')) {
    const afterTemp = phoneStr.split('===TEMPERAMENTOS===')[1];
    temperamentos = afterTemp.split('===DISC===')[0].split('===NOTES===')[0].split('===QUESTIONS===')[0].split('===MBTI===')[0].split('===CUSTOM_TEST===')[0].trim();
  }

  let customTest = '';
  if (phoneStr.includes('===CUSTOM_TEST===')) {
    const afterCustom = phoneStr.split('===CUSTOM_TEST===')[1];
    customTest = afterCustom.split('===DISC===')[0].split('===NOTES===')[0].split('===QUESTIONS===')[0].split('===MBTI===')[0].split('===TEMPERAMENTOS===')[0].trim();
  }
  
  const discData = extractValueAndDate(disc);
  const questionsData = extractValueAndDate(questions);
  const mbtiData = extractValueAndDate(mbti);
  const temperamentosData = extractValueAndDate(temperamentos);
  const customTestData = extractValueAndDate(customTest);
  
  return { 
    phone, 
    disc: discData.value, 
    discDate: discData.date,
    notes, 
    questions: questionsData.value, 
    questionsDate: questionsData.date,
    mbti: mbtiData.value, 
    mbtiDate: mbtiData.date,
    temperamentos: temperamentosData.value, 
    temperamentosDate: temperamentosData.date,
    customTest: customTestData.value,
    customTestDate: customTestData.date
  };
};

const formatDate = (dateStr: any) => {
  if (!dateStr) return 'Não inf.';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    if (typeof dateStr === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      return dateStr;
    }
    return d.toLocaleDateString('pt-BR');
  } catch (e) {
    return String(dateStr);
  }
};

export const serializeCandidatePhoneData = (
  phone: string, 
  disc: string = '', 
  notes: string = '', 
  questions: string = '', 
  mbti: string = '', 
  temperamentos: string = '',
  customTest: string = ''
) => {
  let result = phone.trim();
  if (disc && disc.trim()) {
    result += ` ===DISC===${disc.trim()}`;
  }
  if (notes && notes.trim()) {
    result += ` ===NOTES===${notes.trim()}`;
  }
  if (questions && questions.trim()) {
    result += ` ===QUESTIONS===${questions.trim()}`;
  }
  if (mbti && mbti.trim()) {
    result += ` ===MBTI===${mbti.trim()}`;
  }
  if (temperamentos && temperamentos.trim()) {
    result += ` ===TEMPERAMENTOS===${temperamentos.trim()}`;
  }
  if (customTest && customTest.trim()) {
    result += ` ===CUSTOM_TEST===${customTest.trim()}`;
  }
  return result;
};

export const getCustomQuestionsFromJobDescription = (description: string): any[] => {
  if (!description) return [];
  const regex = /===CUSTOM_QUESTIONS_JSON===([\s\S]*?)===FIM_CUSTOM_QUESTIONS===/;
  const match = description.match(regex);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1].trim());
    } catch (e) {
      console.error("Erro ao fazer parse do JSON de perguntas customizadas:", e);
    }
  }
  return [];
};

export const QUESTIONS_CATEGORIES = {
  EXPERIENCE: {
    title: "Experiência Profissional",
    questions: [
      "Conte sobre sua trajetória profissional e as principais atividades que desempenhou, na vaga para qual está se candidatando;",
      "Qual foi a experiência profissional mais significativa da sua carreira até o momento? Por quê?",
      "Quais habilidades você desenvolveu ao longo das suas experiências anteriores?",
      "Fale sobre um desafio profissional que enfrentou e como conseguiu solucioná-lo.",
      "Cite uma conquista profissional da qual você se orgulha e explique sua participação."
    ]
  },
  CONTRIBUTION: {
    title: "Contribuição e Resultados",
    questions: [
      "De que forma você acredita que pode contribuir para nossa empresa e equipe? (Qual seu diferencial para a vaga em que está se candidatando)",
      "Em experiências anteriores, o que você fez que trouxe resultados positivos para a empresa?",
      "Você já identificou alguma melhoria em processos ou atividades no ambiente de trabalho? Explique.",
      "Como você costuma lidar com metas, prazos e cobranças?",
      "O que considera essencial para gerar bons resultados no trabalho."
    ]
  },
  TEAMWORK: {
    title: "Trabalho em Equipe",
    questions: [
      "Como você define um bom trabalho em equipe?",
      "Conte uma situação em que precisou colaborar com colegas para alcançar um objetivo.",
      "Como você reage quando existem opiniões diferentes dentro da equipe?",
      "Qual costuma ser seu papel dentro de uma equipe: líder, apoiador, organizador, executor ou outro? Explique.",
      "O que você considera mais importante para manter um ambiente de trabalho saudável."
    ]
  },
  BEHAVIORAL: {
    title: "Comportamental",
    questions: [
      "Como você lida com mudanças inesperadas ou situações fora do planejamento?",
      "Como costuma reagir diante de pressão ou momentos de grande demanda?",
      "Cite três características pessoais que considera seus pontos fortes.",
      "Qual comportamento ou habilidade você busca melhorar em si mesmo atualmente?",
      "O que mais motiva você em um ambiente de trabalho?"
    ]
  }
};

export const ALL_QUESTIONS_LIST = [
  ...QUESTIONS_CATEGORIES.EXPERIENCE.questions,
  ...QUESTIONS_CATEGORIES.CONTRIBUTION.questions,
  ...QUESTIONS_CATEGORIES.TEAMWORK.questions,
  ...QUESTIONS_CATEGORIES.BEHAVIORAL.questions
];


interface CompanyDashboardProps {
  onLogout: () => void;
}

interface Company {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  solicitante: string;
  sector: string;
  logo?: string;
}

interface SidebarItemProps {
  icon: any;
  label: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarExpanded: boolean;
}

const SidebarItem = ({ icon: Icon, label, activeTab, setActiveTab, isSidebarExpanded }: SidebarItemProps) => (
  <div className="relative group/item w-full flex justify-center h-12 lg:h-12">
    <button
      onClick={() => setActiveTab(label)}
      className={`w-full ${
        isSidebarExpanded 
          ? 'lg:w-full lg:h-12 lg:px-4 lg:justify-start lg:space-x-3' 
          : 'lg:w-12 lg:h-12 lg:px-0 lg:justify-center lg:space-x-0'
      } flex items-center justify-start space-x-3 py-3.5 rounded-2xl transition-all duration-300 bg-transparent text-white/60 hover:text-white hover:bg-white/10`}
      style={{
        backgroundColor: activeTab === label ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
        color: activeTab === label ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
        boxShadow: activeTab === label ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : 'none'
      }}
    >
      <Icon size={18} className={activeTab === label ? 'text-white' : 'text-white/50'} />
      <span className={`font-bold text-[11px] uppercase tracking-widest whitespace-nowrap ${isSidebarExpanded ? 'lg:inline-block' : 'lg:hidden'}`}>{label}</span>
    </button>

    {/* Balão/Tooltip flutuante de sobreposição perfeita no desktop com animação slide-in e leve transparência */}
    <div 
      onClick={() => setActiveTab(label)}
      className={`absolute left-0 top-0 h-12 ${isSidebarExpanded ? 'hidden' : 'hidden lg:flex'} items-center justify-start bg-[#533af6]/75 backdrop-blur-[6px] text-white rounded-2xl shadow-[0_10px_25px_rgba(83,58,246,0.25)] cursor-pointer pointer-events-none opacity-0 translate-x-[-24px] group-hover/item:opacity-100 group-hover/item:translate-x-0 group-hover/item:pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-[110] w-auto whitespace-nowrap pl-[15px] pr-6 gap-3`}
    >
      <Icon size={18} className="text-white" />
      <span className="font-black text-[10px] uppercase tracking-widest text-white leading-none mt-0.5">{label}</span>
    </div>
  </div>
);



export default function CompanyDashboard({ onLogout }: CompanyDashboardProps) {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [activeApplicantForTests, setActiveApplicantForTests] = useState<any | null>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [activeStageTab, setActiveStageTab] = useState<string>('');
  const [draggedStage, setDraggedStage] = useState<string | null>(null);
  const [expandedSummaries, setExpandedSummaries] = useState<Record<string, boolean>>({});
  
  // Estados para as sub-abas de Avaliações e Questionários Customizados
  const [resultsSubTab, setResultsSubTab] = useState<'relatorios' | 'guia' | 'criar'>('relatorios');
  const [customQuestions, setCustomQuestions] = useState<any[]>([]);
  const [isCustomTestModalOpen, setIsCustomTestModalOpen] = useState(false);
  const [selectedApplicantForCustomTest, setSelectedApplicantForCustomTest] = useState<any>(null);

  // Estados para questionários customizados na biblioteca (localStorage)
  const [customTemplates, setCustomTemplates] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('colaborh_custom_templates');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Erro ao carregar colaborh_custom_templates:', e);
      return [];
    }
  });
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [isCreatingNewTemplate, setIsCreatingNewTemplate] = useState<boolean>(false);
  const [customTestTitle, setCustomTestTitle] = useState<string>('');

  // Estados para o modal de solicitação de questionário
  const [isSelectCustomTemplateModalOpen, setIsSelectCustomTemplateModalOpen] = useState(false);
  const [applicantForRequestCustom, setApplicantForRequestCustom] = useState<any>(null);
  const [selectedTemplateIdForRequest, setSelectedTemplateIdForRequest] = useState<string | null>(null);

  const addCustomQuestion = (type: 'text' | 'choice') => {
    const newQ = {
      id: Date.now().toString(),
      type,
      question: '',
      options: type === 'choice' ? ['', ''] : undefined
    };
    setCustomQuestions(prev => [...prev, newQ]);
  };

  const removeCustomQuestion = (id: string) => {
    setCustomQuestions(prev => prev.filter(q => q.id !== id));
  };

  const updateCustomQuestionText = (id: string, text: string) => {
    setCustomQuestions(prev => prev.map(q => q.id === id ? { ...q, question: text } : q));
  };

  const addOptionToChoice = (qId: string) => {
    setCustomQuestions(prev => prev.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          options: [...(q.options || []), '']
        };
      }
      return q;
    }));
  };

  const removeOptionFromChoice = (qId: string, optIndex: number) => {
    setCustomQuestions(prev => prev.map(q => {
      if (q.id === qId) {
        const newOpts = [...(q.options || [])];
        newOpts.splice(optIndex, 1);
        return {
          ...q,
          options: newOpts
        };
      }
      return q;
    }));
  };

  const updateOptionText = (qId: string, optIndex: number, text: string) => {
    setCustomQuestions(prev => prev.map(q => {
      if (q.id === qId) {
        const newOpts = [...(q.options || [])];
        newOpts[optIndex] = text;
        return {
          ...q,
          options: newOpts
        };
      }
      return q;
    }));
  };

  const handleSaveCustomTemplate = () => {
    if (!customTestTitle.trim()) {
      alert('Por favor, informe o nome do questionário.');
      return;
    }

    for (let i = 0; i < customQuestions.length; i++) {
      const q = customQuestions[i];
      if (!q.question.trim()) {
        alert(`A pergunta nº ${i + 1} está com o enunciado vazio.`);
        return;
      }
      if (q.type === 'choice') {
        if (!q.options || q.options.length < 2) {
          alert(`A pergunta de múltipla escolha nº ${i + 1} precisa ter pelo menos 2 opções.`);
          return;
        }
        for (let oIdx = 0; oIdx < q.options.length; oIdx++) {
          if (!q.options[oIdx].trim()) {
            alert(`A opção ${oIdx + 1} da pergunta nº ${i + 1} está vazia.`);
            return;
          }
        }
      }
    }

    let updatedTemplates = [...customTemplates];
    if (editingTemplateId) {
      // Editar existente
      updatedTemplates = updatedTemplates.map(t => {
        if (t.id === editingTemplateId) {
          return {
            ...t,
            title: customTestTitle,
            questions: customQuestions,
            updatedAt: new Date().toISOString()
          };
        }
        return t;
      });
      alert('Questionário atualizado com sucesso na biblioteca!');
    } else {
      // Criar novo
      const newTemplate = {
        id: Date.now().toString(),
        title: customTestTitle,
        questions: customQuestions,
        createdAt: new Date().toISOString()
      };
      updatedTemplates.push(newTemplate);
      alert('Questionário salvo com sucesso na biblioteca!');
    }

    localStorage.setItem('colaborh_custom_templates', JSON.stringify(updatedTemplates));
    setCustomTemplates(updatedTemplates);
    setEditingTemplateId(null);
    setIsCreatingNewTemplate(false);
    setCustomTestTitle('');
    setCustomQuestions([]);
  };

  const handleEditCustomTemplate = (template: any) => {
    setEditingTemplateId(template.id);
    setIsCreatingNewTemplate(false);
    setCustomTestTitle(template.title);
    setCustomQuestions(template.questions || []);
  };

  const handleDeleteCustomTemplate = (templateId: string) => {
    if (confirm('Tem certeza que deseja excluir este questionário da biblioteca? Candidatos que já receberam este questionário não serão afetados.')) {
      const updated = customTemplates.filter(t => t.id !== templateId);
      localStorage.setItem('colaborh_custom_templates', JSON.stringify(updated));
      setCustomTemplates(updated);
    }
  };

  const handleStartNewTemplate = () => {
    setEditingTemplateId(null);
    setIsCreatingNewTemplate(true);
    setCustomTestTitle('');
    setCustomQuestions([]);
  };

  const handleCancelTemplateEdit = () => {
    setEditingTemplateId(null);
    setIsCreatingNewTemplate(false);
    setCustomTestTitle('');
    setCustomQuestions([]);
  };

  const toggleSummary = (appId: string) => {
    setExpandedSummaries(prev => ({
      ...prev,
      [appId]: !prev[appId]
    }));
  };
  
  // Função para calcular o score de match (0 a 100) do candidato para a vaga
  const calculateAiMatchScore = (job: any, fullApp: any) => {
    if (!job || !fullApp) return 0;
    
    const talent = fullApp.talentMatched;
    if (!talent) return 50; // Se não tiver perfil detalhado, dá um match médio padrão
    
    let score = 0;
    let totalPossible = 0;
    
    // 1. MATCH DE HABILIDADES (SKILLS) - Peso 40%
    const jobSkills = job.requirements || [];
    const candidateSkills = talent.skills || [];
    
    if (jobSkills.length > 0) {
      let matchedSkills = 0;
      jobSkills.forEach((reqSkill: string) => {
        // Checagem case-insensitive e parcial
        const matched = candidateSkills.some((candSkill: string) => 
          candSkill.toLowerCase().trim().includes(reqSkill.toLowerCase().trim()) ||
          reqSkill.toLowerCase().trim().includes(candSkill.toLowerCase().trim())
        );
        if (matched) matchedSkills++;
      });
      
      const skillsRatio = matchedSkills / jobSkills.length;
      score += skillsRatio * 40;
    } else {
      // Se a vaga não exige habilidades específicas, assume match de 30 pontos padrão na categoria
      score += 30;
    }
    totalPossible += 40;
    
    // 2. MATCH DE CARGO / TÍTULO (ROLE) - Peso 20%
    const jobTitle = (job.title || '').toLowerCase();
    const candidateRole = (talent.role || '').toLowerCase();
    const candidateSummary = (talent.summary || '').toLowerCase();
    
    let titleMatchPoints = 0;
    if (candidateRole) {
      // Se os títulos de cargo são muito parecidos
      if (jobTitle.includes(candidateRole) || candidateRole.includes(jobTitle)) {
        titleMatchPoints = 20;
      } else {
        // Palavras chave comuns nos cargos (ex: desenvolvedor, vendedor, gerente, analista)
        const jobWords = jobTitle.split(/\s+/).filter((w: string) => w.length > 3);
        let matchCount = 0;
        jobWords.forEach((word: string) => {
          if (candidateRole.includes(word) || candidateSummary.includes(word)) {
            matchCount++;
          }
        });
        
        if (matchCount > 0) {
          titleMatchPoints = Math.min(20, 10 + matchCount * 3);
        } else {
          titleMatchPoints = 5; // match mínimo de afinidade se não achar palavras-chave
        }
      }
    }
    score += titleMatchPoints;
    totalPossible += 20;
    
    // 3. MATCH DE LOCALIZAÇÃO E MODALIDADE - Peso 15%
    let locMatch = 15;
    const jobModality = (job.modality || '').toLowerCase();
    const candidateModality = (talent.modality || '').toLowerCase();
    
    // Se a vaga for presencial e os locais forem diferentes
    if (jobModality.includes('presencial')) {
      const jobCity = (job.city || '').toLowerCase().trim();
      const jobState = (job.state || '').toLowerCase().trim();
      const candCity = (talent.city || '').toLowerCase().trim();
      const candState = (talent.state || '').toLowerCase().trim();
      
      if (jobCity && candCity && jobCity !== candCity) {
        locMatch -= 8; // penalidade por cidade diferente
      }
      if (jobState && candState && jobState !== candState) {
        locMatch -= 5; // penalidade por estado diferente
      }
      
      // Preferência do candidato por modalidade
      if (candidateModality && !candidateModality.includes('presencial') && !candidateModality.includes('híbrido')) {
        locMatch -= 5; // prefere apenas remoto
      }
    } else if (jobModality.includes('home office') || jobModality.includes('remoto')) {
      // Se for remoto, a localização física não importa tanto, mas a modalidade preferida sim
      if (candidateModality && !candidateModality.includes('remoto') && !candidateModality.includes('híbrido')) {
        locMatch -= 5; // prefere apenas presencial
      }
    }
    score += Math.max(0, locMatch);
    totalPossible += 15;
    
    // 4. ADERÊNCIA SALARIAL - Peso 15%
    let salaryScore = 15;
    const extractNumber = (valStr: string) => {
      if (!valStr) return 0;
      const clean = valStr.replace(/\D/g, '');
      return clean ? parseInt(clean) : 0;
    };
    
    const jobSalaryVal = extractNumber(job.salary);
    const candidateSalaryVal = extractNumber(talent.salary);
    
    if (jobSalaryVal > 0 && candidateSalaryVal > 0) {
      if (candidateSalaryVal <= jobSalaryVal) {
        // Pretensão menor ou igual ao proposto
        salaryScore = 15;
      } else {
        // Pretensão maior. Calcula o excedente
        const diffPercent = (candidateSalaryVal - jobSalaryVal) / jobSalaryVal;
        if (diffPercent <= 0.1) {
          salaryScore = 12; // até 10% acima do orçamento é aceitável
        } else if (diffPercent <= 0.25) {
          salaryScore = 8;  // até 25% acima
        } else {
          salaryScore = 3;  // muito acima do orçamento
        }
      }
    }
    score += salaryScore;
    totalPossible += 15;
    
    // 5. ADERÊNCIA DE SÊNIORIDADE / EXPERIÊNCIA - Peso 10%
    let senScore = 8;
    const candidateExp = (talent.experience || '').toLowerCase();
    const jobTitleLower = jobTitle.toLowerCase();
    
    let jobReqSeniority = 'pleno'; // default
    if (jobTitleLower.includes('sênior') || jobTitleLower.includes('senior') || jobTitleLower.includes('sr') || jobTitleLower.includes('especialista')) {
      jobReqSeniority = 'sênior';
    } else if (jobTitleLower.includes('júnior') || jobTitleLower.includes('junior') || jobTitleLower.includes('jr') || jobTitleLower.includes('assistente')) {
      jobReqSeniority = 'júnior';
    } else if (jobTitleLower.includes('estágio') || jobTitleLower.includes('estagiário') || jobTitleLower.includes('estagiario')) {
      jobReqSeniority = 'estágio';
    }
    
    if (candidateExp) {
      if (candidateExp.includes(jobReqSeniority)) {
        senScore = 10;
      } else {
        // Desvios toleráveis
        if (jobReqSeniority === 'sênior' && candidateExp.includes('pleno')) senScore = 6;
        else if (jobReqSeniority === 'pleno' && candidateExp.includes('sênior')) senScore = 10; // sobreequalificado
        else if (jobReqSeniority === 'pleno' && candidateExp.includes('júnior')) senScore = 5;
        else if (jobReqSeniority === 'júnior' && candidateExp.includes('pleno')) senScore = 8; // sobreequalificado
        else senScore = 4; // incompatível
      }
    }
    score += senScore;
    totalPossible += 10;
    
    // Arredonda e retorna o score final entre 0 e 100
    return Math.min(100, Math.max(0, Math.round((score / totalPossible) * 100)));
  };

  const [jobApplicants, setJobApplicants] = useState<any[]>([]);
  const [isFetchingApplicants, setIsFetchingApplicants] = useState(false);
  const [companyName, setCompanyName] = useState('Empresa Parceira');
  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('colaborh_companies');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Erro ao carregar empresas do localStorage:', e);
      }
    }
    return [
      { id: '1', razaoSocial: 'Colaborh Soluções LTDA', nomeFantasia: 'Colaborh', solicitante: 'João Silva', sector: 'Tecnologia' }
    ];
  });
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(() => {
    const saved = localStorage.getItem('colaborh_selected_company_id');
    return saved || '1';
  });

  // Persistir empresas e empresa selecionada no localStorage
  useEffect(() => {
    localStorage.setItem('colaborh_companies', JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem('colaborh_selected_company_id', selectedCompanyId);
  }, [selectedCompanyId]);

  // Sincronizar dados do formulário de empresa com a empresa selecionada
  useEffect(() => {
    if (selectedCompanyId && selectedCompanyId !== 'new') {
      const comp = companies.find(c => c.id === selectedCompanyId);
      if (comp) {
        setEditingCompanyId(comp.id);
        setCompanyForm({
          razaoSocial: comp.razaoSocial,
          nomeFantasia: comp.nomeFantasia,
          solicitante: comp.solicitante,
          sector: comp.sector,
          logo: comp.logo || ''
        });
      }
    } else if (selectedCompanyId === 'new') {
      setEditingCompanyId(null);
      setCompanyForm({
        razaoSocial: '',
        nomeFantasia: '',
        solicitante: '',
        sector: '',
        logo: ''
      });
    }
  }, [selectedCompanyId, companies]);

  const companyDropdownRef = useRef<HTMLDivElement>(null);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [companySearchQuery, setCompanySearchQuery] = useState('');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target as Node)) {
        setIsCompanyDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedCompany = companies.find(c => c.id === selectedCompanyId) || companies[0] || { nomeFantasia: 'Colaborh', razaoSocial: 'Colaborh Soluções LTDA' };
  const [selectedResumeApplicant, setSelectedResumeApplicant] = useState<any>(null);
  const [isExportingResume, setIsExportingResume] = useState(false);
  const [isExportingTestPDF, setIsExportingTestPDF] = useState(false);
  const resumePrintRef = useRef<HTMLDivElement>(null);
  const discModalRef = useRef<HTMLDivElement>(null);
  const mbtiModalRef = useRef<HTMLDivElement>(null);
  const temperamentosModalRef = useRef<HTMLDivElement>(null);
  const customTestModalRef = useRef<HTMLDivElement>(null);
  const questionsModalRef = useRef<HTMLDivElement>(null);
  const [isFetchingResume, setIsFetchingResume] = useState(false);
  const [selectedDiscResult, setSelectedDiscResult] = useState<any | null>(null);

  // Estados para anotações do candidato
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedApplicantForNotes, setSelectedApplicantForNotes] = useState<any>(null);
  const [tempNotesText, setTempNotesText] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Estados para questionário do candidato
  const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState(false);
  const [selectedApplicantForQuestions, setSelectedApplicantForQuestions] = useState<any>(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState('EXPERIENCE');

  // Estados para o teste MBTI
  const [selectedMbtiResult, setSelectedMbtiResult] = useState<any | null>(null);
  const [isMbtiModalOpen, setIsMbtiModalOpen] = useState(false);
  const [activeMbtiTab, setActiveMbtiTab] = useState<'PERFIL' | 'DIMENSOES' | 'AUDITORIA'>('PERFIL');

  // Estados para o teste de Temperamentos
  const [selectedTemperamentosResult, setSelectedTemperamentosResult] = useState<any | null>(null);
  const [isTemperamentosModalOpen, setIsTemperamentosModalOpen] = useState(false);
  const [activeTemperamentosTab, setActiveTemperamentosTab] = useState<'PERFIL' | 'DISTRIBUICAO' | 'AUDITORIA'>('PERFIL');

  const handleSaveNotes = async () => {
    if (!selectedApplicantForNotes) return;
    try {
      setIsSavingNotes(true);
      const appId = selectedApplicantForNotes.id;
      const currentPhone = selectedApplicantForNotes.candidate_phone || '';
      
      const parsedData = parseCandidatePhoneData(currentPhone);
      const updatedPhoneVal = serializeCandidatePhoneData(
        parsedData.phone,
        parsedData.disc,
        tempNotesText,
        parsedData.questions,
        parsedData.mbti,
        parsedData.temperamentos,
        parsedData.customTest
      );

      const { error } = await supabase
        .from('applications')
        .update({ candidate_phone: updatedPhoneVal })
        .eq('id', appId);

      if (error) throw error;

      // Atualizar o estado local jobApplicants
      setJobApplicants(prev => prev.map(item => item.id === appId ? { ...item, candidate_phone: updatedPhoneVal } : item));
      
      // Se selecionamos a anotação para o visualizador de currículo que está aberto e é o mesmo candidato, atualiza
      if (selectedResumeApplicant && selectedResumeApplicant.id === appId) {
        setSelectedResumeApplicant((prev: any) => prev ? { ...prev, candidate_phone: updatedPhoneVal } : null);
      }
      
      setIsNotesModalOpen(false);
      setSelectedApplicantForNotes(null);
      setTempNotesText('');
    } catch (err) {
      console.error('Erro ao salvar anotações:', err);
      alert('Erro ao salvar anotações. Por favor, tente novamente.');
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleDownloadResume = async () => {
    if (!resumePrintRef.current || !selectedResumeApplicant) {
      console.error('Resume reference or active candidate not found');
      return;
    }
    
    setIsExportingResume(true);
    try {
      const element = resumePrintRef.current;
      
      const originalStyle = element.getAttribute('style') || '';
      element.style.display = 'block';
      element.style.position = 'fixed';
      element.style.left = '0';
      element.style.top = '0';
      element.style.zIndex = '-9999';
      element.style.opacity = '1';
      element.style.visibility = 'visible';
      element.style.background = 'white';

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 210 * 3.78,
        windowHeight: 297 * 3.78,
        onclone: (clonedDoc) => {
          const style = clonedDoc.createElement('style');
          style.innerHTML = `
            * { 
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
              font-family: Arial, sans-serif !important;
            }
            svg { fill: currentColor !important; }
            
            :root {
              --primary-600: #7c3aed !important;
              --slate-900: #0f172a !important;
              --slate-600: #475569 !important;
              --slate-400: #94a3b8 !important;
            }

            .text-primary-600 { color: #7c3aed !important; }
            .bg-primary-600 { background-color: #7c3aed !important; }
            .bg-primary-50 { background-color: #f5f3ff !important; }
            .text-slate-900 { color: #0f172a !important; }
            .text-slate-800 { color: #1e293b !important; }
            .text-slate-500 { color: #64748b !important; }
            .text-slate-400 { color: #94a3b8 !important; }
            .bg-slate-50 { background-color: #f8fafc !important; }
            .bg-white { background-color: #ffffff !important; }
            .text-white { color: #ffffff !important; }
          `;
          clonedDoc.head.appendChild(style);

          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach(el => {
            const htmlEl = el as HTMLElement;
            const computed = window.getComputedStyle(htmlEl);
            
            ['color', 'backgroundColor', 'borderColor'].forEach(prop => {
              // @ts-ignore
              const val = computed[prop];
              if (val && (val.includes('oklch') || val.includes('oklab'))) {
                // @ts-ignore
                htmlEl.style[prop] = prop === 'backgroundColor' ? '#ffffff' : '#000000';
              }
            });

            const styleAttr = htmlEl.getAttribute('style') || '';
            if (styleAttr.includes('oklch') || styleAttr.includes('oklab')) {
              const newStyle = styleAttr.replace(/(oklch|oklab)\([^)]+\)/g, '#7c3aed');
              htmlEl.setAttribute('style', newStyle);
            }
          });
        }
      });

      element.setAttribute('style', originalStyle);

      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save(`Curriculo_${(selectedResumeApplicant.candidate_name || 'Candidato').replace(/\s+/g, '_').toUpperCase()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Houve um erro ao gerar o PDF. Por favor, tente novamente.');
    } finally {
      setIsExportingResume(false);
    }
  };

  // Funções matemáticas de conversão de oklch/oklab para rgb/rgba (Tailwind v4 -> PDF)
  const parseOklch = (oklchStr: string): string => {
    const match = oklchStr.match(/oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/i);
    if (!match) return oklchStr;

    let l = parseFloat(match[1]);
    if (match[1].includes('%')) l /= 100;
    
    const c = parseFloat(match[2]);
    const hDeg = parseFloat(match[3]);
    const h = (hDeg * Math.PI) / 180;

    let a = 1;
    if (match[4]) {
      a = parseFloat(match[4]);
      if (match[4].includes('%')) a /= 100;
    }

    const L = l;
    const ab = c * Math.cos(h);
    const bb = c * Math.sin(h);

    const l_ = Math.pow(L + 0.3963377774 * ab + 0.2158037573 * bb, 3);
    const m_ = Math.pow(L - 0.1055613458 * ab - 0.0638541728 * bb, 3);
    const s_ = Math.pow(L - 0.0894841775 * ab - 1.2914855480 * bb, 3);

    let r = 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
    let g = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
    let b = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_;

    const toSRGB = (val: number) => {
      const clamped = Math.max(0, Math.min(1, val));
      return clamped > 0.0031308
        ? 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055
        : 12.92 * clamped;
    };

    const R = Math.round(toSRGB(r) * 255);
    const G = Math.round(toSRGB(g) * 255);
    const B = Math.round(toSRGB(b) * 255);

    return a === 1 ? `rgb(${R}, ${G}, ${B})` : `rgba(${R}, ${G}, ${B}, ${a})`;
  };

  const parseOklab = (oklabStr: string): string => {
    const match = oklabStr.match(/oklab\(\s*([\d.]+%?)\s+([+-]?[\d.]+)\s+([+-]?[\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/i);
    if (!match) return oklabStr;

    let l = parseFloat(match[1]);
    if (match[1].includes('%')) l /= 100;
    
    const ab = parseFloat(match[2]);
    const bb = parseFloat(match[3]);

    let a = 1;
    if (match[4]) {
      a = parseFloat(match[4]);
      if (match[4].includes('%')) a /= 100;
    }

    const L = l;

    const l_ = Math.pow(L + 0.3963377774 * ab + 0.2158037573 * bb, 3);
    const m_ = Math.pow(L - 0.1055613458 * ab - 0.0638541728 * bb, 3);
    const s_ = Math.pow(L - 0.0894841775 * ab - 1.2914855480 * bb, 3);

    let r = 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
    let g = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
    let b = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_;

    const toSRGB = (val: number) => {
      const clamped = Math.max(0, Math.min(1, val));
      return clamped > 0.0031308
        ? 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055
        : 12.92 * clamped;
    };

    const R = Math.round(toSRGB(r) * 255);
    const G = Math.round(toSRGB(g) * 255);
    const B = Math.round(toSRGB(b) * 255);

    return a === 1 ? `rgb(${R}, ${G}, ${B})` : `rgba(${R}, ${G}, ${B}, ${a})`;
  };

  const handleExportModalToPDF = async (elementRef: React.RefObject<HTMLDivElement>, fileName: string) => {
    if (!elementRef.current) {
      console.error('Element reference not found');
      return;
    }
    
    setIsExportingTestPDF(true);
    
    // Intercepta e converte dinamicamente o oklch/oklab do getComputedStyle global
    const originalGetComputedStyle = window.getComputedStyle;
    const createStyleProxy = (style: CSSStyleDeclaration) => {
      return new Proxy(style, {
        get(target, prop) {
          const value = Reflect.get(target, prop, target);
          
          if (prop === 'getPropertyValue') {
            return function (propertyName: string) {
              const originalValue = target.getPropertyValue(propertyName);
              if (typeof originalValue === 'string') {
                if (originalValue.includes('oklch')) {
                  return parseOklch(originalValue);
                }
                if (originalValue.includes('oklab')) {
                  return parseOklab(originalValue);
                }
              }
              return originalValue;
            };
          }
          
          if (typeof value === 'string') {
            if (value.includes('oklch')) {
              return parseOklch(value);
            }
            if (value.includes('oklab')) {
              return parseOklab(value);
            }
          }
          
          if (typeof value === 'function') {
            return value.bind(target);
          }
          
          return value;
        }
      });
    };

    window.getComputedStyle = function (elt, pseudoElt) {
      // Garante a chamada no contexto window para evitar "Illegal invocation"
      const style = originalGetComputedStyle.call(window, elt, pseudoElt);
      return createStyleProxy(style);
    };


    // 1. Varre e anota dimensões reais no elemento original para que sejam clonadas
    const element = elementRef.current;
    const origSvgs = element.querySelectorAll('svg');
    origSvgs.forEach((svg) => {
      const rect = svg.getBoundingClientRect();
      svg.setAttribute('data-real-width', rect.width.toString());
      svg.setAttribute('data-real-height', rect.height.toString());
    });

    const origRecharts = element.querySelectorAll('.recharts-wrapper, .recharts-responsive-container');
    origRecharts.forEach((chart) => {
      const rect = chart.getBoundingClientRect();
      chart.setAttribute('data-real-width', rect.width.toString());
      chart.setAttribute('data-real-height', rect.height.toString());
    });

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc, clonedEl) => {
          // Também aplica o patch no getComputedStyle do defaultView do iframe do clone
          if (clonedDoc.defaultView) {
            const originalIframeGetComputedStyle = clonedDoc.defaultView.getComputedStyle;
            clonedDoc.defaultView.getComputedStyle = function (elt, pseudoElt) {
              const style = originalIframeGetComputedStyle.call(clonedDoc.defaultView, elt, pseudoElt);
              return createStyleProxy(style);
            };
          }

          if (clonedEl) {
            // Remove transformações e transições no clone
            clonedEl.style.transform = 'none';
            clonedEl.style.webkitTransform = 'none';
            (clonedEl.style as any).msTransform = 'none';
            clonedEl.style.transition = 'none';
            clonedEl.style.animation = 'none';
            clonedEl.style.maxHeight = 'none';
            clonedEl.style.height = 'auto';
            clonedEl.style.overflow = 'visible';
            
            // Força a div de scroll a se expandir
            const clonedBodyEl = (clonedEl.querySelector('.overflow-y-auto') || clonedEl.querySelector('.no-scrollbar')) as HTMLElement;
            if (clonedBodyEl) {
              clonedBodyEl.style.maxHeight = 'none';
              clonedBodyEl.style.height = 'auto';
              clonedBodyEl.style.overflow = 'visible';
            }
            
            // Oculta os botões (como "Baixar PDF" e o "X" de fechar) no clone
            const buttons = clonedEl.querySelectorAll('button');
            buttons.forEach((btn) => {
              const text = (btn.innerText || btn.textContent || '').toLowerCase();
              if (text.includes('baixar') || text.includes('fechar') || btn.querySelector('svg')) {
                btn.style.display = 'none';
              }
            });
            
            // Lê as dimensões reais anotadas no original e aplica nos elementos clonados
            const clonedSvgs = clonedEl.querySelectorAll('svg');
            clonedSvgs.forEach((svg) => {
              const realWidth = svg.getAttribute('data-real-width');
              const realHeight = svg.getAttribute('data-real-height');
              if (realWidth && realHeight) {
                svg.setAttribute('width', realWidth);
                svg.setAttribute('height', realHeight);
              }
            });

            const clonedRecharts = clonedEl.querySelectorAll('.recharts-wrapper, .recharts-responsive-container');
            clonedRecharts.forEach((chart) => {
              const realWidth = chart.getAttribute('data-real-width');
              const realHeight = chart.getAttribute('data-real-height');
              if (realWidth && realHeight) {
                const htmlChart = chart as HTMLElement;
                htmlChart.style.width = `${realWidth}px`;
                htmlChart.style.height = `${realHeight}px`;
              }
            });

            // Corrige estilos de cores oklch e oklab no clone para formatos seguros
            const clonedAll = clonedEl.querySelectorAll('*');
            clonedAll.forEach((clonedNode) => {
              const htmlCloned = clonedNode as HTMLElement;
              
              // Resolve estilos inline de oklch/oklab convertendo para rgb
              const styleAttr = htmlCloned.getAttribute('style') || '';
              if (styleAttr.includes('oklch') || styleAttr.includes('oklab')) {
                let newStyle = styleAttr;
                const oklchMatches = styleAttr.match(/oklch\([^)]+\)/g) || [];
                oklchMatches.forEach((m) => {
                  newStyle = newStyle.replace(m, parseOklch(m));
                });
                const oklabMatches = styleAttr.match(/oklab\([^)]+\)/g) || [];
                oklabMatches.forEach((m) => {
                  newStyle = newStyle.replace(m, parseOklab(m));
                });
                htmlCloned.setAttribute('style', newStyle);
              }
            });

            // Algoritmo de Paginação Inteligente: evita cortes no meio dos cards do relatório
            const containerRect = clonedEl.getBoundingClientRect();
            // Altura padrão do A4 no PDF é de 297mm por 210mm.
            // Altura equivalente em pixels no contêiner clonado:
            const pageHeightPx = (containerRect.width * 297) / 210;
            
            let contentArea = clonedBodyEl || clonedEl;
            
            // Função inteligente para localizar o wrapper vertical de conteúdo principal do relatório
            const findVerticalWrapper = (parent: HTMLElement): HTMLElement => {
              if (!parent) return parent;
              if ((parent.classList.contains('space-y-6') || parent.classList.contains('space-y-4')) && parent.children.length > 1) {
                return parent;
              }
              const children = Array.from(parent.children);
              for (const child of children) {
                const htmlChild = child as HTMLElement;
                if ((htmlChild.classList.contains('space-y-6') || htmlChild.classList.contains('space-y-4')) && htmlChild.children.length > 1) {
                  return htmlChild;
                }
              }
              for (const child of children) {
                const htmlChild = child as HTMLElement;
                if (htmlChild.children.length > 1) {
                  return htmlChild;
                }
              }
              return parent;
            };

            contentArea = findVerticalWrapper(contentArea);
            
            if (contentArea) {
              const children = Array.from(contentArea.children);
              let offsetAccumulated = 0;
              
              children.forEach((child) => {
                const htmlChild = child as HTMLElement;
                const rect = htmlChild.getBoundingClientRect();
                
                // Posição top acumulada levando em conta os empurrões anteriores
                const relativeTop = (rect.top - containerRect.top) + offsetAccumulated;
                const childHeight = rect.height;
                
                const pageOfTop = Math.floor(relativeTop / pageHeightPx) + 1;
                const pageOfBottom = Math.floor((relativeTop + childHeight) / pageHeightPx) + 1;
                
                // Se cruzar uma linha física de quebra de página do PDF
                if (pageOfTop !== pageOfBottom && childHeight < pageHeightPx) {
                  const nextPageTop = pageOfTop * pageHeightPx;
                  // Adiciona um recuo de segurança extra de 35px no início da nova página física
                  const pushAmount = (nextPageTop - relativeTop) + 35;
                  
                  // Aplica o margin-top
                  const style = window.getComputedStyle(htmlChild);
                  const origMarginTop = parseFloat(style.marginTop) || 0;
                  htmlChild.style.marginTop = `${origMarginTop + pushAmount}px`;
                  
                  // Acumula o deslocamento para os próximos elementos filhos
                  offsetAccumulated += pushAmount;
                }
              });
            }
          }
        }
      });

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas rendering dimensions are invalid');
      }

      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();

      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      pdf.save(`${fileName.replace(/\s+/g, '_').toUpperCase()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      const errMsg = error instanceof Error ? error.message : String(error);
      alert(`Houve um erro ao gerar o PDF do teste.\nDetalhes: ${errMsg}`);
    } finally {
      // Restaura o getComputedStyle original
      window.getComputedStyle = originalGetComputedStyle;

      // Limpa os atributos de dados temporários no elemento original
      origSvgs.forEach((svg) => {
        svg.removeAttribute('data-real-width');
        svg.removeAttribute('data-real-height');
      });
      origRecharts.forEach((chart) => {
        chart.removeAttribute('data-real-width');
        chart.removeAttribute('data-real-height');
      });
      
      setIsExportingTestPDF(false);
    }
  };

  // Status stage mover inside the Kanban board
  const handleUpdateApplicantStatus = async (appId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', appId);

      if (error) throw error;
      setJobApplicants(prev => prev.map(app => app.id === appId ? { ...app, status: newStatus } : app));
    } catch (err) {
      console.error('Erro ao atualizar status do candidato:', err);
      alert('Erro ao atualizar status do candidato.');
    }
  };

  const getCurrentJobStages = (job: any): string[] => {
    if (!job) return [];
    if (job.description && job.description.includes('===ETAPAS_JSON===')) {
      try {
        const part = job.description.split('===ETAPAS_JSON===')[1].split('===FIM_ETAPAS===')[0];
        return JSON.parse(part);
      } catch (e) {
        console.error('Error parsing stages from description:', e);
      }
    }
    return Array.isArray(job.stages) 
      ? job.stages 
      : (typeof job.stages === 'string' 
          ? JSON.parse(job.stages) 
          : ['Análise de Currículo', 'Entrevista', 'Teste Técnico']);
  };

  const handleUpdateJobStages = async (jobId: string, newStages: string[]) => {
    try {
      const jobToUpdate = jobs.find(j => j.id === jobId) || selectedJob;
      if (!jobToUpdate) {
        console.error("Vaga não encontrada para atualização de etapas.");
        return;
      }

      const regex = /===ETAPAS_JSON===[\s\S]*?===FIM_ETAPAS===/g;
      let cleanDesc = (jobToUpdate.description || '').replace(regex, '').trim();
      const updatedDescription = `${cleanDesc}\n\n===ETAPAS_JSON===${JSON.stringify(newStages)}===FIM_ETAPAS===`;

      const { error } = await supabase
        .from('jobs')
        .update({
          stages: newStages,
          description: updatedDescription
        })
        .eq('id', jobId);

      if (error) throw error;

      const updatedJob = {
        ...jobToUpdate,
        stages: newStages,
        description: updatedDescription
      };
      
      setSelectedJob(updatedJob);
      setJobs(prevJobs => {
        if (!prevJobs || prevJobs.length === 0) return [updatedJob];
        return prevJobs.map(j => j.id === jobId ? updatedJob : j);
      });
      
      return updatedJob;
    } catch (err) {
      console.error('Erro ao atualizar etapas do processo:', err);
      alert('Erro ao atualizar etapas do processo seletivo.');
    }
  };

  const handleAddNewStage = async (stageName: string) => {
    if (!selectedJob) return;
    const trimmed = stageName.trim();
    if (!trimmed) return;
    
    const forbidden = ['testes', 'contratado', 'reprovado'];
    if (forbidden.includes(trimmed.toLowerCase())) {
      alert(`O nome "${trimmed}" é reservado para o sistema e não pode ser usado.`);
      return;
    }
    
    const currentStages = getCurrentJobStages(selectedJob);
    if (currentStages.map(s => s.toLowerCase()).includes(trimmed.toLowerCase())) {
      alert('Já existe uma etapa com este nome.');
      return;
    }
    
    const newStages = [...currentStages, trimmed];
    const updated = await handleUpdateJobStages(selectedJob.id, newStages);
    if (updated) {
      setActiveStageTab(trimmed);
    }
  };

  const handleMoveStage = async (stageName: string, direction: 'left' | 'right') => {
    if (!selectedJob) return;
    const currentStages = getCurrentJobStages(selectedJob);
    const index = currentStages.indexOf(stageName);
    if (index === -1) return;
    
    const newStages = [...currentStages];
    if (direction === 'left' && index > 0) {
      const temp = newStages[index - 1];
      newStages[index - 1] = newStages[index];
      newStages[index] = temp;
    } else if (direction === 'right' && index < newStages.length - 1) {
      const temp = newStages[index + 1];
      newStages[index + 1] = newStages[index];
      newStages[index] = temp;
    } else {
      return;
    }
    
    await handleUpdateJobStages(selectedJob.id, newStages);
  };

  const handleDeleteStage = async (stageName: string) => {
    if (!selectedJob) return;
    const currentStages = getCurrentJobStages(selectedJob);
    const index = currentStages.indexOf(stageName);
    if (index === -1) return;
    
    if (currentStages.length <= 1) {
      showCustomAlert('O processo seletivo deve ter pelo menos uma etapa.', "Aviso");
      return;
    }
    
    // Check if there are any candidates in this stage
    const allColumns = [...currentStages, 'Testes', 'Contratado', 'Reprovado'];
    const defaultStage = currentStages[0] || 'Triagem';
    
    const candidatesInStage = jobApplicants.filter(applicant => {
      const currentStatus = applicant.status;
      const normalizedStatus = (!currentStatus || currentStatus === 'Triagem' || !allColumns.includes(currentStatus)) 
        ? defaultStage 
        : currentStatus;
      return normalizedStatus === stageName;
    });
    
    if (candidatesInStage.length > 0) {
      showCustomAlert(`Não é possível excluir a etapa "${stageName}" pois ela possui ${candidatesInStage.length} candidato(s) ativo(s). Mova os candidatos para outras etapas antes de excluir.`, "Aviso");
      return;
    }
    
    showCustomConfirm(
      `Tem certeza de que deseja excluir permanentemente a etapa "${stageName}"?`,
      async () => {
        const newStages = currentStages.filter(s => s !== stageName);
        const updated = await handleUpdateJobStages(selectedJob.id, newStages);
        if (updated) {
          setActiveStageTab(newStages[0] || 'Triagem');
        }
      },
      undefined,
      "Excluir Etapa"
    );
  };

  const handleDragStart = (e: React.DragEvent, stageName: string) => {
    setDraggedStage(stageName);
    e.dataTransfer.setData('text/plain', stageName);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetStage: string) => {
    if (draggedStage && draggedStage !== targetStage && targetStage !== 'Testes' && targetStage !== 'Contratado' && targetStage !== 'Reprovado') {
      e.preventDefault();
    }
  };

  const handleDrop = async (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    const sourceStage = e.dataTransfer.getData('text/plain') || draggedStage;
    if (!sourceStage || sourceStage === targetStage) return;
    if (targetStage === 'Testes' || targetStage === 'Contratado' || targetStage === 'Reprovado') return;
    if (sourceStage === 'Testes' || sourceStage === 'Contratado' || sourceStage === 'Reprovado') return;

    if (!selectedJob) return;
    const currentStages = getCurrentJobStages(selectedJob);
    const sourceIndex = currentStages.indexOf(sourceStage);
    const targetIndex = currentStages.indexOf(targetStage);
    
    if (sourceIndex === -1 || targetIndex === -1) return;

    const newStages = [...currentStages];
    newStages.splice(sourceIndex, 1);
    newStages.splice(targetIndex, 0, sourceStage);

    await handleUpdateJobStages(selectedJob.id, newStages);
    setDraggedStage(null);
  };

  const handleDragEnd = () => {
    setDraggedStage(null);
  };

  const handleRequestDiscTest = async (app: any) => {
    try {
      const currentStatus = app.status;
      const stagesList = getCurrentJobStages(selectedJob);
      const defaultStage = stagesList[0] || 'Triagem';
      const allColumns = [...stagesList, 'Testes', 'Contratado', 'Reprovado'];
      const normalizedStatus = (!currentStatus || currentStatus === 'Triagem' || !allColumns.includes(currentStatus)) 
        ? defaultStage 
        : currentStatus;

      if (normalizedStatus !== 'Testes') {
        alert('A solicitação do teste DISC só é permitida na etapa "Testes". Mova o candidato no Kanban primeiro.');
        return;
      }

      const appId = app.id;
      const currentPhone = app.candidate_phone || '';
      const email = app.candidate_email || app.email || 'candidato@email.com';
      const name = app.candidate_name || app.name || 'Candidato';
      const jobTitle = selectedJob?.title || 'Vaga Selecionada';

      const parsedData = parseCandidatePhoneData(currentPhone);

      // Buscar se o candidato já respondeu a este teste anteriormente usando talent_id
      let foundPreviousCompletedValue = '';
      let talentId = app.talent_id;

      // Fallback: se não tiver talent_id mas tiver email, busca o id na tabela talents
      if (!talentId && email && email !== 'candidato@email.com') {
        const { data: talentData } = await supabase
          .from('talents')
          .select('id')
          .eq('email', email)
          .single();
        if (talentData) {
          talentId = talentData.id;
        }
      }

      if (talentId) {
        const { data: previousApps } = await supabase
          .from('applications')
          .select('candidate_phone')
          .eq('talent_id', talentId);

        if (previousApps && previousApps.length > 0) {
          for (const appRow of previousApps) {
            const parsed = parseCandidatePhoneData(appRow.candidate_phone || '');
            if (parsed.disc && parsed.disc.startsWith('COMPLETED===')) {
              foundPreviousCompletedValue = parsed.disc;
              break;
            }
          }
        }
      }

      if (foundPreviousCompletedValue) {
        const updatedPhoneVal = serializeCandidatePhoneData(
          parsedData.phone,
          foundPreviousCompletedValue,
          parsedData.notes,
          parsedData.questions,
          parsedData.mbti,
          parsedData.temperamentos,
          parsedData.customTest
        );

        const { error } = await supabase
          .from('applications')
          .update({ candidate_phone: updatedPhoneVal })
          .eq('id', appId);

        if (error) throw error;

        setJobApplicants(prev => prev.map(item => item.id === appId ? { ...item, candidate_phone: updatedPhoneVal } : item));
        alert('O candidato já respondeu ao teste DISC em outro processo seletivo. As respostas e resultados foram importados com sucesso!');
        return;
      }

      const updatedPhoneVal = serializeCandidatePhoneData(
        parsedData.phone,
        'PENDING',
        parsedData.notes,
        parsedData.questions,
        parsedData.mbti,
        parsedData.temperamentos,
        parsedData.customTest
      );

      const { error } = await supabase
        .from('applications')
        .update({ candidate_phone: updatedPhoneVal })
        .eq('id', appId);

      if (error) throw error;

      // Update state
      setJobApplicants(prev => prev.map(item => item.id === appId ? { ...item, candidate_phone: updatedPhoneVal } : item));

      // Professional SMTP Email Sending Simulation in developer console
      console.log(`
========================================================================
📧 [SIMULAÇÃO DE DISPARO DE E-MAIL - SMTP ENVIADO]
========================================================================
Remetente: recrutamento@colaborh.com.br
Destinatário: ${email}
Assunto: 🧠 Teste de Perfil Comportamental DISC 5.0 Solicitado - ${jobTitle}

Olá, ${name}!

Temos ótimas notícias! A empresa selecionou seu perfil no processo de triagem
para a vaga de "${jobTitle}" e gostaria de conhecê-lo melhor através do
nosso Teste de Perfil Comportamental DISC 5.0.

Como responder ao teste:
1. Acesse o seu Painel de Candidato no portal Colaborh.
2. No menu lateral, acesse a seção "Testes".
3. Localize o teste pendente para a vaga de "${jobTitle}" e clique em iniciar.
4. Lembre-se: não há respostas certas ou erradas. Responda de forma sincera
   com base no seu perfil profissional.

O teste leva em média 10 a 15 minutos para ser concluído.

Desejamos muito sucesso em seu processo seletivo!

Atenciosamente,
Equipe de Recrutamento & Seleção - Colaborh
========================================================================
      `);

      alert(`Teste DISC solicitado com sucesso!\n\nE-mail de notificação enviado para: ${email}\nO candidato já pode responder ao teste no painel dele.`);
    } catch (err) {
      console.error('Erro ao solicitar teste DISC:', err);
      alert('Erro ao solicitar teste DISC.');
    }
  };

  const handleRequestQuestions = async (app: any) => {
    try {
      const currentStatus = app.status;
      const stagesList = getCurrentJobStages(selectedJob);
      const defaultStage = stagesList[0] || 'Triagem';
      const allColumns = [...stagesList, 'Testes', 'Contratado', 'Reprovado'];
      const normalizedStatus = (!currentStatus || currentStatus === 'Triagem' || !allColumns.includes(currentStatus)) 
        ? defaultStage 
        : currentStatus;

      if (normalizedStatus !== 'Testes') {
        alert('A solicitação do Mapeamento de Perfil só é permitida na etapa "Testes". Mova o candidato no Kanban primeiro.');
        return;
      }

      const appId = app.id;
      const currentPhone = app.candidate_phone || '';
      const email = app.candidate_email || app.email || 'candidato@email.com';
      const name = app.candidate_name || app.name || 'Candidato';
      const jobTitle = selectedJob?.title || 'Vaga Selecionada';

      const parsedData = parseCandidatePhoneData(currentPhone);

      // Buscar se o candidato já respondeu a este teste anteriormente usando talent_id
      let foundPreviousCompletedValue = '';
      let talentId = app.talent_id;

      // Fallback: se não tiver talent_id mas tiver email, busca o id na tabela talents
      if (!talentId && email && email !== 'candidato@email.com') {
        const { data: talentData } = await supabase
          .from('talents')
          .select('id')
          .eq('email', email)
          .single();
        if (talentData) {
          talentId = talentData.id;
        }
      }

      if (talentId) {
        const { data: previousApps } = await supabase
          .from('applications')
          .select('candidate_phone')
          .eq('talent_id', talentId);

        if (previousApps && previousApps.length > 0) {
          for (const appRow of previousApps) {
            const parsed = parseCandidatePhoneData(appRow.candidate_phone || '');
            if (parsed.questions && parsed.questions.startsWith('COMPLETED===')) {
              foundPreviousCompletedValue = parsed.questions;
              break;
            }
          }
        }
      }

      if (foundPreviousCompletedValue) {
        const updatedPhoneVal = serializeCandidatePhoneData(
          parsedData.phone,
          parsedData.disc,
          parsedData.notes,
          foundPreviousCompletedValue,
          parsedData.mbti,
          parsedData.temperamentos,
          parsedData.customTest
        );

        const { error } = await supabase
          .from('applications')
          .update({ candidate_phone: updatedPhoneVal })
          .eq('id', appId);

        if (error) throw error;

        setJobApplicants(prev => prev.map(item => item.id === appId ? { ...item, candidate_phone: updatedPhoneVal } : item));
        alert('O candidato já respondeu ao Mapeamento de Perfil em outro processo seletivo. As respostas foram importadas com sucesso!');
        return;
      }

      const updatedPhoneVal = serializeCandidatePhoneData(
        parsedData.phone,
        parsedData.disc,
        parsedData.notes,
        'PENDING',
        parsedData.mbti,
        parsedData.temperamentos,
        parsedData.customTest
      );

      const { error } = await supabase
        .from('applications')
        .update({ candidate_phone: updatedPhoneVal })
        .eq('id', appId);

      if (error) throw error;

      // Update state
      setJobApplicants(prev => prev.map(item => item.id === appId ? { ...item, candidate_phone: updatedPhoneVal } : item));

      // Professional SMTP Email Sending Simulation in developer console
      console.log(`
========================================================================
📧 [SIMULAÇÃO DE DISPARO DE E-MAIL - SMTP ENVIADO]
========================================================================
Remetente: recrutamento@colaborh.com.br
Destinatário: ${email}
Assunto: 📝 Mapeamento de Perfil Solicitado - ${jobTitle}

Olá, ${name}!

Temos ótimas notícias! A equipe de recrutamento da Colaborh selecionou seu perfil no 
processo seletivo para a vaga de "${jobTitle}" e gostaria de solicitar que você preencha
o nosso "Mapeamento de Perfil".

Esse mapeamento consiste em 20 perguntas curtas divididas em 4 categorias:
1. Experiência Profissional
2. Contribuição e Resultados
3. Trabalho em Equipe
4. Comportamental

Como responder ao mapeamento:
1. Acesse o seu Painel de Candidato no portal Colaborh.
2. No menu lateral ou na aba "Testes", localize o "Mapeamento de Perfil".
3. Clique em iniciar para responder às perguntas através de um fluxo guiado passo a passo.

Desejamos muito sucesso em seu processo seletivo!

Atenciosamente,
Equipe de Recrutamento & Seleção - Colaborh
========================================================================
      `);

      alert(`Mapeamento de Perfil solicitado com sucesso!\n\nE-mail de notificação enviado para: ${email}\nO candidato já pode responder ao mapeamento no painel dele.`);
    } catch (err) {
      console.error('Erro ao solicitar mapeamento de perfil:', err);
      alert('Erro ao solicitar mapeamento de perfil.');
    }
  };

  const handleRequestMbtiTest = async (app: any) => {
    try {
      const currentStatus = app.status;
      const stagesList = getCurrentJobStages(selectedJob);
      const defaultStage = stagesList[0] || 'Triagem';
      const allColumns = [...stagesList, 'Testes', 'Contratado', 'Reprovado'];
      const normalizedStatus = (!currentStatus || currentStatus === 'Triagem' || !allColumns.includes(currentStatus)) 
        ? defaultStage 
        : currentStatus;

      if (normalizedStatus !== 'Testes') {
        alert('A solicitação do teste MBTI só é permitida na etapa "Testes". Mova o candidato no Kanban primeiro.');
        return;
      }

      const appId = app.id;
      const currentPhone = app.candidate_phone || '';
      const email = app.candidate_email || app.email || 'candidato@email.com';
      const name = app.candidate_name || app.name || 'Candidato';
      const jobTitle = selectedJob?.title || 'Vaga Selecionada';

      const parsedData = parseCandidatePhoneData(currentPhone);

      // Buscar se o candidato já respondeu a este teste anteriormente usando talent_id
      let foundPreviousCompletedValue = '';
      let talentId = app.talent_id;

      // Fallback: se não tiver talent_id mas tiver email, busca o id na tabela talents
      if (!talentId && email && email !== 'candidato@email.com') {
        const { data: talentData } = await supabase
          .from('talents')
          .select('id')
          .eq('email', email)
          .single();
        if (talentData) {
          talentId = talentData.id;
        }
      }

      if (talentId) {
        const { data: previousApps } = await supabase
          .from('applications')
          .select('candidate_phone')
          .eq('talent_id', talentId);

        if (previousApps && previousApps.length > 0) {
          for (const appRow of previousApps) {
            const parsed = parseCandidatePhoneData(appRow.candidate_phone || '');
            if (parsed.mbti && parsed.mbti.startsWith('COMPLETED===')) {
              foundPreviousCompletedValue = parsed.mbti;
              break;
            }
          }
        }
      }

      if (foundPreviousCompletedValue) {
        const updatedPhoneVal = serializeCandidatePhoneData(
          parsedData.phone,
          parsedData.disc,
          parsedData.notes,
          parsedData.questions,
          foundPreviousCompletedValue,
          parsedData.temperamentos,
          parsedData.customTest
        );

        const { error } = await supabase
          .from('applications')
          .update({ candidate_phone: updatedPhoneVal })
          .eq('id', appId);

        if (error) throw error;

        setJobApplicants(prev => prev.map(item => item.id === appId ? { ...item, candidate_phone: updatedPhoneVal } : item));
        alert('O candidato já respondeu ao teste MBTI em outro processo seletivo. As respostas foram importadas com sucesso!');
        return;
      }

      const updatedPhoneVal = serializeCandidatePhoneData(
        parsedData.phone,
        parsedData.disc,
        parsedData.notes,
        parsedData.questions,
        'PENDING',
        parsedData.temperamentos,
        parsedData.customTest
      );

      const { error } = await supabase
        .from('applications')
        .update({ candidate_phone: updatedPhoneVal })
        .eq('id', appId);

      if (error) throw error;

      // Update state
      setJobApplicants(prev => prev.map(item => item.id === appId ? { ...item, candidate_phone: updatedPhoneVal } : item));

      // Professional SMTP Email Sending Simulation in developer console
      console.log(`
========================================================================
📧 [SIMULAÇÃO DE DISPARO DE E-MAIL - SMTP ENVIADO]
========================================================================
Remetente: recrutamento@colaborh.com.br
Destinatário: ${email}
Assunto: 🎖️ Teste de Personalidade MBTI Solicitado - ${jobTitle}

Olá, ${name}!

Temos ótimas notícias! A equipe de recrutamento da Colaborh selecionou seu perfil no 
processo seletivo para a vaga de "${jobTitle}" e gostaria de solicitar que você preencha
o nosso "Teste de Personalidade MBTI (Myers-Briggs Type Indicator)".

Este teste consiste em 64 perguntas de autoconhecimento que avaliam as seguintes dimensões:
1. Extroversão × Introversão (E × I)
2. Sensação × Intuição (S × N)
3. Pensamento × Sentimento (T × F)
4. Julgamento × Percepção (J × P)

Como responder ao teste:
1. Acesse o seu Painel de Candidato no portal Colaborh.
2. No menu lateral ou na aba "Testes", localize o "Teste de Personalidade MBTI".
3. Clique em iniciar para responder às perguntas através de um fluxo guiado passo a passo.

Desejamos muito sucesso em seu processo seletivo!

Atenciosamente,
Equipe de Recrutamento & Seleção - Colaborh
========================================================================
      `);

      alert(`Teste de Personalidade MBTI solicitado com sucesso!\n\nE-mail de notificação enviado para: ${email}\nO candidato já pode responder ao teste no painel dele.`);
    } catch (err) {
      console.error('Erro ao solicitar teste MBTI:', err);
      alert('Erro ao solicitar teste MBTI.');
    }
  };

  const handleRequestCustomTest = async (app: any) => {
    try {
      const currentStatus = app.status;
      const stagesList = getCurrentJobStages(selectedJob);
      const defaultStage = stagesList[0] || 'Triagem';
      const allColumns = [...stagesList, 'Testes', 'Contratado', 'Reprovado'];
      const normalizedStatus = (!currentStatus || currentStatus === 'Triagem' || !allColumns.includes(currentStatus)) 
        ? defaultStage 
        : currentStatus;

      if (normalizedStatus !== 'Testes') {
        alert('A solicitação do Questionário Customizado só é permitida na etapa "Testes". Mova o candidato no Kanban primeiro.');
        return;
      }

      const jobDesc = selectedJob?.description || '';
      const customQ = getCustomQuestionsFromJobDescription(jobDesc);
      if (!customQ || customQ.length === 0) {
        alert('Esta vaga não possui um Questionário Customizado configurado. Crie as perguntas na aba "Resultados" > "Criar Questionário Customizado" antes de solicitar.');
        return;
      }

      const appId = app.id;
      const currentPhone = app.candidate_phone || '';
      const email = app.candidate_email || app.email || 'candidato@email.com';
      const name = app.candidate_name || app.name || 'Candidato';
      const jobTitle = selectedJob?.title || 'Vaga Selecionada';

      const parsedData = parseCandidatePhoneData(currentPhone);

      const updatedPhoneVal = serializeCandidatePhoneData(
        parsedData.phone,
        parsedData.disc,
        parsedData.notes,
        parsedData.questions,
        parsedData.mbti,
        parsedData.temperamentos,
        'PENDING'
      );

      const { error } = await supabase
        .from('applications')
        .update({ candidate_phone: updatedPhoneVal })
        .eq('id', appId);

      if (error) throw error;

      setJobApplicants(prev => prev.map(item => item.id === appId ? { ...item, candidate_phone: updatedPhoneVal } : item));

      console.log(`
========================================================================
📧 [SIMULAÇÃO DE DISPARO DE E-MAIL - SMTP ENVIADO]
========================================================================
Remetente: recrutamento@colaborh.com.br
Destinatário: ${email}
Assunto: 📋 Questionário Customizado Solicitado - ${jobTitle}

Olá, ${name}!

A equipe de recrutamento solicitou que você responda ao Questionário Customizado específico para a vaga de "${jobTitle}".

Como responder ao questionário:
1. Acesse o seu Painel de Candidato no portal Colaborh.
2. Na sua listagem de testes da vaga, localize o "Questionário Customizado".
3. Clique em iniciar para responder às perguntas.

Desejamos muito sucesso em seu processo seletivo!

Atenciosamente,
Equipe de Recrutamento & Seleção - Colaborh
========================================================================
      `);

      alert(`Questionário Customizado solicitado com sucesso!\n\nE-mail de notificação enviado para: ${email}\nO candidato já pode responder ao questionário no painel dele.`);
    } catch (err) {
      console.error('Erro ao solicitar questionário customizado:', err);
      alert('Erro ao solicitar questionário customizado.');
    }
  };

  const handleConfirmRequestCustomTest = async (app: any, template: any) => {
    try {
      if (!app || !template) return;

      const appId = app.id;
      const currentPhone = app.candidate_phone || '';
      const email = app.candidate_email || app.email || 'candidato@email.com';
      const name = app.candidate_name || app.name || 'Candidato';
      const jobTitle = selectedJob?.title || 'Vaga Selecionada';

      const parsedData = parseCandidatePhoneData(currentPhone);

      // Criar o payload para salvar no candidate_phone
      const templatePayload = {
        title: template.title,
        questions: template.questions
      };

      // Codificar com delimitador :::
      const customTestValue = `PENDING:::${JSON.stringify(templatePayload)}`;

      const updatedPhoneVal = serializeCandidatePhoneData(
        parsedData.phone,
        parsedData.disc,
        parsedData.notes,
        parsedData.questions,
        parsedData.mbti,
        parsedData.temperamentos,
        customTestValue
      );

      const { error } = await supabase
        .from('applications')
        .update({ candidate_phone: updatedPhoneVal })
        .eq('id', appId);

      if (error) throw error;

      // Atualizar no estado local
      setJobApplicants(prev => prev.map(item => item.id === appId ? { ...item, candidate_phone: updatedPhoneVal } : item));

      console.log(`
========================================================================
📧 [SIMULAÇÃO DE DISPARO DE E-MAIL - SMTP ENVIADO]
========================================================================
Remetente: recrutamento@colaborh.com.br
Destinatário: ${email}
Assunto: 📋 Questionário Customizado Solicitado - ${jobTitle}

Olá, ${name}!

A equipe de recrutamento solicitou que você responda ao Questionário Customizado "${template.title}" específico para a vaga de "${jobTitle}".

Como responder ao questionário:
1. Acesse o seu Painel de Candidato no portal Colaborh.
2. Na sua listagem de testes da vaga, localize o "Questionário Customizado".
3. Clique em iniciar para responder às perguntas.

Desejamos muito sucesso em seu processo seletivo!

Atenciosamente,
Equipe de Recrutamento & Seleção - Colaborh
========================================================================
      `);

      alert(`Questionário Customizado "${template.title}" solicitado com sucesso!\n\nE-mail de notificação enviado para: ${email}\nO candidato já pode responder ao questionário no painel dele.`);
      setIsSelectCustomTemplateModalOpen(false);
      setApplicantForRequestCustom(null);
    } catch (err) {
      console.error('Erro ao solicitar questionário customizado:', err);
      alert('Erro ao solicitar questionário customizado.');
    }
  };

  const handleRequestTemperamentosTest = async (app: any) => {
    try {
      const currentStatus = app.status;
      const stagesList = getCurrentJobStages(selectedJob);
      const defaultStage = stagesList[0] || 'Triagem';
      const allColumns = [...stagesList, 'Testes', 'Contratado', 'Reprovado'];
      const normalizedStatus = (!currentStatus || currentStatus === 'Triagem' || !allColumns.includes(currentStatus)) 
        ? defaultStage 
        : currentStatus;

      if (normalizedStatus !== 'Testes') {
        alert('A solicitação do teste de Temperamentos só é permitida na etapa "Testes". Mova o candidato no Kanban primeiro.');
        return;
      }

      const appId = app.id;
      const currentPhone = app.candidate_phone || '';
      const email = app.candidate_email || app.email || 'candidato@email.com';
      const name = app.candidate_name || app.name || 'Candidato';
      const jobTitle = selectedJob?.title || 'Vaga Selecionada';

      const parsedData = parseCandidatePhoneData(currentPhone);

      // Buscar se o candidato já respondeu a este teste anteriormente usando talent_id
      let foundPreviousCompletedValue = '';
      let talentId = app.talent_id;

      // Fallback: se não tiver talent_id mas tiver email, busca o id na tabela talents
      if (!talentId && email && email !== 'candidato@email.com') {
        const { data: talentData } = await supabase
          .from('talents')
          .select('id')
          .eq('email', email)
          .single();
        if (talentData) {
          talentId = talentData.id;
        }
      }

      if (talentId) {
        const { data: previousApps } = await supabase
          .from('applications')
          .select('candidate_phone')
          .eq('talent_id', talentId);

        if (previousApps && previousApps.length > 0) {
          for (const appRow of previousApps) {
            const parsed = parseCandidatePhoneData(appRow.candidate_phone || '');
            if (parsed.temperamentos && parsed.temperamentos.startsWith('COMPLETED===')) {
              foundPreviousCompletedValue = parsed.temperamentos;
              break;
            }
          }
        }
      }

      if (foundPreviousCompletedValue) {
        const updatedPhoneVal = serializeCandidatePhoneData(
          parsedData.phone,
          parsedData.disc,
          parsedData.notes,
          parsedData.questions,
          parsedData.mbti,
          foundPreviousCompletedValue,
          parsedData.customTest
        );

        const { error } = await supabase
          .from('applications')
          .update({ candidate_phone: updatedPhoneVal })
          .eq('id', appId);

        if (error) throw error;

        setJobApplicants(prev => prev.map(item => item.id === appId ? { ...item, candidate_phone: updatedPhoneVal } : item));
        alert('O candidato já respondeu ao teste de Temperamentos em outro processo seletivo. As respostas foram importadas com sucesso!');
        return;
      }

      const updatedPhoneVal = serializeCandidatePhoneData(
        parsedData.phone,
        parsedData.disc,
        parsedData.notes,
        parsedData.questions,
        parsedData.mbti,
        'PENDING',
        parsedData.customTest
      );

      const { error } = await supabase
        .from('applications')
        .update({ candidate_phone: updatedPhoneVal })
        .eq('id', appId);

      if (error) throw error;

      // Update state
      setJobApplicants(prev => prev.map(item => item.id === appId ? { ...item, candidate_phone: updatedPhoneVal } : item));

      // Professional SMTP Email Sending Simulation in developer console
      console.log(`
========================================================================
📧 [SIMULAÇÃO DE DISPARO DE E-MAIL - SMTP ENVIADO]
========================================================================
Remetente: recrutamento@colaborh.com.br
Destinatário: ${email}
Assunto: 🧭 Teste de Temperamentos e Perfil Comportamental Solicitado - ${jobTitle}

Olá, ${name}!

Temos ótimas notícias! A equipe de recrutamento da Colaborh selecionou seu perfil no 
processo seletivo para a vaga de "${jobTitle}" e gostaria de solicitar que você preencha
o nosso "Teste de Temperamentos e Perfil Comportamental".

Este teste consiste em 25 perguntas de múltipla escolha para identificar suas preferências 
em termos de criatividade, relacionamento, organização e execução.

Como responder ao teste:
1. Acesse o seu Painel de Candidato no portal Colaborh.
2. No menu lateral ou na aba "Testes", localize o "Teste de Temperamentos e Perfil Comportamental".
3. Clique em iniciar para responder às perguntas através de um fluxo guiado passo a passo.

Desejamos muito sucesso em seu processo seletivo!

Atenciosamente,
Equipe de Recrutamento & Seleção - Colaborh
========================================================================
      `);

      alert(`Teste de Temperamentos solicitado com sucesso!\n\nE-mail de notificação enviado para: ${email}\nO candidato já pode responder ao teste no painel dele.`);
    } catch (err) {
      console.error('Erro ao solicitar teste de temperamentos:', err);
      alert('Erro ao solicitar teste de temperamentos.');
    }
  };

  // Direct copy shareable vacancy link helper
  const handleShareJob = (job: any) => {
    const shareUrl = `${window.location.origin}?vaga=${job.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert(`Link de candidatura copiado! Vaga: "${job.title}". Divulgue para potenciais candidatos.`);
    }).catch(err => {
      console.error('Erro ao copiar link:', err);
      // Fallback
      const textInput = document.createElement('input');
      textInput.value = shareUrl;
      document.body.appendChild(textInput);
      textInput.select();
      document.execCommand('copy');
      document.body.removeChild(textInput);
      alert(`Link copiado com sucesso!`);
    });
  };

  const handleUpdateJobStatus = async (jobId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: newStatus })
        .eq('id', jobId);

      if (error) throw error;

      // Update state
      setJobs(prevJobs => 
        prevJobs.map(j => j.id === jobId ? { ...j, status: newStatus } : j)
      );
      
      const PortugueseStatus = newStatus === 'active' ? 'Ativa' : newStatus === 'paused' ? 'Pausada' : 'Encerrada';
      showCustomSuccess(`Status da vaga atualizado para "${PortugueseStatus}"!`);
    } catch (err: any) {
      console.error('Erro ao atualizar status da vaga:', err);
      showCustomAlert('Não foi possível atualizar o status da vaga.', 'Erro');
    }
  };

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    showCustomConfirm(
      `Tem certeza de que deseja excluir permanentemente a vaga "${jobTitle}"? Esta ação não pode ser desfeita.`,
      async () => {
        try {
          // First delete applications associated with this job to avoid foreign key violations
          const { error: appsError } = await supabase
            .from('applications')
            .delete()
            .eq('job_id', jobId);

          if (appsError) {
            console.warn('Erro ao excluir candidaturas associadas:', appsError);
          }

          // Then delete the job
          const { error } = await supabase
            .from('jobs')
            .delete()
            .eq('id', jobId);

          if (error) throw error;

          // Update state
          setJobs(prevJobs => prevJobs.filter(j => j.id !== jobId));
          showCustomSuccess(`Vaga "${jobTitle}" excluída com sucesso!`);
        } catch (err: any) {
          console.error('Erro ao excluir vaga:', err);
          showCustomAlert('Não foi possível excluir a vaga.', 'Erro');
        }
      },
      undefined,
      "Excluir Vaga"
    );
  };

  // Multi-tier candidate pairing resolver (using talents database lookup on mismatch)
  const getFullApplicantInfo = (applicant: any) => {
    const email = applicant.candidate_email || applicant.email;
    const name = applicant.candidate_name || applicant.name;
    const phone = applicant.candidate_phone || applicant.phone;
    
    // Find matching talent profile in talents state list
    const match = talents.find((t: any) => {
      if (email && t.email && t.email.toLowerCase().trim() === email.toLowerCase().trim()) return true;
      if (name && t.name && t.name.toLowerCase().trim() === name.toLowerCase().trim()) return true;
      if (phone && t.phone && t.phone.replace(/\D/g, '') === phone.replace(/\D/g, '')) return true;
      return false;
    });

    return {
      ...applicant,
      candidate_name: name || match?.name || applicant.candidate_name || 'Candidato Cadastrado',
      candidate_phone: phone || match?.phone || applicant.candidate_phone || 'Não inf.',
      candidate_email: email || match?.email || applicant.candidate_email || '',
      city: applicant.city || match?.city || applicant.city || 'N/A',
      state: applicant.state || match?.state || applicant.state || 'N/A',
      profile_pic: applicant.profile_pic || match?.profile_pic || applicant.profile_pic || null,
      talentMatched: match
    };
  };

  useEffect(() => {
    async function loadCompanyInfo() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const metadata = session.user.user_metadata;
          const name = metadata?.company_name || metadata?.full_name || 'Empresa Parceira';
          setCompanyName(name);
        }
      } catch (err) {
        console.error('Erro ao buscar dados da sessão no painel da empresa:', err);
      }
    }
    loadCompanyInfo();
  }, []);

  const fetchApplicants = async (jobId: string) => {
    setIsFetchingApplicants(true);
    console.log('[DEBUG] fetchApplicants chamado para o jobId:', jobId);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('job_id', jobId);
      
      if (error) throw error;
      console.log('[DEBUG] fetchApplicants retornou candidaturas:', data);
      setJobApplicants(data || []);
    } catch (err) {
      console.error('[DEBUG] Erro em fetchApplicants:', err);
    } finally {
      setIsFetchingApplicants(false);
    }
  };

  const handleViewApplicants = (job: any) => {
    setSelectedJob(job);
    fetchApplicants(job.id);
    
    const stagesList = getCurrentJobStages(job);
    setActiveStageTab(stagesList[0] || 'Triagem');
  };

  // New states for company registration
  const [isRegisteringCompany, setIsRegisteringCompany] = useState(false);
  const [isRegisteringVacancy, setIsRegisteringVacancy] = useState(false);
  const [isConfiguringStages, setIsConfiguringStages] = useState(false);

  // Custom Alert / Confirm Dialog states
  const [customDialog, setCustomDialog] = useState<{
    isOpen: boolean;
    type: 'alert' | 'confirm' | 'success';
    title?: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({
    isOpen: false,
    type: 'alert',
    message: ''
  });

  const showCustomAlert = (message: string, title: string = 'Aviso') => {
    setCustomDialog({
      isOpen: true,
      type: 'alert',
      title,
      message
    });
  };

  const showCustomSuccess = (message: string, title: string = 'Sucesso') => {
    setCustomDialog({
      isOpen: true,
      type: 'success',
      title,
      message
    });
  };

  const showCustomConfirm = (message: string, onConfirm: () => void, onCancel?: () => void, title: string = 'Confirmação') => {
    setCustomDialog({
      isOpen: true,
      type: 'confirm',
      title,
      message,
      onConfirm: () => {
        setCustomDialog(prev => ({ ...prev, isOpen: false }));
        onConfirm();
      },
      onCancel: () => {
        setCustomDialog(prev => ({ ...prev, isOpen: false }));
        if (onCancel) onCancel();
      }
    });
  };
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [jobSubTab, setJobSubTab] = useState<'active' | 'paused' | 'closed'>('active');
  const [jobSearch, setJobSearch] = useState('');
  const [companyForm, setCompanyForm] = useState({
    razaoSocial: '',
    nomeFantasia: '',
    solicitante: '',
    sector: '',
    logo: ''
  });

  // Talent Bank states
  const [talentSearch, setTalentSearch] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const [showAiModal, setShowAiModal] = useState(false);
  const [talentFilters, setTalentFilters] = useState({
    role: '',
    minAge: 16,
    maxAge: 60,
    city: '',
    state: '',
    first_job: false,
    education: '',
    experience: '',
    modality: '',
    salary: ''
  });

  const mockTalents = [
    { id: '1', name: 'Ana Silva', role: 'Desenvolvedora Frontend', age: 24, city: 'Brasília', state: 'DF', skills: ['React', 'TS', 'Tailwind'], first_job: false, education: 'Ensino Superior Completo', experience: 'Pleno', modality: 'Híbrido', salary: 'R$ 5.000' },
    { id: '2', name: 'Lucas Souza', role: 'Designer UI/UX', age: 21, city: 'Gama', state: 'DF', skills: ['Figma', 'Adobe XD'], first_job: true, education: 'Superior Cursando', experience: 'Júnior', modality: 'Presencial', salary: 'R$ 3.000' },
    { id: '3', name: 'Maria Santos', role: 'Gerente Comercial', age: 32, city: 'São Paulo', state: 'SP', skills: ['Vendas', 'CRM', 'Liderança'], first_job: false, education: 'Pós-graduação', experience: 'Sênior', modality: 'Presencial', salary: 'R$ 8.000' },
    { id: '4', name: 'João Oliveira', role: 'Social Media', age: 19, city: 'Taguatinga', state: 'DF', skills: ['Canva', 'Copywriting'], first_job: true, education: 'Ensino Médio Completo', experience: 'Estágio', modality: 'Remoto', salary: 'R$ 1.500' },
    { id: '5', name: 'Beatriz Costa', role: 'Desenvolvedora Fullstack', age: 28, city: 'Curitiba', state: 'PR', skills: ['Node', 'React', 'PostgreSQL'], first_job: false, education: 'Ensino Superior Completo', experience: 'Pleno', modality: 'Híbrido', salary: 'R$ 6.500' },
  ];

  const [talents, setTalents] = useState<any[]>(mockTalents);
  const [isFetchingTalents, setIsFetchingTalents] = useState(false);
  const [publishedJobLink, setPublishedJobLink] = useState<string | null>(null);
  const [hasCopiedPublishedLink, setHasCopiedPublishedLink] = useState<boolean>(false);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  useEffect(() => {
    async function loadTalents() {
      if (!import.meta.env.VITE_SUPABASE_URL) return;
      
      setIsFetchingTalents(true);
      try {
        const { data, error } = await supabase
          .from('talents')
          .select('*');
        
        if (error) throw error;
        if (data && data.length > 0) {
          setTalents(data);
        }
      } catch (err) {
        console.error('Erro ao buscar talentos do Supabase:', err);
      } finally {
        setIsFetchingTalents(false);
      }
    }

    loadTalents();
  }, [mockTalents]);

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const filteredTalents = talents.filter(t => {
    if (!t) return false;
    if (t.role && (t.role.toLowerCase() === 'empresa' || t.role.toLowerCase() === 'company')) {
      return false;
    }
    const talentAge = t.age || calculateAge(t.birth_date) || 0;
    const matchesSearch = t.name.toLowerCase().includes(talentSearch.toLowerCase()) || 
                         t.role.toLowerCase().includes(talentSearch.toLowerCase()) ||
                         (t.skills && Array.isArray(t.skills) && t.skills.some((s: string) => s && s.toLowerCase().includes(talentSearch.toLowerCase())));
    
    const matchesFilters = (!talentFilters.role || t.role.toLowerCase().includes(talentFilters.role.toLowerCase())) &&
                          (talentAge >= talentFilters.minAge && talentAge <= talentFilters.maxAge) &&
                          (!talentFilters.city || t.city.toLowerCase().includes(talentFilters.city.toLowerCase())) &&
                          (!talentFilters.state || t.state === talentFilters.state) &&
                          (!talentFilters.first_job || t.first_job === true) &&
                          (!talentFilters.education || t.education === talentFilters.education) &&
                          (!talentFilters.experience || t.experience === talentFilters.experience) &&
                          (!talentFilters.modality || t.modality === talentFilters.modality) &&
                          (!talentFilters.salary || t.salary.includes(talentFilters.salary));
    
    return matchesSearch && matchesFilters;
  });



  const handleAiSearch = () => {
    if (!aiPrompt.trim()) return;
    setIsAiSearching(true);
    // Simulate AI thinking
    setTimeout(() => {
      setTalentSearch(aiPrompt.split(' ').slice(0, 2).join(' ')); // Mock AI extracting keywords
      setIsAiSearching(false);
      setShowAiModal(false);
      setAiPrompt('');
    }, 2000);
  };

  // Multi-step form state
  const [registerStep, setRegisterStep] = useState(1);
  const [vacancyForm, setVacancyForm] = useState({
    title: '',
    modality: 'Presencial',
    state: '',
    city: '',
    remunerationType: 'Mensal',
    salary: '',
    hasBonus: false,
    bonusType: 'Comissão',
    bonusValue: '',
    contractType: 'CLT',
    benefits: {
      vt: { selected: false, value: '' },
      va: { selected: false, value: '' },
      healthInsurance: false,
      dentalPlan: false
    },
    extraBenefits: [] as string[],
    workSchedule: '5x2',
    isFirstJob: false,
    minAge: 18,
    description: '',
    requirements: [] as string[],
    stages: ['Análise de Currículo', 'Entrevista', 'Teste Técnico']
  });

  const [newStage, setNewStage] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [talentCities, setTalentCities] = useState<string[]>([]);
  const [isTalentLoadingCities, setIsTalentLoadingCities] = useState(false);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!vacancyForm.title.trim()) return "O título da vaga é obrigatório.";
      if (vacancyForm.modality === 'Presencial') {
        if (!vacancyForm.state) return "O estado é obrigatório para vagas presenciais.";
        if (!vacancyForm.city) return "A cidade é obrigatória para vagas presenciais.";
      }
      if (!vacancyForm.salary.trim()) return "O salário proposto é obrigatório.";
      if (!vacancyForm.contractType) return "O tipo de contratação é obrigatório.";
      if (!vacancyForm.workSchedule) return "A escala de trabalho é obrigatória.";
    }

    if (step === 2) {
      if (!vacancyForm.description.trim()) return "A descrição da vaga é obrigatória.";
    }

    if (step === 3) {
      if (vacancyForm.stages.length === 0) return "A vaga deve ter ao menos uma etapa no processo seletivo.";
    }

    return null;
  };

  const handleNextStep = () => {
    const error = validateStep(registerStep);
    if (error) {
      setErrorMessage(error);
      alert(error);
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }
    setRegisterStep(prev => prev + 1);
  };

  const [jobs, setJobs] = useState<any[]>([]);
  const [isFetchingJobs, setIsFetchingJobs] = useState(false);

  // Filter jobs by selected company name
  const companyJobs = jobs.filter(job => {
    const jobComp = (job.company_name || '').trim().toLowerCase();
    const selectedCompName = (selectedCompany?.nomeFantasia || '').trim().toLowerCase();
    return jobComp === selectedCompName;
  });

  // Calculate dynamic dashboard stats
  const activeJobsCount = companyJobs.filter(j => {
    const s = (j.status || '').toLowerCase();
    return s === 'active' || s === 'ativa' || s === '';
  }).length;

  const pausedJobsCount = companyJobs.filter(j => {
    const s = (j.status || '').toLowerCase();
    return s === 'paused' || s === 'pausada';
  }).length;

  const closedJobsCount = companyJobs.filter(j => {
    const s = (j.status || '').toLowerCase();
    return s === 'closed' || s === 'encerrada';
  }).length;

  const totalCandidatesCount = companyJobs.reduce((acc, j) => acc + (j.candidates_count || 0), 0);

  // Dynamic vacancy distribution based on actual applications
  const [companyApplications, setCompanyApplications] = useState<any[]>([]);
  
  const dynamicDistribution = (() => {
    const total = companyApplications.length;
    if (total === 0) {
      return [
        { name: 'Triagem', value: 100, color: '#6366f1' }
      ];
    }

    const counts: { [key: string]: number } = {
      'Triagem': 0,
      'Entrevista': 0,
      'Contratado': 0,
      'Reprovado': 0,
      'Outros': 0
    };

    companyApplications.forEach(app => {
      const status = app.status || 'Triagem';
      if (status === 'Triagem' || status === 'Análise de Currículo') {
        counts['Triagem']++;
      } else if (status === 'Entrevista') {
        counts['Entrevista']++;
      } else if (status === 'Contratado') {
        counts['Contratado']++;
      } else if (status === 'Reprovado') {
        counts['Reprovado']++;
      } else {
        counts['Outros']++;
      }
    });

    const dist = [
      { name: 'Triagem', value: Math.round((counts['Triagem'] / total) * 100), color: '#6366f1' },
      { name: 'Entrevista', value: Math.round((counts['Entrevista'] / total) * 100), color: '#8b5cf6' },
      { name: 'Contratado', value: Math.round((counts['Contratado'] / total) * 100), color: '#10b981' },
      { name: 'Reprovado', value: Math.round((counts['Reprovado'] / total) * 100), color: '#f43f5e' },
      { name: 'Outros', value: Math.round((counts['Outros'] / total) * 100), color: '#f59e0b' },
    ];

    // Filter out zero percent values unless all are zero
    const filtered = dist.filter(item => item.value > 0);
    return filtered.length > 0 ? filtered : [{ name: 'Triagem', value: 100, color: '#6366f1' }];
  })();
  const [isFetchingCompanyApps, setIsFetchingCompanyApps] = useState(false);

  useEffect(() => {
    async function loadCompanyApplications() {
      if ((activeTab !== 'Avaliações' && activeTab !== 'Dashboard') || !import.meta.env.VITE_SUPABASE_URL || companyJobs.length === 0) {
        setCompanyApplications([]);
        return;
      }
      setIsFetchingCompanyApps(true);
      try {
        const jobIds = companyJobs.map(j => j.id);
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .in('job_id', jobIds);
        
        if (!error && data) {
          setCompanyApplications(data);
        }
      } catch (err) {
        console.error('Erro ao buscar candidaturas da empresa:', err);
      } finally {
        setIsFetchingCompanyApps(false);
      }
    }
    loadCompanyApplications();
  }, [activeTab, selectedCompanyId, jobs]);

  useEffect(() => {
    async function loadJobs() {
      if (!import.meta.env.VITE_SUPABASE_URL) return;
      
      setIsFetchingJobs(true);
      try {
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (jobsError) throw jobsError;

        // Fetch applications dynamically to calculate real candidates counts in real-time
        const { data: appsData, error: appsError } = await supabase
          .from('applications')
          .select('*');

        if (appsError) {
          console.warn('Erro ao carregar contagem de candidaturas:', appsError);
        }

        const mappedJobs = (jobsData || []).map((job: any) => {
          const count = appsData
            ? appsData.filter((app: any) => app.job_id === job.id).length
            : 0;
          return {
            ...job,
            candidates_count: count
          };
        });

        if (appsData && appsData.length > 0) {
          console.log('--- DIAGNOSTIC APPLICATIONS RECORD ---', Object.keys(appsData[0]), appsData);
        }

        setJobs(mappedJobs);
      } catch (err) {
        console.error('Erro ao buscar vagas do Supabase:', err);
      } finally {
        setIsFetchingJobs(false);
      }
    }

    loadJobs();
  }, [activeTab, selectedCompanyId]);

  // Close job details/applicants/Kanban when switching company
  useEffect(() => {
    setSelectedJob(null);
  }, [selectedCompanyId]);

  const handlePublish = async () => {
    // Auto-add any typed stage in the input field before validating and publishing
    let currentStages = vacancyForm.stages;
    if (newStage.trim()) {
      const trimmedStage = newStage.trim();
      const forbidden = ['testes', 'contratado', 'reprovado'];
      if (forbidden.includes(trimmedStage.toLowerCase())) {
        alert(`O nome "${trimmedStage}" é reservado para o sistema e não pode ser usado.`);
        return;
      }
      currentStages = [...currentStages, trimmedStage];
      setVacancyForm(prev => ({ ...prev, stages: currentStages }));
      setNewStage('');
    }

    if (currentStages.length === 0) {
      const error = "A vaga deve ter ao menos uma etapa no processo seletivo.";
      setErrorMessage(error);
      alert(error);
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    if (!import.meta.env.VITE_SUPABASE_URL) {
      alert('Configuração do Supabase ausente.');
      return;
    }

    try {
      let finalDescription = vacancyForm.description;
      const benefitTextList: string[] = [];
      if (vacancyForm.benefits.vt.selected) {
        benefitTextList.push(`Vale Transporte: ${vacancyForm.benefits.vt.value || 'Sim'}`);
      }
      if (vacancyForm.benefits.va.selected) {
        benefitTextList.push(`Vale Alimentação/Refeição: ${vacancyForm.benefits.va.value || 'Sim'}`);
      }
      if (vacancyForm.benefits.healthInsurance) {
        benefitTextList.push('Plano de Saúde');
      }
      if (vacancyForm.benefits.dentalPlan) {
        benefitTextList.push('Plano Odontológico');
      }
      if (vacancyForm.extraBenefits && vacancyForm.extraBenefits.length > 0) {
        vacancyForm.extraBenefits.forEach(b => benefitTextList.push(b));
      }
      if (benefitTextList.length > 0) {
        finalDescription += `\n\nBenefícios:\n${benefitTextList.map(b => `• ${b}`).join('\n')}`;
      }

      // Pre-add helpful metadata inside description in case any of these columns don't exist in Supabase table
      let detailedDescriptionStr = finalDescription;
      let metaDetails: string[] = [];
      if (vacancyForm.city || vacancyForm.state) {
        metaDetails.push(`📍 Localização: ${vacancyForm.city || ''}${vacancyForm.city && vacancyForm.state ? ' - ' : ''}${vacancyForm.state || ''}`);
      }
      if (vacancyForm.contractType) {
        metaDetails.push(`📝 Contratação: ${vacancyForm.contractType}`);
      }
      if (vacancyForm.workSchedule) {
        metaDetails.push(`⏰ Escala: ${vacancyForm.workSchedule}`);
      }
      if (vacancyForm.minAge) {
        metaDetails.push(`🔞 Idade Mínima: ${vacancyForm.minAge} anos`);
      }
      if (metaDetails.length > 0) {
        detailedDescriptionStr = metaDetails.join('\n') + '\n\n' + detailedDescriptionStr;
      }

      // Always append the stages array to description as a serialized string for bulletproof fallback
      detailedDescriptionStr = detailedDescriptionStr + `\n\n===ETAPAS_JSON===${JSON.stringify(currentStages)}===FIM_ETAPAS===`;

      // Start with all columns, we will drop invalid ones if Supabase returns PGRST204 (Schema Cache mismatch)
      let payload: any = {
        title: vacancyForm.title,
        company_name: selectedCompany.nomeFantasia,
        modality: vacancyForm.modality,
        state: vacancyForm.state,
        city: vacancyForm.city,
        salary: vacancyForm.salary,
        contract_type: vacancyForm.contractType,
        description: detailedDescriptionStr,
        requirements: vacancyForm.requirements,
        stages: currentStages,
        work_schedule: vacancyForm.workSchedule,
        min_age: vacancyForm.minAge,
        benefits: vacancyForm.benefits,
        status: 'active'
      };

      let attempt = 0;
      const maxAttempts = 15;
      let success = false;
      let insertedRow: any = null;

      while (attempt < maxAttempts) {
        const { data: insertedData, error: saveError } = await supabase
          .from('jobs')
          .insert([payload])
          .select();

        if (!saveError) {
          success = true;
          if (insertedData && insertedData[0]) {
            insertedRow = insertedData[0];
          }
          break;
        }

        console.error(`Tentativa ${attempt} falhou ao salvar vaga:`, saveError);

        // PGRST204: schema cache column not found
        const isColumnError = saveError.code === 'PGRST204' || 
          (saveError.message && saveError.message.toLowerCase().includes("could not find the") && saveError.message.toLowerCase().includes("column"));

        if (isColumnError) {
          // Extract column name using regex
          const match = saveError.message.match(/Could not find the '([^']+)' column/i);
          const colToDrop = match ? match[1] : null;

          if (colToDrop && colToDrop in payload) {
            console.warn(`[Self-Healing] Removendo coluna inexistente '${colToDrop}' e tentando novamente.`);
            delete payload[colToDrop];
            attempt++;
            continue;
          }
        }

        // If it's a different database error, throw it
        throw saveError;
      }

      if (!success) {
        throw new Error('Falha ao publicar os dados da vaga após várias tentativas.');
      }

      // Generate the sharing link immediately to display to the user
      const newJobId = insertedRow?.id || Date.now().toString();
      const shareUrl = `${window.location.origin}?vaga=${newJobId}`;
      setPublishedJobLink(shareUrl);
      setHasCopiedPublishedLink(false);
      setIsRegisteringVacancy(false);
    } catch (err: any) {
      console.error('Erro ao salvar vaga:', err);
      alert('Erro ao publicar vaga: ' + (err.message || JSON.stringify(err)));
    }
  };

  const handleRegisterCompany = () => {
    if (!companyForm.razaoSocial.trim() || !companyForm.nomeFantasia.trim() || !companyForm.solicitante.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (selectedCompanyId !== 'new') {
      // Editar empresa existente
      const updatedCompanies = companies.map(c => {
        if (c.id === selectedCompanyId) {
          return {
            ...c,
            razaoSocial: companyForm.razaoSocial,
            nomeFantasia: companyForm.nomeFantasia,
            solicitante: companyForm.solicitante,
            sector: companyForm.sector || 'Geral',
            logo: companyForm.logo
          };
        }
        return c;
      });
      setCompanies(updatedCompanies);
      alert('Empresa atualizada com sucesso!');
    } else {
      // Criar nova empresa
      const newCompany: Company = {
        id: Date.now().toString(),
        razaoSocial: companyForm.razaoSocial,
        nomeFantasia: companyForm.nomeFantasia,
        solicitante: companyForm.solicitante,
        sector: companyForm.sector || 'Geral',
        logo: companyForm.logo
      };

      setCompanies([...companies, newCompany]);
      setSelectedCompanyId(newCompany.id); // Auto-seleciona a nova empresa cadastrada
      alert('Empresa cadastrada com sucesso!');
    }
  };

  const handleEditCompany = (company: Company, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCompanyId(company.id);
    setCompanyForm({
      razaoSocial: company.razaoSocial,
      nomeFantasia: company.nomeFantasia,
      solicitante: company.solicitante,
      sector: company.sector,
      logo: company.logo || ''
    });
    setIsRegisteringCompany(true);
  };

  const handleDeleteCompany = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (id === '1') {
      alert('A empresa padrão do sistema não pode ser excluída.');
      return;
    }
    if (confirm('Tem certeza de que deseja excluir esta empresa da lista? As vagas cadastradas com este nome continuarão ativas no banco de dados, mas a empresa sairá do seletor e do cadastro.')) {
      const updatedCompanies = companies.filter(c => c.id !== id);
      setCompanies(updatedCompanies);
      if (selectedCompanyId === id) {
        setSelectedCompanyId('1');
      }
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        alert('O arquivo é muito grande! Escolha um logotipo de no máximo 500kb.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyForm(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (vacancyForm.state && vacancyForm.modality === 'Presencial') {
      if (vacancyForm.state === 'DF') {
        setCities(DF_REGIONS);
        setIsLoadingCities(false);
        return;
      }
      setIsLoadingCities(true);
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${vacancyForm.state}/municipios`)
        .then(res => res.json())
        .then(data => {
          setCities(data.map((city: any) => city.nome).sort());
          setIsLoadingCities(false);
        })
        .catch(err => {
          console.error('Error fetching cities:', err);
          setIsLoadingCities(false);
        });
    } else {
      setCities([]);
    }
  }, [vacancyForm.state, vacancyForm.modality]);

  useEffect(() => {
    if (talentFilters.state) {
      if (talentFilters.state === 'DF') {
        setTalentCities(DF_REGIONS);
        setIsTalentLoadingCities(false);
        return;
      }
      setIsTalentLoadingCities(true);
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${talentFilters.state}/municipios`)
        .then(res => res.json())
        .then(data => {
          setTalentCities(data.map((city: any) => city.nome).sort());
          setIsTalentLoadingCities(false);
        })
        .catch(err => {
          console.error('Error fetching cities:', err);
          setIsTalentLoadingCities(false);
        });
    } else {
      setTalentCities([]);
    }
  }, [talentFilters.state]);

  const commonRequirements = [
    'Experiência prévia',
    'Inglês Intermediário',
    'Disponibilidade de horário',
    'Proatividade',
    'Trabalho em equipe'
  ];

  const formatCurrency = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    const numericValue = parseInt(cleanValue) / 100;
    if (isNaN(numericValue)) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setVacancyForm({ ...vacancyForm, salary: formatted });
  };

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F0F2F5] relative font-sans">
      {/* Decorative Blobs */}
      <div className="fixed top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary-100 rounded-full blur-[120px] opacity-20 pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-indigo-100 rounded-full blur-[100px] opacity-20 pointer-events-none" />

      {/* Backdrop overlay for mobile */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[90] lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - MATCH CANDIDATE STYLE WITH RESPONSIVE BEHAVIOR */}
      <aside className={`w-64 ${isSidebarExpanded ? 'lg:w-64 lg:p-6' : 'lg:w-20 lg:p-4'} bg-gradient-to-b from-primary-600 via-primary-700 to-highlight-700 p-6 flex flex-col fixed h-full z-[100] shadow-2xl transition-all duration-300 ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className={`mb-10 flex ${isSidebarExpanded ? 'lg:flex-row justify-between lg:justify-start lg:gap-4' : 'lg:flex-col justify-between lg:justify-center lg:gap-4'} items-center w-full gap-4`}>
          {/* Logo completa no mobile e no desktop expandido */}
          <img src="/logo.png" alt="Colaborh" className={`h-10 w-auto ${isSidebarExpanded ? '' : 'lg:hidden'}`} />
          
          {/* Símbolo minimalista no desktop recolhido */}
          <div className={`hidden ${isSidebarExpanded ? 'lg:hidden' : 'lg:flex'} justify-center items-center w-full`}>
            <img src="/logo-icon.png" alt="Colaborh" className="h-10 w-10 object-contain" />
          </div>

          <button 
            onClick={() => setIsMobileSidebarOpen(false)} 
            className="lg:hidden text-white/70 hover:text-white p-1"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-3 lg:space-y-4 w-full flex flex-col items-center">
          <SidebarItem icon={BarChart3} label="Dashboard" activeTab={activeTab} setActiveTab={handleSelectTab} isSidebarExpanded={isSidebarExpanded} />
          <SidebarItem icon={Briefcase} label="Minhas Vagas" activeTab={activeTab} setActiveTab={handleSelectTab} isSidebarExpanded={isSidebarExpanded} />
          <SidebarItem icon={Search} label="Banco de Talentos" activeTab={activeTab} setActiveTab={handleSelectTab} isSidebarExpanded={isSidebarExpanded} />
          <SidebarItem icon={Building} label="Empresas" activeTab={activeTab} setActiveTab={handleSelectTab} isSidebarExpanded={isSidebarExpanded} />
          <SidebarItem icon={Award} label="Avaliações" activeTab={activeTab} setActiveTab={handleSelectTab} isSidebarExpanded={isSidebarExpanded} />
        </nav>

        <div className="mt-auto space-y-3 pt-6 border-t border-white/10 w-full flex flex-col items-center">
          {/* Configurações */}
          <div className="relative group/item w-full flex justify-center h-12">
            <button 
              onClick={() => handleSelectTab('Configurações')}
              className={`w-full ${
                isSidebarExpanded 
                  ? 'lg:w-full lg:h-12 lg:px-4 lg:justify-start lg:space-x-3' 
                  : 'lg:w-12 lg:h-12 lg:px-0 lg:justify-center lg:space-x-0'
              } flex items-center justify-start space-x-3 py-2.5 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest ${
                activeTab === 'Configurações' 
                  ? 'bg-white/20 text-white shadow-lg' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Settings size={16} className={activeTab === 'Configurações' ? 'text-white' : 'text-white/50'} />
              <span className={`font-bold text-[10px] uppercase tracking-widest whitespace-nowrap ${isSidebarExpanded ? 'lg:inline-block' : 'lg:hidden'}`}>Configurações</span>
            </button>
            
            <div 
              onClick={() => handleSelectTab('Configurações')}
              className={`absolute left-0 top-0 h-12 ${isSidebarExpanded ? 'hidden' : 'hidden lg:flex'} items-center justify-start bg-[#533af6]/75 backdrop-blur-[6px] text-white rounded-2xl shadow-[0_10px_25px_rgba(83,58,246,0.25)] cursor-pointer pointer-events-none opacity-0 translate-x-[-24px] group-hover/item:opacity-100 group-hover/item:translate-x-0 group-hover/item:pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-[110] w-auto whitespace-nowrap pl-[16px] pr-6 gap-3`}
            >
              <Settings size={16} className="text-white" />
              <span className="font-black text-[10px] uppercase tracking-widest text-white leading-none mt-0.5">Configurações</span>
            </div>
          </div>

          {/* Sair */}
          <div className="relative group/item w-full flex justify-center h-12">
            <button 
              onClick={onLogout}
              className={`w-full ${
                isSidebarExpanded 
                  ? 'lg:w-full lg:h-12 lg:px-4 lg:justify-start lg:space-x-3' 
                  : 'lg:w-12 lg:h-12 lg:px-0 lg:justify-center lg:space-x-0'
              } flex items-center justify-start space-x-3 py-2.5 rounded-xl text-red-300 hover:text-red-100 hover:bg-red-500/10 transition-all font-bold text-[10px] uppercase tracking-widest`}
            >
              <LogOut size={16} />
              <span className={`font-bold text-[10px] uppercase tracking-widest whitespace-nowrap ${isSidebarExpanded ? 'lg:inline-block' : 'lg:hidden'}`}>Sair</span>
            </button>

            <div 
              onClick={onLogout}
              className={`absolute left-0 top-0 h-12 ${isSidebarExpanded ? 'hidden' : 'hidden lg:flex'} items-center justify-start bg-[#533af6]/75 backdrop-blur-[6px] text-white rounded-2xl shadow-[0_10px_25px_rgba(83,58,246,0.25)] cursor-pointer pointer-events-none opacity-0 translate-x-[-24px] group-hover/item:opacity-100 group-hover/item:translate-x-0 group-hover/item:pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-[110] w-auto whitespace-nowrap pl-[16px] pr-6 gap-3`}
            >
              <LogOut size={16} className="text-white" />
              <span className="font-black text-[10px] uppercase tracking-widest text-white leading-none mt-0.5">Sair</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className={`flex-1 min-h-screen flex flex-col ${isSidebarExpanded ? 'lg:pl-64' : 'lg:pl-20'} transition-all duration-300 relative z-10`}>
        <header className={`sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 pt-4 flex flex-col gap-4 transition-all duration-200 ${
          activeTab === 'Minhas Vagas' || activeTab === 'Banco de Talentos' ? 'pb-0' : 'pb-4'
        }`}>
          {/* Top row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            {/* Lado Esquerdo */}
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-3">
                {/* Botão de Toggle da Sidebar (visível apenas no desktop) */}
                <button
                  onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                  className="hidden lg:flex items-center justify-center w-9 h-9 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-full text-slate-500 transition-all active:scale-95 shrink-0 shadow-sm"
                  title={isSidebarExpanded ? "Recolher menu" : "Expandir menu"}
                >
                  {isSidebarExpanded ? (
                    <ChevronLeft size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>

                {/* Ícone e Nome da Aba Ativa */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 shrink-0">
                    {activeTab === 'Dashboard' && <BarChart3 size={16} />}
                    {activeTab === 'Cadastrar Vagas' && <PlusCircle size={16} />}
                    {activeTab === 'Minhas Vagas' && <Briefcase size={16} />}
                    {activeTab === 'Banco de Talentos' && <Search size={16} />}
                    {activeTab === 'Empresas' && <Building size={16} />}
                    {activeTab === 'Avaliações' && <Award size={16} />}
                    {activeTab === 'Configurações' && <Settings size={16} />}
                  </div>
                  <h1 className="text-sm font-bold text-slate-800 tracking-tight">{activeTab}</h1>
                </div>
              </div>

              {/* Botão de abrir menu móvel (apenas mobile/tablet) */}
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-500 hover:text-slate-700 rounded-xl hover:bg-slate-50 transition-all"
              >
                <Menu size={22} />
              </button>
            </div>

            {/* Lado Direito */}
            <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
              {/* Botão de Chat */}
              <button 
                onClick={() => showCustomAlert("Suporte Colaborh: Como podemos te ajudar hoje?", "Suporte")}
                className="w-9 h-9 bg-primary-600 hover:bg-primary-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-primary-600/35 transition-all hover:scale-105 active:scale-95 shrink-0"
                title="Suporte"
              >
                <MessageSquare size={15} />
              </button>

              {/* Botão de Notificações */}
              <button
                onClick={() => showCustomAlert("Você não possui novas notificações no momento.", "Notificações")}
                className="w-9 h-9 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-500 hover:text-slate-700 rounded-full flex items-center justify-center transition-all active:scale-95 shrink-0 shadow-sm"
                title="Notificações"
              >
                <Bell size={15} />
              </button>

              {/* Divisor Vertical */}
              <div className="h-6 w-[1px] bg-slate-200" />

              {/* Seletor de Empresa Ativa */}
              <div className="relative" ref={companyDropdownRef}>
                <button
                  onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                  className="bg-slate-50 border border-slate-200/60 rounded-full px-4 py-2 flex items-center gap-2.5 cursor-pointer hover:bg-slate-100 transition-all text-slate-700 select-none shadow-none outline-none focus:outline-none active:scale-95"
                >
                  <Building size={14} className="text-slate-500" />
                  <span className="font-bold text-xs text-slate-700 mt-0.5">{selectedCompany?.nomeFantasia}</span>
                  <ChevronDown size={14} className={`text-slate-500 transition-transform ${isCompanyDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCompanyDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200/80 rounded-2xl shadow-xl z-[200] overflow-hidden py-3 text-left">
                    {/* Input de Busca */}
                    <div className="px-3 pb-3">
                      <div className="flex items-center gap-2 bg-slate-100/60 rounded-full px-3.5 py-2 w-full">
                        <Search size={14} className="text-slate-400 shrink-0" />
                        <input 
                          type="text"
                          value={companySearchQuery}
                          onChange={(e) => setCompanySearchQuery(e.target.value)}
                          placeholder="Nome da empresa"
                          className="bg-transparent border border-transparent outline-none font-semibold text-xs text-slate-700 p-0 w-full focus:ring-0 placeholder:text-slate-400 placeholder:font-normal"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>

                    <div className="border-b border-slate-100" />

                    {/* Lista de Empresas */}
                    <div className="max-h-60 overflow-y-auto pt-2">
                      {companies
                        .filter(c => c.nomeFantasia.toLowerCase().includes(companySearchQuery.toLowerCase()))
                        .map((comp) => (
                          <div 
                            key={comp.id}
                            onClick={() => {
                              setSelectedCompanyId(comp.id);
                              setIsCompanyDropdownOpen(false);
                            }}
                            className={`flex items-center justify-between px-4 py-2 hover:bg-slate-50 cursor-pointer ${
                              selectedCompanyId === comp.id ? 'bg-primary-50/50' : ''
                            }`}
                          >
                            <span className="font-semibold text-xs text-slate-700">{comp.nomeFantasia}</span>
                            {selectedCompanyId === comp.id && <Check size={12} className="text-primary-600" />}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Divisor Vertical */}
              <div className="h-6 w-[1px] bg-slate-200" />

              {/* Avatar com iniciais ou Logo */}
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm shrink-0" title={selectedCompany?.nomeFantasia}>
                {selectedCompany?.logo ? (
                  <img src={selectedCompany.logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-600 font-extrabold text-xs">
                    {selectedCompany?.nomeFantasia ? selectedCompany.nomeFantasia.substring(0, 2).toUpperCase() : 'CO'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom row (Tabs glued to the header) */}
          {activeTab === 'Minhas Vagas' && selectedJob === null && (
            <div className="flex -mx-6 bg-transparent px-6 relative">
              {(() => {
                const tabs = [
                  { id: 'active', label: 'ATIVAS', count: activeJobsCount, icon: Briefcase },
                  { id: 'paused', label: 'PAUSADAS', count: pausedJobsCount, icon: Clock },
                  { id: 'closed', label: 'ENCERRADAS', count: closedJobsCount, icon: XCircle }
                ];
                const tabIndex = tabs.findIndex(t => t.id === jobSubTab);

                return (
                  <>
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setJobSubTab(tab.id as any)}
                        className={`flex items-center justify-center gap-2 w-44 py-4 border-b-2 font-bold text-xs uppercase tracking-wider transition-all border-transparent ${
                          jobSubTab === tab.id 
                            ? 'text-slate-900 font-extrabold' 
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <tab.icon size={14} className={jobSubTab === tab.id ? 'text-[#533af6]' : 'text-slate-400'} />
                        <span>{tab.label} ({tab.count})</span>
                      </button>
                    ))}
                    <motion.div 
                      animate={{ x: tabIndex * 176 }}
                      className="absolute bottom-0 left-6 h-[2px] bg-[#533af6]"
                      style={{ width: 176 }}
                      transition={{ type: 'spring', stiffness: 120, damping: 22 }}
                    />
                  </>

                );
              })()}
            </div>
          )}

          {/* Bottom row (AI search bar glued to the header for Talent Bank) */}
          {activeTab === 'Banco de Talentos' && (
            <div className="w-full pb-3 pt-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="h-6 w-1 bg-[#533af6] rounded-full" />
                <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
                  Banco de Talentos
                  <span className="text-[9px] bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full lowercase tracking-normal font-bold">
                    todos os candidatos
                  </span>
                </h3>
              </div>

              {/* Busca por IA integrada e alinhada à direita */}
              <div className="w-full md:max-w-md shrink-0">
                <div className="bg-white p-1 rounded-full shadow-md border border-slate-100/60 flex items-stretch gap-1.5 w-full">
                  <div className="flex-1 relative flex items-center bg-slate-50/50 rounded-full px-3 py-1">
                    {isAiSearching ? (
                      <Cpu size={14} className="text-[#533af6] animate-spin mr-2 shrink-0" />
                    ) : (
                      <BrainCircuit size={14} className="text-[#533af6] mr-2 shrink-0" />
                    )}
                    <input 
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Busca por IA: Descreva o perfil do candidato..."
                      className="w-full bg-transparent border-none outline-none text-xs font-bold text-slate-700 placeholder:text-slate-450 py-1.5"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAiSearch();
                        }
                      }}
                    />
                    {aiPrompt && !isAiSearching && (
                      <button 
                        onClick={() => setAiPrompt('')}
                        className="p-1.5 text-slate-350 hover:text-slate-500 transition-colors"
                      >
                        <CloseIcon size={12} />
                      </button>
                    )}
                  </div>
                  <button 
                    onClick={handleAiSearch}
                    disabled={isAiSearching || !aiPrompt.trim()}
                    className="px-4 bg-[#533af6] hover:bg-[#4326e5] disabled:opacity-50 text-white rounded-full font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-1 transition-all shrink-0 py-2.5 md:py-0 shadow-md shadow-[#533af6]/10"
                  >
                    {isAiSearching ? 'Analisando...' : (
                      <>Puxar Talentos <Zap size={10} /></>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

        </header>

        <main className="flex-1 p-6 lg:p-10 relative transition-all duration-300 z-10">
          <div className="w-full">
          <AnimatePresence mode="wait">
            {activeTab === 'Dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8 pb-10"
              >
                {/* Top Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Vagas Ativas', value: '12', trend: '+2', trendUp: true, icon: Briefcase, color: 'text-primary-600', bg: 'bg-primary-50' },
                    { label: 'Candidatos', value: '1,284', trend: '+12%', trendUp: true, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Entrevistas', value: '24', trend: '-3', trendUp: false, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Tempo Médio', value: '18 dias', trend: '-2d', trendUp: true, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                  ].map((stat, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ y: -5 }}
                      className="bg-white p-7 rounded-[2.5rem] shadow-sleek border border-white hover:border-primary-100 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                          <stat.icon size={22} />
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black ${stat.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                          {stat.trendUp ? <TrendingUp size={10} /> : <Activity size={10} />}
                          {stat.trend}
                        </div>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 leading-none mb-1">{stat.value}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Actions Bar */}
                <div className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 border-r border-slate-100 hidden md:block">Ações Rápidas</span>
                  <button 
                    onClick={() => setActiveTab('Cadastrar Vagas')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md shadow-primary-100 hover:shadow-lg transition-all active:scale-95"
                  >
                    <Plus size={14} /> Nova Vaga
                  </button>
                  <button 
                    onClick={() => setActiveTab('Banco de Talentos')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
                  >
                    <Search size={14} /> Buscar Talento
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">
                    <Mail size={14} /> Convites Pendentes
                  </button>
                </div>

                {/* Main Analytics Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Chart - Area Chart */}
                  <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] shadow-sleek border border-white flex flex-col min-h-[420px]">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Fluxo de Candidaturas</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Volume de novos candidatos por dia</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-all border border-transparent hover:border-primary-100">Semana</button>
                        <button className="px-4 py-2 bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary-100">Mês</button>
                      </div>
                    </div>
                    
                    <div className="flex-1 w-full min-h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={APPLICATION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              borderRadius: '1.5rem', 
                              border: 'none', 
                              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                              padding: '12px 20px'
                            }}
                            itemStyle={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}
                            labelStyle={{ display: 'none' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="applications" 
                            stroke="#6366f1" 
                            strokeWidth={4}
                            fillOpacity={1} 
                            fill="url(#colorApps)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Distribution Chart - Pie Chart */}
                  <div className="bg-white p-8 rounded-[3rem] shadow-sleek border border-white flex flex-col h-full">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2">Status dos Processos</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Onde os candidatos estão estacionados</p>
                    
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="w-full h-48 relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={VACANCY_DISTRIBUTION}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={85}
                              paddingAngle={8}
                              dataKey="value"
                            >
                              {VACANCY_DISTRIBUTION.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-2xl font-black text-slate-900 leading-none">124</span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total</span>
                        </div>
                      </div>

                      <div className="w-full space-y-3 mt-8">
                        {VACANCY_DISTRIBUTION.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                              <span className="text-slate-500">{item.name}</span>
                            </div>
                            <span className="text-slate-900">{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Row - Skills and Activities */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Top Skills Sought */}
                  <div className="bg-white p-8 rounded-[3rem] shadow-sleek border border-white">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                        <Award size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Habilidades em Alta</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Mais buscadas no seu banco de talentos</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {TOP_SKILLS.map((skill, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-700">{skill.name}</span>
                            <span className="text-primary-600">{skill.count} Candidatos</span>
                          </div>
                          <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.count}%` }}
                              transition={{ duration: 1, delay: i * 0.1 }}
                              className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity Feed */}
                  <div className="bg-white p-8 rounded-[3rem] shadow-sleek border border-white">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                          <Zap size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-slate-900 tracking-tight">Atividade Recente</h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Últimas interações no painel</p>
                        </div>
                      </div>
                      <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 transition-all">
                        <MoreVertical size={20} />
                      </button>
                    </div>

                    <div className="space-y-5">
                      {[
                        { icon: User, title: 'Nova Candidatura', desc: 'Ana Paula aplicou para Vendedor Externo', time: '12m atrás', color: 'bg-indigo-50 text-indigo-600' },
                        { icon: Calendar, title: 'Entrevista Marcada', desc: 'Entrevista com Lucas Souza às 14:00', time: '1h atrás', color: 'bg-emerald-50 text-emerald-600' },
                        { icon: BrainCircuit, title: 'IA: Novo Match', desc: 'IA encontrou correspondência de 98% para Gerente', time: '3h atrás', color: 'bg-primary-50 text-primary-600' },
                        { icon: Award, title: 'Processo Finalizado', desc: 'Beatriz Costa foi aprovada para Fullstack', time: '5h atrás', color: 'bg-amber-50 text-amber-600' },
                      ].map((activity, i) => (
                        <div key={i} className="flex gap-4 group">
                          <div className={`w-10 h-10 rounded-2xl ${activity.color} flex items-center justify-center shrink-0 shadow-sm border border-black/5`}>
                            <activity.icon size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-0.5">
                              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{activity.title}</h4>
                              <span className="text-[8px] font-bold text-slate-300 uppercase shrink-0">{activity.time}</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 truncate leading-tight">{activity.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button className="w-full mt-8 py-4 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-primary-50 hover:text-primary-600 transition-all border border-transparent hover:border-primary-100">
                      Ver Log Completo
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Cadastrar Vagas' && (
              <motion.div 
                key="cadastrar-vaga"
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-[850px] mx-auto bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(124,58,237,0.12)] min-h-[550px] flex flex-col overflow-hidden border border-white"
              >
                {/* Step Header - Compact */}
                <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md">
                      <PlusCircle size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900 tracking-tight">Publicar Vaga</h2>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Passo {registerStep} de 3</p>
                    </div>
                  </div>

                  {/* Step Progress - More subtle */}
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                          registerStep === step 
                            ? 'bg-primary-600 text-white shadow-md' 
                            : registerStep > step 
                              ? 'bg-emerald-500 text-white' 
                              : 'bg-slate-200 text-slate-400'
                        }`}>
                          {registerStep > step ? <Check size={12} /> : step}
                        </div>
                        {step < 3 && (
                          <div className={`w-6 h-0.5 mx-0.5 rounded-full ${registerStep > step ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-1 p-8 overflow-y-auto">
                    <AnimatePresence mode="wait">
                      {registerStep === 1 && (
                        <motion.div 
                          key="step1"
                          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                          className="space-y-6"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="col-span-full">
                              <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block pl-4">Título da Vaga</label>
                              <input 
                                type="text" 
                                value={vacancyForm.title}
                                onChange={(e) => setVacancyForm({ ...vacancyForm, title: e.target.value })}
                                placeholder="Ex: Desenvolvedor React Sênior" 
                                className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all text-slate-900 font-medium text-sm" 
                              />
                            </div>

                            <div>
                              <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block pl-4">Modalidade</label>
                              <div className="relative">
                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <select 
                                  value={vacancyForm.modality}
                                  onChange={(e) => setVacancyForm({ ...vacancyForm, modality: e.target.value as any })}
                                  className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all text-slate-900 font-medium text-sm appearance-none"
                                >
                                  <option value="Presencial">Presencial</option>
                                  <option value="Home Office">Home Office</option>
                                </select>
                              </div>
                            </div>

                            {vacancyForm.modality === 'Presencial' && (
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block pl-4">Estado</label>
                                  <div className="relative">
                                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    <select 
                                      className="w-full px-4 py-3.5 bg-slate-50 border border-transparent rounded-xl font-medium text-sm outline-none focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all appearance-none"
                                      value={vacancyForm.state}
                                      onChange={(e) => setVacancyForm({...vacancyForm, state: e.target.value, city: ''})}
                                    >
                                      <option value="">UF</option>
                                      {BRAZIL_STATES.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                                    </select>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block pl-4">Cidade</label>
                                  <div className="relative">
                                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    <select 
                                      className="w-full px-4 py-3.5 bg-slate-50 border border-transparent rounded-xl font-medium text-sm outline-none focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all appearance-none disabled:opacity-50"
                                      value={vacancyForm.city}
                                      onChange={(e) => setVacancyForm({...vacancyForm, city: e.target.value})}
                                      disabled={isLoadingCities || !cities.length}
                                    >
                                      <option value="">{isLoadingCities ? 'Buscando...' : 'Cidade'}</option>
                                      {cities.map(city => <option key={city} value={city}>{city}</option>)}
                                    </select>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div>
                              <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block pl-4">Remuneração</label>
                              <div className="relative">
                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <select 
                                  value={vacancyForm.remunerationType}
                                  onChange={(e) => setVacancyForm({ ...vacancyForm, remunerationType: e.target.value as any })}
                                  className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl font-medium text-sm outline-none focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all appearance-none"
                                >
                                  <option>Mensal</option>
                                  <option>Comissionado</option>
                                  <option>Diária</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block pl-4">Salário Proposto</label>
                              <div className="space-y-3">
                                <div className="relative">
                                  <input 
                                    type="text" 
                                    value={vacancyForm.salary}
                                    onChange={handleSalaryChange}
                                    placeholder="R$ 0,00" 
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all text-slate-900 font-bold text-sm" 
                                  />
                                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white/80 px-2 py-1 rounded-lg">
                                    <span className="text-[8px] font-black text-slate-400 uppercase">Extra?</span>
                                    <input 
                                      type="checkbox" 
                                      checked={vacancyForm.hasBonus}
                                      onChange={(e) => setVacancyForm({...vacancyForm, hasBonus: e.target.checked})}
                                      className="w-4 h-4 rounded text-primary-600 cursor-pointer"
                                    />
                                  </div>
                                </div>

                                {vacancyForm.hasBonus && (
                                  <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2">
                                    <div className="relative">
                                      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                      <select 
                                        value={vacancyForm.bonusType}
                                        onChange={(e) => setVacancyForm({...vacancyForm, bonusType: e.target.value})}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase outline-none focus:border-primary-300 appearance-none pl-3 pr-8"
                                      >
                                        <option value="Comissão">Comissão</option>
                                        <option value="Premiação">Premiação</option>
                                      </select>
                                    </div>
                                    <input 
                                      type="text" 
                                      placeholder="Valor Médio"
                                      value={vacancyForm.bonusValue}
                                      onChange={(e) => setVacancyForm({...vacancyForm, bonusValue: e.target.value})}
                                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold outline-none focus:border-primary-300"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block pl-4">Contratação</label>
                              <div className="relative">
                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <select 
                                  value={vacancyForm.contractType}
                                  onChange={(e) => setVacancyForm({ ...vacancyForm, contractType: e.target.value as any })}
                                  className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl font-medium text-sm outline-none focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all appearance-none"
                                >
                                  <option>CLT</option>
                                  <option>PJ</option>
                                  <option>Estágio</option>
                                  <option>Autônomo</option>
                                  <option>Meio Período</option>
                                  <option>Temporário</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block pl-4">Escala</label>
                              <div className="relative">
                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <select 
                                  value={vacancyForm.workSchedule}
                                  onChange={(e) => setVacancyForm({ ...vacancyForm, workSchedule: e.target.value as any })}
                                  className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl font-medium text-sm outline-none focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all appearance-none"
                                >
                                  <option>5x2</option>
                                  <option>6x1</option>
                                  <option>12x36</option>
                                </select>
                              </div>
                            </div>

                            <div className="col-span-full bg-slate-50/50 p-5 rounded-3xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                              <div>
                                <label className="flex items-center gap-4 cursor-pointer group">
                                  <div className={`w-11 h-5.5 rounded-full relative transition-all duration-300 ${vacancyForm.isFirstJob ? 'bg-primary-600' : 'bg-slate-200'}`}>
                                    <div className={`absolute top-0.75 left-0.75 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${vacancyForm.isFirstJob ? 'translate-x-5.5' : ''}`} />
                                    <input 
                                      type="checkbox" 
                                      className="hidden" 
                                      checked={vacancyForm.isFirstJob} 
                                      onChange={(e) => setVacancyForm({...vacancyForm, isFirstJob: e.target.checked})} 
                                    />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-tight">Oportunidade 1º Emprego</span>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">Ideal para quem busca começar</span>
                                  </div>
                                </label>
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                  <label className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Idade Mínima</label>
                                  <span className="px-2 py-0.5 bg-primary-600 text-white rounded-md text-[10px] font-black">{vacancyForm.minAge} anos</span>
                                </div>
                                <div className="relative">
                                  <input 
                                    type="range" 
                                    min="16" 
                                    max="50" 
                                    value={vacancyForm.minAge}
                                    onChange={(e) => setVacancyForm({...vacancyForm, minAge: parseInt(e.target.value)})}
                                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                  />
                                  <div className="flex justify-between px-1">
                                    <span className="text-[7px] font-bold text-slate-300 uppercase tracking-widest">16 ANOS</span>
                                    <span className="text-[7px] font-bold text-slate-300 uppercase tracking-widest">50 ANOS</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-span-full">
                              <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 block pl-4">Benefícios Oferecidos</label>
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                {[
                                  { id: 'vt', label: 'VT', hasValue: true },
                                  { id: 'va', label: 'VA/VR', hasValue: true },
                                  { id: 'healthInsurance', label: 'SAÚDE', hasValue: false },
                                  { id: 'dentalPlan', label: 'DENTAL', hasValue: false },
                                ].map((ben) => (
                                  <div key={ben.id} className="space-y-2">
                                    <button 
                                      onClick={() => {
                                        if (ben.hasValue) {
                                          setVacancyForm({
                                            ...vacancyForm, 
                                            benefits: { ...vacancyForm.benefits, [ben.id]: { ...((vacancyForm.benefits as any)[ben.id]), selected: !((vacancyForm.benefits as any)[ben.id]).selected } }
                                          });
                                        } else {
                                          setVacancyForm({
                                            ...vacancyForm, 
                                            benefits: { ...vacancyForm.benefits, [ben.id]: !(vacancyForm.benefits as any)[ben.id] }
                                          });
                                        }
                                      }}
                                      className={`w-full py-2.5 px-3 rounded-xl border font-bold text-[10px] uppercase tracking-tighter transition-all ${
                                        (ben.hasValue ? (vacancyForm.benefits as any)[ben.id].selected : (vacancyForm.benefits as any)[ben.id])
                                          ? 'bg-primary-50 border-primary-200 text-primary-700' 
                                          : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'
                                      }`}
                                    >
                                      {ben.label}
                                    </button>
                                    {ben.hasValue && (vacancyForm.benefits as any)[ben.id].selected && (
                                      <input 
                                        type="text" 
                                        placeholder="Valor"
                                        value={(vacancyForm.benefits as any)[ben.id].value}
                                        onChange={(e) => setVacancyForm({
                                          ...vacancyForm, 
                                          benefits: { ...vacancyForm.benefits, [ben.id]: { ...((vacancyForm.benefits as any)[ben.id]), value: e.target.value } }
                                        })}
                                        className="w-full px-3 py-1.5 bg-white border border-slate-100 rounded-lg text-[10px] font-bold outline-none focus:border-primary-300"
                                      />
                                    )}
                                  </div>
                                ))}

                                {vacancyForm.extraBenefits.map((extra, idx) => (
                                  <div key={idx} className="relative group">
                                    <button 
                                      className="w-full py-2.5 px-3 rounded-xl border border-primary-200 bg-primary-50 font-bold text-[10px] uppercase tracking-tighter text-primary-700"
                                    >
                                      {extra}
                                    </button>
                                    <button 
                                      onClick={() => setVacancyForm({...vacancyForm, extraBenefits: vacancyForm.extraBenefits.filter((_, i) => i !== idx)})}
                                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                    >
                                      <CloseIcon size={10} />
                                    </button>
                                  </div>
                                ))}

                                <div className="space-y-2">
                                  <div className="flex gap-1">
                                    <input 
                                      type="text" 
                                      placeholder="Extra..."
                                      value={newBenefit}
                                      onChange={(e) => setNewBenefit(e.target.value.toUpperCase())}
                                      className="w-full px-3 py-2 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-[10px] font-bold outline-none focus:border-primary-300 placeholder:normal-case"
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' && newBenefit.trim()) {
                                          setVacancyForm({...vacancyForm, extraBenefits: [...vacancyForm.extraBenefits, newBenefit.trim()]});
                                          setNewBenefit('');
                                        }
                                      }}
                                    />
                                    {newBenefit && (
                                      <button 
                                        onClick={() => {
                                          setVacancyForm({...vacancyForm, extraBenefits: [...vacancyForm.extraBenefits, newBenefit.trim()]});
                                          setNewBenefit('');
                                        }}
                                        className="p-2 bg-primary-600 text-white rounded-lg"
                                      >
                                        <Plus size={10} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {registerStep === 2 && (
                        <motion.div 
                          key="step2"
                          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                          className="space-y-6"
                        >
                          <div>
                            <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block pl-4">Descrição da Vaga</label>
                            <textarea 
                              rows={6} 
                              value={vacancyForm.description}
                              onChange={(e) => setVacancyForm({...vacancyForm, description: e.target.value})}
                              placeholder="Fale sobre o cargo e a empresa..." 
                              className="w-full px-6 py-5 bg-slate-50 border border-transparent rounded-[1.5rem] outline-none focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all font-medium text-slate-700 text-sm italic leading-relaxed" 
                            />
                          </div>

                          <div className="space-y-4">
                            <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block pl-4">Requisitos</label>
                            
                            <div className="flex flex-wrap gap-2">
                              {commonRequirements.map(req => {
                                const selected = vacancyForm.requirements.includes(req);
                                return (
                                  <button
                                    key={req}
                                    onClick={() => {
                                      if (selected) {
                                        setVacancyForm({...vacancyForm, requirements: vacancyForm.requirements.filter(r => r !== req)});
                                      } else {
                                        setVacancyForm({...vacancyForm, requirements: [...vacancyForm.requirements, req]});
                                      }
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                                      selected 
                                        ? 'bg-primary-600 text-white shadow-sm' 
                                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'
                                    }`}
                                  >
                                    {req}
                                  </button>
                                );
                              })}
                            </div>

                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={newRequirement}
                                onChange={(e) => setNewRequirement(e.target.value)}
                                placeholder="Outro requisito..." 
                                className="flex-1 px-5 py-3 bg-slate-50 border border-transparent rounded-xl font-medium text-sm outline-none focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && newRequirement.trim()) {
                                    setVacancyForm({...vacancyForm, requirements: [...vacancyForm.requirements, newRequirement.trim()]});
                                    setNewRequirement('');
                                  }
                                }}
                              />
                            </div>

                            {vacancyForm.requirements.length > 0 && (
                              <div className="bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200">
                                <div className="flex flex-wrap gap-2">
                                  {vacancyForm.requirements.map((r, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-100 text-[10px] font-bold text-slate-600">
                                      <span>{r}</span>
                                      <button 
                                        onClick={() => setVacancyForm({...vacancyForm, requirements: vacancyForm.requirements.filter((_, idx) => idx !== i)})}
                                        className="text-red-400 hover:text-red-600"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {registerStep === 3 && (
                        <motion.div 
                          key="step3"
                          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                          className="space-y-6"
                        >
                          <div className="text-center mb-4">
                            <h3 className="font-black text-slate-800 tracking-tight">Etapas do Processo</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Personalize o seu funil</p>
                          </div>

                          <div className="space-y-2">
                            {vacancyForm.stages.map((stage, index) => (
                              <div key={index} className="group flex items-center gap-4 bg-slate-50 px-5 py-3.5 rounded-xl border border-transparent hover:border-primary-100 transition-all">
                                <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center font-black text-primary-600 text-xs">
                                  {index + 1}
                                </div>
                                <span className="text-sm font-bold text-slate-700">{stage}</span>
                                <button 
                                  onClick={() => setVacancyForm({...vacancyForm, stages: vacancyForm.stages.filter((_, i) => i !== index)})}
                                  className="ml-auto p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}

                            <div className="flex gap-2 mt-4">
                              <input 
                                type="text" 
                                value={newStage}
                                onChange={(e) => setNewStage(e.target.value)}
                                placeholder="Ex: Dinâmica em Grupo" 
                                className="flex-1 px-5 py-3 bg-white border border-dashed border-slate-200 rounded-xl font-medium text-sm outline-none focus:border-primary-400 focus:border-solid transition-all"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && newStage.trim()) {
                                    setVacancyForm({...vacancyForm, stages: [...vacancyForm.stages, newStage.trim()]});
                                    setNewStage('');
                                  }
                                }}
                              />
                              <button 
                                onClick={() => {
                                  if (newStage.trim()) {
                                    setVacancyForm({...vacancyForm, stages: [...vacancyForm.stages, newStage.trim()]});
                                    setNewStage('');
                                  }
                                }}
                                className="px-5 bg-primary-600 text-white rounded-xl font-black text-[10px] uppercase shadow-md shadow-primary-100"
                              >
                                Add
                              </button>
                            </div>
                          </div>

                          <div className="bg-indigo-50/50 p-5 rounded-[1.5rem] flex gap-3 border border-indigo-100/50">
                            <BarChart3 size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] font-medium text-indigo-900 leading-relaxed italic">
                              Os candidatos serão organizados neste funil de visualização estilo Kanban facilitando a sua gestão.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                </div>

                {/* Footer - Elegant and Compact */}
                <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/30 relative">
                  <AnimatePresence>
                    {errorMessage && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl z-50 flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        {errorMessage}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {registerStep > 1 ? (
                    <button 
                      onClick={() => setRegisterStep(s => s - 1)}
                      className="flex items-center gap-2 px-6 py-3 text-slate-400 hover:text-slate-600 font-black text-[10px] uppercase tracking-widest transition-all"
                    >
                      <ChevronLeft size={14} /> Voltar
                    </button>
                  ) : <div />}

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setActiveTab('Minhas Vagas')}
                      className="px-5 py-3 text-slate-400 hover:text-slate-500 font-bold text-xs"
                    >
                      Descartar
                    </button>
                    {registerStep < 3 ? (
                      <button 
                        onClick={handleNextStep}
                        className="px-8 py-3.5 bg-slate-900 text-white rounded-full font-black text-[10px] uppercase tracking-[0.15em] shadow-lg hover:-translate-y-0.5 transition-all"
                      >
                        Próximo
                      </button>
                    ) : (
                      <button 
                        onClick={handlePublish}
                        className="px-10 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full font-black text-[10px] uppercase tracking-[0.15em] shadow-lg shadow-emerald-200 hover:-translate-y-0.5 transition-all"
                      >
                        Publicar Agora
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Minhas Vagas' && selectedJob === null && (
              <motion.div 
                key="minhas-vagas-grid"
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {isFetchingJobs ? (
                  <div className="text-center py-20">
                    <Activity className="animate-spin mx-auto text-primary-600 mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Carregando suas vagas...</p>
                  </div>
                ) : jobs.length > 0 ? (
                  jobs.map((job, i) => (
                    <div 
                      key={job.id || i} 
                      className="bg-white p-5 rounded-[5px] shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-[5px] flex items-center justify-center text-slate-400 border border-slate-100/50">
                          <Briefcase size={20} />
                        </div>
                        <div>
                          <h4 
                            onClick={() => handleViewApplicants(job)}
                            className="font-bold text-slate-900 hover:text-[#533af6] cursor-pointer transition-colors uppercase tracking-tight text-sm select-none"
                          >
                            {job.title}
                          </h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {job.created_at ? new Date(job.created_at).toLocaleDateString('pt-BR') : 'Recentemente'} • {job.modality}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-10">
                        <div className="text-center">
                          <p className="text-xl font-black text-slate-900">{job.candidates_count || 0}</p>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Inscritos</p>
                        </div>
                        {(() => {
                          const status = job.status || 'active';
                          let colorClasses = 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/50';
                          if (status === 'paused') colorClasses = 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/50';
                          else if (status === 'closed') colorClasses = 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200/50';
                          return (
                            <select
                              value={status}
                              onChange={(e) => handleUpdateJobStatus(job.id, e.target.value)}
                              className={`${colorClasses} px-2.5 py-1.5 rounded-[5px] text-[9.5px] font-black uppercase tracking-widest border outline-none cursor-pointer transition-all`}
                            >
                              <option value="active" className="bg-white text-slate-700 font-bold">Ativa</option>
                              <option value="paused" className="bg-white text-slate-700 font-bold">Pausada</option>
                              <option value="closed" className="bg-white text-slate-700 font-bold">Encerrada</option>
                            </select>
                          );
                        })()}
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleViewApplicants(job)}
                            className="p-2 bg-slate-50 text-slate-500 hover:text-[#533af6] hover:bg-slate-100 rounded-[5px] border border-slate-100/60 transition-all cursor-pointer"
                            title="Ver candidatos e triagem"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => handleShareJob(job)}
                            className="p-2 bg-slate-50 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-[5px] border border-slate-100/60 transition-all cursor-pointer"
                            title="Compartilhar vaga"
                          >
                            <Share2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-20 rounded-[5px] text-center border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 border border-slate-100/50">
                      <Briefcase size={32} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-1">Nenhuma vaga publicada</h3>
                    <p className="text-slate-400 text-xs max-w-sm mx-auto mb-6 font-semibold">Você ainda não criou nenhuma oportunidade. Comece a contratar agora mesmo!</p>
                    <button 
                      onClick={() => setActiveTab('Cadastrar Vagas')}
                      className="px-6 py-3 bg-[#533af6] hover:bg-[#4326e5] text-white rounded-[5px] font-black text-[10px] uppercase tracking-widest shadow-md transition-all cursor-pointer"
                    >
                      Publicar Primeira Vaga
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'Banco de Talentos' && (
              <motion.div 
                key="banco-talentos"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* AI Integrated Search Input */}
                <div className="bg-white p-2 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col md:flex-row items-stretch gap-2">
                  <div className="flex-1 relative flex items-center bg-slate-50 rounded-[2rem] px-6 py-2">
                    {isAiSearching ? (
                      <Cpu size={20} className="text-primary-600 animate-spin mr-3 shrink-0" />
                    ) : (
                      <BrainCircuit size={20} className="text-primary-600 mr-3 shrink-0" />
                    )}
                    <textarea 
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Busca Inteligente por IA: Descreva o perfil ideal do candidato que você procura..."
                      className="w-full bg-transparent border-none outline-none text-sm font-bold text-slate-700 placeholder:text-slate-400 py-3 resize-none h-12 flex items-center leading-tight"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAiSearch();
                        }
                      }}
                    />
                    {aiPrompt && !isAiSearching && (
                      <button 
                        onClick={() => setAiPrompt('')}
                        className="p-2 text-slate-300 hover:text-slate-500 transition-colors"
                      >
                        <CloseIcon size={16} />
                      </button>
                    )}
                  </div>
                  <button 
                    onClick={handleAiSearch}
                    disabled={isAiSearching || !aiPrompt.trim()}
                    className="md:w-56 bg-gradient-to-r from-slate-900 to-indigo-900 hover:from-slate-800 hover:to-indigo-800 disabled:opacity-50 text-white rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shrink-0 py-4 md:py-0 shadow-lg shadow-indigo-100"
                  >
                    {isAiSearching ? 'Analisando Base...' : (
                      <>Puxar Melhores Talentos <Zap size={14} /></>
                    )}
                  </button>
                </div>

                {/* Filters - Now horizontal and below the search */}
                <div className="bg-white p-8 rounded-[3rem] shadow-sleek border border-slate-100/50">
                  <div 
                    className="flex items-center justify-between cursor-pointer group"
                    onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 group-hover:bg-primary-100 transition-colors">
                        <Filter size={18} />
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] leading-tight">Filtros de Especialidade</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Refine sua busca manual</p>
                      </div>
                    </div>
                    <div className={`p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:text-slate-600 transition-all duration-300 ${isFiltersVisible ? 'rotate-180' : ''}`}>
                      <ChevronDown size={20} />
                    </div>
                  </div>
 
                  <AnimatePresence>
                    {isFiltersVisible && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: 'auto', opacity: 1, marginTop: 32 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-6">
                          {/* Linha 1: Cargo e Escolaridade */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5 block pl-1">Cargo Desejado</label>
                              <input 
                                type="text" 
                                value={talentFilters.role}
                                onChange={(e) => setTalentFilters({...talentFilters, role: e.target.value})}
                                placeholder="Ex: Gerente de Vendas" 
                                className="w-full px-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-primary-200 outline-none transition-all"
                              />
                            </div>
 
                            <div>
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5 block pl-1">Escolaridade</label>
                              <div className="relative">
                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                <select 
                                  value={talentFilters.education}
                                  onChange={(e) => setTalentFilters({...talentFilters, education: e.target.value})}
                                  className="w-full px-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl text-[10px] font-bold focus:bg-white focus:border-primary-200 outline-none transition-all appearance-none"
                                >
                                  <option value="">Qualquer Nível</option>
                                  <option value="Ensino Médio Cursando">Ensino Médio Cursando</option>
                                  <option value="Ensino Médio Completo">Ensino Médio Completo</option>
                                  <option value="Superior Cursando">Superior Cursando</option>
                                  <option value="Ensino Superior Completo">Ensino Superior Completo</option>
                                  <option value="Pós-graduação">Pós-graduação</option>
                                </select>
                              </div>
                            </div>
                          </div>
 
                          {/* Linha 2: Sênioridade, Localização, Idade e Pretensão */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5 block pl-1">Sênioridade</label>
                              <div className="relative">
                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                <select 
                                  value={talentFilters.experience}
                                  onChange={(e) => setTalentFilters({...talentFilters, experience: e.target.value})}
                                  className="w-full px-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl text-[10px] font-bold focus:bg-white focus:border-primary-200 outline-none transition-all appearance-none"
                                >
                                  <option value="">Qualquer</option>
                                  <option value="Estágio">Estágio</option>
                                  <option value="Júnior">Júnior</option>
                                  <option value="Pleno">Pleno</option>
                                  <option value="Sênior">Sênior</option>
                                  <option value="Especialista">Especialista</option>
                                </select>
                              </div>
                            </div>
 
                            <div>
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5 block pl-1">Localização</label>
                              <div className="grid grid-cols-5 gap-2">
                                <select 
                                  value={talentFilters.state}
                                  onChange={(e) => setTalentFilters({...talentFilters, state: e.target.value, city: ''})}
                                  className="col-span-2 px-2 py-3.5 bg-slate-50 border border-transparent rounded-2xl text-[10px] font-bold focus:bg-white focus:border-primary-200 outline-none transition-all appearance-none text-center"
                                >
                                  <option value="">UF</option>
                                  {BRAZIL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <select 
                                  value={talentFilters.city}
                                  onChange={(e) => setTalentFilters({...talentFilters, city: e.target.value})}
                                  disabled={!talentFilters.state || isTalentLoadingCities}
                                  className="col-span-3 px-3 py-3.5 bg-slate-50 border border-transparent rounded-2xl text-[10px] font-bold focus:bg-white focus:border-primary-200 outline-none transition-all appearance-none disabled:opacity-50"
                                >
                                  <option value="">{isTalentLoadingCities ? '...' : 'Cidade'}</option>
                                  {talentCities.map(city => <option key={city} value={city}>{city}</option>)}
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5 block pl-1">Pretensão Salarial</label>
                              <input 
                                type="text" 
                                value={talentFilters.salary}
                                onChange={(e) => setTalentFilters({...talentFilters, salary: e.target.value})}
                                placeholder="Ex: 5000" 
                                className="w-full px-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-primary-200 outline-none transition-all shadow-sm"
                              />
                            </div>
 
                            <div>
                              <div className="flex justify-between items-center mb-2.5">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Idade Mínima</label>
                                <span className="text-[10px] font-black text-primary-600">{talentFilters.minAge} anos</span>
                              </div>
                              <input 
                                type="range" 
                                min="16" 
                                max="60" 
                                value={talentFilters.minAge}
                                onChange={(e) => setTalentFilters({...talentFilters, minAge: parseInt(e.target.value)})}
                                className="w-full h-1 bg-slate-100 rounded-full appearance-none accent-primary-600 cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>
 
                        <div className="mt-8 pt-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
                          <div className="flex flex-wrap gap-4">
                            {['Presencial', 'Híbrido', 'Remoto'].map(mod => (
                              <button
                                key={mod}
                                onClick={() => setTalentFilters({...talentFilters, modality: talentFilters.modality === mod ? '' : mod})}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                  talentFilters.modality === mod 
                                    ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
                                    : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
                                }`}
                              >
                                {mod === 'Remoto' ? <Cpu size={14} /> : mod === 'Híbrido' ? <Zap size={14} /> : <MapPin size={14} />}
                                {mod}
                              </button>
                            ))}
 
                            <button
                              onClick={() => setTalentFilters({...talentFilters, first_job: !talentFilters.first_job})}
                              className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                talentFilters.first_job 
                                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100' 
                                  : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
                              }`}
                            >
                              Primeiro Emprego
                            </button>
                          </div>
 
                          <button 
                            onClick={() => setTalentFilters({ role: '', minAge: 16, maxAge: 60, city: '', state: '', first_job: false, education: '', experience: '', modality: '', salary: '' })}
                            className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-red-500 transition-colors flex items-center gap-2"
                          >
                            Limpar Filtros <CloseIcon size={14} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Candidate Results Summary Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shrink-0" />
                    <p className="text-xs font-black text-slate-700 uppercase tracking-[0.1em]">
                      {filteredTalents.length} {filteredTalents.length === 1 ? 'Candidato qualificado encontrado' : 'Candidatos qualificados encontrados'}
                    </p>
                  </div>

                  {/* Barra de Pesquisa e Filtros à direita */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <div className="flex bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm w-full max-w-sm shrink-0">
                      <Search size={16} className="text-slate-300 mr-2 shrink-0" />
                      <input 
                        type="text" 
                        placeholder="Pesquisar resultados..." 
                        value={talentSearch}
                        onChange={(e) => setTalentSearch(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-[10px] font-black text-slate-900 placeholder:text-slate-300 uppercase"
                      />
                    </div>
                    
                    {/* Botão de Filtros lateral no canto superior direito do conteúdo do Banco de Talentos */}
                    <button
                      type="button"
                      onClick={() => setIsFilterSidebarOpen(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 rounded-2xl transition-all active:scale-95 shadow-sm shrink-0 cursor-pointer text-xs font-bold font-sans"
                    >
                      <Filter size={13} className="text-slate-500" />
                      <span>Filtros</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTalents.length > 0 ? (
                    filteredTalents.map(talent => (
                      <motion.div 
                        key={talent.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[5px] border border-slate-100 hover:border-slate-200/80 shadow-sleek p-5 hover:shadow-md transition-all relative group text-left flex flex-col justify-between h-full"
                      >
                        <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
                          <BrainCircuit size={80} />
                        </div>

                        <div>
                          {/* Cabeçalho do Candidato */}
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-12 h-12 bg-slate-50 border border-slate-200/60 rounded-[5px] flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                              {talent.profile_pic ? (
                                <img src={talent.profile_pic} alt={talent.name} className="w-full h-full object-cover" />
                              ) : (
                                <User size={24} className="text-slate-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight truncate leading-tight">{talent.name}</h4>
                                {talent.first_job && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />}
                              </div>
                              <p className="text-[9.5px] font-black text-[#533af6] uppercase tracking-wider mt-0.5">{talent.role}</p>
                              <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 mt-1">
                                <MapPin size={10} className="text-slate-350 shrink-0" />
                                <span className="truncate">{talent.city}, {talent.state}</span>
                                <span>•</span>
                                <span>{talent.age || calculateAge(talent.birth_date)} anos</span>
                              </div>
                            </div>
                          </div>

                          {/* Detalhes Rápidos de Contratação */}
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="bg-slate-50/50 p-2 rounded-[5px] border border-slate-100/50">
                              <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 opacity-60">Sexo</p>
                              <p className="text-[9.5px] font-black text-slate-700 uppercase tracking-tight truncate">{talent.gender || 'Não Inf.'}</p>
                            </div>
                            <div className="bg-slate-50/50 p-2 rounded-[5px] border border-slate-100/50">
                              <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 opacity-60">Pretensão</p>
                              <p className="text-[9.5px] font-black text-slate-700 uppercase tracking-tight truncate">{talent.salary || 'Não Inf.'}</p>
                            </div>
                          </div>

                          {/* Resumo Profissional estilo chat bubble */}
                          {talent.summary ? (
                            <div className="bg-slate-50/50 p-3 rounded-[5px] border border-slate-100 text-left relative mb-4">
                              <h5 className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider mb-1">Resumo Profissional</h5>
                              <p className="text-[9.5px] font-semibold text-slate-500 leading-relaxed italic text-justify line-clamp-2">
                                "{talent.summary}"
                              </p>
                            </div>
                          ) : null}

                          {/* Competências */}
                          {Array.isArray(talent.skills) && talent.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {talent.skills.slice(0, 4).map((skill, sIdx) => (
                                <span 
                                  key={sIdx} 
                                  className="px-1.5 py-0.5 rounded-[3px] text-[7.5px] font-black uppercase tracking-wider bg-slate-50 text-slate-500 border border-slate-100/50 select-none"
                                >
                                  {skill}
                                </span>
                              ))}
                              {talent.skills.length > 4 && (
                                <span className="px-1.5 py-0.5 rounded-[3px] text-[7.5px] font-black text-slate-355 bg-slate-50 border border-slate-100/50 select-none">
                                  +{talent.skills.length - 4}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Rodapé do Card com Contatos Individuais e Ações */}
                        <div>
                          <div className="pt-3 border-t border-slate-50 space-y-1.5 mb-4">
                            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-450 truncate">
                              <Mail size={11} className="text-slate-350 shrink-0" />
                              <span>{talent.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-450">
                              <Phone size={11} className="text-slate-350 shrink-0" />
                              <span>{talent.phone}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button 
                              type="button"
                              onClick={() => {
                                setSelectedResumeApplicant({
                                  id: talent.id,
                                  candidate_name: talent.name,
                                  candidate_email: talent.email,
                                  candidate_phone: talent.phone,
                                  city: talent.city,
                                  state: talent.state,
                                  profile_pic: talent.profile_pic,
                                  talentMatched: {
                                    birth_date: talent.birth_date,
                                    age: talent.age,
                                    skills: talent.skills,
                                    summary: talent.summary,
                                    experiences: talent.experiences || [],
                                    educations: talent.educations || []
                                  }
                                });
                              }}
                              className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-[5px] text-[8.5px] font-black uppercase tracking-widest transition-all cursor-pointer"
                            >
                              Currículo
                            </button>
                            {(() => {
                              const cleanPhone = talent.phone ? talent.phone.replace(/\D/g, '') : '';
                              const whatsappUrl = `https://api.whatsapp.com/send?phone=55${cleanPhone}&text=Olá%20${encodeURIComponent(talent.name)},%20gostamos%20do%20seu%20perfil%20na%20Colaborh!`;
                              return (
                                <a 
                                  href={whatsappUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-10 h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[5px] flex items-center justify-center transition-all border border-emerald-600 shadow-sm cursor-pointer shrink-0"
                                >
                                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                                    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.982L2 22l5.233-1.371a9.994 9.994 0 0 0 4.779 1.205h.004c5.505 0 9.988-4.479 9.99-9.985a9.983 9.983 0 0 0-9.994-9.849zm4.987 14.111c-.273.767-1.345 1.4-1.887 1.49-.49.08-1.129.13-3.268-.744-2.734-1.12-4.5-3.88-4.637-4.06-.137-.18-1.109-1.47-1.109-2.81 0-1.34.702-1.99.953-2.25.25-.26.55-.33.733-.33h.523c.16 0 .373-.06.58.45.22.53.73 1.77.8 1.91.07.14.11.31.02.49-.09.18-.14.28-.27.44-.13.16-.28.36-.39.49-.13.13-.26.27-.11.53.15.26.66 1.09 1.42 1.76.98.87 1.8 1.14 2.06 1.27.26.13.41.11.56-.05.15-.17.65-.76.83-.98.18-.22.37-.18.62-.09s1.6.76 1.87.9.46.26.52.37c.07.11.07.65-.2 1.41z"/>
                                  </svg>
                                </a>
                              );
                            })()}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-32 bg-white rounded-[3rem] shadow-sleek border border-dashed border-slate-200 flex flex-col items-center justify-center text-center px-10">
                       <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-8 overflow-hidden relative">
                          <div className="absolute inset-0 bg-primary-100/20 animate-pulse" />
                          <Search size={48} />
                       </div>
                       <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Nenhuma correspondência exata</h4>
                       <p className="text-slate-400 text-sm font-medium max-w-sm mx-auto leading-relaxed">
                          Tente usar a <span className="text-primary-600 font-bold uppercase text-xs">Busca por IA</span> acima descrevendo as competências que você precisa nos currículos.
                       </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'Empresas' && (
              <motion.div 
                key="empresas"
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.98 }}
                className="max-w-3xl mx-auto space-y-6 text-left"
              >
                {/* Cabeçalho de informações da Empresa Selecionada ou Criação */}
                <div className="bg-white p-6 rounded-[5px] border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#533af6]/10 rounded-[5px] flex items-center justify-center text-[#533af6] shrink-0 overflow-hidden">
                      {companyForm.logo ? (
                        <img src={companyForm.logo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <Building size={24} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 tracking-tight leading-snug">
                        {selectedCompanyId === 'new' ? 'Nova Empresa Parceira' : companyForm.nomeFantasia || 'Empresa Parceira'}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                        {selectedCompanyId === 'new' ? 'Cadastre uma nova conta de recrutamento no sistema' : 'Editar dados cadastrais e configurações'}
                      </p>
                    </div>
                  </div>

                  {selectedCompanyId !== 'new' && selectedCompanyId !== '1' && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteCompany(selectedCompanyId, e)}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-[5px] font-black text-[9.5px] uppercase tracking-wider flex items-center gap-1.5 transition-all border border-red-200/40 cursor-pointer active:scale-95 shrink-0"
                    >
                      <Trash2 size={12} /> Excluir Empresa
                    </button>
                  )}
                </div>

                {/* Formulário integrado */}
                <div className="bg-white p-8 rounded-[5px] border border-slate-100 shadow-sm space-y-6">
                  {/* Logo Upload */}
                  <div className="flex items-center gap-5 bg-slate-50 p-5 rounded-[5px] border border-dashed border-slate-200/80">
                    <div className="w-16 h-16 rounded-[5px] bg-white border border-slate-200 overflow-hidden flex items-center justify-center text-slate-450 relative shrink-0">
                      {companyForm.logo ? (
                        <img src={companyForm.logo} alt="Preview Logo" className="w-full h-full object-cover" />
                      ) : (
                        <Upload size={20} />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <label className="text-[10px] font-black text-slate-800 uppercase tracking-wider block mb-1">Logotipo corporativo</label>
                      <p className="text-[9px] font-semibold text-slate-450 mb-2 leading-tight">Escolha uma imagem para personalizar os relatórios e vagas da empresa.</p>
                      <div className="flex gap-2">
                        <label className="px-3.5 py-1.5 bg-[#533af6] hover:bg-[#4326e5] text-white font-extrabold text-[9px] uppercase tracking-widest rounded-[5px] transition-all cursor-pointer inline-block active:scale-95 shadow-sm shadow-[#533af6]/10 border-0">
                          Escolher Arquivo
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleLogoChange}
                            className="hidden" 
                          />
                        </label>
                        {companyForm.logo && (
                          <button
                            type="button"
                            onClick={() => setCompanyForm(prev => ({ ...prev, logo: '' }))}
                            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-100 font-extrabold text-[9px] uppercase tracking-widest rounded-[5px] transition-all cursor-pointer"
                          >
                            Remover
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 block pl-2">Razão Social</label>
                      <input 
                        type="text" 
                        value={companyForm.razaoSocial}
                        onChange={(e) => setCompanyForm({...companyForm, razaoSocial: e.target.value})}
                        placeholder="Ex: Empresa de Servicos LTDA" 
                        className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-[5px] outline-none focus:bg-white focus:border-[#533af6] focus:ring-4 focus:ring-[#533af6]/10 transition-all font-bold text-slate-700 text-xs" 
                      />
                    </div>
                    
                    <div>
                      <label className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 block pl-2">Nome Fantasia</label>
                      <input 
                        type="text" 
                        value={companyForm.nomeFantasia}
                        onChange={(e) => setCompanyForm({...companyForm, nomeFantasia: e.target.value})}
                        placeholder="Ex: Minha Empresa" 
                        className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-[5px] outline-none focus:bg-white focus:border-[#533af6] focus:ring-4 focus:ring-[#533af6]/10 transition-all font-bold text-slate-700 text-xs" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 block pl-2">Solicitante / Responsável</label>
                      <input 
                        type="text" 
                        value={companyForm.solicitante}
                        onChange={(e) => setCompanyForm({...companyForm, solicitante: e.target.value})}
                        placeholder="Nome do Responsável" 
                        className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-[5px] outline-none focus:bg-white focus:border-[#533af6] focus:ring-4 focus:ring-[#533af6]/10 transition-all font-bold text-slate-700 text-xs" 
                      />
                    </div>
                    <div>
                      <label className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 block pl-2">Setor / Ramo de Atuação</label>
                      <input 
                        type="text" 
                        value={companyForm.sector}
                        onChange={(e) => setCompanyForm({...companyForm, sector: e.target.value})}
                        placeholder="Ex: Tecnologia" 
                        className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-[5px] outline-none focus:bg-white focus:border-[#533af6] focus:ring-4 focus:ring-[#533af6]/10 transition-all font-bold text-slate-700 text-xs" 
                      />
                    </div>
                  </div>

                  {/* Ações Finais do Formulário */}
                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    {selectedCompanyId === 'new' && (
                      <button 
                        type="button"
                        onClick={() => {
                          if (companies.length > 0) {
                            setSelectedCompanyId(companies[0].id);
                          }
                        }}
                        className="px-6 py-3 bg-slate-50 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-[5px] hover:bg-slate-100 transition-all border border-slate-200/50 cursor-pointer"
                      >
                        Cancelar
                      </button>
                    )}
                    <button 
                      type="button"
                      onClick={handleRegisterCompany}
                      className="px-8 py-3 bg-[#533af6] hover:bg-[#4326e5] text-white font-black text-[10px] uppercase tracking-widest rounded-[5px] shadow-xl shadow-[#533af6]/10 hover:-translate-y-0.5 transition-all border-0 cursor-pointer"
                    >
                      {selectedCompanyId === 'new' ? 'Salvar Empresa' : 'Salvar Alterações'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
            {activeTab === 'Avaliações' && (
              <motion.div
                key="avaliacoes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 text-left"
              >
                {/* Menu de Sub-abas */}
                <div className="flex border-b border-slate-100 bg-slate-50/50 p-1.5 rounded-2xl gap-2 overflow-x-auto no-scrollbar mb-6 shrink-0">
                  <button
                    type="button"
                    onClick={() => setResultsSubTab('relatorios')}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all flex-1 text-center cursor-pointer ${
                      resultsSubTab === 'relatorios'
                        ? 'bg-white text-slate-900 shadow-md border border-slate-100/50'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    style={resultsSubTab === 'relatorios' ? { borderLeft: '3px solid #533af6' } : {}}
                  >
                    Relatórios de Candidatos
                  </button>
                  <button
                    type="button"
                    onClick={() => setResultsSubTab('guia')}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all flex-1 text-center cursor-pointer ${
                      resultsSubTab === 'guia'
                        ? 'bg-white text-slate-900 shadow-md border border-slate-100/50'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    style={resultsSubTab === 'guia' ? { borderLeft: '3px solid #533af6' } : {}}
                  >
                    Guia de Testes
                  </button>
                  <button
                    type="button"
                    onClick={() => setResultsSubTab('criar')}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all flex-1 text-center cursor-pointer ${
                      resultsSubTab === 'criar'
                        ? 'bg-white text-slate-900 shadow-md border border-slate-100/50'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    style={resultsSubTab === 'criar' ? { borderLeft: '3px solid #533af6' } : {}}
                  >
                    Criar Questionário Customizado
                  </button>
                </div>

                {isFetchingCompanyApps ? (
                  <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] shadow-sleek">
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                      <Loader2 size={32} className="text-primary-600 animate-spin" />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Carregando relatórios...</p>
                  </div>
                ) : (() => {
                  // --- SUB-ABA 1: RELATÓRIOS ---
                  if (resultsSubTab === 'relatorios') {
                    const candidatesWithTests = companyApplications.map(app => {
                      const phoneStr = app.candidate_phone || '';
                      const parsedData = parseCandidatePhoneData(phoneStr);
                      const job = jobs.find(j => j.id === app.job_id);

                      // Parse DISC
                      let discStatus = 'NONE';
                      let discScores = [0, 0, 0, 0];
                      if (parsedData.disc) {
                        if (parsedData.disc === 'PENDING') discStatus = 'PENDING';
                        else if (parsedData.disc.startsWith('COMPLETED===')) {
                          discStatus = 'COMPLETED';
                          discScores = parsedData.disc.replace('COMPLETED===', '').split(',').map(Number);
                        }
                      }

                      // Parse MBTI
                      let mbtiStatus = 'NONE';
                      let mbtiData = null;
                      if (parsedData.mbti) {
                        if (parsedData.mbti === 'PENDING') mbtiStatus = 'PENDING';
                        else if (parsedData.mbti.startsWith('COMPLETED===')) {
                          mbtiStatus = 'COMPLETED';
                          try {
                            mbtiData = JSON.parse(parsedData.mbti.replace('COMPLETED===', '').trim());
                          } catch (e) {}
                        }
                      }

                      // Parse Mapeamento de Perfil (Questions)
                      let questionsStatus = 'NONE';
                      let questionsResponses = null;
                      if (parsedData.questions) {
                        if (parsedData.questions === 'PENDING') questionsStatus = 'PENDING';
                        else if (parsedData.questions.startsWith('COMPLETED===')) {
                          questionsStatus = 'COMPLETED';
                          try {
                            questionsResponses = JSON.parse(parsedData.questions.replace('COMPLETED===', '').trim());
                          } catch (e) {}
                        }
                      }

                      // Parse Temperamentos
                      let temperamentosStatus = 'NONE';
                      let temperamentosData = null;
                      if (parsedData.temperamentos) {
                        if (parsedData.temperamentos === 'PENDING') temperamentosStatus = 'PENDING';
                        else if (parsedData.temperamentos.startsWith('COMPLETED===')) {
                          temperamentosStatus = 'COMPLETED';
                          try {
                            temperamentosData = JSON.parse(parsedData.temperamentos.replace('COMPLETED===', '').trim());
                          } catch (e) {}
                        }
                      }

                      // Parse Custom Test
                      let customTestStatus = 'NONE';
                      let customTestData = null;
                      if (parsedData.customTest) {
                        if (parsedData.customTest === 'PENDING') customTestStatus = 'PENDING';
                        else if (parsedData.customTest.startsWith('COMPLETED===')) {
                          customTestStatus = 'COMPLETED';
                          try {
                            customTestData = JSON.parse(parsedData.customTest.replace('COMPLETED===', '').trim());
                          } catch (e) {}
                        }
                      }

                      return {
                        ...app,
                        job,
                        discStatus,
                        discScores,
                        mbtiStatus,
                        mbtiData,
                        questionsStatus,
                        questionsResponses,
                        temperamentosStatus,
                        temperamentosData,
                        customTestStatus,
                        customTestData
                      };
                    }).filter(c => 
                      c.discStatus !== 'NONE' || 
                      c.mbtiStatus !== 'NONE' || 
                      c.questionsStatus !== 'NONE' || 
                      c.temperamentosStatus !== 'NONE' ||
                      c.customTestStatus !== 'NONE'
                    );

                    if (candidatesWithTests.length === 0) {
                      return (
                        <div className="bg-white p-16 rounded-[3rem] text-center border border-dashed border-slate-200 max-w-xl mx-auto shadow-sm">
                          <Award className="mx-auto text-slate-300 mb-6" size={44} />
                          <h3 className="text-lg font-black text-slate-900 mb-2">Nenhum Teste Iniciado</h3>
                          <p className="text-slate-500 font-medium text-xs leading-relaxed mb-6">
                            Nenhum candidato desta empresa possui solicitações ou respostas de testes no momento.
                          </p>
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left text-xs font-semibold text-slate-500">
                            <p className="font-bold text-slate-700 uppercase text-[9px] tracking-wider mb-1.5 font-sans">Como solicitar?</p>
                            Acesse o painel <strong>Minhas Vagas</strong>, clique em <strong>Ver Candidatos (Kanban)</strong> em alguma vaga, mova o candidato para a etapa de <strong>Testes</strong> e solicite o teste correspondente.
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div className="bg-white p-8 rounded-[3rem] shadow-sleek border border-white space-y-6">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                              <tr className="border-b border-slate-100">
                                <th className="pb-4 font-black text-slate-400 uppercase tracking-widest text-[9px] w-[20%]">Candidato</th>
                                <th className="pb-4 font-black text-slate-400 uppercase tracking-widest text-[9px] w-[15%]">Vaga</th>
                                <th className="pb-4 font-black text-slate-400 uppercase tracking-widest text-[9px] text-center">DISC</th>
                                <th className="pb-4 font-black text-slate-400 uppercase tracking-widest text-[9px] text-center">MBTI</th>
                                <th className="pb-4 font-black text-slate-400 uppercase tracking-widest text-[9px] text-center">Mapeamento</th>
                                <th className="pb-4 font-black text-slate-400 uppercase tracking-widest text-[9px] text-center">Temperamentos</th>
                                <th className="pb-4 font-black text-slate-400 uppercase tracking-widest text-[9px] text-center">Customizado</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {candidatesWithTests.map(app => {
                                const renderStatusCell = (status: string, onViewClick: () => void, testLabel: string) => {
                                  if (status === 'NONE') {
                                    return <span className="text-slate-300 font-extrabold text-xs">-</span>;
                                  }
                                  if (status === 'PENDING') {
                                    return (
                                      <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg text-[9px] font-black uppercase tracking-wider">
                                        Pendente
                                      </span>
                                    );
                                  }
                                  return (
                                    <button
                                      type="button"
                                      onClick={onViewClick}
                                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 hover:border-indigo-200 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 mx-auto shadow-xs active:scale-95 cursor-pointer"
                                      style={{ backgroundColor: 'rgba(83, 58, 246, 0.05)', color: '#533af6', borderColor: 'rgba(83, 58, 246, 0.1)' }}
                                    >
                                      <Eye size={10} /> Ver
                                    </button>
                                  );
                                };

                                return (
                                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 text-slate-400 border border-slate-100 rounded-xl overflow-hidden flex items-center justify-center shadow-sm shrink-0">
                                          {app.profile_pic ? (
                                            <img src={app.profile_pic} alt={app.candidate_name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                          ) : (
                                            <User size={18} />
                                          )}
                                        </div>
                                        <div className="max-w-[150px] truncate">
                                          <p className="font-extrabold text-slate-800 text-xs uppercase tracking-tight truncate">{app.candidate_name || app.name}</p>
                                          <p className="text-[9px] font-bold text-slate-400 truncate">{parseCandidatePhoneData(app.candidate_phone).phone}</p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-4">
                                      <div className="max-w-[150px] truncate">
                                        <p className="font-extrabold text-slate-600 text-xs uppercase tracking-tight truncate">{app.job?.title || 'Oportunidade'}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{app.job?.modality || 'Presencial'}</p>
                                      </div>
                                    </td>
                                    
                                    <td className="py-4 text-center">
                                      {renderStatusCell(app.discStatus, () => {
                                        setSelectedDiscResult({
                                          applicantName: app.candidate_name || app.name,
                                          D: app.discScores[0], I: app.discScores[1], S: app.discScores[2], C: app.discScores[3]
                                        });
                                      }, 'DISC')}
                                    </td>
                                    
                                    <td className="py-4 text-center">
                                      {renderStatusCell(app.mbtiStatus, () => {
                                        setSelectedMbtiResult({ ...app.mbtiData, completedAt: app.created_at });
                                        setIsMbtiModalOpen(true);
                                      }, 'MBTI')}
                                    </td>

                                    <td className="py-4 text-center">
                                      {renderStatusCell(app.questionsStatus, () => {
                                        setSelectedApplicantForQuestions({
                                          candidate_name: app.candidate_name || app.name,
                                          questionsResponses: app.questionsResponses
                                        });
                                        setIsQuestionsModalOpen(true);
                                      }, 'Mapeamento')}
                                    </td>

                                    <td className="py-4 text-center">
                                      {renderStatusCell(app.temperamentosStatus, () => {
                                        setSelectedTemperamentosResult({ ...app.temperamentosData, completedAt: app.created_at });
                                        setIsTemperamentosModalOpen(true);
                                      }, 'Temperamentos')}
                                    </td>

                                    <td className="py-4 text-center">
                                      {renderStatusCell(app.customTestStatus, () => {
                                        setSelectedApplicantForCustomTest(app);
                                        setIsCustomTestModalOpen(true);
                                      }, 'Customizado')}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  }

                  // --- SUB-ABA 2: GUIA DE TESTES ---
                  if (resultsSubTab === 'guia') {
                    const testGuides = [
                      {
                        title: 'Mapeamento de Perfil (Soft Skills)',
                        badge: 'Exclusivo Colaborh',
                        color: 'bg-indigo-50 border-indigo-100 text-indigo-700',
                        colorVal: '#533af6',
                        icon: FileText,
                        desc: 'Uma avaliação qualitativa abrangente contendo 20 perguntas descritivas essenciais. Investiga o histórico do profissional, conquistas marcantes, trabalho em equipe e resiliência psicológica diante de desafios organizacionais.',
                        target: 'Indicado para obter insights detalhados de comunicação escrita, nível de profundidade técnica e adequação com valores da cultura corporativa.',
                        time: 'Tempo estimado: 20-30 min'
                      },
                      {
                        title: 'Perfil Comportamental DISC 5.0',
                        badge: 'Padrão de Mercado',
                        color: 'bg-rose-50 border-rose-100 text-rose-700',
                        colorVal: '#f43f5e',
                        icon: Brain,
                        desc: 'Mapeia tendências naturais agrupadas em quatro fatores fundamentais: Dominância (foco em resultados), Influência (foco em pessoas e conexões), Estabilidade (foco em cooperação e ritmo) e Conformidade (foco em regras e qualidade).',
                        target: 'Essencial para entender a dinâmica de relacionamento social, ritmo de execução, nível de resiliência e adaptação a ambientes dinâmicos.',
                        time: 'Tempo estimado: 10 min'
                      },
                      {
                        title: 'Tipologia de Personalidade MBTI',
                        badge: 'Comportamento & Foco',
                        color: 'bg-emerald-50 border-emerald-100 text-emerald-700',
                        colorVal: '#10b981',
                        icon: Sparkles,
                        desc: 'Baseado na teoria de Carl Jung, categoriza os indivíduos em 16 tipos de personalidade combinando 4 dicotomias mentais: Extroversão/Introversão, Sensação/Intuição, Razão/Sentimento e Julgamento/Percepção.',
                        target: 'Ideal para posições de liderança e estratégia. Identifica os motivadores de foco profissional, predileção em processos de decisão e resolução de problemas.',
                        time: 'Tempo estimado: 15 min'
                      },
                      {
                        title: 'Temperamentos e Perfil Humano',
                        badge: 'Energia Vital & Estilo',
                        color: 'bg-sky-50 border-sky-100 text-sky-700',
                        colorVal: '#0ea5e9',
                        icon: Compass,
                        desc: 'Analisa o perfil emocional do candidato sob a ótica dos quatro temperamentos históricos: Sanguíneo (comunicativo e otimista), Colérico (determinado e focado), Fleumático (paciente e diplomata) e Melancólico (analítico e idealista).',
                        target: 'Ajuda a decifrar a resposta emocional primitiva sob extrema pressão, estabilidade psicológica do foco de atenção e compatibilidade motivacional com a equipe.',
                        time: 'Tempo estimado: 8 min'
                      }
                    ];

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {testGuides.map((guide, idx) => {
                          const GuideIcon = guide.icon;
                          return (
                            <div 
                              key={idx}
                              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sleek hover:border-[#533af6]/30 transition-all flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex justify-between items-start mb-6">
                                  <div 
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm"
                                    style={{ backgroundColor: guide.colorVal }}
                                  >
                                    <GuideIcon size={22} />
                                  </div>
                                  <span className={`px-3 py-1 rounded-full font-black uppercase tracking-widest text-[8px] border ${guide.color}`}>
                                    {guide.badge}
                                  </span>
                                </div>

                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-2">
                                  {guide.title}
                                </h3>
                                
                                <p className="text-xs font-medium text-slate-500 leading-relaxed mb-4">
                                  {guide.desc}
                                </p>
                                
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left text-xs font-semibold text-slate-600 mb-4 leading-relaxed">
                                  <strong className="text-slate-800">Objetivo e Foco:</strong> {guide.target}
                                </div>
                              </div>

                              <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                                <span>Disponível no Kanban</span>
                                <span>{guide.time}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }

                  // --- SUB-ABA 3: CRIAR QUESTIONÁRIO CUSTOMIZADO ---
                  if (resultsSubTab === 'criar') {
                    if (!isCreatingNewTemplate && !editingTemplateId) {
                      // MODO LISTA DE TEMPLATES
                      return (
                        <div className="bg-white p-8 sm:p-10 rounded-[3rem] shadow-sleek border border-white space-y-8 text-left">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Biblioteca de Avaliações Customizadas</h3>
                              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Crie e gerencie questionários independentes para enviar aos candidatos na etapa de testes</p>
                            </div>
                            <button
                              type="button"
                              onClick={handleStartNewTemplate}
                              className="px-5 py-3 bg-[#533af6] hover:bg-[#432ec4] text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-lg shadow-[#533af6]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer border-0 outline-none"
                            >
                              <PlusCircle size={14} />
                              Criar Questionário
                            </button>
                          </div>

                          {customTemplates.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
                              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                                <FileText size={24} />
                              </div>
                              <p className="text-xs font-black text-slate-600 uppercase tracking-widest">Nenhum Questionário Cadastrado</p>
                              <p className="text-[10px] text-slate-400 mt-1.5 max-w-sm leading-relaxed">
                                Você ainda não possui questionários customizados na sua biblioteca. Clique no botão acima para criar o seu primeiro questionário independente de vaga.
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {customTemplates.map(template => (
                                <div key={template.id} className="bg-slate-55/50 hover:bg-slate-50 p-6 rounded-3xl border border-slate-200/60 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all text-left">
                                  <div className="space-y-3">
                                    <div className="flex justify-between items-start gap-2">
                                      <h4 className="text-sm font-extrabold text-slate-900 line-clamp-2">{template.title}</h4>
                                      <span className="px-2 py-0.5 bg-primary-50 text-primary-700 border border-primary-100/50 rounded-md text-[8px] font-black uppercase tracking-wider shrink-0">
                                        Customizado
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                      <span className="flex items-center gap-1">
                                        <MessageSquare size={10} />
                                        {template.questions?.length || 0} Perguntas
                                      </span>
                                      <span>
                                        Criado em {new Date(template.createdAt).toLocaleDateString('pt-BR')}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex gap-2.5 mt-6 pt-4 border-t border-slate-200/50">
                                    <button
                                      type="button"
                                      onClick={() => handleEditCustomTemplate(template)}
                                      className="flex-1 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border border-slate-200 cursor-pointer outline-none"
                                    >
                                      Editar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteCustomTemplate(template.id)}
                                      className="py-2 px-3 bg-white hover:bg-red-50 text-red-500 hover:border-red-200 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border border-slate-200 cursor-pointer outline-none"
                                      title="Excluir questionário"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }

                    // MODO FORMULÁRIO DE CRIAÇÃO / EDIÇÃO
                    return (
                      <div className="bg-white p-8 sm:p-10 rounded-[3rem] shadow-sleek border border-white space-y-8 text-left">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={handleCancelTemplateEdit}
                            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-xl transition-all cursor-pointer border-0 outline-none"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                              {editingTemplateId ? 'Editar Questionário' : 'Novo Questionário Customizado'}
                            </h3>
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Cadastre perguntas abertas ou de múltipla escolha para a biblioteca</p>
                          </div>
                        </div>

                        {/* Título do Questionário */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block pl-1">Nome do Questionário</label>
                          <input
                            type="text"
                            value={customTestTitle}
                            onChange={(e) => setCustomTestTitle(e.target.value)}
                            placeholder="Ex: Questionário Técnico React / Fit Cultural"
                            className="w-full max-w-xl px-5 py-4 bg-slate-50 border border-slate-200/60 focus:border-[#533af6]/30 focus:bg-white rounded-2xl text-xs font-bold text-slate-800 transition-all outline-none"
                          />
                        </div>

                        <div className="space-y-6 pt-4 border-t border-slate-100">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Estrutura das Perguntas ({customQuestions.length})</h4>
                            
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => addCustomQuestion('text')}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border-0 outline-none"
                              >
                                <MessageSquare size={12} />
                                + Pergunta Aberta
                              </button>
                              <button
                                type="button"
                                onClick={() => addCustomQuestion('choice')}
                                className="px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border-0 outline-none"
                              >
                                <PlusCircle size={12} />
                                + Múltipla Escolha
                              </button>
                            </div>
                          </div>

                          {customQuestions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 text-center">
                              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3">
                                <FileText size={20} />
                              </div>
                              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Nenhuma pergunta adicionada ainda</p>
                              <p className="text-[10px] text-slate-400 mt-1 max-w-[280px]">Adicione perguntas abertas ou de múltipla escolha usando os botões acima.</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {customQuestions.map((q, qIdx) => (
                                <div key={q.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4 relative group transition-all hover:bg-slate-50/80">
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      <span className="w-6 h-6 bg-slate-200 text-slate-700 rounded-full flex items-center justify-center text-[10px] font-black">
                                        {qIdx + 1}
                                      </span>
                                      <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider ${
                                        q.type === 'choice' 
                                          ? 'bg-primary-50 text-primary-600 border border-primary-100/50' 
                                          : 'bg-amber-50 text-amber-600 border border-amber-100/50'
                                      }`}>
                                        {q.type === 'choice' ? 'Múltipla Escolha' : 'Texto Aberto'}
                                      </span>
                                    </div>
                                    
                                    <button
                                      type="button"
                                      onClick={() => removeCustomQuestion(q.id)}
                                      className="w-8 h-8 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl flex items-center justify-center border border-slate-100 hover:border-red-100 transition-all cursor-pointer outline-none"
                                      title="Remover pergunta"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block pl-1">Enunciado da Pergunta</label>
                                    <input
                                      type="text"
                                      value={q.question}
                                      onChange={(e) => updateCustomQuestionText(q.id, e.target.value)}
                                      placeholder="Ex: Conte sobre uma experiência em que você liderou um projeto difícil..."
                                      className="w-full px-4 py-3 bg-white border border-slate-200/60 focus:border-[#533af6]/30 rounded-xl text-xs font-bold text-slate-700 transition-all outline-none"
                                    />
                                  </div>

                                  {q.type === 'choice' && (
                                    <div className="pl-4 border-l-2 border-slate-200/60 space-y-3">
                                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block pl-1">Opções de Resposta</label>
                                      
                                      <div className="space-y-2">
                                        {(q.options || []).map((option: string, optIndex: number) => (
                                          <div key={optIndex} className="flex items-center gap-2">
                                            <span className="w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center text-[9px] text-slate-400 font-bold shrink-0">
                                              {String.fromCharCode(65 + optIndex)}
                                            </span>
                                            <input
                                              type="text"
                                              value={option}
                                              onChange={(e) => updateOptionText(q.id, optIndex, e.target.value)}
                                              placeholder={`Opção ${optIndex + 1}`}
                                              className="flex-1 px-4 py-2.5 bg-white border border-slate-200/60 focus:border-[#533af6]/30 rounded-xl text-xs font-semibold text-slate-700 transition-all outline-none"
                                            />
                                            {(q.options || []).length > 2 && (
                                              <button
                                                type="button"
                                                onClick={() => removeOptionFromChoice(q.id, optIndex)}
                                                className="w-7 h-7 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg flex items-center justify-center border border-slate-100 transition-all cursor-pointer outline-none"
                                                title="Remover opção"
                                              >
                                                <Trash2 size={12} />
                                              </button>
                                            )}
                                          </div>
                                        ))}
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => addOptionToChoice(q.id)}
                                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-600 rounded-lg text-[9px] font-bold border border-slate-100 transition-all flex items-center gap-1 cursor-pointer mt-1 outline-none"
                                      >
                                        <Plus size={10} />
                                        Adicionar Opção
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Botões de Ação */}
                          <div className="pt-4 flex justify-end gap-3">
                            <button
                              type="button"
                              onClick={handleCancelTemplateEdit}
                              className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all cursor-pointer border-0 outline-none"
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              onClick={handleSaveCustomTemplate}
                              className="px-6 py-3.5 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-900/10 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer border-0 outline-none"
                            >
                              <Check size={14} />
                              Salvar Questionário
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })()}
              </motion.div>
            )}

            {activeTab === 'Configurações' && (
              <motion.div 
                key="configuracoes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Perfil Summary Card */}
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sleek border border-white flex flex-col items-center">
                    <div className="w-24 h-24 bg-primary-50 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-primary-300 relative group mb-4">
                       <User size={40} />
                       <div className="absolute inset-0 bg-primary-600/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                         <PlusCircle size={20} className="text-white" />
                       </div>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">João Silva</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Recrutador Principal</p>
                    
                    <div className="w-full pt-6 border-t border-slate-50 space-y-4">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-400">Status</span>
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Ativo</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-400">Membro desde</span>
                        <span className="text-slate-700">Maio 2024</span>
                      </div>
                    </div>
                  </div>

                  {/* Form Card */}
                  <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sleek border border-white">
                    <div className="flex items-center gap-3 mb-8">
                       <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                         <Settings size={20} />
                       </div>
                       <div>
                         <h3 className="text-lg font-black text-slate-900 tracking-tight">Informações Pessoais</h3>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Atualize seus dados de contato</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="col-span-full">
                         <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block pl-2">Nome Completo</label>
                         <div className="relative">
                           <User size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-400" />
                           <input type="text" placeholder="João Silva" className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-100 transition-all font-bold text-slate-700 text-sm shadow-sm" />
                         </div>
                       </div>
                       <div>
                         <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block pl-2">E-mail Corporativo</label>
                         <div className="relative">
                           <Mail size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-400" />
                           <input type="email" placeholder="joao@empresa.com" className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-100 transition-all font-bold text-slate-700 text-sm shadow-sm" />
                         </div>
                       </div>
                       <div>
                         <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block pl-2">WhatsApp / Telefone</label>
                         <div className="relative">
                           <Phone size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-400" />
                           <input type="tel" placeholder="(61) 99999-9999" className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-100 transition-all font-bold text-slate-700 text-sm shadow-sm" />
                         </div>
                       </div>
                    </div>
                    
                    <div className="mt-10 flex gap-4">
                      <button className="flex-1 py-4 bg-slate-900 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:shadow-slate-900/20 hover:-translate-y-0.5 transition-all text-[9px]">
                        Salvar Alterações
                      </button>
                      <button className="px-6 py-4 bg-white border border-slate-100 text-red-500 font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-red-50 transition-all text-[9px] flex items-center justify-center gap-2">
                        <Trash2 size={16} /> Excluir Conta
                      </button>
                    </div>
                  </div>
                </div>

                {/* Additional Settings Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                   <div className="bg-white p-8 rounded-[2.5rem] shadow-sleek border border-white">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                          <Zap size={16} />
                        </div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Notificações</h4>
                      </div>
                      <div className="space-y-4">
                        {[
                          { label: 'Novas Candidaturas', active: true },
                          { label: 'Alertas de IA', active: true },
                          { label: 'Resumo Semanal', active: false },
                        ].map((pref, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{pref.label}</span>
                            <div className={`w-8 h-4 rounded-full relative transition-colors cursor-pointer ${pref.active ? 'bg-primary-600' : 'bg-slate-200'}`}>
                              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${pref.active ? 'right-0.5' : 'left-0.5'}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>

                   <div className="bg-white p-8 rounded-[2.5rem] shadow-sleek border border-white">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                          <Building size={16} />
                        </div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Segurança</h4>
                      </div>
                      <button className="w-full py-3 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all mb-3">
                        Alterar Senha
                      </button>
                      <button className="w-full py-3 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
                        Ativar Autenticação 2FA
                      </button>
                   </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </main>
    </div>

      {/* Global Overlays (placed here at the root level so they never get overlapped by the sidebar or affected by main's layout) */}
      <AnimatePresence>
            {isRegisteringVacancy && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    setIsRegisteringVacancy(false);
                    setRegisterStep(1);
                  }}
                  className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                />
                <motion.div 
                  key="cadastrar-vaga"
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  className="relative w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-[5px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200/60 z-10"
                >
                  {/* Step Header - Compact & Premium */}
                  <div className="px-8 pt-8 pb-4 relative">
                    <div className="max-w-lg mx-auto w-full">
                      <div className="relative pb-3 border-b border-slate-100 w-full">
                        <h2 className="text-base font-extrabold text-slate-800 tracking-tight">CADASTRAR NOVA VAGA</h2>
                        <div className="absolute bottom-0 left-0 w-24 h-1 bg-[#533af6]" />
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          Passo {registerStep} de 3
                        </p>

                        {/* Step Progress Dots */}
                        <div className="flex items-center gap-1">
                          {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black transition-all ${
                                registerStep === step 
                                  ? 'bg-[#533af6] text-white shadow-sm' 
                                  : registerStep > step 
                                    ? 'bg-[#533af6]/85 text-white' 
                                    : 'bg-slate-200 text-slate-400'
                              }`}>
                                {registerStep > step ? <Check size={10} /> : step}
                              </div>
                              {step < 3 && (
                                <div className={`w-4 h-0.5 mx-0.5 rounded-full ${registerStep > step ? 'bg-[#533af6]/85' : 'bg-slate-200'}`} />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setIsRegisteringVacancy(false);
                        setRegisterStep(1);
                      }}
                      className="absolute top-8 right-8 w-9 h-9 border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full flex items-center justify-center transition-all outline-none"
                    >
                      <CloseIcon size={14} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-between">
                    <div className="p-8 flex-1">
                      <div className="max-w-lg mx-auto w-full">
                      <AnimatePresence mode="wait">
                      {registerStep === 1 && (
                        <motion.div 
                          key="step1"
                          initial={{ opacity: 0, x: 10 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          exit={{ opacity: 0, x: -10 }}
                          className="space-y-4"
                        >
                          {/* Título da Vaga */}
                          <div className="grid grid-cols-[1.5fr_3fr] md:grid-cols-[1.2fr_2.5fr] gap-4 items-center">
                            <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest text-right pr-2">
                              Título da Vaga <span className="text-rose-500">*</span>
                            </label>
                            <input 
                              type="text" 
                              value={vacancyForm.title}
                              onChange={(e) => setVacancyForm({ ...vacancyForm, title: e.target.value })}
                              placeholder="Ex: Desenvolvedor React Sênior" 
                              className="w-full px-4 py-2.5 bg-white/80 border border-slate-200 rounded-[5px] outline-none focus:bg-white focus:border-[#533af6] focus:ring-4 focus:ring-[#533af6]/5 transition-all text-slate-900 font-medium text-xs" 
                            />
                          </div>

                          {/* Modalidade */}
                          <div className="grid grid-cols-[1.5fr_3fr] md:grid-cols-[1.2fr_2.5fr] gap-4 items-center">
                            <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest text-right pr-2">
                              Modalidade
                            </label>
                            <div className="relative">
                              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                              <select 
                                value={vacancyForm.modality}
                                onChange={(e) => setVacancyForm({ ...vacancyForm, modality: e.target.value as any })}
                                className="w-full px-4 py-2.5 bg-white/80 border border-slate-200 rounded-[5px] outline-none focus:bg-white focus:border-[#533af6] focus:ring-4 focus:ring-[#533af6]/5 transition-all text-slate-900 font-medium text-xs appearance-none"
                              >
                                <option value="Presencial">Presencial</option>
                                <option value="Home Office">Home Office</option>
                              </select>
                            </div>
                          </div>

                          {/* Localização (UF / Cidade) */}
                          {vacancyForm.modality === 'Presencial' && (
                            <div className="grid grid-cols-[1.5fr_3fr] md:grid-cols-[1.2fr_2.5fr] gap-4 items-center">
                              <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest text-right pr-2">
                                Localização
                              </label>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="relative">
                                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                  <select 
                                    className="w-full px-4 py-2.5 bg-white/80 border border-slate-200 rounded-[5px] font-medium text-xs outline-none focus:bg-white focus:border-[#533af6] focus:ring-4 focus:ring-[#533af6]/5 transition-all appearance-none"
                                    value={vacancyForm.state}
                                    onChange={(e) => setVacancyForm({...vacancyForm, state: e.target.value, city: ''})}
                                  >
                                    <option value="">UF</option>
                                    {BRAZIL_STATES.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                                  </select>
                                </div>
                                <div className="relative">
                                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                  <select 
                                    className="w-full px-4 py-2.5 bg-white/80 border border-slate-200 rounded-[5px] font-medium text-xs outline-none focus:bg-white focus:border-[#533af6] focus:ring-4 focus:ring-[#533af6]/5 transition-all appearance-none disabled:opacity-50"
                                    value={vacancyForm.city}
                                    onChange={(e) => setVacancyForm({...vacancyForm, city: e.target.value})}
                                    disabled={isLoadingCities || !cities.length}
                                  >
                                    <option value="">{isLoadingCities ? 'Buscando...' : 'Cidade'}</option>
                                    {cities.map(city => <option key={city} value={city}>{city}</option>)}
                                  </select>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Remuneração */}
                          <div className="grid grid-cols-[1.5fr_3fr] md:grid-cols-[1.2fr_2.5fr] gap-4 items-center">
                            <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest text-right pr-2">
                              Remuneração
                            </label>
                            <div className="relative">
                              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                              <select 
                                value={vacancyForm.remunerationType}
                                onChange={(e) => setVacancyForm({ ...vacancyForm, remunerationType: e.target.value as any })}
                                className="w-full px-4 py-2.5 bg-white/80 border border-slate-200 rounded-[5px] font-medium text-xs outline-none focus:bg-white focus:border-[#533af6] focus:ring-4 focus:ring-[#533af6]/5 transition-all appearance-none"
                              >
                                <option>Mensal</option>
                                <option>Comissionado</option>
                                <option>Diária</option>
                              </select>
                            </div>
                          </div>

                          {/* Salário Proposto */}
                          <div className="grid grid-cols-[1.5fr_3fr] md:grid-cols-[1.2fr_2.5fr] gap-4 items-start">
                            <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest text-right pr-2 mt-3.5">
                              Salário Proposto
                            </label>
                            <div className="space-y-3 w-full">
                              <div className="relative">
                                <input 
                                  type="text" 
                                  value={vacancyForm.salary}
                                  onChange={handleSalaryChange}
                                  placeholder="R$ 0,00" 
                                  className="w-full px-4 py-2.5 bg-white/80 border border-slate-200 rounded-[5px] outline-none focus:bg-white focus:border-[#533af6] focus:ring-4 focus:ring-[#533af6]/5 transition-all text-slate-900 font-bold text-xs" 
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white/80 px-2 py-1 rounded-[5px] border border-slate-200/80">
                                  <span className="text-[8px] font-black text-slate-400 uppercase">Extra?</span>
                                  <input 
                                    type="checkbox" 
                                    checked={vacancyForm.hasBonus}
                                    onChange={(e) => setVacancyForm({...vacancyForm, hasBonus: e.target.checked})}
                                    className="w-3.5 h-3.5 rounded text-[#533af6] cursor-pointer accent-[#533af6]"
                                  />
                                </div>
                              </div>

                              {vacancyForm.hasBonus && (
                                <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2">
                                  <div className="relative">
                                    <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    <select 
                                      value={vacancyForm.bonusType}
                                      onChange={(e) => setVacancyForm({...vacancyForm, bonusType: e.target.value})}
                                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-[5px] text-[9px] font-bold uppercase outline-none focus:border-[#533af6] appearance-none pl-3 pr-8"
                                    >
                                      <option value="Comissão">Comissão</option>
                                      <option value="Premiação">Premiação</option>
                                    </select>
                                  </div>
                                  <input 
                                    type="text" 
                                    placeholder="Valor Médio"
                                    value={vacancyForm.bonusValue}
                                    onChange={(e) => setVacancyForm({...vacancyForm, bonusValue: formatCurrency(e.target.value)})}
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-[5px] text-xs font-semibold outline-none focus:border-[#533af6]"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Contratação */}
                          <div className="grid grid-cols-[1.5fr_3fr] md:grid-cols-[1.2fr_2.5fr] gap-4 items-center">
                            <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest text-right pr-2">
                              Contratação
                            </label>
                            <div className="relative">
                              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                              <select 
                                value={vacancyForm.contractType}
                                onChange={(e) => setVacancyForm({ ...vacancyForm, contractType: e.target.value as any })}
                                className="w-full px-4 py-2.5 bg-white/80 border border-slate-200 rounded-[5px] font-medium text-xs outline-none focus:bg-white focus:border-[#533af6] focus:ring-4 focus:ring-[#533af6]/5 transition-all appearance-none"
                              >
                                <option>CLT</option>
                                <option>PJ</option>
                                <option>Estágio</option>
                                <option>Autônomo</option>
                                <option>Meio Período</option>
                                <option>Temporário</option>
                              </select>
                            </div>
                          </div>

                          {/* Escala */}
                          <div className="grid grid-cols-[1.5fr_3fr] md:grid-cols-[1.2fr_2.5fr] gap-4 items-center">
                            <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest text-right pr-2">
                              Escala
                            </label>
                            <div className="relative">
                              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                              <select 
                                value={vacancyForm.workSchedule}
                                onChange={(e) => setVacancyForm({ ...vacancyForm, workSchedule: e.target.value as any })}
                                className="w-full px-4 py-2.5 bg-white/80 border border-slate-200 rounded-[5px] font-medium text-xs outline-none focus:bg-white focus:border-[#533af6] focus:ring-4 focus:ring-[#533af6]/5 transition-all appearance-none"
                              >
                                <option>5x2</option>
                                <option>6x1</option>
                                <option>12x36</option>
                              </select>
                            </div>
                          </div>

                          {/* Oportunidade 1º Emprego */}
                          <div className="grid grid-cols-[1.5fr_3fr] md:grid-cols-[1.2fr_2.5fr] gap-4 items-center">
                            <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest text-right pr-2">
                              1º Emprego
                            </label>
                            <label className="flex items-center gap-4 cursor-pointer group select-none">
                              <div className={`w-11 h-5.5 rounded-full relative transition-all duration-300 ${vacancyForm.isFirstJob ? 'bg-[#533af6]' : 'bg-slate-200'}`}>
                                <div className={`absolute top-0.75 left-0.75 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${vacancyForm.isFirstJob ? 'translate-x-5.5' : ''}`} />
                                <input 
                                  type="checkbox" 
                                  className="hidden" 
                                  checked={vacancyForm.isFirstJob} 
                                  onChange={(e) => setVacancyForm({...vacancyForm, isFirstJob: e.target.checked})} 
                                />
                              </div>
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Ideal para quem busca começar</span>
                            </label>
                          </div>

                          {/* Idade Mínima */}
                          <div className="grid grid-cols-[1.5fr_3fr] md:grid-cols-[1.2fr_2.5fr] gap-4 items-center">
                            <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest text-right pr-2">
                              Idade Mínima
                            </label>
                            <div className="flex items-center gap-4">
                              <input 
                                type="range" 
                                min="16" 
                                max="50" 
                                value={vacancyForm.minAge}
                                onChange={(e) => setVacancyForm({...vacancyForm, minAge: parseInt(e.target.value)})}
                                className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#533af6]"
                              />
                              <span className="px-2.5 py-1 bg-[#533af6] text-white rounded-[5px] text-[10px] font-black shrink-0">{vacancyForm.minAge} anos</span>
                            </div>
                          </div>

                          {/* Benefícios Oferecidos */}
                          <div className="grid grid-cols-[1.5fr_3fr] md:grid-cols-[1.2fr_2.5fr] gap-4 items-start">
                            <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest text-right pr-2 mt-3">
                              Benefícios
                            </label>
                            <div className="space-y-4 w-full">
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                {[
                                  { id: 'vt', label: 'VT', hasValue: true },
                                  { id: 'va', label: 'VA/VR', hasValue: true },
                                  { id: 'healthInsurance', label: 'SAÚDE', hasValue: false },
                                  { id: 'dentalPlan', label: 'DENTAL', hasValue: false },
                                ].map((ben) => (
                                  <div key={ben.id} className="space-y-2">
                                    <button 
                                      type="button"
                                      onClick={() => {
                                        if (ben.hasValue) {
                                          setVacancyForm({
                                            ...vacancyForm, 
                                            benefits: { ...vacancyForm.benefits, [ben.id]: { ...((vacancyForm.benefits as any)[ben.id]), selected: !((vacancyForm.benefits as any)[ben.id]).selected } }
                                          });
                                        } else {
                                          setVacancyForm({
                                            ...vacancyForm, 
                                            benefits: { ...vacancyForm.benefits, [ben.id]: !(vacancyForm.benefits as any)[ben.id] }
                                          });
                                        }
                                      }}
                                      className={`w-full py-2 px-3 rounded-[5px] border font-bold text-[9px] uppercase tracking-tighter transition-all ${
                                        (ben.hasValue ? (vacancyForm.benefits as any)[ben.id].selected : (vacancyForm.benefits as any)[ben.id])
                                          ? 'bg-purple-50 border-purple-200 text-[#533af6]' 
                                          : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'
                                      }`}
                                    >
                                      {ben.label}
                                    </button>
                                    {ben.hasValue && (vacancyForm.benefits as any)[ben.id].selected && (
                                      <input 
                                        type="text" 
                                        placeholder="Valor"
                                        value={(vacancyForm.benefits as any)[ben.id].value}
                                        onChange={(e) => setVacancyForm({
                                          ...vacancyForm, 
                                          benefits: { ...vacancyForm.benefits, [ben.id]: { ...((vacancyForm.benefits as any)[ben.id]), value: formatCurrency(e.target.value) } }
                                        })}
                                        className="w-full px-3 py-1.5 bg-white border border-slate-100 rounded-[5px] text-[9px] font-bold outline-none focus:border-[#533af6]"
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>

                              {/* Extra benefits list */}
                              <div className="flex flex-wrap gap-2">
                                {vacancyForm.extraBenefits.map((extra, idx) => (
                                  <div key={idx} className="relative group">
                                    <button 
                                      type="button"
                                      className="py-1.5 px-3 rounded-[5px] border border-purple-200 bg-purple-50 font-bold text-[9px] uppercase tracking-tighter text-[#533af6]"
                                    >
                                      {extra}
                                    </button>
                                    <button 
                                      type="button"
                                      onClick={() => setVacancyForm({...vacancyForm, extraBenefits: vacancyForm.extraBenefits.filter((_, i) => i !== idx)})}
                                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                    >
                                      <CloseIcon size={10} />
                                    </button>
                                  </div>
                                ))}

                                <div className="w-full flex gap-1 mt-2">
                                  <input 
                                    type="text" 
                                    placeholder="Outro benefício..."
                                    value={newBenefit}
                                    onChange={(e) => setNewBenefit(e.target.value.toUpperCase())}
                                    className="flex-1 px-3 py-2 bg-slate-50 border border-dashed border-slate-200 rounded-[5px] text-[9px] font-bold outline-none focus:border-[#533af6] placeholder:normal-case"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && newBenefit.trim()) {
                                        setVacancyForm({...vacancyForm, extraBenefits: [...vacancyForm.extraBenefits, newBenefit.trim()]});
                                        setNewBenefit('');
                                      }
                                    }}
                                  />
                                  {newBenefit && (
                                    <button 
                                      onClick={() => {
                                        setVacancyForm({...vacancyForm, extraBenefits: [...vacancyForm.extraBenefits, newBenefit.trim()]});
                                        setNewBenefit('');
                                      }}
                                      className="px-3 bg-[#533af6] text-white rounded-[5px] flex items-center justify-center"
                                    >
                                      <Plus size={12} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {registerStep === 2 && (
                        <motion.div 
                          key="step2"
                          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                          className="space-y-4"
                        >
                          {/* Descrição */}
                          <div className="grid grid-cols-[1.5fr_3fr] md:grid-cols-[1.2fr_2.5fr] gap-4 items-start">
                            <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest text-right pr-2 mt-3">
                              Descrição
                            </label>
                            <textarea 
                              rows={5} 
                              value={vacancyForm.description}
                              onChange={(e) => setVacancyForm({...vacancyForm, description: e.target.value})}
                              placeholder="Fale sobre o cargo e a empresa..." 
                              className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-[5px] outline-none focus:bg-white focus:border-[#533af6] focus:ring-4 focus:ring-[#533af6]/5 transition-all font-medium text-slate-700 text-xs italic leading-relaxed" 
                            />
                          </div>

                          {/* Requisitos */}
                          <div className="grid grid-cols-[1.5fr_3fr] md:grid-cols-[1.2fr_2.5fr] gap-4 items-start">
                            <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest text-right pr-2 mt-2">
                              Requisitos
                            </label>
                            <div className="space-y-4 w-full">
                              <div className="flex flex-wrap gap-2">
                                {commonRequirements.map(req => {
                                  const selected = vacancyForm.requirements.includes(req);
                                  return (
                                    <button
                                      key={req}
                                      onClick={() => {
                                        if (selected) {
                                          setVacancyForm({...vacancyForm, requirements: vacancyForm.requirements.filter(r => r !== req)});
                                        } else {
                                          setVacancyForm({...vacancyForm, requirements: [...vacancyForm.requirements, req]});
                                        }
                                      }}
                                      className={`px-3 py-1.5 rounded-[5px] text-[9px] font-bold uppercase transition-all ${
                                        selected 
                                          ? 'bg-[#533af6] text-white shadow-sm' 
                                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'
                                      }`}
                                    >
                                      {req}
                                    </button>
                                  );
                                })}
                              </div>

                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={newRequirement}
                                  onChange={(e) => setNewRequirement(e.target.value)}
                                  placeholder="Outro requisito..." 
                                  className="flex-1 px-4 py-2 bg-white/80 border border-slate-200 rounded-[5px] font-medium text-xs outline-none focus:bg-white focus:border-[#533af6] focus:ring-4 focus:ring-[#533af6]/5 transition-all"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && newRequirement.trim()) {
                                      setVacancyForm({...vacancyForm, requirements: [...vacancyForm.requirements, newRequirement.trim()]});
                                      setNewRequirement('');
                                    }
                                  }}
                                />
                              </div>

                              {vacancyForm.requirements.length > 0 && (
                                <div className="bg-slate-50/50 p-4 rounded-[5px] border border-dashed border-slate-200">
                                  <div className="flex flex-wrap gap-2">
                                    {vacancyForm.requirements.map((r, i) => (
                                      <div key={i} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-[5px] border border-slate-100 text-[9px] font-bold text-slate-600">
                                        <span>{r}</span>
                                        <button 
                                          onClick={() => setVacancyForm({...vacancyForm, requirements: vacancyForm.requirements.filter((_, idx) => idx !== i)})}
                                          className="text-red-400 hover:text-red-600"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {registerStep === 3 && (
                        <motion.div 
                          key="step3"
                          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                          className="space-y-4"
                        >
                          {/* Funil de Etapas */}
                          <div className="grid grid-cols-[1.5fr_3fr] md:grid-cols-[1.2fr_2.5fr] gap-4 items-start">
                            <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest text-right pr-2 mt-3">
                              Etapas do Funil
                            </label>
                            <div className="space-y-4 w-full">
                              <div className="space-y-2">
                                {vacancyForm.stages.map((stage, index) => (
                                  <div key={index} className="group flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-[5px] border border-slate-100 hover:border-purple-200 transition-all">
                                    <div className="w-6 h-6 bg-white rounded-[5px] shadow-sm flex items-center justify-center font-black text-[#533af6] text-xs">
                                      {index + 1}
                                    </div>
                                    <span className="text-xs font-bold text-slate-700">{stage}</span>
                                    <button 
                                      type="button"
                                      onClick={() => setVacancyForm({...vacancyForm, stages: vacancyForm.stages.filter((_, i) => i !== index)})}
                                      className="ml-auto p-1 text-slate-400 hover:text-red-500 transition-all"
                                      title="Remover etapa"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                ))}
                              </div>

                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={newStage}
                                  onChange={(e) => setNewStage(e.target.value)}
                                  placeholder="Ex: Dinâmica em Grupo" 
                                  className="flex-1 px-4 py-2 bg-white border border-dashed border-slate-200 rounded-[5px] font-medium text-xs outline-none focus:border-[#533af6] focus:border-solid transition-all"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      if (newStage.trim()) {
                                        const trimmedStage = newStage.trim();
                                        const forbidden = ['testes', 'contratado', 'reprovado'];
                                        if (forbidden.includes(trimmedStage.toLowerCase())) {
                                          alert(`O nome "${trimmedStage}" é reservado para o sistema e não pode ser usado.`);
                                          return;
                                        }
                                        setVacancyForm({...vacancyForm, stages: [...vacancyForm.stages, trimmedStage]});
                                        setNewStage('');
                                      }
                                    }
                                  }}
                                />
                                <button 
                                  type="button"
                                  onClick={() => {
                                    if (newStage.trim()) {
                                      const trimmedStage = newStage.trim();
                                      const forbidden = ['testes', 'contratado', 'reprovado'];
                                      if (forbidden.includes(trimmedStage.toLowerCase())) {
                                        alert(`O nome "${trimmedStage}" é reservado para o sistema e não pode ser usado.`);
                                        return;
                                      }
                                      setVacancyForm({...vacancyForm, stages: [...vacancyForm.stages, trimmedStage]});
                                      setNewStage('');
                                    }
                                  }}
                                  className="px-3 bg-[#533af6] text-white rounded-[5px] flex items-center justify-center"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                      </div>
                    </div>

                  {/* Modal Footer */}
                  <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50">
                    <div className="max-w-lg mx-auto w-full flex justify-between items-center gap-4">
                    {registerStep > 1 ? (
                      <button 
                        type="button"
                        onClick={() => setRegisterStep(prev => prev - 1)}
                        className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all"
                      >
                        Voltar
                      </button>
                    ) : (
                      <div />
                    )}

                    {registerStep < 3 ? (
                      <button 
                        type="button"
                        onClick={() => {
                          if (registerStep === 1 && !vacancyForm.title.trim()) {
                            alert("Por favor, informe o título da vaga.");
                            return;
                          }
                          setRegisterStep(prev => prev + 1);
                        }}
                        className="px-8 py-2.5 bg-[#533af6] hover:bg-[#4326e5] text-white rounded-full font-bold text-[10px] uppercase tracking-wider transition-all shadow-md shadow-[#533af6]/10"
                      >
                        Próximo Passo
                      </button>
                    ) : (
                      <button 
                        type="button"
                        onClick={handlePublish}
                        className="px-8 py-2.5 bg-[#533af6] hover:bg-[#4326e5] text-white rounded-full font-bold text-[10px] uppercase tracking-wider transition-all shadow-md shadow-[#533af6]/10"
                      >
                        Publicar Vaga
                      </button>
                    )}

                    </div>
                  </div>
                  </div>
                </motion.div>
              </div>
            )}

            {isConfiguringStages && selectedJob && (
              (() => {
                const currentStagesList = getCurrentJobStages(selectedJob);
                const allCols = [...currentStagesList, 'Testes', 'Contratado', 'Reprovado'];
                
                return (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsConfiguringStages(false)}
                      className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      className="relative w-full max-w-md bg-white rounded-[5px] shadow-2xl p-8 overflow-hidden flex flex-col max-h-[85vh] z-10"
                    >
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#8959f5] to-indigo-600" />
                      
                      <div className="flex justify-between items-center mb-6 mt-2 shrink-0">
                        <div>
                          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Gerenciar Etapas</h3>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Customize o funil de seleção desta vaga</p>
                        </div>
                        <button 
                          onClick={() => setIsConfiguringStages(false)}
                          className="w-8 h-8 rounded-full border border-slate-100 hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                          <CloseIcon size={14} />
                        </button>
                      </div>

                      {/* Adicionar Nova Etapa */}
                      <div className="bg-slate-50 p-4 rounded-[5px] border border-slate-100 mb-6 shrink-0 text-left">
                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5">Adicionar Nova Etapa</h4>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Digite o nome da etapa..."
                            id="popup-new-stage-input"
                            className="flex-1 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-full outline-none focus:border-[#8959f5]/50 focus:ring-2 focus:ring-[#8959f5]/5 transition-all"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const target = e.currentTarget;
                                if (target.value.trim()) {
                                  handleAddNewStage(target.value);
                                  target.value = '';
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById('popup-new-stage-input') as HTMLInputElement;
                              if (input && input.value.trim()) {
                                handleAddNewStage(input.value);
                                input.value = '';
                              }
                            }}
                            className="px-4 py-2 bg-[#8959f5] hover:bg-[#7846e3] text-white rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-md shadow-[#8959f5]/15"
                          >
                            Adicionar
                          </button>
                        </div>
                      </div>

                      {/* Lista de Etapas (Vertical e Rolável) */}
                      <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 mb-6 min-h-0 pr-1 text-left">
                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 select-none sticky top-0 bg-white py-1 z-10">Etapas do Processo ({allCols.length})</h4>
                        {allCols.map((colName) => {
                          const defaultStage = currentStagesList[0] || 'Triagem';
                          const count = jobApplicants.filter(applicant => {
                            const currentStatus = applicant.status;
                            const normalizedStatus = (!currentStatus || currentStatus === 'Triagem' || !allCols.includes(currentStatus)) 
                              ? defaultStage 
                              : currentStatus;
                            return normalizedStatus === colName;
                          }).length;

                          const isSpecial = colName === 'Testes' || colName === 'Contratado' || colName === 'Reprovado';
                          
                          const stageIndex = currentStagesList.indexOf(colName);
                          const canMoveUp = stageIndex > 0;
                          const canMoveDown = stageIndex !== -1 && stageIndex < currentStagesList.length - 1;

                          return (
                            <div 
                              key={colName}
                              className={`flex items-center justify-between p-3 rounded-[5px] border transition-all ${
                                isSpecial 
                                  ? 'bg-slate-50/50 border-slate-100 text-slate-400' 
                                  : 'bg-white border-slate-100 hover:border-slate-200/80 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-xs font-bold truncate uppercase tracking-tight">{colName}</span>
                                <span className="text-[8px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-black">
                                  {count}
                                </span>
                              </div>

                              {!isSpecial && (
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    title="Mover para Cima"
                                    disabled={!canMoveUp}
                                    onClick={() => handleMoveStage(colName, 'left')}
                                    className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${
                                      canMoveUp 
                                        ? 'hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer' 
                                        : 'text-slate-200 cursor-not-allowed'
                                    }`}
                                  >
                                    <ChevronUp size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    title="Mover para Baixo"
                                    disabled={!canMoveDown}
                                    onClick={() => handleMoveStage(colName, 'right')}
                                    className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${
                                      canMoveDown 
                                        ? 'hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer' 
                                        : 'text-slate-200 cursor-not-allowed'
                                    }`}
                                  >
                                    <ChevronDown size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    title={count > 0 ? "Não é possível excluir (contém candidatos)" : "Excluir etapa"}
                                    disabled={count > 0}
                                    onClick={() => handleDeleteStage(colName)}
                                    className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${
                                      count > 0
                                        ? 'text-slate-200 cursor-not-allowed'
                                        : 'hover:bg-rose-500/10 text-rose-500 hover:text-rose-650 cursor-pointer'
                                    }`}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              )}
                              {isSpecial && (
                                <span className="text-[7.5px] font-black uppercase text-slate-400 tracking-wider bg-slate-100 rounded-md px-1.5 py-0.5 select-none">
                                  Sistema
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="border-t border-slate-100 pt-4 flex justify-end shrink-0">
                        <button
                          type="button"
                          onClick={() => setIsConfiguringStages(false)}
                          className="px-6 py-2 bg-[#8959f5] hover:bg-[#7846e3] text-white rounded-full font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-[#8959f5]/15"
                        >
                          Fechar
                        </button>
                      </div>
                    </motion.div>
                  </div>
                );
              })()
            )}

            {customDialog.isOpen && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    if (customDialog.type !== 'confirm') {
                      setCustomDialog(prev => ({ ...prev, isOpen: false }));
                    }
                  }}
                  className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="relative w-full max-w-sm bg-white rounded-[5px] shadow-2xl p-6 overflow-hidden flex flex-col z-10 text-left border border-slate-100"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      customDialog.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : customDialog.type === 'confirm'
                          ? 'bg-[#8959f5]/10 text-[#8959f5]'
                          : 'bg-amber-50 text-amber-600'
                    }`}>
                      {customDialog.type === 'success' ? (
                        <Check size={20} className="stroke-[2.5]" />
                      ) : customDialog.type === 'confirm' ? (
                        <HelpCircle size={20} className="stroke-[2.5]" />
                      ) : (
                        <AlertTriangle size={20} className="stroke-[2.5]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1 select-none">
                        {customDialog.title || (customDialog.type === 'success' ? 'Sucesso' : customDialog.type === 'confirm' ? 'Confirmação' : 'Aviso')}
                      </h3>
                      <p className="text-[11px] font-semibold text-slate-500 leading-relaxed whitespace-pre-line">
                        {customDialog.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
                    {customDialog.type === 'confirm' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomDialog(prev => ({ ...prev, isOpen: false }));
                            if (customDialog.onCancel) customDialog.onCancel();
                          }}
                          className="px-4 py-2 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border border-slate-200/50 hover:border-slate-300"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (customDialog.onConfirm) customDialog.onConfirm();
                          }}
                          className="px-4 py-2 bg-[#8959f5] hover:bg-[#7846e3] text-white rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-[#8959f5]/15"
                        >
                          Confirmar
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setCustomDialog(prev => ({ ...prev, isOpen: false }))}
                        className="px-6 py-1.8 bg-[#8959f5] hover:bg-[#7846e3] text-white rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-[#8959f5]/15"
                      >
                        Entendido
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>
            )}

            {/* Modal de Sucesso de Cadastro com Link de Compartilhamento */}
          <AnimatePresence>
            {publishedJobLink && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    setPublishedJobLink(null);
                    setRegisterStep(1);
                    setVacancyForm({
                      title: '',
                      modality: 'Presencial',
                      state: '',
                      city: '',
                      remunerationType: 'Mensal',
                      salary: '',
                      hasBonus: false,
                      bonusType: 'Comissão',
                      bonusValue: '',
                      contractType: 'CLT',
                      benefits: {
                        vt: { selected: false, value: '' },
                        va: { selected: false, value: '' },
                        healthInsurance: false,
                        dentalPlan: false
                      },
                      extraBenefits: [] as string[],
                      workSchedule: '5x2',
                      isFirstJob: false,
                      minAge: 18,
                      description: '',
                      requirements: [] as string[],
                      stages: ['Análise de Currículo', 'Entrevista', 'Teste Técnico']
                    });
                    setActiveTab('Minhas Vagas');
                  }}
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 30 }}
                  className="relative w-full max-w-lg bg-white rounded-[5px] shadow-2xl p-8 text-center overflow-hidden border border-slate-100"
                >
                  {/* Confetti decoration */}
                  <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-400 via-primary-500 to-indigo-500" />
                  
                  <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6 mt-2 ring-8 ring-emerald-50">
                    <CheckCircle2 size={36} />
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                    Vaga Publicada com Sucesso!
                  </h3>
                  
                  <p className="text-slate-500 text-sm font-medium mb-8 max-w-sm mx-auto leading-relaxed">
                    Sua vaga já está ativa no sistema. Use o link exclusivo abaixo para atrair candidatos diretamente de suas redes sociais ou canais de comunicação.
                  </p>
                  
                  {/* Share Link Container */}
                  <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 mb-8 flex items-center justify-between gap-3 text-left">
                    <div className="overflow-hidden flex-1">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1">LINK DE DIVULGAÇÃO</p>
                      <p className="text-xs font-bold text-slate-800 truncate select-all">{publishedJobLink}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(publishedJobLink).then(() => {
                          setHasCopiedPublishedLink(true);
                          setTimeout(() => setHasCopiedPublishedLink(false), 3000);
                        });
                      }}
                      className={`px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shrink-0 ${
                        hasCopiedPublishedLink 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/10' 
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      {hasCopiedPublishedLink ? (
                        <><Check size={12} /> Copiado</>
                      ) : (
                        <><Share2 size={12} /> Copiar</>
                      )}
                    </button>
                  </div>
                  
                  <button
                    onClick={() => {
                      setPublishedJobLink(null);
                      setRegisterStep(1);
                      setVacancyForm({
                        title: '',
                        modality: 'Presencial',
                        state: '',
                        city: '',
                        remunerationType: 'Mensal',
                        salary: '',
                        hasBonus: false,
                        bonusType: 'Comissão',
                        bonusValue: '',
                        contractType: 'CLT',
                        benefits: {
                          vt: { selected: false, value: '' },
                          va: { selected: false, value: '' },
                          healthInsurance: false,
                          dentalPlan: false
                        },
                        extraBenefits: [] as string[],
                        workSchedule: '5x2',
                        isFirstJob: false,
                        minAge: 18,
                        description: '',
                        requirements: [] as string[],
                        stages: ['Análise de Currículo', 'Entrevista', 'Teste Técnico']
                      });
                      setActiveTab('Minhas Vagas');
                    }}
                    className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-primary-600/10 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Ir Para Minhas Vagas</span>
                    <ChevronRight size={14} />
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Secondary Candidate Detailed Resume Viewer Modal */}
          <AnimatePresence>
            {selectedResumeApplicant && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedResumeApplicant(null)}
                  className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 30 }}
                  className="relative w-full max-w-4xl bg-white rounded-[5px] shadow-2xl overflow-hidden flex flex-col h-[90vh] border border-slate-100"
                >
                  {/* Cabeçalho de visualização */}
                  <div className="p-6 flex justify-between items-center border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-650">
                        <Eye size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Visualização do Currículo</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Currículo no formato oficial da plataforma</p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button 
                        onClick={handleDownloadResume}
                        disabled={isExportingResume}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#533af6] hover:bg-[#432ec4] text-white rounded-full font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer border-0 outline-none whitespace-nowrap"
                      >
                        {isExportingResume ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                        {isExportingResume ? 'Processando...' : 'Baixar PDF'}
                      </button>
                      <button 
                        onClick={() => setSelectedResumeApplicant(null)} 
                        className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full transition-all cursor-pointer border-0 outline-none flex items-center justify-center w-9 h-9 hover:scale-105 active:scale-95 shadow-sm"
                      >
                        <CloseIcon size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Conteúdo rolável com a folha de currículo A4 em escala */}
                  <div className="flex-1 overflow-y-auto p-8 bg-slate-100 flex justify-center no-scrollbar">
                    <div className="bg-white shadow-2xl w-[210mm] min-h-[297mm] origin-top transform scale-[0.8] sm:scale-[0.9] mb-12">
                      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '297mm', width: '210mm', backgroundColor: '#FFFFFF', position: 'relative', overflow: 'hidden', boxSizing: 'border-box' }}>
                        {/* Header Zone */}
                        <div style={{ backgroundImage: 'linear-gradient(90deg, #5b36ff 0%, #8b6aff 100%)', backgroundColor: '#7044ff', width: '100%', height: '160px', position: 'relative', display: 'flex', alignItems: 'center', boxSizing: 'border-box' }}>
                          {/* Circular Photo */}
                          <div style={{ position: 'absolute', left: '50px', top: '75px', zIndex: 100 }}>
                            <div style={{ width: '170px', height: '170px', borderRadius: '50%', border: '6px solid #FFFFFF', overflow: 'hidden', backgroundColor: '#e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                              {selectedResumeApplicant.profile_pic ? (
                                <img src={selectedResumeApplicant.profile_pic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                                  <User size={60} />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Name Header */}
                          <div style={{ marginLeft: '260px', paddingRight: '40px', flex: 1, textAlign: 'left' }}>
                            <h1 style={{ fontSize: '32px', fontWeight: 900, textTransform: 'uppercase', color: '#FFFFFF', letterSpacing: '2px', margin: 0, paddingBottom: '10px' }}>
                              {selectedResumeApplicant.candidate_name || 'Nome do Candidato'}
                            </h1>
                            <div style={{ width: '100%', height: '2px', backgroundColor: '#FFFFFF' }} />
                          </div>
                        </div>

                        {/* Columns Zone */}
                        <div style={{ display: 'flex', flex: 1, width: '100%', boxSizing: 'border-box' }}>
                          {/* Sidebar Column */}
                          <div style={{ width: '240px', backgroundColor: '#f3f0ff', paddingTop: '110px', paddingLeft: '30px', paddingRight: '30px', paddingBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box', flexShrink: 0 }}>
                            {/* CONTATO SECTION */}
                            <div style={{ width: '100%', textAlign: 'center', marginBottom: '35px' }}>
                              <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#7044ff', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Contato</h3>
                              <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '18px' }} />
                              
                              <div style={{ marginBottom: '15px' }}>
                                <p style={{ fontSize: '10px', fontWeight: 900, color: '#7044ff', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Telefone</p>
                                <p style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0, wordBreak: 'break-all' }}>{parseCandidatePhoneData(selectedResumeApplicant.candidate_phone).phone || '--'}</p>
                              </div>
                              
                              <div style={{ marginBottom: '15px' }}>
                                <p style={{ fontSize: '10px', fontWeight: 900, color: '#7044ff', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 2px 0' }}>E-Mail</p>
                                <p style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0, wordBreak: 'break-all' }}>{selectedResumeApplicant.candidate_email || '--'}</p>
                              </div>
                              
                              <div style={{ marginBottom: '15px' }}>
                                <p style={{ fontSize: '10px', fontWeight: 900, color: '#7044ff', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Cidade</p>
                                <p style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0 }}>{selectedResumeApplicant.city ? `${selectedResumeApplicant.city} - ${selectedResumeApplicant.state || ''}` : '--'}</p>
                              </div>
                              
                              <div>
                                <p style={{ fontSize: '10px', fontWeight: 900, color: '#7044ff', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Idade</p>
                                <p style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0 }}>
                                  {selectedResumeApplicant.talentMatched?.birth_date
                                    ? `${calculateAge(selectedResumeApplicant.talentMatched.birth_date)} anos`
                                    : selectedResumeApplicant.talentMatched?.age 
                                    ? `${selectedResumeApplicant.talentMatched.age} anos`
                                    : '--'
                                  }
                                </p>
                              </div>
                            </div>

                            {/* HABILIDADES SECTION */}
                            {selectedResumeApplicant.talentMatched?.skills && selectedResumeApplicant.talentMatched.skills.length > 0 && (
                              <div style={{ width: '100%' }}>
                                <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#7044ff', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 6px 0', textAlign: 'center' }}>Habilidades</h3>
                                <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '18px' }} />
                                
                                <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start', width: '100%' }}>
                                  {selectedResumeApplicant.talentMatched.skills.map((skill: string, index: number) => (
                                    <li key={index} style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0, paddingLeft: '5px', textAlign: 'left' }}>
                                      • {skill}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Main Content Column */}
                          <div style={{ flex: 1, padding: '40px 40px 40px 35px', display: 'flex', flexDirection: 'column', textAlign: 'left', boxSizing: 'border-box' }}>
                            {/* PERFIL SECTION */}
                            <div style={{ marginBottom: '32px' }}>
                              <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#000000', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Perfil</h2>
                              <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '16px' }} />
                              <p style={{ fontSize: '12.5px', lineHeight: 1.6, color: '#334155', margin: 0, textAlign: 'justify', whiteSpace: 'pre-line' }}>
                                {selectedResumeApplicant.talentMatched?.summary || selectedResumeApplicant.summary || 'Resumo profissional não preenchido.'}
                              </p>
                            </div>

                            {/* EXPERIÊNCIAS SECTION */}
                            {selectedResumeApplicant.talentMatched?.experiences && selectedResumeApplicant.talentMatched.experiences.length > 0 && (
                              <div style={{ marginBottom: '32px' }}>
                                <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#000000', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Experiências</h2>
                                <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '16px' }} />
                                <div>
                                  {selectedResumeApplicant.talentMatched.experiences.map((exp: any, idx: number) => (
                                    <div key={idx} style={{ marginBottom: '24px' }}>
                                      <h4 style={{ fontSize: '12px', fontWeight: 900, color: '#000000', textTransform: 'uppercase', margin: '0 0 4px 0' }}>{exp.role}</h4>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#000000' }}>{exp.company}</span>
                                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#000000' }}>{exp.duration || 'N/A'}</span>
                                      </div>
                                      <p style={{ fontSize: '12px', lineHeight: 1.6, color: '#475569', margin: 0, whiteSpace: 'pre-line', textAlign: 'justify' }}>
                                        {exp.description}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* EDUCAÇÃO SECTION */}
                            {selectedResumeApplicant.talentMatched?.educations && selectedResumeApplicant.talentMatched.educations.length > 0 && (
                              <div style={{ marginBottom: '32px' }}>
                                <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#000000', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Educação</h2>
                                <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '16px' }} />
                                <div>
                                  {selectedResumeApplicant.talentMatched.educations.map((edu: any, idx: number) => (
                                    <div key={idx} style={{ marginBottom: '20px' }}>
                                      <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#000000', margin: '0 0 4px 0' }}>{edu.course}</h4>
                                      <p style={{ fontSize: '11px', fontWeight: 700, color: '#000000', letterSpacing: '0.5px', textTransform: 'uppercase', margin: '0 0 4px 0' }}>
                                        {edu.gradYear || ''} - {edu.status}
                                      </p>
                                      <p style={{ fontSize: '12px', color: '#334155', margin: 0 }}>{edu.institution}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* DISC Report Detailed Viewer Modal */}
          <AnimatePresence>
            {selectedDiscResult && (
              <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedDiscResult(null)}
                  className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
                />
                <motion.div 
                  ref={discModalRef}
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 30 }}
                  className="relative w-full max-w-2xl bg-white rounded-[5px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100"
                >
                  {/* Modal Header */}
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                        <Award size={24} />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-slate-900 uppercase tracking-tight leading-tight">
                          Relatório DISC 5.0
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-0.5">
                            Candidato: {selectedDiscResult.applicantName}
                          </p>
                          <span className="text-[10px] text-slate-300 font-bold">•</span>
                          <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest flex items-center gap-1">
                            <Clock size={10} /> Realizado em: {formatDate(selectedDiscResult.completedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button 
                        onClick={() => handleExportModalToPDF(discModalRef, `DISC_${selectedDiscResult.applicantName}`)}
                        disabled={isExportingTestPDF}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#533af6] hover:bg-[#432ec4] text-white rounded-full font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer border-0 outline-none whitespace-nowrap"
                      >
                        {isExportingTestPDF ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                        {isExportingTestPDF ? 'Gerando...' : 'Baixar PDF'}
                      </button>
                      <button 
                        onClick={() => setSelectedDiscResult(null)} 
                        className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full transition-all cursor-pointer border border-slate-100 hover:scale-105 active:scale-95 shadow-sm outline-none flex items-center justify-center w-9 h-9"
                      >
                        <CloseIcon size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Modal Body */}
                  <div className="flex-1 overflow-y-auto no-scrollbar p-7 sm:p-9 space-y-8 text-left font-sans">
                    {(() => {
                      const { D, I, S, C } = selectedDiscResult;
                      const scoresList = [
                        { key: 'D' as const, label: 'Dominância (D)', val: D, color: 'bg-rose-500', textColor: 'text-rose-600', classColor: 'text-rose-600 bg-rose-50 border-rose-100', profile: perfisDISC.D },
                        { key: 'I' as const, label: 'Influência (I)', val: I, color: 'bg-indigo-500', textColor: 'text-indigo-600', classColor: 'text-indigo-600 bg-indigo-50 border-indigo-100', profile: perfisDISC.I },
                        { key: 'S' as const, label: 'Estabilidade (S)', val: S, color: 'bg-emerald-500', textColor: 'text-emerald-600', classColor: 'text-emerald-600 bg-emerald-50 border-emerald-100', profile: perfisDISC.S },
                        { key: 'C' as const, label: 'Conformidade (C)', val: C, color: 'bg-amber-500', textColor: 'text-amber-600', classColor: 'text-amber-600 bg-amber-50 border-amber-100', profile: perfisDISC.C }
                      ];

                      const sortedScores = [...scoresList].sort((a, b) => b.val - a.val);
                      const predominant = sortedScores[0];
                      const secondary = sortedScores[1];

                      // Combination Logic
                      const k1 = predominant.key;
                      const k2 = secondary.key;
                      let combinationText = "";
                      if ((k1 === 'D' && k2 === 'I') || (k1 === 'I' && k2 === 'D')) {
                        combinationText = "Líder comunicador, persuasivo e competitivo.";
                      } else if ((k1 === 'D' && k2 === 'C') || (k1 === 'C' && k2 === 'D')) {
                        combinationText = "Estratégico, exigente e focado em alta performance.";
                      } else if ((k1 === 'I' && k2 === 'S') || (k1 === 'S' && k2 === 'I')) {
                        combinationText = "Comunicador empático e colaborativo.";
                      } else if ((k1 === 'S' && k2 === 'C') || (k1 === 'C' && k2 === 'S')) {
                        combinationText = "Organizado, confiável e analítico.";
                      } else if ((k1 === 'D' && k2 === 'S') || (k1 === 'S' && k2 === 'D')) {
                        combinationText = "Liderança equilibrada e firme.";
                      } else if ((k1 === 'I' && k2 === 'C') || (k1 === 'C' && k2 === 'I')) {
                        combinationText = "Criativo com pensamento analítico.";
                      }

                      const getClassificationBand = (v: number) => {
                        if (v <= 39) return { label: "Baixa tendência", color: "text-slate-400 bg-slate-50 border-slate-200" };
                        if (v <= 69) return { label: "Tendência moderada", color: "text-amber-600 bg-amber-50 border-amber-200" };
                        return { label: "Perfil muito forte e predominante", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
                      };

                      return (
                        <div className="space-y-6">
                          {/* Resumo dos Perfis */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className={`p-5 rounded-[5px] border ${predominant.classColor} text-left`}>
                              <span className="text-[9px] font-black uppercase tracking-widest opacity-80">Perfil Predominante</span>
                              <h3 className="text-lg font-black tracking-tight mt-1">{predominant.profile.nome}</h3>
                              <p className="text-xs font-semibold leading-relaxed mt-2 opacity-90">{predominant.profile.desc}</p>
                            </div>
                            <div className={`p-5 rounded-[5px] border ${secondary.classColor} text-left`}>
                              <span className="text-[9px] font-black uppercase tracking-widest opacity-80">Perfil Secundário</span>
                              <h3 className="text-lg font-black tracking-tight mt-1">{secondary.profile.nome}</h3>
                              <p className="text-xs font-semibold leading-relaxed mt-2 opacity-90">{secondary.profile.desc}</p>
                            </div>
                          </div>

                          {/* Combinação de Perfil */}
                          {combinationText && (
                            <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-[5px] text-left">
                              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500">Combinação de Perfil</span>
                              <h4 className="text-sm font-black text-indigo-950 mt-1">{predominant.profile.label} + {secondary.profile.label}</h4>
                              <p className="text-xs font-bold text-indigo-800/90 mt-1 leading-relaxed">{combinationText}</p>
                            </div>
                          )}

                          {/* Gráfico e Classificação */}
                          <div className="bg-slate-50/60 border border-slate-100 p-5 rounded-[5px] space-y-4">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> Equilíbrio dos Fatores (DISC)
                            </h5>
                            <div className="space-y-4">
                              {scoresList.map(f => {
                                const band = getClassificationBand(f.val);
                                return (
                                  <div key={f.key} className="space-y-1">
                                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-700">
                                      <div className="flex items-center gap-2">
                                        <span className="font-black uppercase tracking-wider">{f.label}</span>
                                        <span className={`px-2 py-0.5 rounded-[5px] text-[8.5px] font-black border uppercase tracking-wider ${band.color}`}>
                                          {band.label}
                                        </span>
                                      </div>
                                      <span className="font-black text-xs text-slate-900">{f.val}%</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-100 rounded-[3px] overflow-hidden shadow-inner border border-slate-200/50">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${f.val}%` }}
                                        transition={{ duration: 0.8, ease: 'easeOut' }}
                                        className={`h-full ${f.color} rounded-[3px]`}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Detalhes do Perfil Predominante */}
                          <div className="border border-slate-100 rounded-[5px] p-6 space-y-6 bg-white shadow-sm text-left">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-50 pb-2">
                              Detalhamento: {predominant.profile.label}
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div className="space-y-1.5">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Características</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {predominant.profile.caracteristicas.map((c, i) => (
                                    <span key={i} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-[5px] text-[10px] font-bold text-slate-700">
                                      {c}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Pontos Fortes</span>
                                <div className="space-y-1.5 mt-1">
                                  {predominant.profile.pontosFortes.map((pf, i) => (
                                    <div key={i} className="flex items-start gap-2 text-[11px] font-bold text-slate-600 leading-tight">
                                      <Check className="text-emerald-500 shrink-0 mt-0.5" size={12} />
                                      <span>{pf}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <span className="text-[9px] font-black uppercase tracking-widest text-amber-500">Pontos de Atenção</span>
                                <div className="space-y-1.5 mt-1">
                                  {predominant.profile.pontosAtencao.map((pa, i) => (
                                    <div key={i} className="flex items-start gap-2 text-[11px] font-bold text-slate-600 leading-tight">
                                      <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={12} />
                                      <span>{pa}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500">Motivadores</span>
                                <div className="space-y-1.5 mt-1">
                                  {predominant.profile.motivadores.map((m, i) => (
                                    <div key={i} className="flex items-start gap-2 text-[11px] font-bold text-slate-600 leading-tight">
                                      <Zap className="text-indigo-500 shrink-0 mt-0.5" size={12} />
                                      <span>{m}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-1.5 md:col-span-2 border-t border-slate-50 pt-3">
                                <span className="text-[9px] font-black uppercase tracking-widest text-rose-500">Sob Pressão</span>
                                <div className="space-y-1.5 mt-1">
                                  {predominant.profile.sobPressao.map((sp, i) => (
                                    <div key={i} className="flex items-start gap-2 text-[11px] font-bold text-slate-600 leading-tight">
                                      <Activity className="text-rose-500 shrink-0 mt-0.5" size={12} />
                                      <span>{sp}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Modal Footer */}
                  <div className="p-7 border-t border-slate-100 bg-slate-50/50 flex justify-center items-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider text-center">
                      metodologia disc 5.0 • relatório comportamental
                    </p>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Modal de Anotações sobre o Candidato */}
          <AnimatePresence>
            {isNotesModalOpen && selectedApplicantForNotes && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    if (!isSavingNotes) {
                      setIsNotesModalOpen(false);
                      setSelectedApplicantForNotes(null);
                    }
                  }}
                  className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 30 }}
                  className="relative w-full max-w-lg bg-white rounded-[5px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100"
                >
                  {/* Modal Header */}
                  <div className="p-7 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-highlight-50 rounded-2xl flex items-center justify-center text-highlight-600 shadow-sm shrink-0 border border-highlight-100">
                        <StickyNote size={22} className="text-highlight-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight">
                          Anotações de Recrutamento
                        </h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5 truncate max-w-[260px]">
                          Candidato: {selectedApplicantForNotes.candidate_name || selectedApplicantForNotes.name}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        if (!isSavingNotes) {
                          setIsNotesModalOpen(false);
                          setSelectedApplicantForNotes(null);
                        }
                      }} 
                      disabled={isSavingNotes}
                      className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full transition-all cursor-pointer border border-slate-100 hover:scale-105 active:scale-95 shadow-sm outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-9 h-9"
                    >
                      <CloseIcon size={16} />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="flex-1 p-7 sm:p-9 space-y-4 text-left font-sans">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                        Observações sobre o perfil e entrevista
                      </label>
                      <textarea
                        value={tempNotesText}
                        onChange={(e) => setTempNotesText(e.target.value)}
                        placeholder="Digite aqui pontos fortes, observações técnicas, expectativas de contratação ou impressões gerais da entrevista do candidato..."
                        className="w-full h-44 px-4 py-3 text-xs font-bold text-slate-700 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-highlight-500 focus:border-highlight-500 resize-none transition-all placeholder:text-slate-400"
                        maxLength={1500}
                      />
                      <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        <span>Anotações privadas da empresa</span>
                        <span>{tempNotesText.length}/1500 caracteres</span>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-7 border-t border-slate-100 bg-slate-50/50 flex justify-end items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsNotesModalOpen(false);
                        setSelectedApplicantForNotes(null);
                      }}
                      disabled={isSavingNotes}
                      className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-black text-[10px] uppercase tracking-widest rounded-full transition-all disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="button"
                      onClick={handleSaveNotes}
                      disabled={isSavingNotes}
                      className="px-8 py-3 bg-gradient-to-r from-primary-600 to-highlight-600 text-white font-black text-[10px] uppercase tracking-widest rounded-full shadow-lg shadow-highlight-100 hover:shadow-highlight-200/50 hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                    >
                      {isSavingNotes ? (
                        <>
                          <Loader2 size={12} className="animate-spin" /> Salvando...
                        </>
                      ) : 'Salvar Anotações'}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Modal de Visualização de Respostas do Mapeamento de Perfil */}
          <AnimatePresence>
            {isQuestionsModalOpen && selectedApplicantForQuestions && (
              <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    setIsQuestionsModalOpen(false);
                    setSelectedApplicantForQuestions(null);
                  }}
                  className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
                />
                <motion.div 
                  ref={questionsModalRef}
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 30 }}
                  className="relative w-full max-w-4xl bg-white rounded-[5px] shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-slate-100"
                >
                  {/* Modal Header */}
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0 border border-indigo-100" style={{ borderColor: 'rgba(83, 58, 246, 0.2)' }}>
                        <FileText size={22} style={{ color: '#533af6' }} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight">
                          Mapeamento de Perfil
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-0.5">
                            Candidato: {selectedApplicantForQuestions.candidate_name || selectedApplicantForQuestions.name}
                          </p>
                          <span className="text-[10px] text-slate-300 font-bold">•</span>
                          <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest flex items-center gap-1">
                            <Clock size={10} /> Realizado em: {formatDate(selectedApplicantForQuestions.completedAt || selectedApplicantForQuestions.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button 
                        onClick={() => handleExportModalToPDF(questionsModalRef, `Mapeamento_Perfil_${selectedApplicantForQuestions.candidate_name || selectedApplicantForQuestions.name}`)}
                        disabled={isExportingTestPDF}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#533af6] hover:bg-[#432ec4] text-white rounded-full font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer border-0 outline-none whitespace-nowrap"
                      >
                        {isExportingTestPDF ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                        {isExportingTestPDF ? 'Gerando...' : 'Baixar PDF'}
                      </button>
                      <button 
                        onClick={() => {
                          setIsQuestionsModalOpen(false);
                          setSelectedApplicantForQuestions(null);
                        }} 
                        className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full transition-all cursor-pointer border border-slate-100 hover:scale-105 active:scale-95 shadow-sm outline-none flex items-center justify-center w-9 h-9"
                      >
                        <CloseIcon size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Tabs Selector */}
                  <div className="flex border-b border-slate-100 bg-white px-6 py-2 overflow-x-auto gap-2 shrink-0 no-scrollbar">
                    {Object.entries(QUESTIONS_CATEGORIES).map(([key, cat]) => {
                      const isActive = activeCategoryTab === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setActiveCategoryTab(key)}
                          className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all whitespace-nowrap outline-none cursor-pointer ${
                            isActive 
                              ? 'bg-indigo-50 text-indigo-700 shadow-sm border' 
                              : 'text-slate-500 hover:bg-slate-50'
                          }`}
                          style={isActive ? { 
                            backgroundColor: 'rgba(83, 58, 246, 0.08)', 
                            color: '#533af6',
                            borderColor: 'rgba(83, 58, 246, 0.2)'
                          } : {}}
                        >
                          {cat.title}
                        </button>
                      );
                    })}
                  </div>

                  {/* Modal Body (Scrollable) */}
                  <div className="flex-1 overflow-y-auto no-scrollbar p-6 sm:p-8 space-y-6 text-left font-sans bg-slate-50/30">
                    {(() => {
                      const category = QUESTIONS_CATEGORIES[activeCategoryTab as keyof typeof QUESTIONS_CATEGORIES];
                      if (!category) return null;

                      const responses = selectedApplicantForQuestions.questionsResponses || {};

                      return (
                        <div className="space-y-4">
                          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                            {category.title}
                          </h3>
                          
                          <div className="space-y-4">
                            {category.questions.map((question: string, index: number) => {
                              // Achar o índice global da pergunta para bater com a resposta salva
                              const globalIndex = ALL_QUESTIONS_LIST.indexOf(question);
                              const responseText = responses[globalIndex] || responses[globalIndex.toString()] || 'Nenhuma resposta enviada para esta pergunta.';

                              return (
                                <div 
                                  key={index} 
                                  className="bg-white p-5 rounded-[5px] border border-slate-100 shadow-xs space-y-2 hover:border-slate-200 transition-all text-left"
                                >
                                  <div className="flex items-start gap-3">
                                    <span 
                                      className="flex items-center justify-center w-6 h-6 rounded-[5px] text-[10px] font-black shrink-0 text-white" 
                                      style={{ backgroundColor: '#533af6' }}
                                    >
                                      {globalIndex + 1}
                                    </span>
                                    <h4 className="text-xs font-bold text-slate-800 leading-normal pt-0.5">
                                      {question}
                                    </h4>
                                  </div>
                                  
                                  <div className="pl-9 border-l-2 border-slate-100 mt-2">
                                    <p className="text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
                                      {responseText}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Modal Footer */}
                  <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-center items-center shrink-0">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider text-center">
                      Mapeamento de Perfil • 20 Perguntas
                    </p>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Modal do Questionário Customizado */}
          <AnimatePresence>
            {isCustomTestModalOpen && selectedApplicantForCustomTest && (
              <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    setIsCustomTestModalOpen(false);
                    setSelectedApplicantForCustomTest(null);
                  }}
                  className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
                />
                <motion.div 
                  ref={customTestModalRef}
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 30 }}
                  className="relative w-full max-w-3xl bg-white rounded-[5px] shadow-2xl overflow-hidden flex flex-col h-[80vh] border border-slate-100"
                >
                  {/* Modal Header */}
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm shrink-0 border border-emerald-100" style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                        <FileText size={22} className="text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight">
                          {(() => {
                            const parsedData = parseCandidatePhoneData(selectedApplicantForCustomTest.candidate_phone || '');
                            if (parsedData.customTest && parsedData.customTest.includes(':::')) {
                              try {
                                const parts = parsedData.customTest.split(':::');
                                const parsedObj = JSON.parse(parts.slice(1).join(':::'));
                                return parsedObj.title || 'Questionário Customizado';
                              } catch (e) {}
                            }
                            return 'Questionário Customizado';
                          })()}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-0.5">
                            Candidato: {selectedApplicantForCustomTest.candidate_name || selectedApplicantForCustomTest.name}
                          </p>
                          <span className="text-[10px] text-slate-300 font-bold">•</span>
                          <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest flex items-center gap-1">
                            <Clock size={10} /> Realizado em: {formatDate(selectedApplicantForCustomTest.completedAt || selectedApplicantForCustomTest.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button 
                        onClick={() => {
                          const parsedData = parseCandidatePhoneData(selectedApplicantForCustomTest.candidate_phone || '');
                          let title = 'Questionario_Customizado';
                          if (parsedData.customTest && parsedData.customTest.includes(':::')) {
                            try {
                              const parts = parsedData.customTest.split(':::');
                              const parsedObj = JSON.parse(parts.slice(1).join(':::'));
                              title = parsedObj.title || title;
                            } catch (e) {}
                          }
                          handleExportModalToPDF(customTestModalRef, `${title}_${selectedApplicantForCustomTest.candidate_name || selectedApplicantForCustomTest.name}`);
                        }}
                        disabled={isExportingTestPDF}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#533af6] hover:bg-[#432ec4] text-white rounded-full font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer border-0 outline-none whitespace-nowrap"
                      >
                        {isExportingTestPDF ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                        {isExportingTestPDF ? 'Gerando...' : 'Baixar PDF'}
                      </button>
                      <button 
                        onClick={() => {
                          setIsCustomTestModalOpen(false);
                          setSelectedApplicantForCustomTest(null);
                        }} 
                        className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full transition-all cursor-pointer border border-slate-100 hover:scale-105 active:scale-95 shadow-sm outline-none flex items-center justify-center w-9 h-9"
                      >
                        <CloseIcon size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Modal Body (Scrollable) */}
                  <div className="flex-1 overflow-y-auto no-scrollbar p-6 sm:p-8 space-y-6 text-left font-sans bg-slate-50/30">
                    {(() => {
                      const parsedData = parseCandidatePhoneData(selectedApplicantForCustomTest.candidate_phone || '');
                      let customQuestionsList: any[] = [];
                      let responses: Record<string, string> = {};

                      if (parsedData.customTest) {
                        if (parsedData.customTest.includes(':::')) {
                          const parts = parsedData.customTest.split(':::');
                          const jsonPart = parts.slice(1).join(':::');
                          try {
                            const parsedObj = JSON.parse(jsonPart);
                            customQuestionsList = parsedObj.questions || [];
                            responses = parsedObj.responses || {};
                          } catch (e) {
                            console.error('Erro ao ler JSON do teste customizado:', e);
                          }
                        } else if (parsedData.customTest.startsWith('COMPLETED===')) {
                          const jobDesc = selectedJob?.description || '';
                          customQuestionsList = getCustomQuestionsFromJobDescription(jobDesc);
                          try {
                            const jsonContent = parsedData.customTest.replace('COMPLETED===', '');
                            const parsedObj = JSON.parse(jsonContent);
                            responses = parsedObj.responses || parsedObj || {};
                          } catch (e) {
                            console.error('Erro ao ler respostas customizadas legadas:', e);
                          }
                        }
                      }

                      if (customQuestionsList.length === 0) {
                        return (
                          <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3">
                              <FileText size={20} />
                            </div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Perguntas não encontradas</p>
                            <p className="text-[10px] text-slate-400 mt-1 max-w-[280px]">Nenhuma pergunta customizada está associada a esta vaga no momento.</p>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-4">
                          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                            Respostas do Candidato ({customQuestionsList.length} Perguntas)
                          </h3>
                          
                          <div className="space-y-5">
                            {customQuestionsList.map((q: any, index: number) => {
                              const candidateAnswer = responses[q.id] || 'Sem resposta.';

                              return (
                                <div 
                                  key={q.id} 
                                  className="bg-white p-5 rounded-[5px] border border-slate-100 shadow-xs space-y-3 hover:border-slate-200 transition-all text-left"
                                >
                                  <div className="flex items-start gap-3">
                                    <span 
                                      className="flex items-center justify-center w-6 h-6 rounded-[5px] text-[10px] font-black shrink-0 text-white" 
                                      style={{ backgroundColor: '#10b981' }}
                                    >
                                      {index + 1}
                                    </span>
                                    <div>
                                      <h4 className="text-xs font-bold text-slate-800 leading-normal pt-0.5">
                                        {q.question}
                                      </h4>
                                      <span className={`inline-block px-1.5 py-0.5 rounded-[5px] text-[7px] font-black uppercase tracking-wider mt-1 ${
                                        q.type === 'choice' 
                                          ? 'bg-primary-50 text-primary-600' 
                                          : 'bg-amber-50 text-amber-600'
                                      }`}>
                                        {q.type === 'choice' ? 'Múltipla Escolha' : 'Texto Aberto'}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div className="pl-9 border-l-2 border-slate-100 mt-2 space-y-2">
                                    {q.type === 'choice' ? (
                                      <div className="space-y-1.5">
                                        {(q.options || []).map((opt: string, oIdx: number) => {
                                          const isSelected = opt === candidateAnswer;
                                          return (
                                            <div 
                                              key={oIdx} 
                                              className={`p-2.5 rounded-[5px] border text-xs font-semibold flex items-center justify-between ${
                                                isSelected 
                                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-extrabold' 
                                                  : 'bg-slate-50/50 border-slate-100 text-slate-500'
                                              }`}
                                            >
                                              <span className="flex items-center gap-2">
                                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                                  isSelected 
                                                    ? 'bg-emerald-500 text-white' 
                                                    : 'bg-white border border-slate-200 text-slate-400'
                                                }`}>
                                                  {String.fromCharCode(65 + oIdx)}
                                                </span>
                                                {opt}
                                              </span>
                                              {isSelected && <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    ) : (
                                      <div className="bg-slate-50/50 p-4 rounded-[5px] border border-slate-100">
                                        <p className="text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
                                          {candidateAnswer}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Modal Footer */}
                  <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-center items-center shrink-0">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider text-center">
                      Questionário Customizado da Vaga
                    </p>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Modal de Relatório Premium do MBTI */}
          <AnimatePresence>
            {isMbtiModalOpen && selectedMbtiResult && (
              <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    setIsMbtiModalOpen(false);
                    setSelectedMbtiResult(null);
                  }}
                  className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
                />
                <motion.div 
                  ref={mbtiModalRef}
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 30 }}
                  className="relative w-full max-w-4xl bg-white rounded-[5px] shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-slate-100"
                >
                  {/* Modal Header */}
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-violet-50 border border-violet-100 rounded-2xl flex items-center justify-center text-violet-600 shadow-sm shrink-0">
                        <Sparkles size={22} className="text-violet-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight">
                          Relatório de Personalidade MBTI
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-0.5">
                            Candidato: {selectedMbtiResult.applicantName}
                          </p>
                          <span className="text-[10px] text-slate-300 font-bold">•</span>
                          <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest flex items-center gap-1">
                            <Clock size={10} /> Realizado em: {formatDate(selectedMbtiResult.completedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button 
                        onClick={() => handleExportModalToPDF(mbtiModalRef, `MBTI_${selectedMbtiResult.applicantName}`)}
                        disabled={isExportingTestPDF}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#533af6] hover:bg-[#432ec4] text-white rounded-full font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer border-0 outline-none whitespace-nowrap"
                      >
                        {isExportingTestPDF ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                        {isExportingTestPDF ? 'Gerando...' : 'Baixar PDF'}
                      </button>
                      <button 
                        onClick={() => {
                          setIsMbtiModalOpen(false);
                          setSelectedMbtiResult(null);
                        }} 
                        className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full transition-all cursor-pointer border border-slate-100 hover:scale-105 active:scale-95 shadow-sm outline-none flex items-center justify-center w-9 h-9"
                      >
                        <CloseIcon size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Tabs Selector */}
                  <div className="flex border-b border-slate-100 bg-white px-6 py-2 overflow-x-auto gap-2 shrink-0 no-scrollbar">
                    {(['PERFIL', 'DIMENSOES', 'AUDITORIA'] as const).map((tab) => {
                      const isActive = activeMbtiTab === tab;
                      const labels = {
                        PERFIL: 'Análise de Perfil',
                        DIMENSOES: 'Gráfico de Dimensões',
                        AUDITORIA: 'Auditoria de Respostas'
                      };
                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveMbtiTab(tab)}
                          className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-full transition-all whitespace-nowrap outline-none cursor-pointer ${
                            isActive 
                              ? 'bg-violet-50 text-violet-700 shadow-sm border' 
                              : 'text-slate-500 hover:bg-slate-50'
                          }`}
                          style={isActive ? { 
                            backgroundColor: 'rgba(139, 92, 246, 0.08)', 
                            color: '#7c3aed',
                            borderColor: 'rgba(139, 92, 246, 0.2)'
                          } : {}}
                        >
                          {labels[tab]}
                        </button>
                      );
                    })}
                  </div>

                  {/* Modal Body (Scrollable) */}
                  <div className="flex-1 overflow-y-auto no-scrollbar p-6 sm:p-8 space-y-6 text-left font-sans bg-slate-50/30">
                    {(() => {
                      const profileType = selectedMbtiResult.type;
                      const scores = selectedMbtiResult.scores || { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
                      const answers = selectedMbtiResult.answers || [];
                      const profile = MBTI_PROFILES[profileType];

                      if (activeMbtiTab === 'PERFIL') {
                        if (!profile) {
                          return (
                            <div className="text-center py-10 font-bold text-slate-500">
                              Perfil comportamental não encontrado ou tipo inválido ({profileType}).
                            </div>
                          );
                        }

                        return (
                          <div className="space-y-6">
                            {/* Profile Highlight Card */}
                            <div className={`p-6 rounded-[5px] border ${profile.borderColor} bg-white shadow-sm space-y-4 text-left`}>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                  <span className={`inline-block px-3 py-1 rounded-[5px] text-[10px] font-extrabold uppercase tracking-wider ${profile.classColor} mb-2`}>
                                    Grupo: {profile.categoria}
                                  </span>
                                  <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">
                                    {profile.nome} - {profile.titulo}
                                  </h3>
                                </div>
                                <div className="flex items-center justify-center h-14 w-24 rounded-[5px] bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-xl font-black shadow-lg shrink-0">
                                  {profile.nome}
                                </div>
                              </div>
                              <p className="text-xs font-medium text-slate-600 leading-relaxed">
                                {profile.desc}
                              </p>
                              
                              {/* Characteristics Tag List */}
                              <div className="space-y-1.5 pt-2">
                                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Características Chave</h4>
                                <div className="flex flex-wrap gap-1.5">
                                  {profile.caracteristicas.map((char, index) => (
                                    <span key={index} className="px-2.5 py-0.5 rounded-[5px] text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/50">
                                      {char}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Strengths & Weaknesses (Side by Side) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                              {/* Strengths */}
                              <div className="bg-white p-6 rounded-[5px] border border-slate-100 shadow-sm space-y-3">
                                <h4 className="text-xs font-black text-emerald-700 uppercase tracking-widest flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Pontos Fortes
                                </h4>
                                <div className="space-y-2 mt-1">
                                  {profile.pontosFortes.map((ponto, index) => (
                                    <div key={index} className="text-xs font-bold text-slate-600 flex items-start gap-2 leading-relaxed">
                                      <Check className="text-emerald-500 shrink-0 mt-0.5" size={12} />
                                      <span>{ponto}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Weaknesses */}
                              <div className="bg-white p-6 rounded-[5px] border border-slate-100 shadow-sm space-y-3">
                                <h4 className="text-xs font-black text-rose-700 uppercase tracking-widest flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Pontos de Atenção
                                </h4>
                                <div className="space-y-2 mt-1">
                                  {profile.pontosAtencao.map((ponto, index) => (
                                    <div key={index} className="text-xs font-bold text-slate-600 flex items-start gap-2 leading-relaxed">
                                      <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={12} />
                                      <span>{ponto}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      if (activeMbtiTab === 'DIMENSOES') {
                        // Helper to render double progress bar
                        const renderBilateralBar = (
                          leftLabel: string, leftKey: string,
                          rightLabel: string, rightKey: string,
                          desc: string
                        ) => {
                          const leftVal = scores[leftKey] || 0;
                          const rightVal = scores[rightKey] || 0;
                          const total = leftVal + rightVal;
                          const pctLeft = total > 0 ? (leftVal / total) * 100 : 50;
                          const pctRight = total > 0 ? (rightVal / total) * 100 : 50;
                          const isLeftDominant = leftVal >= rightVal;

                          return (
                            <div className="bg-white p-6 rounded-[5px] border border-slate-100 shadow-sm space-y-4 text-left">
                              <div className="flex justify-between items-end">
                                <div className="text-left">
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Dimensão</span>
                                  <span className={`text-sm font-extrabold uppercase ${isLeftDominant ? 'text-violet-600' : 'text-slate-500'}`}>
                                    {leftLabel} ({leftVal} pts)
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Dimensão</span>
                                  <span className={`text-sm font-extrabold uppercase ${!isLeftDominant ? 'text-violet-600' : 'text-slate-500'}`}>
                                    {rightLabel} ({rightVal} pts)
                                  </span>
                                </div>
                              </div>

                              {/* Double Horizontal Progress Bar */}
                              <div className="space-y-1.5">
                                <div className="h-4 w-full bg-slate-100 rounded-[3px] overflow-hidden flex border border-slate-200/50 p-0.5 gap-0.5">
                                  <div 
                                    className={`h-full rounded-l-[3px] transition-all duration-500 ${isLeftDominant ? 'bg-gradient-to-r from-violet-500 to-indigo-500' : 'bg-slate-300'}`} 
                                    style={{ width: `${pctLeft}%` }} 
                                  />
                                  <div 
                                    className={`h-full rounded-r-[3px] transition-all duration-500 ${!isLeftDominant ? 'bg-gradient-to-r from-indigo-500 to-violet-500' : 'bg-slate-300'}`} 
                                    style={{ width: `${pctRight}%` }} 
                                  />
                                </div>
                                <div className="flex justify-between text-[9px] font-black uppercase text-slate-400 px-1">
                                  <span>{Math.round(pctLeft)}% dominante</span>
                                  <span>{Math.round(pctRight)}% dominante</span>
                                </div>
                              </div>

                              <p className="text-[10px] font-medium text-slate-500 italic leading-relaxed border-t border-slate-50 pt-2.5">
                                {desc}
                              </p>
                            </div>
                          );
                        };

                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {renderBilateralBar(
                              "Extroversão (E)", "E",
                              "Introversão (I)", "I",
                              "Mede como o candidato direciona sua energia. Extroversão prefere interações sociais e ação. Introversão prefere reflexão e privacidade."
                            )}
                            {renderBilateralBar(
                              "Sensação (S)", "S",
                              "Intuição (N)", "N",
                              "Mede como o candidato processa informações. Sensação foca em fatos, detalhes e realismo prático. Intuição foca em conexões, conceitos e possibilidades futuras."
                            )}
                            {renderBilateralBar(
                              "Pensamento (T)", "T",
                              "Sentimento (F)", "F",
                              "Mede como o candidato toma decisões. Pensamento decide pela lógica e consistência objetiva. Sentimento decide por valores pessoais e harmonia nos relacionamentos."
                            )}
                            {renderBilateralBar(
                              "Julgamento (J)", "J",
                              "Percepção (P)", "P",
                              "Mede como o candidato organiza o estilo de vida. Julgamento prefere regras, planos definidos e conclusão rápida. Percepção prefere flexibilidade, improviso e opções abertas."
                            )}
                          </div>
                        );
                      }

                      if (activeMbtiTab === 'AUDITORIA') {
                        return (
                          <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                              Auditoria Detalhada de Respostas
                            </h3>

                            <div className="space-y-4">
                              {MBTI_QUESTIONS.map((question) => {
                                // Find candidate score for this question
                                const answer = answers.find((ans: any) => ans.q === question.id);
                                const scoreA = answer ? answer.a : 0;
                                const scoreB = answer ? answer.b : 0;

                                return (
                                  <div 
                                    key={question.id} 
                                    className="bg-white p-5 rounded-[5px] border border-slate-100 shadow-xs space-y-3 hover:border-slate-200 transition-all text-left"
                                  >
                                    <div className="flex items-start gap-3">
                                      <span className="flex items-center justify-center w-6 h-6 rounded-[5px] text-[10px] font-black shrink-0 text-white bg-violet-600">
                                        {question.id}
                                      </span>
                                      <h4 className="text-xs font-bold text-slate-800 leading-normal pt-0.5">
                                        {question.text}
                                      </h4>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-9">
                                      {/* Alternativa A */}
                                      <div 
                                        className={`p-3 rounded-[5px] border transition-all text-[11px] leading-relaxed flex flex-col justify-between gap-1.5 ${
                                          scoreA === 3 
                                            ? 'bg-violet-50/80 border-violet-300 text-violet-900 shadow-2xs' 
                                            : scoreA === 2 
                                            ? 'bg-violet-50/40 border-violet-200 text-violet-800' 
                                            : scoreA === 1 
                                            ? 'bg-slate-50/70 border-slate-200 text-slate-700' 
                                            : 'bg-white border-slate-100 text-slate-400'
                                        }`}
                                      >
                                        <div className="font-bold flex justify-between items-start">
                                          <span>A) {question.optionA.text}</span>
                                          <span className="text-[7.5px] bg-slate-200/80 text-slate-600 px-1 py-0.2 rounded-[5px] font-black shrink-0 ml-1">
                                            {question.optionA.dimension}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center text-[9px] pt-1.5 border-t border-slate-100/50 font-black uppercase tracking-wider">
                                          <span>Grau de Afinidade:</span>
                                          <span className={scoreA > 0 ? "text-violet-600 font-extrabold" : "text-slate-400"}>
                                            {scoreA === 3 ? "3 (Muito)" : scoreA === 2 ? "2 (Razoável)" : scoreA === 1 ? "1 (Pouco)" : "0 (Nada)"}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Alternativa B */}
                                      <div 
                                        className={`p-3 rounded-[5px] border transition-all text-[11px] leading-relaxed flex flex-col justify-between gap-1.5 ${
                                          scoreB === 3 
                                            ? 'bg-violet-50/80 border-violet-300 text-violet-900 shadow-2xs' 
                                            : scoreB === 2 
                                            ? 'bg-violet-50/40 border-violet-200 text-violet-800' 
                                            : scoreB === 1 
                                            ? 'bg-slate-50/70 border-slate-200 text-slate-700' 
                                            : 'bg-white border-slate-100 text-slate-400'
                                        }`}
                                      >
                                        <div className="font-bold flex justify-between items-start">
                                          <span>B) {question.optionB.text}</span>
                                          <span className="text-[7.5px] bg-slate-200/80 text-slate-600 px-1 py-0.2 rounded-[5px] font-black shrink-0 ml-1">
                                            {question.optionB.dimension}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center text-[9px] pt-1.5 border-t border-slate-100/50 font-black uppercase tracking-wider">
                                          <span>Grau de Afinidade:</span>
                                          <span className={scoreB > 0 ? "text-violet-600 font-extrabold" : "text-slate-400"}>
                                            {scoreB === 3 ? "3 (Muito)" : scoreB === 2 ? "2 (Razoável)" : scoreB === 1 ? "1 (Pouco)" : "0 (Nada)"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })()}
                  </div>

                  {/* Modal Footer */}
                  <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-center items-center shrink-0">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider text-center">
                      método myers-briggs type indicator • mbti premium 64q
                    </p>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Modal de Relatório Premium de Temperamentos */}
          <AnimatePresence>
            {isTemperamentosModalOpen && selectedTemperamentosResult && (
              <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    setIsTemperamentosModalOpen(false);
                    setSelectedTemperamentosResult(null);
                  }}
                  className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
                />
                <motion.div 
                  ref={temperamentosModalRef}
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 30 }}
                  className="relative w-full max-w-4xl bg-white rounded-[5px] shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-slate-100"
                >
                  {/* Modal Header */}
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-sky-50 border border-sky-100 rounded-2xl flex items-center justify-center text-sky-600 shadow-sm shrink-0">
                        <Compass size={22} className="text-sky-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight">
                          Relatório de Temperamentos e Perfil Comportamental
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-0.5">
                            Candidato: {selectedTemperamentosResult.applicantName}
                          </p>
                          <span className="text-[10px] text-slate-300 font-bold">•</span>
                          <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest flex items-center gap-1">
                            <Clock size={10} /> Realizado em: {formatDate(selectedTemperamentosResult.completedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button 
                        onClick={() => handleExportModalToPDF(temperamentosModalRef, `Temperamentos_${selectedTemperamentosResult.applicantName}`)}
                        disabled={isExportingTestPDF}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#533af6] hover:bg-[#432ec4] text-white rounded-full font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer border-0 outline-none whitespace-nowrap"
                      >
                        {isExportingTestPDF ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                        {isExportingTestPDF ? 'Gerando...' : 'Baixar PDF'}
                      </button>
                      <button 
                        onClick={() => {
                          setIsTemperamentosModalOpen(false);
                          setSelectedTemperamentosResult(null);
                        }} 
                        className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full transition-all cursor-pointer border border-slate-100 hover:scale-105 active:scale-95 shadow-sm outline-none flex items-center justify-center w-9 h-9"
                      >
                        <CloseIcon size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Tabs Selector */}
                  <div className="flex border-b border-slate-100 bg-white px-6 py-2 overflow-x-auto gap-2 shrink-0 no-scrollbar">
                    {(['PERFIL', 'DISTRIBUICAO', 'AUDITORIA'] as const).map((tab) => {
                      const isActive = activeTemperamentosTab === tab;
                      const labels = {
                        PERFIL: 'Análise de Perfil',
                        DISTRIBUICAO: 'Gráfico de Distribuição',
                        AUDITORIA: 'Auditoria de Respostas'
                      };
                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTemperamentosTab(tab)}
                          className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-full transition-all whitespace-nowrap outline-none cursor-pointer ${
                            isActive 
                              ? 'bg-sky-50 text-sky-700 shadow-sm border' 
                              : 'text-slate-500 hover:bg-slate-50'
                          }`}
                          style={isActive ? { 
                            backgroundColor: 'rgba(14, 165, 233, 0.08)', 
                            color: '#0369a1',
                            borderColor: 'rgba(14, 165, 233, 0.2)'
                          } : {}}
                        >
                          {labels[tab]}
                        </button>
                      );
                    })}
                  </div>

                  {/* Modal Body (Scrollable) */}
                  <div className="flex-1 overflow-y-auto no-scrollbar p-6 sm:p-8 space-y-6 text-left font-sans bg-slate-50/30">
                    {(() => {
                      const profileType = selectedTemperamentosResult.type;
                      const scores = selectedTemperamentosResult.scores || { I: 0, C: 0, O: 0, A: 0 };
                      const answers = selectedTemperamentosResult.answers || [];

                      // Resilient resolver for profile data
                      const getProfileData = (type: string) => {
                        if (!type) return null;
                        if (TEMPERAMENTOS_PROFILES[type]) {
                          return TEMPERAMENTOS_PROFILES[type];
                        }
                        if (type.includes(' + ')) {
                          const parts = type.split(' + ');
                          const inverted = `${parts[1]} + ${parts[0]}`;
                          if (TEMPERAMENTOS_PROFILES[inverted]) {
                            return TEMPERAMENTOS_PROFILES[inverted];
                          }
                        }
                        const firstChar = type.charAt(0);
                        return TEMPERAMENTOS_PROFILES[firstChar] || null;
                      };

                      const profile = getProfileData(profileType);

                      if (activeTemperamentosTab === 'PERFIL') {
                        if (!profile) {
                          return (
                            <div className="text-center py-10 font-bold text-slate-500">
                              Perfil comportamental não encontrado ou tipo inválido ({profileType}).
                            </div>
                          );
                        }

                        // Mapeia classes de cores elegantes para as badges baseadas no tipo
                        const colorMap: Record<string, string> = {
                          I: 'bg-sky-50 text-sky-700 border-sky-100',
                          C: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                          O: 'bg-violet-50 text-violet-700 border-violet-100',
                          A: 'bg-rose-50 text-rose-700 border-rose-100'
                        };
                        const baseChar = profileType.charAt(0);
                        const badgeColorClass = colorMap[baseChar] || 'bg-slate-50 text-slate-700 border-slate-100';

                        return (
                          <div className="space-y-6">
                            {activeTemperamentosTab === 'PERFIL' && (
                              <div className="space-y-6">
                                {/* Profile Highlight Card */}
                                <div className={`p-6 rounded-[5px] border border-sky-100 bg-white shadow-sm space-y-4 text-left`}>
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                      <span className={`inline-block px-3 py-1 rounded-[5px] text-[10px] font-extrabold uppercase tracking-wider border ${badgeColorClass} mb-2`}>
                                        Perfil Predominante: {profileType}
                                      </span>
                                      <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">
                                        {profile.name} - {profile.title}
                                      </h3>
                                    </div>
                                    <div className="flex items-center justify-center h-14 w-28 rounded-[5px] bg-gradient-to-br from-sky-500 to-indigo-600 text-white text-lg font-black shadow-lg shrink-0">
                                      {profileType}
                                    </div>
                                  </div>
                                  <p className="text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-line">
                                    {profile.description}
                                  </p>
                                </div>

                                {/* Strengths & Attention & Ideal Environment */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  {/* Strengths */}
                                  <div className="bg-white p-6 rounded-[5px] border border-slate-100 shadow-sm space-y-3">
                                    <h4 className="text-xs font-black text-emerald-700 uppercase tracking-widest flex items-center gap-1">
                                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Pontos Fortes
                                    </h4>
                                    <div className="space-y-2 mt-1">
                                      {profile.strengths.map((ponto: string, index: number) => (
                                        <div key={index} className="text-xs font-bold text-slate-600 flex items-start gap-2 leading-relaxed">
                                          <Check className="text-emerald-500 shrink-0 mt-0.5" size={12} />
                                          <span>{ponto}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Points of Attention */}
                                  <div className="bg-white p-6 rounded-[5px] border border-slate-100 shadow-sm space-y-3">
                                    <h4 className="text-xs font-black text-rose-700 uppercase tracking-widest flex items-center gap-1">
                                      <span className="w-2 h-2 rounded-full bg-rose-500" /> Pontos de Atenção
                                    </h4>
                                    <div className="space-y-2 mt-1">
                                      {profile.weaknesses.map((ponto: string, index: number) => (
                                        <div key={index} className="text-xs font-bold text-slate-600 flex items-start gap-2 leading-relaxed">
                                          <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={12} />
                                          <span>{ponto}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Ideal Environment */}
                                  <div className="bg-white p-6 rounded-[5px] border border-slate-100 shadow-sm space-y-3">
                                    <h4 className="text-xs font-black text-sky-700 uppercase tracking-widest flex items-center gap-1">
                                      <span className="w-2 h-2 rounded-full bg-sky-500" /> Ambiente Ideal
                                    </h4>
                                    <div className="space-y-2 mt-1">
                                      {profile.environments.map((ponto: string, index: number) => (
                                        <div key={index} className="text-xs font-bold text-slate-600 flex items-start gap-2 leading-relaxed">
                                          <Compass className="text-sky-500 shrink-0 mt-0.5" size={12} />
                                          <span>{ponto}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {activeTemperamentosTab === 'DISTRIBUICAO' && (() => {
                              const total = (Object.values(scores).reduce((acc: number, val: any) => acc + (val || 0), 0) as number) || 25;
                              const styles = [
                                { label: 'Idealista / Criativo (I)', score: scores.I || 0, color: 'bg-sky-500', barBg: 'rgba(14, 165, 233, 0.1)', textColor: 'text-sky-700', borderC: 'border-sky-200' },
                                { label: 'Comunicador / Relacional (C)', score: scores.C || 0, color: 'bg-emerald-500', barBg: 'rgba(16, 185, 129, 0.1)', textColor: 'text-emerald-700', borderC: 'border-emerald-200' },
                                { label: 'Organizador / Analítico (O)', score: scores.O || 0, color: 'bg-violet-500', barBg: 'rgba(139, 92, 246, 0.1)', textColor: 'text-violet-700', borderC: 'border-violet-200' },
                                { label: 'Executor / Dominante (A)', score: scores.A || 0, color: 'bg-rose-500', barBg: 'rgba(244, 63, 94, 0.1)', textColor: 'text-rose-700', borderC: 'border-rose-200' }
                              ];

                              return (
                                <div className="space-y-6">
                                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest text-left mb-4">
                                    Distribuição das Respostas por Estilo
                                  </h3>
                                  <div className="grid grid-cols-1 gap-4">
                                    {styles.map((style) => {
                                      const pct = (style.score / total) * 100;
                                      return (
                                        <div 
                                          key={style.label} 
                                          className="bg-white p-6 rounded-[5px] border border-slate-100 shadow-sm space-y-3 text-left"
                                        >
                                          <div className="flex justify-between items-center">
                                            <span className={`text-xs font-black uppercase ${style.textColor}`}>
                                              {style.label}
                                            </span>
                                            <span className={`text-xs font-black px-2.5 py-0.5 rounded-[5px] border ${style.textColor} ${style.borderC}`} style={{ backgroundColor: style.barBg }}>
                                              {style.score} de {total} pts ({Math.round(pct)}%)
                                            </span>
                                          </div>

                                          {/* Progresso de cada um com cor estilizada */}
                                          <div className="h-4 w-full bg-slate-100 rounded-[3px] overflow-hidden border border-slate-200/50 p-0.5">
                                            <motion.div 
                                              initial={{ width: 0 }}
                                              animate={{ width: `${pct}%` }}
                                              transition={{ duration: 0.8, ease: "easeOut" }}
                                              className={`h-full rounded-[3px] ${style.color}`} 
                                            />
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })()}

                            {activeTemperamentosTab === 'AUDITORIA' && (
                              <div className="space-y-4">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest text-left mb-4">
                                  Auditoria Detalhada de Respostas (25 Questões)
                                </h3>

                                <div className="space-y-4">
                                  {TEMPERAMENTOS_QUESTIONS.map((question) => {
                                    const answer = answers.find((ans: any) => ans.q === question.id);
                                    const selectedChoice = answer ? answer.choice : '';

                                    return (
                                      <div 
                                        key={question.id} 
                                        className="bg-white p-5 rounded-[5px] border border-slate-100 shadow-xs space-y-3 hover:border-slate-200 transition-all text-left"
                                      >
                                        <div className="flex items-start gap-3">
                                          <span className="flex items-center justify-center w-6 h-6 rounded-[5px] text-[10px] font-black shrink-0 text-white bg-sky-600">
                                            {question.id}
                                          </span>
                                          <h4 className="text-xs font-bold text-slate-800 leading-normal pt-0.5">
                                            {question.text}
                                          </h4>
                                        </div>

                                        {/* As 4 opções renderizadas */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-9">
                                          {Object.entries(question.options).map(([profileKey, optionText]) => {
                                            const isSelected = selectedChoice === profileKey;
                                            const profileName = profileKey === 'I' ? 'Idealista (I)' : profileKey === 'C' ? 'Comunicador (C)' : profileKey === 'O' ? 'Organizador (O)' : 'Executor (A)';
                                            
                                            // Colors mapping based on the profile style
                                            let bgClass = 'bg-white border-slate-100 text-slate-500';
                                            if (isSelected) {
                                              if (profileKey === 'I') bgClass = 'bg-sky-50/80 border-sky-300 text-sky-900 shadow-2xs font-bold';
                                              else if (profileKey === 'C') bgClass = 'bg-emerald-50/80 border-emerald-300 text-emerald-900 shadow-2xs font-bold';
                                              else if (profileKey === 'O') bgClass = 'bg-violet-50/80 border-violet-300 text-violet-900 shadow-2xs font-bold';
                                              else if (profileKey === 'A') bgClass = 'bg-rose-50/80 border-rose-300 text-rose-900 shadow-2xs font-bold';
                                            }

                                            return (
                                              <div 
                                                key={profileKey} 
                                                className={`p-3 rounded-[5px] border transition-all text-[11px] leading-relaxed flex flex-col justify-between gap-1.5 ${bgClass}`}
                                              >
                                                <div className="flex justify-between items-start gap-2">
                                                  <span>{optionText}</span>
                                                  <span className={`text-[7px] px-1 py-0.2 rounded-[5px] font-black shrink-0 ${
                                                    profileKey === 'I' ? 'bg-sky-100 text-sky-700' :
                                                    profileKey === 'C' ? 'bg-emerald-100 text-emerald-700' :
                                                    profileKey === 'O' ? 'bg-violet-100 text-violet-700' :
                                                    'bg-rose-100 text-rose-700'
                                                  }`}>
                                                    {profileKey}
                                                  </span>
                                                </div>
                                                {isSelected && (
                                                  <div className="text-[9px] pt-1.5 border-t border-slate-100/50 font-black uppercase tracking-wider text-slate-400">
                                                    ✓ Escolha do Candidato ({profileName})
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }

                      return null;
                    })()}
                  </div>

                  {/* Modal Footer */}
                  <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-center items-center shrink-0">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider text-center">
                      Mapeamento Comportamental • Método de 4 Estilos com 25 Questões
                    </p>
                  </div>
                </motion.div>
              </div>
            )}

            {isSelectCustomTemplateModalOpen && applicantForRequestCustom && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    setIsSelectCustomTemplateModalOpen(false);
                    setApplicantForRequestCustom(null);
                    setSelectedTemplateIdForRequest(null);
                  }}
                  className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 30 }}
                  className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-100"
                >
                  {/* Modal Header */}
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0 border border-indigo-100" style={{ borderColor: 'rgba(99, 102, 241, 0.08)' }}>
                        <FileText size={22} className="text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight">
                          Solicitar Questionário Customizado
                        </h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5 truncate max-w-[350px]">
                          Candidato: {applicantForRequestCustom.candidate_name || applicantForRequestCustom.name}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setIsSelectCustomTemplateModalOpen(false);
                        setApplicantForRequestCustom(null);
                        setSelectedTemplateIdForRequest(null);
                      }} 
                      className="p-3 bg-white text-slate-400 hover:text-slate-900 rounded-2xl shadow-sm border border-slate-100 hover:scale-105 active:scale-95 transition-all outline-none"
                    >
                      <CloseIcon size={18} />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-left font-sans bg-slate-50/30">
                    <div>
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                        Selecione um Template da Biblioteca
                      </h3>
                      
                      {customTemplates.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-6 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
                          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-3">
                            <FileText size={20} />
                          </div>
                          <p className="text-xs font-black text-slate-600 uppercase tracking-widest">Nenhum Questionário Criado</p>
                          <p className="text-[10px] text-slate-400 mt-2 max-w-sm leading-relaxed">
                            Você não possui questionários customizados em sua biblioteca. Vá até o menu lateral e acesse <strong>Avaliações</strong> &gt; <strong>Criar Questionário Customizado</strong> para cadastrar seu primeiro template independente de vaga.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setIsSelectCustomTemplateModalOpen(false);
                              setApplicantForRequestCustom(null);
                              setSelectedTemplateIdForRequest(null);
                              setActiveTab('Avaliações');
                              setResultsSubTab('criar');
                            }}
                            className="mt-4 px-4 py-2 bg-[#533af6] hover:bg-[#432ec4] text-white font-black text-[9px] uppercase tracking-widest rounded-xl transition-all cursor-pointer border-0 outline-none"
                          >
                            Ir para Criação de Questionários
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {customTemplates.map(template => {
                            const isSelected = selectedTemplateIdForRequest === template.id;
                            return (
                              <div
                                key={template.id}
                                onClick={() => setSelectedTemplateIdForRequest(template.id)}
                                className={`p-5 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-4 ${
                                  isSelected
                                    ? 'bg-indigo-50/50 border-[#533af6] shadow-sm'
                                    : 'bg-white border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
                                }`}
                              >
                                <div className="pt-0.5 shrink-0">
                                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                                    isSelected
                                      ? 'border-[#533af6] bg-[#533af6] text-white'
                                      : 'border-slate-350 bg-white'
                                  }`}>
                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                  </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="text-xs font-extrabold text-slate-900 leading-normal mb-1">{template.title}</h4>
                                  <div className="flex items-center gap-3 text-[8.5px] font-bold text-slate-400 uppercase tracking-wider">
                                    <span>{template.questions?.length || 0} Perguntas</span>
                                    <span>•</span>
                                    <span>Criado em {new Date(template.createdAt).toLocaleDateString('pt-BR')}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                    <button 
                      type="button"
                      onClick={() => {
                        setIsSelectCustomTemplateModalOpen(false);
                        setApplicantForRequestCustom(null);
                        setSelectedTemplateIdForRequest(null);
                      }}
                      className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-black text-[9px] uppercase tracking-widest rounded-xl transition-all cursor-pointer outline-none"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="button"
                      disabled={!selectedTemplateIdForRequest}
                      onClick={() => {
                        const template = customTemplates.find(t => t.id === selectedTemplateIdForRequest);
                        if (template) {
                          handleConfirmRequestCustomTest(applicantForRequestCustom, template);
                        }
                      }}
                      className={`px-6 py-2.5 font-black text-[9px] uppercase tracking-widest rounded-xl shadow-lg transition-all border-0 outline-none flex items-center gap-1.5 ${
                        selectedTemplateIdForRequest
                          ? 'bg-[#533af6] hover:bg-[#432ec4] text-white cursor-pointer shadow-[#533af6]/20'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                      }`}
                    >
                      <span>Solicitar Questionário</span>
                      <ChevronRight size={10} />
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Drawer Lateral de Filtros */}
          <AnimatePresence>
            {isFilterSidebarOpen && (
              <div className="fixed inset-0 z-[150] flex justify-end">
                {/* Backdrop escuro com desfoque suave */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsFilterSidebarOpen(false)}
                  className="absolute inset-0 bg-slate-950/50 backdrop-blur-[4px]"
                />

                {/* Painel lateral (Drawer) */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                  className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-100/80 z-10 animate-none"
                >
                  {/* Cabeçalho do Drawer */}
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 shadow-sm border border-primary-100/20">
                        <Filter size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none">
                          Filtros de Candidatos
                        </h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                          Refine sua busca por talentos
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsFilterSidebarOpen(false)}
                      className="w-9 h-9 rounded-full bg-white text-slate-400 hover:text-slate-900 shadow-sm border border-slate-100 flex items-center justify-center hover:scale-105 active:scale-95 transition-all outline-none cursor-pointer"
                    >
                      <CloseIcon size={16} />
                    </button>
                  </div>

                  {/* Corpo do Drawer (Rolável) */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left font-sans bg-slate-50/20 no-scrollbar">
                    {/* Campo: Cargo Desejado */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block pl-1">Cargo Desejado</label>
                      <input
                        type="text"
                        value={talentFilters.role}
                        onChange={(e) => setTalentFilters({ ...talentFilters, role: e.target.value })}
                        placeholder="Ex: Gerente de Vendas"
                        className="w-full px-4 py-3 bg-white border border-slate-200/80 rounded-xl text-xs font-bold focus:border-[#533af6]/30 focus:ring-4 focus:ring-[#533af6]/5 outline-none transition-all"
                      />
                    </div>

                    {/* Campo: Escolaridade */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block pl-1">Escolaridade</label>
                      <div className="relative">
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <select
                          value={talentFilters.education}
                          onChange={(e) => setTalentFilters({ ...talentFilters, education: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200/80 rounded-xl text-[10px] font-bold focus:border-[#533af6]/30 outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Qualquer Nível</option>
                          <option value="Ensino Médio Cursando">Ensino Médio Cursando</option>
                          <option value="Ensino Médio Completo">Ensino Médio Completo</option>
                          <option value="Superior Cursando">Superior Cursando</option>
                          <option value="Ensino Superior Completo">Ensino Superior Completo</option>
                          <option value="Pós-graduação">Pós-graduação</option>
                        </select>
                      </div>
                    </div>

                    {/* Campo: Sênioridade */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block pl-1">Sênioridade</label>
                      <div className="relative">
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <select
                          value={talentFilters.experience}
                          onChange={(e) => setTalentFilters({ ...talentFilters, experience: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200/80 rounded-xl text-[10px] font-bold focus:border-[#533af6]/30 outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Qualquer</option>
                          <option value="Estágio">Estágio</option>
                          <option value="Júnior">Júnior</option>
                          <option value="Pleno">Pleno</option>
                          <option value="Sênior">Sênior</option>
                          <option value="Especialista">Especialista</option>
                        </select>
                      </div>
                    </div>

                    {/* Campo: Localização */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block pl-1">Localização</label>
                      <div className="grid grid-cols-5 gap-2">
                        <div className="col-span-2 relative animate-none">
                          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          <select
                            value={talentFilters.state}
                            onChange={(e) => setTalentFilters({ ...talentFilters, state: e.target.value, city: '' })}
                            className="w-full px-2 py-3 bg-white border border-slate-200/80 rounded-xl text-[10px] font-bold focus:border-[#533af6]/30 outline-none transition-all appearance-none text-center cursor-pointer"
                          >
                            <option value="">UF</option>
                            {BRAZIL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div className="col-span-3 relative animate-none">
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          <select
                            value={talentFilters.city}
                            onChange={(e) => setTalentFilters({ ...talentFilters, city: e.target.value })}
                            disabled={!talentFilters.state || isTalentLoadingCities}
                            className="w-full px-3 py-3 bg-white border border-slate-200/80 rounded-xl text-[10px] font-bold focus:border-[#533af6]/30 outline-none transition-all appearance-none disabled:opacity-50 cursor-pointer"
                          >
                            <option value="">{isTalentLoadingCities ? '...' : 'Cidade'}</option>
                            {talentCities.map(city => <option key={city} value={city}>{city}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Campo: Pretensão Salarial */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block pl-1">Pretensão Salarial Máxima</label>
                      <input
                        type="text"
                        value={talentFilters.salary}
                        onChange={(e) => setTalentFilters({ ...talentFilters, salary: e.target.value })}
                        placeholder="Ex: 5000"
                        className="w-full px-4 py-3 bg-white border border-slate-200/80 rounded-xl text-xs font-bold focus:border-[#533af6]/30 focus:ring-4 focus:ring-[#533af6]/5 outline-none transition-all"
                      />
                    </div>

                    {/* Campo: Idade Mínima */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center pl-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Idade Mínima</label>
                        <span className="text-[10px] font-black text-[#533af6]">{talentFilters.minAge} anos</span>
                      </div>
                      <input
                        type="range"
                        min="16"
                        max="60"
                        value={talentFilters.minAge}
                        onChange={(e) => setTalentFilters({ ...talentFilters, minAge: parseInt(e.target.value) })}
                        className="w-full h-1.5 bg-slate-200 rounded-full appearance-none accent-[#533af6] cursor-pointer"
                      />
                    </div>

                    {/* Campo: Modalidade */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block pl-1">Modalidade de Trabalho</label>
                      <div className="flex flex-wrap gap-2 animate-none">
                        {['Presencial', 'Híbrido', 'Remoto'].map(mod => (
                          <button
                            key={mod}
                            type="button"
                            onClick={() => setTalentFilters({ ...talentFilters, modality: talentFilters.modality === mod ? '' : mod })}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border cursor-pointer ${
                              talentFilters.modality === mod
                                ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                                : 'bg-white border-slate-200/80 text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            {mod === 'Remoto' ? <Cpu size={12} /> : mod === 'Híbrido' ? <Zap size={12} /> : <MapPin size={12} />}
                            {mod}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Campo: Primeiro Emprego */}
                    <div className="space-y-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setTalentFilters({ ...talentFilters, first_job: !talentFilters.first_job })}
                        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border cursor-pointer ${
                          talentFilters.first_job
                            ? 'bg-[#533af6] border-[#533af6] text-white shadow-lg shadow-[#533af6]/10'
                            : 'bg-white border-slate-200/80 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        Primeiro Emprego
                      </button>
                    </div>
                  </div>

                  {/* Rodapé do Drawer */}
                  <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setTalentFilters({ role: '', minAge: 16, maxAge: 60, city: '', state: '', first_job: false, education: '', experience: '', modality: '', salary: '' });
                      }}
                      className="px-5 py-3 text-[9px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-1 bg-transparent border-0 cursor-pointer outline-none"
                    >
                      Limpar <CloseIcon size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsFilterSidebarOpen(false);
                        if (activeTab !== 'Banco de Talentos') {
                          setActiveTab('Banco de Talentos');
                        }
                      }}
                      className="flex-1 px-6 py-3 bg-[#533af6] hover:bg-[#432ec4] text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-[#533af6]/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-1.5"
                    >
                      <span>Aplicar Filtros</span>
                      <ChevronRight size={12} className="stroke-[3]" />
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Drawer Lateral de Testes */}
          <AnimatePresence>
            {activeApplicantForTests && (
              <div className="fixed inset-0 z-[150] flex justify-end">
                {/* Backdrop escuro com desfoque suave */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setActiveApplicantForTests(null)}
                  className="absolute inset-0 bg-slate-950/50 backdrop-blur-[4px]"
                />

                {/* Painel lateral (Drawer) */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                  className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-100/80 z-10 text-left font-sans"
                >
                  {/* Cabeçalho do Drawer */}
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-650 shadow-sm border border-indigo-100/20">
                        <Brain size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none">
                          Testes do Candidato
                        </h4>
                        <p className="text-[10px] font-black text-[#8959f5] uppercase tracking-widest mt-1.5 truncate max-w-[220px]" title={activeApplicantForTests.fullApp.candidate_name}>
                          {activeApplicantForTests.fullApp.candidate_name}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveApplicantForTests(null)}
                      className="w-9 h-9 rounded-full bg-white text-slate-400 hover:text-slate-900 shadow-sm border border-slate-100 flex items-center justify-center hover:scale-105 active:scale-95 transition-all outline-none cursor-pointer"
                    >
                      <CloseIcon size={16} />
                    </button>
                  </div>

                  {/* Conteúdo do Drawer */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/20 no-scrollbar">
                    {/* Informações Resumidas do Candidato */}
                    <div className="bg-slate-50 p-4 rounded-[5px] border border-slate-150/60">
                      <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5">Resumo da Candidatura</h5>
                      <div className="space-y-1.5 text-[10px] font-bold text-slate-650 uppercase tracking-wider">
                        <p>Vaga: <span className="text-slate-800 font-extrabold">{selectedJob?.title}</span></p>
                        <p>Etapa Atual: <span className="text-[#8959f5] font-black">{activeApplicantForTests.status || activeApplicantForTests.normalizedStatus}</span></p>
                        <p>Match IA: <span className="text-emerald-600 font-black">{activeApplicantForTests.matchScore}%</span></p>
                      </div>
                    </div>

                    {/* Lista de Testes */}
                    <div className="space-y-4">
                      <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
                        <BrainCircuit size={14} className="text-[#8959f5]" /> Avaliações Disponíveis
                      </h5>
                      
                      {/* Bloco de cada teste */}
                      <div className="space-y-3">
                        {/* 1. DISC */}
                        {(() => {
                          const { discStatus, D, I, S, C, fullApp, discDate } = activeApplicantForTests;
                          const showDisc = activeApplicantForTests.normalizedStatus === 'Testes' || discStatus === 'COMPLETED' || discStatus === 'PENDING';
                          if (!showDisc) return null;

                          return (
                            <div className="bg-white hover:bg-slate-50/50 border border-slate-200/80 rounded-[5px] p-4 transition-all shadow-2xs">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h6 className="font-extrabold text-slate-800 text-xs uppercase tracking-tight">DISC</h6>
                                  <p className="text-[9px] font-semibold text-slate-400 mt-1">Avaliação de perfil comportamental (Dominância, Influência, Estabilidade, Conformidade)</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-[3px] text-[8px] font-black uppercase tracking-wider shrink-0 select-none ${
                                  discStatus === 'COMPLETED'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    : discStatus === 'PENDING'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                    : 'bg-slate-50 text-slate-400 border border-slate-150'
                                }`}>
                                  {discStatus === 'COMPLETED' ? 'Concluído' : discStatus === 'PENDING' ? 'Pendente' : 'Não Solicitado'}
                                </span>
                              </div>
                              
                              <div className="mt-3 flex justify-end">
                                {discStatus === 'COMPLETED' ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedDiscResult({ applicantName: fullApp.candidate_name, completedAt: discDate || fullApp.created_at, D, I, S, C });
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100/70 text-rose-700 font-extrabold rounded-full uppercase text-[9px] transition-all cursor-pointer border border-rose-150/40"
                                  >
                                    <span>Ver Perfil DISC</span>
                                    <ChevronRight size={10} className="shrink-0" />
                                  </button>
                                ) : discStatus === 'PENDING' ? (
                                  <div className="flex items-center gap-1 text-[8.5px] text-amber-600 font-black uppercase tracking-wider bg-amber-50 px-2.5 py-1.5 rounded-[5px] border border-amber-100/50">
                                    <Clock size={10} className="animate-spin text-amber-500" /> Aguardando Candidato
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (activeApplicantForTests.normalizedStatus !== 'Testes') {
                                        showCustomAlert("A solicitação do teste DISC só é permitida na etapa 'Testes'. Mova o candidato para a coluna 'Testes'.", "Aviso");
                                        return;
                                      }
                                      handleRequestDiscTest(fullApp);
                                      setActiveApplicantForTests({
                                        ...activeApplicantForTests,
                                        discStatus: 'PENDING'
                                      });
                                    }}
                                    className="px-3.5 py-1.5 bg-[#8959f5] hover:bg-[#7846e3] text-white font-extrabold rounded-full uppercase text-[9px] transition-all cursor-pointer border-0 shadow-sm active:scale-95"
                                  >
                                    Solicitar Teste
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                        {/* 2. Mapeamento */}
                        {(() => {
                          const { questionsStatus, fullApp, questionsDate } = activeApplicantForTests;
                          const showQuestions = activeApplicantForTests.normalizedStatus === 'Testes' || questionsStatus === 'COMPLETED' || questionsStatus === 'PENDING';
                          if (!showQuestions) return null;

                          return (
                            <div className="bg-white hover:bg-slate-50/50 border border-slate-200/80 rounded-[5px] p-4 transition-all shadow-2xs">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h6 className="font-extrabold text-slate-800 text-xs uppercase tracking-tight">Mapeamento de Perfil</h6>
                                  <p className="text-[9px] font-semibold text-slate-400 mt-1">Perguntas estruturadas sobre expectativas e experiências</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-[3px] text-[8px] font-black uppercase tracking-wider shrink-0 select-none ${
                                  questionsStatus === 'COMPLETED'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    : questionsStatus === 'PENDING'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                    : 'bg-slate-50 text-slate-400 border border-slate-150'
                                }`}>
                                  {questionsStatus === 'COMPLETED' ? 'Concluído' : questionsStatus === 'PENDING' ? 'Pendente' : 'Não Solicitado'}
                                </span>
                              </div>
                              
                              <div className="mt-3 flex justify-end">
                                {questionsStatus === 'COMPLETED' ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedApplicantForQuestions({ ...activeApplicantForTests, completedAt: questionsDate || fullApp.created_at });
                                      setActiveCategoryTab('EXPERIENCE');
                                      setIsQuestionsModalOpen(true);
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100/70 text-indigo-700 font-extrabold rounded-full uppercase text-[9px] transition-all cursor-pointer border border-indigo-150/40"
                                  >
                                    <span>Ver Respostas</span>
                                    <ChevronRight size={10} className="shrink-0" />
                                  </button>
                                ) : questionsStatus === 'PENDING' ? (
                                  <div className="flex items-center gap-1 text-[8.5px] text-amber-600 font-black uppercase tracking-wider bg-amber-50 px-2.5 py-1.5 rounded-[5px] border border-amber-100/50">
                                    <Clock size={10} className="animate-spin text-amber-500" /> Aguardando Candidato
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (activeApplicantForTests.normalizedStatus !== 'Testes') {
                                        showCustomAlert("A solicitação do Mapeamento só é permitida na etapa 'Testes'. Mova o candidato para a coluna 'Testes'.", "Aviso");
                                        return;
                                      }
                                      handleRequestQuestions(fullApp);
                                      setActiveApplicantForTests({
                                        ...activeApplicantForTests,
                                        questionsStatus: 'PENDING'
                                      });
                                    }}
                                    className="px-3.5 py-1.5 bg-[#8959f5] hover:bg-[#7846e3] text-white font-extrabold rounded-full uppercase text-[9px] transition-all cursor-pointer border-0 shadow-sm active:scale-95"
                                  >
                                    Solicitar Teste
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                        {/* 3. MBTI */}
                        {(() => {
                          const { mbtiStatus, mbtiResponses, fullApp, mbtiDate } = activeApplicantForTests;
                          const showMbti = activeApplicantForTests.normalizedStatus === 'Testes' || mbtiStatus === 'COMPLETED' || mbtiStatus === 'PENDING';
                          if (!showMbti) return null;

                          return (
                            <div className="bg-white hover:bg-slate-50/50 border border-slate-200/80 rounded-[5px] p-4 transition-all shadow-2xs">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h6 className="font-extrabold text-slate-800 text-xs uppercase tracking-tight">MBTI</h6>
                                  <p className="text-[9px] font-semibold text-slate-400 mt-1">Indicador de tipos de personalidade com 16 perfis possíveis</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-[3px] text-[8px] font-black uppercase tracking-wider shrink-0 select-none ${
                                  mbtiStatus === 'COMPLETED'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    : mbtiStatus === 'PENDING'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                    : 'bg-slate-50 text-slate-400 border border-slate-150'
                                }`}>
                                  {mbtiStatus === 'COMPLETED' ? 'Concluído' : mbtiStatus === 'PENDING' ? 'Pendente' : 'Não Solicitado'}
                                </span>
                              </div>
                              
                              <div className="mt-3 flex justify-end">
                                {mbtiStatus === 'COMPLETED' ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedMbtiResult({ applicantName: fullApp.candidate_name, completedAt: mbtiDate || fullApp.created_at, ...mbtiResponses });
                                      setActiveMbtiTab('PERFIL');
                                      setIsMbtiModalOpen(true);
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 hover:bg-violet-100/70 text-violet-700 font-extrabold rounded-full uppercase text-[9px] transition-all cursor-pointer border border-violet-150/40"
                                  >
                                    <span>Ver Perfil: {mbtiResponses?.type || 'MBTI'}</span>
                                    <ChevronRight size={10} className="shrink-0" />
                                  </button>
                                ) : mbtiStatus === 'PENDING' ? (
                                  <div className="flex items-center gap-1 text-[8.5px] text-amber-600 font-black uppercase tracking-wider bg-amber-50 px-2.5 py-1.5 rounded-[5px] border border-amber-100/50">
                                    <Clock size={10} className="animate-spin text-amber-500" /> Aguardando Candidato
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (activeApplicantForTests.normalizedStatus !== 'Testes') {
                                        showCustomAlert("A solicitação do teste MBTI só é permitida na etapa 'Testes'. Mova o candidato para a coluna 'Testes'.", "Aviso");
                                        return;
                                      }
                                      handleRequestMbtiTest(fullApp);
                                      setActiveApplicantForTests({
                                        ...activeApplicantForTests,
                                        mbtiStatus: 'PENDING'
                                      });
                                    }}
                                    className="px-3.5 py-1.5 bg-[#8959f5] hover:bg-[#7846e3] text-white font-extrabold rounded-full uppercase text-[9px] transition-all cursor-pointer border-0 shadow-sm active:scale-95"
                                  >
                                    Solicitar Teste
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                        {/* 4. Temperamentos */}
                        {(() => {
                          const { temperamentosStatus, temperamentosResponses, fullApp, temperamentosDate } = activeApplicantForTests;
                          const showTemperamentos = activeApplicantForTests.normalizedStatus === 'Testes' || temperamentosStatus === 'COMPLETED' || temperamentosStatus === 'PENDING';
                          if (!showTemperamentos) return null;

                          return (
                            <div className="bg-white hover:bg-slate-50/50 border border-slate-200/80 rounded-[5px] p-4 transition-all shadow-2xs">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h6 className="font-extrabold text-slate-800 text-xs uppercase tracking-tight">Temperamentos</h6>
                                  <p className="text-[9px] font-semibold text-slate-400 mt-1">Identificação de temperamentos (Sanguíneo, Colérico, Melancólico, Fleumático)</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-[3px] text-[8px] font-black uppercase tracking-wider shrink-0 select-none ${
                                  temperamentosStatus === 'COMPLETED'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    : temperamentosStatus === 'PENDING'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                    : 'bg-slate-50 text-slate-400 border border-slate-150'
                                }`}>
                                  {temperamentosStatus === 'COMPLETED' ? 'Concluído' : temperamentosStatus === 'PENDING' ? 'Pendente' : 'Não Solicitado'}
                                </span>
                              </div>
                              
                              <div className="mt-3 flex justify-end">
                                {temperamentosStatus === 'COMPLETED' ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedTemperamentosResult({ applicantName: fullApp.candidate_name, completedAt: temperamentosDate || fullApp.created_at, ...temperamentosResponses });
                                      setActiveTemperamentosTab('PERFIL');
                                      setIsTemperamentosModalOpen(true);
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100/70 text-sky-700 font-extrabold rounded-full uppercase text-[9px] transition-all cursor-pointer border border-sky-150/40"
                                  >
                                    <span>Ver Perfil: {temperamentosResponses?.type || 'TEMP'}</span>
                                    <ChevronRight size={10} className="shrink-0" />
                                  </button>
                                ) : temperamentosStatus === 'PENDING' ? (
                                  <div className="flex items-center gap-1 text-[8.5px] text-amber-600 font-black uppercase tracking-wider bg-amber-50 px-2.5 py-1.5 rounded-[5px] border border-amber-100/50">
                                    <Clock size={10} className="animate-spin text-amber-500" /> Aguardando Candidato
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (activeApplicantForTests.normalizedStatus !== 'Testes') {
                                        showCustomAlert("A solicitação do Teste de Temperamentos só é permitida na etapa 'Testes'. Mova o candidato para a coluna 'Testes'.", "Aviso");
                                        return;
                                      }
                                      handleRequestTemperamentosTest(fullApp);
                                      setActiveApplicantForTests({
                                        ...activeApplicantForTests,
                                        temperamentosStatus: 'PENDING'
                                      });
                                    }}
                                    className="px-3.5 py-1.5 bg-[#8959f5] hover:bg-[#7846e3] text-white font-extrabold rounded-full uppercase text-[9px] transition-all cursor-pointer border-0 shadow-sm active:scale-95"
                                  >
                                    Solicitar Teste
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                        {/* 5. Customizado */}
                        {(() => {
                          const { fullApp, customTestDate } = activeApplicantForTests;
                          const parsedData = parseCandidatePhoneData(activeApplicantForTests.candidate_phone || '');
                          let customTestStatus = 'NONE';
                          if (parsedData.customTest) {
                            if (parsedData.customTest.startsWith('PENDING')) customTestStatus = 'PENDING';
                            else if (parsedData.customTest.startsWith('COMPLETED')) {
                              customTestStatus = 'COMPLETED';
                            }
                          }

                          const showCustomTest = activeApplicantForTests.normalizedStatus === 'Testes' || customTestStatus === 'COMPLETED' || customTestStatus === 'PENDING';
                          if (!showCustomTest) return null;

                          return (
                            <div className="bg-white hover:bg-slate-50/50 border border-slate-200/80 rounded-[5px] p-4 transition-all shadow-2xs">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h6 className="font-extrabold text-slate-800 text-xs uppercase tracking-tight">Questionário Customizado</h6>
                                  <p className="text-[9px] font-semibold text-slate-400 mt-1">Perguntas customizadas criadas para esta vaga</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-[3px] text-[8px] font-black uppercase tracking-wider shrink-0 select-none ${
                                  customTestStatus === 'COMPLETED'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    : customTestStatus === 'PENDING'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                    : 'bg-slate-50 text-slate-400 border border-slate-150'
                                }`}>
                                  {customTestStatus === 'COMPLETED' ? 'Concluído' : customTestStatus === 'PENDING' ? 'Pendente' : 'Não Solicitado'}
                                </span>
                              </div>
                              
                              <div className="mt-3 flex justify-end">
                                {customTestStatus === 'COMPLETED' ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedApplicantForCustomTest({ ...activeApplicantForTests, completedAt: customTestDate || fullApp.created_at });
                                      setIsCustomTestModalOpen(true);
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100/70 text-emerald-700 font-extrabold rounded-full uppercase text-[9px] transition-all cursor-pointer border border-emerald-150/40"
                                  >
                                    <span>Ver Respostas</span>
                                    <ChevronRight size={10} className="shrink-0" />
                                  </button>
                                ) : customTestStatus === 'PENDING' ? (
                                  <div className="flex items-center gap-1 text-[8.5px] text-amber-600 font-black uppercase tracking-wider bg-amber-50 px-2.5 py-1.5 rounded-[5px] border border-amber-100/50">
                                    <Clock size={10} className="animate-spin text-amber-500" /> Aguardando Candidato
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (activeApplicantForTests.normalizedStatus !== 'Testes') {
                                        showCustomAlert("A solicitação de Questionário Customizado só é permitida na etapa 'Testes'. Mova o candidato para a coluna 'Testes'.", "Aviso");
                                        return;
                                      }
                                      setApplicantForRequestCustom(fullApp);
                                      setIsSelectCustomTemplateModalOpen(true);
                                    }}
                                    className="px-3.5 py-1.5 bg-[#8959f5] hover:bg-[#7846e3] text-white font-extrabold rounded-full uppercase text-[9px] transition-all cursor-pointer border-0 shadow-sm active:scale-95"
                                  >
                                    Solicitar Questionário
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Elemento oculto para renderização de impressão do currículo A4 em PDF */}
          {selectedResumeApplicant && (
            <div 
              ref={resumePrintRef} 
              style={{ 
                display: 'none', 
                position: 'absolute', 
                left: '-9999px', 
                top: '-9999px', 
                width: '210mm', 
                minHeight: '297mm', 
                backgroundColor: '#FFFFFF',
                color: '#000000'
              }}
              className="font-sans"
            >
              <div style={{ display: 'flex', flexDirection: 'column', minHeight: '297mm', width: '210mm', backgroundColor: '#FFFFFF', position: 'relative', overflow: 'hidden', boxSizing: 'border-box' }}>
                {/* Header Zone */}
                <div style={{ backgroundImage: 'linear-gradient(90deg, #5b36ff 0%, #8b6aff 100%)', backgroundColor: '#7044ff', width: '100%', height: '160px', position: 'relative', display: 'flex', items: 'center', boxSizing: 'border-box' }}>
                  {/* Circular Photo */}
                  <div style={{ position: 'absolute', left: '50px', top: '75px', zIndex: 100 }}>
                    <div style={{ width: '170px', height: '170px', borderRadius: '50%', border: '6px solid #FFFFFF', overflow: 'hidden', backgroundColor: '#e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      {selectedResumeApplicant.profile_pic ? (
                        <img src={selectedResumeApplicant.profile_pic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                          <User size={60} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name Header */}
                  <div style={{ marginLeft: '260px', paddingRight: '40px', flex: 1, textAlign: 'left' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 900, textTransform: 'uppercase', color: '#FFFFFF', letterSpacing: '2px', margin: 0, paddingBottom: '10px' }}>
                      {selectedResumeApplicant.candidate_name || 'Nome do Candidato'}
                    </h1>
                    <div style={{ width: '100%', height: '2px', backgroundColor: '#FFFFFF' }} />
                  </div>
                </div>

                {/* Columns Zone */}
                <div style={{ display: 'flex', flex: 1, width: '100%', boxSizing: 'border-box' }}>
                  {/* Sidebar Column */}
                  <div style={{ width: '240px', backgroundColor: '#f3f0ff', paddingTop: '110px', paddingLeft: '30px', paddingRight: '30px', paddingBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box', flexShrink: 0 }}>
                    {/* CONTATO SECTION */}
                    <div style={{ width: '100%', textAlign: 'center', marginBottom: '35px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#7044ff', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Contato</h3>
                      <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '18px' }} />
                      
                      <div style={{ marginBottom: '15px' }}>
                        <p style={{ fontSize: '10px', fontWeight: 900, color: '#7044ff', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Telefone</p>
                        <p style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0, wordBreak: 'break-all' }}>{parseCandidatePhoneData(selectedResumeApplicant.candidate_phone).phone || '--'}</p>
                      </div>
                      
                      <div style={{ marginBottom: '15px' }}>
                        <p style={{ fontSize: '10px', fontWeight: 900, color: '#7044ff', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 2px 0' }}>E-Mail</p>
                        <p style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0, wordBreak: 'break-all' }}>{selectedResumeApplicant.candidate_email || '--'}</p>
                      </div>
                      
                      <div style={{ marginBottom: '15px' }}>
                        <p style={{ fontSize: '10px', fontWeight: 900, color: '#7044ff', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Cidade</p>
                        <p style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0 }}>{selectedResumeApplicant.city ? `${selectedResumeApplicant.city} - ${selectedResumeApplicant.state || ''}` : '--'}</p>
                      </div>
                      
                      <div>
                        <p style={{ fontSize: '10px', fontWeight: 900, color: '#7044ff', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Idade</p>
                        <p style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0 }}>
                          {selectedResumeApplicant.talentMatched?.birth_date
                            ? `${calculateAge(selectedResumeApplicant.talentMatched.birth_date)} anos`
                            : selectedResumeApplicant.talentMatched?.age 
                            ? `${selectedResumeApplicant.talentMatched.age} anos`
                            : '--'
                          }
                        </p>
                      </div>
                    </div>

                    {/* HABILIDADES SECTION */}
                    {selectedResumeApplicant.talentMatched?.skills && selectedResumeApplicant.talentMatched.skills.length > 0 && (
                      <div style={{ width: '100%' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#7044ff', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 6px 0', textAlign: 'center' }}>Habilidades</h3>
                        <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '18px' }} />
                        
                        <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start', width: '100%' }}>
                          {selectedResumeApplicant.talentMatched.skills.map((skill: string, index: number) => (
                            <li key={index} style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0, paddingLeft: '5px', textAlign: 'left' }}>
                              • {skill}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Main Content Column */}
                  <div style={{ flex: 1, padding: '40px 40px 40px 35px', display: 'flex', flexDirection: 'column', textAlign: 'left', boxSizing: 'border-box' }}>
                    {/* PERFIL SECTION */}
                    <div style={{ marginBottom: '32px' }}>
                      <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#000000', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Perfil</h2>
                      <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '16px' }} />
                      <p style={{ fontSize: '12.5px', lineHeight: 1.6, color: '#334155', margin: 0, textAlign: 'justify', whiteSpace: 'pre-line' }}>
                        {selectedResumeApplicant.talentMatched?.summary || selectedResumeApplicant.summary || 'Resumo profissional não preenchido.'}
                      </p>
                    </div>

                    {/* EXPERIÊNCIAS SECTION */}
                    {selectedResumeApplicant.talentMatched?.experiences && selectedResumeApplicant.talentMatched.experiences.length > 0 && (
                      <div style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#000000', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Experiências</h2>
                        <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '16px' }} />
                        <div>
                          {selectedResumeApplicant.talentMatched.experiences.map((exp: any, idx: number) => (
                            <div key={idx} style={{ marginBottom: '24px' }}>
                              <h4 style={{ fontSize: '12px', fontWeight: 900, color: '#000000', textTransform: 'uppercase', margin: '0 0 4px 0' }}>{exp.role}</h4>
                              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '8px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: '#000000' }}>{exp.company}</span>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: '#000000' }}>{exp.duration || 'N/A'}</span>
                              </div>
                              <p style={{ fontSize: '12px', lineHeight: 1.6, color: '#475569', margin: 0, whiteSpace: 'pre-line', textAlign: 'justify' }}>
                                {exp.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* EDUCAÇÃO SECTION */}
                    {selectedResumeApplicant.talentMatched?.educations && selectedResumeApplicant.talentMatched.educations.length > 0 && (
                      <div style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#000000', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Educação</h2>
                        <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '16px' }} />
                        <div>
                          {selectedResumeApplicant.talentMatched.educations.map((edu: any, idx: number) => (
                            <div key={idx} style={{ marginBottom: '20px' }}>
                              <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#000000', margin: '0 0 4px 0' }}>{edu.course}</h4>
                              <p style={{ fontSize: '11px', fontWeight: 700, color: '#000000', letterSpacing: '0.5px', textTransform: 'uppercase', margin: '0 0 4px 0' }}>
                                {edu.gradYear || ''} - {edu.status}
                              </p>
                              <p style={{ fontSize: '12px', color: '#334155', margin: 0 }}>{edu.institution}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
    </div>
  );
}
