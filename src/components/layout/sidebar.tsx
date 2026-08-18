"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileSpreadsheet,
  BarChart3,
  PlusCircle,
  Milk,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Milk Records",
    href: "/records",
    icon: FileSpreadsheet,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Add Record",
    href: "/records/new",
    icon: PlusCircle,
    highlight: true,
  },
];

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}
      >
        {/* Header Branding */}
        <div className="flex h-16 items-center justify-between border-b border-emerald-100/80 px-6 bg-gradient-to-r from-emerald-900 to-teal-900 text-white">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
              <Milk className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-base leading-tight">DairyFlow</span>
              <span className="text-[10px] text-emerald-200/80 font-medium uppercase tracking-wider">
                Sales Tracker
              </span>
            </div>
          </Link>

          <button
            onClick={onMobileClose}
            className="rounded-lg p-1 text-emerald-200 hover:bg-emerald-800/50 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Main Navigation
          </div>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href) && item.href !== "/dashboard";

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onMobileClose}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-emerald-50 text-emerald-800 font-semibold shadow-xs border border-emerald-200/80"
                      : item.highlight
                      ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive
                        ? "text-emerald-700"
                        : item.highlight
                        ? "text-white"
                        : "text-slate-400 group-hover:text-slate-600"
                    )}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Add Helper Badge Footer */}
        <div className="p-4 border-t border-slate-100">
          <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/60 p-3.5 border border-emerald-100 text-xs">
            <div className="font-semibold text-emerald-950 flex items-center gap-1.5 mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              NPR Invoice Logger
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Keep track of everyday litres sold & milk fat % provided on dairy receipts.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
