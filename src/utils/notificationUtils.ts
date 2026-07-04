import { supabase } from '../lib/supabase';
import { NOTIFICATION_COLUMNS } from '../services/queryColumns';

export interface ColaborhNotification {
  id: string;
  user_id: string;
  user_type: 'candidate' | 'company';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  job_id?: string;
}

const STORAGE_KEY = 'colaborh_notifications_fallback';

// Helper to get local storage notifications
const getLocalNotifications = (): ColaborhNotification[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading local notifications:', e);
    return [];
  }
};

// Helper to save local storage notifications
const saveLocalNotifications = (list: ColaborhNotification[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Error saving local notifications:', e);
  }
};

export const createNotification = async (
  userId: string,
  userType: 'candidate' | 'company',
  title: string,
  message: string,
  jobId?: string
): Promise<ColaborhNotification> => {
  const cleanUserId = (userId || '').trim().toLowerCase();
  const newNotif: ColaborhNotification = {
    id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : String(Date.now() + Math.random()),
    user_id: cleanUserId,
    user_type: userType,
    title,
    message,
    read: false,
    created_at: new Date().toISOString(),
    job_id: jobId
  };

  // Try Supabase first. localStorage is only a fallback when persistence fails.
  if (import.meta.env.VITE_SUPABASE_URL) {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([
          {
            id: newNotif.id,
            user_id: newNotif.user_id,
            user_type: newNotif.user_type,
            title: newNotif.title,
            message: newNotif.message,
            read: newNotif.read,
            created_at: newNotif.created_at,
            job_id: newNotif.job_id
          }
        ]);

      if (error) {
        console.warn('Supabase notifications insert error, using localStorage fallback:', error);
      } else {
        return newNotif;
      }
    } catch (e) {
      console.warn('Supabase notifications connection error, using localStorage fallback:', e);
    }
  }

  const localList = getLocalNotifications();
  localList.unshift(newNotif);
  saveLocalNotifications(localList);

  return newNotif;
};

export const getNotifications = async (
  userId: string,
  userType: 'candidate' | 'company'
): Promise<ColaborhNotification[]> => {
  const cleanUserId = (userId || '').trim().toLowerCase();

  // Try Supabase first
  if (import.meta.env.VITE_SUPABASE_URL) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(NOTIFICATION_COLUMNS)
        .eq('user_id', cleanUserId)
        .eq('user_type', userType)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data;
      }
      console.warn('Supabase notifications select error, using localStorage fallback:', error);
    } catch (e) {
      console.warn('Supabase notifications connection error, using localStorage fallback:', e);
    }
  }

  // Fallback to local storage (filtered by user_id and user_type)
  const localList = getLocalNotifications();
  return localList.filter(
    (n) => n.user_id === cleanUserId && n.user_type === userType
  );
};

const mergeNotifications = (lists: ColaborhNotification[][]) =>
  Array.from(
    new Map(lists.flat().map((notification) => [notification.id, notification])).values()
  ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

export const getCompanyNotifications = async (
  userIds: string[],
  jobIds: string[]
): Promise<ColaborhNotification[]> => {
  const cleanUserIds = Array.from(
    new Set(userIds.map((id) => (id || '').trim().toLowerCase()).filter(Boolean))
  );
  const cleanJobIds = Array.from(
    new Set(jobIds.map((id) => (id || '').trim()).filter(Boolean))
  );

  const lists: ColaborhNotification[][] = [];

  if (cleanUserIds.length > 0) {
    lists.push(...await Promise.all(cleanUserIds.map((userId) => getNotifications(userId, 'company'))));
  }

  if (import.meta.env.VITE_SUPABASE_URL && cleanJobIds.length > 0) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(NOTIFICATION_COLUMNS)
        .eq('user_type', 'company')
        .in('job_id', cleanJobIds)
        .order('created_at', { ascending: false });

      if (!error && data) {
        lists.push(data);
      } else {
        console.warn('Supabase company notifications by job select error:', error);
      }
    } catch (e) {
      console.warn('Supabase company notifications by job connection error:', e);
    }
  }

  const localList = getLocalNotifications();
  lists.push(localList.filter((n) =>
    n.user_type === 'company' &&
    (
      cleanUserIds.includes((n.user_id || '').trim().toLowerCase()) ||
      Boolean(n.job_id && cleanJobIds.includes(n.job_id))
    )
  ));

  return mergeNotifications(lists);
};

export const markAllNotificationsAsRead = async (
  userId: string,
  userType: 'candidate' | 'company'
): Promise<void> => {
  const cleanUserId = (userId || '').trim().toLowerCase();

  // Update local storage
  const localList = getLocalNotifications();
  const updatedLocal = localList.map((n) =>
    n.user_id === cleanUserId && n.user_type === userType ? { ...n, read: true } : n
  );
  saveLocalNotifications(updatedLocal);

  // Update Supabase
  if (import.meta.env.VITE_SUPABASE_URL) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', cleanUserId)
        .eq('user_type', userType);

      if (error) {
        console.warn('Supabase notifications mark read error:', error);
      }
    } catch (e) {
      console.warn('Supabase notifications mark read connection error:', e);
    }
  }
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  // Update local storage
  const localList = getLocalNotifications();
  const updatedLocal = localList.map((n) =>
    n.id === id ? { ...n, read: true } : n
  );
  saveLocalNotifications(updatedLocal);

  // Update Supabase
  if (import.meta.env.VITE_SUPABASE_URL) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) {
        console.warn('Supabase notification individual mark read error:', error);
      }
    } catch (e) {
      console.warn('Supabase notification individual mark read connection error:', e);
    }
  }
};

export const markNotificationsAsReadByIds = async (ids: string[]): Promise<void> => {
  const uniqueIds = Array.from(new Set(ids.filter(Boolean)));
  if (uniqueIds.length === 0) return;

  const localList = getLocalNotifications();
  const updatedLocal = localList.map((n) =>
    uniqueIds.includes(n.id) ? { ...n, read: true } : n
  );
  saveLocalNotifications(updatedLocal);

  if (import.meta.env.VITE_SUPABASE_URL) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', uniqueIds);

      if (error) {
        console.warn('Supabase notifications mark by ids error:', error);
      }
    } catch (e) {
      console.warn('Supabase notifications mark by ids connection error:', e);
    }
  }
};

export const deleteNotification = async (id: string): Promise<void> => {
  // Update local storage
  const localList = getLocalNotifications();
  const updatedLocal = localList.filter((n) => n.id !== id);
  saveLocalNotifications(updatedLocal);

  // Update Supabase
  if (import.meta.env.VITE_SUPABASE_URL) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('Supabase notification delete error:', error);
      }
    } catch (e) {
      console.warn('Supabase notification delete connection error:', e);
    }
  }
};
