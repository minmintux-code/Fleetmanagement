export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (val: number): string => {
  return new Intl.NumberFormat('en-IN').format(val);
};

export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateStr?: string): string => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDistance = (km: number): string => {
  return `${formatNumber(km)} km`;
};

/**
 * Converts a SNAKE_CASE or UPPER_CASE DB enum value into a human-readable Title Case string.
 * Examples: "IN_TRANSIT" → "In Transit",  "COMMERCIAL_CDL" → "Commercial CDL"
 */
export const humanizeLabel = (value?: string | null): string => {
  if (!value) return 'N/A';
  // Special-case well-known acronyms
  const acronyms = new Set(['CDL', 'SUV', 'VIN', 'ID', 'ETA', 'KM']);
  return value
    .split('_')
    .map((word) => {
      const upper = word.toUpperCase();
      if (acronyms.has(upper)) return upper;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

/** Lookup map for fuel types */
export const FUEL_TYPE_LABELS: Record<string, string> = {
  DIESEL: 'Diesel',
  PETROL: 'Petrol',
  ELECTRIC: 'Electric',
  HYBRID: 'Hybrid',
  CNG: 'CNG',
  LPG: 'LPG',
};

/** Lookup map for license categories */
export const LICENSE_CATEGORY_LABELS: Record<string, string> = {
  CLASS_A: 'Class A',
  CLASS_B: 'Class B',
  CLASS_C: 'Class C',
  COMMERCIAL_CDL: 'Commercial CDL',
};

/** Lookup map for vehicle types */
export const VEHICLE_TYPE_LABELS: Record<string, string> = {
  TRUCK: 'Truck',
  VAN: 'Van',
  SEDAN: 'Sedan',
  SUV: 'SUV',
  TRAILER: 'Trailer',
  BUS: 'Bus',
  PICKUP: 'Pickup',
  MINIVAN: 'Minivan',
};

/** Lookup map for maintenance types */
export const MAINTENANCE_TYPE_LABELS: Record<string, string> = {
  OIL_CHANGE: 'Oil Change',
  TIRE_ROTATION: 'Tire Rotation',
  BRAKE_INSPECTION: 'Brake Inspection',
  ENGINE_REPAIR: 'Engine Repair',
  TRANSMISSION_SERVICE: 'Transmission Service',
  GENERAL_SERVICE: 'General Service',
  ELECTRICAL: 'Electrical',
  BODY_REPAIR: 'Body Repair',
};

/** Lookup map for expense categories */
export const EXPENSE_CATEGORY_LABELS: Record<string, string> = {
  FUEL: 'Fuel',
  MAINTENANCE: 'Maintenance',
  TOLL: 'Toll',
  INSURANCE: 'Insurance',
  SALARY: 'Salary',
  PARTS: 'Parts',
  OTHER: 'Other',
};

/**
 * Generic label resolver: tries an explicit lookup map first, falls back to humanizeLabel.
 */
export const resolveLabel = (
  value: string | undefined | null,
  map?: Record<string, string>
): string => {
  if (!value) return 'N/A';
  if (map && map[value]) return map[value];
  return humanizeLabel(value);
};
