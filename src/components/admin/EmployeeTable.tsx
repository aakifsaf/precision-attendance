'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User as UserIcon, 
  Mail, 
  Building, 
  Clock,
  MoreVertical,
  TrendingUp,
  Calendar,
  ChevronRight,
  ChevronDown
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

    // 1. Initialize Map
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

    // 2. Single Pass Aggregation
    attendanceData.forEach(record => {
      const stats = statsMap.get(record.userId);
      if (!stats) return;

      stats.history.push(record);
      stats.totalSessions++;
      
      if (record.date === today) stats.todaysRecord = record;
      if (record.status === 'on-time') stats.onTimeCount++;
      if (record.status === 'late' || record.status === 'half-day') stats.lateCount++;
    });

    // 3. Final Calculations
    statsMap.forEach(stats => {
      const totalHours = stats.history.reduce((sum, r) => sum + (r.duration || 0) / 3600, 0);
      stats.avgHours = stats.totalSessions > 0 ? totalHours / stats.totalSessions : 0;
      // Sort history new -> old
      stats.history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });

    return statsMap;
  }, [employees, attendanceData]);
};

const EmployeeRow = ({ 
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
  return Math.floor((now - start) / 1000); // Returns seconds
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
          "group transition-all cursor-pointer border-b border-gray-100 last:border-0",
          isExpanded ? "bg-blue-50/30" : "hover:bg-gray-50"
        )}
      >
        {/* Employee Info */}
        <td className="py-4 px-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-semibold shadow-sm ring-2 ring-white">
                {employee.avatar || employee.name.charAt(0)}
              </div>
              {isActive && (
                <div className="absolute -bottom-1 -right-1">
                   <PulseIndicator isActive={true} size="sm" />
                </div>
              )}
            </div>
            <div>
              <div className="font-medium text-slate-900">{employee.name}</div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
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
              isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
            )} />
            <span className="text-sm font-medium text-slate-700">
              {isActive ? 'Active' : 'Offline'}
            </span>
          </div>
        </td>

        {/* Today's Activity */}
        <td className="py-4 px-6">
          {stats.todaysRecord ? (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="font-mono font-medium text-slate-900 tabular-nums">
                {formatDuration(displayDuration)}
              </span>
            </div>
          ) : (
             <span className="text-xs text-slate-400 italic">No activity</span>
          )}
        </td>

        {/* Performance Metrics */}
        <td className="py-4 px-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-sm font-bold text-slate-900">{stats.onTimeCount}</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500">On Time</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-amber-600">{stats.lateCount}</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500">Late</div>
            </div>
          </div>
        </td>

        {/* Action / Chevron */}
        <td className="py-4 px-6 text-right">
           <div className={cn(
             "p-2 rounded-full hover:bg-slate-200 inline-flex transition-transform duration-200",
             isExpanded ? "rotate-180 bg-slate-200" : ""
           )}>
             <ChevronDown className="h-4 w-4 text-slate-500" />
           </div>
        </td>
      </tr>

      {/* Expanded Content with Framer Motion */}
      <AnimatePresence>
        {isExpanded && (
          <tr>
            <td colSpan={5} className="p-0 border-b border-gray-100">
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden bg-slate-50/50"
              >
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                   {/* Department Card */}
                   <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-4">
                        <Building className="h-4 w-4 text-slate-500" /> Department Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Department</span>
                          <span className="font-medium text-slate-900">{employee.department}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Employee ID</span>
                          <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{employee.id}</span>
                        </div>
                      </div>
                   </div>

                   {/* History Card */}
                   <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm col-span-2">
                      <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-4">
                        <Calendar className="h-4 w-4 text-slate-500" /> Recent History
                      </h4>
                      <div className="space-y-3">
                        {stats.history.slice(0, 3).map((record) => (
                           <div key={record.id} className="flex items-center justify-between text-sm p-2 hover:bg-slate-50 rounded-lg transition-colors">
                              <div className="flex items-center gap-3">
                                <span className="font-medium text-slate-700">
                                  {new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                                <span className="text-slate-400 text-xs">
                                  {new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit'})} - 
                                  {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit'}) : ' ...'}
                                </span>
                              </div>
                              <div className={cn(
                                "px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
                                getStatusColor(record.status) // Ensure your utility returns bg/text/border classes
                              )}>
                                {record.status}
                              </div>
                           </div>
                        ))}
                      </div>
                   </div>
                </div>
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
  
  // High-performance data processing
  const statsMap = useEmployeeStats(employees, attendanceData);

  if (loading) return <TableSkeleton />;

  if (employees.length === 0) return <EmptyState />;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
            <th className="py-4 px-6">Employee</th>
            <th className="py-4 px-6">Status</th>
            <th className="py-4 px-6">Today's Hours</th>
            <th className="py-4 px-6">Performance</th>
            <th className="py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {employees.map((employee) => (
            <EmployeeRow 
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
  );
};

// --- Sub-components (Clean code practice) ---

const TableSkeleton = () => (
  <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 animate-pulse">
        <div className="h-10 w-10 rounded-full bg-slate-200" />
        <div className="space-y-2 flex-1">
           <div className="h-4 w-1/4 bg-slate-200 rounded" />
           <div className="h-3 w-1/3 bg-slate-100 rounded" />
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200 border-dashed">
     <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
       <UserIcon className="h-8 w-8 text-slate-300" />
     </div>
     <h3 className="text-lg font-medium text-slate-900">No employees found</h3>
     <p className="text-slate-500 text-sm">Try adjusting your filters.</p>
  </div>
);