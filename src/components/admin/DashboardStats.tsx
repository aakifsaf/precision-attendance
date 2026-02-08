'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  Clock, 
  TrendingUp, 
  Target, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { User, AttendanceRecord } from '@/types';
import { cn } from '@/lib/utils';

interface DashboardStatsProps {
  employees: User[];
  attendanceData: AttendanceRecord[];
}

// --- Types ---
type TrendDirection = 'up' | 'down' | 'neutral';

interface StatItem {
  id: string;
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend: {
    value: string;
    direction: TrendDirection;
    label: string;
  };
  colorClass: string;
}

// --- Sub-Component: The Card (Pure UI) ---
const StatCard = ({ item, index }: { item: StatItem; index: number }) => {
  // Updated Colors for Dark Mode Support (using transparency)
  const colors: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
    blue:    { bg: 'bg-blue-50/50 dark:bg-blue-500/10',    text: 'text-blue-600 dark:text-blue-400',    border: 'border-blue-100 dark:border-blue-500/20',    iconBg: 'bg-blue-100 dark:bg-blue-500/20' },
    emerald: { bg: 'bg-emerald-50/50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-500/20', iconBg: 'bg-emerald-100 dark:bg-emerald-500/20' },
    amber:   { bg: 'bg-amber-50/50 dark:bg-amber-500/10',   text: 'text-amber-600 dark:text-amber-400',   border: 'border-amber-100 dark:border-amber-500/20',   iconBg: 'bg-amber-100 dark:bg-amber-500/20' },
    purple:  { bg: 'bg-purple-50/50 dark:bg-purple-500/10',  text: 'text-purple-600 dark:text-purple-400',  border: 'border-purple-100 dark:border-purple-500/20',  iconBg: 'bg-purple-100 dark:bg-purple-500/20' },
    indigo:  { bg: 'bg-indigo-50/50 dark:bg-indigo-500/10',  text: 'text-indigo-600 dark:text-indigo-400',  border: 'border-indigo-100 dark:border-indigo-500/20',  iconBg: 'bg-indigo-100 dark:bg-indigo-500/20' },
    rose:    { bg: 'bg-rose-50/50 dark:bg-rose-500/10',    text: 'text-rose-600 dark:text-rose-400',    border: 'border-rose-100 dark:border-rose-500/20',    iconBg: 'bg-rose-100 dark:bg-rose-500/20' },
  };

  const theme = colors[item.colorClass] || colors.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md dark:shadow-black/20 transition-all group"
    >
      <div className={cn("absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl", theme.bg)} />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={cn("p-3 rounded-xl transition-colors", theme.iconBg)}>
            <item.icon className={cn("h-6 w-6", theme.text)} />
          </div>
          <div className={cn(
            "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
            item.trend.direction === 'up' && "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20",
            item.trend.direction === 'down' && "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-500/20",
            item.trend.direction === 'neutral' && "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700",
          )}>
            {item.trend.direction === 'up' && <ArrowUpRight className="h-3 w-3" />}
            {item.trend.direction === 'down' && <ArrowDownRight className="h-3 w-3" />}
            {item.trend.direction === 'neutral' && <Minus className="h-3 w-3" />}
            <span>{item.trend.value}</span>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{item.value}</h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.title}</p>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
           <span className="text-xs text-slate-400 dark:text-slate-500">{item.trend.label}</span>
           <div className="flex items-center gap-1.5">
              <span className={cn("flex h-2 w-2 rounded-full", theme.bg.replace('/50', ''))} />
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-200">Live</span>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Sub-Component: Weekly Bar Chart ---
const WeeklyAttendanceChart = ({ data }: { data: any[] }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-[350px] transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Weekly Activity</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Check-ins over the last 7 days</p>
        </div>
        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <BarChart3 className="h-5 w-5 text-slate-400 dark:text-slate-500" />
        </div>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data} barSize={32}>
          {/* Note: Colors for stroke are hardcoded, for perfect dark mode they should be dynamic or variables */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748B', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748B', fontSize: 12 }} 
          />
          <Tooltip 
            cursor={{ fill: 'rgba(241, 245, 249, 0.1)' }} // Semi-transparent for both modes
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="active" name="Present" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- Sub-Component: Status Donut Chart ---
const StatusDistributionChart = ({ data }: { data: any[] }) => {
  const COLORS = ['#10B981', '#F59E0B', '#F43F5E']; // Emerald, Amber, Rose

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-[350px] transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Status Breakdown</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Distribution of punctuality</p>
        </div>
        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <Target className="h-5 w-5 text-slate-400 dark:text-slate-500" />
        </div>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={2} stroke="rgba(255,255,255,0.1)" />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- Main Component ---
export const DashboardStats = ({ employees, attendanceData }: DashboardStatsProps) => {
  
  // 1. Calculate Standard Metrics
  const stats = useMemo<StatItem[]>(() => {
    const today = new Date().toISOString().split('T')[0];
    const totalEmployees = employees.length;

    const activeEmployees = attendanceData.filter(record => 
      record.date === today && record.checkOut === null
    ).length;
    
    const todayRecords = attendanceData.filter(r => r.date === today);
    const lateCount = todayRecords.filter(r => r.status === 'late' || r.status === 'half-day').length;
    const onTimeCount = attendanceData.filter(r => r.status === 'on-time').length;
    
    const totalHours = attendanceData.reduce((sum, r) => sum + (r.duration || 0) / 3600, 0);
    const avgHours = attendanceData.length > 0 ? totalHours / attendanceData.length : 0;
    const onTimeRate = attendanceData.length > 0 ? (onTimeCount / attendanceData.length) * 100 : 0;

    return [
      {
        id: 'total-emp',
        title: 'Total Workforce',
        value: totalEmployees,
        icon: Users,
        colorClass: 'blue',
        trend: { value: '+2', direction: 'up', label: 'New joins this month' }
      },
      {
        id: 'active-now',
        title: 'Active Now',
        value: activeEmployees,
        icon: UserCheck,
        colorClass: 'emerald',
        trend: { 
          value: `${Math.round((activeEmployees / (totalEmployees || 1)) * 100)}%`, 
          direction: 'neutral', 
          label: 'Current capacity utilization' 
        }
      },
      {
        id: 'late-today',
        title: 'Late Arrivals',
        value: lateCount,
        icon: Clock,
        colorClass: 'amber',
        trend: { 
          value: todayRecords.length > 0 ? `${Math.round((lateCount / todayRecords.length) * 100)}%` : '0%', 
          direction: lateCount > 0 ? 'down' : 'neutral', 
          label: 'Of today\'s check-ins' 
        }
      },
      {
        id: 'avg-hours',
        title: 'Avg. Hours/Day',
        value: avgHours.toFixed(1),
        icon: TrendingUp,
        colorClass: 'purple',
        trend: { value: '+0.5h', direction: 'up', label: 'Vs last week average' }
      },
    ];
  }, [employees, attendanceData]);


  // 2. Prepare Chart Data
  const chartData = useMemo(() => {
    // A. Weekly Activity Data
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weeklyData = [];

    // Loop backwards 6 days to today
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayName = days[d.getDay()];
        
        // Count records for this specific date
        const count = attendanceData.filter(r => r.date === dateStr).length;
        
        weeklyData.push({
            name: dayName,
            active: count
        });
    }

    // B. Status Distribution Data
    const onTime = attendanceData.filter(r => r.status === 'on-time').length;
    const late = attendanceData.filter(r => r.status === 'late').length;
    const halfDay = attendanceData.filter(r => r.status === 'half-day').length;

    const distributionData = [
        { name: 'On Time', value: onTime },
        { name: 'Late', value: late },
        { name: 'Half Day', value: halfDay }
    ];

    return { weeklyData, distributionData };
  }, [attendanceData]);

  return (
    <div className="space-y-6 mb-8">
      {/* 1. Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={stat.id} item={stat} index={index} />
        ))}
      </div>

      {/* 2. Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Main Chart (Takes up 2/3) */}
         <div className="lg:col-span-2">
             <WeeklyAttendanceChart data={chartData.weeklyData} />
         </div>
         {/* Secondary Chart (Takes up 1/3) */}
         <div className="lg:col-span-1">
             <StatusDistributionChart data={chartData.distributionData} />
         </div>
      </div>
    </div>
  );
};