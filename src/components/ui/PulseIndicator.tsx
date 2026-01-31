import { cn } from '@/lib/utils';

type StatusVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'offline';

interface PulseIndicatorProps {
  /** The visual state of the indicator */
  variant?: StatusVariant;
  /** Legacy prop support: if true, maps to 'success', else 'offline' */
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** Optional: Add a white ring to separate from background images/colors */
  ring?: boolean;
  /** Optional: Animation pulse effect */
  pulse?: boolean;
  className?: string;
  'aria-label'?: string;
}

const sizeClasses = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5', // Slightly refined size
  lg: 'h-4 w-4',
};

const variantStyles: Record<StatusVariant, { main: string; ping: string; glow: string }> = {
  success: {
    main: 'bg-emerald-500',
    ping: 'bg-emerald-500',
    glow: 'shadow-[0_0_8px_rgba(16,185,129,0.5)]'
  },
  warning: {
    main: 'bg-amber-500',
    ping: 'bg-amber-500',
    glow: 'shadow-[0_0_8px_rgba(245,158,11,0.5)]'
  },
  danger: {
    main: 'bg-rose-500',
    ping: 'bg-rose-500',
    glow: 'shadow-[0_0_8px_rgba(244,63,94,0.5)]'
  },
  neutral: {
    main: 'bg-blue-500',
    ping: 'bg-blue-400',
    glow: 'shadow-[0_0_8px_rgba(59,130,246,0.5)]'
  },
  offline: {
    main: 'bg-slate-300',
    ping: 'hidden', // No ping for offline
    glow: ''
  }
};

export const PulseIndicator = ({ 
  isActive, // Legacy support
  variant, 
  size = 'md', 
  ring = false,
  pulse = true,
  className,
  'aria-label': ariaLabel,
}: PulseIndicatorProps) => {
  
  // Determine variant: Explicit variant prop > isActive prop > default
  const activeVariant: StatusVariant = variant 
    ? variant 
    : (isActive === true ? 'success' : isActive === false ? 'offline' : 'neutral');

  const styles = variantStyles[activeVariant];
  const shouldPulse = pulse && activeVariant !== 'offline';

  return (
    <span 
      role="status"
      aria-label={ariaLabel || `Status: ${activeVariant}`}
      className={cn("relative inline-flex items-center justify-center", sizeClasses[size], className)}
    >
      {/* 1. The Ping Animation Layer */}
      {shouldPulse && (
        <span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
            styles.ping
          )}
          style={{ animationDuration: '2s' }} // Slower, more calming heartbeat
        />
      )}

      {/* 2. The Main Dot */}
      <span
        className={cn(
          "relative inline-flex rounded-full h-full w-full",
          styles.main,
          // Optional Glow
          shouldPulse && styles.glow,
          // Optional Ring for contrast against backgrounds
          ring && "ring-2 ring-white" 
        )}
      />
    </span>
  );
};