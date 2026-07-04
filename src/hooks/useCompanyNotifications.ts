import { useCallback, useEffect, useState } from 'react';
import {
  ColaborhNotification,
  getCompanyNotifications,
  markNotificationsAsReadByIds,
} from '../utils/notificationUtils';

type CompanyLike = {
  id?: string;
  nomeFantasia?: string;
};

type JobLike = {
  id?: string;
};

export const useCompanyNotifications = (
  selectedCompany: CompanyLike | null | undefined,
  companyJobs: JobLike[]
) => {
  const [notifications, setNotifications] = useState<ColaborhNotification[]>([]);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState(false);
  const selectedCompanyId = selectedCompany?.id;
  const selectedCompanyName = selectedCompany?.nomeFantasia;
  const companyJobIds = companyJobs
    .map((job) => job.id)
    .filter((id): id is string => Boolean(id));
  const companyJobIdsKey = companyJobIds.join('|');

  const loadCompanyNotifications = useCallback(async () => {
    if (!selectedCompanyId && !selectedCompanyName) {
      setNotifications([]);
      return;
    }

    try {
      const notificationUserIds = [
        selectedCompanyId && selectedCompanyId !== 'new' ? selectedCompanyId : null,
        selectedCompanyName || null,
      ].filter((id): id is string => Boolean(id));

      setNotifications(await getCompanyNotifications(notificationUserIds, companyJobIds));
    } catch (e) {
      console.error('Erro ao carregar notificacoes da empresa:', e);
    }
  }, [selectedCompanyId, selectedCompanyName, companyJobIdsKey]);

  const markAllCompanyNotificationsAsRead = useCallback(async () => {
    await markNotificationsAsReadByIds(notifications.map((notification) => notification.id));
    await loadCompanyNotifications();
  }, [loadCompanyNotifications, notifications]);

  useEffect(() => {
    loadCompanyNotifications();

    const interval = window.setInterval(() => {
      loadCompanyNotifications();
    }, 8000);

    return () => window.clearInterval(interval);
  }, [loadCompanyNotifications]);

  return {
    notifications,
    isNotificationsDrawerOpen,
    setIsNotificationsDrawerOpen,
    loadCompanyNotifications,
    markAllCompanyNotificationsAsRead,
  };
};
