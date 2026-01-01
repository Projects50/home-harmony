# Analytics Page Customization Context

This document provides context for customizing the Analytics page UI. Share this with your frontend-focused AI along with the required files.

## Required Files to Provide

1. **`src/pages/AnalyticsPage.tsx`** - Main analytics page component
2. **`src/stores/sportsStore.ts`** - Sports data structure and store
3. **`src/stores/habitsStore.ts`** - Habits data structure and store
4. **`src/stores/expensesStore.ts`** - Expenses data structure and store
5. **`src/lib/currency.ts`** - Currency formatting utilities
6. **`src/stores/settingsStore.ts`** - Settings store (for currency preference)

## Data Connections & Usage

### Sports Analytics

**Data Source**: `useSportsStore()`
- `activities`: Array of activity objects with `date`, `type`, `duration`, `intensity`, `calories`
- `goals`: Array of goal objects with `type`, `metric`, `current`, `target`

**Key Functions**:
- Filter activities by time range (week/month/year)
- Calculate totals: activities count, total duration, total calories
- Group by activity type for distribution
- Track goal completion percentages

**Charts Used**:
- **AreaChart**: Duration/intensity over time (X-axis: dates, Y-axis: duration/intensity)
- **PieChart**: Activity type distribution (categories: activity types, values: counts or durations)

**Metrics Displayed**:
- Total activities in time range
- Total duration (minutes)
- Total calories burned
- Goal completion status

### Habits Analytics

**Data Source**: `useHabitsStore()`
- `habits`: Array of habit objects with `name`, `category`, `trackingType`, `color`, etc.
- `entries`: Array of entry objects with `habitId`, `date`, `value`
- `getHeatmapData(habitId)`: Returns `Record<string, number>` mapping dates to values
- `getStreak(habitId)`: Returns current streak number

**Key Functions**:
- Aggregate entries by habit and date
- Calculate streaks per habit
- Group by category for breakdown
- Generate heatmap data for visualization

**Charts Used**:
- **Heatmap**: GitHub-style yearly heatmap (custom implementation, not Recharts)
- **PieChart**: Category breakdown (categories: habit categories, values: habit counts or total entries)
- **Line/Bar Chart**: Consistency over time (optional)

**Metrics Displayed**:
- Total habits
- Active habits (with entries in time range)
- Total streak days across all habits
- Category distribution

### Expenses Analytics

**Data Source**: `useExpensesStore()` and `useSettingsStore()`
- `expenses`: Array of expense objects with `amount`, `category`, `date`, `type` ('expense' or 'income')
- `budgets`: Array of budget objects with `category`, `limit`, `spent`, `period`
- `income`: Array of income objects (if separate from expenses)
- `settings.currency`: Current currency preference (USD, EUR, GBP, INR, JPY, CAD, AUD)

**Key Functions**:
- Filter expenses by time range
- Group by category for pie chart
- Calculate totals: total spent, total income, net flow
- Compare budget vs actual spending

**Charts Used**:
- **BarChart**: Monthly spending (X-axis: months, Y-axis: amounts)
- **PieChart**: Category distribution (categories: expense categories, values: amounts)
- **BarChart**: Budget vs Actual comparison (X-axis: categories, Y-axis: budget vs spent)

**Metrics Displayed**:
- Total spent in time range
- Total income in time range
- Net flow (income - expenses)
- Category breakdown
- Budget utilization

## Technical Details

### Dependencies

```typescript
import { recharts } from 'recharts'; // All chart components
import { date-fns } from 'date-fns'; // Date utilities
import { formatCurrency } from '@/lib/currency'; // Currency formatting
import { useSportsStore, useHabitsStore, useExpensesStore, useSettingsStore } from '@/stores/*';
```

### Chart Library: Recharts

Components used:
- `AreaChart`, `Area` - For time series data
- `BarChart`, `Bar` - For comparisons
- `PieChart`, `Pie`, `Cell` - For distributions
- `XAxis`, `YAxis` - Axes
- `CartesianGrid` - Grid lines
- `Tooltip` - Hover tooltips
- `Legend` - Chart legends
- `ResponsiveContainer` - Responsive wrapper

### Color Scheme

```typescript
const COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
];
```

### Currency Formatting

```typescript
import { formatCurrency, CurrencyCode } from '@/lib/currency';

// Usage
const currency = (settings.currency || 'USD') as CurrencyCode;
formatCurrency(amount, currency); // Returns formatted string like "$100.00" or "₹100.00"
```

### Time Range Filtering

Current implementation uses:
- `timeRange` state: `"week" | "month" | "year"`
- Date filtering with `date-fns` functions:
  - `startOfWeek`, `endOfWeek`
  - `startOfMonth`, `endOfMonth`
  - `startOfYear`, `endOfYear`
  - `isWithinInterval`

## Current Implementation Structure

```typescript
export default function AnalyticsPage() {
  // Store hooks
  const { activities, goals } = useSportsStore();
  const { habits, entries, getHeatmapData, getStreak } = useHabitsStore();
  const { expenses, budgets } = useExpensesStore();
  const { settings } = useSettingsStore();
  const currency = (settings.currency || 'USD') as CurrencyCode;
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");

  // Data processing functions
  const getSportsData = () => { /* ... */ };
  const getHabitsData = () => { /* ... */ };
  const getExpensesData = () => { /* ... */ };

  return (
    <div>
      <PageHeader />
      <Tabs>
        <TabsList>
          <TabsTrigger value="sports">Sports</TabsTrigger>
          <TabsTrigger value="habits">Habits</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sports">
          {/* Sports analytics cards and charts */}
        </TabsContent>
        
        <TabsContent value="habits">
          {/* Habits analytics cards and charts */}
        </TabsContent>
        
        <TabsContent value="expenses">
          {/* Expenses analytics cards and charts */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

## What Can Be Customized

1. **Layout & Design**:
   - Card arrangements
   - Spacing and typography
   - Color schemes
   - Visual hierarchy

2. **Chart Types**:
   - Switch between chart types (e.g., line vs area)
   - Add new visualizations
   - Custom chart configurations

3. **Metrics**:
   - Add new calculated metrics
   - Change metric display format
   - Add comparisons (week-over-week, month-over-month)

4. **Interactivity**:
   - Drill-down capabilities
   - Filtering options
   - Date range picker (instead of dropdown)
   - Export functionality

5. **Visual Enhancements**:
   - Animations
   - Loading states
   - Empty states
   - Error handling

## Important Notes

- All data is currently **mock data** stored in Zustand stores
- No API calls are made (Phase 1 - frontend only)
- Currency preference is persisted in `settingsStore`
- Date handling uses ISO strings and `date-fns`
- Charts are responsive via `ResponsiveContainer`
- Tooltips and legends are customizable via Recharts props

## Example Prompt for Frontend AI

"Customize the Analytics page UI to make it more visually engaging. The page currently has three tabs (Sports, Habits, Expenses) with basic charts. I want:
- [Your specific UI requirements]
- [Design preferences]
- [Layout changes]

The page uses Recharts for visualizations and pulls data from Zustand stores. Maintain all existing functionality and data connections. Use the provided files as reference for data structures and current implementation."

