import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { CandidateResumeData } from '../types/candidate';
import type { CompanyApplication, CompanyJob } from '../types/companyDashboard';
import { createNotification } from '../utils/notificationUtils';

interface UseCandidateJobApplicationParams {
  resumeData: CandidateResumeData;
  appliedJobIds: string[];
  setAppliedJobIds: (updater: string[] | ((current: string[]) => string[])) => void;
  calculateAge: (birthDate: string) => number;
  onError: (message: string, timeoutMs?: number) => void;
  onAlert: (message: string, title?: string) => void;
  onSuccess: (message: string, title?: string) => void;
}

const hasText = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

const getResumeApplicationBlockers = (resumeData: CandidateResumeData) => {
  const blockers: string[] = [];

  const personalFields = [
    ['Nome completo', resumeData.fullName],
    ['E-mail', resumeData.email],
    ['Telefone', resumeData.phone],
    ['Pretensão salarial', resumeData.salary],
    ['Estado', resumeData.state],
    ['Cidade', resumeData.city],
    ['Gênero', resumeData.gender],
    ['Data de nascimento', resumeData.birthDate],
  ] as const;

  personalFields.forEach(([label, value]) => {
    if (!hasText(value)) blockers.push(label);
  });

  if (!hasText(resumeData.summary) || resumeData.summary.trim().length < 50) {
    blockers.push('Resumo profissional');
  }

  if (!resumeData.skills?.some(hasText)) {
    blockers.push('Habilidades');
  }

  const hasCompleteExperience = resumeData.experiences?.some((experience) => (
    hasText(experience.role) &&
    hasText(experience.company) &&
    hasText(experience.startDate) &&
    (experience.current || hasText(experience.endDate)) &&
    hasText(experience.description)
  ));

  if (!resumeData.isFirstJob && !hasCompleteExperience) {
    blockers.push('Experiência profissional ou marque Primeiro emprego');
  }

  const hasCompleteEducation = resumeData.educations?.some((education) => (
    hasText(education.institution) &&
    hasText(education.course) &&
    hasText(education.status) &&
    hasText(education.gradYear)
  ));

  if (!hasCompleteEducation) {
    blockers.push('Formação acadêmica');
  }

  const hasCompleteLanguage = resumeData.languages?.some((language) => (
    hasText(language.language) && hasText(language.level)
  ));

  if (!hasCompleteLanguage) {
    blockers.push('Idiomas');
  }

  const hasCompleteAchievement = resumeData.achievements?.some((achievement) => (
    hasText(achievement.type) && hasText(achievement.title)
  ));

  if (!hasCompleteAchievement) {
    blockers.push('Certificações ou cursos');
  }

  return blockers;
};

export const useCandidateJobApplication = ({
  resumeData,
  appliedJobIds,
  setAppliedJobIds,
  calculateAge,
  onError,
  onAlert,
  onSuccess,
}: UseCandidateJobApplicationParams) => {
  const [isApplying, setIsApplying] = useState<string | null>(null);

  const handleApply = async (vacancy: CompanyJob) => {
    const resumeBlockers = getResumeApplicationBlockers(resumeData);

    if (resumeBlockers.length > 0) {
      onError(
        'Complete seu currículo antes de se candidatar. Pendências: ' + resumeBlockers.join(', ') + '. A seção Diversidade é opcional.',
        9000
      );
      return;
    }

    const age = calculateAge(resumeData.birthDate);

    const rawMinAgeRequired = vacancy.min_age !== undefined ? vacancy.min_age : (vacancy.minAge || 16);
    const minAgeRequired = Number(rawMinAgeRequired) || 16;
    if (age < minAgeRequired) {
      onError(`Esta vaga exige idade minima de ${minAgeRequired} anos. Voce tem ${age} anos.`, 5000);
      return;
    }

    if (!import.meta.env.VITE_SUPABASE_URL) {
      alert('Configuracao do Supabase ausente.');
      return;
    }

    setIsApplying(vacancy.id);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const payload: Partial<CompanyApplication> = {
        job_id: vacancy.id,
        candidate_name: resumeData.fullName,
        candidate_phone: resumeData.phone,
        candidate_user_id: user?.id || null,
        status: 'Triagem',
        city: resumeData.city,
        state: resumeData.state,
        profile_pic: resumeData.profilePic,
        candidate_email: resumeData.email,
        email: resumeData.email,
        name: resumeData.fullName,
        phone: resumeData.phone,
      };

      let attempt = 0;
      const maxAttempts = 12;
      let success = false;
      let lastError: unknown = null;

      while (attempt < maxAttempts) {
        const { error } = await supabase
          .from('applications')
          .insert([payload]);

        if (!error) {
          success = true;
          break;
        }

        lastError = error;
        console.error(`Tentativa ${attempt} falhou ao salvar candidatura:`, error);

        const isColumnError = error.code === 'PGRST204' ||
          (error.message && error.message.toLowerCase().includes('could not find the') && error.message.toLowerCase().includes('column'));

        if (isColumnError) {
          const match = error.message.match(/Could not find the '([^']+)' column/i);
          const colToDrop = match ? match[1] : null;

          if (colToDrop && colToDrop in payload) {
            console.warn(`[Self-Healing] Removendo coluna inexistente '${colToDrop}' de applications e tentando novamente.`);
            delete payload[colToDrop as keyof typeof payload];
            attempt++;
            continue;
          }
        }

        throw error;
      }

      if (!success) {
        throw lastError || new Error('Falha ao enviar candidatura apos varias tentativas.');
      }

      if (vacancy.company_id || vacancy.company_name) {
        createNotification(
          vacancy.company_id || vacancy.company_name,
          'company',
          'Nova Candidatura',
          `O candidato "${resumeData.fullName}" se candidatou na vaga "${vacancy.title}".`,
          vacancy.id
        ).catch((error) => console.warn('Erro ao gerar notificacao de nova candidatura:', error));
      }

      setAppliedJobIds((current) => [...current, vacancy.id]);
      onSuccess(`Candidatura enviada com sucesso para ${vacancy.title}!`, 'Candidatura enviada');
    } catch (error) {
      console.error('Erro ao enviar candidatura:', error);
      onAlert('Erro ao se candidatar. Verifique a tabela "applications" ou adicione as colunas conforme as instrucoes.', 'Erro de candidatura');
    } finally {
      setIsApplying(null);
    }
  };

  return {
    isApplying,
    handleApply,
  };
};
