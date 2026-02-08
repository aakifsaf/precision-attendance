'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAttendance } from '@/hooks/useAttendance';
import { useResilientTimer } from '@/hooks/useResilientTimer';
import { AttendanceButton } from './AttendanceButton';
import { TimeCard } from '@/components/ui/TimeCard';
import { AttendanceHistory } from './AttendanceHistory';
import { User } from '@/types';
import { 
  Calendar, 
  Target, 
  TrendingUp, 
  Clock, 
  MapPin,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { STATUS_COLORS } from '@/lib/constants';

interface StaffDashboardProps {
  user: User;
}

// --- Helper Components ---

const StatWidget = ({ 
  icon: Icon, 
  label, 
  value, 
  subtext, 
  colorClass 
}: { 
  icon: any; 
  label: string; 
  value: string | number; 
  subtext: string; 
  colorClass: string 
}) => (
  <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex items-start gap-4">
      <div className={cn("p-3 rounded-xl", colorClass)}>
        <Icon className="h-6 w-6 text-current opacity-80" />
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</div>
        <div className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</div>
        <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtext}</div>
      </div>
    </div>
  </div>
);

// --- Main Component ---

export const StaffDashboard = ({ user }: StaffDashboardProps) => {
  const {
    isClockedIn,
    activeSession,
    records,
    loading,
    clockIn,
    clockOut,
  } = useAttendance(user);

  const { formattedTime } = useResilientTimer(activeSession?.startTime);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todayRecords = records.filter(r => new Date(r.date).toDateString() === today);
    const onTimeCount = records.filter(r => r.status === 'on-time').length;
    const lateCount = records.filter(r => r.status === 'late' || r.status === 'half-day').length;
    
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    return { todayRecords, onTimeCount, lateCount, greeting };
  }, [records]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-12 transition-colors duration-300">
      
      {/* Header Section */}
      <div className="relative bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-row items-center justify-between gap-4 md:gap-6">
  {/* Left Side: Greeting */}
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
  >
    {/* Scaled text size for mobile (2xl) vs desktop (3xl) */}
    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
      {stats.greeting}, {user.name.split(' ')[0]}
    </h1>
    
    {/* Metadata: Hidden on very small screens if needed, or stacked */}
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 text-slate-500 dark:text-slate-400 text-xs md:text-sm">
       <span className="flex items-center gap-1.5">
         <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
         {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
       </span>
       <span className="hidden sm:block h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
       <span className="flex items-center gap-1.5">
         <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" />
         Remote
       </span>
    </div>
  </motion.div>

  {/* Right Side: Profile Card */}
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className={cn(
      // Layout: Always a flex row, fit content, pushed to right
      "w-fit ml-auto flex items-center gap-3 md:gap-4", 
      // Visuals
      "bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm",
      "border border-slate-200/60 dark:border-slate-700/60",
      // Spacing
      "p-1.5 pr-2 md:p-2 rounded-2xl shadow-sm"
    )}
  >
    {/* Text Section: Hidden on mobile to keep it neat */}
    <div className="hidden sm:block text-right px-2">
      <div className="text-[10px] md:text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
        Role
      </div>
      <div className="text-xs md:text-sm font-semibold text-slate-900 dark:text-slate-200">
        {user.department || 'Engineering'}
      </div>
    </div>

    {/* Avatar Section */}
    <div className={cn(
      "flex items-center justify-center rounded-xl",
      "bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800",
      "text-white font-bold shadow-lg shadow-slate-900/10 dark:shadow-black/20",
      // Compact size for mobile row layout
      "h-9 w-9 text-sm md:h-12 md:w-12 md:text-lg shrink-0" 
    )}>
      {user.name.charAt(0)}
    </div>
  </motion.div>
</div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Action Center (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Timer Card */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 p-1 border border-slate-100 dark:border-slate-800 transition-colors duration-300">
               <div className="bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50 rounded-[22px] p-8 md:p-12 text-center">
                  
                  <div className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                      {isClockedIn ? 'Focus Mode Active' : 'Your Shift Awaits'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                      {isClockedIn 
                        ? 'You are currently clocked in. Keep up the momentum!'
                        : 'Ready to start? Punch in to begin tracking your productivity.'
                      }
                    </p>
                  </div>

                  {/* Dynamic Timer UI */}
                  <div className="flex justify-center mb-10">
                    {isClockedIn ? (
                      <div className="relative">
                         <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
                         <TimeCard
                           time={formattedTime}
                           label="Session Duration"
                           variant="highlight"
                         />
                      </div>
                    ) : (
                      <div className="h-32 flex items-center justify-center text-slate-300 dark:text-slate-700">
                        <Clock className="w-16 h-16 opacity-20" />
                      </div>
                    )}
                  </div>

                  {/* Primary Action Button */}
                  <div className="max-w-xs mx-auto">
                    <AttendanceButton
                      isClockedIn={isClockedIn}
                      onClockIn={clockIn}
                      onClockOut={clockOut}
                      disabled={loading}
                    />
                  </div>
               </div>
            </motion.div>

            {/* Stats Widgets */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatWidget 
                icon={Briefcase} 
                label="Total Sessions" 
                value={records.length} 
                subtext="Lifetime check-ins"
                colorClass="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
              />
              <StatWidget 
                icon={Target} 
                label="On Time" 
                value={stats.onTimeCount} 
                subtext="Punctuality score"
                colorClass="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              />
              <StatWidget 
                icon={TrendingUp} 
                label="Late Arrivals" 
                value={stats.lateCount} 
                subtext="Needs attention"
                colorClass="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
              />
            </motion.div>
          </div>

          {/* RIGHT COLUMN: History Feed (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Today's Log */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
               <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex justify-between items-center">
                 <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                   <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Today's Log
                 </h3>
               </div>
               <div className="p-2">
                 {/* Pass dark mode support internally to AttendanceHistory if needed */}
                 <AttendanceHistory records={stats.todayRecords} />
               </div>
            </motion.div>

            {/* Recent History */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                 <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Recent History
              </h3>
              
              <div className="space-y-1">
                {records.slice(0, 4).map((record) => (
                  <div
                    key={record.id}
                    className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-default"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full ring-4 ring-opacity-20",
                        record.status === 'on-time' ? 'bg-emerald-500 ring-emerald-500' : 
                        record.status === 'late' ? 'bg-amber-500 ring-amber-500' : 'bg-rose-500 ring-rose-500'
                      )} />
                      <div>
                        <div className="font-medium text-slate-900 dark:text-slate-200 text-sm">
                          {new Date(record.checkIn).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                           {new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    
                    <div className={cn(
                      "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                      // Ensure STATUS_COLORS utility maps to dark mode compatible classes 
                      // or use direct mapping here if your utility is simple
                      STATUS_COLORS[record.status] 
                    )}>
                      {record.status}
                    </div>
                  </div>
                ))}
                
                {records.length === 0 && (
                   <div className="text-center py-8 text-slate-400 dark:text-slate-600 text-sm">
                     No history available yet.
                   </div>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};
