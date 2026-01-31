import { useState, useEffect, useCallback } from 'react';
import { AttendanceRecord, User, ActiveSession } from '@/types';
import { attendanceService } from '@/lib/services/attendanceService';

export const useAttendance = (user: User) => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = () => {
      const session = attendanceService.getActiveSession(user.id);
      if (session) {
        setIsClockedIn(true);
        setActiveSession(session);
      }
      loadHistory();
    };

    checkExistingSession();
  }, [user.id]);

  const loadHistory = async () => {
    try {
      const history = await attendanceService.getUserHistory(user.id);
      setRecords(history);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const clockIn = async () => {
    try {
      const session = await attendanceService.clockIn(user);
      setIsClockedIn(true);
      setActiveSession(session);
      await loadHistory();
      return { success: true, session };
    } catch (error) {
      return { success: false, error };
    }
  };

  const clockOut = async () => {
    try {
      await attendanceService.clockOut(user.id);
      setIsClockedIn(false);
      setActiveSession(null);
      await loadHistory();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    isClockedIn,
    activeSession,
    records,
    loading,
    clockIn,
    clockOut,
    refreshHistory: loadHistory,
  };
};