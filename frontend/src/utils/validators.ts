import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export const vehicleSchema = z.object({
  vin: z.string().min(17, 'VIN must be 17 characters').max(17),
  plateNumber: z.string().min(2, 'License plate is required'),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.coerce.number().min(1990).max(new Date().getFullYear() + 1),
  type: z.enum(['TRUCK', 'VAN', 'SEDAN', 'SUV', 'TRAILER', 'BUS']),
  fuelType: z.enum(['DIESEL', 'PETROL', 'ELECTRIC', 'HYBRID']),
  status: z.enum(['AVAILABLE', 'IN_TRANSIT', 'IN_MAINTENANCE', 'OUT_OF_SERVICE', 'RENTED']),
  mileage: z.coerce.number().min(0, 'Mileage cannot be negative'),
  fuelCapacity: z.coerce.number().min(1, 'Capacity must be greater than 0'),
  currentFuelLevel: z.coerce.number().min(0).max(100),
  location: z.string().optional(),
});

export const driverSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number is required'),
  licenseNumber: z.string().min(4, 'License number is required'),
  licenseCategory: z.enum(['CLASS_A', 'CLASS_B', 'CLASS_C', 'COMMERCIAL_CDL']),
  licenseExpiryDate: z.string().min(1, 'Expiry date is required'),
  status: z.enum(['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED']),
  safetyScore: z.coerce.number().min(0).max(100),
});

export const tripSchema = z.object({
  tripCode: z.string().min(2, 'Trip code is required'),
  vehicleId: z.string().min(1, 'Vehicle selection is required'),
  driverId: z.string().min(1, 'Driver selection is required'),
  origin: z.string().min(2, 'Origin address is required'),
  destination: z.string().min(2, 'Destination address is required'),
  scheduledDeparture: z.string().min(1, 'Departure time is required'),
  scheduledArrival: z.string().min(1, 'Arrival time is required'),
  distanceKm: z.coerce.number().min(1, 'Distance must be at least 1 km'),
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DELAYED']),
  cargoDescription: z.string().optional(),
  notes: z.string().optional(),
});

export const fuelSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle selection is required'),
  driverId: z.string().min(1, 'Driver selection is required'),
  liters: z.coerce.number().min(0.1, 'Liters must be greater than 0'),
  costPerLiter: z.coerce.number().min(0.01, 'Cost per liter must be valid'),
  odometerReading: z.coerce.number().min(0, 'Odometer must be non-negative'),
  stationName: z.string().min(2, 'Station name is required'),
  fuelCardNumber: z.string().optional(),
  filledAt: z.string().min(1, 'Date and time required'),
  notes: z.string().optional(),
});

export const maintenanceSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle is required'),
  type: z.enum(['PREVENTIVE', 'CORRECTIVE', 'INSPECTION', 'REPAIR', 'TIRE_SERVICE']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  description: z.string().min(5, 'Detailed description is required'),
  serviceCenter: z.string().min(2, 'Service center name is required'),
  technicianName: z.string().optional(),
  estimatedCost: z.coerce.number().min(0),
  actualCost: z.coerce.number().optional(),
  scheduledDate: z.string().min(1, 'Scheduled date is required'),
  odometerReading: z.coerce.number().min(0),
  notes: z.string().optional(),
});

export const expenseSchema = z.object({
  expenseNumber: z.string().min(2, 'Expense number required'),
  category: z.enum(['FUEL', 'MAINTENANCE', 'TOLL', 'INSURANCE', 'PERMIT', 'DRIVER_ALLOWANCE', 'MISCELLANEOUS']),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  vehicleId: z.string().optional(),
  incurredDate: z.string().min(1, 'Incurred date is required'),
  vendorName: z.string().optional(),
  receiptNumber: z.string().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  notes: z.string().optional(),
});

export const customerSchema = z.object({
  name: z.string().min(2, 'Contact name required'),
  companyName: z.string().min(2, 'Company name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(6, 'Phone required'),
  address: z.string().min(5, 'Address required'),
  taxId: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export const rentalSchema = z.object({
  rentalCode: z.string().min(2, 'Rental code required'),
  customerId: z.string().min(1, 'Customer selection required'),
  vehicleId: z.string().min(1, 'Vehicle selection required'),
  startDate: z.string().min(1, 'Start date required'),
  endDate: z.string().min(1, 'End date required'),
  dailyRate: z.coerce.number().min(1, 'Daily rate required'),
  depositAmount: z.coerce.number().min(0),
  status: z.enum(['RESERVED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'OVERDUE']),
  notes: z.string().optional(),
});
