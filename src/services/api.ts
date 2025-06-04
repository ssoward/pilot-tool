import axios from 'axios';
import type { Initiative } from '../types/Initiative';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor for authentication if needed
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const initiativeService = {
  getAllInitiatives: async (): Promise<Initiative[]> => {
    const response = await apiClient.get('/initiatives');
    return response.data;
  },
  
  getInitiativeById: async (id: string): Promise<Initiative> => {
    const response = await apiClient.get(`/initiatives/${id}`);
    return response.data;
  },
  
  createInitiative: async (initiative: Omit<Initiative, 'id'>): Promise<Initiative> => {
    const response = await apiClient.post('/initiatives', initiative);
    return response.data;
  },
  
  updateInitiative: async (id: string, initiative: Partial<Initiative>): Promise<Initiative> => {
    const response = await apiClient.put(`/initiatives/${id}`, initiative);
    return response.data;
  },
  
  deleteInitiative: async (id: string): Promise<void> => {
    await apiClient.delete(`/initiatives/${id}`);
  },
  
  syncInitiativeWithJira: async (id: string): Promise<any> => {
    const response = await apiClient.post(`/initiatives/${id}/sync-jira`);
    return response.data;
  }
};

export const authService = {
  login: async (username: string, password: string): Promise<{ token: string, user: any }> => {
    const response = await apiClient.post('/auth/login', { username, password });
    return response.data;
  },
  
  register: async (userData: any): Promise<any> => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  },
  
  setAuthData: (token: string, user: any) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export default { initiativeService, authService };
