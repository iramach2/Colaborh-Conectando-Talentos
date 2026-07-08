import { useCallback, useEffect, useState } from 'react';
import { createNotification } from '../utils/notificationUtils';
import {
  ChatMessage,
  fetchMessagesForApplication,
  markMessagesAsRead,
  sendMessage,
} from '../services/messageService';
import type { CompanyApplicant, CompanyApplication, CompanyJob, CompanyLike } from '../types/companyDashboard';
import { getCompanyPlanLimits, getPlanUpgradeMessage } from '../utils/companyPlans';

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object') {
    const err = error as {
      message?: string;
      details?: string;
      hint?: string;
      code?: string;
    };
    return [err.message, err.details, err.hint, err.code ? `Codigo: ${err.code}` : '']
      .filter(Boolean)
      .join(' | ') || JSON.stringify(error);
  }
  return String(error || 'Erro desconhecido');
};

export const useCompanyChat = (
  selectedJob: CompanyJob | null | undefined,
  getFullApplicantInfo: (applicant: CompanyApplication) => CompanyApplicant,
  selectedCompany?: CompanyLike | null
) => {
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [selectedApplicantForChat, setSelectedApplicantForChat] = useState<CompanyApplicant | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isFetchingChat, setIsFetchingChat] = useState(false);

  const canUseDirectMessages = useCallback(() => {
    const limits = getCompanyPlanLimits(selectedCompany);
    if (limits.canUseDirectMessages) return true;

    alert(getPlanUpgradeMessage('Mensagens diretas para candidatos'));
    return false;
  }, [selectedCompany]);

  const loadChatMessages = useCallback(async (applicationId: string) => {
    if (!applicationId) return;

    try {
      const data = await fetchMessagesForApplication(applicationId);
      setChatMessages(data);

      const unreadCandidateMessages = data.filter((message) => (
        message.sender_type === 'candidate' && !message.read
      ));
      if (unreadCandidateMessages.length > 0) {
        await markMessagesAsRead(applicationId, 'candidate');
      }
    } catch (e) {
      console.error('Erro ao buscar mensagens do chat:', e);
    }
  }, []);

  const loadApplicantChat = useCallback(async (applicant: CompanyApplication | CompanyApplicant, openDrawer: boolean) => {
    const info = 'talentMatched' in applicant ? applicant : getFullApplicantInfo(applicant);
    setSelectedApplicantForChat(info);
    setNewMessageText('');
    if (openDrawer) setIsChatDrawerOpen(true);
    setIsFetchingChat(true);
    await loadChatMessages(info.id || '');
    setIsFetchingChat(false);
  }, [getFullApplicantInfo, loadChatMessages]);

  const handleOpenChat = useCallback(async (applicant: CompanyApplication) => {
    if (!canUseDirectMessages()) return;
    await loadApplicantChat(applicant, true);
  }, [canUseDirectMessages, loadApplicantChat]);

  const handleLoadProfileChat = useCallback(async (applicant: CompanyApplicant) => {
    const limits = getCompanyPlanLimits(selectedCompany);
    if (!limits.canUseDirectMessages) return;
    await loadApplicantChat(applicant, false);
  }, [loadApplicantChat, selectedCompany]);

  const openMessagesDrawer = useCallback(() => {
    if (!canUseDirectMessages()) return;
    setIsChatDrawerOpen(true);
    setSelectedApplicantForChat(null);
    setChatMessages([]);
    setNewMessageText('');
  }, [canUseDirectMessages]);

  const closeChat = useCallback(() => {
    setIsChatDrawerOpen(false);
    setSelectedApplicantForChat(null);
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!newMessageText.trim() || !selectedApplicantForChat?.id) return;
    if (!canUseDirectMessages()) return;

    setIsSendingMessage(true);
    try {
      const sentMessage = await sendMessage(selectedApplicantForChat.id, 'company', newMessageText);
      if (sentMessage) {
        setChatMessages((previous) => [...previous, sentMessage]);
      }
      setNewMessageText('');

      const email = selectedApplicantForChat.candidate_email || selectedApplicantForChat.email;
      if (email && selectedJob?.id) {
        createNotification(
          email,
          'candidate',
          'Nova mensagem da empresa',
          `Voce recebeu uma mensagem da empresa sobre a vaga "${selectedJob.title || 'Vaga'}".`,
          selectedJob.id
        ).catch((err) => console.warn('Erro ao gerar notificacao de nova mensagem:', err));
      }
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      alert(`Nao foi possivel enviar a mensagem: ${getErrorMessage(err)}`);
    } finally {
      setIsSendingMessage(false);
    }
  }, [canUseDirectMessages, newMessageText, selectedApplicantForChat, selectedJob?.id, selectedJob?.title]);

  useEffect(() => {
    if (!isChatDrawerOpen || !selectedApplicantForChat?.id) return;

    const interval = window.setInterval(() => {
      loadChatMessages(selectedApplicantForChat.id || '');
    }, 4000);

    return () => window.clearInterval(interval);
  }, [isChatDrawerOpen, loadChatMessages, selectedApplicantForChat?.id]);

  return {
    isChatDrawerOpen,
    selectedApplicantForChat,
    chatMessages,
    newMessageText,
    setNewMessageText,
    isSendingMessage,
    isFetchingChat,
    handleOpenChat,
    handleLoadProfileChat,
    openMessagesDrawer,
    handleSendMessage,
    closeChat,
  };
};