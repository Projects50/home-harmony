import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Activity,
  Lightbulb,
  BookOpen,
  Receipt,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarNavItem } from "./SidebarNavItem";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useTodoStore } from "@/stores/todoStore";

const navigation = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/todos", icon: CheckSquare, label: "Todos" },
  { to: "/sports", icon: Activity, label: "Sports" },
  { to: "/ideas", icon: Lightbulb, label: "Ideas" },
  { to: "/books", icon: BookOpen, label: "Books" },
  { to: "/expenses", icon: Receipt, label: "Expenses" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const todos = useTodoStore((s) => s.todos);
  const pendingTodos = todos.filter((t) => !t.completed).length;

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-sidebar-border",
        collapsed && "justify-center px-2"
      )}>
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-sm">
            <Home className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg tracking-tight text-sidebar-foreground">
              HomeManager
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navigation.map((item) => (
          <SidebarNavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            badge={item.to === "/todos" ? pendingTodos : undefined}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-sidebar-border p-3 space-y-2">
        <SidebarNavItem
          to="/settings"
          icon={Settings}
          label="Settings"
          collapsed={collapsed}
        />
        
        {/* Theme toggle and collapse button */}
        <div className={cn(
          "flex items-center gap-2 pt-2",
          collapsed ? "flex-col" : "justify-between"
        )}>
          <ThemeToggle size="sm" />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setCollapsed(!collapsed)}
            className="hover:bg-sidebar-accent"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* User info */}
        {user && !collapsed && (
          <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/50">
            <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={logout}
              className="shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
