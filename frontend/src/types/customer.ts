export interface Customer {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
  status: 'ACTIVE' | 'INACTIVE';
  totalBookings: number;
  totalSpent: number;
  createdAt: string;
}

export interface CustomerFilterParams {
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}
