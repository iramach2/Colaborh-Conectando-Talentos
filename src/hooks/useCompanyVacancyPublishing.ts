import { type Dispatch, type SetStateAction, useState } from 'react';
import { supabase } from '../lib/supabase';
import { saveJobStages } from '../services/jobWorkflowService';
import type { CompanyJob, CompanyLike } from '../types/companyDashboard';
import { buildJobInsertPayload, type VacancyFormData } from '../utils/vacancyPayload';

type UseCompanyVacancyPublishingParams = {
  selectedCompany: CompanyLike;
  companyJobs: CompanyJob[];
  setJobs: Dispatch<SetStateAction<CompanyJob[]>>;
  setJobSubTab: Dispatch<SetStateAction<'active' | 'paused' | 'closed'>>;
  setActiveTab: (tab: string) => void;
  setIsRegisteringVacancy: Dispatch<SetStateAction<boolean>>;
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return 'Erro desconhecido';
  }
};

export const initialVacancyForm = (): VacancyFormData => ({
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
  bonusType: 'Comissao',
  bonusValue: '',
  contractType: 'CLT',
  benefits: {
    vt: { selected: false, value: '' },
    va: { selected: false, value: '' },
    healthInsurance: false,
    healthInsuranceCopay: false,
    healthInsuranceFamily: false,
    dentalPlan: false,
    dentalPlanFamily: false,
  },
  extraBenefits: [],
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
  requirements: [],
  stages: ['Analise de Curriculo'],
});

const validateVacancyStep = (vacancyForm: VacancyFormData, step: number) => {
  if (step === 1) {
    if (!vacancyForm.title.trim()) return 'O titulo da vaga e obrigatorio.';
    if (!vacancyForm.role.trim()) return 'O cargo e obrigatorio.';
    if (vacancyForm.modality === 'Presencial' || vacancyForm.modality === 'Hibrido') {
      if (!vacancyForm.state) return 'O estado e obrigatorio.';
      if (!vacancyForm.city) return 'A cidade e obrigatoria.';
    }
    if (!vacancyForm.contractType) return 'O tipo de contratacao e obrigatorio.';
    if (!vacancyForm.workSchedule) return 'A escala de trabalho e obrigatoria.';
  }

  if (step === 2) {
    if (vacancyForm.remunerationType === 'Fixo') {
      if (!vacancyForm.salary.trim()) return 'O salario proposto e obrigatorio.';
    } else if (vacancyForm.remunerationType === 'Faixa Salarial') {
      if (!vacancyForm.salaryMin.trim() || !vacancyForm.salaryMax.trim()) {
        return 'Os valores minimo e maximo da faixa salarial sao obrigatorios.';
      }
    }
    if (vacancyForm.hasBonus && !vacancyForm.bonusValue.trim()) {
      return 'Informe o valor da comissao ou premiacao.';
    }
  }

  if (step === 3) {
    if (!vacancyForm.positions || parseInt(vacancyForm.positions, 10) <= 0) {
      return 'A quantidade de posicoes disponiveis deve ser maior que zero.';
    }
    if (!vacancyForm.requestReason) return 'O motivo da requisicao e obrigatorio.';
  }

  if (step === 4) {
    if (!vacancyForm.description.trim()) return 'A descricao da vaga e obrigatoria.';
    if (!vacancyForm.responsibilities.trim()) return 'A descricao de atribuicoes e obrigatoria.';
  }

  if (step === 5) {
    if (vacancyForm.stages.length === 0) return 'A vaga deve ter ao menos uma etapa no processo seletivo.';
  }

  return null;
};

export const useCompanyVacancyPublishing = ({
  selectedCompany,
  companyJobs,
  setJobs,
  setJobSubTab,
  setActiveTab,
  setIsRegisteringVacancy,
}: UseCompanyVacancyPublishingParams) => {
  const [registerStep, setRegisterStep] = useState(1);
  const [vacancyForm, setVacancyForm] = useState<VacancyFormData>(initialVacancyForm);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedJobLink, setPublishedJobLink] = useState<string | null>(null);
  const [hasCopiedPublishedLink, setHasCopiedPublishedLink] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetVacancyForm = () => {
    setRegisterStep(1);
    setVacancyForm(initialVacancyForm());
  };

  const clearPublishedJobLink = () => {
    setPublishedJobLink(null);
    resetVacancyForm();
  };

  const handleNextStep = () => {
    const error = validateVacancyStep(vacancyForm, registerStep);
    if (error) {
      setErrorMessage(error);
      alert(error);
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }
    setRegisterStep((previous) => previous + 1);
  };

  const handlePublish = async () => {
    if (isPublishing) return;

    const activeJobsForCompany = companyJobs.filter((job) => {
      const status = (job.status || '').toLowerCase();
      return status === 'active' || status === 'ativa' || !status;
    }).length;

    const plan = selectedCompany?.plan || 'starter';
    let limit = 2;
    if (plan === 'growth') limit = 8;
    else if (plan === 'enterprise') limit = Infinity;

    if (activeJobsForCompany >= limit) {
      const errorMsg = `Limite de vagas ativas atingido para o plano ${plan.toUpperCase()} (${limit} vaga${limit > 1 ? 's' : ''}). Faca o upgrade na aba Faturamento para publicar mais vagas.`;
      alert(errorMsg);
      setActiveTab('Faturamento');
      return;
    }

    const currentStages = vacancyForm.stages;
    if (currentStages.length === 0) {
      const error = 'A vaga deve ter ao menos uma etapa no processo seletivo.';
      setErrorMessage(error);
      alert(error);
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    if (!import.meta.env.VITE_SUPABASE_URL) {
      alert('Configuracao do Supabase ausente.');
      return;
    }

    try {
      setIsPublishing(true);
      const { detailedDescription, payload } = buildJobInsertPayload(vacancyForm, selectedCompany, currentStages);

      let attempt = 0;
      const maxAttempts = 15;
      let success = false;
      let insertedRow: CompanyJob | null = null;

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
        const isColumnError = saveError.code === 'PGRST204'
          || (saveError.message && saveError.message.toLowerCase().includes('could not find the') && saveError.message.toLowerCase().includes('column'));

        if (isColumnError) {
          const match = saveError.message.match(/Could not find the '([^']+)' column/i);
          const colToDrop = match ? match[1] : null;

          if (colToDrop && colToDrop in payload) {
            console.warn(`[Self-Healing] Removendo coluna inexistente '${colToDrop}' e tentando novamente.`);
            delete (payload as Record<string, unknown>)[colToDrop];
            attempt += 1;
            continue;
          }
        }

        throw saveError;
      }

      if (!success) {
        throw new Error('Falha ao publicar os dados da vaga apos varias tentativas.');
      }

      if (insertedRow?.id) {
        const stagesSynced = await saveJobStages(insertedRow.id, currentStages);
        if (!stagesSynced) {
          await supabase
            .from('jobs')
            .update({
              description: `${detailedDescription}\n\n===ETAPAS_JSON===${JSON.stringify(currentStages)}===FIM_ETAPAS===`.trim(),
            })
            .eq('id', insertedRow.id);
        }
      }

      if (insertedRow?.id) {
        const publishedJob = {
          ...payload,
          ...insertedRow,
          company_id: insertedRow.company_id || payload.company_id,
          company_name: insertedRow.company_name || payload.company_name,
          stages: currentStages,
          candidates_count: 0,
        };

        setJobs((previousJobs) => {
          const withoutDuplicate = previousJobs.filter((job) => job.id !== publishedJob.id);
          return [publishedJob, ...withoutDuplicate];
        });
        setJobSubTab('active');
        setActiveTab('Minhas Vagas');
      }

      const newJobId = insertedRow?.id || Date.now().toString();
      const shareUrl = `${window.location.origin}?vaga=${newJobId}`;
      setPublishedJobLink(shareUrl);
      setHasCopiedPublishedLink(false);
      setIsRegisteringVacancy(false);
    } catch (err: unknown) {
      console.error('Erro ao salvar vaga:', err);
      alert(`Erro ao publicar vaga: ${getErrorMessage(err)}`);
    } finally {
      setIsPublishing(false);
    }
  };

  return {
    registerStep,
    setRegisterStep,
    vacancyForm,
    setVacancyForm,
    isPublishing,
    publishedJobLink,
    setPublishedJobLink,
    hasCopiedPublishedLink,
    setHasCopiedPublishedLink,
    errorMessage,
    handleNextStep,
    handlePublish,
    resetVacancyForm,
    clearPublishedJobLink,
  };
};
