import { createContext, useContext, useState } from 'react';
import { type User, type DashboardStats } from '../types';

interface AdminContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  stats: DashboardStats | null;
  setStats: (stats: DashboardStats) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);

  const value = {
    users,
    setUsers,
    stats,
    setStats,
    loading,
    setLoading,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};