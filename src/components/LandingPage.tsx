'use client';

import { motion } from 'framer-motion';
import { 
  Clock, 
  ShieldCheck, 
  BarChart3, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  User,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LandingPageProps {
  onLogin: (role: 'staff' | 'admin') => void;
}

export const LandingPage = ({ onLogin }: LandingPageProps) => {
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-blue-100 dark:selection:bg-blue-900 text-slate-900 dark:text-slate-50 overflow-hidden relative transition-colors duration-300">
      
      {/* Background Decorators */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-500/10 dark:bg-blue-500/20 blur-3xl rounded-full" />
        <div className="absolute top-[10%] right-[0%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-500/20 blur-3xl rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-600/20">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">WorkSync</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</a>
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24 md:pt-20 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Text Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wide">
              <Zap className="w-3 h-3" />
              <span>v2.0 Now Available</span>
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Workforce management, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">simplified.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
                Track attendance, monitor productivity, and generate payroll reports in real-time. The all-in-one solution for modern teams.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-3">
               <div className="text-sm font-semibold text-slate-900 dark:text-slate-200">Select a demo persona to continue:</div>
               <div className="flex flex-col sm:flex-row gap-4">
                  
                  {/* Staff Persona Button */}
                  <button 
                    onClick={() => onLogin('staff')}
                    className="group relative p-4 pr-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all text-left w-full sm:w-64"
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <div className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">Staff View</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Clock in, view history & stats.</p>
                    <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </button>

                  {/* Admin Persona Button */}
                  <button 
                    onClick={() => onLogin('admin')}
                    className="group relative p-4 pr-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md transition-all text-left w-full sm:w-64"
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <div className="p-2 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <Users className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">Admin View</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Manage team, analytics & exports.</p>
                    <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-purple-500 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                  </button>

               </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-6 pt-4 text-sm text-slate-500 dark:text-slate-500">
               <div className="flex items-center gap-2">
                 <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                 <span>Free Tier Available</span>
               </div>
               <div className="flex items-center gap-2">
                 <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                 <span>No Credit Card</span>
               </div>
            </motion.div>
          </motion.div>

          {/* Right: Feature Showcase (Visual) */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8, delay: 0.4 }}
             className="relative hidden lg:block"
          >
             <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="bg-slate-50 dark:bg-slate-950/50 rounded-xl p-6 h-[400px] flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 text-slate-400">
                   {/* Abstract UI Representation */}
                   <div className="w-full h-full space-y-4">
                      <div className="flex justify-between items-center">
                         <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse" />
                         <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                         <div className="h-24 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800" />
                         <div className="h-24 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800" />
                         <div className="h-24 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800" />
                      </div>
                      <div className="h-40 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                         <BarChart3 className="w-12 h-12 text-slate-200 dark:text-slate-800" />
                      </div>
                   </div>
                </div>
             </div>
             
             {/* Floating Cards */}
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -left-8 top-20 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3 z-20"
             >
                <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                   <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                   <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Security Status</div>
                   <div className="text-sm font-bold text-slate-900 dark:text-white">Encrypted</div>
                </div>
             </motion.div>
             
             <motion.div 
               animate={{ y: [0, 10, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="absolute -right-4 bottom-20 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3 z-20"
             >
                <div className="p-2 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg">
                   <Clock className="w-6 h-6" />
                </div>
                <div>
                   <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Avg Response</div>
                   <div className="text-sm font-bold text-slate-900 dark:text-white">0.2s</div>
                </div>
             </motion.div>
          </motion.div>

        </div>
      </main>
      
      {/* Footer Strip */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-xs text-slate-400 dark:text-slate-500">
           <span>© 2026 WorkSync Inc.</span>
           <div className="flex gap-4">
             <span className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer">Privacy Policy</span>
             <span className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer">Terms of Service</span>
           </div>
        </div>
      </footer>
    </div>
  );
};