"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShopFlowLogo } from "@/components/ShopFlowLogo";
import { useState } from "react";
import {
  LayoutDashboard, Columns3, CalendarDays, ClipboardList,
  FileText, Receipt, Search, Package, Users, Car, MessageCircle,
  Wrench, Smartphone, ShoppingCart, Megaphone, BarChart3,
  Settings, ChevronDown,
} from "lucide-react";

const navGroups = [
  {
    label: "PRINCIPAL",
    items: [
      { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { path: "/workboard", icon: Columns3, label: "Workboard" },
      { path: "/calendar", icon: CalendarDays, label: "Calendario" },
    ],
  },
  {
    label: "ÓRDENES",
    items: [
      { path: "/work-orders", icon: ClipboardList, label: "Órdenes de Trabajo" },
      { path: "/estimates", icon: FileText, label: "Presupuestos" },
      { path: "/invoices", icon: Receipt, label: "Facturas" },
      { path: "/inspections", icon: Search, label: "Inspecciones DVI" },
    ],
  },
  {
    label: "TALLER",
    items: [
      { path: "/inventory", icon: Package, label: "Inventario" },
      { path: "/customers", icon: Users, label: "Clientes" },
      { path: "/vehicles", icon: Car, label: "Vehículos" },
      { path: "/technicians", icon: Wrench, label: "Técnicos" },
    ],
  },
  {
    label: "HERRAMIENTAS",
    items: [
      { path: "/marketing", icon: Megaphone, label: "Marketing" },
      { path: "/reports", icon: BarChart3, label: "Informes" },
      { path: "/settings", icon: Settings, label: "Configuración" },
    ],
  },
];

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string) =>
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));

  return (
    <>
      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-[260px] bg-sidebar border-r border-sidebar-border z-50 flex flex-col transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 h-14 border-b border-sidebar-border shrink-0">
          <ShopFlowLogo size={28} />
          <span
            className="text-base font-bold text-sidebar-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ShopFlow
          </span>
        </div>

        {/* Nav */}
        <ScrollArea className="flex-1 py-3 px-2">
          {navGroups.map(group => (
            <div key={group.label} className="mb-3">
              <button
                className="w-full flex items-center px-2.5 py-1 text-[11px] font-semibold tracking-wider text-muted-foreground hover:text-sidebar-foreground transition-colors"
                onClick={() => toggleGroup(group.label)}
              >
                {group.label}
                <ChevronDown
                  className={`w-3 h-3 ml-auto transition-transform ${
                    collapsed[group.label] ? "-rotate-90" : ""
                  }`}
                />
              </button>
              {!collapsed[group.label] && (
                <div className="space-y-0.5 mt-0.5">
                  {group.items.map(item => {
                    const isActive = pathname === item.path || pathname?.startsWith(item.path + "/");
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={onClose}
                        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent"
                        }`}
                        data-testid={`nav-${item.path.replace(/\//g, "")}`}
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </ScrollArea>

        {/* Footer */}
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
