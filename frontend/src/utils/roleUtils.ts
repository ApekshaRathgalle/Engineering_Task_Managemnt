import { type AuthUser } from '../types';

export const isAdmin = (user: AuthUser | null): boolean => {
  return user?.role === 'admin';
};

export const canEditTask = (user: AuthUser | null, taskAssignedTo: string): boolean => {
  if (!user) return false;
  return user.role === 'admin' || user.uid === taskAssignedTo;
};

export const canDeleteTask = (user: AuthUser | null, taskAssignedBy: string): boolean => {
  if (!user) return false;
  return user.role === 'admin' || user.uid === taskAssignedBy;
};