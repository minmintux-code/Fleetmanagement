import api from './api';
import { SystemNotification } from '../types';

export const notificationService = {
  async getNotifications(): Promise<SystemNotification[]> {
    try {
      const res = await api.get<SystemNotification[]>('/notifications');
      return res.data || [];
    } catch {
      return [];
    }
  },

  async markAsRead(id: string): Promise<void> {
    await api.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.patch('/notifications/read-all');
  },
};
