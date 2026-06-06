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
  Search 
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
  setSelectedResumeApplicant
}: TalentBankTabProps) => {
  return (
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
          className="md:w-56 bg-gradient-to-r from-slate-900 to-indigo-900 hover:from-slate-800 hover:to-indigo-800 disabled:opacity-50 text-white rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shrink-0 py-4 md:py-0 shadow-lg shadow-indigo-100 cursor-pointer"
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
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border cursor-pointer ${
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
                    className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border cursor-pointer ${
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
                  className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-red-500 transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-0 outline-none"
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
                    className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-[5px] text-[8.5px] font-black uppercase tracking-widest transition-all cursor-pointer border-0 outline-none"
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
  );
};
