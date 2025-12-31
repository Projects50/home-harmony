import { create } from 'zustand';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  recurring?: 'daily' | 'weekly' | 'monthly' | null;
  parentId?: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface TodoState {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleComplete: (id: string) => void;
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [
    {
      id: '1',
      title: 'Complete project proposal',
      description: 'Draft and finalize the Q1 project proposal',
      completed: false,
      priority: 'high',
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      recurring: null,
      parentId: null,
      tags: ['work', 'urgent'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Weekly team sync',
      description: 'Prepare agenda for weekly sync meeting',
      completed: false,
      priority: 'medium',
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      recurring: 'weekly',
      parentId: null,
      tags: ['work', 'meeting'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Review design mockups',
      completed: true,
      priority: 'low',
      parentId: '1',
      tags: ['design'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  
  addTodo: (todo) => set((state) => ({
    todos: [
      ...state.todos,
      {
        ...todo,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  })),
  
  updateTodo: (id, updates) => set((state) => ({
    todos: state.todos.map((todo) =>
      todo.id === id
        ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
        : todo
    ),
  })),
  
  deleteTodo: (id) => set((state) => ({
    todos: state.todos.filter((todo) => todo.id !== id && todo.parentId !== id),
  })),
  
  toggleComplete: (id) => set((state) => ({
    todos: state.todos.map((todo) =>
      todo.id === id
        ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
        : todo
    ),
  })),
}));
