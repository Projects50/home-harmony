# HomeManager - Full Project Documentation

## Project Overview

HomeManager is a comprehensive full-stack personal management application designed to help users organize and track various aspects of their daily life. The application is currently in Phase 1 (Frontend Refinement) with plans for Phase 2 (Architecture Hardening) and Phase 3 (Backend Integration).

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui (Radix UI)** - Component library
- **React Router v6** - Routing
- **Zustand** - State management with persistence
- **TanStack Query** - Data fetching (configured, partially used)
- **React Hook Form + Zod** - Form handling and validation (installed, minimal usage)
- **Recharts** - Charting library
- **date-fns** - Date utilities

### Backend (Planned - Phase 3)
- **Django + Django REST Framework** - Backend framework
- **JWT Authentication** - Auth system
- **PostgreSQL** - Database
- **Redis + Celery** - Background tasks
- **Docker** - Containerization

## Project Structure

```
/home/ichotu/code/projects/home-harmony/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── AppLayout.tsx   # Main app layout with sidebar
│   │   ├── AppSidebar.tsx  # Navigation sidebar
│   │   ├── AuthLayout.tsx  # Auth pages layout
│   │   ├── FloatingActionButton.tsx  # FAB component
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── auth/           # Login, Register, ForgotPassword
│   │   ├── DashboardPage.tsx
│   │   ├── TodosPage.tsx
│   │   ├── HabitsPage.tsx
│   │   ├── SportsPage.tsx
│   │   ├── IdeasPage.tsx
│   │   ├── BooksPage.tsx
│   │   ├── ExpensesPage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   └── SettingsPage.tsx
│   ├── stores/             # Zustand state stores
│   │   ├── authStore.ts
│   │   ├── themeStore.ts
│   │   ├── todoStore.ts
│   │   ├── habitsStore.ts
│   │   ├── sportsStore.ts
│   │   ├── booksStore.ts
│   │   ├── expensesStore.ts
│   │   ├── ideasStore.ts
│   │   └── settingsStore.ts
│   ├── lib/                # Utilities
│   │   ├── utils.ts        # General utilities (cn, etc.)
│   │   └── currency.ts     # Currency formatting
│   ├── hooks/              # Custom React hooks
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── package.json           # Dependencies
└── README.md             # Setup instructions
```

## Core Features

### 1. Authentication (Frontend-only, Mock)
- Login/Register/Forgot Password pages
- Mock authentication with Zustand persistence
- Protected routes via AppLayout

### 2. Theme System
- **Three themes**: Light, Dark, Dim
- Persisted per user via Zustand
- Applied via CSS variables and document class
- Theme toggle component

### 3. Dashboard
- Welcome message with time-based greeting
- Pending Tasks (direct list)
- Week's Total Workout Period
- Currently Reading (book names)
- Weekly Expenses (total)
- Overview section:
  - Recent Ideas
  - Expenses Overview (pie chart by category)
  - Upcoming Tasks or Reminders

### 4. Todos Module
- CRUD operations for tasks
- Priority levels (low, medium, high)
- Due dates
- Recurring tasks (daily, weekly, monthly)
- Subtasks (parent-child relationship)
- Tags
- **Reminders**: One-time and recurring with notification indicators
- Snooze/reschedule UI
- Edit functionality
- Completion tracking

### 5. Habits Module
- Habit definition with:
  - Name, description, icon, color
  - Category
  - Tracking type (incremental or custom value)
  - Custom unit (e.g., pages, minutes)
  - Frequency (daily, weekly, custom)
  - Streak goals
- **GitHub-style yearly heatmap** visualization
- Streak calculation (current and longest)
- Entry tracking with date-based entries
- Completion buttons:
  - Incremental: Toggle completion for today
  - Custom: Prompt for value entry

### 6. Sports Module
- Activity tracking (type, duration, intensity, calories)
- Goals with progress tracking
- Weekly/monthly statistics

### 7. Ideas Module
- Markdown-based idea capture
- Preview mode (default) with rendered markdown
- Edit mode (explicit button)
- Tags via dropdown/multi-select
- Pinning and archiving

### 8. Books Module
- Book library management
- Status tracking (to-read, reading, completed, abandoned)
- Progress tracking (current page / total pages)
- Genre field (10+ default genres)
- Cover image upload/paste
- **Star rating** (1-5) upon completion
- Notes

### 9. Expenses Module
- Expense and income tracking
- Categories with custom category support
- Budgets (weekly, monthly, yearly)
- **Multi-currency support** (USD, EUR, GBP, INR, JPY, CAD, AUD)
- Currency persistence across pages
- **Tabs**: All, Expenses, Income, Budgets
- **Pie chart** showing spending by category
- Transaction list with filtering

### 10. Analytics Page
- **Sports Analytics**:
  - Weekly activity heatmap
  - Line chart for duration/intensity over time
  - Goal completion metrics
  - Activity distribution pie chart
- **Habit Tracker Analytics**:
  - GitHub-style yearly heatmap
  - Streak visualization
  - Consistency graphs
  - Category breakdown
- **Expenses Analytics**:
  - Monthly spending bar chart
  - Category pie chart
  - Budget vs actual comparison
  - Multi-currency aware
- Time range selector (week, month, year)

### 11. Settings
- Account & Security
- Notifications (reminders, email, quiet hours)
- Dashboard preferences
- Localization (currency, date format, week start day)
- Data export/import

## State Management

### Zustand Stores

All stores use `persist` middleware for localStorage persistence:

1. **authStore**: User authentication state
2. **themeStore**: Theme preference (light/dark/dim)
3. **todoStore**: Todos, reminders, subtasks
4. **habitsStore**: Habits, entries, streaks, heatmap data
5. **sportsStore**: Activities, goals
6. **booksStore**: Books, progress, ratings
7. **expensesStore**: Expenses, income, budgets, categories
8. **ideasStore**: Ideas, tags
9. **settingsStore**: User preferences

### Data Flow

- Stores contain mock data and local CRUD operations
- All data is persisted to localStorage
- No API calls currently (Phase 1)
- Ready for API integration (Phase 2/3)

## Styling System

### Design Tokens

CSS variables defined in `src/index.css`:
- Color system (HSL format)
- Spacing, shadows, gradients
- Theme-specific overrides (light, dark, dim)

### Components

- shadcn/ui primitives (Button, Card, Dialog, etc.)
- Custom components (PageHeader, EmptyState, FloatingActionButton)
- Consistent spacing and animations

## Currency System

- **Supported currencies**: USD, EUR, GBP, INR, JPY, CAD, AUD
- **Formatting**: `formatCurrency(amount, currency)` utility
- **Persistence**: Stored in settingsStore, used across Dashboard, Expenses, Analytics
- **Display**: Symbol + formatted number

## Date Handling

- ISO string format for storage (`YYYY-MM-DD` or full ISO)
- `date-fns` for date manipulation
- Localized display via `toLocaleDateString()`

## Routing

Protected routes via `AppLayout`:
- `/dashboard` - Main dashboard
- `/todos` - Todo management
- `/habits` - Habit tracking
- `/sports` - Sports/activities
- `/ideas` - Ideas capture
- `/books` - Book library
- `/expenses` - Expenses & income
- `/analytics` - Analytics dashboard
- `/settings` - User settings

Public routes via `AuthLayout`:
- `/login`
- `/register`
- `/forgot-password`

## Phase Status

### ✅ Phase 1 - Frontend Refinement & UX Polish (COMPLETED)

**Themes**:
- ✅ Light, Dark, Dim themes
- ✅ Muted colors, soft borders
- ✅ Theme persistence

**Dashboard**:
- ✅ Simplified layout
- ✅ Weekly snapshots
- ✅ Overview section with charts

**Analytics Page**:
- ✅ Sports, Habits, Expenses analytics
- ✅ Charts and visualizations

**Habit Tracker**:
- ✅ Full module with heatmap
- ✅ Streak tracking
- ✅ Completion buttons

**Task Reminders**:
- ✅ One-time and recurring reminders
- ✅ Notification indicators
- ✅ Snooze/reschedule

**Module UX Fixes**:
- ✅ Ideas: Preview mode, explicit edit, tags
- ✅ Books: Genre, cover, edit menu, star rating
- ✅ All modules: Explicit edit mode

**Global UX**:
- ✅ Floating Action Button (FAB)
- ✅ Sticky sidebar
- ✅ Multi-currency support

### 🔄 Phase 2 - Frontend Architecture Hardening (PENDING)

- [ ] API service layer (`src/api` or `src/services`)
- [ ] Request/response TypeScript types
- [ ] Auth token handling abstraction
- [ ] Replace mock delays with API-ready patterns
- [ ] TanStack Query integration for data fetching
- [ ] Consistent loading & error states
- [ ] Zod validation for forms
- [ ] TypeScript strict mode (`strictNullChecks`)
- [ ] Normalize date handling
- [ ] Remove unused dependencies

### 📋 Phase 3 - Backend Creation & Integration (PENDING)

**Backend Stack**:
- [ ] Django + DRF setup
- [ ] JWT authentication
- [ ] PostgreSQL database
- [ ] Redis + Celery
- [ ] Docker configuration

**Core Features**:
- [ ] User auth (register, login, logout, reset)
- [ ] User settings persistence
- [ ] CRUD APIs for all modules
- [ ] Import/Export functionality
- [ ] Analytics aggregation endpoints
- [ ] Security & validation

## Known Issues & Limitations

1. **Frontend-only**: All data is stored in localStorage, no backend
2. **Mock authentication**: Login doesn't verify credentials
3. **No real notifications**: Reminder indicators are UI-only
4. **No data sync**: No cloud backup or multi-device sync
5. **Limited validation**: Some forms lack comprehensive validation

## Development Setup

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Currently none required. Future backend integration will need:
- `VITE_API_URL` - Backend API endpoint
- `VITE_WS_URL` - WebSocket URL (if needed)

## Testing

No test suite currently. Planned for Phase 2:
- Unit tests (Vitest)
- Component tests (React Testing Library)
- E2E tests (Playwright)

## Deployment

Currently frontend-only:
- Build: `npm run build`
- Output: `dist/` directory
- Deploy to any static hosting (Vercel, Netlify, etc.)

Future (Phase 3):
- Docker containers for frontend and backend
- Docker Compose for local development
- Production deployment guide

## Future Enhancements

1. **Backend Integration** (Phase 3)
   - Real authentication
   - Database persistence
   - Multi-device sync
   - Cloud backup

2. **Additional Features**
   - Mobile app (React Native)
   - Email notifications
   - Calendar integration
   - Export to PDF/CSV
   - Collaborative features

3. **Performance**
   - Code splitting
   - Lazy loading
   - Image optimization
   - Caching strategies

## Analytics Page Customization Context

For customizing the Analytics page UI, provide these files to your frontend-focused AI:

**Required Files**:
1. `src/pages/AnalyticsPage.tsx` - Main analytics page component
2. `src/stores/sportsStore.ts` - Sports data structure
3. `src/stores/habitsStore.ts` - Habits data structure
4. `src/stores/expensesStore.ts` - Expenses data structure
5. `src/lib/currency.ts` - Currency formatting utilities
6. `src/stores/settingsStore.ts` - Settings (for currency preference)

**Data Connections**:

**Sports Analytics**:
- Uses `useSportsStore()` for activities and goals
- Time range filtering (week/month/year)
- Charts: AreaChart (duration/intensity over time), PieChart (activity distribution)
- Metrics: Total activities, duration, calories, goal completion

**Habits Analytics**:
- Uses `useHabitsStore()` for habits, entries, streaks
- `getHeatmapData(habitId)` for heatmap visualization
- `getStreak(habitId)` for streak calculations
- Charts: Heatmap visualization, consistency graphs, category breakdown

**Expenses Analytics**:
- Uses `useExpensesStore()` for expenses, budgets, income
- Uses `useSettingsStore()` for currency preference
- Time range filtering
- Charts: BarChart (monthly spending), PieChart (category distribution), Budget vs Actual comparison
- Multi-currency support via `formatCurrency(amount, currency)`

**Key Dependencies**:
- `recharts` for all charts (AreaChart, BarChart, PieChart, etc.)
- `date-fns` for date manipulation
- `@/lib/currency` for currency formatting
- `@/stores/*` for data access

**Current Implementation**:
- Three tabs: Sports, Habits, Expenses
- Time range selector (week/month/year)
- Responsive charts with tooltips and legends
- Color scheme: COLORS array with 8 predefined colors

**What to Customize**:
- Layout and visual design
- Chart types and configurations
- Color schemes
- Spacing and typography
- Additional metrics or visualizations
- Interactive features

---

**Last Updated**: 2024-12-XX
**Version**: Phase 1 Complete
**Status**: Frontend-only, ready for Phase 2

