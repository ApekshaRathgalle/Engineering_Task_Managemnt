import { type Task } from '../types';
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

export const taskService = {
  async getTasks(): Promise<Task[]> {
    return apiCall<Task[]>('/tasks');
  },

  async getTaskById(id: string): Promise<Task> {
    return apiCall<Task>(`/tasks/${id}`);
  },

  async createTask(task: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    return apiCall<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    return apiCall<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteTask(id: string): Promise<void> {
    await apiCall<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  async getMyTasks(): Promise<Task[]> {
    return apiCall<Task[]>('/tasks/my');
  },
};