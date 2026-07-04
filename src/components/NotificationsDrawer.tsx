import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Bell, BellOff, Check, Clock3, Trash2, X } from 'lucide-react';
import { ColaborhNotification } from '../utils/notificationUtils';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: ColaborhNotification[];
  onMarkAllAsRead: () => Promise<void>;
  onMarkAsRead: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

type NotificationFilter = 'all' | 'unread';

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
  } catch {
    return '';
  }
};

export const NotificationsDrawer = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onMarkAsRead,
  onDelete,
}: NotificationsDrawerProps) => {
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('unread');
  const unreadCount = notifications.filter(notification => !notification.read).length;

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'unread') {
      return notifications.filter(notification => !notification.read);
    }

    return notifications;
  }, [activeFilter, notifications]);

  const tabs = [
    { id: 'unread' as const, label: 'Novas', count: unreadCount },
    { id: 'all' as const, label: 'Todas', count: notifications.length },
  ];

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
            className="company-dashboard-surface relative z-10 flex h-full w-full max-w-lg flex-col overflow-hidden border-l border-slate-200/70 bg-[#fbf9ff] text-left shadow-[0_24px_70px_rgba(15,23,42,0.16)]"
          >
            <header className="shrink-0 px-6 pb-4 pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#940dff]/18 bg-[#f3e5ff] text-[#940dff]">
                      <Bell size={19} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-[20px] font-semibold tracking-tight text-[#343241]">Notificações</h2>
                      <p className="mt-1 text-[12px] font-medium text-slate-400">
                        {unreadCount > 0 ? `${unreadCount} ${unreadCount === 1 ? 'notificação nova' : 'notificações novas'}` : 'Nenhuma notificação nova'}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200/70 bg-white text-slate-400 shadow-sm transition-all hover:border-[#940dff]/20 hover:text-[#940dff] active:scale-95"
                  aria-label="Fechar notificações"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-3">
                  {tabs.map(tab => {
                    const isActive = activeFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveFilter(tab.id)}
                        className={`relative flex h-[38px] min-w-[132px] items-center justify-center gap-2 bg-transparent px-4 py-2 text-[12px] font-semibold transition-colors ${
                          isActive ? 'text-[#940dff]' : 'text-slate-500 hover:text-[#940dff]'
                        }`}
                      >
                        <span className="truncate">{tab.label}</span>
                        <span className={`text-[11px] font-semibold ${isActive ? 'text-current' : 'text-slate-400'}`}>
                          {tab.count}
                        </span>
                        {isActive && (
                          <motion.span
                            layoutId="notifications-filter-tab-underline"
                            className="absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-[#940dff]"
                            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={onMarkAllAsRead}
                    className="flex h-8 items-center gap-2 rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12 active:scale-95"
                  >
                    <Check size={14} />
                    Marcar lidas
                  </button>
                )}
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
              {filteredNotifications.length === 0 ? (
                <div className="flex h-full min-h-[360px] flex-col items-center justify-center rounded-2xl border border-slate-200/70 bg-white/80 px-8 text-center shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200/70 bg-white text-slate-300 shadow-sm">
                    <BellOff size={24} />
                  </div>
                  <p className="text-[14px] font-semibold text-[#343241]">Tudo limpo por aqui</p>
                  <p className="mt-2 max-w-[250px] text-[12px] font-medium leading-5 text-slate-400">
                    {activeFilter === 'unread'
                      ? 'Você não possui notificações pendentes de leitura.'
                      : 'Você não possui notificações no momento.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/85 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
                  <div className="divide-y divide-slate-100/80">
                    {filteredNotifications.map((notification) => {
                      const isUnread = !notification.read;

                      return (
                        <article
                          key={notification.id}
                          onClick={() => isUnread && onMarkAsRead(notification.id)}
                          className="group relative flex cursor-pointer items-start gap-4 px-5 py-4 transition-colors hover:bg-[#fbf9ff]"
                        >
                          <span className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border ${isUnread ? 'border-[#940dff]/18 bg-[#f3e5ff] text-[#940dff]' : 'border-slate-200/70 bg-white text-slate-400'}`}>
                            <Bell size={16} />
                          </span>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h3 className={`truncate text-[13px] font-semibold ${isUnread ? 'text-[#343241]' : 'text-slate-500'}`}>
                                  {notification.title}
                                </h3>
                                <p className="mt-1 text-[12px] font-medium leading-5 text-slate-500">
                                  {notification.message}
                                </p>
                              </div>
                              {isUnread && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#940dff]" />}
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-3">
                              <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                                <Clock3 size={12} />
                                {formatTimeAgo(notification.created_at)}
                              </span>

                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onDelete(notification.id);
                                }}
                                className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#ff4b8c]/18 bg-[#ff4b8c]/10 text-[#ff4b8c] opacity-80 transition-all hover:border-[#ff4b8c]/30 hover:bg-[#ff4b8c]/14 hover:opacity-100 active:scale-95"
                                title="Excluir"
                                aria-label="Excluir notificação"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};