import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { createNotification } from '../utils/notificationUtils';
import { INTERVIEW_COLUMNS } from '../services/queryColumns';
import type { CompanyApplicant, CompanyApplication, CompanyInterview, CompanyLike } from '../types/companyDashboard';

export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled';

export const useCompanyInterviews = (
  selectedCompany: CompanyLike | null | undefined,
  selectedCompanyId: string,
  activeTab: string,
  jobApplicants: CompanyApplicant[],
  getFullApplicantInfo: (applicant: CompanyApplication) => CompanyApplicant,
  updateApplicantStatus: (applicationId: string, status: string) => Promise<void>
) => {
  const [interviews, setInterviews] = useState<CompanyInterview[]>([]);
  const [isFetchingInterviews, setIsFetchingInterviews] = useState(false);
  const [activeVideoMeeting, setActiveVideoMeeting] = useState<{ roomName: string; userName: string; interviewId?: string } | null>(null);

  const loadInterviews = useCallback(async () => {
    if (!import.meta.env.VITE_SUPABASE_URL) return;

    setIsFetchingInterviews(true);
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select(INTERVIEW_COLUMNS)
        .order('date_time', { ascending: true });

      if (error) throw error;
      setInterviews((data || []) as CompanyInterview[]);
    } catch (err) {
      console.error('Erro ao buscar entrevistas:', err);
    } finally {
      setIsFetchingInterviews(false);
    }
  }, []);

  useEffect(() => {
    loadInterviews();
  }, [loadInterviews, selectedCompanyId, activeTab]);

  const handleCreateInterview = useCallback(async (
    jobId: string,
    candidateEmail: string,
    dateTime: string,
    notes: string
  ) => {
    try {
      const roomName = `colaborh-interview-${Math.random().toString(36).substring(2, 11)}`;
      const companyName = selectedCompany?.nomeFantasia || 'Empresa Colaborh';

      const { data, error } = await supabase
        .from('interviews')
        .insert({
          job_id: jobId,
          candidate_email: candidateEmail,
          company_name: companyName,
          date_time: dateTime,
          scheduled_at: dateTime,
          status: 'scheduled',
          room_name: roomName,
          notes,
        })
        .select();

      if (error) throw error;

      await loadInterviews();

      const candidateApplication = jobApplicants.find((application) => {
        const info = getFullApplicantInfo(application);
        return info?.email === candidateEmail || info?.candidate_email === candidateEmail;
      });

      if (candidateApplication?.id && candidateApplication.status !== 'Entrevista') {
        await updateApplicantStatus(candidateApplication.id, 'Entrevista');
      }

      const formattedDate = new Date(dateTime).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      });

      createNotification(
        candidateEmail,
        'candidate',
        'Entrevista Agendada',
        `Sua entrevista de video para a vaga na "${companyName}" foi agendada para ${formattedDate}.`,
        jobId
      ).catch((err) => console.warn('Erro ao notificar agendamento de entrevista:', err));

      return data;
    } catch (err) {
      console.error('Erro ao agendar entrevista:', err);
      alert('Erro ao agendar entrevista seletiva.');
      return null;
    }
  }, [
    getFullApplicantInfo,
    jobApplicants,
    loadInterviews,
    selectedCompany?.nomeFantasia,
    updateApplicantStatus,
  ]);

  const handleUpdateInterviewStatus = useCallback(async (
    interviewId: string,
    newStatus: InterviewStatus
  ) => {
    try {
      const { error } = await supabase
        .from('interviews')
        .update({ status: newStatus })
        .eq('id', interviewId);

      if (error) throw error;

      await loadInterviews();

      const interview = interviews.find((item) => item.id === interviewId);
      if (interview) {
        const companyName = selectedCompany?.nomeFantasia || 'Empresa Colaborh';
        const formattedDate = new Date(interview.date_time).toLocaleString('pt-BR', {
          dateStyle: 'short',
          timeStyle: 'short',
        });

        let title = 'Entrevista Cancelada';
        let message = `Sua entrevista agendada para ${formattedDate} com a "${companyName}" foi cancelada.`;
        if (newStatus === 'completed') {
          title = 'Entrevista Concluida';
          message = `Sua entrevista de video com a "${companyName}" foi concluida. Acompanhe as proximas etapas!`;
        }

        createNotification(
          interview.candidate_email,
          'candidate',
          title,
          message,
          interview.job_id
        ).catch((err) => console.warn('Erro ao notificar atualizacao de entrevista:', err));
      }
    } catch (err) {
      console.error('Erro ao atualizar status da entrevista:', err);
    }
  }, [interviews, loadInterviews, selectedCompany?.nomeFantasia]);

  return {
    interviews,
    isFetchingInterviews,
    activeVideoMeeting,
    setActiveVideoMeeting,
    handleCreateInterview,
    handleUpdateInterviewStatus,
  };
};
