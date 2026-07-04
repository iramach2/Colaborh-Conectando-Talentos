import { type Dispatch, type SetStateAction } from 'react';
import { supabase } from '../lib/supabase';
import type { CompanyApplicant, CompanyApplication, CompanyJob } from '../types/companyDashboard';
import type { CustomQuestionnaire } from '../services/customQuestionnaireService';
import { createNotification } from '../utils/notificationUtils';
import {
  getCurrentJobStageTests,
  parseCandidatePhoneData,
} from '../utils/companyDashboardUtils';

type UseCompanyApplicantStatusParams = {
  selectedJob: CompanyJob | null;
  jobApplicants: CompanyApplicant[];
  setJobApplicants: Dispatch<SetStateAction<CompanyApplicant[]>>;
  getFullApplicantInfo: (applicant: CompanyApplication) => CompanyApplicant;
  customTemplates: CustomQuestionnaire[];
  handleRequestDiscTest: (applicant: CompanyApplicant) => void;
  handleRequestMbtiTest: (applicant: CompanyApplicant) => void;
  handleRequestTemperamentosTest: (applicant: CompanyApplicant) => void;
  handleRequestQuestions: (applicant: CompanyApplicant) => void;
  handleRequestCustomTest: (applicant: CompanyApplicant, template?: CustomQuestionnaire) => void;
};

export const useCompanyApplicantStatus = ({
  selectedJob,
  jobApplicants,
  setJobApplicants,
  getFullApplicantInfo,
  customTemplates,
  handleRequestDiscTest,
  handleRequestMbtiTest,
  handleRequestTemperamentosTest,
  handleRequestQuestions,
  handleRequestCustomTest,
}: UseCompanyApplicantStatusParams) => {
  const parseStageTestConfig = (value: string) => {
    const [key, second, third] = value.split(':');
    if (key === 'customizado' && third) {
      return { key, templateId: second, trigger: third };
    }
    return { key, templateId: null, trigger: second || 'auto' };
  };

  const requestAutomaticStageTests = (application: CompanyApplication | undefined, newStatus: string) => {
    if (!application || !selectedJob) return;

    const applicantInfo = getFullApplicantInfo(application);
    const parsedData = parseCandidatePhoneData(application.candidate_phone);
    const currentStageTests = getCurrentJobStageTests(selectedJob);
    const testsForStage = currentStageTests[newStatus] || [];

    testsForStage.forEach((test) => {
      const { key: testKey, templateId, trigger } = parseStageTestConfig(test);
      if (trigger !== 'auto') return;

      let testStatus = '';
      if (testKey === 'disc') testStatus = parsedData.disc;
      else if (testKey === 'mbti') testStatus = parsedData.mbti;
      else if (testKey === 'temperamentos') testStatus = parsedData.temperamentos;
      else if (testKey === 'perguntas') testStatus = parsedData.questions;
      else if (testKey === 'customizado') testStatus = parsedData.customTest;

      const isCompleted = testStatus.startsWith('COMPLETED') || testStatus === 'COMPLETED' || (testStatus && testStatus !== 'PENDING');
      const isPending = testStatus === 'PENDING';

      if (!isCompleted && !isPending) {
        if (testKey === 'disc') handleRequestDiscTest(applicantInfo);
        else if (testKey === 'mbti') handleRequestMbtiTest(applicantInfo);
        else if (testKey === 'temperamentos') handleRequestTemperamentosTest(applicantInfo);
        else if (testKey === 'perguntas') handleRequestQuestions(applicantInfo);
        else if (testKey === 'customizado') {
          const template = templateId ? customTemplates.find((item) => item.id === templateId) : undefined;
          handleRequestCustomTest(applicantInfo, template);
        }
      }
    });
  };

  const handleUpdateApplicantStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      const appRecord = jobApplicants.find((application) => String(application.id) === String(applicationId));
      const fullInfo = appRecord ? getFullApplicantInfo(appRecord) : null;
      const candidateEmail = fullInfo?.candidate_email || fullInfo?.email;

      if (candidateEmail && selectedJob) {
        const isRejected = newStatus === 'Reprovado' || newStatus === 'Desclassificado';
        const title = isRejected ? 'Atualizacao no Processo Seletivo' : 'Avanco de Etapa';
        const message = isRejected
          ? `O processo seletivo para a vaga "${selectedJob.title}" foi encerrado para o seu perfil. Agradecemos a sua participacao!`
          : `Seu processo seletivo para a vaga "${selectedJob.title}" avancou para a etapa "${newStatus}".`;

        createNotification(
          candidateEmail,
          'candidate',
          title,
          message,
          selectedJob.id,
        ).catch((err) => console.warn('Erro ao gerar notificacao de atualizacao de status:', err));
      }

      setJobApplicants((previousApplicants) => {
        const updatedList = previousApplicants.map((application) => (
          String(application.id) === String(applicationId) ? { ...application, status: newStatus } : application
        ));

        setTimeout(() => {
          const updatedApplication = updatedList.find((application) => String(application.id) === String(applicationId));
          requestAutomaticStageTests(updatedApplication, newStatus);
        }, 500);

        return updatedList;
      });
    } catch (err) {
      console.error('Erro ao atualizar status do candidato:', err);
      alert('Erro ao atualizar status do candidato.');
    }
  };

  return { handleUpdateApplicantStatus };
};
