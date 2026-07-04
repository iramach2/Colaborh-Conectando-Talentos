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
      benefits: vacancyForm.benefits,
      status: 'active',
    },
  };
};
