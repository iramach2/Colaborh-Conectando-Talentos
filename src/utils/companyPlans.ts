import type { CompanyLike } from '../types/companyDashboard';

export type CompanyPlanKey = 'starter' | 'growth' | 'enterprise';

export const COMPANY_PLAN_LIMITS = {
  starter: {
    label: 'Gratuito',
    price: 'R$ 0',
    assessmentCredits: 0,
    customQuestionnaires: 0,
    unlimitedAssessmentCredits: false,
    canUseAssessments: false,
    canUseInterviews: false,
    canDownloadResumes: false,
    canUseDirectWhatsApp: false,
    canUseDirectMessages: false,
  },
  growth: {
    label: 'Profissional',
    price: 'R$ 119,90/mês',
    assessmentCredits: 15,
    customQuestionnaires: 3,
    unlimitedAssessmentCredits: false,
    canUseAssessments: true,
    canUseInterviews: true,
    canDownloadResumes: true,
    canUseDirectWhatsApp: true,
    canUseDirectMessages: true,
  },
  enterprise: {
    label: 'Ilimitado',
    price: 'R$ 249,90/mês',
    assessmentCredits: Infinity,
    customQuestionnaires: Infinity,
    unlimitedAssessmentCredits: true,
    canUseAssessments: true,
    canUseInterviews: true,
    canDownloadResumes: true,
    canUseDirectWhatsApp: true,
    canUseDirectMessages: true,
  },
} as const;

export const normalizeCompanyPlan = (plan?: string | null): CompanyPlanKey => {
  if (plan === 'growth' || plan === 'enterprise') return plan;
  return 'starter';
};

export const getCompanyPlanLimits = (companyOrPlan?: CompanyLike | string | null) => {
  const plan = typeof companyOrPlan === 'string'
    ? normalizeCompanyPlan(companyOrPlan)
    : normalizeCompanyPlan(companyOrPlan?.plan);
  return COMPANY_PLAN_LIMITS[plan];
};

export const getDefaultCreditsForPlan = (plan?: string | null) => {
  const limits = getCompanyPlanLimits(plan);
  return limits.unlimitedAssessmentCredits ? 999999 : limits.assessmentCredits;
};

export const getPlanUpgradeMessage = (feature: string) => (
  `${feature} não está disponível no plano gratuito. Faça upgrade para o plano Profissional ou Ilimitado na aba Faturamento.`
);