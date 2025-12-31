import { create } from 'zustand';

export interface Activity {
  id: string;
  type: 'running' | 'cycling' | 'swimming' | 'gym' | 'yoga' | 'hiking' | 'other';
  name: string;
  duration: number; // minutes
  distance?: number; // km
  calories?: number;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  type: 'weekly' | 'monthly';
  target: number;
  current: number;
  metric: 'activities' | 'duration' | 'distance' | 'calories';
  startDate: string;
  endDate: string;
}

interface SportsState {
  activities: Activity[];
  goals: Goal[];
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
}

export const useSportsStore = create<SportsState>((set) => ({
  activities: [
    {
      id: '1',
      type: 'running',
      name: 'Morning Run',
      duration: 45,
      distance: 5.2,
      calories: 420,
      date: new Date().toISOString(),
      notes: 'Felt great today!',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'gym',
      name: 'Upper Body Workout',
      duration: 60,
      calories: 380,
      date: new Date(Date.now() - 86400000).toISOString(),
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '3',
      type: 'cycling',
      name: 'Evening Ride',
      duration: 90,
      distance: 25,
      calories: 650,
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ],
  goals: [
    {
      id: '1',
      type: 'weekly',
      target: 5,
      current: 3,
      metric: 'activities',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    },
  ],
  
  addActivity: (activity) => set((state) => ({
    activities: [
      ...state.activities,
      { ...activity, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
    ],
  })),
  
  updateActivity: (id, updates) => set((state) => ({
    activities: state.activities.map((a) => (a.id === id ? { ...a, ...updates } : a)),
  })),
  
  deleteActivity: (id) => set((state) => ({
    activities: state.activities.filter((a) => a.id !== id),
  })),
  
  addGoal: (goal) => set((state) => ({
    goals: [...state.goals, { ...goal, id: crypto.randomUUID() }],
  })),
  
  updateGoal: (id, updates) => set((state) => ({
    goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
  })),
}));
