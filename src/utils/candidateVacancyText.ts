import type { CompanyJob } from '../types/companyDashboard';

export const cleanDescription = (description: string) => {
  if (!description) return '';

  let cleaned = description.split('===ETAPAS_JSON===')[0].trim();
  const benefitsMarkers = [
    'benefícios:',
    'beneficios:',
    'beneficios oferecidos:',
    'benefícios oferecidos:',
    'benefícios e vantagens:',
    'beneficios e vantagens:',
  ];

  const lowerCleaned = cleaned.toLowerCase();
  for (const marker of benefitsMarkers) {
    const index = lowerCleaned.indexOf(marker);
    if (index !== -1) {
      cleaned = cleaned.substring(0, index).trim();
      break;
    }
  }

  return cleaned;
};

export const getBenefitsList = (job: CompanyJob) => {
  const list: string[] = [];

  if (job.benefits) {
    let benefits = job.benefits as {
      vt?: { selected?: boolean; value?: string };
      va?: { selected?: boolean; value?: string };
      healthInsurance?: boolean;
      dentalPlan?: boolean;
    };
    if (typeof benefits === 'string') {
      try {
        benefits = JSON.parse(benefits);
      } catch {}
    }

    if (benefits.vt?.selected) list.push(`Vale Transporte (VT): ${benefits.vt.value || 'Incluso'}`);
    if (benefits.va?.selected) list.push(`Vale Alimentação/Refeição (VA/VR): ${benefits.va.value || 'Incluso'}`);
    if (benefits.healthInsurance) list.push('Plano de Saúde');
    if (benefits.dentalPlan) list.push('Plano Odontológico');
  }

  if (list.length === 0 && job.description) {
    const lines = job.description.split('\n');
    let inBenefits = false;
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes('benefícios:') || lowerLine.includes('beneficios:')) {
        inBenefits = true;
        continue;
      }
      if (inBenefits && line.trim().startsWith('•')) {
        list.push(line.replace('•', '').trim());
      }
    }
  }

  return list;
};

export const getRequirementsList = (job: CompanyJob) => {
  if (Array.isArray(job.requirements)) return job.requirements;
  if (typeof job.requirements === 'string') {
    try {
      const parsed = JSON.parse(job.requirements);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return job.requirements.split('\n').filter((requirement: string) => requirement.trim().length > 0);
  }
  return [];
};

export const cleanEmojiFromText = (text: string): string => {
  if (!text) return '';
  try {
    return text
      .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]|\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
  } catch {
    return text
      .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
};
