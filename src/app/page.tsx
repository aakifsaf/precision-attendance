'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Component Imports ---
import { StaffDashboard } from '@/components/attendance/StaffDashboard';
import { AdminDashboard } from '@/components/admin/AdminDashboard'; 
import { LandingPage } from '@/components/LandingPage'; 
import { RoleSwitcher } from '@/components/layout/RoleSwitcher';

// --- Hooks & Types ---
import { useRole } from '@/hooks/useRole';
import { User } from '@/types';

// --- Mock Data ---
// In a real app, this would come from an Auth Provider (NextAuth/Clerk)
const MOCK_USERS: Record<'staff' | 'admin', User> = {
  staff: {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.j@precision.inc',
    role: 'staff',
    department: 'Engineering',
    avatar: 'AJ', // or a URL like 'https://github.com/shadcn.png'
  },
  admin: {
    id: 'admin_01',
    name: 'Sarah Wilson',
    email: 'sarah.w@precision.inc',
    role: 'admin',
    department: 'Operations',
    avatar: 'SW',
  }
};

export default function HomePage() {
  const { role, setRole } = useRole();
  const [mounted, setMounted] = useState(false);
  
  // State to track if user has clicked "Enter" on the landing page
  // We default to false so every refresh shows the nice landing page first
  const [hasEntered, setHasEntered] = useState(false);

  // Prevent Hydration Mismatch (Next.js Best Practice)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // SCENARIO 1: Landing Page (Entry Gate)
  if (!hasEntered) {
    return (
      <LandingPage 
        onLogin={(selectedRole) => {
          setRole(selectedRole); // Update Context
          setHasEntered(true);   // Show Dashboard
        }} 
      />
    );
  }

  // SCENARIO 2: Main App View
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Floating Controls (Role Switcher & Theme Toggle) */}
      <RoleSwitcher />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={role} // This key forces React to re-mount the component when role changes, triggering the animation
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full"
        >
          {role === 'staff' ? (
            <StaffDashboard user={MOCK_USERS.staff} />
          ) : (
            <AdminDashboard user={MOCK_USERS.admin} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
