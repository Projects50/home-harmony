import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserSettings {
  // Dashboard preferences
  defaultLandingModule: 'dashboard' | 'todos' | 'sports' | 'ideas' | 'books' | 'expenses';
  enabledWidgets: string[];
  widgetOrder: string[];
  
  // Notifications
  globalRemindersEnabled: boolean;
  defaultReminderTime: string;
  quietHoursStart: string;
  quietHoursEnd: string;
  emailNotifications: boolean;
  inAppNotifications: boolean;
  
  // Localization
  timezone: string;
  currency: string;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  weekStartDay: 'sunday' | 'monday';
  
  // Data
  lastExportDate?: string;
}

interface SettingsState {
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
  resetToDefaults: () => void;
}

const defaultSettings: UserSettings = {
  defaultLandingModule: 'dashboard',
  enabledWidgets: ['todos', 'sports', 'expenses', 'books', 'ideas'],
  widgetOrder: ['todos', 'sports', 'expenses', 'books', 'ideas'],
  globalRemindersEnabled: true,
  defaultReminderTime: '09:00',
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  emailNotifications: true,
  inAppNotifications: true,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  weekStartDay: 'monday',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),
      resetToDefaults: () => set({ settings: defaultSettings }),
    }),
    { name: 'homemanager-settings' }
  )
);
