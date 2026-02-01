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

// --- Helper: Status Config (Centralized) ---
const getStatusConfig = (status: string) => {
  switch (status) {
    case 'on-time':
      return { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200', dot: 'bg-emerald-500' };
    case 'late':
      return { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200', dot: 'bg-amber-500' };
    case 'half-day':
      return { icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-100', border: 'border-rose-200', dot: 'bg-rose-500' };
    default:
      return { icon: Clock, color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200', dot: 'bg-slate-400' };
  }
};

// --- Sub-Component: Timeline Row ---
const TimelineItem = ({ record, index }: { record: AttendanceRecord; index: number }) => {
  const config = getStatusConfig(record.status);
  const checkIn = new Date(record.checkIn);
  const checkOut = record.checkOut ? new Date(record.checkOut) : null;
  const isLast = index === 0; // Top item

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative pl-8 pb-8 last:pb-0"
    >
      {/* Timeline Line */}
      <div className="absolute left-3 top-3 bottom-0 w-px bg-slate-200 last:hidden" />
      
      {/* Timeline Dot */}
      <div className={cn(
        "absolute left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-white ring-1 ring-slate-100",
        config.dot
      )} />

      <div className="bg-white rounded-lg border border-slate-100 hover:border-slate-300 hover:shadow-sm transition-all p-3 group">
        <div className="flex items-center justify-between">
          
          {/* Left: Date & Status */}
          <div className="flex items-center gap-3">
             <div className={cn("p-2 rounded-md", config.bg)}>
                <config.icon className={cn("h-4 w-4", config.color)} />
             </div>
             <div>
               <div className="flex items-center gap-2">
                 <h4 className="text-sm font-semibold text-slate-900">
                    {checkIn.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                 </h4>
                 <span className={cn("text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border", config.bg, config.color, config.border)}>
                   {record.status}
                 </span>
               </div>
               <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" />
                  <span className="tabular-nums">
                    {checkIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {checkOut && (
                    <>
                      <ArrowRight className="w-3 h-3 text-slate-300" />
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
             <div className="text-sm font-mono font-medium text-slate-900 tabular-nums">
                {record.duration ? formatDuration(record.duration) : '--:--:--'}
             </div>
             <div className="text-xs text-slate-400">Duration</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Component ---
export const AttendanceHistory = ({ records }: AttendanceHistoryProps) => {
  
  // Performance: Memoize Stats
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
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
        <div className="p-3 bg-white rounded-full shadow-sm mb-3">
          <History className="h-6 w-6 text-slate-300" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900">No history found</h3>
        <p className="text-xs text-slate-500 max-w-[200px] mt-1">
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
          <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 flex items-center justify-between">
             <div className="flex items-center gap-2">
               <TrendingUp className="h-4 w-4 text-blue-500" />
               <span className="text-xs font-medium text-blue-700">Avg. Duration</span>
             </div>
             <span className="text-lg font-bold text-blue-900 tabular-nums">{stats.avg.toFixed(1)}h</span>
          </div>
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3 flex items-center justify-between">
             <div className="flex items-center gap-2">
               <CheckCircle2 className="h-4 w-4 text-emerald-500" />
               <span className="text-xs font-medium text-emerald-700">On Time Rate</span>
             </div>
             <span className="text-lg font-bold text-emerald-900 tabular-nums">{stats.rate.toFixed(0)}%</span>
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