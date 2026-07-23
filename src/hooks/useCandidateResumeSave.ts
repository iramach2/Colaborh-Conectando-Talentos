import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { CandidateResumeData } from '../types/candidate';

interface UseCandidateResumeSaveParams {
  resumeData: CandidateResumeData;
  activeAccordion: string;
  calculateAge: (birthDate: string) => number;
  onSaved: (resumeData: CandidateResumeData) => void;
  onError: (message: string, timeoutMs?: number) => void;
  onSuccess: (message: string, title?: string) => void;
}

export const useCandidateResumeSave = ({
  resumeData,
  activeAccordion,
  calculateAge,
  onSaved,
  onError,
  onSuccess,
}: UseCandidateResumeSaveParams) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveToSupabase = async (
    resumeDataToSave = resumeData,
    options: { skipValidation?: boolean; silentSuccess?: boolean } = {}
  ) => {
    if (!import.meta.env.VITE_SUPABASE_URL) {
      onError('Configura\u00e7\u00e3o do Supabase ausente. Contate o administrador.');
      return false;
    }

    const errors: string[] = [];
    if (!options.skipValidation && activeAccordion === 'info') {
      if (!resumeDataToSave.fullName) errors.push('Nome Completo');
      if (!resumeDataToSave.email) errors.push('E-mail');
      if (!resumeDataToSave.phone) errors.push('WhatsApp / Telefone');
      if (!resumeDataToSave.salary) errors.push('Pretensao Salarial');
      if (!resumeDataToSave.state) errors.push('Estado');
      if (!resumeDataToSave.city) errors.push('Cidade');
      if (!resumeDataToSave.gender) errors.push('Genero');
      if (!resumeDataToSave.birthDate) errors.push('Data de Nascimento');
    } else if (!options.skipValidation && activeAccordion === 'summary') {
      if (!resumeDataToSave.summary || resumeDataToSave.summary.length < 50) {
        errors.push('Resumo Profissional (minimo 50 caracteres)');
      }
    } else if (!options.skipValidation && activeAccordion === 'skills') {
      if (resumeDataToSave.skills.length === 0) errors.push('Pelo menos uma Habilidade');
    } else if (!options.skipValidation && activeAccordion === 'education') {
      if (resumeDataToSave.educations.length === 0) errors.push('Pelo menos uma Formacao Academica');
    } else if (!options.skipValidation && activeAccordion === 'experience') {
      if (!resumeDataToSave.isFirstJob && resumeDataToSave.experiences.length === 0) {
        errors.push('Pelo menos uma Experiencia Profissional (ou marque "Primeiro Emprego")');
      }
    }

    if (errors.length > 0) {
      onError('Por favor, preencha as informacoes obrigatorias desta secao: ' + errors.join(', '), 6000);
      return false;
    }

    setIsSaving(true);
    onError('', 0);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        onError('Sess\u00e3o expirada. Entre novamente para salvar seu curr\u00edculo.');
        return false;
      }

      const authEmail = (user.email || '').trim().toLowerCase();
      const resumeEmail = (resumeDataToSave.email || authEmail).trim().toLowerCase();
      const talentToSave = {
        user_id: user.id,
        name: resumeDataToSave.fullName,
        email: resumeEmail,
        role: resumeDataToSave.experiences.length > 0 ? (resumeDataToSave.experiences[0].role || 'Candidato') : 'Candidato',
        phone: resumeDataToSave.phone,
        state: resumeDataToSave.state,
        city: resumeDataToSave.city,
        age: calculateAge(resumeDataToSave.birthDate) || 0,
        skills: resumeDataToSave.skills,
        experience: resumeDataToSave.experiences.length > 0 ? 'Experiente' : 'Iniciante',
        education: resumeDataToSave.educations.length > 0 ? (resumeDataToSave.educations[0].status || 'N/A') : 'N/A',
        modality: 'Hibrido',
        salary: resumeDataToSave.salary,
        first_job: resumeDataToSave.isFirstJob,
        summary: resumeDataToSave.summary,
        educations: resumeDataToSave.educations,
        experiences: resumeDataToSave.experiences,
        profile_pic: resumeDataToSave.profilePic,
        birth_date: resumeDataToSave.birthDate,
        gender: resumeDataToSave.gender,
        is_pcd: resumeDataToSave.isPcd,
        CID: resumeDataToSave.cid,
        languages: resumeDataToSave.languages || [],
        achievements: resumeDataToSave.achievements || [],
        diversity: resumeDataToSave.diversity,
      };

      let existingTalentId: string | null = null;

      const { data: profileByUserId, error: profileByUserIdError } = await supabase
        .from('talents')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (profileByUserIdError) console.warn('Nao foi possivel localizar perfil por usuario antes de salvar:', profileByUserIdError);
      existingTalentId = profileByUserId?.id || null;

      if (!existingTalentId && authEmail) {
        const { data: profileByAuthEmail, error: profileByAuthEmailError } = await supabase
          .from('talents')
          .select('id')
          .eq('email', authEmail)
          .limit(1)
          .maybeSingle();

        if (profileByAuthEmailError) console.warn('Nao foi possivel localizar perfil por e-mail de login antes de salvar:', profileByAuthEmailError);
        existingTalentId = profileByAuthEmail?.id || null;
      }

      if (!existingTalentId && resumeEmail && resumeEmail !== authEmail) {
        const { data: profileByResumeEmail, error: profileByResumeEmailError } = await supabase
          .from('talents')
          .select('id')
          .eq('email', resumeEmail)
          .limit(1)
          .maybeSingle();

        if (profileByResumeEmailError) console.warn('Nao foi possivel localizar perfil por e-mail do curriculo antes de salvar:', profileByResumeEmailError);
        existingTalentId = profileByResumeEmail?.id || null;
      }

      const saveResult = existingTalentId
        ? await supabase.from('talents').update(talentToSave).eq('id', existingTalentId)
        : await supabase.from('talents').insert([talentToSave]);

      const { error } = saveResult;

      if (error) {
        console.error('Supabase Error:', error);
        onError('Erro ao salvar no banco de dados: ' + error.message + ' (C\u00f3digo: ' + (error.code || 'N/A') + ')');
        return false;
      }

      onSaved(resumeDataToSave);
      if (!options.silentSuccess) {
        onSuccess('Seu curr\u00edculo foi salvo com sucesso!\nSuas altera\u00e7\u00f5es foram enviadas para o banco de dados.', 'Salvo com sucesso');
      }
      return true;
    } catch (error: unknown) {
      console.error('Catch Error:', error);
      onError('Erro inesperado: ' + (error instanceof Error ? error.message : 'Erro de conex\u00e3o.'));
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    handleSaveToSupabase,
  };
};
