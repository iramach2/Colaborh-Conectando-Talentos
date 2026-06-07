import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  BrainCircuit, 
  Zap, 
  Filter, 
  ChevronDown, 
  X as CloseIcon, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Search,
  Bookmark
} from 'lucide-react';
import { BRAZIL_STATES, calculateAge } from '../../../utils/companyDashboardUtils';

interface TalentBankTabProps {
  isAiSearching: boolean;
  aiPrompt: string;
  setAiPrompt: (val: string) => void;
  handleAiSearch: () => void;
  isFiltersVisible: boolean;
  setIsFiltersVisible: (val: boolean) => void;
  talentFilters: any;
  setTalentFilters: (val: any) => void;
  isTalentLoadingCities: boolean;
  talentCities: string[];
  talentSearch: string;
  setTalentSearch: (val: string) => void;
  setIsFilterSidebarOpen: (val: boolean) => void;
  filteredTalents: any[];
  setSelectedResumeApplicant: (val: any) => void;
  selectedCompany?: any;
  handleToggleSaveTalent: (talentId: string) => void;
  talentSubTab: 'all' | 'saved';
}

export const TalentBankTab = ({
  isAiSearching,
  aiPrompt,
  setAiPrompt,
  handleAiSearch,
  isFiltersVisible,
  setIsFiltersVisible,
  talentFilters,
  setTalentFilters,
  isTalentLoadingCities,
  talentCities,
  talentSearch,
  setTalentSearch,
  setIsFilterSidebarOpen,
  filteredTalents,
  setSelectedResumeApplicant,
  selectedCompany,
  handleToggleSaveTalent,
  talentSubTab
}: TalentBankTabProps) => {
  return (
    <motion.div 
      key="banco-talentos"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >


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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTalents.length > 0 ? (
          filteredTalents.map(talent => {
            const isSaved = selectedCompany?.savedTalents?.includes(talent.id) || false;
            return (
              <motion.div 
                key={talent.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2rem] border border-slate-100/70 hover:border-primary-100/50 shadow-sleek p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group text-left flex flex-col justify-between h-full"
              >
                {/* Botão de Salvar (Favoritar) no canto superior direito */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleSaveTalent(talent.id);
                  }}
                  className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 active:scale-90 cursor-pointer shadow-sm z-10 ${
                    isSaved 
                      ? 'bg-primary-50 border-primary-200 text-[#533af6]' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-650'
                  }`}
                  title={isSaved ? "Remover dos salvos" : "Salvar candidato"}
                >
                  <Bookmark size={14} className={isSaved ? "fill-[#533af6]" : ""} />
                </button>

                <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.08] group-hover:scale-110 text-primary-600 transition-all duration-500 pointer-events-none">
                  <BrainCircuit size={80} />
                </div>

                <div>
                  {/* Cabeçalho do Candidato */}
                  <div className="flex items-start gap-3 mb-4 pr-6">
                    <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative">
                      {talent.profile_pic ? (
                        <img src={talent.profile_pic} alt={talent.name} className="w-full h-full object-cover" />
                      ) : (
                        <User size={24} className="text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight truncate leading-tight">{talent.name}</h4>
                        {talent.first_job && (
                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[7px] font-black uppercase tracking-widest shrink-0 select-none">
                            1º Job
                          </span>
                        )}
                      </div>
                      <p className="text-[9.5px] font-black text-[#533af6] uppercase tracking-wider mt-0.5">{talent.role}</p>
                      <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-bold text-slate-450 mt-1">
                        <span className="flex items-center gap-0.5"><MapPin size={10} className="text-slate-400 shrink-0" /> {talent.city}, {talent.state}</span>
                        <span>•</span>
                        <span>{talent.age || calculateAge(talent.birth_date)} anos</span>
                      </div>
                    </div>
                  </div>

                  {/* Detalhes Rápidos de Contratação */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100/50">
                      <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5 opacity-60">Gênero</p>
                      <p className="text-[9.5px] font-bold text-slate-750 uppercase tracking-tight truncate">{talent.gender || 'Não Inf.'}</p>
                    </div>
                    <div className="bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100/50">
                      <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5 opacity-60">Pretensão</p>
                      <p className="text-[9.5px] font-bold text-slate-750 uppercase tracking-tight truncate">{talent.salary || 'Não Inf.'}</p>
                    </div>
                  </div>

                  {/* Resumo Profissional estilo chat bubble */}
                  {talent.summary ? (
                    <div className="bg-slate-50/30 p-3.5 rounded-2xl border border-slate-100/60 text-left relative mb-4">
                      <h5 className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <BrainCircuit size={10} className="text-primary-500" /> Resumo Profissional
                      </h5>
                      <p className="text-[9.5px] font-medium text-slate-550 leading-relaxed italic text-justify line-clamp-2">
                        "{talent.summary}"
                      </p>
                    </div>
                  ) : null}

                  {/* Competências */}
                  {Array.isArray(talent.skills) && talent.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {talent.skills.slice(0, 3).map((skill, sIdx) => (
                        <span 
                          key={sIdx} 
                          className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-[#533af6]/5 text-[#533af6] border border-[#533af6]/10 select-none"
                        >
                          {skill}
                        </span>
                      ))}
                      {talent.skills.length > 3 && (
                        <span className="px-2 py-0.5 rounded-full text-[8px] font-black text-slate-400 bg-slate-50 border border-slate-100/60 select-none">
                          +{talent.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Rodapé do Card com Contatos Individuais e Ações */}
                <div>
                  <div className="pt-4 border-t border-slate-50 space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-[9.5px] font-medium text-slate-550 truncate">
                      <Mail size={12} className="text-slate-400 shrink-0" />
                      <span>{talent.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[9.5px] font-medium text-slate-550">
                      <Phone size={12} className="text-slate-400 shrink-0" />
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
                      className="flex-1 py-3 bg-[#533af6] hover:bg-[#432ec4] text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all duration-200 cursor-pointer border-0 outline-none shadow-sm hover:shadow-[#533af6]/10"
                      title="Visualizar Informações"
                    >
                      Informações
                    </button>
                    {(() => {
                      const cleanPhone = talent.phone ? talent.phone.replace(/\D/g, '') : '';
                      const whatsappUrl = `https://api.whatsapp.com/send?phone=55${cleanPhone}&text=Olá%20${encodeURIComponent(talent.name)},%20gostamos%20do%20seu%20perfil%20na%20Colaborh!`;
                      return (
                        <a 
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-11 h-11 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl flex items-center justify-center transition-all duration-200 border border-emerald-600 shadow-sm cursor-pointer shrink-0 hover:shadow-emerald-100"
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
            );
          })
        ) : (
          <div className="col-span-full py-32 bg-white rounded-[3rem] shadow-sleek border border-dashed border-slate-200 flex flex-col items-center justify-center text-center px-10">
             {talentSubTab === 'saved' ? (
               <>
                 <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-8 overflow-hidden relative border border-slate-100/50">
                    <div className="absolute inset-0 bg-primary-50/30 animate-pulse" />
                    <Bookmark size={40} className="text-slate-300" />
                 </div>
                 <h4 className="text-xl font-black text-slate-900 mb-4 tracking-tight uppercase">Nenhum candidato salvo</h4>
                 <p className="text-slate-450 text-xs font-bold uppercase tracking-wider max-w-sm mx-auto leading-relaxed">
                    Você ainda não favoritou candidatos. Explore a aba de <span className="text-[#533af6]">Todos os Talentos</span> e clique no botão de salvar (bookmark) nos perfis desejados!
                 </p>
               </>
             ) : (
               <>
                 <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-8 overflow-hidden relative">
                    <div className="absolute inset-0 bg-primary-100/20 animate-pulse" />
                    <Search size={48} />
                 </div>
                 <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Nenhuma correspondência exata</h4>
                 <p className="text-slate-400 text-sm font-medium max-w-sm mx-auto leading-relaxed">
                    Tente usar a <span className="text-primary-600 font-bold uppercase text-xs">Busca por IA</span> acima descrevendo as competências que você precisa nos currículos.
                 </p>
               </>
             )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
