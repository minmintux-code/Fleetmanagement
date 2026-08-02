import api from './api';
import { Customer, CustomerFilterParams } from '../types';

export const customerService = {
  async getCustomers(params?: CustomerFilterParams): Promise<Customer[]> {
    try {
      const res = await api.get<Customer[]>('/customers', { params });
      return res.data || [];
    } catch {
      return [];
    }
  },

  async createCustomer(data: Partial<Customer>): Promise<Customer> {
    const res = await api.post<Customer>('/customers', data);
    return res.data;
  },
};
