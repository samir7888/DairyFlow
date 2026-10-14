"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileSpreadsheet, BarChart3, PlusCircle, X } from "lucide-react";
import { cn, formatNepaliDate, todayADStringNepal } from "@/lib/utils";
import { LogoMark } from "@/components/brand/logo";

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Milk records", href: "/records", icon: FileSpreadsheet },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const today = todayADStringNepal();

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-brand-950/50 lg:hidden" onClick={onMobileClose} />
      )}

      <aside
        className={cn(
          "fixed bottom-0 left-0 top-0 z-50 flex w-64 flex-col border-r border-brand-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <LogoMark className="h-8 w-8" />
            <span className="font-display text-lg font-bold tracking-tight text-ink">DairyFlow</span>
          </Link>
          <button
            onClick={onMobileClose}
            className="rounded-lg p-1 text-brand-500 hover:bg-brand-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav aria-label="Dashboard" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/records"
                ? pathname.startsWith("/records") && pathname !== "/records/new"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                  isActive
                    ? "bg-brand-100 font-semibold text-ink before:absolute before:-left-3 before:top-1.5 before:bottom-1.5 before:w-1 before:rounded-r before:bg-marigold-500"
                    : "text-brand-700 hover:bg-brand-50 hover:text-ink"
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
                {item.name}
              </Link>
            );
          })}

          <Link
            href="/records/new"
            onClick={onMobileClose}
            className="mt-4 flex items-center gap-3 rounded-lg bg-brand-800 px-3 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            <PlusCircle className="h-[18px] w-[18px]" />
            Add a record
          </Link>
        </nav>

        <div className="border-t border-brand-100 px-5 py-4 text-sm">
          <div className="text-brand-500">Today</div>
          <div className="font-semibold text-ink">{formatNepaliDate(today)}</div>
        </div>
      </aside>
    </>
  );
}
