import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { type AuthUser } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUserRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserRole = async () => {
    if (auth.currentUser) {
      try {
        const userRole = await authService.getUserRole(auth.currentUser.uid);
        setUser(prev => prev ? { ...prev, role: userRole } : null);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          console.log('🔐 Auth state changed for user:', firebaseUser.email);
          const userRole = await authService.getUserRole(firebaseUser.uid);
          console.log('👤 User role fetched:', userRole);
          
          const authUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: userRole,
          };
          
          setUser(authUser);
          console.log('✅ Auth user set:', authUser);
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: 'user',
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await authService.signIn(email, password);
      // Force refresh user role after successful login
      setTimeout(async () => {
        if (auth.currentUser) {
          console.log('🔄 Refreshing user role after login...');
          await refreshUserRole();
        }
      }, 1000);
    } catch (error) {
      console.error('❌ Login failed in context:', error);
      throw error; // Re-throw so components can handle the error
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      await authService.signUp(email, password, displayName);
    } catch (error) {
      console.error('❌ Registration failed in context:', error);
      throw error; // Re-throw so components can handle the error
    }
  };

  const loginWithGoogle = async () => {
    try {
      await authService.signInWithGoogle();
    } catch (error) {
      console.error('❌ Google login failed in context:', error);
      throw error; // Re-throw so components can handle the error
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('❌ Logout failed in context:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    refreshUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};