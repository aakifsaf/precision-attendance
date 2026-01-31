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