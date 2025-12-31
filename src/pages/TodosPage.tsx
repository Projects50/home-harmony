import { useState } from "react";
import {
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Calendar,
  Tag,
  ChevronDown,
  ChevronRight,
  Trash2,
  MoreHorizontal,
  Repeat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTodoStore, Todo } from "@/stores/todoStore";
import { cn } from "@/lib/utils";

export default function TodosPage() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleComplete } = useTodoStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [showCompleted, setShowCompleted] = useState(true);
  const [expandedTodos, setExpandedTodos] = useState<Set<string>>(new Set());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // New todo form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("medium");
  const [newDueDate, setNewDueDate] = useState("");
  const [newRecurring, setNewRecurring] = useState<"daily" | "weekly" | "monthly" | "">("");

  const filteredTodos = todos
    .filter((todo) => {
      const matchesSearch =
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = filterPriority === "all" || todo.priority === filterPriority;
      const matchesCompleted = showCompleted || !todo.completed;
      const isTopLevel = !todo.parentId;
      return matchesSearch && matchesPriority && matchesCompleted && isTopLevel;
    })
    .sort((a, b) => {
      // Sort by completion, then priority, then due date
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });

  const getSubTodos = (parentId: string) =>
    todos.filter((t) => t.parentId === parentId);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedTodos);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedTodos(newExpanded);
  };

  const handleAddTodo = () => {
    if (!newTitle.trim()) return;
    
    addTodo({
      title: newTitle,
      description: newDescription || undefined,
      priority: newPriority,
      completed: false,
      dueDate: newDueDate || undefined,
      recurring: newRecurring || null,
      parentId: null,
      tags: [],
    });

    // Reset form
    setNewTitle("");
    setNewDescription("");
    setNewPriority("medium");
    setNewDueDate("");
    setNewRecurring("");
    setIsDialogOpen(false);
  };

  const renderTodo = (todo: Todo, level = 0) => {
    const subTodos = getSubTodos(todo.id);
    const hasSubTodos = subTodos.length > 0;
    const isExpanded = expandedTodos.has(todo.id);

    return (
      <div key={todo.id} className="animate-slide-up" style={{ animationDelay: `${level * 50}ms` }}>
        <div
          className={cn(
            "flex items-center gap-3 p-4 rounded-lg border transition-all duration-200",
            "hover:shadow-sm",
            todo.completed
              ? "bg-muted/30 border-muted"
              : "bg-card border-border hover:border-primary/20",
            level > 0 && "ml-8"
          )}
        >
          {hasSubTodos && (
            <button
              onClick={() => toggleExpanded(todo.id)}
              className="p-0.5 hover:bg-muted rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          )}

          <button
            onClick={() => toggleComplete(todo.id)}
            className="shrink-0 transition-colors"
          >
            {todo.completed ? (
              <CheckCircle2 className="h-5 w-5 text-success" />
            ) : (
              <Circle className={cn(
                "h-5 w-5",
                todo.priority === "high"
                  ? "text-destructive"
                  : todo.priority === "medium"
                  ? "text-warning"
                  : "text-muted-foreground"
              )} />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <p className={cn(
              "font-medium text-sm",
              todo.completed && "line-through text-muted-foreground"
            )}>
              {todo.title}
            </p>
            {todo.description && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {todo.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {todo.recurring && (
              <Badge variant="muted" className="text-xs gap-1">
                <Repeat className="h-3 w-3" />
                {todo.recurring}
              </Badge>
            )}
            {todo.dueDate && (
              <Badge variant="outline" className="text-xs gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(todo.dueDate).toLocaleDateString()}
              </Badge>
            )}
            {todo.tags.length > 0 && (
              <Badge variant="secondary" className="text-xs gap-1">
                <Tag className="h-3 w-3" />
                {todo.tags[0]}
                {todo.tags.length > 1 && `+${todo.tags.length - 1}`}
              </Badge>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => deleteTodo(todo.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {hasSubTodos && isExpanded && (
          <div className="mt-2 space-y-2">
            {subTodos.map((subTodo) => renderTodo(subTodo, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <PageHeader
        title="Todos"
        description="Manage your tasks and stay organized"
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter task title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add more details..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={newPriority} onValueChange={(v) => setNewPriority(v as "low" | "medium" | "high")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Recurring</Label>
                  <Select value={newRecurring} onValueChange={(v) => setNewRecurring(v as "daily" | "weekly" | "monthly" | "")}>
                    <SelectTrigger>
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date (optional)</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                />
              </div>

              <Button onClick={handleAddTodo} variant="gradient" className="w-full">
                Add Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={showCompleted ? "secondary" : "outline"}
              onClick={() => setShowCompleted(!showCompleted)}
            >
              {showCompleted ? "Showing Completed" : "Hiding Completed"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Todos List */}
      <div className="space-y-3">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => renderTodo(todo))
        ) : (
          <EmptyState
            title="No tasks found"
            description={searchQuery ? "Try adjusting your search or filters" : "Add your first task to get started"}
            action={
              <Button variant="gradient" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
