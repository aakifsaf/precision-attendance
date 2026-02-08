'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Users, 
  ChevronDown, 
  LogOut, 
  Layout,
  ShieldCheck,
  Moon,
  Sun
} from 'lucide-react';
import { useRole } from '@/hooks/useRole';
import { useTheme } from '@/components/providers/ThemeProvider'; // Import the Theme Hook
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const RoleSwitcher = () => {
  const { role, setRole } = useRole();
  const { theme, setTheme } = useTheme(); // Access Theme Context
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitch = (newRole: 'staff' | 'admin') => {
    if (role === newRole) {
        setIsOpen(false);
        return;
    }
    setRole(newRole);
    setIsOpen(false);
    toast.success(`Switched to ${newRole === 'staff' ? 'Staff' : 'Admin'} View`);
  };

  const toggleTheme = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent closing the menu if clicked
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    toast.success(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode active`);
  };

  // Determine if we should show the full text (Hovered OR Menu Open)
  const isExpanded = isHovered || isOpen;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end" ref={containerRef}>
      
      {/* TRIGGER BUTTON */}
      <motion.button
        layout
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'relative flex items-center',
          // Light Mode: White Glass | Dark Mode: Black Glass
          'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl',
          'border border-white/40 dark:border-slate-700/50',
          'shadow-lg shadow-slate-200/50 dark:shadow-black/50',
          'overflow-hidden transition-colors duration-300',
          'rounded-full',
          isExpanded ? 'pr-4 pl-1.5 py-1.5' : 'p-1.5'
        )}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {/* AVATAR */}
        <motion.div 
          layout="position"
          className={cn(
            'relative h-9 w-9 rounded-full flex items-center justify-center text-white shadow-inner shrink-0',
            role === 'staff' 
              ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
              : 'bg-gradient-to-br from-purple-500 to-fuchsia-600'
          )}
        >
           {role === 'staff' ? <User className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
           
           {/* Online Dot */}
           <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-400 border-2 border-white dark:border-slate-900 rounded-full"></span>
        </motion.div>

        {/* TEXT LABEL */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center overflow-hidden whitespace-nowrap"
            >
              <div className="flex flex-col ml-3 mr-2 text-left">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none mb-0.5">
                    Viewing as
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-none">
                  {role === 'staff' ? 'Staff Portal' : 'Admin Console'}
                </span>
              </div>
              
              <ChevronDown className={cn(
                'h-3 w-3 text-slate-400 dark:text-slate-500 ml-1 transition-transform duration-300',
                isOpen && 'rotate-180 text-slate-600 dark:text-slate-300'
              )} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* DROPDOWN MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="absolute top-full right-0 mt-2 w-72 origin-top-right"
          >
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-white/50 dark:border-slate-700 overflow-hidden p-2">
              
              {/* Menu Header */}
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-2 flex justify-between items-center">
                  <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Switch Workspace</h3>
                  
                  {/* Theme Toggle Button inside Menu */}
                  <button 
                    onClick={toggleTheme}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                    title="Toggle Theme"
                  >
                    {theme === 'dark' ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                  </button>
              </div>

              {/* Staff Option */}
              <button
                onClick={() => handleSwitch('staff')}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative',
                  role === 'staff' 
                    ? 'bg-blue-50/80 dark:bg-blue-500/10' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                )}
              >
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    role === 'staff' 
                        ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400" 
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700"
                  )}>
                     <Layout className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                     <div className={cn("text-sm font-semibold", role === 'staff' ? "text-blue-900 dark:text-blue-100" : "text-slate-700 dark:text-slate-300")}>Staff Dashboard</div>
                  </div>
                  {role === 'staff' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />}
              </button>

              {/* Admin Option */}
              <button
                onClick={() => handleSwitch('admin')}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative mt-1',
                  role === 'admin' 
                    ? 'bg-purple-50/80 dark:bg-purple-500/10' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                )}
              >
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    role === 'admin' 
                        ? "bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400" 
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700"
                  )}>
                     <Users className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                     <div className={cn("text-sm font-semibold", role === 'admin' ? "text-purple-900 dark:text-purple-100" : "text-slate-700 dark:text-slate-300")}>Admin Console</div>
                  </div>
                  {role === 'admin' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400" />}
              </button>

              <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />

              <button 
                onClick={() => toast.info('Logged out')}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-700 dark:hover:text-rose-400 text-slate-500 dark:text-slate-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};