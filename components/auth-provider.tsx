'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/lib/auth';
import { User } from '@/components/shared/types';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicRoutes = ['/login', '/register', '/verify-email'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user);
      setIsLoading(false);
      
      // Redirect logic
      if (!user && !publicRoutes.includes(pathname) && !pathname.startsWith('/admin') && pathname !== '/') {
        router.push('/login');
      }
      if (user && (publicRoutes.includes(pathname) || pathname === '/')) {
        router.push('/profile');
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    router.push('/login');
  };

  if (isLoading) {
    // You can return a global loader here
    return (
        <div 
          className="min-h-screen bg-background text-foreground flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, hsl(222.2 84% 4.9%) 0%, hsl(217.2 32.6% 17.5%) 100%)'
          }}
        >
          {/* Optional: Add a loading spinner component */}
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
