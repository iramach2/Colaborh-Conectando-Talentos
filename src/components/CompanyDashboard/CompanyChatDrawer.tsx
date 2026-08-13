import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, CheckCheck, Loader2, MessageSquare, Search, Send, X as CloseIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { fetchMessagesForApplications, type ChatMessage } from '../../services/messageService';
import type { CompanyApplicant } from '../../types/companyDashboard';

interface CompanyChatDrawerProps {
  isOpen: boolean;
  applicant: CompanyApplicant | null;
  applicants: CompanyApplicant[];
  messages: ChatMessage[];
  newMessageText: string;
  setNewMessageText: (value: string) => void;
  isSendingMessage: boolean;
  isFetchingChat: boolean;
  onSelectApplicant: (applicant: CompanyApplicant) => void | Promise<void>;
  onSendMessage: () => void;
  onClose: () => void;
}

type ConversationSummary = {
  applicant: CompanyApplicant;
  lastMessage: ChatMessage;
  unreadCount: number;
};

const getApplicantName = (applicant: CompanyApplicant) => (
  applicant.candidate_name || applicant.name || applicant.email || applicant.candidate_email || 'Candidato'
);

const getApplicantEmail = (applicant: CompanyApplicant) => (
  applicant.candidate_email || applicant.email || ''
);

const getApplicantInitials = (name: string) => name
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0])
  .join('')
  .toUpperCase() || 'CA';

const formatMessageTime = (date?: string | null) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const formatConversationTime = (date?: string | null) => {
  if (!date) return '';
  const value = new Date(date);
  const today = new Date();
  const sameDay = value.toDateString() === today.toDateString();
  if (sameDay) return value.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return value.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

export function CompanyChatDrawer({
  isOpen,
  applicant,
  applicants,
  messages,
  newMessageText,
  setNewMessageText,
  isSendingMessage,
  isFetchingChat,
  onSelectApplicant,
  onSendMessage,
  onClose,
}: CompanyChatDrawerProps) {
  const [conversationMessages, setConversationMessages] = useState<ChatMessage[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isConversationView, setIsConversationView] = useState(false);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const shouldRestoreMessageFocusRef = useRef(false);
  const applicationIdsKey = useMemo(() => applicants.map((item) => item.id).filter(Boolean).join('|'), [applicants]);

  const focusMessageInput = () => {
    window.setTimeout(() => messageInputRef.current?.focus(), 0);
  };

  const handleSendMessage = () => {
    if (isSendingMessage || !newMessageText.trim()) return;

    shouldRestoreMessageFocusRef.current = true;
    onSendMessage();
    focusMessageInput();
  };

  useEffect(() => {
    if (!isOpen) return;

    if (!applicant) {
      setIsConversationView(false);
    }

    const applicationIds = applicationIdsKey ? applicationIdsKey.split('|') : [];
    if (applicationIds.length === 0) {
      setConversationMessages([]);
      return;
    }

    let isMounted = true;
    setIsLoadingConversations(true);

    fetchMessagesForApplications(applicationIds)
      .then((data) => {
        if (isMounted) setConversationMessages(data);
      })
      .catch((error) => {
        console.error('Erro ao carregar conversas da empresa:', error);
        if (isMounted) setConversationMessages([]);
      })
      .finally(() => {
        if (isMounted) setIsLoadingConversations(false);
      });

    return () => {
      isMounted = false;
    };
  }, [applicant?.id, applicationIdsKey, isOpen]);

  useEffect(() => {
    if (!applicant?.id || messages.length === 0) return;

    setConversationMessages((previous) => {
      const withoutCurrent = previous.filter((message) => message.application_id !== applicant.id);
      return [...messages, ...withoutCurrent].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    });
  }, [applicant?.id, messages]);

  useEffect(() => {
    if (isSendingMessage || !shouldRestoreMessageFocusRef.current) return;

    shouldRestoreMessageFocusRef.current = false;
    focusMessageInput();
  }, [isSendingMessage]);

  const conversations = useMemo<ConversationSummary[]>(() => {
    const applicantsById = new Map(applicants.filter((item) => item.id).map((item) => [item.id as string, item]));
    const grouped = new Map<string, ChatMessage[]>();

    conversationMessages.forEach((message) => {
      if (!message.application_id || !applicantsById.has(message.application_id)) return;
      const current = grouped.get(message.application_id) || [];
      current.push(message);
      grouped.set(message.application_id, current);
    });

    return Array.from(grouped.entries())
      .map(([applicationId, appMessages]) => {
        const sorted = [...appMessages].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return {
          applicant: applicantsById.get(applicationId) as CompanyApplicant,
          lastMessage: sorted[0],
          unreadCount: sorted.filter((message) => message.sender_type === 'candidate' && !message.read).length,
        };
      })
      .filter((conversation) => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return true;
        return `${getApplicantName(conversation.applicant)} ${getApplicantEmail(conversation.applicant)}`.toLowerCase().includes(query);
      })
      .sort((a, b) => new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime());
  }, [applicants, conversationMessages, searchQuery]);

  const handleSelectConversation = async (conversationApplicant: CompanyApplicant) => {
    setIsConversationView(true);
    await onSelectApplicant(conversationApplicant);
  };

  const showConversation = isConversationView && applicant;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/28 backdrop-blur-[2px]"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 310 }}
            className="company-dashboard-surface relative z-10 flex h-full w-full max-w-md flex-col overflow-hidden !rounded-none border-l border-slate-200/70 bg-white text-left shadow-[0_24px_70px_rgba(15,23,42,0.12)]"
          >
            {!showConversation ? (
              <>
                <header className="shrink-0 px-6 pb-3 pt-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#940dff]/18 bg-[#f3e5ff] text-[#940dff]">
                        <MessageSquare size={19} />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-[20px] font-semibold tracking-tight text-[#343241]">Mensagens</h2>
                        <p className="mt-1 text-[12px] font-medium text-slate-400">Escolha uma conversa para continuar.</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200/70 bg-white text-[#940dff] shadow-sm transition-all hover:border-[#940dff]/20 hover:text-[#8200e6] active:scale-95"
                      aria-label="Fechar mensagens"
                    >
                      <CloseIcon size={15} />
                    </button>
                  </div>

                  <div className="relative mt-4">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Buscar conversa..."
                      className="h-9 w-full rounded-full border border-[#940dff]/12 bg-white px-4 pr-10 text-[12px] font-medium text-slate-500 outline-none transition-all shadow-[0_8px_18px_rgba(148,13,255,0.055)] placeholder:text-slate-400 focus:border-[#940dff]/35 focus:ring-2 focus:ring-[#940dff]/10"
                    />
                    <Search size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#940dff]" />
                  </div>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
                  {isLoadingConversations ? (
                    <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-slate-400">
                      <Loader2 className="mb-3 animate-spin text-[#940dff]" size={22} />
                      <span className="text-[12px] font-semibold">Carregando conversas...</span>
                    </div>
                  ) : conversations.length === 0 ? (
                    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-[#940dff]/12 bg-white p-8 text-center shadow-[0_8px_18px_rgba(148,13,255,0.055)]">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f3e5ff] text-[#940dff]">
                        <MessageSquare size={22} />
                      </div>
                      <p className="text-[14px] font-semibold text-[#343241]">Nenhuma conversa ainda</p>
                      <p className="mt-2 text-[12px] font-medium leading-5 text-slate-400">As conversas aparecerão aqui quando houver mensagens com candidatos.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="divide-y divide-slate-100/90">
                        {conversations.map((conversation) => {
                          const name = getApplicantName(conversation.applicant);
                          const email = getApplicantEmail(conversation.applicant);
                          const preview = conversation.lastMessage.content || conversation.lastMessage.message || '';

                          return (
                            <button
                              key={conversation.applicant.id}
                              type="button"
                              onClick={() => handleSelectConversation(conversation.applicant)}
                              className="company-chat-conversation-card flex w-full items-center gap-3 rounded-2xl border border-[#940dff]/12 bg-white p-4 text-left shadow-[0_8px_18px_rgba(148,13,255,0.055)] transition-all hover:border-[#940dff]/20 hover:bg-white"
                            >
                              {conversation.applicant.profile_pic ? (
                                <img src={conversation.applicant.profile_pic} alt={name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                              ) : (
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#940dff]/18 bg-[#940dff]/10 text-[12px] font-semibold text-[#940dff]">
                                  {getApplicantInitials(name)}
                                </span>
                              )}
                              <span className="min-w-0 flex-1">
                                <span className="flex items-center justify-between gap-2">
                                  <span className="truncate text-[12px] font-semibold text-[#343241]">{name}</span>
                                  <span className="shrink-0 text-[10px] font-medium text-slate-400">{formatConversationTime(conversation.lastMessage.created_at)}</span>
                                </span>
                                <span className="mt-0.5 block truncate text-[11px] font-medium text-slate-400">{email}</span>
                                <span className="mt-1 flex items-center justify-between gap-2">
                                  <span className="truncate text-[12px] font-medium text-slate-500">{preview}</span>
                                  {conversation.unreadCount > 0 && (
                                    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#940dff] px-1.5 text-[10px] font-semibold text-white">
                                      {conversation.unreadCount}
                                    </span>
                                  )}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <header className="shrink-0 border-b border-slate-200/70 bg-white/70 px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsConversationView(false)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200/70 bg-white text-[#940dff] shadow-sm transition-all hover:border-[#940dff]/20 hover:text-[#8200e6] active:scale-95"
                        aria-label="Voltar para conversas"
                      >
                        <ArrowLeft size={15} />
                      </button>
                      {applicant.profile_pic ? (
                        <img src={applicant.profile_pic} alt={getApplicantName(applicant)} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                      ) : (
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#940dff]/18 bg-[#940dff]/10 text-[12px] font-semibold text-[#940dff]">
                          {getApplicantInitials(getApplicantName(applicant))}
                        </span>
                      )}
                      <div className="min-w-0">
                        <h3 className="truncate text-[14px] font-semibold text-[#343241]">{getApplicantName(applicant)}</h3>
                        <p className="mt-0.5 truncate text-[12px] font-medium text-slate-400">{getApplicantEmail(applicant)}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200/70 bg-white text-[#940dff] shadow-sm transition-all hover:border-[#940dff]/20 hover:text-[#8200e6] active:scale-95"
                      aria-label="Fechar mensagens"
                    >
                      <CloseIcon size={15} />
                    </button>
                  </div>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto p-5">
                  {isFetchingChat ? (
                    <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-slate-400">
                      <Loader2 className="mb-3 animate-spin text-[#940dff]" size={22} />
                      <span className="text-[12px] font-semibold">Carregando conversa...</span>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex h-full min-h-[360px] flex-col items-center justify-center rounded-2xl border border-[#940dff]/12 bg-white p-8 text-center shadow-[0_8px_18px_rgba(148,13,255,0.055)]">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f3e5ff] text-[#940dff]">
                        <MessageSquare size={22} />
                      </div>
                      <p className="text-[14px] font-semibold text-[#343241]">Nenhuma mensagem ainda</p>
                      <p className="mt-1 max-w-sm text-[12px] font-medium leading-relaxed text-slate-400">Escreva a primeira mensagem abaixo para iniciar o contato com o candidato.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {messages.map((message, index) => {
                        const isCompany = message.sender_type === 'company';
                        return (
                          <div key={message.id || index} className={`flex max-w-[82%] flex-col ${isCompany ? 'self-end items-end' : 'self-start items-start'}`}>
                            <div className={`flex min-h-8 items-center rounded-xl px-4 py-1.5 text-[12px] font-medium leading-relaxed shadow-sm ${isCompany ? 'rounded-br-md bg-[#940dff] text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-500'}`}>
                              <p className="whitespace-pre-wrap break-words">{message.content || message.message}</p>
                            </div>
                            <span className="mt-1 flex items-center gap-1 px-1 text-[10px] font-medium text-slate-400">
                              {formatMessageTime(message.created_at)}
                              {isCompany ? (
                                message.read ? <CheckCheck size={13} className="text-[#63e1a5]" aria-label="Mensagem lida" /> : <Check size={13} className="text-slate-300" aria-label="Mensagem enviada" />
                              ) : null}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="shrink-0 border-t border-slate-200/70 bg-white/90 p-4">
                  <div className="flex items-center gap-3">
                    <input
                      ref={messageInputRef}
                      type="text"
                      value={newMessageText}
                      onChange={(event) => setNewMessageText(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' && !isSendingMessage && newMessageText.trim()) handleSendMessage();
                      }}
                      placeholder="Digite sua mensagem..."
                      disabled={isSendingMessage}
                      className="h-8 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-[12px] font-medium text-slate-500 outline-none transition-all placeholder:text-slate-300 focus:border-[#940dff]/50 focus:ring-4 focus:ring-[#940dff]/10"
                    />
                    <button
                      type="button"
                      onClick={handleSendMessage}
                      disabled={isSendingMessage || !newMessageText.trim()}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#940dff] bg-[#940dff] text-white shadow-md shadow-[#940dff]/15 transition-all hover:bg-[#8200e6] disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={isSendingMessage ? 'Enviando mensagem' : 'Enviar mensagem'}
                      title={isSendingMessage ? 'Enviando...' : 'Enviar'}
                    >
                      <span className="sr-only">{isSendingMessage ? 'Enviando...' : 'Enviar'}</span>
                      {isSendingMessage ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} className="stroke-[2.4]" />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}