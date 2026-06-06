import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PlusCircle, 
  Check, 
  ChevronDown, 
  Trash2, 
  AlertTriangle,
  Briefcase,
  Clock,
  XCircle,
  Plus
} from 'lucide-react';
import { 
  BRAZIL_STATES, 
  DF_REGIONS 
} from '../../../utils/companyDashboardUtils';

// Redefine a CloseIcon as X if lucide doesn't export CloseIcon directly
import { X as CloseIconComponent } from 'lucide-react';

interface CreateVacancyTabProps {
  isOpen: boolean;
  onClose: () => void;
  registerStep: number;
  setRegisterStep: (step: number | ((prev: number) => number)) => void;
  vacancyForm: {
    title: string;
    role: string;
    modality: 'Presencial' | 'Home Office' | 'Híbrido';
    state: string;
    city: string;
    remunerationType: 'Fixo' | 'Faixa Salarial' | 'A combinar';
    salary: string;
    salaryMin: string;
    salaryMax: string;
    hasBonus: boolean;
    bonusType: string;
    bonusValue: string;
    contractType: string;
    workSchedule: string;
    isFirstJob: boolean;
    minAge: number;
    isPcd: boolean;
    pcdDetails: string;
    positions: string;
    requestReason: string;
    description: string;
    responsibilities: string;
    stages: string[];
    extraBenefits: string[];
    requirements: string[];
    benefits: {
      vt: { selected: boolean; value: string };
      va: { selected: boolean; value: string };
      healthInsurance: boolean;
      healthInsuranceCopay: boolean;
      healthInsuranceFamily: boolean;
      dentalPlan: boolean;
      dentalPlanFamily: boolean;
    };
  };
  setVacancyForm: (form: any | ((prev: any) => any)) => void;
  errorMessage: string | null;
  handleNextStep: () => void;
  handlePublish: () => void;
  isPublishing?: boolean;
}

export const CreateVacancyTab: React.FC<CreateVacancyTabProps> = ({
  isOpen,
  onClose,
  registerStep,
  setRegisterStep,
  vacancyForm,
  setVacancyForm,
  errorMessage,
  handleNextStep,
  handlePublish,
  isPublishing = false
}) => {
  const [newBenefit, setNewBenefit] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newStage, setNewStage] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  const commonRequirements = [
    'Experiência prévia',
    'Inglês Intermediário',
    'Disponibilidade de horário',
    'Proatividade',
    'Trabalho em equipe'
  ];

  // Fetch cities locally in the drawer based on selected state
  useEffect(() => {
    if (vacancyForm.state && (vacancyForm.modality === 'Presencial' || vacancyForm.modality === 'Híbrido')) {
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
    setVacancyForm((prev: any) => ({ ...prev, salary: formatted }));
  };

  const handleSalaryMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setVacancyForm((prev: any) => ({ ...prev, salaryMin: formatted }));
  };

  const handleSalaryMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setVacancyForm((prev: any) => ({ ...prev, salaryMax: formatted }));
  };

  const handleTriggerPublish = async () => {
    if (isPublishing) return;
    let currentStages = vacancyForm.stages;
    if (newStage.trim()) {
      const trimmedStage = newStage.trim();
      currentStages = [...currentStages, trimmedStage];
      setVacancyForm((prev: any) => ({ ...prev, stages: currentStages }));
      setNewStage('');
    }
    handlePublish();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex justify-end overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <motion.div 
        key="cadastrar-vaga"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
        className="relative w-full max-w-[600px] h-full bg-white/95 backdrop-blur-md rounded-none shadow-2xl overflow-hidden flex flex-col border-l border-slate-200/60 z-10"
      >
        {/* Step Header - Compact & Premium */}
        <div className="px-8 pt-8 pb-4 relative">
          <div className="max-w-lg mx-auto w-full">
            <div className="relative pb-3 border-b border-slate-100 w-full">
              <h2 className="text-base font-extrabold text-slate-800 tracking-tight text-left">CADASTRAR NOVA VAGA</h2>
              <div className="absolute bottom-0 left-0 w-24 h-1 bg-[#533af6]" />
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Passo {registerStep} de 4
              </p>

              {/* Step Progress Dots */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((step) => (
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
                    {step < 4 && (
                      <div className={`w-4 h-0.5 mx-0.5 rounded-full ${registerStep > step ? 'bg-[#533af6]/85' : 'bg-slate-200'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-8 right-8 w-9 h-9 border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full flex items-center justify-center transition-all outline-none cursor-pointer"
          >
            <CloseIconComponent size={14} />
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
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">
                    Título da Vaga <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={vacancyForm.title}
                    onChange={(e) => {
                      const cleanValue = e.target.value.replace(/[^a-zA-Z0-9 áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ]/g, '');
                      setVacancyForm((prev: any) => ({ ...prev, title: cleanValue.toUpperCase() }));
                    }}
                    placeholder="Ex: DESENVOLVEDOR REACT SÊNIOR" 
                    className="w-full px-4 py-2.5 bg-white/80 border border-slate-200 rounded-[5px] outline-none focus:bg-white focus:border-[#533af6] focus:ring-4 focus:ring-[#533af6]/5 transition-all text-slate-900 font-medium text-xs" 
                  />
                  <p className="text-[10px] text-slate-400 italic mt-0.5 pl-1 leading-normal">
                    * Dica: evite siglas, abreviações e juntar palavras com "_", "-" e "/". Dê preferência a nomes que estejam de acordo com o cargo esperado.
                  </p>
                </div>

                {/* Cargo */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">
                    Cargo <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={vacancyForm.role}
                    onChange={(e) => setVacancyForm((prev: any) => ({ ...prev, role: e.target.value }))}
                    placeholder="Ex: Vendedor, Programador..." 
                    className="w-full px-4 py-2.5 bg-white/80 border border-slate-200 rounded-[5px] outline-none focus:bg-white focus:border-[#533af6] focus:ring-4 focus:ring-[#533af6]/5 transition-all text-slate-900 font-medium text-xs" 
                  />
                </div>

                {/* Modalidade e Localização */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">
                      Modalidade <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select 
                        value={vacancyForm.modality}
                        onChange={(e) => setVacancyForm((prev: any) => ({ ...prev, modality: e.target.value as any, state: '', city: '' }))}
                        className="w-full px-4 py-2.5 bg-white/80 border border-slate-200 rounded-[5px] outline-none focus:bg-white focus:border-[#533af6] transition-all text-slate-900 font-bold text-xs appearance-none cursor-pointer"
                      >
                        <option value="Presencial">Presencial</option>
                        <option value="Home Office">Home Office</option>
                        <option value="Híbrido">Híbrido</option>
                      </select>
                    </div>
                  </div>

                  {(vacancyForm.modality === 'Presencial' || vacancyForm.modality === 'Híbrido') && (
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">UF <span className="text-rose-500">*</span></label>
                        <div className="relative">
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          <select 
                            className="w-full px-2 py-2.5 bg-white/80 border border-slate-200 rounded-[5px] font-bold text-xs outline-none focus:bg-white focus:border-[#533af6] appearance-none cursor-pointer"
                            value={vacancyForm.state}
                            onChange={(e) => setVacancyForm((prev: any) => ({ ...prev, state: e.target.value, city: '' }))}
                          >
                            <option value="">UF</option>
                            {BRAZIL_STATES.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="col-span-2 flex flex-col gap-1.5">
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">Cidade <span className="text-rose-500">*</span></label>
                        <div className="relative">
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          <select 
                            className="w-full px-3 py-2.5 bg-white/80 border border-slate-200 rounded-[5px] font-bold text-xs outline-none focus:bg-white focus:border-[#533af6] appearance-none disabled:opacity-50 cursor-pointer"
                            value={vacancyForm.city}
                            onChange={(e) => setVacancyForm((prev: any) => ({ ...prev, city: e.target.value }))}
                            disabled={isLoadingCities || !cities.length}
                          >
                            <option value="">{isLoadingCities ? 'Buscando...' : 'Cidade'}</option>
                            {cities.map(city => <option key={city} value={city}>{city}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tipo de Remuneração e Valores */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">
                      Remuneração <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select 
                        value={vacancyForm.remunerationType}
                        onChange={(e) => setVacancyForm((prev: any) => ({ ...prev, remunerationType: e.target.value as any }))}
                        className="w-full px-4 py-2.5 bg-white/80 border border-slate-200 rounded-[5px] outline-none focus:bg-white focus:border-[#533af6] transition-all text-slate-900 font-bold text-xs appearance-none cursor-pointer"
                      >
                        <option value="Fixo">Salário Fixo</option>
                        <option value="Faixa Salarial">Faixa Salarial</option>
                        <option value="A combinar">A combinar</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {vacancyForm.remunerationType === 'Fixo' && (
                      <>
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">
                          Salário Proposto <span className="text-rose-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={vacancyForm.salary}
                          onChange={handleSalaryChange}
                          placeholder="R$ 0,00" 
                          className="w-full px-4 py-2.5 bg-white/80 border border-slate-200 rounded-[5px] outline-none focus:bg-white focus:border-[#533af6] focus:ring-4 focus:ring-[#533af6]/5 transition-all text-slate-900 font-bold text-xs" 
                        />
                      </>
                    )}
                    {vacancyForm.remunerationType === 'Faixa Salarial' && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider pl-1 mb-0.5 block">Mínimo <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            value={vacancyForm.salaryMin}
                            onChange={handleSalaryMinChange}
                            placeholder="R$ 0,00" 
                            className="w-full px-3 py-2 bg-white/80 border border-slate-200 rounded-[5px] outline-none focus:bg-white focus:border-[#533af6] text-slate-900 font-bold text-xs" 
                          />
                        </div>
                        <div>
                          <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider pl-1 mb-0.5 block">Máximo <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            value={vacancyForm.salaryMax}
                            onChange={handleSalaryMaxChange}
                            placeholder="R$ 0,00" 
                            className="w-full px-3 py-2 bg-white/80 border border-slate-200 rounded-[5px] outline-none focus:bg-white focus:border-[#533af6] text-slate-900 font-bold text-xs" 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Comissão/Premiação e Valores */}
                <div className="bg-slate-50/50 p-4 rounded-[5px] border border-slate-100 flex flex-col gap-3 text-left">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={vacancyForm.hasBonus}
                      onChange={(e) => setVacancyForm((prev: any) => ({ ...prev, hasBonus: e.target.checked }))}
                      className="w-4 h-4 rounded border-slate-300 text-[#533af6] focus:ring-[#533af6] cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800 leading-none">Esta vaga possui comissão ou premiação extra?</span>
                    </div>
                  </label>

                  {vacancyForm.hasBonus && (
                    <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 pt-2 border-t border-slate-100">
                      <div className="relative">
                        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <select 
                          value={vacancyForm.bonusType}
                          onChange={(e) => setVacancyForm((prev: any) => ({ ...prev, bonusType: e.target.value }))}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase outline-none focus:border-primary-300 appearance-none pl-3 pr-8 cursor-pointer"
                        >
                          <option value="Comissão">Comissão</option>
                          <option value="Premiação">Premiação</option>
                        </select>
                      </div>
                      <input 
                        type="text" 
                        placeholder="Ex: R$ 500,00 ou 2%"
                        value={vacancyForm.bonusValue}
                        onChange={(e) => setVacancyForm((prev: any) => ({ ...prev, bonusValue: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold outline-none focus:border-[#533af6]"
                      />
                    </div>
                  )}
                </div>

                {/* Tipo de Contrato e Escala */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">
                      Contratação <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select 
                        value={vacancyForm.contractType}
                        onChange={(e) => setVacancyForm((prev: any) => ({ ...prev, contractType: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-white/80 border border-slate-200 rounded-[5px] outline-none focus:bg-white focus:border-[#533af6] transition-all text-slate-900 font-bold text-xs appearance-none cursor-pointer"
                      >
                        <option value="CLT">CLT</option>
                        <option value="PJ">PJ</option>
                        <option value="Estágio">Estágio</option>
                        <option value="Autônomo">Autônomo</option>
                        <option value="Meio Período">Meio Período</option>
                        <option value="Temporário">Temporário</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">
                      Escala <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select 
                        value={vacancyForm.workSchedule}
                        onChange={(e) => setVacancyForm((prev: any) => ({ ...prev, workSchedule: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-white/80 border border-slate-200 rounded-[5px] outline-none focus:bg-white focus:border-[#533af6] transition-all text-slate-900 font-bold text-xs appearance-none cursor-pointer"
                      >
                        <option value="5x2">5x2 (Seg. a Sex.)</option>
                        <option value="6x1">6x1 (6 dias de trabalho e 1 folga)</option>
                        <option value="12x36">12x36 (12h trabalho por 36h folga)</option>
                        <option value="Outra">Outras escalas</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* Benefícios */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">Benefícios Oferecidos</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'vt', label: 'VT', hasValue: true },
                      { id: 'va', label: 'VA/VR', hasValue: true },
                      { id: 'healthInsurance', label: 'Saúde', hasValue: false },
                      { id: 'dentalPlan', label: 'Dental', hasValue: false },
                    ].map((ben) => {
                      const isSelected = ben.hasValue 
                        ? (vacancyForm.benefits as any)[ben.id].selected 
                        : (vacancyForm.benefits as any)[ben.id];

                      return (
                        <div key={ben.id} className="bg-slate-50/50 p-2.5 rounded-[5px] border border-slate-100/50 flex flex-col gap-2">
                          <button 
                            type="button"
                            onClick={() => {
                              if (ben.hasValue) {
                                setVacancyForm((prev: any) => ({
                                  ...prev, 
                                  benefits: { ...prev.benefits, [ben.id]: { ...prev.benefits[ben.id], selected: !prev.benefits[ben.id].selected } }
                                }));
                              } else {
                                setVacancyForm((prev: any) => ({
                                  ...prev, 
                                  benefits: { ...prev.benefits, [ben.id]: !prev.benefits[ben.id] }
                                }));
                              }
                            }}
                            className={`w-full py-1.5 px-2 rounded-[5px] border font-bold text-[9px] uppercase tracking-wider transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#533af6]/10 border-[#533af6]/20 text-[#533af6]' 
                                : 'bg-white border-slate-250 text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            {ben.label}
                          </button>
                          {ben.hasValue && isSelected && (
                            <input 
                              type="text" 
                              placeholder="Valor do benefício"
                              value={(vacancyForm.benefits as any)[ben.id].value}
                              onChange={(e) => setVacancyForm((prev: any) => ({
                                ...prev, 
                                benefits: { ...prev.benefits, [ben.id]: { ...prev.benefits[ben.id], value: e.target.value } }
                              }))}
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-[9px] font-bold outline-none focus:border-[#533af6]"
                            />
                          )}
                          {!ben.hasValue && isSelected && ben.id === 'healthInsurance' && (
                            <div className="flex flex-col gap-1 pt-1 border-t border-slate-100 animate-in fade-in slide-in-from-top-1">
                              <label className="flex items-center gap-1.5 cursor-pointer text-[8px] font-bold text-slate-500 select-none">
                                <input 
                                  type="checkbox"
                                  checked={vacancyForm.benefits.healthInsuranceCopay}
                                  onChange={(e) => setVacancyForm((prev: any) => ({ ...prev, benefits: { ...prev.benefits, healthInsuranceCopay: e.target.checked } }))}
                                  className="w-3.5 h-3.5 text-[#533af6] border-slate-350 focus:ring-[#533af6]"
                                />
                                Coparticipativo
                              </label>
                              <label className="flex items-center gap-1.5 cursor-pointer text-[8px] font-bold text-slate-500 select-none">
                                <input 
                                  type="checkbox"
                                  checked={vacancyForm.benefits.healthInsuranceFamily}
                                  onChange={(e) => setVacancyForm((prev: any) => ({ ...prev, benefits: { ...prev.benefits, healthInsuranceFamily: e.target.checked } }))}
                                  className="w-3.5 h-3.5 text-[#533af6] border-slate-350 focus:ring-[#533af6]"
                                />
                                Estendido Familiar
                              </label>
                            </div>
                          )}
                          {!ben.hasValue && isSelected && ben.id === 'dentalPlan' && (
                            <div className="flex flex-col gap-1 pt-1 border-t border-slate-100 animate-in fade-in slide-in-from-top-1">
                              <label className="flex items-center gap-1.5 cursor-pointer text-[8px] font-bold text-slate-500 select-none">
                                <input 
                                  type="checkbox"
                                  checked={vacancyForm.benefits.dentalPlanFamily}
                                  onChange={(e) => setVacancyForm((prev: any) => ({ ...prev, benefits: { ...prev.benefits, dentalPlanFamily: e.target.checked } }))}
                                  className="w-3.5 h-3.5 text-[#533af6] border-slate-350 focus:ring-[#533af6]"
                                />
                                Estendido Familiar
                              </label>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Benefícios Extra Customizados */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {vacancyForm.extraBenefits.map((extra, idx) => (
                      <div key={idx} className="relative group/btn">
                        <span className="inline-block py-1 px-2.5 rounded-full border border-[#533af6]/30 bg-[#533af6]/5 font-bold text-[9px] uppercase text-[#533af6]">
                          {extra}
                        </span>
                        <button 
                          type="button"
                          onClick={() => setVacancyForm((prev: any) => ({ ...prev, extraBenefits: prev.extraBenefits.filter((_: any, i: number) => i !== idx) }))}
                          className="absolute -top-1.5 -right-1 w-4 h-4 bg-red-500 hover:bg-red-650 text-white rounded-full flex items-center justify-center opacity-0 group-hover/btn:opacity-100 transition-opacity shadow-sm cursor-pointer"
                        >
                          <CloseIconComponent size={10} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-1.5 mt-1.5">
                    <input 
                      type="text" 
                      placeholder="Outro benefício (ex: Gympass)..."
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-1.5 bg-white border border-dashed border-slate-200 rounded-[5px] text-[9.5px] font-semibold outline-none focus:border-[#533af6] placeholder:normal-case"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newBenefit.trim()) {
                            setVacancyForm((prev: any) => ({ ...prev, extraBenefits: [...prev.extraBenefits, newBenefit.trim()] }));
                            setNewBenefit('');
                          }
                        }
                      }}
                    />
                    {newBenefit && (
                      <button 
                        type="button"
                        onClick={() => {
                          setVacancyForm((prev: any) => ({ ...prev, extraBenefits: [...prev.extraBenefits, newBenefit.trim()] }));
                          setNewBenefit('');
                        }}
                        className="px-2.5 bg-[#533af6] text-white rounded-[5px] flex items-center justify-center"
                      >
                        <Plus size={10} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {registerStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                {/* Quantidade de Posições */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">
                    Vagas Disponíveis (Posições) <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    min="1"
                    value={vacancyForm.positions}
                    onChange={(e) => setVacancyForm((prev: any) => ({ ...prev, positions: e.target.value }))}
                    placeholder="Ex: 2" 
                    className="w-full px-4 py-2.5 bg-white/80 border border-slate-200 rounded-[5px] outline-none focus:bg-white focus:border-[#533af6] transition-all text-slate-900 font-bold text-xs" 
                  />
                  <p className="text-[10px] text-slate-400 italic mt-0.5 pl-1 leading-normal">
                    Informe a quantidade total de contratações pretendidas para esta oportunidade.
                  </p>
                </div>

                {/* Motivo da Abertura */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">
                    Motivo da Requisição <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <select 
                      value={vacancyForm.requestReason}
                      onChange={(e) => setVacancyForm((prev: any) => ({ ...prev, requestReason: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-white/80 border border-slate-200 rounded-[5px] outline-none focus:bg-white focus:border-[#533af6] transition-all text-slate-900 font-bold text-xs appearance-none cursor-pointer"
                    >
                      <option value="">Selecione o motivo</option>
                      <option value="Aumento de Quadro">Aumento de Quadro (Nova Posição)</option>
                      <option value="Substituição">Substituição (Reposição de Funcionário)</option>
                      <option value="Projeto Temporário">Projeto Temporário</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                </div>

                {/* Critérios e Acessibilidade (Primeiro Emprego, PCD, Idade Mínima) */}
                <div className="bg-slate-50/50 p-4 rounded-[5px] border border-slate-100 flex flex-col gap-4 text-left animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Primeiro Emprego */}
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={vacancyForm.isFirstJob}
                        onChange={(e) => setVacancyForm((prev: any) => ({ ...prev, isFirstJob: e.target.checked }))}
                        className="w-4 h-4 rounded border-slate-300 text-[#533af6] focus:ring-[#533af6] cursor-pointer"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">Aceita 1º Emprego?</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Ideal para iniciantes no mercado</span>
                      </div>
                    </label>

                    {/* Vaga PcD */}
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={vacancyForm.isPcd}
                        onChange={(e) => setVacancyForm((prev: any) => ({ ...prev, isPcd: e.target.checked }))}
                        className="w-4 h-4 rounded border-slate-300 text-[#533af6] focus:ring-[#533af6] cursor-pointer"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">Vaga também para PcD?</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Acessível para PCDs</span>
                      </div>
                    </label>
                  </div>

                  {/* Detalhes PcD (se ativo) */}
                  {vacancyForm.isPcd && (
                    <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-1">
                        Detalhes sobre a PcD (Opcional)
                      </label>
                      <input 
                        type="text" 
                        value={vacancyForm.pcdDetails}
                        onChange={(e) => setVacancyForm((prev: any) => ({ ...prev, pcdDetails: e.target.value }))}
                        placeholder="Ex: Acessibilidade física, auditiva, visual leve, etc." 
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-[5px] outline-none focus:border-[#533af6] text-xs font-medium text-slate-950" 
                      />
                    </div>
                  )}

                  {/* Idade Mínima */}
                  <div className="flex flex-col gap-1 pt-2 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-0.5">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Idade Mínima</label>
                      <span className="text-[10px] font-black text-[#533af6]">{vacancyForm.minAge} anos</span>
                    </div>
                    <input 
                      type="range" 
                      min="16" 
                      max="50" 
                      value={vacancyForm.minAge}
                      onChange={(e) => setVacancyForm((prev: any) => ({ ...prev, minAge: parseInt(e.target.value) }))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#533af6]"
                    />
                  </div>
                </div>

                {/* Requisitos */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">Requisitos da Vaga</label>
                  
                  {/* Requisitos rápidos recomendados */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {commonRequirements.map(req => {
                      const isSelected = vacancyForm.requirements.includes(req);
                      return (
                        <button
                          key={req}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setVacancyForm((prev: any) => ({ ...prev, requirements: prev.requirements.filter((r: string) => r !== req) }));
                            } else {
                              setVacancyForm((prev: any) => ({ ...prev, requirements: [...prev.requirements, req] }));
                            }
                          }}
                          className={`px-2.5 py-1.5 rounded-[5px] text-[8.5px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-[#533af6] text-white' 
                              : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-150'
                          }`}
                        >
                          {req}
                        </button>
                      );
                    })}
                  </div>

                  {/* Adicionar requisito customizado */}
                  <div className="flex gap-1.5">
                    <input 
                      type="text" 
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      placeholder="Outro requisito (ex: Certificação Scrum Master)..." 
                      className="flex-1 px-3 py-2 bg-white border border-dashed border-slate-200 rounded-[5px] text-xs font-semibold outline-none focus:border-[#533af6]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newRequirement.trim()) {
                            setVacancyForm((prev: any) => ({ ...prev, requirements: [...prev.requirements, newRequirement.trim()] }));
                            setNewRequirement('');
                          }
                        }
                      }}
                    />
                    {newRequirement && (
                      <button 
                        type="button"
                        onClick={() => {
                          setVacancyForm((prev: any) => ({ ...prev, requirements: [...prev.requirements, newRequirement.trim()] }));
                          setNewRequirement('');
                        }}
                        className="px-3 bg-[#533af6] text-white rounded-[5px] flex items-center justify-center cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                    )}
                  </div>

                  {/* Requisitos ativos e possibilidade de exclusão */}
                  {vacancyForm.requirements.length > 0 && (
                    <div className="bg-slate-50/50 p-3 rounded-[5px] border border-dashed border-slate-200 mt-2">
                      <div className="flex flex-wrap gap-1.5">
                        {vacancyForm.requirements.map((r, i) => (
                          <div key={i} className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-[4px] border border-slate-150 text-[9px] font-bold text-slate-600">
                            <span>{r}</span>
                            <button 
                              type="button"
                              onClick={() => setVacancyForm((prev: any) => ({ ...prev, requirements: prev.requirements.filter((_: any, idx: number) => idx !== i) }))}
                              className="text-red-400 hover:text-red-600 cursor-pointer"
                            >
                              <Trash2 size={11} />
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
                initial={{ opacity: 0, x: 10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                {/* Descrição do cargo */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">
                    Descrição da Vaga <span className="text-rose-500">*</span>
                  </label>
                  <textarea 
                    rows={6} 
                    value={vacancyForm.description}
                    onChange={(e) => setVacancyForm((prev: any) => ({ ...prev, description: e.target.value }))}
                    placeholder="Escreva sobre a vaga, cultura da empresa e a equipe..." 
                    className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-[5px] outline-none focus:bg-white focus:border-[#533af6] transition-all font-medium text-slate-700 text-xs italic leading-relaxed" 
                  />
                  <p className="text-[10px] text-slate-400 italic pl-1 leading-normal">
                    Descreva sobre a vaga e aproveite para falar sobre a empresa, sua cultura e equipe. *
                  </p>
                </div>

                {/* Descrição de Atribuições */}
                <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-3 text-left">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">
                    Descrição de Atribuições <span className="text-rose-500">*</span>
                  </label>
                  <textarea 
                    rows={6} 
                    value={vacancyForm.responsibilities}
                    onChange={(e) => setVacancyForm((prev: any) => ({ ...prev, responsibilities: e.target.value }))}
                    placeholder="Descreva as responsabilidades, atribuições e experiências desejáveis..." 
                    className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-[5px] outline-none focus:bg-white focus:border-[#533af6] transition-all font-medium text-slate-700 text-xs italic leading-relaxed" 
                  />
                  <p className="text-[10px] text-slate-400 italic pl-1 leading-normal">
                    Descreva as responsabilidades e atribuições. Cite também as experiências que se espera ou deseja que a pessoa possua.
                  </p>
                </div>
              </motion.div>
            )}

            {registerStep === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {/* Funil de Etapas */}
                <div className="flex flex-col gap-2 text-left">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">
                    Etapas do Funil de Seleção
                  </label>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {vacancyForm.stages.map((stage, index) => {
                      const isAnalise = stage === 'Análise de Currículo';
                      return (
                        <div key={index} className="group flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-[5px] border border-slate-100 hover:border-[#533af6]/30 transition-all">
                          <div className="w-6 h-6 bg-white rounded-[5px] shadow-sm flex items-center justify-center font-black text-[#533af6] text-xs">
                            {index + 1}
                          </div>
                          <span className="text-xs font-bold text-slate-700">{stage}</span>
                          {!isAnalise ? (
                            <button 
                              type="button"
                              onClick={() => setVacancyForm((prev: any) => ({ ...prev, stages: prev.stages.filter((_: any, i: number) => i !== index) }))}
                              className="ml-auto p-1 text-slate-400 hover:text-red-500 transition-all cursor-pointer"
                              title="Remover etapa"
                            >
                              <Trash2 size={14} />
                            </button>
                          ) : (
                            <span className="ml-auto text-[7.5px] font-black uppercase text-[#533af6]/60 bg-[#533af6]/10 rounded-full px-2.5 py-0.5 select-none">
                              Obrigatória
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-2 mt-2">
                    <input 
                      type="text" 
                      value={newStage}
                      onChange={(e) => setNewStage(e.target.value)}
                      placeholder="Ex: Dinâmica em Grupo..." 
                      className="flex-1 px-4 py-2 bg-white border border-dashed border-slate-200 rounded-[5px] font-medium text-xs outline-none focus:border-[#533af6] focus:border-solid transition-all"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newStage.trim()) {
                            const trimmedStage = newStage.trim();
                            setVacancyForm((prev: any) => ({ ...prev, stages: [...prev.stages, trimmedStage] }));
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
                          setVacancyForm((prev: any) => ({ ...prev, stages: [...prev.stages, trimmedStage] }));
                          setNewStage('');
                        }
                      }}
                      className="px-3 bg-[#533af6] text-white rounded-[5px] flex items-center justify-center cursor-pointer"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 italic pl-1 leading-normal mt-1">
                    * Nota: A etapa inicial "Análise de Currículo" é padrão e obrigatória.
                  </p>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50">
            {errorMessage && (
              <div className="mb-4 text-rose-500 font-extrabold text-[10px] uppercase text-left flex items-center gap-1.5">
                <AlertTriangle size={14} className="stroke-[2.5]" />
                {errorMessage}
              </div>
            )}
            <div className="max-w-lg mx-auto w-full flex justify-between items-center gap-4">
              {registerStep > 1 ? (
                <button 
                  type="button"
                  onClick={() => setRegisterStep(prev => (typeof prev === 'function' ? prev(1) : prev - 1))}
                  className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                >
                  Voltar
                </button>
              ) : (
                <div />
              )}

              {registerStep < 4 ? (
                <button 
                  type="button"
                  onClick={handleNextStep}
                  className="px-8 py-2.5 bg-[#533af6] hover:bg-[#4326e5] text-white rounded-full font-bold text-[10px] uppercase tracking-wider transition-all shadow-md shadow-[#533af6]/10 cursor-pointer"
                >
                  Próximo Passo
                </button>
              ) : (
                <button 
                  type="button"
                  disabled={isPublishing}
                  onClick={handleTriggerPublish}
                  className={`px-8 py-2.5 bg-[#533af6] hover:bg-[#4326e5] text-white rounded-full font-bold text-[10px] uppercase tracking-wider transition-all shadow-md shadow-[#533af6]/10 ${isPublishing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {isPublishing ? 'Publicando...' : 'Publicar Vaga'}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
