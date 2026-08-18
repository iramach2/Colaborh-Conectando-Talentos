import { useCallback } from 'react';
import type { TalentProfile } from './useCompanyTalentBank';
import type { CompanyApplicant, CompanyApplication } from '../types/companyDashboard';

const normalizeText = (value?: string | null) => value?.toLowerCase().trim() || '';
const normalizePhone = (value?: string | null) => value?.replace(/\D/g, '') || '';

export const resolveCompanyApplicant = (
  talents: TalentProfile[],
  applicant: CompanyApplication | CompanyApplicant,
): CompanyApplicant => {
  const email = applicant.candidate_email || applicant.email;
  const name = applicant.candidate_name || applicant.name;
  const phone = applicant.candidate_phone || applicant.phone;
  const existingMatch = 'talentMatched' in applicant ? applicant.talentMatched : null;

  const match = existingMatch || talents.find((talent) => {
    if (applicant.talent_id && talent.id === applicant.talent_id) return true;
    if (applicant.candidate_user_id && talent.user_id === applicant.candidate_user_id) return true;
    if (email && talent.email && normalizeText(talent.email) === normalizeText(email)) return true;
    if (name && talent.name && normalizeText(talent.name) === normalizeText(name)) return true;
    if (phone && talent.phone && normalizePhone(talent.phone) === normalizePhone(phone)) return true;
    return false;
  });

  return {
    ...applicant,
    candidate_name: name || match?.name || applicant.candidate_name || 'Candidato Cadastrado',
    candidate_phone: phone || match?.phone || applicant.candidate_phone || 'Não inf.',
    candidate_email: email || match?.email || applicant.candidate_email || '',
    city: applicant.city || match?.city || 'N/A',
    state: applicant.state || match?.state || 'N/A',
    profile_pic: applicant.profile_pic || match?.profile_pic || null,
    talentMatched: match,
  };
};

export const useCompanyApplicantResolver = (talents: TalentProfile[]) => {
  return useCallback(
    (applicant: CompanyApplication | CompanyApplicant) => resolveCompanyApplicant(talents, applicant),
    [talents],
  );
};
