import api from './api';
import { Rental, RentalFilterParams } from '../types';

export const rentalService = {
  async getRentals(params?: RentalFilterParams): Promise<Rental[]> {
    try {
      const res = await api.get<Rental[]>('/rentals', { params });
      return res.data || [];
    } catch {
      return [];
    }
  },

  async createRental(data: Partial<Rental>): Promise<Rental> {
    const res = await api.post<Rental>('/rentals', data);
    return res.data;
  },
};
