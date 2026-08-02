import api from './api';
import { Expense, ExpenseFilterParams } from '../types';

export const expenseService = {
  async getExpenses(params?: ExpenseFilterParams): Promise<Expense[]> {
    try {
      const res = await api.get<Expense[]>('/expenses', { params });
      return res.data || [];
    } catch {
      return [];
    }
  },

  async createExpense(data: Partial<Expense>): Promise<Expense> {
    const res = await api.post<Expense>('/expenses', data);
    return res.data;
  },
};
