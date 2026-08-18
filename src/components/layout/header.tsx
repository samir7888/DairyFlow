"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { Menu, Plus, User } from "lucide-react";
import { isClerkConfigured } from "@/lib/clerk-config";

interface HeaderProps {
  onMobileMenuToggle: () => void;
  title?: string;
}

function ClerkUserMenu() {
  const { user } = useUser();
  return (
    <div className="flex items-center gap-3">
      <p className="text-xs text-slate-500 hidden sm:block">
        Welcome back, <span className="font-medium text-emerald-800">{user?.firstName || "Farmer"}</span> 👋
      </p>
      <UserButton
        appearance={{
          elements: {
            avatarBox: "w-9 h-9 border-2 border-emerald-500/30 hover:border-emerald-500 transition-colors",
          },
        }}
      />
    </div>
  );
}

function LocalDevUserBadge() {
  return (
    <div className="flex items-center gap-2">
      <p className="text-xs text-slate-500 hidden sm:block">
        Welcome back, <span className="font-medium text-emerald-800">Dairy Seller</span> 👋
      </p>
      <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 border border-emerald-200 text-xs font-semibold text-emerald-800">
        <User className="h-4 w-4 text-emerald-600" />
        <span>Local Seller</span>
      </div>
    </div>
  );
}

export function Header({ onMobileMenuToggle, title = "Dashboard" }: HeaderProps) {
  const hasClerk = isClerkConfigured();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 sm:px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-slate-900 tracking-tight sm:text-xl">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/records/new"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Record</span>
        </Link>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        {hasClerk ? <ClerkUserMenu /> : <LocalDevUserBadge />}
      </div>
    </header>
  );
}
