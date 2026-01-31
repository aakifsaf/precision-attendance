import { useState, useEffect, useRef } from 'react';

export const useResilientTimer = (startTime?: string) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<number>(Date.now());

  // Calculate elapsed time from stored start time
  const calculateElapsedTime = (start: string) => {
    const startTimestamp = new Date(start).getTime();
    const now = Date.now();
    return Math.floor((now - startTimestamp) / 1000);
  };

  // Save timer state to localStorage
  const saveTimerState = (start: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('timerState', JSON.stringify({
        startTime: start,
        lastUpdate: Date.now(),
      }));
    }
  };

  useEffect(() => {
    if (!startTime) return;

    // Calculate initial elapsed time
    const initialElapsed = calculateElapsedTime(startTime);
    setElapsedTime(initialElapsed);

    // Start timer
    intervalRef.current = setInterval(() => {
      setElapsedTime(prev => {
        const newTime = prev + 1;
        
        // Auto-save every 30 seconds for resilience
        if (Date.now() - lastSavedRef.current > 30000) {
          saveTimerState(startTime);
          lastSavedRef.current = Date.now();
        }
        
        return newTime;
      });
    }, 1000);

    // Save initial state
    saveTimerState(startTime);
    lastSavedRef.current = Date.now();

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Recalculate on tab focus to ensure accuracy
        const recalculated = calculateElapsedTime(startTime);
        setElapsedTime(recalculated);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [startTime]);

  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const clearTimerState = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('timerState');
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setElapsedTime(0);
  };

  return {
    elapsedTime,
    formattedTime: formatTime(elapsedTime),
    clearTimerState,
  };
};