"use client";

import { Bell, Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/components/ThemeProvider";
import { useSession } from "next-auth/react";

interface AppHeaderProps {
  onMenuClick: () => void;
  shopName?: string;
}

export function AppHeader({ onMenuClick, shopName = "Mi Taller" }: AppHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "SF";

  return (
    <header className="h-14 border-b border-border flex items-center px-4 gap-3 shrink-0 bg-background">
      <button
        className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
        onClick={onMenuClick}
        data-testid="open-sidebar"
        aria-label="Abrir menú"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1">
        <h2
          className="text-sm font-semibold hidden sm:block text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {shopName}
        </h2>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="relative"
        data-testid="notifications-button"
        aria-label="Notificaciones"
      >
        <Bell className="w-4 h-4" />
        <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] bg-primary text-primary-foreground">
          3
        </Badge>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        data-testid="theme-toggle"
        aria-label={theme === "dark" ? "Modo claro" : "Modo oscuro"}
      >
        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </Button>

      <Avatar className="w-8 h-8 cursor-pointer">
        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
          {userInitials}
        </AvatarFallback>
      </Avatar>
    </header>
  );
}
