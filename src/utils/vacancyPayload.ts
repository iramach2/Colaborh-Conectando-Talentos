import type { CompanyJob } from '../types/companyDashboard';

export type VacancyBenefits = {
  vt: { selected: boolean; value: string };
  va: { selected: boolean; value: string };
  healthInsurance: boolean;
  healthInsuranceCopay: boolean;
  healthInsuranceFamily: boolean;
  dentalPlan: boolean;
  dentalPlanFamily: boolean;
};

export type VacancyFormData = {
  title: string;
  role: string;
  modality: string;
  state: string;
  city: string;
  remunerationType: string;
  salary: string;
  salaryMin: string;
  salaryMax: string;
  hasBonus: boolean;
  bonusType: string;
  bonusValue: string;
  contractType: string;
  description: string;
  responsibilities: string;
  requirements: string[];
  stages: string[];
  workSchedule: string;
  minAge: number;
  isFirstJob: boolean;
  isPcd: boolean;
  pcdDetails: string;
  positions: string;
  requestReason: string;
  isUrgent: boolean;
  benefits: VacancyBenefits;
  extraBenefits: string[];
};

type CompanyLike = {
  id?: string;
  nomeFantasia?: string;
};

const buildBenefitsText = (vacancyForm: VacancyFormData) => {
  const benefitTextList: string[] = [];

  if (vacancyForm.benefits.vt.selected) {
    benefitTextList.push(`Vale Transporte: ${vacancyForm.benefits.vt.value || 'Sim'}`);
  }
  if (vacancyForm.benefits.va.selected) {
    benefitTextList.push(`Vale Alimentacao/Refeicao: ${vacancyForm.benefits.va.value || 'Sim'}`);
  }
  if (vacancyForm.benefits.healthInsurance) {
    let healthDetails = 'Plano de Saude';
    const subOptions = [];
    if (vacancyForm.benefits.healthInsuranceCopay) subOptions.push('com coparticipacao');
    if (vacancyForm.benefits.healthInsuranceFamily) subOptions.push('estendido para familiar');
    if (subOptions.length > 0) {
      healthDetails += ` (${subOptions.join(', ')})`;
    }
    benefitTextList.push(healthDetails);
  }
  if (vacancyForm.benefits.dentalPlan) {
    let dentalDetails = 'Plano Odontologico';
    if (vacancyForm.benefits.dentalPlanFamily) {
      dentalDetails += ' (estendido para familiar)';
    }
    benefitTextList.push(dentalDetails);
  }
  if (vacancyForm.extraBenefits && vacancyForm.extraBenefits.length > 0) {
    vacancyForm.extraBenefits.forEach((benefit) => benefitTextList.push(benefit));
  }

  return benefitTextList;
};

const emptyBenefits = (): VacancyBenefits => ({
  vt: { selected: false, value: '' },
  va: { selected: false, value: '' },
  healthInsurance: false,
  healthInsuranceCopay: false,
  healthInsuranceFamily: false,
  dentalPlan: false,
  dentalPlanFamily: false,
});

const asRecord = (value: unknown): Record<string, unknown> => (
  value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
);

const readBenefitSelection = (value: unknown) => {
  const record = asRecord(value);
  return {
    selected: Boolean(record.selected),
    value: typeof record.value === 'string' ? record.value : '',
  };
};

const normalizeBenefits = (value: unknown): VacancyBenefits => {
  const record = asRecord(value);
  return {
    ...emptyBenefits(),
    vt: readBenefitSelection(record.vt),
    va: readBenefitSelection(record.va),
    healthInsurance: Boolean(record.healthInsurance),
    healthInsuranceCopay: Boolean(record.healthInsuranceCopay),
    healthInsuranceFamily: Boolean(record.healthInsuranceFamily),
    dentalPlan: Boolean(record.dentalPlan),
    dentalPlanFamily: Boolean(record.dentalPlanFamily),
  };
};

const parseStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string');
  if (typeof value !== 'string' || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
};

const parseStoredStages = (job: CompanyJob): string[] => {
  const stages = parseStringArray(job.stages);
  if (stages.length > 0) return stages;

  const match = (job.description || '').match(/===ETAPAS_JSON===([\s\S]*?)===FIM_ETAPAS===/);
  if (match?.[1]) {
    const legacyStages = parseStringArray(match[1]);
    if (legacyStages.length > 0) return legacyStages;
  }
  return ['Analise de Curriculo'];
};

const removeStoredMetadata = (description: string) => {
  let cleaned = description
    .replace(/\n*===ETAPAS_JSON===[\s\S]*?===FIM_ETAPAS===/g, '')
    .replace(/\n*===STAGE_TESTS_JSON===[\s\S]*?===FIM_STAGE_TESTS===/g, '')
    .replace(/\n*===CUSTOM_QUESTIONS_JSON===[\s\S]*?===FIM_CUSTOM_QUESTIONS===/g, '')
    .trim();

  const blocks = cleaned.split(/\n\s*\n/);
  const metadataPrefixes = [
    'Cargo:',
    'Modalidade:',
    'Localizacao:',
    'Localização:',
    'Remuneracao:',
    'Remuneração:',
    'Extra:',
    'Contratacao:',
    'Contratação:',
    'Escala:',
    'Idade Minima:',
    'Idade Mínima:',
    'Oportunidade para 1o Emprego:',
    'Vaga para PcD:',
    'Posicoes Disponiveis:',
    'Posições Disponíveis:',
    'Motivo da Requisicao:',
    'Motivo da Requisição:',
    'Contratacao de Urgencia:',
    'Contratação de Urgência:',
  ];
  const firstBlockLines = (blocks[0] || '').split('\n').map((line) => line.trim()).filter(Boolean);
  if (firstBlockLines.length > 0 && firstBlockLines.every((line) => metadataPrefixes.some((prefix) => line.startsWith(prefix)))) {
    blocks.shift();
    cleaned = blocks.join('\n\n').trim();
  }

  const generatedSection = /\n\s*\n(?:Responsabilidades e Atribui(?:coes|ções)|Benef(?:icios|ícios)):\s*\n/i;
  const generatedSectionIndex = cleaned.search(generatedSection);
  return (generatedSectionIndex >= 0 ? cleaned.slice(0, generatedSectionIndex) : cleaned).trim();
};

const extractLegacyExtraBenefits = (description: string) => {
  const benefitMatch = description.match(/Benef(?:icios|ícios):\s*\n([\s\S]*?)(?:\n\s*\n|$)/i);
  if (!benefitMatch?.[1]) return [];

  const knownPrefixes = ['Vale Transporte:', 'Vale Alimentacao/Refeicao:', 'Plano de Saude', 'Plano Odontologico'];
  return benefitMatch[1]
    .split('\n')
    .map((item) => item.replace(/^\s*-\s*/, '').trim())
    .filter((item) => item && !knownPrefixes.some((prefix) => item.startsWith(prefix)));
};

export const buildVacancyFormFromJob = (job: CompanyJob): VacancyFormData => {
  const benefitsRecord = asRecord(job.benefits);
  const remunerationType = job.remuneration_type || (
    job.salary_min || job.salary_max ? 'Faixa Salarial' : job.salary === 'A Combinar' ? 'A Combinar' : 'Fixo'
  );

  return {
    title: job.title || '',
    role: job.role || '',
    modality: job.modality || 'Presencial',
    state: job.state || '',
    city: job.city || '',
    remunerationType,
    salary: remunerationType === 'Fixo' ? job.salary || '' : '',
    salaryMin: job.salary_min || '',
    salaryMax: job.salary_max || '',
    hasBonus: Boolean(job.has_bonus),
    bonusType: job.bonus_type || 'Comissao',
    bonusValue: job.bonus_value || '',
    contractType: job.contract_type || 'CLT',
    benefits: normalizeBenefits(job.benefits),
    extraBenefits: parseStringArray(benefitsRecord.extraBenefits).length > 0
      ? parseStringArray(benefitsRecord.extraBenefits)
      : extractLegacyExtraBenefits(job.description || ''),
    workSchedule: job.work_schedule || '5x2',
    isFirstJob: Boolean(job.is_first_job),
    isPcd: Boolean(job.is_pcd),
    pcdDetails: job.pcd_details || '',
    minAge: Number(job.min_age ?? job.minAge ?? 18) || 18,
    positions: String(job.positions || 1),
    requestReason: job.request_reason || 'Aumento de quadro',
    isUrgent: Boolean(job.is_urgent),
    description: removeStoredMetadata(job.description || ''),
    responsibilities: job.responsibilities || '',
    requirements: parseStringArray(job.requirements),
    stages: parseStoredStages(job),
  };
};

export const buildDetailedJobDescription = (vacancyForm: VacancyFormData) => {
  let finalDescription = vacancyForm.description;
  if (vacancyForm.responsibilities.trim()) {
    finalDescription += `\n\nResponsabilidades e Atribuicoes:\n${vacancyForm.responsibilities}`;
  }

  const benefitTextList = buildBenefitsText(vacancyForm);
  if (benefitTextList.length > 0) {
    finalDescription += `\n\nBeneficios:\n${benefitTextList.map((benefit) => `- ${benefit}`).join('\n')}`;
  }

  const metaDetails: string[] = [];
  if (vacancyForm.role) {
    metaDetails.push(`Cargo: ${vacancyForm.role}`);
  }
  if (vacancyForm.modality) {
    metaDetails.push(`Modalidade: ${vacancyForm.modality}`);
  }
  if (vacancyForm.city || vacancyForm.state) {
    metaDetails.push(`Localizacao: ${vacancyForm.city || ''}${vacancyForm.city && vacancyForm.state ? ' - ' : ''}${vacancyForm.state || ''}`);
  }
  if (vacancyForm.remunerationType) {
    let remuneration = `Remuneracao: ${vacancyForm.remunerationType}`;
    if (vacancyForm.remunerationType === 'Fixo' && vacancyForm.salary) {
      remuneration += ` (${vacancyForm.salary})`;
    } else if (vacancyForm.remunerationType === 'Faixa Salarial' && (vacancyForm.salaryMin || vacancyForm.salaryMax)) {
      remuneration += ` (${vacancyForm.salaryMin || 'R$ 0,00'} a ${vacancyForm.salaryMax || 'R$ 0,00'})`;
    }
    metaDetails.push(remuneration);
  }
  if (vacancyForm.hasBonus) {
    metaDetails.push(`Extra: ${vacancyForm.bonusType} (${vacancyForm.bonusValue || 'A combinar'})`);
  }
  if (vacancyForm.contractType) {
    metaDetails.push(`Contratacao: ${vacancyForm.contractType}`);
  }
  if (vacancyForm.workSchedule) {
    metaDetails.push(`Escala: ${vacancyForm.workSchedule}`);
  }
  if (vacancyForm.minAge) {
    metaDetails.push(`Idade Minima: ${vacancyForm.minAge} anos`);
  }
  if (vacancyForm.isFirstJob) {
    metaDetails.push('Oportunidade para 1o Emprego: Sim');
  }
  if (vacancyForm.isPcd) {
    metaDetails.push(`Vaga para PcD: Sim${vacancyForm.pcdDetails ? ` (${vacancyForm.pcdDetails})` : ''}`);
  }
  if (vacancyForm.positions) {
    metaDetails.push(`Posicoes Disponiveis: ${vacancyForm.positions}`);
  }
  if (vacancyForm.requestReason) {
    metaDetails.push(`Motivo da Requisicao: ${vacancyForm.requestReason}`);
  }
  if (vacancyForm.isUrgent) {
    metaDetails.push('Contratacao de Urgencia: Sim');
  }

  return metaDetails.length > 0
    ? `${metaDetails.join('\n')}\n\n${finalDescription}`
    : finalDescription;
};

export const buildJobInsertPayload = (
  vacancyForm: VacancyFormData,
  selectedCompany: CompanyLike,
  currentStages: string[],
) => {
  const detailedDescription = buildDetailedJobDescription(vacancyForm);

  return {
    detailedDescription,
    payload: {
      title: vacancyForm.title,
      role: vacancyForm.role,
      company_id: selectedCompany.id && selectedCompany.id !== 'new' ? selectedCompany.id : null,
      company_name: selectedCompany.nomeFantasia,
      modality: vacancyForm.modality,
      state: vacancyForm.state,
      city: vacancyForm.city,
      salary: vacancyForm.remunerationType === 'Fixo'
        ? vacancyForm.salary
        : (vacancyForm.remunerationType === 'Faixa Salarial' ? `${vacancyForm.salaryMin} - ${vacancyForm.salaryMax}` : 'A Combinar'),
      salary_min: vacancyForm.salaryMin,
      salary_max: vacancyForm.salaryMax,
      remuneration_type: vacancyForm.remunerationType,
      has_bonus: vacancyForm.hasBonus,
      bonus_type: vacancyForm.bonusType,
      bonus_value: vacancyForm.bonusValue,
      contract_type: vacancyForm.contractType,
      description: detailedDescription,
      requirements: vacancyForm.requirements,
      stages: currentStages,
      work_schedule: vacancyForm.workSchedule,
      min_age: vacancyForm.minAge,
      is_first_job: vacancyForm.isFirstJob,
      is_pcd: vacancyForm.isPcd,
      pcd_details: vacancyForm.pcdDetails,
      positions: parseInt(vacancyForm.positions, 10) || 1,
      request_reason: vacancyForm.requestReason,
      is_urgent: vacancyForm.isUrgent,
      responsibilities: vacancyForm.responsibilities,
      benefits: {
        ...vacancyForm.benefits,
        extraBenefits: vacancyForm.extraBenefits,
      },
      status: 'active',
    },
  };
};
