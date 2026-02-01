'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StaffDashboard } from '@/components/attendance/StaffDashboard';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { useRole } from '@/hooks/useRole';
import { User } from '@/types';

const MOCK_USERS: Record<'staff' | 'admin', User> = {
  staff: {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.j@precision.inc',
    role: 'staff',
    department: 'Engineering',
    avatar: 'AJ',
  },
  admin: {
    id: 'adm_1',
    name: 'Sarah Wilson',
    email: 'sarah.w@precision.inc',
    role: 'admin',
    department: 'Operations',
    avatar: 'SW',
  }
};

export default function HomePage() {
  const { role } = useRole();
  const [mounted, setMounted] = useState(false);

  // Prevent Hydration Mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Or a specific skeleton loader

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={role} // Key triggers the animation when role changes
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full"
      >
        {role === 'staff' ? (
          <StaffDashboard user={MOCK_USERS.staff} />
        ) : (
          <AdminDashboard user={MOCK_USERS.admin} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}