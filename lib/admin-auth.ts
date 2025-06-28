
import Cookies from 'js-cookie';
import { authService } from './auth';

// Constants for authentication
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';
const AUTH_COOKIE_NAME = 'admin_auth_token';
const AUTH_TOKEN_VALUE = 'admin_authenticated'; // In a real app, this should be a JWT or other secure token

export interface AdminUser {
  username: string;
  role: 'admin';
  permissions: string[];
}

// Simple authentication for admin panel
export const adminAuth = {
  // Check credentials
  login: async (username: string, password: string): Promise<AdminUser | null> => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      
      // Also log in to Firebase with the dedicated admin account
      const firebaseAdminUser = await authService.signInWithEmail('admin@nri.com', 'password123');
      if (!firebaseAdminUser) {
        console.error("Could not sign in the Firebase admin user. Ensure the user exists in Firebase Authentication with the correct credentials (admin@nri.com / password123).");
        return null;
      }
      
      const adminUser: AdminUser = {
        username: ADMIN_USERNAME,
        role: 'admin',
        permissions: ['all'] // In a real app, this would be a list of specific permissions
      };
      
      // Set cookie with authentication token
      Cookies.set(AUTH_COOKIE_NAME, AUTH_TOKEN_VALUE, { 
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      });
      
      // Also store in localStorage as a fallback
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_user', JSON.stringify(adminUser));
      }
      
      return adminUser;
    } else {
      return null;
    }
  },
  
  // Logout
  logout: async (): Promise<void> => {
    await authService.signOut(); // Sign out from Firebase
    Cookies.remove(AUTH_COOKIE_NAME, { path: '/' });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_user');
    }
  },
  
  // Check authentication
  isAuthenticated: (): boolean => {
    const cookieAuth = Cookies.get(AUTH_COOKIE_NAME) === AUTH_TOKEN_VALUE;
    
    // If cookie is present, we're authenticated
    if (cookieAuth) return true;
    
    // If no cookie but we have localStorage data, restore the cookie
    if (typeof window !== 'undefined') {
      const localUser = localStorage.getItem('admin_user');
      if (localUser) {
        Cookies.set(AUTH_COOKIE_NAME, AUTH_TOKEN_VALUE, { 
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/'
        });
        return true;
      }
    }
    
    return false;
  },
  
  // Get current user
  getCurrentUser: (): AdminUser | null => {
    if (adminAuth.isAuthenticated()) {
      // Try to get from localStorage first
      if (typeof window !== 'undefined') {
        const localUser = localStorage.getItem('admin_user');
        if (localUser) {
          try {
            return JSON.parse(localUser);
          } catch (e) {
            // If parsing fails, return default user
          }
        }
      }
      
      // Default user if not in localStorage
      return {
        username: ADMIN_USERNAME,
        role: 'admin',
        permissions: ['all']
      };
    }
    return null;
  }
};
