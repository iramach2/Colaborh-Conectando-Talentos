import { useCallback, useEffect, useState } from 'react';
import type { CandidateConversation } from '../types/candidate';
import type { CompanyApplication, CompanyJob } from '../types/companyDashboard';
import { createNotification } from '../utils/notificationUtils';
import { fetchMessagesForApplications, markMessagesAsRead, sendMessage, type ChatMessage } from '../services/messageService';

interface UseCandidateChatParams {
  applications: CompanyApplication[];
  vacancies: CompanyJob[];
  candidateEmail?: string;
  candidateName?: string;
}

export const useCandidateChat = ({
  applications,
  vacancies,
  candidateEmail,
  candidateName,
}: UseCandidateChatParams) => {
  const [isCandidateChatDrawerOpen, setIsCandidateChatDrawerOpen] = useState(false);
  const [candidateConversations, setCandidateConversations] = useState<CandidateConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<CandidateConversation | null>(null);
  const [candidateChatMessages, setCandidateChatMessages] = useState<ChatMessage[]>([]);
  const [candidateNewMessageText, setCandidateNewMessageText] = useState('');
  const [isCandidateSendingMessage, setIsCandidateSendingMessage] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  const loadCandidateConversations = useCallback(async () => {
    if (!applications || applications.length === 0) {
      setCandidateConversations([]);
      setCandidateChatMessages([]);
      setUnreadChatCount(0);
      return;
    }

    try {
      const appIds = applications.map((app) => app.id).filter(Boolean) as string[];
      const msgs = await fetchMessagesForApplications(appIds);

      const msgsByApp: Record<string, ChatMessage[]> = {};
      let totalUnread = 0;

      msgs.forEach((message) => {
        if (!msgsByApp[message.application_id]) {
          msgsByApp[message.application_id] = [];
        }

        msgsByApp[message.application_id].push(message);

        if (message.sender_type === 'company' && !message.read) {
          totalUnread++;
        }
      });

      setUnreadChatCount(totalUnread);

      const activeConvs = applications
        .map((app): CandidateConversation | null => {
          const appMsgs = msgsByApp[app.id] || [];
          const hasCompanyMsg = appMsgs.some((message) => message.sender_type === 'company');
          if (!hasCompanyMsg) return null;

          const job = vacancies.find((vacancy) => vacancy.id === app.job_id);
          const unreadForApp = appMsgs.filter((message) => message.sender_type === 'company' && !message.read).length;

          return {
            id: app.id,
            application: app,
            job: job || { title: 'Vaga', company_name: 'Empresa' },
            messages: appMsgs,
            lastMessage: appMsgs[0] || null,
            unreadCount: unreadForApp,
          };
        })
        .filter((conversation): conversation is CandidateConversation => Boolean(conversation));

      setCandidateConversations(activeConvs);

      if (selectedConversation) {
        const openedMsgs = msgsByApp[selectedConversation.id] || [];
        const sortedMsgs = [...openedMsgs].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        setCandidateChatMessages(sortedMsgs);

        const unreadCompany = openedMsgs.filter((message) => message.sender_type === 'company' && !message.read);
        if (unreadCompany.length > 0) {
          await markMessagesAsRead(selectedConversation.id, 'company');

          setUnreadChatCount((prev) => Math.max(0, prev - unreadCompany.length));
          setCandidateConversations((prevConvs) =>
            prevConvs.map((conversation) =>
              conversation.id === selectedConversation.id ? { ...conversation, unreadCount: 0 } : conversation
            )
          );
        }
      }
    } catch (error) {
      console.error('Erro ao carregar conversas do candidato:', error);
    }
  }, [applications, selectedConversation, vacancies]);

  const openCandidateConversation = useCallback(async (conversation: CandidateConversation) => {
    setSelectedConversation(conversation);
    await markMessagesAsRead(conversation.id, 'company');
    await loadCandidateConversations();
  }, [loadCandidateConversations]);

  const closeCandidateChat = useCallback(() => {
    setIsCandidateChatDrawerOpen(false);
    setSelectedConversation(null);
  }, []);

  const handleCandidateSendMessage = useCallback(async () => {
    if (!candidateNewMessageText.trim() || !selectedConversation) return;

    setIsCandidateSendingMessage(true);
    try {
      const sentMsg = await sendMessage(selectedConversation.id, 'candidate', candidateNewMessageText);
      if (sentMsg) {
        setCandidateChatMessages((prev) => [...prev, sentMsg]);
      }
      setCandidateNewMessageText('');

      const companyName = selectedConversation.job?.company_name || 'Empresa';
      const companyNotificationId = selectedConversation.job?.company_id || companyName;
      const jobTitle = selectedConversation.job?.title || 'Vaga';

      createNotification(
        companyNotificationId,
        'company',
        'Resposta do Candidato',
        `O candidato ${candidateName || 'Cadastrado'} enviou uma resposta sobre a vaga "${jobTitle}".`,
        selectedConversation.job?.id
      ).catch((error) => console.warn('Erro ao notificar empresa de nova mensagem:', error));
    } catch (error) {
      console.error('Erro ao enviar resposta do candidato:', error);
      alert('Nao foi possivel enviar a resposta.');
    } finally {
      setIsCandidateSendingMessage(false);
    }
  }, [candidateName, candidateNewMessageText, selectedConversation]);

  useEffect(() => {
    if (!candidateEmail || applications.length === 0) return;

    loadCandidateConversations();

    const interval = window.setInterval(() => {
      loadCandidateConversations();
    }, 6000);

    return () => window.clearInterval(interval);
  }, [applications, candidateEmail, loadCandidateConversations]);

  return {
    isCandidateChatDrawerOpen,
    setIsCandidateChatDrawerOpen,
    candidateConversations,
    selectedConversation,
    setSelectedConversation,
    candidateChatMessages,
    candidateNewMessageText,
    setCandidateNewMessageText,
    isCandidateSendingMessage,
    unreadChatCount,
    openCandidateConversation,
    closeCandidateChat,
    handleCandidateSendMessage,
    loadCandidateConversations,
  };
};
