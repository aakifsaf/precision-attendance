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
  const colors: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
    blue:    { bg: 'bg-blue-50/50',    text: 'text-blue-600',    border: 'border-blue-100',    iconBg: 'bg-blue-100' },
    emerald: { bg: 'bg-emerald-50/50', text: 'text-emerald-600', border: 'border-emerald-100', iconBg: 'bg-emerald-100' },
    amber:   { bg: 'bg-amber-50/50',   text: 'text-amber-600',   border: 'border-amber-100',   iconBg: 'bg-amber-100' },
    purple:  { bg: 'bg-purple-50/50',  text: 'text-purple-600',  border: 'border-purple-100',  iconBg: 'bg-purple-100' },
    indigo:  { bg: 'bg-indigo-50/50',  text: 'text-indigo-600',  border: 'border-indigo-100',  iconBg: 'bg-indigo-100' },
    rose:    { bg: 'bg-rose-50/50',    text: 'text-rose-600',    border: 'border-rose-100',    iconBg: 'bg-rose-100' },
  };

  const theme = colors[item.colorClass] || colors.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow group"
    >
      <div className={cn("absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl", theme.bg)} />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={cn("p-3 rounded-xl", theme.iconBg)}>
            <item.icon className={cn("h-6 w-6", theme.text)} />
          </div>
          <div className={cn(
            "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border",
            item.trend.direction === 'up' && "bg-emerald-50 text-emerald-700 border-emerald-100",
            item.trend.direction === 'down' && "bg-rose-50 text-rose-700 border-rose-100",
            item.trend.direction === 'neutral' && "bg-slate-50 text-slate-600 border-slate-100",
          )}>
            {item.trend.direction === 'up' && <ArrowUpRight className="h-3 w-3" />}
            {item.trend.direction === 'down' && <ArrowDownRight className="h-3 w-3" />}
            {item.trend.direction === 'neutral' && <Minus className="h-3 w-3" />}
            <span>{item.trend.value}</span>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{item.value}</h3>
          <p className="text-sm font-medium text-slate-500">{item.title}</p>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
           <span className="text-xs text-slate-400">{item.trend.label}</span>
           <div className="flex items-center gap-1.5">
              <span className={cn("flex h-2 w-2 rounded-full", theme.bg.replace('/50', ''))} />
              <span className="text-xs font-semibold text-slate-900">Live</span>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Sub-Component: Weekly Bar Chart ---
const WeeklyAttendanceChart = ({ data }: { data: any[] }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[350px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Weekly Activity</h3>
          <p className="text-sm text-slate-500">Check-ins over the last 7 days</p>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg">
          <BarChart3 className="h-5 w-5 text-slate-400" />
        </div>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data} barSize={32}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
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
            cursor={{ fill: '#F1F5F9' }}
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
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[350px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Status Breakdown</h3>
          <p className="text-sm text-slate-500">Distribution of punctuality</p>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg">
          <Target className="h-5 w-5 text-slate-400" />
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
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
  
  // 1. Calculate Standard Metrics (Existing Logic)
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


  // 2. Prepare Chart Data (New Logic)
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