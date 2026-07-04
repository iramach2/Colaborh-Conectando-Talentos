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
      onError('Configuracao do Supabase ausente. Contate o administrador.');
      return;
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
      return;
    }

    setIsSaving(true);
    onError('', 0);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const talentToSave = {
        user_id: user?.id || null,
        name: resumeData.fullName,
        email: resumeData.email,
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

      const { error } = await supabase
        .from('talents')
        .upsert([talentToSave], { onConflict: 'email' });

      if (error) {
        console.error('Supabase Error:', error);
        onError('Erro ao salvar no banco de dados: ' + error.message + ' (Codigo: ' + (error.code || 'N/A') + ')');
        return;
      }

      onSaved(resumeData);
      onSuccess('Seu curriculo foi salvo com sucesso!\nSuas alteracoes foram enviadas para o banco de dados.', 'Salvo com sucesso');
    } catch (error: unknown) {
      console.error('Catch Error:', error);
      onError('Erro inesperado: ' + (error instanceof Error ? error.message : 'Erro de conexao.'));
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    handleSaveToSupabase,
  };
};
