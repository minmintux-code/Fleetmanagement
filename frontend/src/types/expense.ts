export type ExpenseCategory = 'FUEL' | 'MAINTENANCE' | 'TOLL' | 'INSURANCE' | 'PERMIT' | 'DRIVER_ALLOWANCE' | 'MISCELLANEOUS';

export interface Expense {
  id: string;
  expenseNumber: string;
  category: ExpenseCategory;
  amount: number;
  vehicleId?: string;
  vehiclePlate?: string;
  tripId?: string;
  driverId?: string;
  incurredDate: string;
  vendorName?: string;
  receiptNumber?: string;
  approvedBy?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes?: string;
}

export interface ExpenseFilterParams {
  search?: string;
  category?: ExpenseCategory;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}
