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

  const handleSaveToSupabase = async () => {
    if (!import.meta.env.VITE_SUPABASE_URL) {
      onError('Configura\u00e7\u00e3o do Supabase ausente. Contate o administrador.');
      return false;
    }

    const errors: string[] = [];
    if (activeAccordion === 'info') {
      if (!resumeData.fullName) errors.push('Nome Completo');
      if (!resumeData.email) errors.push('E-mail');
      if (!resumeData.phone) errors.push('WhatsApp / Telefone');
      if (!resumeData.salary) errors.push('Pretensao Salarial');
      if (!resumeData.state) errors.push('Estado');
      if (!resumeData.city) errors.push('Cidade');
      if (!resumeData.gender) errors.push('Genero');
      if (!resumeData.birthDate) errors.push('Data de Nascimento');
    } else if (activeAccordion === 'summary') {
      if (!resumeData.summary || resumeData.summary.length < 50) {
        errors.push('Resumo Profissional (minimo 50 caracteres)');
      }
    } else if (activeAccordion === 'skills') {
      if (resumeData.skills.length === 0) errors.push('Pelo menos uma Habilidade');
    } else if (activeAccordion === 'education') {
      if (resumeData.educations.length === 0) errors.push('Pelo menos uma Formacao Academica');
    } else if (activeAccordion === 'experience') {
      if (!resumeData.isFirstJob && resumeData.experiences.length === 0) {
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
      const resumeEmail = (resumeData.email || authEmail).trim().toLowerCase();
      const talentToSave = {
        user_id: user.id,
        name: resumeData.fullName,
        email: resumeEmail,
        role: resumeData.experiences.length > 0 ? (resumeData.experiences[0].role || 'Candidato') : 'Candidato',
        phone: resumeData.phone,
        state: resumeData.state,
        city: resumeData.city,
        age: calculateAge(resumeData.birthDate) || 0,
        skills: resumeData.skills,
        experience: resumeData.experiences.length > 0 ? 'Experiente' : 'Iniciante',
        education: resumeData.educations.length > 0 ? (resumeData.educations[0].status || 'N/A') : 'N/A',
        modality: 'Hibrido',
        salary: resumeData.salary,
        first_job: resumeData.isFirstJob,
        summary: resumeData.summary,
        educations: resumeData.educations,
        experiences: resumeData.experiences,
        profile_pic: resumeData.profilePic,
        birth_date: resumeData.birthDate,
        gender: resumeData.gender,
        is_pcd: resumeData.isPcd,
        CID: resumeData.cid,
        languages: resumeData.languages || [],
        achievements: resumeData.achievements || [],
        diversity: resumeData.diversity,
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

      onSaved(resumeData);
      onSuccess('Seu curr\u00edculo foi salvo com sucesso!\nSuas altera\u00e7\u00f5es foram enviadas para o banco de dados.', 'Salvo com sucesso');
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
