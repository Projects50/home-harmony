import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SidebarNavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
  collapsed?: boolean;
}

export function SidebarNavItem({ to, icon: Icon, label, badge, collapsed }: SidebarNavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
  
  return (
    <RouterNavLink
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive && "bg-sidebar-accent text-sidebar-primary shadow-sm",
        collapsed && "justify-center px-2"
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-primary")} />
      {!collapsed && (
        <>
          <span className="flex-1">{label}</span>
          {badge !== undefined && badge > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground px-1.5">
              {badge > 99 ? '99+' : badge}
            </span>
          )}
        </>
      )}
    </RouterNavLink>
  );
}
