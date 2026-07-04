import { useCallback, useEffect, useState } from 'react';
import {
  ColaborhNotification,
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../utils/notificationUtils';

export const useCandidateNotifications = (candidateEmail?: string) => {
  const [notifications, setNotifications] = useState<ColaborhNotification[]>([]);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState(false);

  const loadCandidateNotifications = useCallback(async () => {
    if (!candidateEmail) {
      setNotifications([]);
      return;
    }

    try {
      const list = await getNotifications(candidateEmail, 'candidate');
      setNotifications(list);
    } catch (error) {
      console.error('Erro ao carregar notificacoes do candidato:', error);
    }
  }, [candidateEmail]);

  const markAllCandidateNotificationsAsRead = useCallback(async () => {
    if (!candidateEmail) return;
    await markAllNotificationsAsRead(candidateEmail, 'candidate');
    await loadCandidateNotifications();
  }, [candidateEmail, loadCandidateNotifications]);

  const markCandidateNotificationAsRead = useCallback(async (notificationId: string) => {
    await markNotificationAsRead(notificationId);
    await loadCandidateNotifications();
  }, [loadCandidateNotifications]);

  const deleteCandidateNotification = useCallback(async (notificationId: string) => {
    await deleteNotification(notificationId);
    await loadCandidateNotifications();
  }, [loadCandidateNotifications]);

  useEffect(() => {
    loadCandidateNotifications();

    const interval = window.setInterval(() => {
      loadCandidateNotifications();
    }, 8000);

    return () => window.clearInterval(interval);
  }, [loadCandidateNotifications]);

  return {
    notifications,
    isNotificationsDrawerOpen,
    setIsNotificationsDrawerOpen,
    loadCandidateNotifications,
    markAllCandidateNotificationsAsRead,
    markCandidateNotificationAsRead,
    deleteCandidateNotification,
  };
};
