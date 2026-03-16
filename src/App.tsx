import { Switch, Route, Router, Link, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";
import { ShopFlowLogoFull } from "@/components/ShopFlowLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard, Columns3, CalendarDays, ClipboardList,
  FileText, Receipt, Search, Package, Users, Car, MessageCircle,
  Wrench, Smartphone, ShoppingCart, Megaphone, BarChart3,
  Settings, Sun, Moon, Bell, Menu, X, ChevronDown,
} from "lucide-react";
import { useState } from "react";

// Lazy-free page imports
import Dashboard from "@/pages/dashboard";
import Workboard from "@/pages/workboard";
import CalendarPage from "@/pages/calendar";
import WorkOrders from "@/pages/work-orders";
import Estimates from "@/pages/estimates";
import Invoices from "@/pages/invoices";
import Inspections from "@/pages/inspections";
import Inventory from "@/pages/inventory";
import Customers from "@/pages/customers";
import Vehicles from "@/pages/vehicles";
import LiveChat from "@/pages/live-chat";
import Technicians from "@/pages/technicians";
import TechApp from "@/pages/tech-app";
import PartsOrdering from "@/pages/parts-ordering";
import Marketing from "@/pages/marketing";
import Reports from "@/pages/reports";
import SettingsPage from "@/pages/settings";
import NotFound from "@/pages/not-found";

const navGroups = [
  {
    label: "PRINCIPAL",
    items: [
      { path: "/", icon: LayoutDashboard, label: "Dashboard" },
      { path: "/workboard", icon: Columns3, label: "Workboard" },
      { path: "/calendar", icon: CalendarDays, label: "Calendario" },
    ],
  },
  {
    label: "TALLER",
    items: [
      { path: "/work-orders", icon: ClipboardList, label: "Órdenes de Trabajo" },
      { path: "/estimates", icon: FileText, label: "Presupuestos" },
      { path: "/invoices", icon: Receipt, label: "Facturas" },
      { path: "/inspections", icon: Search, label: "Inspecciones" },
      { path: "/inventory", icon: Package, label: "Inventario" },
    ],
  },
  {
    label: "CLIENTES",
    items: [
      { path: "/customers", icon: Users, label: "Clientes" },
      { path: "/vehicles", icon: Car, label: "Vehículos" },
      { path: "/live-chat", icon: MessageCircle, label: "Chat" },
    ],
  },
  {
    label: "EQUIPO",
    items: [
      { path: "/technicians", icon: Wrench, label: "Técnicos" },
      { path: "/tech-app", icon: Smartphone, label: "App Técnico" },
    ],
  },
  {
    label: "NEGOCIO",
    items: [
      { path: "/parts-ordering", icon: ShoppingCart, label: "Pedido de Piezas" },
      { path: "/marketing", icon: Megaphone, label: "Marketing" },
      { path: "/reports", icon: BarChart3, label: "Informes" },
    ],
  },
  {
    label: "CONFIGURACIÓN",
    items: [
      { path: "/settings", icon: Settings, label: "Configuración" },
    ],
  },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string) =>
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-[260px] bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-14 flex items-center px-5 border-b border-sidebar-border shrink-0">
          <ShopFlowLogoFull />
          <button
            className="ml-auto lg:hidden text-muted-foreground"
            onClick={onClose}
            data-testid="close-sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <ScrollArea className="flex-1 px-3 py-3">
          {navGroups.map(group => (
            <div key={group.label} className="mb-2">
              <button
                className="flex items-center w-full px-2 py-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase hover:text-foreground transition-colors"
                onClick={() => toggleGroup(group.label)}
                data-testid={`nav-group-${group.label}`}
              >
                {group.label}
                <ChevronDown
                  className={`w-3 h-3 ml-auto transition-transform ${
                    collapsed[group.label] ? "-rotate-90" : ""
                  }`}
                />
              </button>
              {!collapsed[group.label] && (
                <div className="space-y-0.5">
                  {group.items.map(item => {
                    const isActive =
                      item.path === "/"
                        ? location === "/" || location === ""
                        : location.startsWith(item.path);
                    return (
                      <Link key={item.path} href={item.path}>
                        <div
                          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm cursor-pointer transition-colors ${
                            isActive
                              ? "bg-primary text-primary-foreground font-medium"
                              : "text-sidebar-foreground hover:bg-sidebar-accent"
                          }`}
                          data-testid={`nav-${item.path.replace(/\//g, "") || "dashboard"}`}
                        >
                          <item.icon className="w-4 h-4 shrink-0" />
                          {item.label}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </ScrollArea>
        <div className="p-3 border-t border-sidebar-border text-[11px] text-muted-foreground">
          <a
            href="https://www.perplexity.ai/computer"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Created with Perplexity Computer
          </a>
        </div>
      </aside>
    </>
  );
}

function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="h-14 border-b border-border flex items-center px-4 gap-3 shrink-0 bg-background">
      <button
        className="lg:hidden text-muted-foreground"
        onClick={onMenuClick}
        data-testid="open-sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex-1">
        <h2
          className="text-sm font-semibold hidden sm:block"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Taller Mecánico Central
        </h2>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        data-testid="notifications-button"
      >
        <Bell className="w-4.5 h-4.5" />
        <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] bg-primary text-primary-foreground">
          3
        </Badge>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        data-testid="theme-toggle"
      >
        {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
      </Button>
      <Avatar className="w-8 h-8">
        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
          VD
        </AvatarFallback>
      </Avatar>
    </header>
  );
}

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col lg:ml-[260px] min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/workboard" component={Workboard} />
            <Route path="/calendar" component={CalendarPage} />
            <Route path="/work-orders" component={WorkOrders} />
            <Route path="/estimates" component={Estimates} />
            <Route path="/invoices" component={Invoices} />
            <Route path="/inspections" component={Inspections} />
            <Route path="/inventory" component={Inventory} />
            <Route path="/customers" component={Customers} />
            <Route path="/vehicles" component={Vehicles} />
            <Route path="/live-chat" component={LiveChat} />
            <Route path="/technicians" component={Technicians} />
            <Route path="/tech-app" component={TechApp} />
            <Route path="/parts-ordering" component={PartsOrdering} />
            <Route path="/marketing" component={Marketing} />
            <Route path="/reports" component={Reports} />
            <Route path="/settings" component={SettingsPage} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router hook={useHashLocation}>
            <AppLayout />
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
