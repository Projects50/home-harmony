import {
  CheckSquare,
  Activity,
  Lightbulb,
  BookOpen,
  Receipt,
  TrendingUp,
  Calendar,
  Target,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { useTodoStore } from "@/stores/todoStore";
import { useSportsStore } from "@/stores/sportsStore";
import { useBooksStore } from "@/stores/booksStore";
import { useExpensesStore } from "@/stores/expensesStore";
import { useIdeasStore } from "@/stores/ideasStore";
import { useAuthStore } from "@/stores/authStore";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const todos = useTodoStore((s) => s.todos);
  const activities = useSportsStore((s) => s.activities);
  const goals = useSportsStore((s) => s.goals);
  const books = useBooksStore((s) => s.books);
  const expenses = useExpensesStore((s) => s.expenses);
  const budgets = useExpensesStore((s) => s.budgets);
  const ideas = useIdeasStore((s) => s.ideas);

  const pendingTodos = todos.filter((t) => !t.completed).length;
  const completedTodos = todos.filter((t) => t.completed).length;
  const totalTodos = todos.length;
  const todoCompletionRate = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  const thisWeekActivities = activities.filter((a) => {
    const activityDate = new Date(a.date);
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    return activityDate >= weekAgo;
  });

  const currentlyReading = books.filter((b) => b.status === "reading");
  
  const thisMonthExpenses = expenses.reduce((sum, e) => {
    const expenseDate = new Date(e.date);
    const thisMonth = new Date();
    if (expenseDate.getMonth() === thisMonth.getMonth() && expenseDate.getFullYear() === thisMonth.getFullYear()) {
      return sum + e.amount;
    }
    return sum;
  }, 0);

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const budgetUsage = totalBudget > 0 ? (thisMonthExpenses / totalBudget) * 100 : 0;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
      <PageHeader
        title={`${greeting()}, ${user?.name || "there"}!`}
        description="Here's an overview of your life dashboard"
      >
        <Button variant="gradient" asChild>
          <Link to="/todos">
            <Plus className="h-4 w-4" />
            Quick Add
          </Link>
        </Button>
      </PageHeader>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "0ms" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Tasks
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingTodos}</div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={todoCompletionRate} className="h-1.5 flex-1" />
              <span className="text-xs text-muted-foreground">
                {Math.round(todoCompletionRate)}% done
              </span>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "50ms" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Week's Workouts
            </CardTitle>
            <Activity className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{thisWeekActivities.length}</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-xs text-muted-foreground">
                {thisWeekActivities.reduce((sum, a) => sum + a.duration, 0)} min total
              </span>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Currently Reading
            </CardTitle>
            <BookOpen className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{currentlyReading.length}</div>
            <div className="text-xs text-muted-foreground mt-2 truncate">
              {currentlyReading[0]?.title || "No books in progress"}
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "150ms" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Spending
            </CardTitle>
            <Receipt className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${thisMonthExpenses.toFixed(0)}</div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={Math.min(budgetUsage, 100)} className="h-1.5 flex-1" />
              <span className="text-xs text-muted-foreground">
                {Math.round(budgetUsage)}% of budget
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card variant="elevated">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-primary" />
              Upcoming Tasks
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/todos">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {todos
              .filter((t) => !t.completed)
              .slice(0, 5)
              .map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div
                    className={`h-2 w-2 rounded-full ${
                      todo.priority === "high"
                        ? "bg-destructive"
                        : todo.priority === "medium"
                        ? "bg-warning"
                        : "bg-muted-foreground"
                    }`}
                  />
                  <span className="flex-1 text-sm font-medium truncate">
                    {todo.title}
                  </span>
                  {todo.dueDate && (
                    <Badge variant="muted" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(todo.dueDate).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
              ))}
            {todos.filter((t) => !t.completed).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                All caught up! 🎉
              </p>
            )}
          </CardContent>
        </Card>

        {/* Goals Progress */}
        <Card variant="elevated">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-success" />
              Goals Progress
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/sports">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.map((goal) => {
              const progress = (goal.current / goal.target) * 100;
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize">
                      {goal.type} {goal.metric}
                    </span>
                    <span className="text-muted-foreground">
                      {goal.current} / {goal.target}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
            {goals.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Set your first goal to track progress
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Ideas */}
        <Card variant="elevated">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-warning" />
              Recent Ideas
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/ideas">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {ideas
              .filter((i) => !i.archived)
              .slice(0, 3)
              .map((idea) => (
                <div
                  key={idea.id}
                  className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {idea.pinned && (
                      <Badge variant="accent" className="text-xs">Pinned</Badge>
                    )}
                    <span className="font-medium text-sm">{idea.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {idea.content.replace(/[#*_]/g, "")}
                  </p>
                </div>
              ))}
            {ideas.filter((i) => !i.archived).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Capture your first idea
              </p>
            )}
          </CardContent>
        </Card>

        {/* Budget Overview */}
        <Card variant="elevated">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-warning" />
              Budget Overview
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/expenses">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgets.slice(0, 4).map((budget) => {
              const progress = (budget.spent / budget.limit) * 100;
              const isOverBudget = progress > 100;
              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{budget.category}</span>
                    <span className={isOverBudget ? "text-destructive" : "text-muted-foreground"}>
                      ${budget.spent} / ${budget.limit}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(progress, 100)}
                    className={`h-2 ${isOverBudget ? "[&>div]:bg-destructive" : ""}`}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
