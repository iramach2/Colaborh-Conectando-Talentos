import { useCallback } from 'react';
import {
  getCustomQuestionsFromJobDescription,
  serializeCandidatePhoneWithAssessment,
} from '../utils/companyDashboardUtils';
import {
  findPreviousCompletedAssessmentLegacyValue,
  markAssessmentCompletedFromLegacyWithFallback,
  markAssessmentPendingWithLegacyFallback,
  type AssessmentType,
} from '../services/assessmentService';
import type { CustomQuestionnaire } from '../services/customQuestionnaireService';
import type { CompanyApplication, CompanyJob } from '../types/companyDashboard';

type AssessmentMarkerField = 'disc' | 'questions' | 'mbti' | 'temperamentos' | 'customTest';

type ReusableAssessmentConfig = {
  gateKey: string;
  assessmentType: AssessmentType;
  markerField: AssessmentMarkerField;
  blockedMessage: string;
  importMessage: string;
  successTitle: string;
  successMessage: (jobTitle: string) => string;
  warningContext: string;
  successAlert: (email: string) => string;
  errorLog: string;
  errorAlert: string;
};

type UseCompanyAssessmentRequestsParams = {
  selectedJob: CompanyJob | null;
  canRequestAssessment: (application: CompanyApplication, testKey: string) => boolean;
  validateAndDeductCredit: () => boolean;
  updateApplicantCandidatePhone: (applicationId: string, candidatePhone: string) => void;
  notifyCandidateAssessmentRequest: (
    email: string,
    title: string,
    message: string,
    warningContext: string,
  ) => void;
  closeCustomTemplateRequest: () => void;
};

const getApplicationIdentity = (application: CompanyApplication) => ({
  appId: application.id,
  currentPhone: application.candidate_phone || '',
  email: application.candidate_email || application.email || 'candidato@email.com',
});

export const useCompanyAssessmentRequests = ({
  selectedJob,
  canRequestAssessment,
  validateAndDeductCredit,
  updateApplicantCandidatePhone,
  notifyCandidateAssessmentRequest,
  closeCustomTemplateRequest,
}: UseCompanyAssessmentRequestsParams) => {
  const requestReusableAssessment = useCallback(async (application: CompanyApplication, config: ReusableAssessmentConfig) => {
    try {
      if (!canRequestAssessment(application, config.gateKey)) {
        alert(config.blockedMessage);
        return;
      }

      if (!validateAndDeductCredit()) {
        return;
      }

      const { appId, currentPhone, email } = getApplicationIdentity(application);
      const jobTitle = selectedJob?.title || 'Vaga Selecionada';

      const foundPreviousCompletedValue = await findPreviousCompletedAssessmentLegacyValue(
        email,
        config.assessmentType,
        application.talent_id,
      );

      if (foundPreviousCompletedValue) {
        const updatedPhoneVal = serializeCandidatePhoneWithAssessment(
          currentPhone,
          config.markerField,
          foundPreviousCompletedValue,
        );

        await markAssessmentCompletedFromLegacyWithFallback(
          appId,
          config.assessmentType,
          email,
          foundPreviousCompletedValue,
          updatedPhoneVal,
        );

        updateApplicantCandidatePhone(appId, updatedPhoneVal);
        alert(config.importMessage);
        return;
      }

      const updatedPhoneVal = serializeCandidatePhoneWithAssessment(currentPhone, config.markerField, 'PENDING');

      await markAssessmentPendingWithLegacyFallback(appId, config.assessmentType, email, updatedPhoneVal);
      updateApplicantCandidatePhone(appId, updatedPhoneVal);

      notifyCandidateAssessmentRequest(
        email,
        config.successTitle,
        config.successMessage(jobTitle),
        config.warningContext,
      );

      alert(config.successAlert(email));
    } catch (err) {
      console.error(config.errorLog, err);
      alert(config.errorAlert);
    }
  }, [
    canRequestAssessment,
    notifyCandidateAssessmentRequest,
    selectedJob,
    updateApplicantCandidatePhone,
    validateAndDeductCredit,
  ]);

  const handleRequestDiscTest = useCallback((application: CompanyApplication) => requestReusableAssessment(application, {
    gateKey: 'disc',
    assessmentType: 'disc',
    markerField: 'disc',
    blockedMessage: 'A solicitacao do teste DISC nao esta configurada para a etapa atual do candidato.',
    importMessage: 'O candidato ja respondeu ao teste DISC em outro processo seletivo. As respostas e resultados foram importados com sucesso!',
    successTitle: 'Teste DISC Solicitado',
    successMessage: (jobTitle) => `A empresa solicitou que voce realize o teste comportamental DISC 5.0 para a vaga "${jobTitle}".`,
    warningContext: 'teste DISC',
    successAlert: (email) => `Teste DISC solicitado com sucesso!\n\nE-mail de notificacao enviado para: ${email}\nO candidato ja pode responder ao teste no painel dele.`,
    errorLog: 'Erro ao solicitar teste DISC:',
    errorAlert: 'Erro ao solicitar teste DISC.',
  }), [requestReusableAssessment]);

  const handleRequestQuestions = useCallback((application: CompanyApplication) => requestReusableAssessment(application, {
    gateKey: 'perguntas',
    assessmentType: 'questions',
    markerField: 'questions',
    blockedMessage: 'A solicitacao do Mapeamento de Perfil nao esta configurada para a etapa atual do candidato.',
    importMessage: 'O candidato ja respondeu ao Mapeamento de Perfil em outro processo seletivo. As respostas foram importadas com sucesso!',
    successTitle: 'Mapeamento de Perfil Solicitado',
    successMessage: (jobTitle) => `A empresa solicitou que voce responda ao Mapeamento de Perfil para a vaga "${jobTitle}".`,
    warningContext: 'mapeamento',
    successAlert: (email) => `Mapeamento de Perfil solicitado com sucesso!\n\nE-mail de notificacao enviado para: ${email}\nO candidato ja pode responder ao mapeamento no painel dele.`,
    errorLog: 'Erro ao solicitar mapeamento de perfil:',
    errorAlert: 'Erro ao solicitar mapeamento de perfil.',
  }), [requestReusableAssessment]);

  const handleRequestMbtiTest = useCallback((application: CompanyApplication) => requestReusableAssessment(application, {
    gateKey: 'mbti',
    assessmentType: 'mbti',
    markerField: 'mbti',
    blockedMessage: 'A solicitacao do teste MBTI nao esta configurada para a etapa atual do candidato.',
    importMessage: 'O candidato ja respondeu ao teste MBTI em outro processo seletivo. As respostas foram importadas com sucesso!',
    successTitle: 'Teste MBTI Solicitado',
    successMessage: (jobTitle) => `A empresa solicitou que voce realize o teste de personalidade MBTI para a vaga "${jobTitle}".`,
    warningContext: 'teste MBTI',
    successAlert: (email) => `Teste de Personalidade MBTI solicitado com sucesso!\n\nE-mail de notificacao enviado para: ${email}\nO candidato ja pode responder ao teste no painel dele.`,
    errorLog: 'Erro ao solicitar teste MBTI:',
    errorAlert: 'Erro ao solicitar teste MBTI.',
  }), [requestReusableAssessment]);

  const handleRequestTemperamentosTest = useCallback((application: CompanyApplication) => requestReusableAssessment(application, {
    gateKey: 'temperamentos',
    assessmentType: 'temperamentos',
    markerField: 'temperamentos',
    blockedMessage: 'A solicitacao do teste de Temperamentos nao esta configurada para a etapa atual do candidato.',
    importMessage: 'O candidato ja respondeu ao teste de Temperamentos em outro processo seletivo. As respostas foram importadas com sucesso!',
    successTitle: 'Teste de Temperamentos Solicitado',
    successMessage: (jobTitle) => `A empresa solicitou que voce realize o teste de temperamentos e perfil comportamental para a vaga "${jobTitle}".`,
    warningContext: 'teste de temperamentos',
    successAlert: (email) => `Teste de Temperamentos solicitado com sucesso!\n\nE-mail de notificacao enviado para: ${email}\nO candidato ja pode responder ao teste no painel dele.`,
    errorLog: 'Erro ao solicitar teste de temperamentos:',
    errorAlert: 'Erro ao solicitar teste de temperamentos.',
  }), [requestReusableAssessment]);

  const handleRequestCustomTest = useCallback(async (application: CompanyApplication, template?: CustomQuestionnaire) => {
    try {
      if (!canRequestAssessment(application, 'customizado')) {
        alert('A solicitacao do Questionario Customizado nao esta configurada para a etapa atual do candidato.');
        return;
      }

      if (!validateAndDeductCredit()) {
        return;
      }

      const customQuestions = template?.questions || getCustomQuestionsFromJobDescription(selectedJob?.description || '');
      if (!customQuestions || customQuestions.length === 0) {
        alert('Esta vaga nao possui um Questionario Customizado configurado. Crie as perguntas na aba "Resultados" > "Criar Questionario Customizado" antes de solicitar.');
        return;
      }

      const { appId, currentPhone, email } = getApplicationIdentity(application);
      const jobTitle = selectedJob?.title || 'Vaga Selecionada';
      const templatePayload = template
        ? { title: template.title, questions: template.questions }
        : null;
      const customTestValue = templatePayload
        ? `PENDING:::${JSON.stringify(templatePayload)}`
        : 'PENDING';
      const updatedPhoneVal = serializeCandidatePhoneWithAssessment(currentPhone, 'customTest', customTestValue);

      await markAssessmentPendingWithLegacyFallback(appId, 'custom', email, updatedPhoneVal, template
        ? {
            templateId: template.id,
            title: template.title,
            questions: template.questions || [],
          }
        : {
            questions: customQuestions,
            source: 'job_description',
          });

      updateApplicantCandidatePhone(appId, updatedPhoneVal);
      notifyCandidateAssessmentRequest(
        email,
        'Questionario Customizado Solicitado',
        `A empresa solicitou que voce responda ao questionario customizado para a vaga "${jobTitle}".`,
        'questionario customizado',
      );

      alert(`Questionario Customizado solicitado com sucesso!\n\nE-mail de notificacao enviado para: ${email}\nO candidato ja pode responder ao questionario no painel dele.`);
    } catch (err) {
      console.error('Erro ao solicitar questionario customizado:', err);
      alert('Erro ao solicitar questionario customizado.');
    }
  }, [
    canRequestAssessment,
    notifyCandidateAssessmentRequest,
    selectedJob,
    updateApplicantCandidatePhone,
    validateAndDeductCredit,
  ]);
  const handleConfirmRequestCustomTest = useCallback(async (application: CompanyApplication, template: CustomQuestionnaire) => {
    try {
      if (!application || !template) return;

      const { appId, currentPhone, email } = getApplicationIdentity(application);
      const templatePayload = {
        title: template.title,
        questions: template.questions,
      };
      const customTestValue = `PENDING:::${JSON.stringify(templatePayload)}`;
      const updatedPhoneVal = serializeCandidatePhoneWithAssessment(currentPhone, 'customTest', customTestValue);

      await markAssessmentPendingWithLegacyFallback(appId, 'custom', email, updatedPhoneVal, {
        templateId: template.id,
        title: template.title,
        questions: template.questions || [],
      });

      updateApplicantCandidatePhone(appId, updatedPhoneVal);

      alert(`Questionario Customizado "${template.title}" solicitado com sucesso!\n\nE-mail de notificacao enviado para: ${email}\nO candidato ja pode responder ao questionario no painel dele.`);
      closeCustomTemplateRequest();
    } catch (err) {
      console.error('Erro ao solicitar questionario customizado:', err);
      alert('Erro ao solicitar questionario customizado.');
    }
  }, [closeCustomTemplateRequest, updateApplicantCandidatePhone, validateAndDeductCredit]);

  return {
    handleRequestDiscTest,
    handleRequestQuestions,
    handleRequestMbtiTest,
    handleRequestTemperamentosTest,
    handleRequestCustomTest,
    handleConfirmRequestCustomTest,
  };
};

