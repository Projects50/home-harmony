import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  
  login: async (email: string, _password: string) => {
    set({ isLoading: true });
    // Simulate API call - replace with actual backend call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const user: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString(),
    };
    
    set({ user, isAuthenticated: true, isLoading: false });
  },
  
  register: async (email: string, _password: string, name: string) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const user: User = {
      id: '1',
      email,
      name,
      createdAt: new Date().toISOString(),
    };
    
    set({ user, isAuthenticated: true, isLoading: false });
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  
  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },
}));
