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
  HelpCircle,
  CreditCard,
  Bookmark,
  Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { perfisDISC, MBTI_PROFILES, MBTI_QUESTIONS, MbtiProfile, MbtiQuestion, TEMPERAMENTOS_PROFILES, TEMPERAMENTOS_QUESTIONS } from './CandidateDashboard';
import { supabase } from '../lib/supabase';
import { VideoMeeting } from './VideoMeeting';
import { createClient } from '@supabase/supabase-js';
import { jsPDF } from 'jspdf';
import { 
  createNotification, 
  getNotifications, 
  markAllNotificationsAsRead, 
  markNotificationAsRead, 
  deleteNotification,
  ColaborhNotification 
} from '../utils/notificationUtils';
import { NotificationsDrawer } from './NotificationsDrawer';
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
import { 
  APPLICATION_DATA, 
  VACANCY_DISTRIBUTION, 
  TOP_SKILLS, 
  BRAZIL_STATES, 
  DF_REGIONS, 
  parseCandidatePhoneData, 
  formatDate, 
  calculateAiMatchScore, 
  getCurrentJobStages, 
  getCurrentJobStageTests, 
  serializeCandidatePhoneData, 
  getCustomQuestionsFromJobDescription, 
  QUESTIONS_CATEGORIES, 
  ALL_QUESTIONS_LIST,
  calculateAge 
} from '../utils/companyDashboardUtils';
import { ManageStagesModal } from './CompanyDashboard/modals/ManageStagesModal';
import { CustomQuestionsModal } from './CompanyDashboard/modals/CustomQuestionsModal';
import { TalentBankTab } from './CompanyDashboard/tabs/TalentBankTab';
import { MyVacanciesTab } from './CompanyDashboard/tabs/MyVacanciesTab';
import { CreateVacancyTab } from './CompanyDashboard/tabs/CreateVacancyTab';
import { SettingsTab } from './CompanyDashboard/tabs/SettingsTab';
import { BillingTab } from './CompanyDashboard/tabs/BillingTab';

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
  plan?: 'starter' | 'growth' | 'enterprise';
  credits?: number;
  savedTalents?: string[];
}

interface SidebarItemProps {
  icon: any;
  label: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarExpanded: boolean;
}

const cleanEmojiFromText = (text: string): string => {
  return text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "").trim();
};

const SidebarItem = ({ icon: Icon, label, activeTab, setActiveTab, isSidebarExpanded }: SidebarItemProps) => {
  const isActive = activeTab === label;
  
  return (
    <div className="relative group/item w-full lg:h-10 flex justify-center">
      <button
        onClick={() => setActiveTab(label)}
        className={`flex items-center transition-all duration-300 ease-in-out
          /* Estilo Mobile: linha cheia com bordas arredondadas */
          w-full py-3.5 px-4 justify-start gap-3 rounded-2xl
          ${isActive 
            ? 'bg-white text-[#533af6] shadow-md font-bold' 
            : 'text-white/70 hover:bg-white/10 hover:text-white'
          }
          /* Estilo Desktop (telas lg): botão circular que expande para a direita no hover */
          lg:absolute lg:left-2 lg:top-0 lg:w-10 lg:h-10 lg:p-0 lg:justify-center lg:rounded-full lg:space-x-0 lg:gap-0 lg:z-10
          ${isActive 
            ? 'lg:bg-white lg:text-[#533af6] lg:shadow-lg' 
            : 'lg:bg-transparent lg:text-white/70'
          }
          /* Efeito Hover no Desktop */
          lg:group-hover/item:w-48 lg:group-hover/item:bg-white/90 lg:group-hover/item:backdrop-blur-xs lg:group-hover/item:text-[#533af6] lg:group-hover/item:shadow-2xl lg:group-hover/item:z-50 lg:group-hover/item:justify-start lg:group-hover/item:pl-3.5 lg:group-hover/item:pr-8
        `}
      >
        <Icon size={18} className={`shrink-0 transition-all duration-200 ${
          isActive 
            ? 'text-[#533af6]' 
            : 'text-white/70 group-hover/item:text-[#533af6]'
        }`} />
        
        {/* Rótulo de texto que expande no desktop ao passar o mouse */}
        <span className={`font-black text-[11px] uppercase tracking-widest whitespace-nowrap transition-all duration-300 ease-in-out
          /* Mobile */
          lg:hidden
          /* Desktop: oculto por padrão, expande no hover do container pai */
          lg:w-0 lg:opacity-0 lg:overflow-hidden lg:ml-0
          lg:group-hover/item:w-auto lg:group-hover/item:opacity-100 lg:group-hover/item:inline-block lg:group-hover/item:overflow-visible
          lg:group-hover/item:flex-1 lg:group-hover/item:text-center
          text-[#533af6]
        `}>
          {label}
        </span>
      </button>
    </div>
  );
};



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
    setIsCreatingNewTemplate(true);
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
  
  const [jobApplicants, setJobApplicants] = useState<any[]>([]);
  const [isFetchingApplicants, setIsFetchingApplicants] = useState(false);
  const [companyName, setCompanyName] = useState('Empresa Parceira');
  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('colaborh_companies');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((c: any) => ({
            ...c,
            plan: c.plan || 'starter',
            credits: c.credits !== undefined ? c.credits : 5
          }));
        }
      } catch (e) {
        console.error('Erro ao carregar empresas do localStorage:', e);
      }
    }
    return [
      { id: '1', razaoSocial: 'Colaborh Soluções LTDA', nomeFantasia: 'Colaborh', solicitante: 'João Silva', sector: 'Tecnologia', plan: 'starter', credits: 5 }
    ];
  });
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(() => {
    const saved = localStorage.getItem('colaborh_selected_company_id');
    return saved || '1';
  });

  // Ajuste dinâmico de cor de fundo do html e body para casar com o CompanyDashboard
  useEffect(() => {
    document.documentElement.style.backgroundColor = '#f3f4f6';
    document.body.style.backgroundColor = '#f3f4f6';
    return () => {
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

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
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [companySearchQuery, setCompanySearchQuery] = useState('');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target as Node)) {
        setIsCompanyDropdownOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedCompany = companies.find(c => c.id === selectedCompanyId) || companies[0] || { nomeFantasia: 'Colaborh', razaoSocial: 'Colaborh Soluções LTDA' };
  const [selectedResumeApplicant, setSelectedResumeApplicant] = useState<any>(null);
  const [resumeDrawerTab, setResumeDrawerTab] = useState<'curriculo' | 'testes' | 'entrevistas'>('curriculo');

  useEffect(() => {
    if (selectedResumeApplicant) {
      setResumeDrawerTab('curriculo');
    }
  }, [selectedResumeApplicant]);
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

  // Estados para chat com o candidato
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [selectedApplicantForChat, setSelectedApplicantForChat] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isFetchingChat, setIsFetchingChat] = useState(false);

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

  const handleOpenNotes = (applicant: any) => {
    const info = getFullApplicantInfo(applicant);
    const parsedData = parseCandidatePhoneData(info.candidate_phone);
    setSelectedApplicantForNotes(info);
    setTempNotesText(parsedData.notes || '');
    setIsNotesModalOpen(true);
  };

  const loadChatMessages = async (applicationId: string) => {
    if (!applicationId) return;
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: true });
      
      if (!error && data) {
        setChatMessages(data);
        
        // Marcar mensagens do candidato como lidas
        const unreadCandidateMsgs = data.filter(m => m.sender_type === 'candidate' && !m.read);
        if (unreadCandidateMsgs.length > 0) {
          await supabase
            .from('messages')
            .update({ read: true })
            .eq('application_id', applicationId)
            .eq('sender_type', 'candidate');
        }
      }
    } catch (e) {
      console.error('Erro ao buscar mensagens do chat:', e);
    }
  };

  const handleOpenChat = async (applicant: any) => {
    const info = getFullApplicantInfo(applicant);
    setSelectedApplicantForChat(info);
    setIsChatDrawerOpen(true);
    setNewMessageText('');
    setIsFetchingChat(true);
    await loadChatMessages(info.id); // info.id é o application_id
    setIsFetchingChat(false);
  };

  const handleSendMessage = async () => {
    if (!newMessageText.trim() || !selectedApplicantForChat) return;
    
    setIsSendingMessage(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            application_id: selectedApplicantForChat.id,
            sender_type: 'company',
            content: newMessageText.trim(),
            read: false
          }
        ])
        .select();

      if (error) throw error;

      // Limpar o campo e atualizar
      const sentMsg = data?.[0];
      if (sentMsg) {
        setChatMessages(prev => [...prev, sentMsg]);
      }
      setNewMessageText('');
      
      // Notificar candidato por e-mail ou notificação interna
      const email = selectedApplicantForChat.candidate_email || selectedApplicantForChat.email;
      if (email && selectedJob) {
        createNotification(
          email,
          'candidate',
          'Nova mensagem da empresa',
          `Você recebeu uma mensagem da empresa sobre a vaga "${selectedJob.title}".`,
          selectedJob.id
        ).catch(err => console.warn('Erro ao gerar notificação de nova mensagem:', err));
      }
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      alert('Não foi possível enviar a mensagem.');
    } finally {
      setIsSendingMessage(false);
    }
  };

  useEffect(() => {
    if (!isChatDrawerOpen || !selectedApplicantForChat?.id) return;

    const interval = setInterval(() => {
      loadChatMessages(selectedApplicantForChat.id);
    }, 4000);

    return () => clearInterval(interval);
  }, [isChatDrawerOpen, selectedApplicantForChat?.id]);

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

      // Trigger notification for candidate
      const appRecord = jobApplicants.find(a => String(a.id) === String(appId));
      const fullInfo = appRecord ? getFullApplicantInfo(appRecord) : null;
      const emailDestinatario = fullInfo?.candidate_email || fullInfo?.email;
      if (emailDestinatario && selectedJob) {
        const isReprovado = newStatus === 'Reprovado' || newStatus === 'Desclassificado';
        const title = isReprovado ? 'Atualização no Processo Seletivo' : 'Avanço de Etapa';
        const message = isReprovado
          ? `O processo seletivo para a vaga "${selectedJob.title}" foi encerrado para o seu perfil. Agradecemos a sua participação!`
          : `Seu processo seletivo para a vaga "${selectedJob.title}" avançou para a etapa "${newStatus}".`;

        createNotification(
          emailDestinatario,
          'candidate',
          title,
          message,
          selectedJob.id
        ).catch(err => console.warn('Erro ao gerar notificação de atualização de status:', err));
      }

      // Update state
      setJobApplicants(prev => {
        const updatedList = prev.map(app => String(app.id) === String(appId) ? { ...app, status: newStatus } : app);
        
        // Trigger automatic tests if configured for the new stage
        setTimeout(() => {
          const app = updatedList.find(a => String(a.id) === String(appId));
          if (app && selectedJob) {
            const info = getFullApplicantInfo(app);
            const parsedData = parseCandidatePhoneData(app.candidate_phone);
            const currentStageTests = getCurrentJobStageTests(selectedJob);
            const testsForStage = currentStageTests[newStatus] || [];

            testsForStage.forEach(test => {
              const [testKey, trigger = 'auto'] = test.split(':');
              if (trigger === 'auto') {
                let testStatus = '';
                if (testKey === 'disc') testStatus = parsedData.disc;
                else if (testKey === 'mbti') testStatus = parsedData.mbti;
                else if (testKey === 'temperamentos') testStatus = parsedData.temperamentos;
                else if (testKey === 'perguntas') testStatus = parsedData.questions;
                else if (testKey === 'customizado') testStatus = parsedData.customTest;

                const isCompleted = testStatus.startsWith('COMPLETED') || testStatus === 'COMPLETED' || (testStatus && testStatus !== 'PENDING');
                const isPending = testStatus === 'PENDING';

                if (!isCompleted && !isPending) {
                  // Dispatch automatic test request
                  if (testKey === 'disc') handleRequestDiscTest(info);
                  else if (testKey === 'mbti') handleRequestMbtiTest(info);
                  else if (testKey === 'temperamentos') handleRequestTemperamentosTest(info);
                  else if (testKey === 'perguntas') handleRequestQuestions(info);
                  else if (testKey === 'customizado') handleRequestCustomTest(info);
                }
              }
            });
          }
        }, 500);

        return updatedList;
      });
    } catch (err) {
      console.error('Erro ao atualizar status do candidato:', err);
      alert('Erro ao atualizar status do candidato.');
    }
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

  const handleUpdateJobStageTests = async (jobId: string, newStageTests: Record<string, string[]>) => {
    try {
      const jobToUpdate = jobs.find(j => j.id === jobId) || selectedJob;
      if (!jobToUpdate) {
        console.error("Vaga não encontrada para atualização de testes das etapas.");
        return;
      }

      const regex = /===STAGE_TESTS_JSON===[\s\S]*?===FIM_STAGE_TESTS===/g;
      let cleanDesc = (jobToUpdate.description || '').replace(regex, '').trim();
      const updatedDescription = `${cleanDesc}\n\n===STAGE_TESTS_JSON===${JSON.stringify(newStageTests)}===FIM_STAGE_TESTS===`;

      const { error } = await supabase
        .from('jobs')
        .update({
          description: updatedDescription
        })
        .eq('id', jobId);

      if (error) throw error;

      const updatedJob = {
        ...jobToUpdate,
        description: updatedDescription
      };
      
      setSelectedJob(updatedJob);
      setJobs(prevJobs => {
        if (!prevJobs || prevJobs.length === 0) return [updatedJob];
        return prevJobs.map(j => j.id === jobId ? updatedJob : j);
      });
      
      return updatedJob;
    } catch (err) {
      console.error('Erro ao atualizar testes das etapas:', err);
      alert('Erro ao atualizar configurações de testes do processo.');
    }
  };

  const handleAddNewStage = async (stageName: string) => {
    if (!selectedJob) return;
    const trimmed = stageName.trim();
    if (!trimmed) return;
    
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
    const allColumns = currentStages;
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
    if (draggedStage && draggedStage !== targetStage) {
      e.preventDefault();
    }
  };

  const handleDrop = async (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    const sourceStage = e.dataTransfer.getData('text/plain') || draggedStage;
    if (!sourceStage || sourceStage === targetStage) return;

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

  const validateAndDeductCredit = (): boolean => {
    const selectedCompany = companies.find(c => c.id === selectedCompanyId);
    if (!selectedCompany) return false;

    const currentCredits = selectedCompany.credits !== undefined ? selectedCompany.credits : 5;

    if (currentCredits <= 0) {
      alert('Saldo de créditos insuficiente para solicitar este teste comportamental! Adquira mais créditos na aba Faturamento.');
      setActiveTab('Faturamento');
      return false;
    }

    // Deduzir 1 crédito e atualizar no estado
    const updatedCompanies = companies.map(c => {
      if (c.id === selectedCompanyId) {
        return {
          ...c,
          credits: Math.max(0, currentCredits - 1)
        };
      }
      return c;
    });
    setCompanies(updatedCompanies);
    return true;
  };

  const handleRequestDiscTest = async (app: any) => {
    try {
      const currentStatus = app.status;
      const stagesList = getCurrentJobStages(selectedJob);
      const defaultStage = stagesList[0] || 'Triagem';
      const allColumns = stagesList;
      const normalizedStatus = (!currentStatus || currentStatus === 'Triagem' || !allColumns.includes(currentStatus)) 
        ? defaultStage 
        : currentStatus;

      const currentStageTests = getCurrentJobStageTests(selectedJob);
      const testsForStage = currentStageTests[normalizedStatus] || [];
      const hasTestInStage = testsForStage.some(t => t.split(':')[0] === 'disc');

      if (normalizedStatus !== 'Testes' && !hasTestInStage) {
        alert('A solicitação do teste DISC não está configurada para a etapa atual do candidato.');
        return;
      }

      if (!validateAndDeductCredit()) {
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

      // Notificar candidato internamente
      if (email && email !== 'candidato@email.com' && selectedJob) {
        createNotification(
          email,
          'candidate',
          'Teste DISC Solicitado',
          `A empresa solicitou que você realize o teste comportamental DISC 5.0 para a vaga "${jobTitle}".`,
          selectedJob.id
        ).catch(err => console.warn('Erro ao gerar notificação de solicitação do teste DISC:', err));
      }

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
      const allColumns = stagesList;
      const normalizedStatus = (!currentStatus || currentStatus === 'Triagem' || !allColumns.includes(currentStatus)) 
        ? defaultStage 
        : currentStatus;

      const currentStageTests = getCurrentJobStageTests(selectedJob);
      const testsForStage = currentStageTests[normalizedStatus] || [];
      const hasTestInStage = testsForStage.some(t => t.split(':')[0] === 'perguntas');

      if (normalizedStatus !== 'Testes' && !hasTestInStage) {
        alert('A solicitação do Mapeamento de Perfil não está configurada para a etapa atual do candidato.');
        return;
      }

      if (!validateAndDeductCredit()) {
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

      // Notificar candidato internamente
      if (email && email !== 'candidato@email.com' && selectedJob) {
        createNotification(
          email,
          'candidate',
          'Mapeamento de Perfil Solicitado',
          `A empresa solicitou que você responda ao Mapeamento de Perfil para a vaga "${jobTitle}".`,
          selectedJob.id
        ).catch(err => console.warn('Erro ao gerar notificação de solicitação do Mapeamento:', err));
      }

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
      const allColumns = stagesList;
      const normalizedStatus = (!currentStatus || currentStatus === 'Triagem' || !allColumns.includes(currentStatus)) 
        ? defaultStage 
        : currentStatus;

      const currentStageTests = getCurrentJobStageTests(selectedJob);
      const testsForStage = currentStageTests[normalizedStatus] || [];
      const hasTestInStage = testsForStage.some(t => t.split(':')[0] === 'mbti');

      if (normalizedStatus !== 'Testes' && !hasTestInStage) {
        alert('A solicitação do teste MBTI não está configurada para a etapa atual do candidato.');
        return;
      }

      if (!validateAndDeductCredit()) {
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

      // Notificar candidato internamente
      if (email && email !== 'candidato@email.com' && selectedJob) {
        createNotification(
          email,
          'candidate',
          'Teste MBTI Solicitado',
          `A empresa solicitou que você realize o teste de personalidade MBTI para a vaga "${jobTitle}".`,
          selectedJob.id
        ).catch(err => console.warn('Erro ao gerar notificação de solicitação do teste MBTI:', err));
      }

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
      const allColumns = stagesList;
      const normalizedStatus = (!currentStatus || currentStatus === 'Triagem' || !allColumns.includes(currentStatus)) 
        ? defaultStage 
        : currentStatus;

      const currentStageTests = getCurrentJobStageTests(selectedJob);
      const testsForStage = currentStageTests[normalizedStatus] || [];
      const hasTestInStage = testsForStage.some(t => t.split(':')[0] === 'customizado');

      if (normalizedStatus !== 'Testes' && !hasTestInStage) {
        alert('A solicitação do Questionário Customizado não está configurada para a etapa atual do candidato.');
        return;
      }

      if (!validateAndDeductCredit()) {
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

      // Notificar candidato internamente
      if (email && email !== 'candidato@email.com' && selectedJob) {
        createNotification(
          email,
          'candidate',
          'Questionário Customizado Solicitado',
          `A empresa solicitou que você responda ao questionário customizado para a vaga "${jobTitle}".`,
          selectedJob.id
        ).catch(err => console.warn('Erro ao gerar notificação de solicitação do questionário customizado:', err));
      }

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
      const allColumns = stagesList;
      const normalizedStatus = (!currentStatus || currentStatus === 'Triagem' || !allColumns.includes(currentStatus)) 
        ? defaultStage 
        : currentStatus;

      const currentStageTests = getCurrentJobStageTests(selectedJob);
      const testsForStage = currentStageTests[normalizedStatus] || [];
      const hasTestInStage = testsForStage.some(t => t.split(':')[0] === 'temperamentos');

      if (normalizedStatus !== 'Testes' && !hasTestInStage) {
        alert('A solicitação do teste de Temperamentos não está configurada para a etapa atual do candidato.');
        return;
      }

      if (!validateAndDeductCredit()) {
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

      // Notificar candidato internamente
      if (email && email !== 'candidato@email.com' && selectedJob) {
        createNotification(
          email,
          'candidate',
          'Teste de Temperamentos Solicitado',
          `A empresa solicitou que você realize o teste de temperamentos e perfil comportamental para a vaga "${jobTitle}".`,
          selectedJob.id
        ).catch(err => console.warn('Erro ao gerar notificação de solicitação do teste de temperamentos:', err));
      }

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
      showCustomSuccess(`Link de candidatura copiado! Vaga: "${job.title}". Divulgue para potenciais candidatos.`, 'Link Copiado');
    }).catch(err => {
      console.error('Erro ao copiar link:', err);
      // Fallback
      try {
        const textInput = document.createElement('input');
        textInput.value = shareUrl;
        document.body.appendChild(textInput);
        textInput.select();
        document.execCommand('copy');
        document.body.removeChild(textInput);
        showCustomSuccess(`Link copiado com sucesso!`, 'Link Copiado');
      } catch (fallbackErr) {
        console.error('Erro no fallback de cópia:', fallbackErr);
        showCustomAlert('Não foi possível copiar o link de candidatura.', 'Erro');
      }
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
  const [isPublishing, setIsPublishing] = useState(false);
  const [isConfiguringStages, setIsConfiguringStages] = useState(false);

  // Notifications states
  const [notifications, setNotifications] = useState<ColaborhNotification[]>([]);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState(false);

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
  const [talentSubTab, setTalentSubTab] = useState<'all' | 'saved'>('all');
  
  const handleToggleSaveTalent = (talentId: string) => {
    setCompanies(prev => prev.map(c => {
      if (c.id === selectedCompanyId) {
        const saved = c.savedTalents || [];
        const updated = saved.includes(talentId)
          ? saved.filter(id => id !== talentId)
          : [...saved, talentId];
        return { ...c, savedTalents: updated };
      }
      return c;
    }));
  };

  const [jobSearch, setJobSearch] = useState('');
  const [isJobSearchFocused, setIsJobSearchFocused] = useState(false);
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
  }, []);

  const filteredTalents = talents.filter(t => {
    if (!t) return false;
    if (t.role && (t.role.toLowerCase() === 'empresa' || t.role.toLowerCase() === 'company')) {
      return false;
    }

    if (talentSubTab === 'saved') {
      const selectedCompany = companies.find(c => c.id === selectedCompanyId);
      const savedIds = selectedCompany?.savedTalents || [];
      if (!savedIds.includes(t.id)) {
        return false;
      }
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
    role: '', // Novo campo para o cargo
    modality: 'Presencial',
    state: '',
    city: '',
    remunerationType: 'Fixo', // Faixa Salarial, Fixo ou A Combinar
    salary: '',
    salaryMin: '',
    salaryMax: '',
    hasBonus: false,
    bonusType: 'Comissão',
    bonusValue: '',
    contractType: 'CLT',
    benefits: {
      vt: { selected: false, value: '' },
      va: { selected: false, value: '' },
      healthInsurance: false,
      healthInsuranceCopay: false, // Saúde com coparticipação
      healthInsuranceFamily: false, // Saúde estende para familiar
      dentalPlan: false,
      dentalPlanFamily: false // Dental estende para familiar
    },
    extraBenefits: [] as string[],
    workSchedule: '5x2',
    isFirstJob: false,
    isPcd: false, // Vaga para PcD
    pcdDetails: '',
    minAge: 18,
    positions: '1', // Quantidade de vagas
    requestReason: 'Aumento de quadro', // Aumento de quadro ou Substituição de pessoal
    isUrgent: false, // Contratação de urgência
    description: '',
    responsibilities: '', // Descrição de atribuições
    requirements: [] as string[], // Mantido para compatibilidade
    stages: ['Análise de Currículo']
  });


  const [talentCities, setTalentCities] = useState<string[]>([]);
  const [isTalentLoadingCities, setIsTalentLoadingCities] = useState(false);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!vacancyForm.title.trim()) return "O título da vaga é obrigatório.";
      if (!vacancyForm.role.trim()) return "O cargo é obrigatório.";
      if (vacancyForm.modality === 'Presencial' || vacancyForm.modality === 'Híbrido') {
        if (!vacancyForm.state) return "O estado é obrigatório.";
        if (!vacancyForm.city) return "A cidade é obrigatória.";
      }
      if (vacancyForm.remunerationType === 'Fixo') {
        if (!vacancyForm.salary.trim()) return "O salário proposto é obrigatório.";
      } else if (vacancyForm.remunerationType === 'Faixa Salarial') {
        if (!vacancyForm.salaryMin.trim() || !vacancyForm.salaryMax.trim()) {
          return "Os valores mínimo e máximo da faixa salarial são obrigatórios.";
        }
      }
      if (vacancyForm.hasBonus && !vacancyForm.bonusValue.trim()) {
        return "Informe o valor da comissão ou premiação.";
      }
      if (!vacancyForm.contractType) return "O tipo de contratação é obrigatório.";
      if (!vacancyForm.workSchedule) return "A escala de trabalho é obrigatória.";
    }

    if (step === 2) {
      if (!vacancyForm.positions || parseInt(vacancyForm.positions) <= 0) {
        return "A quantidade de posições disponíveis deve ser maior que zero.";
      }
      if (!vacancyForm.requestReason) return "O motivo da requisição é obrigatório.";
    }

    if (step === 3) {
      if (!vacancyForm.description.trim()) return "A descrição da vaga é obrigatória.";
      if (!vacancyForm.responsibilities.trim()) return "A descrição de atribuições é obrigatória.";
    }

    if (step === 4) {
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

  // Métricas do Dashboard calculadas de forma dinâmica e real
  const totalCandidatesReal = companyApplications.length;

  const candidatesInInterview = companyApplications.filter(app => {
    const s = (app.status || '').toLowerCase();
    return s === 'entrevista' || s === 'entrevistas';
  }).length;

  const closedOrPausedJobsCount = companyJobs.filter(j => {
    const s = (j.status || '').toLowerCase();
    return s === 'paused' || s === 'pausada' || s === 'closed' || s === 'encerrada';
  }).length;

  const recentCandidatesCount = companyApplications.filter(app => {
    if (!app.created_at) return false;
    const appDate = new Date(app.created_at);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return appDate >= sevenDaysAgo;
  }).length;

  const recentJobsCount = companyJobs.filter(job => {
    if (!job.created_at) return false;
    const jobDate = new Date(job.created_at);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return jobDate >= sevenDaysAgo;
  }).length;
  
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

  const [interviews, setInterviews] = useState<any[]>([]);
  const [isFetchingInterviews, setIsFetchingInterviews] = useState(false);
  const [activeVideoMeeting, setActiveVideoMeeting] = useState<any | null>(null);

  const loadInterviews = async () => {
    if (!import.meta.env.VITE_SUPABASE_URL) return;
    setIsFetchingInterviews(true);
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .order('date_time', { ascending: true });
      if (!error && data) {
        setInterviews(data);
      }
    } catch (err) {
      console.error('Erro ao buscar entrevistas:', err);
    } finally {
      setIsFetchingInterviews(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, [selectedCompanyId, activeTab]);

  const handleCreateInterview = async (jobId: string, candidateEmail: string, dateTime: string, notes: string) => {
    try {
      const roomName = `colaborh-interview-${Math.random().toString(36).substring(2, 11)}`;
      const companyName = selectedCompany?.nomeFantasia || 'Empresa Colaborh';
      
      const { data, error } = await supabase
        .from('interviews')
        .insert({
          job_id: jobId,
          candidate_email: candidateEmail,
          company_name: companyName,
          date_time: dateTime,
          status: 'scheduled',
          room_name: roomName,
          notes: notes
        })
        .select();

      if (error) throw error;

      await loadInterviews();

      // Mover o candidato para a etapa "Entrevista" no Kanban se ainda não estiver nela
      const candidateApp = jobApplicants.find(a => {
        const info = getFullApplicantInfo(a);
        return info?.email === candidateEmail || info?.candidate_email === candidateEmail;
      });
      if (candidateApp && candidateApp.status !== 'Entrevista') {
        await handleUpdateApplicantStatus(candidateApp.id, 'Entrevista');
      }

      // Trigger notification for candidate
      const formattedDate = new Date(dateTime).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
      createNotification(
        candidateEmail,
        'candidate',
        'Entrevista Agendada',
        `Sua entrevista de vídeo para a vaga na "${companyName}" foi agendada para ${formattedDate}.`,
        jobId
      ).catch(err => console.warn('Erro ao notificar agendamento de entrevista:', err));

      return data;
    } catch (err) {
      console.error('Erro ao agendar entrevista:', err);
      alert('Erro ao agendar entrevista seletiva.');
    }
  };

  const handleUpdateInterviewStatus = async (interviewId: string, newStatus: 'scheduled' | 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('interviews')
        .update({ status: newStatus })
        .eq('id', interviewId);

      if (error) throw error;

      await loadInterviews();

      const interview = interviews.find(i => i.id === interviewId);
      if (interview) {
        const companyName = selectedCompany?.nomeFantasia || 'Empresa Colaborh';
        const formattedDate = new Date(interview.date_time).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
        
        let title = 'Entrevista Cancelada';
        let message = `Sua entrevista agendada para ${formattedDate} com a "${companyName}" foi cancelada.`;
        if (newStatus === 'completed') {
          title = 'Entrevista Concluída';
          message = `Sua entrevista de vídeo com a "${companyName}" foi concluída. Acompanhe as próximas etapas!`;
        }

        createNotification(
          interview.candidate_email,
          'candidate',
          title,
          message,
          interview.job_id
        ).catch(err => console.warn('Erro ao notificar atualização de entrevista:', err));
      }
    } catch (err) {
      console.error('Erro ao atualizar status da entrevista:', err);
    }
  };

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

  const loadCompanyNotifications = async () => {
    if (!selectedCompany?.nomeFantasia) return;
    try {
      const list = await getNotifications(selectedCompany.nomeFantasia, 'company');
      setNotifications(list);
    } catch (e) {
      console.error('Erro ao carregar notificações da empresa:', e);
    }
  };

  useEffect(() => {
    loadCompanyNotifications();
    
    // Polling every 8 seconds for notifications
    const interval = setInterval(() => {
      loadCompanyNotifications();
    }, 8000);

    return () => clearInterval(interval);
  }, [selectedCompany?.nomeFantasia]);

  // Close job details/applicants/Kanban when switching company
  useEffect(() => {
    setSelectedJob(null);
  }, [selectedCompanyId]);

  const handlePublish = async () => {
    if (isPublishing) return;

    // Validar limites de vagas com base no plano da empresa
    const activeJobsForCompany = jobs.filter(job => 
      job.company_name === selectedCompany?.nomeFantasia && 
      (job.status === 'active' || job.status === 'ativa' || !job.status)
    ).length;

    const plan = selectedCompany?.plan || 'starter';
    let limit = 2;
    if (plan === 'growth') limit = 8;
    else if (plan === 'enterprise') limit = Infinity;

    if (activeJobsForCompany >= limit) {
      const errorMsg = `Limite de vagas ativas atingido para o plano ${plan.toUpperCase()} (${limit} vaga${limit > 1 ? 's' : ''}). Faça o upgrade na aba Faturamento para publicar mais vagas.`;
      alert(errorMsg);
      setActiveTab('Faturamento');
      return;
    }

    let currentStages = vacancyForm.stages;

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
      setIsPublishing(true);
      let finalDescription = vacancyForm.description;
      if (vacancyForm.responsibilities.trim()) {
        finalDescription += `\n\nResponsabilidades e Atribuições:\n${vacancyForm.responsibilities}`;
      }

      const benefitTextList: string[] = [];
      if (vacancyForm.benefits.vt.selected) {
        benefitTextList.push(`Vale Transporte: ${vacancyForm.benefits.vt.value || 'Sim'}`);
      }
      if (vacancyForm.benefits.va.selected) {
        benefitTextList.push(`Vale Alimentação/Refeição: ${vacancyForm.benefits.va.value || 'Sim'}`);
      }
      if (vacancyForm.benefits.healthInsurance) {
        let healthDetails = 'Plano de Saúde';
        const subOpts = [];
        if (vacancyForm.benefits.healthInsuranceCopay) subOpts.push('com coparticipação');
        if (vacancyForm.benefits.healthInsuranceFamily) subOpts.push('estendido para familiar');
        if (subOpts.length > 0) {
          healthDetails += ` (${subOpts.join(', ')})`;
        }
        benefitTextList.push(healthDetails);
      }
      if (vacancyForm.benefits.dentalPlan) {
        let dentalDetails = 'Plano Odontológico';
        if (vacancyForm.benefits.dentalPlanFamily) {
          dentalDetails += ' (estendido para familiar)';
        }
        benefitTextList.push(dentalDetails);
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
      if (vacancyForm.role) {
        metaDetails.push(`💼 Cargo: ${vacancyForm.role}`);
      }
      if (vacancyForm.modality) {
        metaDetails.push(`🏢 Modalidade: ${vacancyForm.modality}`);
      }
      if (vacancyForm.city || vacancyForm.state) {
        metaDetails.push(`📍 Localização: ${vacancyForm.city || ''}${vacancyForm.city && vacancyForm.state ? ' - ' : ''}${vacancyForm.state || ''}`);
      }
      if (vacancyForm.remunerationType) {
        let remStr = `💰 Remuneração: ${vacancyForm.remunerationType}`;
        if (vacancyForm.remunerationType === 'Fixo' && vacancyForm.salary) {
          remStr += ` (${vacancyForm.salary})`;
        } else if (vacancyForm.remunerationType === 'Faixa Salarial' && (vacancyForm.salaryMin || vacancyForm.salaryMax)) {
          remStr += ` (${vacancyForm.salaryMin || 'R$ 0,00'} a ${vacancyForm.salaryMax || 'R$ 0,00'})`;
        }
        metaDetails.push(remStr);
      }
      if (vacancyForm.hasBonus) {
        metaDetails.push(`🎁 Extra: ${vacancyForm.bonusType} (${vacancyForm.bonusValue || 'A combinar'})`);
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
      if (vacancyForm.isFirstJob) {
        metaDetails.push(`👶 Oportunidade para 1º Emprego: Sim`);
      }
      if (vacancyForm.isPcd) {
        metaDetails.push(`♿ Vaga para PcD: Sim${vacancyForm.pcdDetails ? ` (${vacancyForm.pcdDetails})` : ''}`);
      }
      if (vacancyForm.positions) {
        metaDetails.push(`👥 Posições Disponíveis: ${vacancyForm.positions}`);
      }
      if (vacancyForm.requestReason) {
        metaDetails.push(`📋 Motivo da Requisição: ${vacancyForm.requestReason}`);
      }
      if (vacancyForm.isUrgent) {
        metaDetails.push(`🚨 Contratação de Urgência: Sim`);
      }
      if (metaDetails.length > 0) {
        detailedDescriptionStr = metaDetails.join('\n') + '\n\n' + detailedDescriptionStr;
      }

      // Always append the stages array to description as a serialized string for bulletproof fallback
      detailedDescriptionStr = detailedDescriptionStr + `\n\n===ETAPAS_JSON===${JSON.stringify(currentStages)}===FIM_ETAPAS===`;

      // Start with all columns, we will drop invalid ones if Supabase returns PGRST204 (Schema Cache mismatch)
      let payload: any = {
        title: vacancyForm.title,
        role: vacancyForm.role,
        company_name: selectedCompany.nomeFantasia,
        modality: vacancyForm.modality,
        state: vacancyForm.state,
        city: vacancyForm.city,
        salary: vacancyForm.remunerationType === 'Fixo' ? vacancyForm.salary : (vacancyForm.remunerationType === 'Faixa Salarial' ? `${vacancyForm.salaryMin} - ${vacancyForm.salaryMax}` : 'A Combinar'),
        salary_min: vacancyForm.salaryMin,
        salary_max: vacancyForm.salaryMax,
        remuneration_type: vacancyForm.remunerationType,
        has_bonus: vacancyForm.hasBonus,
        bonus_type: vacancyForm.bonusType,
        bonus_value: vacancyForm.bonusValue,
        contract_type: vacancyForm.contractType,
        description: detailedDescriptionStr,
        requirements: vacancyForm.requirements,
        stages: currentStages,
        work_schedule: vacancyForm.workSchedule,
        min_age: vacancyForm.minAge,
        is_first_job: vacancyForm.isFirstJob,
        is_pcd: vacancyForm.isPcd,
        pcd_details: vacancyForm.pcdDetails,
        positions: parseInt(vacancyForm.positions) || 1,
        request_reason: vacancyForm.requestReason,
        is_urgent: vacancyForm.isUrgent,
        responsibilities: vacancyForm.responsibilities,
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
    } finally {
      setIsPublishing(false);
    }
  };

  const handleRegisterCompany = () => {
    if (!companyForm.razaoSocial.trim() || !companyForm.nomeFantasia.trim() || !companyForm.solicitante.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (editingCompanyId) {
      // Editar empresa existente
      const updatedCompanies = companies.map(c => {
        if (c.id === editingCompanyId) {
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
      setIsRegisteringCompany(false);
      alert('Empresa atualizada com sucesso!');
    } else {
      // Criar nova empresa
      const newCompany: Company = {
        id: Date.now().toString(),
        razaoSocial: companyForm.razaoSocial,
        nomeFantasia: companyForm.nomeFantasia,
        solicitante: companyForm.solicitante,
        sector: companyForm.sector || 'Geral',
        logo: companyForm.logo,
        plan: 'starter',
        credits: 5
      };

      setCompanies([...companies, newCompany]);
      setSelectedCompanyId(newCompany.id); // Auto-seleciona a nova empresa cadastrada
      setIsRegisteringCompany(false);
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



  const renderInterviewsTab = () => {
    const companyJobIds = companyJobs.map(j => j.id);
    const filteredInterviews = interviews.filter(i => companyJobIds.includes(i.job_id));

    return (
      <div className="space-y-6 text-left">
        <div className="flex justify-between items-center pb-4 border-b border-slate-200/50">
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight uppercase">Entrevistas por Vídeo</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Gerencie agendamentos e faça chamadas de vídeo integradas com os candidatos</p>
          </div>
        </div>

        {filteredInterviews.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md p-12 rounded-[24px] border border-white/50 shadow-sm text-center max-w-xl mx-auto mt-10">
            <div className="w-16 h-16 bg-[#533af6]/10 rounded-2xl flex items-center justify-center text-[#533af6] mx-auto mb-4">
              <Video size={28} className="stroke-[2]" />
            </div>
            <h3 className="text-base font-bold text-slate-800 uppercase tracking-tight">Nenhuma entrevista agendada</h3>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Você pode agendar entrevistas por chamada de vídeo diretamente no perfil dos candidatos abrindo os detalhes no Kanban da vaga correspondente.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInterviews.map((item) => {
              const matchedJob = jobs.find(j => j.id === item.job_id);
              const formattedDate = new Date(item.date_time).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
              const candidate = jobApplicants.find(a => getFullApplicantInfo(a)?.email === item.candidate_email || getFullApplicantInfo(a)?.candidate_email === item.candidate_email);
              const candidateName = candidate ? getFullApplicantInfo(candidate).candidate_name : item.candidate_email;

              return (
                <div 
                  key={item.id}
                  className="bg-white/80 backdrop-blur-md border border-white/50 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(83,58,246,0.02)] flex flex-col justify-between min-h-[200px]"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-[#533af6] bg-[#533af6]/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {formattedDate}
                      </span>
                      <span className={`text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        item.status === 'scheduled'
                          ? 'bg-amber-100 text-amber-700'
                          : item.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {item.status === 'scheduled' ? 'Agendada' : item.status === 'completed' ? 'Concluída' : 'Cancelada'}
                      </span>
                    </div>

                    <div className="text-left min-w-0">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight truncate">
                        {candidateName}
                      </h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate">
                        Vaga: {matchedJob ? cleanEmojiFromText(matchedJob.title) : 'Vaga Indisponível'}
                      </p>
                    </div>

                    {item.notes && (
                      <p className="text-[10px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic line-clamp-2">
                        "{item.notes}"
                      </p>
                    )}
                  </div>

                  {item.status === 'scheduled' && (
                    <div className="flex gap-2.5 mt-5 pt-4 border-t border-slate-100/60">
                      <button
                        type="button"
                        onClick={() => setActiveVideoMeeting({ roomName: item.room_name, userName: selectedCompany?.nomeFantasia || 'Empresa Colaborh' })}
                        className="flex-1 py-2 px-3 bg-[#533af6] hover:bg-[#432ec4] text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-1 shadow-sm"
                      >
                        <Video size={12} className="stroke-[2.5]" /> Entrar na Sala
                      </button>
                      
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUpdateInterviewStatus(item.id, 'completed')}
                          title="Marcar como Concluída"
                          className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border border-emerald-100 cursor-pointer outline-none flex items-center justify-center"
                        >
                          Concluir
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateInterviewStatus(item.id, 'cancelled')}
                          title="Cancelar Entrevista"
                          className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border border-rose-100 cursor-pointer outline-none flex items-center justify-center"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderCandidateInterviewsDrawer = () => {
    if (!selectedResumeApplicant) return null;
    
    const companyJobIds = companyJobs.map(j => j.id);
    const candidateEmail = selectedResumeApplicant.candidate_email || selectedResumeApplicant.email;
    const candidateInterviews = interviews.filter(i => 
      companyJobIds.includes(i.job_id) && 
      (i.candidate_email === candidateEmail)
    );

    const matchedJob = selectedJob || companyJobs.find(j => j.id === selectedResumeApplicant.job_id);

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-100 rounded-full overflow-hidden shrink-0 border border-slate-200/60 flex items-center justify-center">
            {selectedResumeApplicant.profile_pic ? (
              <img src={selectedResumeApplicant.profile_pic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={20} className="text-slate-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight truncate leading-none">
              {selectedResumeApplicant.candidate_name}
            </h4>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
              {selectedResumeApplicant.city || 'Não inf.'}{selectedResumeApplicant.state ? `, ${selectedResumeApplicant.state}` : ''}
            </p>
          </div>
        </div>

        {matchedJob && (
          <div className="bg-white p-6 rounded-[24px] border border-slate-150/60 shadow-2xs space-y-4">
            <h5 className="text-[10px] font-black text-[#533af6] uppercase tracking-widest border-b border-slate-100 pb-2">
              Agendar Nova Entrevista por Vídeo
            </h5>
            
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const dateVal = (form.elements.namedItem('interview_date') as HTMLInputElement).value;
                const notesVal = (form.elements.namedItem('interview_notes') as HTMLTextAreaElement).value;
                
                if (!dateVal) {
                  alert('Por favor, selecione a data e hora da entrevista.');
                  return;
                }
                
                await handleCreateInterview(matchedJob.id, candidateEmail, dateVal, notesVal);
                form.reset();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Data e Hora da Entrevista</label>
                  <input
                    type="datetime-local"
                    name="interview_date"
                    required
                    className="w-full px-4 py-2.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#533af6]/50 focus:ring-2 focus:ring-[#533af6]/5 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Notas / Instruções para o Candidato</label>
                  <textarea
                    name="interview_notes"
                    placeholder="Ex: Trazer portfólio, ter um local silencioso para a chamada..."
                    rows={3}
                    className="w-full px-4 py-2.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#533af6]/50 focus:ring-2 focus:ring-[#533af6]/5 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#533af6] hover:bg-[#432ec4] text-white rounded-full font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-[#533af6]/10 border-0"
                >
                  Agendar Entrevista
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-widest border-b border-slate-150/40 pb-2">
            Entrevistas Agendadas
          </h5>

          {candidateInterviews.length === 0 ? (
            <p className="text-slate-400 text-xs italic">Nenhuma entrevista agendada com este candidato.</p>
          ) : (
            <div className="space-y-3">
              {candidateInterviews.map((item) => {
                const formattedDate = new Date(item.date_time).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
                
                return (
                  <div key={item.id} className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-3xs flex flex-col justify-between gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-[10px] font-black text-[#533af6] uppercase tracking-wider">
                          {formattedDate}
                        </div>
                        {item.notes && (
                          <p className="text-[10px] text-slate-500 mt-2 bg-slate-50 p-2.5 rounded-xl italic text-left">
                            "{item.notes}"
                          </p>
                        )}
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        item.status === 'scheduled'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : item.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                        {item.status === 'scheduled' ? 'Agendada' : item.status === 'completed' ? 'Concluída' : 'Cancelada'}
                      </span>
                    </div>

                    {item.status === 'scheduled' && (
                      <div className="flex gap-2 border-t border-slate-100/60 pt-3">
                        <button
                          type="button"
                          onClick={() => setActiveVideoMeeting({ roomName: item.room_name, userName: selectedCompany?.nomeFantasia || 'Empresa Colaborh' })}
                          className="flex-1 py-1.5 px-3 bg-[#533af6] hover:bg-[#432ec4] text-white rounded-full text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-1"
                        >
                          <Video size={10} className="stroke-[2.5]" /> Entrar na Sala
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateInterviewStatus(item.id, 'completed')}
                          className="py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-wider transition-all border border-emerald-100 cursor-pointer outline-none"
                        >
                          Concluir
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateInterviewStatus(item.id, 'cancelled')}
                          className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-full text-[9px] font-black uppercase tracking-wider transition-all border border-rose-100 cursor-pointer outline-none"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen relative font-sans" style={{ backgroundColor: '#faf8ff' }}>
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

      {/* Sidebar Desktop - MATCH CANDIDATE STYLE */}
      <aside className="hidden lg:flex lg:flex-col lg:bg-gradient-to-b lg:from-[#940dff] lg:to-[#533af6] lg:fixed lg:z-[100] lg:left-6 lg:top-32 lg:w-14 lg:h-fit lg:rounded-full lg:border-0 lg:shadow-[0_10px_30px_rgba(83,58,246,0.3)] lg:p-0 lg:py-2 lg:px-0">
        <nav className="space-y-4 w-full flex flex-col items-center justify-start">
          <SidebarItem icon={BarChart3} label="Dashboard" activeTab={activeTab} setActiveTab={handleSelectTab} isSidebarExpanded={false} />
          <SidebarItem icon={Briefcase} label="Minhas Vagas" activeTab={activeTab} setActiveTab={handleSelectTab} isSidebarExpanded={false} />
          <SidebarItem icon={Search} label="Banco de Talentos" activeTab={activeTab} setActiveTab={handleSelectTab} isSidebarExpanded={false} />
          <SidebarItem icon={Building} label="Empresas" activeTab={activeTab} setActiveTab={handleSelectTab} isSidebarExpanded={false} />
          <SidebarItem icon={Award} label="Avaliações" activeTab={activeTab} setActiveTab={handleSelectTab} isSidebarExpanded={false} />
          <SidebarItem icon={Video} label="Entrevistas" activeTab={activeTab} setActiveTab={handleSelectTab} isSidebarExpanded={false} />
          <SidebarItem icon={CreditCard} label="Faturamento" activeTab={activeTab} setActiveTab={handleSelectTab} isSidebarExpanded={false} />
        </nav>
      </aside>

      {/* Sidebar Mobile - RESPONSIVE MENU DRAWER */}
      <aside className={`w-64 bg-gradient-to-b from-[#940dff] to-[#533af6] p-6 flex flex-col fixed h-full z-[100] shadow-2xl transition-all duration-300 lg:hidden ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="mb-8 flex justify-between items-center w-full">
          <img src="/logo-original.png" alt="Colaborh" className="h-9 w-auto" />
          <button 
            onClick={() => setIsMobileSidebarOpen(false)} 
            className="text-white/70 hover:text-white p-1"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-3 w-full flex flex-col">
          <SidebarItem icon={BarChart3} label="Dashboard" activeTab={activeTab} setActiveTab={(tab) => { handleSelectTab(tab); setIsMobileSidebarOpen(false); }} isSidebarExpanded={true} />
          <SidebarItem icon={Briefcase} label="Minhas Vagas" activeTab={activeTab} setActiveTab={(tab) => { handleSelectTab(tab); setIsMobileSidebarOpen(false); }} isSidebarExpanded={true} />
          <SidebarItem icon={Search} label="Banco de Talentos" activeTab={activeTab} setActiveTab={(tab) => { handleSelectTab(tab); setIsMobileSidebarOpen(false); }} isSidebarExpanded={true} />
          <SidebarItem icon={Building} label="Empresas" activeTab={activeTab} setActiveTab={(tab) => { handleSelectTab(tab); setIsMobileSidebarOpen(false); }} isSidebarExpanded={true} />
          <SidebarItem icon={Award} label="Avaliações" activeTab={activeTab} setActiveTab={(tab) => { handleSelectTab(tab); setIsMobileSidebarOpen(false); }} isSidebarExpanded={true} />
          <SidebarItem icon={Video} label="Entrevistas" activeTab={activeTab} setActiveTab={(tab) => { handleSelectTab(tab); setIsMobileSidebarOpen(false); }} isSidebarExpanded={true} />
          <SidebarItem icon={CreditCard} label="Faturamento" activeTab={activeTab} setActiveTab={(tab) => { handleSelectTab(tab); setIsMobileSidebarOpen(false); }} isSidebarExpanded={true} />
          <SidebarItem icon={Settings} label="Configurações" activeTab={activeTab} setActiveTab={(tab) => { handleSelectTab(tab); setIsMobileSidebarOpen(false); }} isSidebarExpanded={true} />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10 w-full">
          <button 
            onClick={() => { setIsMobileSidebarOpen(false); onLogout(); }}
            className="w-full flex items-center space-x-3 py-2.5 rounded-xl text-red-200 hover:text-red-100 hover:bg-red-500/10 transition-all font-bold text-xs uppercase tracking-widest"
          >
            <LogOut size={19} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 min-h-screen flex flex-col bg-transparent transition-all duration-300 relative z-10 min-w-0 max-w-full">
        {/* Cabeçalho Premium - Quadrado e Colado nas Laterais e Topo (Compacto para melhor aproveitamento de tela) */}
        <header className="sticky top-0 z-40 w-full rounded-none bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-sm px-4 lg:pl-28 lg:pr-12 py-2 flex flex-col gap-0 transition-all duration-300">
          {/* Top row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 w-full">
            {/* Lado Esquerdo: Botão Menu Mobile + Logo (sem toggle sidebar desktop) */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="lg:hidden p-2 text-slate-500 hover:text-slate-700 rounded-xl hover:bg-slate-50 transition-all border-0 bg-transparent cursor-pointer"
                >
                  <Menu size={22} />
                </button>
                <img src="/logo-original.png" alt="Colaborh" className="h-9 md:h-11 w-auto object-contain shrink-0" />
              </div>
            </div>

            {/* Lado Direito: Suporte + Notificações + Seletor de Empresa + Avatar Dropdown */}
            <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto justify-end">
              {/* Botão de Chat / Suporte */}
              <button 
                onClick={() => showCustomAlert("Suporte Colaborh: Como podemos te ajudar hoje?", "Suporte")}
                className="w-9 h-9 bg-primary-600 hover:bg-primary-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-primary-600/35 transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer border-0"
                title="Suporte"
              >
                <MessageSquare size={15} />
              </button>

              {/* Botão de Notificações */}
              <button
                onClick={() => setIsNotificationsDrawerOpen(true)}
                className="relative w-9 h-9 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-500 hover:text-slate-700 rounded-full flex items-center justify-center transition-all active:scale-95 shrink-0 shadow-sm cursor-pointer"
                title="Notificações"
              >
                <Bell size={15} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white animate-pulse">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
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

                    <div className="border-t border-slate-100 mt-2 pt-2 px-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCompanyId('new');
                          setCompanyForm({ razaoSocial: '', nomeFantasia: '', solicitante: '', sector: '', logo: '' });
                          setIsRegisteringCompany(true);
                          setActiveTab('Empresas');
                          setIsCompanyDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-[#533af6] hover:bg-[#4326e5] text-white rounded-xl text-[9.5px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-sm active:scale-95 border-0"
                      >
                        <Plus size={12} className="stroke-[2.5]" /> Cadastrar Empresa
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Divisor Vertical */}
              <div className="h-6 w-[1px] bg-slate-200" />

              {/* Avatar com Menu Dropdown (como no candidato) */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm shrink-0 cursor-pointer focus:outline-none transition-transform hover:scale-105 active:scale-95 p-0"
                  title={selectedCompany?.nomeFantasia}
                >
                  {selectedCompany?.logo ? (
                    <img src={selectedCompany.logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-slate-600 font-extrabold text-xs">
                      {selectedCompany?.nomeFantasia ? selectedCompany.nomeFantasia.substring(0, 2).toUpperCase() : 'CO'}
                    </span>
                  )}
                </button>

                {/* Dropdown Menu (Configurações e Sair) */}
                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md border border-slate-200/50 rounded-2xl shadow-[0_10px_30px_rgba(83,58,246,0.08)] py-3 px-2 z-50 text-left"
                    >
                      {/* Header do Dropdown: Informações da Empresa */}
                      <div className="px-3 py-2.5 border-b border-slate-100 mb-2">
                        <p className="text-[10px] font-black text-[#533af6] uppercase tracking-wider leading-none mb-1">Empresa Ativa</p>
                        <p className="text-xs font-bold text-slate-800 truncate">{selectedCompany?.nomeFantasia || 'Colaborh'}</p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{selectedCompany?.razaoSocial}</p>
                      </div>

                      {/* Itens do Menu */}
                      <button
                        onClick={() => {
                          handleSelectTab('Configurações');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-bold text-slate-600 hover:bg-[#533af6]/5 hover:text-[#533af6] transition-all cursor-pointer border-0 bg-transparent focus:outline-none"
                      >
                        <Settings size={19} className="text-slate-400" />
                        <span>Configurações</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer border-0 bg-transparent focus:outline-none"
                      >
                        <LogOut size={19} className="text-red-400" />
                        <span>Sair</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>





          {/* Bottom row (AI search bar + subtabs glued to the header for Talent Bank) */}
                    {activeTab === 'Avaliações' && (
            <div className="flex -mx-6 bg-transparent px-6 relative justify-between items-center w-full">
              <div className="flex relative">
                {(() => {
                  const candidatesWithTestsCount = companyApplications.map(app => {
                    const phoneStr = app.candidate_phone || '';
                    const parsedData = parseCandidatePhoneData(phoneStr);
                    let discStatus = parsedData.disc ? (parsedData.disc.startsWith('COMPLETED===') ? 'COMPLETED' : parsedData.disc === 'PENDING' ? 'PENDING' : 'NONE') : 'NONE';
                    let mbtiStatus = parsedData.mbti ? (parsedData.mbti.startsWith('COMPLETED===') ? 'COMPLETED' : parsedData.mbti === 'PENDING' ? 'PENDING' : 'NONE') : 'NONE';
                    let questionsStatus = parsedData.questions ? (parsedData.questions.startsWith('COMPLETED===') ? 'COMPLETED' : parsedData.questions === 'PENDING' ? 'PENDING' : 'NONE') : 'NONE';
                    let temperamentosStatus = parsedData.temperamentos ? (parsedData.temperamentos.startsWith('COMPLETED===') ? 'COMPLETED' : parsedData.temperamentos === 'PENDING' ? 'PENDING' : 'NONE') : 'NONE';
                    let customTestStatus = parsedData.customTest ? (parsedData.customTest.startsWith('COMPLETED===') ? 'COMPLETED' : parsedData.customTest === 'PENDING' ? 'PENDING' : 'NONE') : 'NONE';
                    return {
                      discStatus,
                      mbtiStatus,
                      questionsStatus,
                      temperamentosStatus,
                      customTestStatus
                    };
                  }).filter(c => 
                    c.discStatus !== 'NONE' || 
                    c.mbtiStatus !== 'NONE' || 
                    c.questionsStatus !== 'NONE' || 
                    c.temperamentosStatus !== 'NONE' ||
                    c.customTestStatus !== 'NONE'
                  ).length;

                  const tabs = [
                    { id: 'relatorios', label: 'Relatórios de Candidatos', count: candidatesWithTestsCount, icon: FileText },
                    { id: 'criar', label: 'Biblioteca de Testes', count: customTemplates.length, icon: Bookmark },
                    { id: 'guia', label: 'Guia de Testes', count: 4, icon: Award }
                  ];
                  const tabIndex = tabs.findIndex(t => t.id === resultsSubTab);

                  return (
                    <>
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setResultsSubTab(tab.id as any)}
                          className={`flex items-center justify-center gap-2 w-52 py-4 border-b-2 font-medium text-[12px] uppercase tracking-wider transition-all border-transparent ${
                            resultsSubTab === tab.id 
                              ? 'text-slate-900 font-medium' 
                              : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          <tab.icon size={14} className={resultsSubTab === tab.id ? 'text-[#533af6]' : 'text-slate-400'} />
                          <span>{tab.label} ({tab.count})</span>
                        </button>
                      ))}
                      <motion.div 
                        animate={{ x: tabIndex * 208 }}
                        className="absolute bottom-0 left-0 h-[2px] bg-[#533af6]"
                        style={{ width: 208 }}
                        transition={{ type: 'spring', stiffness: 120, damping: 22 }}
                      />
                    </>
                  );
                })()}
              </div>

              <button 
                type="button"
                onClick={handleStartNewTemplate}
                className="flex items-center gap-2 px-5 py-3 bg-[#533af6] hover:bg-[#4326e5] text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 border-0 cursor-pointer shrink-0 mr-6 mb-2.5 sm:mb-1.5"
              >
                <Plus size={13} className="stroke-[2.5]" /> Criar Questionário
              </button>
            </div>
          )}

        </header>

        <main className="flex-1 p-6 pt-3 lg:pt-5 lg:pb-10 lg:pl-28 lg:pr-12 relative transition-all duration-300 z-10 min-w-0 overflow-x-hidden">
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
                {/* Título da Página */}
                <div className="flex items-center justify-between mb-2">
                  <div className="text-left">
                    <h1 className="text-lg font-black text-slate-800 uppercase tracking-wider">
                      Dashboard
                    </h1>
                  </div>
                </div>

                {/* Top Metrics Cards - Estilo do Candidato com Dados Reais e Layout Horizontal */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { 
                      label: 'Vagas Ativas', 
                      value: activeJobsCount, 
                      trend: recentJobsCount > 0 ? `+${recentJobsCount} esta semana` : 'Estável', 
                      trendUp: recentJobsCount > 0,
                      icon: Briefcase, 
                      color: 'text-[#533af6]', 
                      bg: 'bg-[#533af6]/10',
                      badgeBg: 'bg-[#533af6]/5 text-[#533af6]'
                    },
                    { 
                      label: 'Total de Candidatos', 
                      value: totalCandidatesReal, 
                      trend: recentCandidatesCount > 0 ? `+${recentCandidatesCount} esta semana` : 'Estável', 
                      trendUp: recentCandidatesCount > 0,
                      icon: Users, 
                      color: 'text-indigo-600', 
                      bg: 'bg-indigo-600/10',
                      badgeBg: 'bg-indigo-600/5 text-indigo-600'
                    },
                    { 
                      label: 'Em Entrevista', 
                      value: candidatesInInterview, 
                      trend: candidatesInInterview > 0 ? 'Processo Ativo' : 'Sem agend.', 
                      trendUp: candidatesInInterview > 0,
                      icon: Calendar, 
                      color: 'text-emerald-600', 
                      bg: 'bg-emerald-600/10',
                      badgeBg: 'bg-emerald-600/5 text-emerald-600'
                    },
                    { 
                      label: 'Vagas Inativas', 
                      value: closedOrPausedJobsCount, 
                      trend: 'Pausadas/Enc.', 
                      trendUp: false,
                      icon: Clock, 
                      color: 'text-amber-600', 
                      bg: 'bg-amber-600/10',
                      badgeBg: 'bg-amber-600/5 text-amber-600'
                    },
                  ].map((stat, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ y: -5 }}
                      className="bg-white/80 backdrop-blur-md border border-white/50 p-6 rounded-[24px] shadow-[0_4px_20px_rgba(83,58,246,0.02)] flex items-center justify-between hover:shadow-md hover:bg-white/95 transition-all duration-300 group text-left relative overflow-hidden"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shrink-0`}>
                          <stat.icon size={22} className="stroke-[2]" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-1.5">{stat.value}</h3>
                          <p className="text-[10px] font-black text-slate-450 uppercase tracking-widest leading-none mt-1.5 truncate">{stat.label}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 self-start mt-1 ${stat.badgeBg}`}>
                        {stat.trendUp && <TrendingUp size={10} />}
                        {stat.trend}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Actions Bar */}
                <div className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 border-r border-slate-100 hidden md:block">Ações Rápidas</span>
                  <button 
                    onClick={() => { setIsRegisteringVacancy(true); setRegisterStep(1); }}
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



            {activeTab === 'Minhas Vagas' && (
              <div className="space-y-6 w-full text-left">
                {/* Título da Página + Botão Criar Vaga */}
                {selectedJob === null && (
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <h1 className="text-lg font-black text-slate-800 uppercase tracking-wider">
                        Minhas Vagas
                      </h1>
                    </div>
                    <button 
                      type="button"
                      onClick={() => { setIsRegisteringVacancy(true); setRegisterStep(1); }}
                      className="flex items-center justify-center gap-2 px-4 py-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-full text-[12px] font-[650] uppercase tracking-wider transition-all duration-300 hover:shadow-md hover:shadow-[#7c3aed]/20 active:scale-95 border-0 cursor-pointer shrink-0 hover:-translate-y-0.5"
                    >
                      <Plus size={13} className="stroke-[2.5]" /> Criar Vaga
                    </button>
                  </div>
                )}

                {/* Sub-abas e Barra de Pesquisa */}
                {selectedJob === null && (
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200/60 pb-px relative w-full mb-6 gap-4">
                    <div className="flex relative">
                      {(() => {
                        const tabs = [
                          { id: 'active', label: 'ATIVAS', count: activeJobsCount, icon: Briefcase },
                          { id: 'paused', label: 'PAUSADAS', count: pausedJobsCount, icon: Clock },
                          { id: 'closed', label: 'ENCERRADAS', count: closedJobsCount, icon: XCircle }
                        ];

                        return (
                          <>
                            {tabs.map((tab) => {
                              const isActive = jobSubTab === tab.id;
                              return (
                                <button
                                  key={tab.id}
                                  onClick={() => setJobSubTab(tab.id as any)}
                                  className={`flex items-center justify-center gap-2 w-44 shrink-0 py-4 border-b-2 font-medium text-[12px] uppercase tracking-wider transition-all border-transparent relative z-10 ${
                                    isActive 
                                      ? 'text-slate-900 font-medium' 
                                      : 'text-slate-400 hover:text-slate-600'
                                  }`}
                                >
                                  <tab.icon size={14} className={isActive ? 'text-[#533af6]' : 'text-slate-400'} />
                                  <span>{tab.label} ({tab.count})</span>
                                  
                                  {isActive && (
                                    <motion.div 
                                      layoutId="activeJobSubTabBorder"
                                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#533af6] z-20"
                                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                  )}
                                </button>
                              );
                            })}
                          </>
                        );
                      })()}
                    </div>

                    {/* Barra de Pesquisa de Vagas */}
                    {jobs.length > 0 && (
                      <div className="flex justify-end mb-2 md:mb-0 w-full md:w-auto">
                        <div className={`relative w-full sm:w-72 rounded-full border transition-all duration-300 ${
                          isJobSearchFocused || jobSearch 
                            ? 'bg-white border-slate-200 shadow-sm' 
                            : 'bg-[#e8eaed] border-transparent hover:bg-[#dfe1e5]'
                        }`}>
                          <input
                            type="text"
                            placeholder="Pesquisar vagas..."
                            value={jobSearch}
                            onChange={(e) => setJobSearch(e.target.value)}
                            onFocus={() => setIsJobSearchFocused(true)}
                            onBlur={() => setIsJobSearchFocused(false)}
                            className={`w-full bg-transparent border-0 outline-none text-xs font-bold text-slate-700 placeholder:text-slate-450 py-2 transition-all duration-300 ${
                              isJobSearchFocused || jobSearch ? 'pl-8 pr-3' : 'pl-4 pr-8'
                            }`}
                          />
                          <motion.span 
                            className="absolute top-1/2 -translate-y-1/2 text-slate-400 flex items-center justify-center pointer-events-none"
                            animate={{
                              left: isJobSearchFocused || jobSearch ? '12px' : 'calc(100% - 28px)'
                            }}
                            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                          >
                            <Search size={14} className="stroke-[2.5]" />
                          </motion.span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <MyVacanciesTab
                  jobs={jobs}
                  isFetchingJobs={isFetchingJobs}
                  jobSubTab={jobSubTab}
                  selectedJob={selectedJob}
                  setSelectedJob={setSelectedJob}
                  jobApplicants={jobApplicants}
                  isFetchingApplicants={isFetchingApplicants}
                  handleViewApplicants={handleViewApplicants}
                  handleUpdateJobStatus={handleUpdateJobStatus}
                  handleShareJob={handleShareJob}
                  setIsRegisteringVacancy={setIsRegisteringVacancy}
                  setRegisterStep={setRegisterStep}
                  setIsConfiguringStages={setIsConfiguringStages}
                  handleUpdateApplicantStatus={handleUpdateApplicantStatus}
                  setSelectedResumeApplicant={setSelectedResumeApplicant}
                  getFullApplicantInfo={getFullApplicantInfo}
                  handleRequestDiscTest={handleRequestDiscTest}
                  handleRequestMbtiTest={handleRequestMbtiTest}
                  handleRequestTemperamentosTest={handleRequestTemperamentosTest}
                  handleRequestQuestions={handleRequestQuestions}
                  handleRequestCustomTest={handleRequestCustomTest}
                  handleOpenNotes={handleOpenNotes}
                  handleDeleteJob={handleDeleteJob}
                  handleOpenChat={handleOpenChat}
                  jobSearch={jobSearch}
                  setJobSearch={setJobSearch}
                />
              </div>
            )}

            {activeTab === 'Banco de Talentos' && (
              <div className="space-y-6 w-full text-left">
                {/* Título da Página + Busca por IA */}
                <div className="mb-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-lg font-black text-slate-800 uppercase tracking-wider">
                      Banco de Talentos
                    </h1>
                  </div>
                  
                  {/* Busca por IA integrada alinhada à direita */}
                  <div className="w-full md:max-w-md shrink-0 mr-6">
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
                            className="p-1.5 text-slate-350 hover:text-slate-550 transition-colors"
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

                {/* Sub-abas (Todos os Talentos, Salvos) */}
                <div className="flex border-b border-slate-200/60 pb-px relative w-full mb-6">
                  <div className="flex relative">
                    {(() => {
                      const selectedCompany = companies.find(c => c.id === selectedCompanyId);
                      const savedCount = selectedCompany?.savedTalents?.length || 0;
                      
                      const allCount = talents.filter(t => {
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
                      }).length;

                      const tabs = [
                        { id: 'all', label: 'TODOS OS TALENTOS', count: allCount, icon: User },
                        { id: 'saved', label: 'SALVOS', count: savedCount, icon: Bookmark }
                      ];
                      const tabIndex = tabs.findIndex(t => t.id === talentSubTab);

                      return (
                        <>
                          {tabs.map((tab) => {
                            const isActive = talentSubTab === tab.id;
                            return (
                              <button
                                key={tab.id}
                                onClick={() => setTalentSubTab(tab.id as any)}
                                className={`flex items-center justify-center gap-2 w-44 shrink-0 py-4 border-b-2 font-medium text-[12px] uppercase tracking-wider transition-all border-transparent relative z-10 ${
                                  isActive 
                                    ? 'text-slate-900 font-medium' 
                                    : 'text-slate-400 hover:text-slate-655'
                                }`}
                              >
                                <tab.icon size={14} className={isActive ? 'text-[#533af6]' : 'text-slate-400'} />
                                <span>{tab.label}{tab.id === 'saved' ? ` (${tab.count})` : ''}</span>
                                
                                {isActive && (
                                  <motion.div 
                                    layoutId="activeTalentSubTabBorder"
                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#533af6] z-20"
                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                  />
                                )}
                              </button>
                            );
                          })}
                        </>
                      );
                    })()}
                  </div>
                </div>

                <TalentBankTab
                  isAiSearching={isAiSearching}
                  aiPrompt={aiPrompt}
                  setAiPrompt={setAiPrompt}
                  handleAiSearch={handleAiSearch}
                  isFiltersVisible={isFiltersVisible}
                  setIsFiltersVisible={setIsFiltersVisible}
                  talentFilters={talentFilters}
                  setTalentFilters={setTalentFilters}
                  isTalentLoadingCities={isTalentLoadingCities}
                  talentCities={talentCities}
                  talentSearch={talentSearch}
                  setTalentSearch={setTalentSearch}
                  setIsFilterSidebarOpen={setIsFilterSidebarOpen}
                  filteredTalents={filteredTalents}
                  setSelectedResumeApplicant={setSelectedResumeApplicant}
                  selectedCompany={companies.find(c => c.id === selectedCompanyId)}
                  handleToggleSaveTalent={handleToggleSaveTalent}
                  talentSubTab={talentSubTab}
                />
              </div>
            )}

            {activeTab === 'Empresas' && (
              <motion.div 
                key="empresas"
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6 text-left font-sans w-full"
              >
                {/* Título da Página + Botão Cadastrar Empresa */}
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h1 className="text-lg font-black text-slate-800 uppercase tracking-wider">
                      Empresas Parceiras
                    </h1>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCompanyId('new');
                      setCompanyForm({ razaoSocial: '', nomeFantasia: '', solicitante: '', sector: '', logo: '' });
                      setIsRegisteringCompany(true);
                    }}
                    className="h-8 px-5 bg-[#533af6] hover:bg-[#4128df] text-white rounded-full font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all border-0 cursor-pointer shadow-md shadow-[#533af6]/10 active:scale-95 shrink-0 hover:-translate-y-0.5"
                  >
                    <Plus size={13} className="stroke-[2.5]" /> Cadastrar Empresa
                  </button>
                </div>

                {/* Lista de Empresas Cadastradas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {companies.map((comp) => {
                    const isActive = selectedCompanyId === comp.id;
                    return (
                      <div 
                        key={comp.id}
                        className={`bg-white p-5 rounded-[16px] border flex flex-col justify-between h-full relative group transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
                          isActive 
                            ? 'border-[#533af6] shadow-[0_8px_30px_rgb(83,58,246,0.06)] ring-4 ring-[#533af6]/5' 
                            : 'border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-slate-100/80'
                        }`}
                      >
                        <div>
                          {/* Topo do Card da Empresa */}
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-14 h-14 bg-[#533af6]/5 border border-slate-100 rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative">
                              {comp.logo ? (
                                <img src={comp.logo} alt={comp.nomeFantasia} className="w-full h-full object-cover" />
                              ) : (
                                <Building size={24} className="text-slate-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight truncate leading-tight">{comp.nomeFantasia}</h4>
                                {isActive && (
                                  <span className="px-1.5 py-0.5 bg-primary-50 text-[#533af6] border border-primary-100 rounded-full text-[7px] font-black uppercase tracking-widest shrink-0 select-none">
                                    Ativa
                                  </span>
                                )}
                              </div>
                              <p className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider truncate mt-0.5">{comp.razaoSocial}</p>
                              
                              {/* Badges de Plano e Créditos */}
                              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                <span className={`px-2 py-0.5 rounded-full text-[7.5px] font-black uppercase tracking-wider ${
                                  comp.plan === 'enterprise' 
                                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                                    : comp.plan === 'growth'
                                    ? 'bg-[#533af6] text-white'
                                    : 'bg-slate-100 text-slate-600 border border-slate-200/50'
                                }`}>
                                  {comp.plan || 'Starter'}
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[7.5px] font-black text-[#533af6] bg-[#533af6]/5 border border-[#533af6]/10">
                                  {comp.credits !== undefined ? comp.credits : 5} Créditos
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Infos secundárias do Card */}
                          <div className="bg-slate-50/40 p-3.5 rounded-[12px] border border-slate-100/50 text-left space-y-2 mb-4">
                            <p className="text-[9.5px] font-bold text-slate-500 flex items-center gap-1.5">
                              <User size={12} className="text-slate-400 shrink-0" />
                              <span>Responsável: <strong className="text-slate-700 font-black uppercase tracking-tight">{comp.solicitante}</strong></span>
                            </p>
                            <p className="text-[9.5px] font-bold text-slate-500 flex items-center gap-1.5">
                              <Building size={12} className="text-slate-400 shrink-0" />
                              <span>Atuação: <strong className="text-slate-700 font-black uppercase tracking-tight">{comp.sector || 'Geral'}</strong></span>
                            </p>
                          </div>
                        </div>

                        {/* Rodapé e Ações do Card */}
                        <div className="pt-4 border-t border-slate-100/60 flex gap-2 shrink-0">
                          {!isActive ? (
                            <button
                              type="button"
                              onClick={() => setSelectedCompanyId(comp.id)}
                              className="flex-1 h-8 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-200 cursor-pointer border-0 active:scale-95 hover:-translate-y-0.5 flex items-center justify-center"
                            >
                              Selecionar
                            </button>
                          ) : (
                            <div className="flex-1 h-8 bg-[#533af6]/5 border border-[#533af6]/15 text-[#533af6] rounded-full text-[10px] font-black uppercase tracking-widest text-center select-none flex items-center justify-center gap-1">
                              <Check size={12} className="stroke-[2.5]" /> Ativa
                            </div>
                          )}
                          
                          <button
                            type="button"
                            onClick={(e) => handleEditCompany(comp, e)}
                            className="px-4 h-8 bg-slate-50 hover:bg-slate-100 text-slate-650 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border border-slate-200/50 cursor-pointer active:scale-95 hover:-translate-y-0.5 flex items-center justify-center"
                            title="Editar configurações"
                          >
                            Editar
                          </button>

                          {comp.id !== '1' && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteCompany(comp.id, e)}
                              className="w-8 h-8 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-full transition-all border border-slate-200/50 cursor-pointer flex items-center justify-center active:scale-95 hover:-translate-y-0.5 shrink-0"
                              title="Excluir empresa"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
            {activeTab === 'Avaliações' && (
              <motion.div
                key="avaliacoes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 text-left w-full font-sans"
              >
                {isFetchingCompanyApps ? (
                  <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[10px] border border-slate-100 shadow-sleek">
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
                        <div className="bg-white p-16 rounded-[10px] text-center border border-dashed border-slate-200 max-w-xl mx-auto shadow-sleek">
                          <Award className="mx-auto text-slate-300 mb-6" size={44} />
                          <h3 className="text-lg font-black text-slate-900 mb-2">Nenhum Teste Iniciado</h3>
                          <p className="text-slate-500 font-medium text-xs leading-relaxed mb-6">
                            Nenhum candidato desta empresa possui solicitações ou respostas de testes no momento.
                          </p>
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-[10px] text-left text-xs font-semibold text-slate-550">
                            <p className="font-bold text-slate-700 uppercase text-[9px] tracking-wider mb-1.5 font-sans">Como solicitar?</p>
                            Acesse o painel <strong>Minhas Vagas</strong>, clique em <strong>Ver Candidatos (Kanban)</strong> em alguma vaga, mova o candidato para a etapa de <strong>Testes</strong> e solicite o teste correspondente.
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div className="bg-white p-6 rounded-[10px] shadow-sleek border border-slate-100 space-y-6">
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
                                      <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-[9px] font-black uppercase tracking-wider">
                                        Pendente
                                      </span>
                                    );
                                  }
                                  return (
                                    <button
                                      type="button"
                                      onClick={onViewClick}
                                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 hover:border-indigo-200 rounded-full text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 mx-auto shadow-xs active:scale-95 cursor-pointer"
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
                                        <div className="w-10 h-10 bg-slate-100 text-slate-400 border border-slate-100 rounded-full overflow-hidden flex items-center justify-center shadow-sm shrink-0">
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
                              className="bg-white p-8 rounded-[10px] border border-slate-100 shadow-sleek hover:border-[#533af6]/30 transition-all flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex justify-between items-start mb-6">
                                  <div 
                                    className="w-12 h-12 rounded-[10px] flex items-center justify-center text-white shadow-sm"
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
                                
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-[10px] text-left text-xs font-semibold text-slate-600 mb-4 leading-relaxed">
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

                  if (resultsSubTab === 'criar') {
                    return (
                      <div className="bg-white p-8 sm:p-10 rounded-[10px] shadow-sleek border border-slate-100 space-y-8 text-left">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Biblioteca de Avaliações Customizadas</h3>
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Crie e gerencie questionários independentes para enviar aos candidatos na etapa de testes</p>
                          </div>
                          <button
                            type="button"
                            onClick={handleStartNewTemplate}
                            className="px-5 py-3 bg-[#533af6] hover:bg-[#432ec4] text-white font-black text-[10px] uppercase tracking-widest rounded-full shadow-lg shadow-[#533af6]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer border-0 outline-none"
                          >
                            <PlusCircle size={14} />
                            Criar Questionário
                          </button>
                        </div>

                        {customTemplates.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[10px] border border-dashed border-slate-200 text-center">
                            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                              <FileText size={24} />
                            </div>
                            <p className="text-xs font-black text-slate-600 uppercase tracking-widest">Nenhum Questionário Cadastrado</p>
                            <p className="text-[10px] text-slate-400 mt-1.5 max-w-sm leading-relaxed">
                              Você ainda não possui questionários customizados na sua biblioteca. Clique no botão acima para criar o seu primeiro questionário independente de vaga.
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {customTemplates.map(template => (
                              <div key={template.id} className="bg-slate-50/50 hover:bg-slate-100/50 p-6 rounded-[10px] border border-slate-200/60 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all text-left">
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
                                    className="flex-1 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border border-slate-200 cursor-pointer outline-none"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCustomTemplate(template.id)}
                                    className="py-2 px-3 bg-white hover:bg-red-50 text-red-500 hover:border-red-200 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border border-slate-200 cursor-pointer outline-none"
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
                })()}
              </motion.div>
            )}

            {activeTab === 'Configurações' && (
              <SettingsTab />
            )}

            {activeTab === 'Faturamento' && (
              <BillingTab 
                company={selectedCompany} 
                companies={companies}
                setCompanies={setCompanies}
                jobs={jobs}
              />
            )}

            {activeTab === 'Entrevistas' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="w-full flex-1"
              >
                {renderInterviewsTab()}
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </main>
    </div>

      {/* Global Overlays (placed here at the root level so they never get overlapped by the sidebar or affected by main's layout) */}
      <AnimatePresence>
            {isRegisteringVacancy && (
              <CreateVacancyTab
                isOpen={isRegisteringVacancy}
                onClose={() => {
                  setIsRegisteringVacancy(false);
                  setRegisterStep(1);
                }}
                registerStep={registerStep}
                setRegisterStep={setRegisterStep}
                vacancyForm={vacancyForm}
                setVacancyForm={setVacancyForm}
                errorMessage={errorMessage}
                handleNextStep={handleNextStep}
                handlePublish={handlePublish}
                isPublishing={isPublishing}
              />
            )}

            {isConfiguringStages && (
              <ManageStagesModal
                isOpen={isConfiguringStages}
                onClose={() => setIsConfiguringStages(false)}
                job={selectedJob}
                jobApplicants={jobApplicants}
                onAddNewStage={handleAddNewStage}
                onReorderStages={(newStages) => handleUpdateJobStages(selectedJob.id, newStages)}
                onDeleteStage={handleDeleteStage}
                onUpdateStageTests={handleUpdateJobStageTests}
              />
            )}

            <NotificationsDrawer
              isOpen={isNotificationsDrawerOpen}
              onClose={() => setIsNotificationsDrawerOpen(false)}
              notifications={notifications}
              onMarkAllAsRead={async () => {
                if (selectedCompany?.nomeFantasia) {
                  await markAllNotificationsAsRead(selectedCompany.nomeFantasia, 'company');
                  loadCompanyNotifications();
                }
              }}
              onMarkAsRead={async (id) => {
                await markNotificationAsRead(id);
                loadCompanyNotifications();
              }}
              onDelete={async (id) => {
                await deleteNotification(id);
                loadCompanyNotifications();
              }}
            />

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
                  className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col z-10 text-left border border-slate-100"
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
                        className="px-8 py-3 bg-[#8959f5] hover:bg-[#7846e3] text-white rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-[#8959f5]/15"
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
                      role: '',
                      modality: 'Presencial',
                      state: '',
                      city: '',
                      remunerationType: 'Fixo',
                      salary: '',
                      salaryMin: '',
                      salaryMax: '',
                      hasBonus: false,
                      bonusType: 'Comissão',
                      bonusValue: '',
                      contractType: 'CLT',
                      benefits: {
                        vt: { selected: false, value: '' },
                        va: { selected: false, value: '' },
                        healthInsurance: false,
                        healthInsuranceCopay: false,
                        healthInsuranceFamily: false,
                        dentalPlan: false,
                        dentalPlanFamily: false
                      },
                      extraBenefits: [] as string[],
                      workSchedule: '5x2',
                      isFirstJob: false,
                      isPcd: false,
                      pcdDetails: '',
                      minAge: 18,
                      positions: '1',
                      requestReason: 'Aumento de quadro',
                      isUrgent: false,
                      description: '',
                      responsibilities: '',
                      requirements: [] as string[],
                      stages: ['Análise de Currículo']
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
                        role: '',
                        modality: 'Presencial',
                        state: '',
                        city: '',
                        remunerationType: 'Fixo',
                        salary: '',
                        salaryMin: '',
                        salaryMax: '',
                        hasBonus: false,
                        bonusType: 'Comissão',
                        bonusValue: '',
                        contractType: 'CLT',
                        benefits: {
                          vt: { selected: false, value: '' },
                          va: { selected: false, value: '' },
                          healthInsurance: false,
                          healthInsuranceCopay: false,
                          healthInsuranceFamily: false,
                          dentalPlan: false,
                          dentalPlanFamily: false
                        },
                        extraBenefits: [] as string[],
                        workSchedule: '5x2',
                        isFirstJob: false,
                        isPcd: false,
                        pcdDetails: '',
                        minAge: 18,
                        positions: '1',
                        requestReason: 'Aumento de quadro',
                        isUrgent: false,
                        description: '',
                        responsibilities: '',
                        requirements: [] as string[],
                        stages: ['Análise de Currículo']
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
              <div className="fixed inset-0 z-[110] flex justify-end">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedResumeApplicant(null)}
                  className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs" 
                />
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="relative w-full max-w-4xl bg-white rounded-l-[24px] rounded-r-none shadow-2xl overflow-hidden flex flex-col h-full border-l border-slate-100/85 z-10"
                >
                  {/* Cabeçalho de visualização */}
                  <div className="p-6 flex justify-between items-center border-b border-slate-100 shrink-0 text-left">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Perfil do Candidato</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Perfil completo e relatórios de testes na plataforma</p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {resumeDrawerTab === 'curriculo' && (
                        <button 
                          onClick={handleDownloadResume}
                          disabled={isExportingResume}
                          className="flex items-center gap-2 px-6 py-2.5 bg-[#533af6] hover:bg-[#432ec4] text-white rounded-full font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer border-0 outline-none whitespace-nowrap"
                        >
                          {isExportingResume ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                          {isExportingResume ? 'Processando...' : 'Baixar PDF'}
                        </button>
                      )}
                      <button 
                        onClick={() => setSelectedResumeApplicant(null)} 
                        className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full transition-all cursor-pointer border-0 outline-none flex items-center justify-center w-9 h-9 hover:scale-105 active:scale-95 shadow-sm"
                      >
                        <CloseIcon size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Abas do Drawer */}
                  <div className="px-6 border-b border-slate-100 flex relative bg-white shrink-0">
                    {(() => {
                      const drawerTabs = [
                        { id: 'curriculo', label: 'CURRÍCULO', icon: FileText },
                        { id: 'testes', label: 'TESTES REALIZADOS', icon: Brain },
                        { id: 'entrevistas', label: 'ENTREVISTAS', icon: Calendar }
                      ];
                      const tabIndex = drawerTabs.findIndex(t => t.id === resumeDrawerTab);
                      const tabWidth = 192; 
                      return (
                        <div className="flex relative">
                          {drawerTabs.map((tab) => (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => setResumeDrawerTab(tab.id as any)}
                              className={`flex items-center justify-center gap-2 w-48 py-4 font-bold text-xs uppercase tracking-wider transition-all border-b-2 border-transparent outline-none cursor-pointer ${
                                resumeDrawerTab === tab.id 
                                  ? 'text-slate-900 font-black' 
                                  : 'text-slate-400 hover:text-slate-600'
                              }`}
                            >
                              <tab.icon size={14} className={resumeDrawerTab === tab.id ? 'text-[#533af6]' : 'text-slate-400'} />
                              <span>{tab.label}</span>
                            </button>
                          ))}
                          <motion.div 
                            animate={{ x: tabIndex * tabWidth }}
                            className="absolute bottom-0 left-0 h-[2px] bg-[#533af6]"
                            style={{ width: tabWidth }}
                            transition={{ type: 'spring', stiffness: 120, damping: 22 }}
                          />
                        </div>
                      );
                    })()}
                  </div>

                  {resumeDrawerTab === 'curriculo' && (
                    /* Conteúdo rolável com a folha de currículo A4 em escala */
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
                  )}

                  {resumeDrawerTab === 'testes' && (
                    /* Conteúdo de Testes Realizados */
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50/20 space-y-6 text-left no-scrollbar">
                      {/* Resumo/Info do Candidato */}
                      <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-2xs flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-full overflow-hidden shrink-0 border border-slate-200/60 flex items-center justify-center">
                          {selectedResumeApplicant.profile_pic ? (
                            <img src={selectedResumeApplicant.profile_pic} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <User size={20} className="text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight truncate leading-none">
                            {selectedResumeApplicant.candidate_name}
                          </h4>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                            {selectedResumeApplicant.city || 'Não inf.'}{selectedResumeApplicant.state ? `, ${selectedResumeApplicant.state}` : ''}
                          </p>
                        </div>
                      </div>

                      {/* Lista de Avaliações */}
                      <div className="space-y-4">
                        <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 border-b border-slate-150/40 pb-2">
                          <BrainCircuit size={14} className="text-[#533af6]" /> Status das Avaliações
                        </h5>

                        <div className="space-y-3">
                          {/* 1. DISC */}
                          {(() => {
                            const parsedData = parseCandidatePhoneData(selectedResumeApplicant.candidate_phone || '');
                            let discStatus = 'NONE';
                            let discScores = [0, 0, 0, 0];
                            if (parsedData.disc) {
                              if (parsedData.disc === 'PENDING') discStatus = 'PENDING';
                              else if (parsedData.disc.startsWith('COMPLETED===')) {
                                discStatus = 'COMPLETED';
                                discScores = parsedData.disc.replace('COMPLETED===', '').split(',').map(Number);
                              }
                            }

                            return (
                              <div className="bg-white hover:bg-slate-50/50 border border-slate-100 rounded-[15px] p-5 transition-all shadow-3xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-3.5">
                                  <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-rose-100/20">
                                    <Activity size={18} />
                                  </div>
                                  <div>
                                    <h6 className="font-extrabold text-slate-800 text-xs uppercase tracking-tight">DISC</h6>
                                    <p className="text-[9px] font-semibold text-slate-450 mt-1 max-w-md">Avaliação comportamental baseada em Dominância, Influência, Estabilidade e Conformidade.</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                                  <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider select-none border ${
                                    discStatus === 'COMPLETED'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                      : discStatus === 'PENDING'
                                      ? 'bg-amber-50 text-amber-700 border-amber-100'
                                      : 'bg-slate-50 text-slate-400 border-slate-200/60'
                                  }`}>
                                    {discStatus === 'COMPLETED' ? 'Concluído' : discStatus === 'PENDING' ? 'Pendente' : 'Não Solicitado'}
                                  </span>

                                  {discStatus === 'COMPLETED' && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedDiscResult({
                                          applicantName: selectedResumeApplicant.candidate_name,
                                          completedAt: parsedData.discDate || selectedResumeApplicant.created_at,
                                          D: discScores[0], I: discScores[1], S: discScores[2], C: discScores[3]
                                        });
                                      }}
                                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[#533af6] hover:bg-[#432ec4] text-white font-extrabold rounded-full uppercase text-[9px] transition-all cursor-pointer shadow-sm active:scale-95 border-0 outline-none"
                                    >
                                      <span>Ver Relatório</span>
                                      <ChevronRight size={10} className="shrink-0" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })()}

                          {/* 2. MBTI */}
                          {(() => {
                            const parsedData = parseCandidatePhoneData(selectedResumeApplicant.candidate_phone || '');
                            let mbtiStatus = 'NONE';
                            let mbtiResponses = null;
                            if (parsedData.mbti) {
                              if (parsedData.mbti === 'PENDING') mbtiStatus = 'PENDING';
                              else if (parsedData.mbti.startsWith('COMPLETED===')) {
                                mbtiStatus = 'COMPLETED';
                                try {
                                  mbtiResponses = JSON.parse(parsedData.mbti.replace('COMPLETED===', '').trim());
                                } catch (e) {}
                              }
                            }

                            return (
                              <div className="bg-white hover:bg-slate-50/50 border border-slate-100 rounded-[15px] p-5 transition-all shadow-3xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-3.5">
                                  <div className="w-10 h-10 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-violet-100/20">
                                    <Compass size={18} />
                                  </div>
                                  <div>
                                    <h6 className="font-extrabold text-slate-800 text-xs uppercase tracking-tight">MBTI</h6>
                                    <p className="text-[9px] font-semibold text-slate-450 mt-1 max-w-md">Indicador de tipos psicológicos e traços de personalidade (16 tipos).</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                                  <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider select-none border ${
                                    mbtiStatus === 'COMPLETED'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                      : mbtiStatus === 'PENDING'
                                      ? 'bg-amber-50 text-amber-700 border-amber-100'
                                      : 'bg-slate-50 text-slate-400 border-slate-200/60'
                                  }`}>
                                    {mbtiStatus === 'COMPLETED' ? 'Concluído' : mbtiStatus === 'PENDING' ? 'Pendente' : 'Não Solicitado'}
                                  </span>

                                  {mbtiStatus === 'COMPLETED' && mbtiResponses && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedMbtiResult({
                                          applicantName: selectedResumeApplicant.candidate_name,
                                          completedAt: parsedData.mbtiDate || selectedResumeApplicant.created_at,
                                          ...mbtiResponses
                                        });
                                        setActiveMbtiTab('PERFIL');
                                        setIsMbtiModalOpen(true);
                                      }}
                                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[#533af6] hover:bg-[#432ec4] text-white font-extrabold rounded-full uppercase text-[9px] transition-all cursor-pointer shadow-sm active:scale-95 border-0 outline-none"
                                    >
                                      <span>Ver Perfil ({mbtiResponses.type || 'MBTI'})</span>
                                      <ChevronRight size={10} className="shrink-0" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })()}

                          {/* 3. Mapeamento de Perfil (Perguntas) */}
                          {(() => {
                            const parsedData = parseCandidatePhoneData(selectedResumeApplicant.candidate_phone || '');
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

                            return (
                              <div className="bg-white hover:bg-slate-50/50 border border-slate-100 rounded-[15px] p-5 transition-all shadow-3xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-3.5">
                                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-indigo-100/20">
                                    <HelpCircle size={18} />
                                  </div>
                                  <div>
                                    <h6 className="font-extrabold text-slate-800 text-xs uppercase tracking-tight">Mapeamento (Perguntas)</h6>
                                    <p className="text-[9px] font-semibold text-slate-450 mt-1 max-w-md">Perguntas com respostas de vídeo/texto sobre trajetórias e objetivos.</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                                  <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider select-none border ${
                                    questionsStatus === 'COMPLETED'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                      : questionsStatus === 'PENDING'
                                      ? 'bg-amber-50 text-amber-700 border-amber-100'
                                      : 'bg-slate-50 text-slate-400 border-slate-200/60'
                                  }`}>
                                    {questionsStatus === 'COMPLETED' ? 'Concluído' : questionsStatus === 'PENDING' ? 'Pendente' : 'Não Solicitado'}
                                  </span>

                                  {questionsStatus === 'COMPLETED' && questionsResponses && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedApplicantForQuestions({
                                          candidate_name: selectedResumeApplicant.candidate_name,
                                          questionsResponses,
                                          completedAt: parsedData.questionsDate || selectedResumeApplicant.created_at
                                        });
                                        setActiveCategoryTab('EXPERIENCE');
                                        setIsQuestionsModalOpen(true);
                                      }}
                                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[#533af6] hover:bg-[#432ec4] text-white font-extrabold rounded-full uppercase text-[9px] transition-all cursor-pointer shadow-sm active:scale-95 border-0 outline-none"
                                    >
                                      <span>Ver Respostas</span>
                                      <ChevronRight size={10} className="shrink-0" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })()}

                          {/* 4. Temperamentos */}
                          {(() => {
                            const parsedData = parseCandidatePhoneData(selectedResumeApplicant.candidate_phone || '');
                            let temperamentosStatus = 'NONE';
                            let temperamentosResponses = null;
                            if (parsedData.temperamentos) {
                              if (parsedData.temperamentos === 'PENDING') temperamentosStatus = 'PENDING';
                              else if (parsedData.temperamentos.startsWith('COMPLETED===')) {
                                temperamentosStatus = 'COMPLETED';
                                try {
                                  temperamentosResponses = JSON.parse(parsedData.temperamentos.replace('COMPLETED===', '').trim());
                                } catch (e) {}
                              }
                            }

                            return (
                              <div className="bg-white hover:bg-slate-50/50 border border-slate-100 rounded-[15px] p-5 transition-all shadow-3xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-3.5">
                                  <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-sky-100/20">
                                    <GraduationCap size={18} />
                                  </div>
                                  <div>
                                    <h6 className="font-extrabold text-slate-800 text-xs uppercase tracking-tight">Temperamentos</h6>
                                    <p className="text-[9px] font-semibold text-slate-450 mt-1 max-w-md">Identificação dos temperamentos principais (Sanguíneo, Colérico, Melancólico, Fleumático).</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                                  <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider select-none border ${
                                    temperamentosStatus === 'COMPLETED'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                      : temperamentosStatus === 'PENDING'
                                      ? 'bg-amber-50 text-amber-700 border-amber-100'
                                      : 'bg-slate-50 text-slate-400 border-slate-200/60'
                                  }`}>
                                    {temperamentosStatus === 'COMPLETED' ? 'Concluído' : temperamentosStatus === 'PENDING' ? 'Pendente' : 'Não Solicitado'}
                                  </span>

                                  {temperamentosStatus === 'COMPLETED' && temperamentosResponses && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedTemperamentosResult({
                                          applicantName: selectedResumeApplicant.candidate_name,
                                          completedAt: parsedData.temperamentosDate || selectedResumeApplicant.created_at,
                                          ...temperamentosResponses
                                        });
                                        setActiveTemperamentosTab('PERFIL');
                                        setIsTemperamentosModalOpen(true);
                                      }}
                                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[#533af6] hover:bg-[#432ec4] text-white font-extrabold rounded-full uppercase text-[9px] transition-all cursor-pointer shadow-sm active:scale-95 border-0 outline-none"
                                    >
                                      <span>Ver Perfil ({temperamentosResponses.type || 'TEMP'})</span>
                                      <ChevronRight size={10} className="shrink-0" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })()}

                          {/* 5. Questionário Customizado */}
                          {(() => {
                            const parsedData = parseCandidatePhoneData(selectedResumeApplicant.candidate_phone || '');
                            let customTestStatus = 'NONE';
                            let customTestResponses = null;
                            if (parsedData.customTest) {
                              if (parsedData.customTest === 'PENDING') customTestStatus = 'PENDING';
                              else if (parsedData.customTest.startsWith('COMPLETED===')) {
                                customTestStatus = 'COMPLETED';
                                try {
                                  customTestResponses = JSON.parse(parsedData.customTest.replace('COMPLETED===', '').trim());
                                } catch (e) {}
                              }
                            }

                            return (
                              <div className="bg-white hover:bg-slate-50/50 border border-slate-100 rounded-[15px] p-5 transition-all shadow-3xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-3.5">
                                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-emerald-100/20">
                                    <Briefcase size={18} />
                                  </div>
                                  <div>
                                    <h6 className="font-extrabold text-slate-800 text-xs uppercase tracking-tight">Questionário Customizado</h6>
                                    <p className="text-[9px] font-semibold text-slate-450 mt-1 max-w-md">Perguntas específicas e testes técnicos configurados para a vaga.</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                                  <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider select-none border ${
                                    customTestStatus === 'COMPLETED'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                      : customTestStatus === 'PENDING'
                                      ? 'bg-amber-50 text-amber-700 border-amber-100'
                                      : 'bg-slate-50 text-slate-400 border-slate-200/60'
                                  }`}>
                                    {customTestStatus === 'COMPLETED' ? 'Concluído' : customTestStatus === 'PENDING' ? 'Pendente' : 'Não Solicitado'}
                                  </span>

                                  {customTestStatus === 'COMPLETED' && customTestResponses && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedApplicantForCustomTest({
                                          candidate_name: selectedResumeApplicant.candidate_name,
                                          completedAt: parsedData.customTestDate || selectedResumeApplicant.created_at,
                                          ...customTestResponses
                                        });
                                        setIsCustomTestModalOpen(true);
                                      }}
                                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[#533af6] hover:bg-[#432ec4] text-white font-extrabold rounded-full uppercase text-[9px] transition-all cursor-pointer shadow-sm active:scale-95 border-0 outline-none"
                                    >
                                      <span>Ver Respostas</span>
                                      <ChevronRight size={10} className="shrink-0" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  )}

                  {resumeDrawerTab === 'entrevistas' && (
                    /* Conteúdo de Agendamento e Histórico de Entrevistas */
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50/20 space-y-6 text-left no-scrollbar">
                      {renderCandidateInterviewsDrawer()}
                    </div>
                  )}
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
              <div className="fixed inset-0 z-[120] flex justify-end">
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
                  className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" 
                />
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="relative w-full max-w-md bg-white rounded-l-[24px] rounded-r-none shadow-2xl overflow-hidden flex flex-col h-full border-l border-slate-100/85 z-10"
                >
                  {/* Drawer Header */}
                  <div className="p-7 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-highlight-50 rounded-2xl flex items-center justify-center text-highlight-600 shadow-sm shrink-0 border border-highlight-100">
                        <StickyNote size={22} className="text-highlight-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight">
                          Anotações de Recrutamento
                        </h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5 truncate max-w-[220px]">
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

                  {/* Drawer Body */}
                  <div className="flex-1 p-7 sm:p-9 flex flex-col space-y-4 text-left font-sans overflow-y-auto">
                    <div className="flex-1 flex flex-col space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                        Observações sobre o perfil e entrevista
                      </label>
                      <textarea
                        value={tempNotesText}
                        onChange={(e) => setTempNotesText(e.target.value)}
                        placeholder="Digite aqui pontos fortes, observações técnicas, expectativas de contratação ou impressões gerais da entrevista do candidato..."
                        className="w-full flex-1 min-h-[300px] px-4 py-3 text-xs font-bold text-slate-700 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-highlight-500 focus:border-highlight-500 resize-none transition-all placeholder:text-slate-400"
                        maxLength={1500}
                      />
                      <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        <span>Anotações privadas da empresa</span>
                        <span>{tempNotesText.length}/1500 caracteres</span>
                      </div>
                    </div>
                  </div>

                  {/* Drawer Footer */}
                  <div className="p-7 border-t border-slate-100 bg-slate-50/50 flex justify-end items-center gap-3 shrink-0">
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

          {/* Modal de Chat com o Candidato */}
          <AnimatePresence>
            {isChatDrawerOpen && selectedApplicantForChat && (
              <div className="fixed inset-0 z-[120] flex justify-end">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    setIsChatDrawerOpen(false);
                    setSelectedApplicantForChat(null);
                  }}
                  className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" 
                />
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="relative w-full max-w-md bg-white rounded-l-[24px] rounded-r-none shadow-2xl overflow-hidden flex flex-col h-full border-l border-slate-100/85 z-10"
                >
                  {/* Drawer Header */}
                  <div className="p-7 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0 border border-indigo-100">
                        <MessageSquare size={22} className="text-indigo-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight">
                          Chat com Candidato
                        </h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5 truncate max-w-[220px]">
                          Candidato: {selectedApplicantForChat.candidate_name || selectedApplicantForChat.name}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setIsChatDrawerOpen(false);
                        setSelectedApplicantForChat(null);
                      }} 
                      className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full transition-all cursor-pointer border border-slate-100 hover:scale-105 active:scale-95 shadow-sm outline-none flex items-center justify-center w-9 h-9"
                    >
                      <CloseIcon size={16} />
                    </button>
                  </div>

                  {/* Drawer Body - Messages List */}
                  <div className="flex-1 p-6 flex flex-col space-y-4 overflow-y-auto bg-slate-50/30">
                    {isFetchingChat ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <Activity className="animate-spin text-indigo-500 mb-2" size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Carregando conversa...</span>
                      </div>
                    ) : chatMessages.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-350">
                          <MessageSquare size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-700">Nenhuma mensagem ainda</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Envie uma mensagem abaixo para iniciar o contato com o candidato.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 flex flex-col">
                        {chatMessages.map((msg, idx) => {
                          const isCompany = msg.sender_type === 'company';
                          return (
                            <div 
                              key={msg.id || idx}
                              className={`flex flex-col max-w-[80%] ${isCompany ? 'self-end items-end' : 'self-start items-start'}`}
                            >
                              <div className={`px-4 py-3 rounded-[18px] text-xs font-semibold ${
                                isCompany 
                                  ? 'bg-[#533af6] text-white rounded-tr-none' 
                                  : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-3xs'
                              }`}>
                                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                              </div>
                              <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-widest mt-1 px-1">
                                {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Drawer Footer - Chat Input */}
                  <div className="p-4 border-t border-slate-100 bg-white flex items-center gap-2 shrink-0">
                    <input
                      type="text"
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isSendingMessage) {
                          handleSendMessage();
                        }
                      }}
                      placeholder="Digite sua mensagem..."
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all"
                      disabled={isSendingMessage}
                    />
                    <button
                      type="button"
                      onClick={handleSendMessage}
                      disabled={isSendingMessage || !newMessageText.trim()}
                      className="px-4 py-2.5 bg-[#533af6] hover:bg-[#4326e5] text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shrink-0"
                    >
                      {isSendingMessage ? 'Enviando...' : 'Enviar'}
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
                  className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-slate-100"
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
          <CustomQuestionsModal
            isOpen={isCustomTestModalOpen}
            onClose={() => {
              setIsCustomTestModalOpen(false);
              setSelectedApplicantForCustomTest(null);
            }}
            applicant={selectedApplicantForCustomTest}
            selectedJob={selectedJob}
            onExportPDF={handleExportModalToPDF}
            isExportingPDF={isExportingTestPDF}
          />

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
                  className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-slate-100"
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
                  className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-slate-100"
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
                  className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-100"
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

          {/* Drawer Lateral de Cadastro/Edição de Empresas */}
          <AnimatePresence>
            {isRegisteringCompany && (
              <div className="fixed inset-0 z-[150] flex justify-end">
                {/* Backdrop escuro com desfoque suave */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    if (selectedCompanyId === 'new') {
                      if (companies.length > 0) {
                        setSelectedCompanyId(companies[0].id);
                      }
                    }
                    setIsRegisteringCompany(false);
                  }}
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-md cursor-pointer"
                />

                {/* Painel lateral (Drawer) */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="relative w-full max-w-md bg-white rounded-l-[24px] rounded-r-none shadow-2xl p-8 overflow-hidden flex flex-col h-full border-l border-slate-100/85 z-10 animate-none"
                >
                  {/* Cabeçalho do Drawer */}
                  <div className="flex justify-between items-center mb-6 mt-2 shrink-0 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 shadow-sm border border-primary-100/20">
                        <Building size={18} />
                      </div>
                      <div>
                        <h3 className="text-md font-black text-slate-900 uppercase tracking-tight">
                          {editingCompanyId ? 'Editar Empresa' : 'Cadastrar Empresa'}
                        </h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                          {editingCompanyId ? 'Atualize as informações corporativas' : 'Insira os dados da nova conta'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (selectedCompanyId === 'new') {
                          if (companies.length > 0) {
                            setSelectedCompanyId(companies[0].id);
                          }
                        }
                        setIsRegisteringCompany(false);
                      }}
                      className="w-8 h-8 rounded-full border border-slate-100 hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer outline-none"
                    >
                      <CloseIcon size={14} />
                    </button>
                  </div>

                  {/* Corpo do Drawer (Rolável) */}
                  <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 text-left font-sans mb-6 pr-1">
                    {/* Logo Upload */}
                    <div className="flex items-center gap-4 bg-white p-4 rounded-[10px] border border-slate-100 shadow-sm text-left">
                      <div className="w-16 h-16 rounded-[10px] bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-450 relative shrink-0">
                        {companyForm.logo ? (
                          <img src={companyForm.logo} alt="Preview Logo" className="w-full h-full object-cover" />
                        ) : (
                          <Upload size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] font-black text-slate-800 uppercase tracking-wider block mb-1">Logotipo corporativo</label>
                        <p className="text-[9px] font-semibold text-slate-450 mb-2 leading-tight">Escolha uma imagem de no máximo 500kb.</p>
                        <div className="flex gap-2">
                          <label className="px-3.5 py-1.5 bg-[#533af6] hover:bg-[#4326e5] text-white font-extrabold text-[9px] uppercase tracking-widest rounded-full transition-all cursor-pointer inline-block active:scale-95 shadow-sm shadow-[#533af6]/10 border-0">
                            Upload
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
                              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-100 font-extrabold text-[9px] uppercase tracking-widest rounded-full transition-all cursor-pointer border-0"
                            >
                              Remover
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Inputs Empilhados */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 block pl-2">Razão Social</label>
                        <input 
                          type="text" 
                          value={companyForm.razaoSocial}
                          onChange={(e) => setCompanyForm({...companyForm, razaoSocial: e.target.value})}
                          placeholder="Ex: Empresa de Servicos LTDA" 
                          className="w-full px-4 py-3 bg-white border border-slate-100 rounded-[10px] shadow-sm outline-none focus:border-[#533af6] focus:ring-4 focus:ring-[#533af6]/10 transition-all font-bold text-slate-700 text-xs" 
                        />
                      </div>
                      
                      <div>
                        <label className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 block pl-2">Nome Fantasia</label>
                        <input 
                          type="text" 
                          value={companyForm.nomeFantasia}
                          onChange={(e) => setCompanyForm({...companyForm, nomeFantasia: e.target.value})}
                          placeholder="Ex: Minha Empresa" 
                          className="w-full px-4 py-3 bg-white border border-slate-100 rounded-[10px] shadow-sm outline-none focus:border-[#533af6] focus:ring-4 focus:ring-[#533af6]/10 transition-all font-bold text-slate-700 text-xs" 
                        />
                      </div>

                      <div>
                        <label className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 block pl-2">Solicitante / Responsável</label>
                        <input 
                          type="text" 
                          value={companyForm.solicitante}
                          onChange={(e) => setCompanyForm({...companyForm, solicitante: e.target.value})}
                          placeholder="Nome do Responsável" 
                          className="w-full px-4 py-3 bg-white border border-slate-100 rounded-[10px] shadow-sm outline-none focus:border-[#533af6] focus:ring-4 focus:ring-[#533af6]/10 transition-all font-bold text-slate-700 text-xs" 
                        />
                      </div>

                      <div>
                        <label className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 block pl-2">Setor / Ramo de Atuação</label>
                        <input 
                          type="text" 
                          value={companyForm.sector}
                          onChange={(e) => setCompanyForm({...companyForm, sector: e.target.value})}
                          placeholder="Ex: Tecnologia" 
                          className="w-full px-4 py-3 bg-white border border-slate-100 rounded-[10px] shadow-sm outline-none focus:border-[#533af6] focus:ring-4 focus:ring-[#533af6]/10 transition-all font-bold text-slate-700 text-xs" 
                        />
                      </div>
                    </div>

                    {/* Ação de Exclusão Segura dentro do Drawer (se for edição) */}
                    {editingCompanyId && editingCompanyId !== '1' && (
                      <div className="pt-4 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={(e) => {
                            handleDeleteCompany(editingCompanyId, e);
                            setIsRegisteringCompany(false);
                          }}
                          className="w-full h-8 bg-red-50 hover:bg-red-100 text-red-600 rounded-full font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border border-red-200/40 cursor-pointer active:scale-95 shrink-0 hover:-translate-y-0.5"
                        >
                          <Trash2 size={12} /> Excluir Empresa Parceira
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Rodapé do Drawer */}
                  <div className="border-t border-slate-100 pt-4 flex items-center justify-end gap-3 shrink-0">
                    <button 
                      type="button"
                      onClick={() => {
                        if (selectedCompanyId === 'new') {
                          if (companies.length > 0) {
                            setSelectedCompanyId(companies[0].id);
                          }
                        }
                        setIsRegisteringCompany(false);
                      }}
                      className="px-5 h-8 bg-white text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-slate-50 transition-all border border-slate-200/50 cursor-pointer active:scale-95"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="button"
                      onClick={handleRegisterCompany}
                      className="px-6 h-8 bg-[#533af6] hover:bg-[#4128df] text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all border-0 cursor-pointer active:scale-95 flex items-center justify-center"
                    >
                      {editingCompanyId ? 'Salvar Alterações' : 'Salvar Empresa'}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Drawer Lateral de Criação/Edição de Questionários */}
          <AnimatePresence>
            {isCreatingNewTemplate && (
              <div className="fixed inset-0 z-[150] flex justify-end">
                {/* Backdrop escuro com desfoque suave */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleCancelTemplateEdit}
                  className="absolute inset-0 bg-slate-950/50 backdrop-blur-[4px]"
                />

                {/* Painel lateral (Drawer) */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-100/80 z-10"
                >
                  {/* Cabeçalho do Drawer */}
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 shadow-sm border border-primary-100/20">
                        <FileText size={18} />
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none">
                          {editingTemplateId ? 'Editar Questionário' : 'Novo Questionário Customizado'}
                        </h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                          Cadastre perguntas para a biblioteca de avaliações
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleCancelTemplateEdit}
                      className="w-9 h-9 rounded-full bg-white text-slate-400 hover:text-slate-900 shadow-sm border border-slate-100 flex items-center justify-center hover:scale-105 active:scale-95 transition-all outline-none cursor-pointer"
                    >
                      <CloseIcon size={16} />
                    </button>
                  </div>

                  {/* Corpo do Drawer (Rolável) */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left font-sans bg-slate-50/20 no-scrollbar">
                    {/* Nome do Questionário */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block pl-1">Nome do Questionário</label>
                      <input
                        type="text"
                        value={customTestTitle}
                        onChange={(e) => setCustomTestTitle(e.target.value)}
                        placeholder="Ex: Questionário Técnico React / Fit Cultural"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 focus:border-[#533af6]/30 focus:bg-white rounded-[10px] text-xs font-bold text-slate-800 transition-all outline-none"
                      />
                    </div>

                    <div className="space-y-6 pt-4 border-t border-slate-100">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Estrutura das Perguntas ({customQuestions.length})</h4>
                        
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => addCustomQuestion('text')}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border-0 outline-none"
                          >
                            <MessageSquare size={12} />
                            + Pergunta Aberta
                          </button>
                          <button
                            type="button"
                            onClick={() => addCustomQuestion('choice')}
                            className="px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border-0 outline-none"
                            style={{ backgroundColor: 'rgba(83, 58, 246, 0.05)', color: '#533af6' }}
                          >
                            <PlusCircle size={12} />
                            + Múltipla Escolha
                          </button>
                        </div>
                      </div>

                      {customQuestions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 bg-slate-50/50 rounded-[10px] border border-dashed border-slate-200 text-center">
                          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3">
                            <FileText size={20} />
                          </div>
                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Nenhuma pergunta adicionada ainda</p>
                          <p className="text-[10px] text-slate-400 mt-1 max-w-[280px]">Adicione perguntas abertas ou de múltipla escolha usando os botões acima.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {customQuestions.map((q, qIdx) => (
                            <div key={q.id} className="p-6 bg-slate-50 rounded-[10px] border border-slate-100 space-y-4 relative group transition-all hover:bg-slate-50/80">
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
                                  className="w-8 h-8 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-[10px] flex items-center justify-center border border-slate-100 hover:border-red-100 transition-all cursor-pointer outline-none"
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
                                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#533af6]/30 rounded-[10px] text-xs font-bold text-slate-700 transition-all outline-none"
                                />
                              </div>

                              {q.type === 'choice' && (
                                <div className="pl-4 border-l-2 border-slate-200 space-y-3">
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
                                          className="flex-1 px-4 py-2.5 bg-white border border-slate-200 focus:border-[#533af6]/30 rounded-[10px] text-xs font-semibold text-slate-700 transition-all outline-none"
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
                    </div>
                  </div>

                  {/* Rodapé do Drawer */}
                  <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 shrink-0">
                    <button
                      type="button"
                      onClick={handleCancelTemplateEdit}
                      className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-[10px] uppercase tracking-widest rounded-full transition-all cursor-pointer border-0 outline-none"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveCustomTemplate}
                      className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-widest rounded-full shadow-xl shadow-slate-900/10 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer border-0 outline-none"
                    >
                      <Check size={14} />
                      Salvar Questionário
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
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                />

                {/* Painel lateral (Drawer) */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="relative w-full max-w-md bg-white rounded-l-[24px] rounded-r-none shadow-2xl p-8 overflow-hidden flex flex-col h-full border-l border-slate-100/85 z-10 animate-none"
                >
                  {/* Cabeçalho do Drawer */}
                  <div className="flex justify-between items-center mb-6 mt-2 shrink-0 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 shadow-sm border border-primary-100/20">
                        <Filter size={18} />
                      </div>
                      <div>
                        <h3 className="text-md font-black text-slate-900 uppercase tracking-tight">Filtros de Candidatos</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Refine sua busca por talentos</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsFilterSidebarOpen(false)}
                      className="w-8 h-8 rounded-full border border-slate-100 hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer outline-none"
                    >
                      <CloseIcon size={14} />
                    </button>
                  </div>

                  {/* Corpo do Drawer (Rolável) */}
                  <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 text-left font-sans mb-6 pr-1">
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
                  <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-4 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setTalentFilters({ role: '', minAge: 16, maxAge: 60, city: '', state: '', first_job: false, education: '', experience: '', modality: '', salary: '' });
                      }}
                      className="px-5 py-2 text-[9px] font-black text-slate-400 hover:text-rose-600 uppercase tracking-widest transition-all flex items-center gap-1 bg-transparent border-0 cursor-pointer outline-none active:scale-95"
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
                      className="flex-1 px-6 py-3.5 bg-[#533af6] hover:bg-[#4326e5] text-white rounded-full font-black text-[9px] uppercase tracking-widest shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 border-0 outline-none flex items-center justify-center gap-1.5 cursor-pointer"
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
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="relative w-full max-w-md bg-white rounded-l-[24px] rounded-r-none h-full shadow-2xl flex flex-col border-l border-slate-100/80 z-10 text-left font-sans"
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
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-150/60">
                      <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2.5">Resumo da Candidatura</h5>
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
                            <div className="bg-white hover:bg-slate-50/50 border border-slate-200/80 rounded-xl p-4 transition-all shadow-2xs">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h6 className="font-extrabold text-slate-800 text-xs uppercase tracking-tight">DISC</h6>
                                  <p className="text-[10px] font-semibold text-slate-500 mt-1">Avaliação de perfil comportamental (Dominância, Influência, Estabilidade, Conformidade)</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider shrink-0 select-none ${
                                  discStatus === 'COMPLETED'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    : discStatus === 'PENDING'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                    : 'bg-slate-50 text-slate-500 border border-slate-150'
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
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100/70 text-rose-700 font-extrabold rounded-full uppercase text-[10px] transition-all cursor-pointer border border-rose-150/40"
                                  >
                                    <span>Ver Perfil DISC</span>
                                    <ChevronRight size={10} className="shrink-0" />
                                  </button>
                                ) : discStatus === 'PENDING' ? (
                                  <div className="flex items-center gap-1 text-[10px] text-amber-600 font-black uppercase tracking-wider bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100/50">
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
                                    className="px-3.5 py-1.5 bg-[#8959f5] hover:bg-[#7846e3] text-white font-extrabold rounded-full uppercase text-[10px] transition-all cursor-pointer border-0 shadow-sm active:scale-95"
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
                            <div className="bg-white hover:bg-slate-50/50 border border-slate-200/80 rounded-xl p-4 transition-all shadow-2xs">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h6 className="font-extrabold text-slate-800 text-xs uppercase tracking-tight">Mapeamento de Perfil</h6>
                                  <p className="text-[10px] font-semibold text-slate-500 mt-1">Perguntas estruturadas sobre expectativas e experiências</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider shrink-0 select-none ${
                                  questionsStatus === 'COMPLETED'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    : questionsStatus === 'PENDING'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                    : 'bg-slate-50 text-slate-500 border border-slate-150'
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
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100/70 text-indigo-700 font-extrabold rounded-full uppercase text-[10px] transition-all cursor-pointer border border-indigo-150/40"
                                  >
                                    <span>Ver Respostas</span>
                                    <ChevronRight size={10} className="shrink-0" />
                                  </button>
                                ) : questionsStatus === 'PENDING' ? (
                                  <div className="flex items-center gap-1 text-[10px] text-amber-600 font-black uppercase tracking-wider bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100/50">
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
                                    className="px-3.5 py-1.5 bg-[#8959f5] hover:bg-[#7846e3] text-white font-extrabold rounded-full uppercase text-[10px] transition-all cursor-pointer border-0 shadow-sm active:scale-95"
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
                            <div className="bg-white hover:bg-slate-50/50 border border-slate-200/80 rounded-xl p-4 transition-all shadow-2xs">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h6 className="font-extrabold text-slate-800 text-xs uppercase tracking-tight">MBTI</h6>
                                  <p className="text-[10px] font-semibold text-slate-500 mt-1">Indicador de tipos de personalidade com 16 perfis possíveis</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider shrink-0 select-none ${
                                  mbtiStatus === 'COMPLETED'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    : mbtiStatus === 'PENDING'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                    : 'bg-slate-50 text-slate-500 border border-slate-150'
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
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 hover:bg-violet-100/70 text-violet-700 font-extrabold rounded-full uppercase text-[10px] transition-all cursor-pointer border border-violet-150/40"
                                  >
                                    <span>Ver Perfil: {mbtiResponses?.type || 'MBTI'}</span>
                                    <ChevronRight size={10} className="shrink-0" />
                                  </button>
                                ) : mbtiStatus === 'PENDING' ? (
                                  <div className="flex items-center gap-1 text-[10px] text-amber-600 font-black uppercase tracking-wider bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100/50">
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
                                    className="px-3.5 py-1.5 bg-[#8959f5] hover:bg-[#7846e3] text-white font-extrabold rounded-full uppercase text-[10px] transition-all cursor-pointer border-0 shadow-sm active:scale-95"
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
                            <div className="bg-white hover:bg-slate-50/50 border border-slate-200/80 rounded-xl p-4 transition-all shadow-2xs">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h6 className="font-extrabold text-slate-800 text-xs uppercase tracking-tight">Temperamentos</h6>
                                  <p className="text-[10px] font-semibold text-slate-500 mt-1">Identificação de temperamentos (Sanguíneo, Colérico, Melancólico, Fleumático)</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider shrink-0 select-none ${
                                  temperamentosStatus === 'COMPLETED'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    : temperamentosStatus === 'PENDING'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                    : 'bg-slate-50 text-slate-500 border border-slate-150'
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
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100/70 text-sky-700 font-extrabold rounded-full uppercase text-[10px] transition-all cursor-pointer border border-sky-150/40"
                                  >
                                    <span>Ver Perfil: {temperamentosResponses?.type || 'TEMP'}</span>
                                    <ChevronRight size={10} className="shrink-0" />
                                  </button>
                                ) : temperamentosStatus === 'PENDING' ? (
                                  <div className="flex items-center gap-1 text-[10px] text-amber-600 font-black uppercase tracking-wider bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100/50">
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
                                    className="px-3.5 py-1.5 bg-[#8959f5] hover:bg-[#7846e3] text-white font-extrabold rounded-full uppercase text-[10px] transition-all cursor-pointer border-0 shadow-sm active:scale-95"
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
                            <div className="bg-white hover:bg-slate-50/50 border border-slate-200/80 rounded-xl p-4 transition-all shadow-2xs">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h6 className="font-extrabold text-slate-800 text-xs uppercase tracking-tight">Questionário Customizado</h6>
                                  <p className="text-[10px] font-semibold text-slate-500 mt-1">Perguntas customizadas criadas para esta vaga</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider shrink-0 select-none ${
                                  customTestStatus === 'COMPLETED'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    : customTestStatus === 'PENDING'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                    : 'bg-slate-50 text-slate-500 border border-slate-150'
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
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100/70 text-emerald-700 font-extrabold rounded-full uppercase text-[10px] transition-all cursor-pointer border border-emerald-150/40"
                                  >
                                    <span>Ver Respostas</span>
                                    <ChevronRight size={10} className="shrink-0" />
                                  </button>
                                ) : customTestStatus === 'PENDING' ? (
                                  <div className="flex items-center gap-1 text-[10px] text-amber-600 font-black uppercase tracking-wider bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100/50">
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
                                    className="px-3.5 py-1.5 bg-[#8959f5] hover:bg-[#7846e3] text-white font-extrabold rounded-full uppercase text-[10px] transition-all cursor-pointer border-0 shadow-sm active:scale-95"
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
