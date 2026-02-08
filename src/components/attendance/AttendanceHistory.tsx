'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  XCircle,
  TrendingUp,
  History,
  ArrowRight
} from 'lucide-react';
import { AttendanceRecord } from '@/types';
import { cn, formatDuration } from '@/lib/utils';

interface AttendanceHistoryProps {
  records: AttendanceRecord[];
}

// --- Helper: Status Config (Centralized with Dark Mode) ---
const getStatusConfig = (status: string) => {
  switch (status) {
    case 'on-time':
      return { 
        icon: CheckCircle2, 
        color: 'text-emerald-600 dark:text-emerald-400', 
        bg: 'bg-emerald-100 dark:bg-emerald-500/10', 
        border: 'border-emerald-200 dark:border-emerald-500/20', 
        dot: 'bg-emerald-500 dark:bg-emerald-400' 
      };
    case 'late':
      return { 
        icon: AlertCircle, 
        color: 'text-amber-600 dark:text-amber-400', 
        bg: 'bg-amber-100 dark:bg-amber-500/10', 
        border: 'border-amber-200 dark:border-amber-500/20', 
        dot: 'bg-amber-500 dark:bg-amber-400' 
      };
    case 'half-day':
      return { 
        icon: XCircle, 
        color: 'text-rose-600 dark:text-rose-400', 
        bg: 'bg-rose-100 dark:bg-rose-500/10', 
        border: 'border-rose-200 dark:border-rose-500/20', 
        dot: 'bg-rose-500 dark:bg-rose-400' 
      };
    default:
      return { 
        icon: Clock, 
        color: 'text-slate-600 dark:text-slate-400', 
        bg: 'bg-slate-100 dark:bg-slate-800', 
        border: 'border-slate-200 dark:border-slate-700', 
        dot: 'bg-slate-400 dark:bg-slate-500' 
      };
  }
};

// --- Sub-Component: Timeline Row ---
const TimelineItem = ({ record, index }: { record: AttendanceRecord; index: number }) => {
  const config = getStatusConfig(record.status);
  const checkIn = new Date(record.checkIn);
  const checkOut = record.checkOut ? new Date(record.checkOut) : null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative pl-8 pb-8 last:pb-0"
    >
      {/* Timeline Line */}
      <div className="absolute left-3 top-3 bottom-0 w-px bg-slate-200 dark:bg-slate-800 last:hidden" />
      
      {/* Timeline Dot */}
      <div className={cn(
        "absolute left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900 ring-1 ring-slate-100 dark:ring-slate-800",
        config.dot
      )} />

      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all p-3 group">
        <div className="flex items-center justify-between">
          
          {/* Left: Date & Status */}
          <div className="flex items-center gap-3">
             <div className={cn("p-2 rounded-md", config.bg)}>
                <config.icon className={cn("h-4 w-4", config.color)} />
             </div>
             <div>
               <div className="flex items-center gap-2">
                 <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                    {checkIn.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                 </h4>
                 <span className={cn("text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border", config.bg, config.color, config.border)}>
                   {record.status}
                 </span>
               </div>
               <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" />
                  <span className="tabular-nums">
                    {checkIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {checkOut && (
                    <>
                      <ArrowRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
                      <span className="tabular-nums">
                        {checkOut.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </>
                  )}
               </div>
             </div>
          </div>

          {/* Right: Duration */}
          <div className="text-right">
             <div className="text-sm font-mono font-medium text-slate-900 dark:text-slate-200 tabular-nums">
                {record.duration ? formatDuration(record.duration) : '--:--:--'}
             </div>
             <div className="text-xs text-slate-400 dark:text-slate-500">Duration</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Component ---
export const AttendanceHistory = ({ records }: AttendanceHistoryProps) => {
  
  const stats = useMemo(() => {
    if (records.length === 0) return null;
    
    const totalHours = records.reduce((sum, r) => sum + (r.duration || 0) / 3600, 0);
    const avg = totalHours / records.length;
    const onTime = records.filter(r => r.status === 'on-time').length;
    const rate = (onTime / records.length) * 100;

    return { avg, rate };
  }, [records]);

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
        <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-3">
          <History className="h-6 w-6 text-slate-300 dark:text-slate-600" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200">No history found</h3>
        <p className="text-xs text-slate-500 dark:text-slate-500 max-w-[200px] mt-1">
          Records will appear here automatically after your first shift.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Compact Stats Header */}
      {stats && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-blue-50/50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-lg p-3 flex items-center justify-between">
             <div className="flex items-center gap-2">
               <TrendingUp className="h-4 w-4 text-blue-500 dark:text-blue-400" />
               <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Avg. Duration</span>
             </div>
             <span className="text-lg font-bold text-blue-900 dark:text-blue-100 tabular-nums">{stats.avg.toFixed(1)}h</span>
          </div>
          <div className="bg-emerald-50/50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-lg p-3 flex items-center justify-between">
             <div className="flex items-center gap-2">
               <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
               <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">On Time Rate</span>
             </div>
             <span className="text-lg font-bold text-emerald-900 dark:text-emerald-100 tabular-nums">{stats.rate.toFixed(0)}%</span>
          </div>
        </div>
      )}

      {/* Timeline List */}
      <div className="relative">
        {records.map((record, index) => (
          <TimelineItem key={record.id} record={record} index={index} />
        ))}
      </div>
    </div>
  );
};