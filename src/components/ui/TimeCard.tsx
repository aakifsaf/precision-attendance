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
  icon: Icon = Clock, // Renamed to capital Icon for JSX usage
  loading = false,
  className 
}: TimeCardProps) => {
  
  // Theme Configuration Strategy
  const themes = {
    default: {
      container: "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700",
      iconBg: "bg-slate-100 dark:bg-slate-800",
      iconColor: "text-slate-600 dark:text-slate-400",
      text: "text-slate-900 dark:text-white"
    },
    highlight: {
      container: "bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-100 dark:border-blue-500/20 hover:border-blue-200 dark:hover:border-blue-500/30 shadow-sm",
      iconBg: "bg-blue-100 dark:bg-blue-500/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      text: "text-blue-900 dark:text-blue-100"
    },
    danger: {
      container: "bg-rose-50/50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-500/20 hover:border-rose-200 dark:hover:border-rose-500/30",
      iconBg: "bg-rose-100 dark:bg-rose-500/20",
      iconColor: "text-rose-600 dark:text-rose-400",
      text: "text-rose-900 dark:text-rose-100"
    }
  };

  const theme = themes[variant] || themes.default;

  return (
    <div
      className={cn(
        // Layout & sizing
        'relative overflow-hidden p-6 rounded-2xl border transition-all duration-300',
        'flex flex-col justify-between min-h-[140px]',
        // Hover effects
        'hover:shadow-md hover:scale-[1.01] hover:shadow-slate-200/50 dark:hover:shadow-black/20',
        // Theme styles
        theme.container,
        className
      )}
    >
      {/* Background Decorator (Subtle) */}
      {variant === 'highlight' && (
         <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 dark:from-blue-400/5 to-transparent rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
      )}

      {/* Header Section */}
      <div className="flex items-start justify-between relative z-10">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            {label}
          </span>
          {subLabel && (
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
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
          <div className="h-10 w-32 bg-slate-200/60 dark:bg-slate-700/50 rounded animate-pulse" />
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