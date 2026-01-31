export type UserRole = 'staff' | 'admin';

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  checkIn: string;
  checkOut?: string;
  duration?: number;
  status: 'on-time' | 'late' | 'half-day';
  date: string;
  shiftType?: 'morning' | 'afternoon' | 'night';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar?: string;
}

export interface ActiveSession {
  userId: string;
  startTime: string;
  lastPing?: string;
  status: 'active' | 'idle';
}

export interface DashboardStats {
  totalEmployees: number;
  activeNow: number;
  lateToday: number;
  averageHours: number;
}