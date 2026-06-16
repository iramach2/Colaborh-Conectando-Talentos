import React from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  Clock, 
  XCircle, 
  Eye, 
  Share2, 
  Settings, 
  ChevronLeft, 
  User, 
  Brain, 
  Check, 
  Activity,
  Plus,
  StickyNote,
  Trash2,
  Search,
  MessageSquare
} from 'lucide-react';
import { 
  parseCandidatePhoneData, 
  calculateAiMatchScore, 
  getCurrentJobStages, 
  getCurrentJobStageTests,
  calculateAge
} from '../../../utils/companyDashboardUtils';

interface MyVacanciesTabProps {
  jobs: any[];
  isFetchingJobs: boolean;
  jobSubTab: 'active' | 'paused' | 'closed';
  selectedJob: any;
  setSelectedJob: (job: any) => void;
  jobApplicants: any[];
  isFetchingApplicants: boolean;
  handleViewApplicants: (job: any) => void;
  handleUpdateJobStatus: (jobId: string, status: string) => void;
  handleShareJob: (job: any) => void;
  setIsRegisteringVacancy: (val: boolean) => void;
  setRegisterStep: (step: number) => void;
  setIsConfiguringStages: (val: boolean) => void;
  handleUpdateApplicantStatus: (appId: string, newStatus: string) => void;
  setSelectedResumeApplicant: (applicant: any) => void;
  getFullApplicantInfo: (applicant: any) => any;
  handleRequestDiscTest: (applicant: any) => void;
  handleRequestMbtiTest: (applicant: any) => void;
  handleRequestTemperamentosTest: (applicant: any) => void;
  handleRequestQuestions: (applicant: any) => void;
  handleRequestCustomTest: (applicant: any) => void;
  handleOpenNotes: (applicant: any) => void;
  handleDeleteJob: (jobId: string, jobTitle: string) => void;
  handleOpenChat: (applicant: any) => void;
  jobSearch: string;
  setJobSearch: (val: string) => void;
}

export const MyVacanciesTab: React.FC<MyVacanciesTabProps> = ({
  jobs,
  isFetchingJobs,
  jobSubTab,
  selectedJob,
  setSelectedJob,
  jobApplicants,
  isFetchingApplicants,
  handleViewApplicants,
  handleUpdateJobStatus,
  handleShareJob,
  setIsRegisteringVacancy,
  setRegisterStep,
  setIsConfiguringStages,
  handleUpdateApplicantStatus,
  setSelectedResumeApplicant,
  getFullApplicantInfo,
  handleRequestDiscTest,
  handleRequestMbtiTest,
  handleRequestTemperamentosTest,
  handleRequestQuestions,
  handleRequestCustomTest,
  handleOpenNotes,
  handleDeleteJob,
  handleOpenChat,
  jobSearch: searchTerm,
  setJobSearch: setSearchTerm
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const kanbanContainerRef = React.useRef<HTMLDivElement>(null);
  const [activeColumnIndex, setActiveColumnIndex] = React.useState(0);
  const [isDraggingMinimap, setIsDraggingMinimap] = React.useState(false);
  const startXRef = React.useRef(0);
  const startScrollLeftRef = React.useRef(0);

  const allColumns = selectedJob ? getCurrentJobStages(selectedJob) : [];
  const hasMovedRef = React.useRef(false);

  const handleMinimapMouseDown = (e: React.MouseEvent) => {
    setIsDraggingMinimap(true);
    startXRef.current = e.clientX;
    hasMovedRef.current = false;
    if (kanbanContainerRef.current) {
      startScrollLeftRef.current = kanbanContainerRef.current.scrollLeft;
    }
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingMinimap || !kanbanContainerRef.current) return;
      const deltaX = e.clientX - startXRef.current;
      
      if (Math.abs(deltaX) > 10) {
        hasMovedRef.current = true;
      }
      
      const container = kanbanContainerRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll <= 0) return;
      
      const minimapWidth = allColumns.length * 36;
      const scrollFactor = maxScroll / (minimapWidth || 1);
      
      container.scrollLeft = startScrollLeftRef.current + (deltaX * scrollFactor);
    };

    const handleMouseUp = () => {
      setIsDraggingMinimap(false);
    };

    if (isDraggingMinimap) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingMinimap, allColumns.length]);

  const handleKanbanScroll = () => {
    if (!kanbanContainerRef.current) return;
    const container = kanbanContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const containerRect = container.getBoundingClientRect();
    
    let maxVisibleWidth = 0;
    let activeIndex = 0;
    
    const children = (Array.from(container.children) as HTMLElement[]).filter(el => el.hasAttribute('data-kanban-column'));
    children.forEach((child, index) => {
      const el = child as HTMLElement;
      const elRect = el.getBoundingClientRect();
      const elLeft = elRect.left - containerRect.left + scrollLeft;
      const elWidth = el.offsetWidth;
      
      const visibleLeft = Math.max(scrollLeft, elLeft);
      const visibleRight = Math.min(scrollLeft + containerWidth, elLeft + elWidth);
      const visibleWidth = Math.max(0, visibleRight - visibleLeft);
      
      if (visibleWidth > maxVisibleWidth) {
        maxVisibleWidth = visibleWidth;
        activeIndex = index;
      }
    });
    
    setActiveColumnIndex(activeIndex);
  };

  const handleScrollToColumn = (colIndex: number) => {
    if (!kanbanContainerRef.current) return;
    const container = kanbanContainerRef.current;
    const children = (Array.from(container.children) as HTMLElement[]).filter(el => el.hasAttribute('data-kanban-column'));
    const colElement = children[colIndex] as HTMLElement;
    if (colElement) {
      const containerRect = container.getBoundingClientRect();
      const colRect = colElement.getBoundingClientRect();
      const relativeLeft = colRect.left - containerRect.left + container.scrollLeft;
      
      container.scrollTo({
        left: relativeLeft - 16,
        behavior: 'smooth'
      });
      setActiveColumnIndex(colIndex);
    }
  };

  React.useEffect(() => {
    if (selectedJob !== null) {
      const timer = setTimeout(() => {
        handleKanbanScroll();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedJob, jobApplicants]);

  const getJobInitials = (title: string) => {
    if (!title) return 'VA';
    const cleanTitle = cleanEmojiFromText(title);
    const words = cleanTitle.trim().split(/\s+/).filter(w => w.length > 0);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return cleanTitle.substring(0, 2).toUpperCase();
  };

  const cleanEmojiFromText = (text: string): string => {
    if (!text) return '';
    try {
      return text
        .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]|\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu, '')
        .replace(/\s+/g, ' ')
        .trim();
    } catch (e) {
      return text
        .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    }
  };
  
  if (selectedJob === null) {
    return (
      <div className="space-y-4">


        <motion.div 
          key="minhas-vagas-grid"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -20 }}
          className="w-full flex flex-col gap-6"
        >
        {isFetchingJobs ? (
          <div className="text-center py-20">
            <Activity className="animate-spin mx-auto text-primary-600 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Carregando suas vagas...</p>
          </div>
        ) : jobs.length > 0 ? (
          (() => {
            const filteredJobs = jobs.filter(job => {
              const isSubTabMatch = 
                (jobSubTab === 'active' && (job.status === 'active' || !job.status)) ||
                (jobSubTab === 'paused' && job.status === 'paused') ||
                (jobSubTab === 'closed' && job.status === 'closed');
              
              if (!isSubTabMatch) return false;

              if (searchTerm.trim() !== '') {
                const query = searchTerm.toLowerCase();
                return job.title?.toLowerCase().includes(query) || job.modality?.toLowerCase().includes(query);
              }

              return true;
            });

            if (filteredJobs.length === 0) {
              return (
                <div className="bg-white/80 backdrop-blur-md border border-white/50 p-20 rounded-[24px] text-center shadow-[0_4px_20px_rgba(83,58,246,0.02)] select-none">
                  <div className="w-16 h-16 bg-[#533af6]/10 text-[#533af6] rounded-full flex items-center justify-center mx-auto mb-4 border border-white/50 shadow-xs">
                    <Briefcase size={28} className="stroke-[2]" />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-wider mb-1">
                    {searchTerm.trim() !== '' ? 'Nenhuma vaga encontrada' : 'Nenhuma vaga nesta categoria'}
                  </h3>
                  <p className="text-slate-400 text-xs max-w-sm mx-auto mb-6 font-semibold leading-relaxed">
                    {searchTerm.trim() !== '' ? 'Não encontramos vagas correspondentes à sua pesquisa.' : 'Não encontramos vagas com o status selecionado.'}
                  </p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full text-left">
                {filteredJobs.map((job, i) => (
                  <div 
                    key={job.id || i} 
                    className="bg-white/80 backdrop-blur-md border border-white/50 p-6 rounded-[24px] shadow-[0_4px_20px_rgba(83,58,246,0.02)] hover:border-primary-200 hover:-translate-y-1.5 hover:shadow-[0_20px_25px_-5px_rgba(124,58,237,0.12)] transition-all duration-300 group flex flex-col justify-between relative overflow-hidden h-[240px]"
                  >
                    <div className="flex flex-col h-full justify-between">
                      {/* Top: Ícone iniciais + Título da Vaga */}
                      <div>
                        <div className="flex items-center gap-3.5 mb-4 mt-1 min-w-0">
                          <div className="w-11 h-11 bg-[#533af6]/10 text-[#533af6] rounded-full flex items-center justify-center font-black text-xs shrink-0 border border-white/50 shadow-xs select-none">
                            {getJobInitials(job.title)}
                          </div>
                          
                          <div className="min-w-0 flex-1 text-left">
                            <h3 
                              onClick={() => handleViewApplicants(job)}
                              className="text-base font-black text-slate-800 tracking-tight group-hover:text-[#533af6] transition-colors uppercase line-clamp-1 mb-0.5 cursor-pointer select-none" 
                              title={cleanEmojiFromText(job.title)}
                            >
                              {cleanEmojiFromText(job.title)}
                            </h3>
                            <div className="flex gap-1.5 items-center">
                              <span className="px-2 py-0.5 bg-primary-50 text-primary-600/90 rounded-full text-[8px] font-black uppercase tracking-widest border border-primary-100/30">
                                {cleanEmojiFromText(job.modality || 'Remoto')}
                              </span>
                              {job.contract_type && (
                                <span className="px-2 py-0.5 bg-highlight-50 text-highlight-750 rounded-full text-[8px] font-black uppercase tracking-widest border border-highlight-100/30">
                                  {cleanEmojiFromText(job.contract_type)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 select-none">
                          <span>Publicada em {job.created_at ? new Date(job.created_at).toLocaleDateString('pt-BR') : 'Recentemente'}</span>
                        </div>
                      </div>

                      {/* Bottom: Candidatos inscritos + Seletor de Status + Botões de Ações */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-t border-slate-100/60 pt-3.5">
                          {/* Candidatos inscritos */}
                          <div className="text-left select-none">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Inscritos</p>
                            <p className="text-lg font-black text-slate-800 leading-none">{job.candidates_count || 0}</p>
                          </div>

                          {/* Select de Status */}
                          {(() => {
                            const status = job.status || 'active';
                            let colorClasses = 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/50';
                            if (status === 'paused') colorClasses = 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/50';
                            else if (status === 'closed') colorClasses = 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200/50';
                            return (
                              <select
                                value={status}
                                onChange={(e) => handleUpdateJobStatus(job.id, e.target.value)}
                                className={`${colorClasses} px-2.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border outline-none cursor-pointer transition-all`}
                              >
                                <option value="active" className="bg-white text-slate-700 font-bold">Ativa</option>
                                <option value="paused" className="bg-white text-slate-700 font-bold">Pausada</option>
                                <option value="closed" className="bg-white text-slate-700 font-bold">Encerrada</option>
                              </select>
                            );
                          })()}
                        </div>

                        {/* Botões de Ações */}
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleViewApplicants(job)}
                            className="flex-1 py-2 bg-[#533af6]/10 text-[#533af6] hover:bg-[#533af6]/20 rounded-xl border-0 text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer font-bold"
                            title="Ver candidatos e triagem"
                          >
                            <Eye size={13} className="stroke-[2.5]" />
                            <span>Candidatos</span>
                          </button>
                          <button 
                            onClick={() => handleShareJob(job)}
                            className="p-2 bg-[#533af6]/10 text-[#533af6] hover:bg-[#533af6]/20 rounded-xl border-0 transition-all cursor-pointer"
                            title="Compartilhar vaga"
                          >
                            <Share2 size={14} className="stroke-[2.5]" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleDeleteJob(job.id, job.title)}
                            className="p-2 bg-[#533af6]/10 text-[#533af6] hover:bg-rose-600/20 hover:text-rose-600 rounded-xl border-0 transition-all cursor-pointer"
                            title="Excluir vaga"
                          >
                            <Trash2 size={14} className="stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()
        ) : (
          <div className="bg-white/80 backdrop-blur-md border border-white/50 p-20 rounded-[24px] text-center shadow-[0_4px_20px_rgba(83,58,246,0.02)] select-none">
            <div className="w-16 h-16 bg-[#533af6]/10 text-[#533af6] rounded-full flex items-center justify-center mx-auto mb-4 border border-white/50 shadow-xs">
              <Briefcase size={28} className="stroke-[2]" />
            </div>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-wider mb-1">Nenhuma vaga publicada</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto mb-6 font-semibold leading-relaxed">Você ainda não criou nenhuma oportunidade. Comece a contratar agora mesmo!</p>
            <button 
              onClick={() => { setIsRegisteringVacancy(true); setRegisterStep(1); }}
              className="px-6 py-3 bg-[#533af6] hover:bg-[#4326e5] text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer border-0"
            >
              Publicar Primeira Vaga
            </button>
          </div>
        )}
      </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      key="triagem-kanban"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 w-full max-w-full"
    >
      {/* Cabeçalho da triagem - Movido do header para abaixo dele */}
      <div className="w-full pb-4 pt-1 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-left">
        <div className="flex items-start gap-3 w-full md:w-auto">
          {/* Botão voltar redondo antes do título */}
          <button 
            type="button"
            onClick={() => setSelectedJob(null)} 
            className="w-10 h-10 bg-[#533af6]/10 text-[#533af6] hover:bg-[#533af6]/20 rounded-full flex items-center justify-center transition-all outline-none cursor-pointer border-0 shrink-0 mt-0.5"
            title="Voltar para Vagas"
          >
            <ChevronLeft size={18} className="stroke-[3]" />
          </button>

          <div className="space-y-1 min-w-0 flex-1">
            {/* Informações da vaga em caixa alta */}
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1 select-none">
              {(() => {
                const locationText = [selectedJob.city, selectedJob.state].filter(Boolean).join(', ');
                const modalityText = selectedJob.modality;
                const contractText = selectedJob.contractType || selectedJob.contract_type;
                return [locationText, modalityText, contractText].filter(Boolean).join(' • ');
              })()}
            </div>
            
            {/* Título e Badge com linha roxa inferior */}
            <div className="relative pb-2.5 inline-flex items-end gap-3 min-w-[200px]">
              <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase leading-none select-none pl-1">
                {cleanEmojiFromText(selectedJob.title)}
              </h3>
              <span className="text-[8px] font-black bg-[#533af6]/10 text-[#533af6] px-2.5 py-1 rounded-full uppercase tracking-wider select-none leading-none mb-0.5 font-bold">
                {jobApplicants.length} {jobApplicants.length === 1 ? 'candidato' : 'candidatos'}
              </span>
              {/* Linha roxa decorativa embaixo do título */}
              <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#533af6]" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end mb-1">
          <button 
            type="button"
            onClick={() => handleShareJob(selectedJob)}
            className="flex items-center gap-2 px-5 py-3 bg-[#533af6] text-white rounded-full font-black uppercase tracking-widest text-[9px] shadow-md hover:bg-[#4326e5] hover:-translate-y-0.5 active:scale-95 transition-all outline-none cursor-pointer border-0"
          >
            <Share2 size={13} className="stroke-[2.5]" /> Compartilhar Vaga
          </button>
          <button 
            type="button"
            onClick={() => setIsConfiguringStages(true)}
            className="flex items-center gap-2 px-5 py-3 bg-[#533af6]/10 text-[#533af6] rounded-full font-black uppercase tracking-widest text-[9px] hover:bg-[#533af6]/15 hover:-translate-y-0.5 active:scale-95 transition-all outline-none cursor-pointer border-0 font-bold"
          >
            <Settings size={13} className="stroke-[2.5]" /> Configurar Etapas
          </button>
        </div>
      </div>

      {/* Minimap Horizontal Scrollbar */}
      {(() => {
        const stagesList = getCurrentJobStages(selectedJob);
        return stagesList.length > 1 && !isFetchingApplicants && (
          <div className="fixed bottom-6 right-6 z-[80] select-none cursor-ew-resize">
            <div 
              onMouseDown={handleMinimapMouseDown}
              className={`backdrop-blur-md rounded-2xl px-4 py-3 flex items-center gap-2 border transition-all duration-300 ${
                isDraggingMinimap 
                  ? 'bg-white border-[#533af6] shadow-[0_10px_30px_rgba(83,58,246,0.15)] scale-105' 
                  : 'bg-white/95 border-slate-200 shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:border-slate-350 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)]'
              }`}
            >
              {stagesList.map((colName, colIndex) => {
                const isActive = colIndex === activeColumnIndex;
                return (
                  <button
                    key={colName}
                    onClick={() => {
                      if (!hasMovedRef.current) {
                        handleScrollToColumn(colIndex);
                      }
                    }}
                    className={`w-7 h-11 rounded-lg border transition-all duration-300 flex flex-col justify-between p-1 cursor-pointer select-none outline-none ${
                      isActive
                        ? 'border-[#533af6] border-[2px] bg-[#533af6]/5 shadow-xs scale-105 z-10'
                        : 'border-slate-200/60 bg-white/70 hover:border-slate-350 hover:bg-white'
                    }`}
                    title={`Rolar para: ${colName}`}
                  >
                    <div className={`w-full h-1.5 rounded-[2px] ${isActive ? 'bg-[#533af6]' : 'bg-slate-300/80'}`} />
                    <div className="flex flex-col gap-0.5 w-full items-center justify-center flex-1">
                      <div className={`w-3.5 h-0.5 rounded-[1px] ${isActive ? 'bg-[#533af6]/40' : 'bg-slate-200'}`} />
                      <div className={`w-2.5 h-0.5 rounded-[1px] ${isActive ? 'bg-[#533af6]/40' : 'bg-slate-200'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Kanban columns */}
      {isFetchingApplicants ? (
        <div className="text-center py-20 bg-white rounded-[5px] border border-slate-100">
          <Activity className="animate-spin mx-auto text-[#533af6] mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Carregando candidatos e triagem...</p>
        </div>
      ) : (
        <div 
          ref={kanbanContainerRef}
          onScroll={handleKanbanScroll}
          className="flex gap-4 overflow-x-auto pb-4 items-start select-none no-scrollbar"
        >
          {(() => {
            const stagesList = getCurrentJobStages(selectedJob);
            const allColumns = stagesList;
            const currentStageTests = getCurrentJobStageTests(selectedJob);

            return allColumns.map((colName, colIndex) => {
              const defaultStage = stagesList[0] || 'Triagem';
              const applicantsInCol = jobApplicants.filter(app => {
                const currentStatus = app.status;
                const normalizedStatus = (!currentStatus || currentStatus === 'Triagem' || !allColumns.includes(currentStatus))
                  ? defaultStage
                  : currentStatus;
                return normalizedStatus === colName;
              });

              return (
                 <div 
                    key={colName}
                    data-kanban-column="true"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const appId = e.dataTransfer.getData('text/plain');
                      if (appId) {
                        handleUpdateApplicantStatus(appId, colName);
                      }
                    }}
                    className="bg-white border border-slate-200/50 shadow-sm pb-4 rounded-[10px] flex flex-col min-w-[280px] max-w-[320px] max-h-[75vh] shrink-0 overflow-hidden"
                 >
                   {/* Column Header */}
                   <div 
                     className="flex items-center justify-between mb-3 shrink-0 px-4 py-3 bg-[#e8e6fa] rounded-t-[10px]"
                   >
                     <span className="text-[10px] font-black uppercase tracking-widest text-[#7b39eb]">{colName}</span>
                     <span className="text-[9px] bg-[#7b39eb] text-white px-2 py-0.5 rounded-full font-black">
                       {applicantsInCol.length}
                     </span>
                   </div>
 
                   {/* Column Candidates List */}
                   <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 min-h-[150px] px-4 pr-3.5">
                    {applicantsInCol.length > 0 ? (
                      applicantsInCol.map((app) => {
                        const info = getFullApplicantInfo(app);
                        const parsedData = parseCandidatePhoneData(app.candidate_phone);
                        const matchScore = calculateAiMatchScore(selectedJob, info);
                        const testsRequired = currentStageTests[colName] || [];
 
                        return (
                          <div 
                            key={app.id}
                            draggable={true}
                            onDragStart={(e) => {
                              e.dataTransfer.setData('text/plain', app.id);
                            }}
                            onClick={() => setSelectedResumeApplicant(info)}
                            className="bg-white p-4 rounded-[10px] border border-slate-100 hover:border-primary-200/60 shadow-[0_4px_16px_rgba(83,58,246,0.06)] hover:shadow-[0_10px_24px_rgba(83,58,246,0.12)] hover:-translate-y-0.5 transition-all cursor-grab active:cursor-grabbing text-left space-y-3 relative group overflow-hidden"
                          >
                            {/* Porcentagem do Match IA no canto superior direito */}
                            <div 
                              className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-black select-none shrink-0 border shadow-2xs ${
                                matchScore >= 80 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                                  : matchScore >= 50
                                  ? 'bg-amber-50 text-amber-700 border-amber-200/50'
                                  : 'bg-rose-50 text-rose-700 border-rose-200/50'
                              }`}
                              title={`Compatibilidade IA: ${matchScore}%`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {matchScore}%
                            </div>
 
                            {/* Candidate brief info */}
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200/60 overflow-hidden flex items-center justify-center shrink-0">
                                {info.profile_pic ? (
                                  <img src={info.profile_pic} alt="Foto" className="w-full h-full object-cover rounded-full" />
                                ) : (
                                  <User size={16} className="text-slate-400" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1 pr-8">
                                <h5 className="text-xs font-black text-slate-800 uppercase tracking-tight truncate leading-tight">{info.candidate_name}</h5>
                                <p className="text-[9px] font-bold text-slate-400 truncate mt-0.5">{info.city || 'Não inf.'}, {info.state || ''}</p>
                                {(() => {
                                  const age = info.talentMatched?.birth_date 
                                    ? calculateAge(info.talentMatched.birth_date) 
                                    : info.talentMatched?.age;
                                  const gender = info.talentMatched?.gender;
                                  if (!age && !gender) return null;
                                  return (
                                    <p className="text-[8px] font-extrabold text-[#533af6] uppercase tracking-widest mt-1 select-none">
                                      {age ? `${age} anos` : ''}
                                      {age && gender ? ' • ' : ''}
                                      {gender || ''}
                                    </p>
                                  );
                                })()}
                              </div>
                            </div>
 
                            {/* Testes solicitados ou disponíveis para envio */}
                            {testsRequired.length > 0 ? (
                              <div className="w-full mt-2 pt-2 border-t border-slate-100/60 flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
                                {testsRequired.map(test => {
                                  const [testKey, trigger = 'auto'] = test.split(':');
                                  
                                  let testStatus = '';
                                  if (testKey === 'disc') testStatus = parsedData.disc;
                                  else if (testKey === 'mbti') testStatus = parsedData.mbti;
                                  else if (testKey === 'temperamentos') testStatus = parsedData.temperamentos;
                                  else if (testKey === 'perguntas') testStatus = parsedData.questions;
                                  else if (testKey === 'customizado') testStatus = parsedData.customTest;
 
                                  const isCompleted = testStatus.startsWith('COMPLETED') || testStatus === 'COMPLETED' || (testStatus && testStatus !== 'PENDING');
                                  const isPending = testStatus === 'PENDING';
 
                                  let testLabel = testKey.toUpperCase();
                                  if (testKey === 'temperamentos') testLabel = 'Temp.';
                                  if (testKey === 'perguntas') testLabel = 'Map.';
                                  if (testKey === 'customizado') testLabel = 'Quest.';
 
                                  return (
                                     <div key={testKey} className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                       <button
                                         type="button"
                                         onClick={() => {
                                           if (testKey === 'disc') handleRequestDiscTest(info);
                                           else if (testKey === 'mbti') handleRequestMbtiTest(info);
                                           else if (testKey === 'temperamentos') handleRequestTemperamentosTest(info);
                                           else if (testKey === 'perguntas') handleRequestQuestions(info);
                                           else if (testKey === 'customizado') handleRequestCustomTest(info);
                                         }}
                                         className="px-2.5 py-0.5 rounded bg-[#7b39eb] hover:bg-[#6929d9] text-white border border-transparent text-[8px] font-black uppercase flex items-center gap-1 transition-all cursor-pointer shadow-sm hover:shadow active:scale-95 select-none shrink-0"
                                         title={`Solicitar teste ${testKey.toUpperCase()} (${trigger === 'auto' ? 'Automático' : 'Manual'})`}
                                       >
                                         <Brain size={9} className="stroke-[2.5]" />
                                         {isCompleted || isPending ? 'Reenviar' : 'Enviar'} {testLabel}
                                       </button>

                                       {isCompleted && (
                                         <span 
                                           className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] font-bold uppercase flex items-center gap-0.5 select-none shrink-0"
                                           title="Teste já respondido pelo candidato"
                                         >
                                           <Check size={8} className="text-emerald-600 stroke-[3]" /> Feito
                                         </span>
                                       )}
                                       {isPending && (
                                         <span 
                                           className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100 text-[8px] font-bold uppercase flex items-center gap-0.5 select-none shrink-0"
                                           title="Aguardando resposta do candidato"
                                         >
                                           <Clock size={8} className="text-amber-500" /> Pend.
                                         </span>
                                       )}
                                     </div>
                                   );
                                })}
                              </div>
                            ) : (
                              <div className="text-[8px] text-slate-350 italic mt-2">Sem Testes</div>
                            )}
 
                            {/* Ações do Card (Perfil, WhatsApp e Anotações) */}
                            <div 
                              className="w-full mt-3 pt-2.5 border-t border-slate-100/60 flex items-center gap-2" 
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* Botão de Visualizar Perfil */}
                              <button
                                type="button"
                                onClick={() => setSelectedResumeApplicant(info)}
                                className="flex-1 py-1.5 px-3 bg-[#7b39eb] hover:bg-[#6929d9] text-white rounded-full text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all active:scale-95 shadow-2xs hover:shadow-xs border border-transparent"
                                title="Visualizar Perfil"
                              >
                                <Eye size={12} className="stroke-[2.5]" />
                                <span>Perfil</span>
                              </button>
 
                              {/* Botão de WhatsApp */}
                              {(() => {
                                const cleanedPhone = (parsedData.phone || '').replace(/\D/g, '');
                                const whatsappUrl = `https://wa.me/${cleanedPhone.startsWith('55') ? cleanedPhone : '55' + cleanedPhone}`;
                                return (
                                  <a 
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shrink-0 transition-all active:scale-95 shadow-2xs hover:shadow-xs"
                                    title="Chamar no WhatsApp"
                                  >
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                      <path d="M12.031 2C6.49 2 2 6.47 2 12.01c0 1.91.53 3.78 1.56 5.42L2 23l5.76-1.51c1.58.86 3.37 1.31 5.27 1.31 5.54 0 10.03-4.47 10.03-10.01C23.06 6.47 18.57 2 12.031 2zm5.73 14.1c-.24.68-1.24 1.25-1.9 1.34-.54.07-1.24.08-2 .17-1.24-.16-2.5-1.06-3.69-2.25-1.19-1.19-2.09-2.45-2.25-3.69.09-.76.1-1.46.17-2 .09-.66.66-1.66 1.34-1.9.18-.06.39-.08.57-.08.18 0 .37.01.52.33.21.46.72 1.77.79 1.91.07.15.12.32.02.5-.1.18-.15.3-.3.47-.15.17-.32.39-.46.52-.16.16-.33.33-.14.65.19.32.84 1.39 1.8 2.25.96.86 1.77 1.41 2.09 1.57.32.16.51.12.67-.06.17-.18.72-.84.92-1.12.19-.28.39-.23.65-.13.26.1 1.66.78 1.94.92.28.14.47.21.54.34.08.13.08.76-.16 1.44z" />
                                    </svg>
                                  </a>
                                );
                              })()}

                              {/* Botão de Mensagens / Chat */}
                              <button
                                type="button"
                                onClick={() => handleOpenChat(app)}
                                className="w-8 h-8 rounded-full bg-[#533af6] hover:bg-[#4326e5] text-white flex items-center justify-center shrink-0 transition-all active:scale-95 shadow-2xs hover:shadow-xs border border-transparent"
                                title="Conversar com o candidato"
                              >
                                <MessageSquare size={14} className="stroke-[2.5]" />
                              </button>

                              {/* Botão de Anotações */}
                              <button
                                type="button"
                                onClick={() => handleOpenNotes(app)}
                                className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shrink-0 transition-all active:scale-95 shadow-2xs hover:shadow-xs border border-transparent"
                                title="Anotações do Candidato"
                              >
                                <StickyNote size={14} className="stroke-[2.5]" />
                              </button>
                            </div>          
                          </div>
                        );
                      })
                    ) : (
                      <div className="border border-dashed border-slate-200 py-10 rounded-xl flex items-center justify-center text-center text-slate-350 text-[9.5px] font-medium bg-slate-50/20 select-none">
                        Solte candidatos aqui
                      </div>
                    )}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      )}
    </motion.div>
  );
};
