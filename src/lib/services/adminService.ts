import { User, AttendanceRecord, DashboardStats } from '@/types';
import { attendanceService } from './attendanceService';

// Mock data for demonstration
const MOCK_EMPLOYEES: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@company.com',
    role: 'staff',
    department: 'Engineering',
    avatar: 'AJ',
  },
  {
    id: '2',
    name: 'Sarah Williams',
    email: 'sarah@company.com',
    role: 'staff',
    department: 'Marketing',
    avatar: 'SW',
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael@company.com',
    role: 'staff',
    department: 'Engineering',
    avatar: 'MC',
  },
  {
    id: '4',
    name: 'Jessica Brown',
    email: 'jessica@company.com',
    role: 'staff',
    department: 'HR',
    avatar: 'JB',
  },
  {
    id: '5',
    name: 'David Miller',
    email: 'david@company.com',
    role: 'staff',
    department: 'Sales',
    avatar: 'DM',
  },
  {
    id: '6',
    name: 'Emma Wilson',
    email: 'emma@company.com',
    role: 'staff',
    department: 'Design',
    avatar: 'EW',
  },
];

class AdminService {
  async getEmployees(): Promise<User[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In production, this would be an API call
    return [...MOCK_EMPLOYEES];
  }

  async getAllAttendance(): Promise<AttendanceRecord[]> {
    // Get from attendance service
    const allRecords = attendanceService.getAllAttendance();
    
    // If no records exist, generate some mock data for demonstration
    if (allRecords.length === 0) {
      return this.generateMockAttendanceData();
    }
    
    return allRecords;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const employees = await this.getEmployees();
    const attendance = await this.getAllAttendance();
    
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.filter(record => 
      record.date === today
    );
    
    // Calculate active employees
    const activeNow = employees.filter(emp => {
      const activeSession = attendanceService.getActiveSession(emp.id);
      return activeSession !== null;
    }).length;
    
    // Calculate late arrivals today
    const lateToday = todayAttendance.filter(record => 
      record.status === 'late' || record.status === 'half-day'
    ).length;
    
    // Calculate average hours
    const totalHours = attendance.reduce((sum, record) => {
      return sum + (record.duration || 0) / 3600;
    }, 0);
    
    const averageHours = attendance.length > 0 
      ? totalHours / attendance.length 
      : 0;
    
    return {
      totalEmployees: employees.length,
      activeNow,
      lateToday,
      averageHours: parseFloat(averageHours.toFixed(1)),
    };
  }

  async getEmployeeAttendance(userId: string): Promise<AttendanceRecord[]> {
    const allAttendance = await this.getAllAttendance();
    return allAttendance.filter(record => record.userId === userId);
  }

  private generateMockAttendanceData(): AttendanceRecord[] {
    const records: AttendanceRecord[] = [];
    const today = new Date();
    
    // Generate last 30 days of data for all employees
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      MOCK_EMPLOYEES.forEach(employee => {
        // Randomly skip some days (weekends, leaves)
        if (Math.random() > 0.3) {
          const checkIn = new Date(date);
          
          // Random check-in time: 80% on-time, 15% late, 5% half-day
          const rand = Math.random();
          if (rand < 0.8) {
            // On-time: between 8:00 and 9:00
            checkIn.setHours(8 + Math.floor(Math.random() * 2));
          } else if (rand < 0.95) {
            // Late: between 9:00 and 10:30
            checkIn.setHours(9);
            checkIn.setMinutes(15 + Math.floor(Math.random() * 75));
          } else {
            // Half-day: after 10:30
            checkIn.setHours(10);
            checkIn.setMinutes(30 + Math.floor(Math.random() * 60));
          }
          checkIn.setMinutes(checkIn.getMinutes() + Math.floor(Math.random() * 30));
          
          const checkOut = new Date(checkIn);
          checkOut.setHours(checkOut.getHours() + 8 + Math.floor(Math.random() * 2));
          
          const duration = Math.floor((checkOut.getTime() - checkIn.getTime()) / 1000);
          
          // Determine status based on check-in time
          let status: 'on-time' | 'late' | 'half-day' = 'on-time';
          const checkInHours = checkIn.getHours();
          const checkInMinutes = checkIn.getMinutes();
          
          if (checkInHours > 10 || (checkInHours === 10 && checkInMinutes >= 30)) {
            status = 'half-day';
          } else if (checkInHours > 9 || (checkInHours === 9 && checkInMinutes > 0)) {
            status = 'late';
          }
          
          records.push({
            id: `record-${date.getTime()}-${employee.id}`,
            userId: employee.id,
            userName: employee.name,
            checkIn: checkIn.toISOString(),
            checkOut: checkOut.toISOString(),
            duration,
            status,
            date: date.toISOString().split('T')[0],
          });
        }
      });
    }
    
    // Sort by date descending
    return records.sort((a, b) => 
      new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime()
    );
  }
}

export const adminService = new AdminService();