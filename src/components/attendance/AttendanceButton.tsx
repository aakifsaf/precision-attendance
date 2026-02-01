'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Loader2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttendanceButtonProps {
  isClockedIn: boolean;
  onClockIn: () => Promise<any>;
  onClockOut: () => Promise<any>;
  disabled?: boolean;
}

export const AttendanceButton = ({
  isClockedIn,
  onClockIn,
  onClockOut,
  disabled = false,
}: AttendanceButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // Haptic feedback helper
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50); // 50ms vibration
    }
  };

  const handleClick = async () => {
    if (disabled || isLoading) return;
    
    triggerHaptic();
    setIsLoading(true);
    
    try {
      // Artificial delay for "weight" if the API is too fast (optional, for UX feel)
      // await new Promise(r => setTimeout(r, 400)); 
      
      if (isClockedIn) {
        await onClockOut();
      } else {
        await onClockIn();
      }
    } catch (err) {
      console.error(err);
      // In a real app, trigger a toast error here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* 1. Background Glow / Shadow Layer */}
      <div 
        className={cn(
          "absolute -inset-2 rounded-3xl blur-xl opacity-40 transition-all duration-500",
          isClockedIn ? "bg-rose-500" : "bg-emerald-500",
          (disabled || isLoading) && "opacity-0"
        )} 
      />

      {/* 2. Main Button */}
      <motion.button
        onClick={handleClick}
        disabled={disabled || isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        className={cn(
          "relative w-full overflow-hidden rounded-2xl p-1",
          "transition-colors duration-500 ease-in-out",
          disabled && "opacity-70 cursor-not-allowed grayscale"
        )}
      >
        {/* Inner Gradient Container */}
        <div className={cn(
          "relative flex items-center justify-center gap-3 px-8 py-5 rounded-xl border-t border-white/20 shadow-inner",
          "transition-all duration-500",
          isClockedIn 
            ? "bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-900/20" 
            : "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-900/20"
        )}>
          
          {/* Animated Content Switcher */}
          <AnimatePresence mode="wait" initial={false}>
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex items-center gap-3"
              >
                <Loader2 className="h-6 w-6 text-white animate-spin" />
                <span className="text-lg font-bold text-white tracking-wide">Syncing...</span>
              </motion.div>
            ) : (
              <motion.div
                key={isClockedIn ? 'out' : 'in'}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-center gap-3"
              >
                {/* Icons */}
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  {isClockedIn ? (
                    <Square className="h-6 w-6 text-white fill-white" />
                  ) : (
                    <Play className="h-6 w-6 text-white fill-white pl-0.5" />
                  )}
                </div>
                
                {/* Text Labels */}
                <div className="flex flex-col items-start">
                  <span className="text-lg font-bold text-white tracking-wide leading-none">
                    {isClockedIn ? 'End Shift' : 'Start Shift'}
                  </span>
                  <span className="text-xs text-white/80 font-medium mt-1">
                    {isClockedIn ? 'Clock out for the day' : 'Ready to work?'}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active State Particles/Decorations */}
          {!isClockedIn && !isLoading && !disabled && (
             <motion.div 
               animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="absolute right-6 top-1/2 -translate-y-1/2"
             >
                <Zap className="w-5 h-5 text-yellow-300 opacity-50 rotate-12" />
             </motion.div>
          )}

        </div>
      </motion.button>

      {/* 3. Status indicator text below button */}
      <div className="mt-3 text-center">
         <div className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border",
            isClockedIn 
              ? "bg-rose-50 text-rose-600 border-rose-100" 
              : "bg-slate-100 text-slate-500 border-slate-200"
         )}>
            <span className={cn(
              "w-1.5 h-1.5 rounded-full",
              isClockedIn ? "bg-rose-500 animate-pulse" : "bg-slate-400"
            )} />
            {isClockedIn ? "Tracking Time" : "System Idle"}
         </div>
      </div>
    </div>
  );
};