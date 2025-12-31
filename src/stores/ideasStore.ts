import { create } from 'zustand';

export interface Idea {
  id: string;
  title: string;
  content: string;
  tags: string[];
  attachments: string[];
  archived: boolean;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

interface IdeasState {
  ideas: Idea[];
  addIdea: (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateIdea: (id: string, updates: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
  archiveIdea: (id: string) => void;
  togglePin: (id: string) => void;
}

export const useIdeasStore = create<IdeasState>((set) => ({
  ideas: [
    {
      id: '1',
      title: 'App Feature Ideas',
      content: '**Key features to consider:**\n\n1. Dark mode support\n2. Offline sync\n3. Collaborative editing\n4. Export to PDF',
      tags: ['product', 'features'],
      attachments: [],
      archived: false,
      pinned: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Weekend Project',
      content: 'Build a personal blog with:\n- Markdown support\n- Code highlighting\n- RSS feed',
      tags: ['personal', 'coding'],
      attachments: [],
      archived: false,
      pinned: false,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
  ],
  
  addIdea: (idea) => set((state) => ({
    ideas: [
      ...state.ideas,
      {
        ...idea,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  })),
  
  updateIdea: (id, updates) => set((state) => ({
    ideas: state.ideas.map((idea) =>
      idea.id === id
        ? { ...idea, ...updates, updatedAt: new Date().toISOString() }
        : idea
    ),
  })),
  
  deleteIdea: (id) => set((state) => ({
    ideas: state.ideas.filter((idea) => idea.id !== id),
  })),
  
  archiveIdea: (id) => set((state) => ({
    ideas: state.ideas.map((idea) =>
      idea.id === id
        ? { ...idea, archived: !idea.archived, updatedAt: new Date().toISOString() }
        : idea
    ),
  })),
  
  togglePin: (id) => set((state) => ({
    ideas: state.ideas.map((idea) =>
      idea.id === id
        ? { ...idea, pinned: !idea.pinned, updatedAt: new Date().toISOString() }
        : idea
    ),
  })),
}));
