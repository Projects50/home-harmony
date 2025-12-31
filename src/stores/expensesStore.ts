import { create } from 'zustand';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  paymentMethod?: string;
  recurring?: boolean;
  tags: string[];
  createdAt: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  period: 'weekly' | 'monthly' | 'yearly';
  spent: number;
}

interface ExpensesState {
  expenses: Expense[];
  budgets: Budget[];
  categories: string[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
}

export const useExpensesStore = create<ExpensesState>((set) => ({
  categories: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Education', 'Other'],
  expenses: [
    {
      id: '1',
      amount: 45.50,
      category: 'Food',
      description: 'Grocery shopping',
      date: new Date().toISOString(),
      paymentMethod: 'card',
      recurring: false,
      tags: ['groceries'],
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      amount: 120,
      category: 'Transport',
      description: 'Monthly transit pass',
      date: new Date().toISOString(),
      paymentMethod: 'card',
      recurring: true,
      tags: ['monthly', 'commute'],
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      amount: 15.99,
      category: 'Entertainment',
      description: 'Streaming subscription',
      date: new Date(Date.now() - 86400000 * 5).toISOString(),
      paymentMethod: 'card',
      recurring: true,
      tags: ['subscription'],
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  ],
  budgets: [
    { id: '1', category: 'Food', limit: 500, period: 'monthly', spent: 245 },
    { id: '2', category: 'Entertainment', limit: 100, period: 'monthly', spent: 65 },
    { id: '3', category: 'Transport', limit: 200, period: 'monthly', spent: 120 },
  ],
  
  addExpense: (expense) => set((state) => ({
    expenses: [
      ...state.expenses,
      { ...expense, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
    ],
  })),
  
  updateExpense: (id, updates) => set((state) => ({
    expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)),
  })),
  
  deleteExpense: (id) => set((state) => ({
    expenses: state.expenses.filter((e) => e.id !== id),
  })),
  
  addBudget: (budget) => set((state) => ({
    budgets: [...state.budgets, { ...budget, id: crypto.randomUUID(), spent: 0 }],
  })),
  
  updateBudget: (id, updates) => set((state) => ({
    budgets: state.budgets.map((b) => (b.id === id ? { ...b, ...updates } : b)),
  })),
}));
