import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X as CloseIcon, Bell, BellOff, Trash2, Check } from 'lucide-react';
import { ColaborhNotification } from '../utils/notificationUtils';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: ColaborhNotification[];
  onMarkAllAsRead: () => Promise<void>;
  onMarkAsRead: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const NotificationsDrawer = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onMarkAsRead,
  onDelete
}: NotificationsDrawerProps) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTimeAgo = (dateStr: string) => {
    try {
      const now = new Date();
      const date = new Date(dateStr);
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Agora mesmo';
      if (diffMins < 60) return `Há ${diffMins} min`;
      if (diffHours < 24) return `Há ${diffHours} h`;
      if (diffDays === 1) return 'Ontem';
      if (diffDays < 7) return `Há ${diffDays} dias`;
      return date.toLocaleDateString('pt-BR');
    } catch (e) {
      return '';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          {/* Content Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="relative w-full max-w-md bg-white rounded-none shadow-2xl p-8 overflow-hidden flex flex-col h-full border-l border-slate-100/85 z-10 text-left"
          >
            {/* Header Accent Line */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#7b39ec] to-indigo-600" />

            {/* Drawer Header */}
            <div className="flex justify-between items-center mb-6 mt-2 shrink-0">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <Bell size={16} className="text-[#7b39ec] animate-bounce" />
                  Notificações
                </h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  {unreadCount > 0 ? `${unreadCount} novas mensagens` : 'Nenhuma nova notificação'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-slate-100 hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <CloseIcon size={14} />
              </button>
            </div>

            {/* Mark All as Read Button */}
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="mb-4 text-[10px] font-black uppercase tracking-wider text-[#7b39ec] hover:text-[#6329cc] flex items-center gap-1.5 transition-colors self-start cursor-pointer py-1 px-2.5 rounded-lg hover:bg-purple-50/65"
              >
                <Check size={12} className="stroke-[3]" />
                Marcar todas como lidas
              </button>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-1 min-h-0">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4 border border-slate-100/60 shadow-inner">
                    <BellOff size={24} />
                  </div>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Tudo limpo por aqui!</p>
                  <p className="text-slate-300 text-xs mt-1 leading-normal max-w-[200px]">Você não possui nenhuma notificação no momento.</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => !notif.read && onMarkAsRead(notif.id)}
                    className={`relative p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                      !notif.read
                        ? 'bg-purple-50/20 border-purple-100 hover:border-purple-200/80 shadow-xs'
                        : 'bg-white border-slate-100 hover:border-slate-200/80'
                    }`}
                  >
                    {/* Left Unread Indicator Bar */}
                    {!notif.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#7b39ec] rounded-l-xl" />
                    )}

                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-extrabold text-xs text-slate-800 tracking-tight leading-tight truncate">
                            {notif.title}
                          </h4>
                          {!notif.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7b39ec] shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                          {notif.message}
                        </p>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mt-2">
                          {formatTimeAgo(notif.created_at)}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 shrink-0 mt-0.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(notif.id);
                          }}
                          className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
