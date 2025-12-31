import { create } from 'zustand';

export interface Book {
  id: string;
  isbn?: string;
  title: string;
  author: string;
  coverUrl?: string;
  totalPages: number;
  currentPage: number;
  status: 'to-read' | 'reading' | 'completed' | 'abandoned';
  rating?: number;
  notes?: string;
  startDate?: string;
  finishDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface BooksState {
  books: Book[];
  addBook: (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  updateProgress: (id: string, currentPage: number) => void;
}

export const useBooksStore = create<BooksState>((set) => ({
  books: [
    {
      id: '1',
      isbn: '978-0-13-468599-1',
      title: 'The Pragmatic Programmer',
      author: 'David Thomas, Andrew Hunt',
      totalPages: 352,
      currentPage: 180,
      status: 'reading',
      rating: 5,
      startDate: new Date(Date.now() - 86400000 * 14).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Atomic Habits',
      author: 'James Clear',
      totalPages: 320,
      currentPage: 320,
      status: 'completed',
      rating: 5,
      startDate: new Date(Date.now() - 86400000 * 30).toISOString(),
      finishDate: new Date(Date.now() - 86400000 * 10).toISOString(),
      notes: 'Great book on building habits. Key takeaway: small improvements compound.',
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
    {
      id: '3',
      title: 'Deep Work',
      author: 'Cal Newport',
      totalPages: 296,
      currentPage: 0,
      status: 'to-read',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  
  addBook: (book) => set((state) => ({
    books: [
      ...state.books,
      {
        ...book,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  })),
  
  updateBook: (id, updates) => set((state) => ({
    books: state.books.map((book) =>
      book.id === id
        ? { ...book, ...updates, updatedAt: new Date().toISOString() }
        : book
    ),
  })),
  
  deleteBook: (id) => set((state) => ({
    books: state.books.filter((book) => book.id !== id),
  })),
  
  updateProgress: (id, currentPage) => set((state) => ({
    books: state.books.map((book) => {
      if (book.id !== id) return book;
      const status = currentPage >= book.totalPages ? 'completed' : 'reading';
      return {
        ...book,
        currentPage,
        status,
        finishDate: status === 'completed' ? new Date().toISOString() : book.finishDate,
        updatedAt: new Date().toISOString(),
      };
    }),
  })),
}));
