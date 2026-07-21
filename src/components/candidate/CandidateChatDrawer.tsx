import { ArrowLeft, Check, CheckCheck, Loader2, MessageSquare, Search, Send, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { ChatMessage } from '../../services/messageService';
import type { CandidateConversation } from '../../types/candidate';

interface CandidateChatDrawerProps {
  isOpen: boolean;
  conversations: CandidateConversation[];
  selectedConversation: CandidateConversation | null;
  messages: ChatMessage[];
  newMessageText: string;
  isSendingMessage: boolean;
  onClose: () => void;
  onOpenConversation: (conversation: CandidateConversation) => void;
  onBackToConversations: () => void;
  onMessageTextChange: (value: string) => void;
  onSendMessage: () => void;
}

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

const getConversationTitle = (conversation: CandidateConversation) => conversation.job?.title || 'Vaga';
const getConversationCompany = (conversation: CandidateConversation) => conversation.job?.company_name || 'Empresa';

const getCompanyInitials = (name: string) => name
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0])
  .join('')
  .toUpperCase() || 'EM';

export function CandidateChatDrawer({
  isOpen,
  conversations,
  selectedConversation,
  messages,
  newMessageText,
  isSendingMessage,
  onClose,
  onOpenConversation,
  onBackToConversations,
  onMessageTextChange,
  onSendMessage,
}: CandidateChatDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return conversations;

    return conversations.filter((conversation) => (
      `${getConversationTitle(conversation)} ${getConversationCompany(conversation)}`.toLowerCase().includes(query)
    ));
  }, [conversations, searchQuery]);

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
            className="company-dashboard-surface relative z-10 flex h-full w-full max-w-md flex-col overflow-hidden border-l border-slate-200/70 bg-[#fbf9ff] text-left shadow-[0_24px_70px_rgba(15,23,42,0.16)]"
          >
            {!selectedConversation ? (
              <>
                <header className="shrink-0 px-6 pb-4 pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#533af6]/18 bg-[#533af6]/10 text-[#533af6]">
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
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200/70 bg-white text-slate-400 shadow-sm transition-all hover:border-[#533af6]/20 hover:text-[#533af6] active:scale-95"
                      aria-label="Fechar mensagens"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  <div className="relative mt-5">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Buscar conversa..."
                      className="h-9 w-full rounded-[999px] border border-slate-200/70 bg-white px-4 pr-10 text-[12px] font-medium text-slate-500 outline-none transition-all placeholder:text-slate-400 focus:border-[#533af6]/35 focus:ring-2 focus:ring-[#533af6]/10"
                    />
                    <Search size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#533af6]" />
                  </div>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
                  {filteredConversations.length === 0 ? (
                    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/80 bg-white/80 p-8 text-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#533af6]/10 text-[#533af6]">
                        <MessageSquare size={22} />
                      </div>
                      <p className="text-[14px] font-semibold text-[#343241]">Nenhuma conversa ativa</p>
                      <p className="mt-2 text-[12px] font-medium leading-5 text-slate-400">Suas conversas aparecerao aqui quando uma empresa iniciar o contato com voce.</p>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/85 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
                      <div className="divide-y divide-slate-100/90">
                        {filteredConversations.map((conversation) => {
                          const title = getConversationTitle(conversation);
                          const company = getConversationCompany(conversation);
                          const preview = conversation.lastMessage?.content || conversation.lastMessage?.message || '';

                          return (
                            <button
                              key={conversation.id}
                              type="button"
                              onClick={() => onOpenConversation(conversation)}
                              className="flex w-full items-center gap-3 bg-white px-4 py-3 text-left transition-all hover:bg-[#fbf9ff]"
                            >
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#533af6]/18 bg-[#533af6]/10 text-[12px] font-semibold text-[#533af6]">
                                {getCompanyInitials(company)}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="flex items-center justify-between gap-2">
                                  <span className="truncate text-[12px] font-semibold text-[#343241]">{title}</span>
                                  <span className="shrink-0 text-[10px] font-medium text-slate-400">{formatConversationTime(conversation.lastMessage?.created_at)}</span>
                                </span>
                                <span className="mt-0.5 block truncate text-[11px] font-medium text-slate-400">{company}</span>
                                {preview && (
                                  <span className="mt-1 flex items-center justify-between gap-2">
                                    <span className="truncate text-[12px] font-medium text-slate-500">
                                      {conversation.lastMessage?.sender_type === 'company' ? 'Empresa: ' : 'Voce: '}
                                      {preview}
                                    </span>
                                    {conversation.unreadCount > 0 && (
                                      <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#533af6] px-1.5 text-[10px] font-semibold text-white">
                                        {conversation.unreadCount}
                                      </span>
                                    )}
                                  </span>
                                )}
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
                        onClick={onBackToConversations}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200/70 bg-white text-slate-400 shadow-sm transition-all hover:border-[#533af6]/20 hover:text-[#533af6] active:scale-95"
                        aria-label="Voltar para conversas"
                      >
                        <ArrowLeft size={15} />
                      </button>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#533af6]/18 bg-[#533af6]/10 text-[12px] font-semibold text-[#533af6]">
                        {getCompanyInitials(getConversationCompany(selectedConversation))}
                      </span>
                      <div className="min-w-0">
                        <h3 className="truncate text-[14px] font-semibold text-[#343241]">{getConversationTitle(selectedConversation)}</h3>
                        <p className="mt-0.5 truncate text-[12px] font-medium text-slate-400">{getConversationCompany(selectedConversation)}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200/70 bg-white text-slate-400 shadow-sm transition-all hover:border-[#533af6]/20 hover:text-[#533af6] active:scale-95"
                      aria-label="Fechar mensagens"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto p-5">
                  {messages.length === 0 ? (
                    <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-slate-400">
                      <Loader2 className="mb-3 animate-spin text-[#533af6]" size={22} />
                      <span className="text-[12px] font-semibold">Carregando mensagens...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {messages.map((message, index) => {
                        const isCandidate = message.sender_type === 'candidate';

                        return (
                          <div key={message.id || index} className={`flex max-w-[82%] flex-col ${isCandidate ? 'self-end items-end' : 'self-start items-start'}`}>
                            <div className={`flex min-h-8 items-center rounded-xl px-4 py-1.5 text-[12px] font-medium leading-relaxed shadow-sm ${isCandidate ? 'rounded-br-md bg-[#533af6] text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-500'}`}>
                              <p className="whitespace-pre-wrap break-words">{message.content || message.message}</p>
                            </div>
                            <span className="mt-1 flex items-center gap-1 px-1 text-[10px] font-medium text-slate-400">
                              {formatMessageTime(message.created_at)}
                              {isCandidate ? (
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
                      type="text"
                      value={newMessageText}
                      onChange={(event) => onMessageTextChange(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' && !isSendingMessage && newMessageText.trim()) onSendMessage();
                      }}
                      placeholder="Digite sua mensagem..."
                      disabled={isSendingMessage}
                      className="h-8 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-[12px] font-medium text-slate-500 outline-none transition-all placeholder:text-slate-300 focus:border-[#533af6]/50 focus:ring-4 focus:ring-[#533af6]/10 sm:h-10"
                    />
                    <button
                      type="button"
                      onClick={onSendMessage}
                      disabled={isSendingMessage || !newMessageText.trim()}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#533af6] bg-[#533af6] text-white shadow-md shadow-[#533af6]/15 transition-all hover:bg-[#4326e5] disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:w-10"
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
