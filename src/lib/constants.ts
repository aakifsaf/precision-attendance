export const STATUS_COLORS = {
  'on-time': 'border-emerald-200 bg-emerald-50 text-emerald-800',
  'late': 'border-amber-200 bg-amber-50 text-amber-800',
  'half-day': 'border-rose-200 bg-rose-50 text-rose-800',
  'active': 'border-emerald-200 bg-emerald-50 text-emerald-800',
  'idle': 'border-gray-200 bg-gray-50 text-gray-800',
} as const;

export const SHIFT_CONFIG = {
  MORNING_START: '09:00',
  LATE_THRESHOLD: '09:00',
  HALF_DAY_THRESHOLD: '10:30',
  WORK_HOURS_PER_DAY: 8,
} as const;

export const EMPLOYEE_DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'HR',
  'Design',
  'Operations',
  'Finance',
  'Customer Support',
] as const;