import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  size?: "default" | "sm" | "lg";
}

export function ThemeToggle({ className, size = "default" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useThemeStore();
  
  return (
    <Button
      variant="ghost"
      size={size === "sm" ? "icon-sm" : "icon"}
      onClick={toggleTheme}
      className={cn("relative", className)}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <Sun className={cn(
        "h-5 w-5 transition-all duration-300",
        theme === 'dark' ? "rotate-90 scale-0" : "rotate-0 scale-100"
      )} />
      <Moon className={cn(
        "absolute h-5 w-5 transition-all duration-300",
        theme === 'dark' ? "rotate-0 scale-100" : "-rotate-90 scale-0"
      )} />
    </Button>
  );
}
