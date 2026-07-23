import { useCallback } from 'react';
import type { TalentProfile } from './useCompanyTalentBank';
import type { CompanyApplicant, CompanyApplication } from '../types/companyDashboard';

export const useCompanyApplicantResolver = (talents: TalentProfile[]) => {
  return useCallback((applicant: CompanyApplication): CompanyApplicant => {
    const email = applicant.candidate_email || applicant.email;
    const name = applicant.candidate_name || applicant.name;
    const phone = applicant.candidate_phone || applicant.phone;

    const match = talents.find((talent) => {
      if (email && talent.email && talent.email.toLowerCase().trim() === email.toLowerCase().trim()) return true;
      if (name && talent.name && talent.name.toLowerCase().trim() === name.toLowerCase().trim()) return true;
      if (phone && talent.phone && talent.phone.replace(/\D/g, '') === phone.replace(/\D/g, '')) return true;
      return false;
    });

    return {
      ...applicant,
      candidate_name: name || match?.name || applicant.candidate_name || 'Candidato Cadastrado',
      candidate_phone: phone || match?.phone || applicant.candidate_phone || 'Não inf.',
      candidate_email: email || match?.email || applicant.candidate_email || '',
      city: applicant.city || match?.city || applicant.city || 'N/A',
      state: applicant.state || match?.state || applicant.state || 'N/A',
      profile_pic: applicant.profile_pic || match?.profile_pic || applicant.profile_pic || null,
      talentMatched: match,
    };
  }, [talents]);
};
