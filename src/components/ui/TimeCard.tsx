import { cn } from '@/lib/utils';
import { Clock, LucideIcon } from 'lucide-react';

interface TimeCardProps {
  time: string;
  label: string;
  subLabel?: string;
  variant?: 'default' | 'highlight' | 'danger';
  icon?: LucideIcon;
  loading?: boolean;
  className?: string;
}

export const TimeCard = ({ 
  time, 
  label, 
  subLabel,
  variant = 'default', 
  icon: Icon = Clock,
  loading = false,
  className 
}: TimeCardProps) => {
  
  // Theme Configuration Strategy
  const themes = {
    default: {
      container: "bg-white border-slate-200 hover:border-slate-300",
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
      text: "text-slate-900"
    },
    highlight: {
      container: "bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border-blue-100 hover:border-blue-200 shadow-sm",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      text: "text-blue-900"
    },
    danger: {
      container: "bg-red-50/50 border-red-100 hover:border-red-200",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      text: "text-red-900"
    }
  };

  const theme = themes[variant];

  return (
    <div
      className={cn(
        // Layout & sizing
        'relative overflow-hidden p-6 rounded-2xl border transition-all duration-300',
        'flex flex-col justify-between min-h-[140px]',
        // Hover effects
        'hover:shadow-md hover:scale-[1.01]',
        // Theme styles
        theme.container,
        className
      )}
    >
      {/* Background Decorator (Subtle) */}
      {variant === 'highlight' && (
         <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full -mr-4 -mt-4 pointer-events-none" />
      )}

      {/* Header Section */}
      <div className="flex items-start justify-between relative z-10">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            {label}
          </span>
          {subLabel && (
            <span className="text-xs text-slate-400 font-medium">
              {subLabel}
            </span>
          )}
        </div>
        
        <div className={cn('p-2.5 rounded-xl transition-colors', theme.iconBg)}>
          <Icon className={cn('h-5 w-5', theme.iconColor)} />
        </div>
      </div>

      {/* Time Display Section */}
      <div className="mt-4 relative z-10" aria-live="polite">
        {loading ? (
          // Skeleton Loader
          <div className="h-10 w-32 bg-slate-200/60 rounded animate-pulse" />
        ) : (
          <div className={cn(
            'text-4xl font-bold tracking-tight',
            // CRITICAL: tabular-nums prevents jitter when numbers change width (1 vs 0)
            'tabular-nums font-sans', 
            theme.text
          )}>
            {time}
          </div>
        )}
      </div>
    </div>
  );
};