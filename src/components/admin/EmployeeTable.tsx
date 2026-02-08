'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User as UserIcon, 
  Mail, 
  Building, 
  Clock,
  Calendar,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react';
import { User, AttendanceRecord } from '@/types';
import { PulseIndicator } from '@/components/ui/PulseIndicator';
import { getStatusColor, formatDuration, cn } from '@/lib/utils';

// --- Types ---
interface EmployeeTableProps {
  employees: User[];
  attendanceData: AttendanceRecord[];
  loading: boolean;
}

// (Keep existing EmployeeStats interface and useEmployeeStats hook)
interface EmployeeStats {
  totalSessions: number;
  onTimeCount: number;
  lateCount: number;
  avgHours: number;
  lastRecord: AttendanceRecord | undefined;
  todaysRecord: AttendanceRecord | undefined;
  history: AttendanceRecord[];
}

const useEmployeeStats = (employees: User[], attendanceData: AttendanceRecord[]) => {
  return useMemo(() => {
    const statsMap = new Map<string, EmployeeStats>();
    const today = new Date().toISOString().split('T')[0];

    employees.forEach(emp => {
      statsMap.set(emp.id, {
        totalSessions: 0,
        onTimeCount: 0,
        lateCount: 0,
        avgHours: 0,
        lastRecord: undefined,
        todaysRecord: undefined,
        history: []
      });
    });

    attendanceData.forEach(record => {
      const stats = statsMap.get(record.userId);
      if (!stats) return;

      stats.history.push(record);
      stats.totalSessions++;
      
      if (record.date === today) stats.todaysRecord = record;
      if (record.status === 'on-time') stats.onTimeCount++;
      if (record.status === 'late' || record.status === 'half-day') stats.lateCount++;
    });

    statsMap.forEach(stats => {
      const totalHours = stats.history.reduce((sum, r) => sum + (r.duration || 0) / 3600, 0);
      stats.avgHours = stats.totalSessions > 0 ? totalHours / stats.totalSessions : 0;
      stats.history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });

    return statsMap;
  }, [employees, attendanceData]);
};

// --- Shared Helper for Expanded Content (Used in both Mobile & Desktop) ---
const ExpandedDetails = ({ employee, stats }: { employee: User; stats: EmployeeStats }) => (
  <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 bg-slate-50/50 dark:bg-slate-900/50">
    {/* Department Card */}
    <div className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-200 mb-3 md:mb-4">
        <Building className="h-4 w-4 text-slate-500 dark:text-slate-400" /> Department
      </h4>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Dept.</span>
          <span className="font-medium text-slate-900 dark:text-slate-200">{employee.department}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">ID</span>
          <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">{employee.id}</span>
        </div>
      </div>
    </div>

    {/* History Card */}
    <div className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm md:col-span-2">
      <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-200 mb-3 md:mb-4">
        <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" /> Recent History
      </h4>
      <div className="space-y-2 md:space-y-3">
        {stats.history.length > 0 ? (
          stats.history.slice(0, 3).map((record) => (
            <div key={record.id} className="flex items-center justify-between text-sm p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
                <span className="text-slate-400 text-xs hidden md:inline">
                  {new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit'})} - 
                  {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit'}) : ' ...'}
                </span>
              </div>
              <div className={cn(
                "px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium border capitalize",
                getStatusColor(record.status)
              )}>
                {record.status}
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-slate-400 italic py-2">No recent history</div>
        )}
      </div>
    </div>
  </div>
);

// --- Component: Mobile Employee Card ---
const MobileEmployeeCard = ({ 
  employee, 
  stats, 
  isActive, 
  isExpanded, 
  onToggle 
}: { 
  employee: User; 
  stats: EmployeeStats; 
  isActive: boolean; 
  isExpanded: boolean; 
  onToggle: () => void; 
}) => {
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden transition-all duration-300">
      <div 
        onClick={onToggle}
        className="p-4 flex items-center justify-between active:bg-slate-50 dark:active:bg-slate-800/50 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-slate-900 dark:bg-slate-700 flex items-center justify-center text-white font-semibold text-sm">
              {employee.avatar || employee.name.charAt(0)}
            </div>
            {isActive && (
              <div className="absolute -bottom-0.5 -right-0.5 border-2 border-white dark:border-slate-900 rounded-full">
                <div className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-pulse" />
              </div>
            )}
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-white text-sm">{employee.name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{employee.department}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           {/* Mini Status Pill */}
           <div className={cn(
             "px-2 py-1 rounded-md text-xs font-medium border",
             isActive 
               ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20"
               : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700"
           )}>
             {isActive ? 'Active' : 'Offline'}
           </div>
           
           <ChevronDown className={cn(
             "h-4 w-4 text-slate-400 transition-transform duration-200",
             isExpanded ? "rotate-180" : ""
           )} />
        </div>
      </div>

      {/* Stats Summary Bar (Always Visible on Card) */}
      <div className="px-4 pb-4 flex items-center gap-4 text-xs border-b border-slate-50 dark:border-slate-800/50">
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <Clock className="h-3.5 w-3.5 text-blue-500" />
          <span>{stats.todaysRecord?.duration ? formatDuration(stats.todaysRecord.duration) : '--:--'}</span>
        </div>
        <div className="h-3 w-px bg-slate-200 dark:bg-slate-700" />
        <div className="flex items-center gap-1.5">
           <span className="font-bold text-slate-900 dark:text-slate-200">{stats.onTimeCount}</span>
           <span className="text-slate-500">On Time</span>
        </div>
        <div className="flex items-center gap-1.5">
           <span className="font-bold text-amber-600 dark:text-amber-500">{stats.lateCount}</span>
           <span className="text-slate-500">Late</span>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-slate-100 dark:border-slate-800"
          >
            <ExpandedDetails employee={employee} stats={stats} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Component: Desktop Employee Row ---
const DesktopEmployeeRow = ({ 
  employee, 
  stats, 
  isExpanded, 
  onToggle 
}: { 
  employee: User; 
  stats: EmployeeStats; 
  isExpanded: boolean; 
  onToggle: () => void; 
}) => {
  const isActive = !!stats.todaysRecord && !stats.todaysRecord.checkOut;

  const calculateLiveDuration = (checkInStr: string) => {
    const start = new Date(checkInStr).getTime();
    const now = Date.now();
    return Math.floor((now - start) / 1000);
  };

  const record = stats.todaysRecord;
  let displayDuration = 0;

  if (record) {
    if (record.checkOut) {
      displayDuration = record.duration || 0;
    } else {
      displayDuration = calculateLiveDuration(record.checkIn);
    }
  }

  return (
    <>
      <tr 
        onClick={onToggle}
        className={cn(
          "group transition-all cursor-pointer border-b border-gray-100 dark:border-slate-800 last:border-0",
          isExpanded ? "bg-blue-50/30 dark:bg-blue-900/10" : "hover:bg-gray-50 dark:hover:bg-slate-800/50"
        )}
      >
        {/* Employee Info */}
        <td className="py-4 px-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-slate-900 dark:bg-slate-700 flex items-center justify-center text-white font-semibold shadow-sm ring-2 ring-white dark:ring-slate-800">
                {employee.avatar || employee.name.charAt(0)}
              </div>
              {isActive && (
                <div className="absolute -bottom-1 -right-1">
                   <PulseIndicator isActive={true} size="sm" />
                </div>
              )}
            </div>
            <div>
              <div className="font-medium text-slate-900 dark:text-slate-200">{employee.name}</div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Mail className="h-3 w-3" /> {employee.email}
              </div>
            </div>
          </div>
        </td>

        {/* Status Badge */}
        <td className="py-4 px-6">
          <div className="flex items-center gap-2">
            <span className={cn(
              "flex h-2 w-2 rounded-full",
              isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300 dark:bg-slate-600"
            )} />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {isActive ? 'Active' : 'Offline'}
            </span>
          </div>
        </td>

        {/* Today's Activity */}
        <td className="py-4 px-6">
          {stats.todaysRecord ? (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              <span className="font-mono font-medium text-slate-900 dark:text-slate-200 tabular-nums">
                {formatDuration(displayDuration)}
              </span>
            </div>
          ) : (
             <span className="text-xs text-slate-400 dark:text-slate-500 italic">No activity</span>
          )}
        </td>

        {/* Performance Metrics */}
        <td className="py-4 px-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-200">{stats.onTimeCount}</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">On Time</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-amber-600 dark:text-amber-500">{stats.lateCount}</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Late</div>
            </div>
          </div>
        </td>

        {/* Action */}
        <td className="py-4 px-6 text-right">
           <div className={cn(
             "p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 inline-flex transition-transform duration-200",
             isExpanded ? "rotate-180 bg-slate-200 dark:bg-slate-700" : ""
           )}>
             <ChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-400" />
           </div>
        </td>
      </tr>

      {/* Expanded Content Desktop */}
      <AnimatePresence>
        {isExpanded && (
          <tr>
            <td colSpan={5} className="p-0 border-b border-gray-100 dark:border-slate-800">
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <ExpandedDetails employee={employee} stats={stats} />
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
};

// --- Main Component ---
export const EmployeeTable = ({ 
  employees, 
  attendanceData,
  loading 
}: EmployeeTableProps) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  
  const statsMap = useEmployeeStats(employees, attendanceData);

  if (loading) return <TableSkeleton />;

  if (employees.length === 0) return <EmptyState />;

  return (
    <>
      {/* 1. MOBILE VIEW (Cards Stack) - Visible only on small screens */}
      <div className="block md:hidden space-y-4">
        {employees.map((employee) => {
           const stats = statsMap.get(employee.id)!;
           const isActive = !!stats.todaysRecord && !stats.todaysRecord.checkOut;
           
           return (
             <MobileEmployeeCard
               key={employee.id}
               employee={employee}
               stats={stats}
               isActive={isActive}
               isExpanded={expandedRow === employee.id}
               onToggle={() => setExpandedRow(prev => prev === employee.id ? null : employee.id)}
             />
           );
        })}
      </div>

      {/* 2. DESKTOP VIEW (Table) - Hidden on small screens */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors duration-300">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
              <th className="py-4 px-6">Employee</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Today's Hours</th>
              <th className="py-4 px-6">Performance</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {employees.map((employee) => (
              <DesktopEmployeeRow 
                key={employee.id}
                employee={employee}
                stats={statsMap.get(employee.id)!}
                isExpanded={expandedRow === employee.id}
                onToggle={() => setExpandedRow(prev => prev === employee.id ? null : employee.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

// --- Sub-components ---

const TableSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 animate-pulse">
        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-2 flex-1">
           <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded" />
           <div className="h-3 w-1/3 bg-slate-100 dark:bg-slate-800/50 rounded" />
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
     <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
       <UserIcon className="h-8 w-8 text-slate-300 dark:text-slate-600" />
     </div>
     <h3 className="text-lg font-medium text-slate-900 dark:text-white">No employees found</h3>
     <p className="text-slate-500 dark:text-slate-400 text-sm">Try adjusting your filters.</p>
  </div>
);
