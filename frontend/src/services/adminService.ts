import { type User, type DashboardStats } from '../types';
import { auth } from '../firebase/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Fetch-based API calls with proper typing
const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json() as ApiResponse<T>;
  return result.data;
};

export const adminService = {
  async getUsers(): Promise<User[]> {
    return apiCall<User[]>('/admin/users');
  },

  async updateUserRole(uid: string, role: 'admin' | 'user'): Promise<User> {
    return apiCall<User>(`/admin/users/${uid}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },

  async getDashboardStats(): Promise<DashboardStats> {
    return apiCall<DashboardStats>('/admin/stats');
  },

  async deleteUser(uid: string): Promise<void> {
    await apiCall<void>(`/admin/users/${uid}`, {
      method: 'DELETE',
    });
  },
};