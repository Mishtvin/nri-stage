'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminAuth, AdminUser } from '@/lib/admin-auth';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/lib/auth';

interface AdminAuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // This listener synchronizes our auth state with Firebase's auth state.
    const unsubscribe = authService.onAuthStateChange((firebaseUser) => {
      const isCookieAuth = adminAuth.isAuthenticated();

      // For admin section, we require both a valid cookie AND a Firebase session.
      if (isCookieAuth && firebaseUser) {
        setIsAuthenticated(true);
        setUser(adminAuth.getCurrentUser());
      } else {
        setIsAuthenticated(false);
        setUser(null);
        // If we are on an admin page that requires auth, redirect to login.
        if (pathname?.startsWith('/admin') && pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      }
      
      // We are finished loading only after this check is complete.
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const adminUser = await adminAuth.login(username, password);
      if (adminUser) {
        // Successful login will trigger onAuthStateChange, which handles state updates.
        return true;
      }
      // If login fails, stop loading and return false.
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Admin login error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    await adminAuth.logout();
    // Successful logout will trigger onAuthStateChange, handling state and redirection.
  };

  return (
    <AdminAuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated }}>
      {isLoading ? null : children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
