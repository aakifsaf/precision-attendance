'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Component Imports
import { StaffDashboard } from '@/components/attendance/StaffDashboard';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { LandingPage } from '@/components/LandingPage';
import { RoleSwitcher } from '@/components/layout/RoleSwitcher';

// Hooks & Types
import { useRole } from '@/hooks/useRole';
import { User } from '@/types';

const MOCK_USERS: Record<'staff' | 'admin', User> = {
  staff: {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.j@precision.inc',
    role: 'staff',
    department: 'Engineering',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=0D8ABC&color=fff',
  },
  admin: {
    id: 'u_admin_01',
    name: 'Sarah Wilson',
    email: 'sarah.w@precision.inc',
    role: 'admin',
    department: 'Operations',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=9333ea&color=fff',
  }
};

export default function HomePage() {
  const { role, setRole } = useRole();
  const [mounted, setMounted] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  // Prevent Hydration Mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!hasEntered) {
    return (
      <LandingPage 
        onLogin={(selectedRole) => {
          setRole(selectedRole);
          setHasEntered(true);
        }} 
      />
    );
  }

  return (
    <>
      <RoleSwitcher />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={role} // Key triggers animation on role switch
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
    </>
  );
}