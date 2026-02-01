import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download,
  MoreVertical,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { User, AttendanceRecord } from '@/types';
import { adminService } from '@/lib/services/adminService';
import { EmployeeTable } from './EmployeeTable';
import { DashboardStats } from './DashboardStats';
import { toast } from 'sonner';
import { downloadAttendanceCSV } from '@/lib/utils';

interface AdminDashboardProps {
  user: User;
}

export const AdminDashboard = ({ user }: AdminDashboardProps) => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'idle'>('all');

  // Initial Load
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    try {
      // Parallel data fetching for speed
      const [empData, attData] = await Promise.all([
        adminService.getEmployees(),
        adminService.getAllAttendance(),
      ]);
      setEmployees(empData);
      setAttendanceData(attData);
      if (isRefresh) toast.success('Dashboard updated');
    } catch (error) {
      console.error('Failed to load admin data:', error);
      toast.error('Failed to refresh data');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const processedData = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      const today = new Date().toISOString().split('T')[0];
      const todaysRecord = attendanceData.find(r => 
        r.date === today && r.userName === emp.name 
      );

      const isActive = todaysRecord && !todaysRecord.checkOut; // Checked in, not out

      if (filter === 'active') return isActive;
      if (filter === 'idle') return !isActive;

      return true; // 'all'
    });
  }, [employees, attendanceData, searchQuery, filter]);


  // --- UI COMPONENTS ---

  const RefreshButton = () => (
    <button 
      onClick={() => loadData(true)}
      disabled={isRefreshing}
      className={`p-2 rounded-lg text-slate-500 hover:bg-white hover:text-slate-700 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
      title="Refresh Data"
    >
      <RefreshCw className="w-5 h-5" />
    </button>
  );

  const handleExport = () => {
    if (attendanceData.length === 0) {
      toast.error('No data available to export');
      return;
    }

    try {
      // Filter data based on current view (optional: or export all)
      // For this implementation, we export the filtered view to match user expectation
      const dataToExport = filter === 'all' 
        ? attendanceData 
        : processedData.flatMap(emp => 
            attendanceData.filter(r => r.userId === emp.id)
          );

      toast.info('Generating report...');
      
      downloadAttendanceCSV(dataToExport, 'workforce_report');
      
      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to generate CSV');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      
      {/* 1. Modern Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Workforce Command Center
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                <p className="text-sm text-slate-500">System Online • Real-time Monitoring</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <RefreshButton />
              
              <div className="hidden md:flex items-center gap-3 pl-6 border-l border-slate-200">
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Administrator</div>
                  <div className="text-sm font-medium text-slate-900">{user.name}</div>
                </div>
                <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold shadow-md">
                  {user.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 2. Stats Section */}
        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
             {[...Array(4)].map((_, i) => (
               <div key={i} className="h-32 bg-slate-200 rounded-xl" />
             ))}
           </div>
        ) : (
          <DashboardStats 
            employees={employees}
            attendanceData={attendanceData}
          />
        )}

        {/* 3. Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
           {/* Search */}
           <div className="relative w-full md:w-96 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:text-sm"
              />
           </div>

           {/* Filters & Actions */}
           <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="appearance-none bg-white border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium cursor-pointer hover:border-slate-300 transition-colors"
                >
                  <option value="all">View All Staff</option>
                  <option value="active">🟢 Active Now</option>
                  <option value="idle">⚪ Currently Idle</option>
                </select>
                <Filter className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
             </div>

             <button 
               onClick={handleExport}
               className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm active:transform active:scale-95"
             >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export CSV</span>
             </button>
           </div>
        </div>

        {/* 4. Data Table Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
          {/* Table Header Context */}
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              Employee Directory
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
              {processedData.length} Records
            </span>
          </div>
          
          {loading ? (
             // Skeleton Table
             <div className="p-6 space-y-4">
               {[...Array(5)].map((_, i) => (
                 <div key={i} className="flex gap-4">
                   <div className="h-10 w-10 rounded-full bg-slate-100 animate-pulse" />
                   <div className="flex-1 space-y-2">
                     <div className="h-4 w-1/4 bg-slate-100 rounded animate-pulse" />
                     <div className="h-3 w-3/4 bg-slate-50 rounded animate-pulse" />
                   </div>
                 </div>
               ))}
             </div>
          ) : processedData.length > 0 ? (
            <EmployeeTable 
              employees={processedData}
              attendanceData={attendanceData}
              loading={false}
            />
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-20 text-center">
               <div className="p-4 rounded-full bg-slate-50 mb-4">
                 <Search className="h-8 w-8 text-slate-300" />
               </div>
               <h3 className="text-lg font-medium text-slate-900">No employees found</h3>
               <p className="text-slate-500 max-w-sm mt-1">
                 We couldn't find anyone matching "{searchQuery}" with the current filters.
               </p>
               <button 
                 onClick={() => {setSearchQuery(''); setFilter('all');}}
                 className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
               >
                 Clear all filters
               </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};