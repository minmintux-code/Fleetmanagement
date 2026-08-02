import api from './api';
import { MaintenanceRecord, MaintenanceFilterParams } from '../types';

export const maintenanceService = {
  async getRecords(params?: MaintenanceFilterParams): Promise<MaintenanceRecord[]> {
    try {
      const res = await api.get<MaintenanceRecord[]>('/maintenance', { params });
      return res.data || [];
    } catch {
      return [];
    }
  },

  async createRecord(data: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> {
    const res = await api.post<MaintenanceRecord>('/maintenance', data);
    return res.data;
  },
};
