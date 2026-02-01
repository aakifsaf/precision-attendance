import { User, AttendanceRecord, ActiveSession } from '@/types';
import { SHIFT_CONFIG } from '../constants';

class AttendanceService {
  private readonly STORAGE_KEY = 'attendance_records';
  private readonly ACTIVE_SESSION_KEY = 'active_session';

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getShiftStatus(checkInTime: string): 'on-time' | 'late' | 'half-day' {
    const checkInDate = new Date(checkInTime);
    const checkInHours = checkInDate.getHours();
    const checkInMinutes = checkInDate.getMinutes();
    
    const totalMinutes = checkInHours * 60 + checkInMinutes;
    const lateThreshold = 9 * 60; // 09:00 in minutes
    const halfDayThreshold = 10 * 60 + 30; // 10:30 in minutes

    if (totalMinutes < lateThreshold) return 'on-time';
    if (totalMinutes <= halfDayThreshold) return 'late';
    return 'half-day';
  }

  async clockIn(user: User): Promise<ActiveSession> {
    const now = new Date();
    const startTime = new Date().toISOString();
    const session: ActiveSession = {
      userId: user.id,
      startTime,
      lastPing: startTime,
      status: 'active',
    };
    const newRecord: AttendanceRecord = {
      id: crypto.randomUUID(),
      userId: user.id,           
      userName: user.name,   
      checkIn: startTime,        
      checkOut: null,         
      date: now.toISOString().split('T')[0],
      status: this.getShiftStatus(startTime),
      duration: 0
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(this.ACTIVE_SESSION_KEY, JSON.stringify(session));

    const history = this.getHistory();
      const updatedHistory = [newRecord, ...history];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedHistory));
    }

    return session;
  }

async clockOut(userId: string): Promise<AttendanceRecord> {
    const activeSession = this.getActiveSession(userId);
    if (!activeSession) {
      throw new Error('No active session found');
    }

    const now = new Date();
    const checkOutTime = now.toISOString();
    const checkInTime = new Date(activeSession.startTime);
    
    const duration = Math.floor((now.getTime() - checkInTime.getTime()) / 1000);

    const history = this.getHistory();

    const openRecordIndex = history.findIndex(
      (r) => r.userId === userId && r.checkOut === null
    );

    let finalRecord: AttendanceRecord;

    if (openRecordIndex !== -1) {
      history[openRecordIndex] = {
        ...history[openRecordIndex],
        checkOut: checkOutTime,
        duration: duration,
      };
      finalRecord = history[openRecordIndex];
    } else {
      const newRecord: AttendanceRecord = {
        id: this.generateId(),
        userId,
        userName: 'Alex Johnson', // ideally passed or fetched
        checkIn: activeSession.startTime,
        checkOut: checkOutTime,
        duration,
        status: this.getShiftStatus(activeSession.startTime),
        date: checkInTime.toISOString().split('T')[0],
      };
      history.unshift(newRecord);
      finalRecord = newRecord;
    }

    this.saveHistory(history);

    this.clearActiveSession(userId);

    return finalRecord;
  }

  getActiveSession(userId: string): ActiveSession | null {
    if (typeof window === 'undefined') return null;
    
    const sessionStr = localStorage.getItem(this.ACTIVE_SESSION_KEY);
    if (!sessionStr) return null;

    const session: ActiveSession = JSON.parse(sessionStr);
    
    // Validate session belongs to user and is not too old
    if (session.userId !== userId) return null;
    
    const sessionStart = new Date(session.startTime);
    const now = new Date();
    const hoursDiff = (now.getTime() - sessionStart.getTime()) / (1000 * 60 * 60);
    
    // Clear if session is older than 24 hours (stale)
    if (hoursDiff > 24) {
      this.clearActiveSession(userId);
      return null;
    }

    return session;
  }

  clearActiveSession(userId: string): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.ACTIVE_SESSION_KEY);
    }
  }

  getUserHistory(userId: string): AttendanceRecord[] {
    const history = this.getHistory();
    return history.filter(record => record.userId === userId);
  }

  getAllAttendance(): AttendanceRecord[] {
    return this.getHistory();
  }

  private getHistory(): AttendanceRecord[] {
    if (typeof window === 'undefined') return [];
    
    const historyStr = localStorage.getItem(this.STORAGE_KEY);
    if (!historyStr) return [];

    try {
      return JSON.parse(historyStr);
    } catch {
      return [];
    }
  }

  private saveHistory(history: AttendanceRecord[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    }
  }
}

export const attendanceService = new AttendanceService();