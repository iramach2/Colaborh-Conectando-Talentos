import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, Check, ChevronLeft, X as CloseIconComponent } from 'lucide-react';
import { DF_REGIONS } from '../../../utils/companyDashboardUtils';
import type { VacancyFormData } from '../../../utils/vacancyPayload';
import { CreateVacancyStepBasics } from '../createVacancy/CreateVacancyStepBasics';
import { CreateVacancyStepCompensation } from '../createVacancy/CreateVacancyStepCompensation';
import { CreateVacancyStepRequirements } from '../createVacancy/CreateVacancyStepRequirements';
import { CreateVacancyStepDescription } from '../createVacancy/CreateVacancyStepDescription';
import { CreateVacancyStepStages } from '../createVacancy/CreateVacancyStepStages';
import { CreateVacancyStepReview } from '../createVacancy/CreateVacancyStepReview';

interface CreateVacancyTabProps {
  isOpen: boolean;
  onClose: () => void;
  registerStep: number;
  setRegisterStep: (step: number | ((prev: number) => number)) => void;
  vacancyForm: VacancyFormData;
  setVacancyForm: React.Dispatch<React.SetStateAction<VacancyFormData>>;
  errorMessage: string | null;
  handleNextStep: () => void;
  handlePublish: () => void;
  isPublishing?: boolean;
  presentation?: 'drawer' | 'page';
}

type IbgeCity = {
  nome: string;
};

const TOTAL_STEPS = 6;

const steps = [
  { id: 1, title: 'Identificação', description: 'Cargo, local e formato' },
  { id: 2, title: 'Remuneração', description: 'Salário e benefícios' },
  { id: 3, title: 'Requisitos', description: 'Perfil e critérios' },
  { id: 4, title: 'Descrição', description: 'Texto da oportunidade' },
  { id: 5, title: 'Etapas', description: 'Processo seletivo' },
  { id: 6, title: 'Revisão', description: 'Conferência final' },
];

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
  isPublishing = false,
  presentation = 'drawer',
}) => {
  const [newBenefit, setNewBenefit] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newStage, setNewStage] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const isDrawer = presentation === 'drawer';

  useEffect(() => {
    if (vacancyForm.state && (vacancyForm.modality === 'Presencial' || vacancyForm.modality === 'Hibrido')) {
      if (vacancyForm.state === 'DF') {
        setCities(DF_REGIONS);
        setIsLoadingCities(false);
        return;
      }

      setIsLoadingCities(true);
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${vacancyForm.state}/municipios`)
        .then((res) => res.json())
        .then((data: IbgeCity[]) => {
          setCities(data.map((city) => city.nome).sort());
          setIsLoadingCities(false);
        })
        .catch((err) => {
          console.error('Error fetching cities:', err);
          setIsLoadingCities(false);
        });
    } else {
      setCities([]);
    }
  }, [vacancyForm.state, vacancyForm.modality]);

  const formatCurrency = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    const numericValue = parseInt(cleanValue) / 100;
    if (isNaN(numericValue)) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numericValue);
  };

  const handleSalaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(event.target.value);
    setVacancyForm((prev) => ({ ...prev, salary: formatted }));
  };

  const handleSalaryMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(event.target.value);
    setVacancyForm((prev) => ({ ...prev, salaryMin: formatted }));
  };

  const handleSalaryMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(event.target.value);
    setVacancyForm((prev) => ({ ...prev, salaryMax: formatted }));
  };

  const handleTriggerPublish = () => {
    if (isPublishing) return;
    let currentStages = vacancyForm.stages;
    if (newStage.trim()) {
      const trimmedStage = newStage.trim();
      currentStages = [...currentStages, trimmedStage];
      setVacancyForm((prev) => ({ ...prev, stages: currentStages }));
      setNewStage('');
    }
    handlePublish();
  };

  if (!isOpen) return null;

  const stepContent = (
    <AnimatePresence mode="wait">
      {registerStep === 1 && (
        <CreateVacancyStepBasics
          vacancyForm={vacancyForm}
          setVacancyForm={setVacancyForm}
          cities={cities}
          isLoadingCities={isLoadingCities}
        />
      )}

      {registerStep === 2 && (
        <CreateVacancyStepCompensation
          vacancyForm={vacancyForm}
          setVacancyForm={setVacancyForm}
          newBenefit={newBenefit}
          setNewBenefit={setNewBenefit}
          onSalaryChange={handleSalaryChange}
          onSalaryMinChange={handleSalaryMinChange}
          onSalaryMaxChange={handleSalaryMaxChange}
        />
      )}

      {registerStep === 3 && (
        <CreateVacancyStepRequirements
          vacancyForm={vacancyForm}
          setVacancyForm={setVacancyForm}
          newRequirement={newRequirement}
          setNewRequirement={setNewRequirement}
        />
      )}

      {registerStep === 4 && (
        <CreateVacancyStepDescription
          vacancyForm={vacancyForm}
          setVacancyForm={setVacancyForm}
        />
      )}

      {registerStep === 5 && (
        <CreateVacancyStepStages
          vacancyForm={vacancyForm}
          setVacancyForm={setVacancyForm}
          newStage={newStage}
          setNewStage={setNewStage}
        />
      )}

      {registerStep === 6 && (
        <CreateVacancyStepReview vacancyForm={vacancyForm} />
      )}
    </AnimatePresence>
  );

  const panel = (
    <motion.div
      key="cadastrar-vaga"
      initial={isDrawer ? { x: '100%' } : { opacity: 0, y: 16 }}
      animate={isDrawer ? { x: 0 } : { opacity: 1, y: 0 }}
      exit={isDrawer ? { x: '100%' } : { opacity: 0, y: -16 }}
      transition={{ type: 'tween', duration: 0.28, ease: 'easeOut' }}
      className={
        isDrawer
          ? 'company-dashboard-surface relative z-10 flex h-full w-full max-w-[760px] flex-col overflow-hidden rounded-l-[28px] border-l border-white/70 bg-[#fbf9ff] shadow-[0_24px_80px_rgba(25,18,45,0.18)]'
          : 'company-dashboard-surface flex w-full flex-col overflow-visible bg-transparent'
      }
    >
      <header className={`${isDrawer ? 'px-7 pb-4 pt-7 sm:px-8' : 'px-0 pb-5 pt-1'} relative`}>
        <div className="flex items-start justify-between gap-5">
          <div>
            {isDrawer && <p className="text-[12px] font-semibold text-[#940dff]">Cadastrar vaga</p>}
            <h2 className="mt-1 text-[20px] font-semibold tracking-tight text-[#343241]">{steps[registerStep - 1]?.title || 'Cadastrar vaga'}</h2>
            <p className="mt-1 text-[12px] font-medium text-slate-400">{steps[registerStep - 1]?.description || 'Preencha os dados da oportunidade.'}</p>
          </div>

          {isDrawer && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-xl border border-white/80 bg-white text-slate-400 shadow-sm transition-all hover:bg-[#f3e5ff] hover:text-[#940dff] active:scale-95"
              title="Fechar"
            >
              <CloseIconComponent size={16} />
            </button>
          )}
        </div>

        <div className="mt-5 -mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {steps.map((step) => {
            const isActive = registerStep === step.id;
            const isDone = registerStep > step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => isDone && setRegisterStep(step.id)}
                disabled={!isDone && !isActive}
                className={`flex h-[38px] min-w-[132px] shrink-0 items-center justify-center gap-2 rounded-xl border px-3 text-[12px] font-semibold transition-all sm:shrink ${
                  isActive
                    ? 'border-[#940dff]/18 bg-[#f3e5ff] text-[#940dff]'
                    : isDone
                      ? 'border-white/70 bg-white text-slate-500 hover:text-[#940dff]'
                      : 'border-white/60 bg-white/60 text-slate-300'
                }`}
              >
                <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold ${isActive ? 'bg-white/80 text-[#940dff]' : isDone ? 'bg-[#63e1a5]/14 text-[#2f9f6b]' : 'bg-white/70 text-slate-300'}`}>
                  {isDone ? <Check size={11} /> : step.id}
                </span>
                {step.title}
              </button>
            );
          })}
        </div>
      </header>

      <div className={`${isDrawer ? 'flex-1 overflow-y-auto px-7 py-5 sm:px-8' : 'px-0 pb-7'} no-scrollbar`}>
        {stepContent}
      </div>

      <footer className={`${isDrawer ? 'border-t border-slate-200/60 bg-[#fbf9ff] px-7 py-5 sm:px-8' : 'px-0 pb-7'}`}>
        {errorMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-[#ff4b8c]/15 bg-[#ff4b8c]/10 px-4 py-3 text-left text-[12px] font-semibold text-[#ff4b8c]">
            <AlertTriangle size={14} className="stroke-[2.5]" />
            {errorMessage}
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          {registerStep > 1 ? (
            <button
              type="button"
              onClick={() => setRegisterStep((prev) => prev - 1)}
              className="flex h-8 items-center justify-center gap-2 rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12 active:scale-95"
            >
              <ChevronLeft size={14} /> Voltar
            </button>
          ) : <div />}

          {registerStep < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="h-8 rounded-xl bg-[#940dff] px-5 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95"
            >
              Próximo passo
            </button>
          ) : (
            <button
              type="button"
              disabled={isPublishing}
              onClick={handleTriggerPublish}
              className="h-8 rounded-xl bg-[#940dff] px-5 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPublishing ? 'Publicando...' : 'Publicar vaga'}
            </button>
          )}
        </div>
      </footer>
    </motion.div>
  );

  if (!isDrawer) return panel;

  return (
    <div className="fixed inset-0 z-[2147483647] flex justify-end overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm"
      />
      {panel}
    </div>
  );
};
