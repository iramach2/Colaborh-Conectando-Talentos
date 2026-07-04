import { Activity, ChevronLeft, MessageSquare, X } from 'lucide-react';
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
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-l-[24px] rounded-r-none shadow-2xl overflow-hidden flex flex-col h-full border-l border-slate-100/85 z-10"
          >
            {!selectedConversation ? (
              <>
                <div className="px-8 pt-8 pb-6 flex justify-between items-center shrink-0">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                      <MessageSquare size={16} className="text-[#533af6] animate-bounce" />
                      Minhas Conversas
                    </h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      Mensagens com recrutadores
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full border border-slate-100 hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#533af6] transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-3 bg-slate-50/20">
                  {conversations.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                        <MessageSquare size={26} />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-slate-700">Nenhuma conversa ativa</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1.5 leading-relaxed">
                          Suas conversas aparecerao aqui quando uma empresa iniciar o contato com voce.
                        </p>
                      </div>
                    </div>
                  ) : (
                    conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => onOpenConversation(conversation)}
                        className="bg-white p-4 rounded-[16px] border border-slate-150/70 hover:border-indigo-200 hover:bg-indigo-50/10 shadow-3xs hover:shadow-2xs transition-all cursor-pointer flex items-center justify-between gap-4 text-left relative overflow-hidden group border-l-4 border-l-indigo-500"
                      >
                        <div className="min-w-0 flex-1">
                          <h5 className="text-xs font-black text-slate-800 uppercase tracking-tight truncate leading-tight group-hover:text-[#533af6] transition-colors">
                            {conversation.job?.title}
                          </h5>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 truncate">
                            {conversation.job?.company_name || 'Empresa'}
                          </p>
                          {conversation.lastMessage && (
                            <p className="text-[10px] text-slate-500 truncate mt-2 font-medium">
                              {conversation.lastMessage.sender_type === 'company' ? 'Empresa: ' : 'Voce: '}
                              {conversation.lastMessage.content || conversation.lastMessage.message}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-end shrink-0 gap-2">
                          {conversation.lastMessage && (
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                              {new Date(conversation.lastMessage.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                          {conversation.unreadCount > 0 && (
                            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="px-8 pt-8 pb-6 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={onBackToConversations}
                      className="w-8 h-8 rounded-full border border-slate-100 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-[#533af6] transition-colors cursor-pointer shrink-0"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <div className="min-w-0">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate max-w-[200px]">
                        {selectedConversation.job?.title}
                      </h3>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 truncate max-w-[200px]">
                        {selectedConversation.job?.company_name || 'Empresa'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full border border-slate-100 hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#533af6] transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="flex-1 p-6 flex flex-col space-y-4 overflow-y-auto bg-slate-50/30">
                  {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                      <Activity className="animate-spin text-[#533af6] mb-2" size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Carregando mensagens...</span>
                    </div>
                  ) : (
                    <div className="space-y-3 flex flex-col">
                      {messages.map((message, idx) => {
                        const isCandidate = message.sender_type === 'candidate';

                        return (
                          <div
                            key={message.id || idx}
                            className={`flex flex-col max-w-[80%] ${isCandidate ? 'self-end items-end' : 'self-start items-start'}`}
                          >
                            <div
                              className={`px-4 py-3 rounded-[18px] text-xs font-semibold ${
                                isCandidate
                                  ? 'bg-[#533af6] text-white rounded-tr-none'
                                  : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-3xs'
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words">{message.content || message.message}</p>
                            </div>
                            <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-widest mt-1 px-1">
                              {new Date(message.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-slate-100 bg-white flex items-center gap-2 shrink-0">
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(event) => onMessageTextChange(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !isSendingMessage) {
                        onSendMessage();
                      }
                    }}
                    placeholder="Digite sua resposta..."
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all"
                    disabled={isSendingMessage}
                  />
                  <button
                    type="button"
                    onClick={onSendMessage}
                    disabled={isSendingMessage || !newMessageText.trim()}
                    className="px-4 py-2.5 bg-[#533af6] hover:bg-[#4326e5] text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shrink-0"
                  >
                    {isSendingMessage ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
