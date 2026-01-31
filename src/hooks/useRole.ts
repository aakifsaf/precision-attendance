import { useState, useEffect } from 'react';
import { UserRole } from '@/types';

const ROLE_STORAGE_KEY = 'user_role';

export const useRole = () => {
  const [role, setRole] = useState<UserRole>('staff');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize role from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedRole = localStorage.getItem(ROLE_STORAGE_KEY) as UserRole | null;
    
    if (storedRole && (storedRole === 'staff' || storedRole === 'admin')) {
      setRole(storedRole);
    }
    
    setIsInitialized(true);
  }, []);

  // Persist role to localStorage when it changes
  const updateRole = (newRole: UserRole) => {
    if (typeof window === 'undefined') return;
    
    setRole(newRole);
    localStorage.setItem(ROLE_STORAGE_KEY, newRole);
    
    // Dispatch event for other components to listen to
    window.dispatchEvent(new CustomEvent('roleChange', { detail: newRole }));
  };

  // Listen for role changes from other parts of the app
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleRoleChange = (event: CustomEvent<UserRole>) => {
      setRole(event.detail);
    };

    window.addEventListener('roleChange', handleRoleChange as EventListener);
    
    return () => {
      window.removeEventListener('roleChange', handleRoleChange as EventListener);
    };
  }, []);

  return {
    role,
    setRole: updateRole,
    isInitialized,
    isStaff: role === 'staff',
    isAdmin: role === 'admin',
  };
};