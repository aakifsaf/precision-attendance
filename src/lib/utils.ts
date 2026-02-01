import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours === 0) {
    return `${minutes}m`;
  }
  return `${hours}h ${minutes}m`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'on-time': 'border-emerald-200 bg-emerald-50 text-emerald-700',
    'late': 'border-amber-200 bg-amber-50 text-amber-700',
    'half-day': 'border-rose-200 bg-rose-50 text-rose-700',
    'active': 'border-emerald-200 bg-emerald-50 text-emerald-700',
    'idle': 'border-gray-200 bg-gray-50 text-gray-700',
  };
  
  return colors[status] || colors['idle'];
}

import { AttendanceRecord } from "@/types";

// Helper to format seconds into HH:MM:SS
const formatDurationCSV = (seconds?: number) => {
  if (!seconds) return '--:--:--';
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

export const downloadAttendanceCSV = (data: AttendanceRecord[], filename = 'attendance-report.csv') => {
  // 1. Define Headers
  const headers = [
    'Date',
    'Employee ID',
    'Employee Name',
    'Check In Time',
    'Check Out Time',
    'Duration',
    'Status',
    'Shift Status' // Derived active/completed
  ];

  // 2. Map Data to Rows
  const rows = data.map(record => {
    const checkInDate = new Date(record.checkIn);
    const checkOutDate = record.checkOut ? new Date(record.checkOut) : null;
    
    return [
      record.date,
      record.userId,
      `"${record.userName}"`,
      checkInDate.toLocaleTimeString(),
      checkOutDate ? checkOutDate.toLocaleTimeString() : 'Active',
      record.duration ? formatDurationCSV(record.duration) : '-',
      record.status.toUpperCase(),
      record.checkOut ? 'COMPLETED' : 'ACTIVE NOW'
    ].join(',');
  });

  // 3. Construct CSV String with BOM (Byte Order Mark) for Excel compatibility
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');

  // 4. Create Blob and Trigger Download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};