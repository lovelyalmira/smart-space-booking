"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Compass, CalendarCheck, History, User, Building2,
  Users, Sofa, Tag, ClipboardList, BarChart3, LogOut, Menu, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getUser, getRole, logout } from "@/lib/auth";
import { AuthUser, Role } from "@/types";
import { useQueryClient } from "@tanstack/react-query";

interface NavItem { label: string; href: string; icon: typeof LayoutDashboard }

const MEMBER_NAV: NavItem[] = [
  { label: "Dashboard", href: "/member/dashboard", icon: LayoutDashboard },
  { label: "Explore Space", href: "/member/spaces", icon: Compass },
  { label: "My Reservations", href: "/member/reservations", icon: CalendarCheck },
  { label: "History", href: "/member/history", icon: History },
  { label: "Profile", href: "/member/profile", icon: User },
];

const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Coworking Profile", href: "/admin/profile", icon: Building2 },
  { label: "Members", href: "/admin/members", icon: Users },
  { label: "Spaces", href: "/admin/spaces", icon: Sofa },
  { label: "Promotions", href: "/admin/discounts", icon: Tag },
  { label: "Reservations", href: "/admin/reservations", icon: ClipboardList },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
];

function NavLinks({ items, pathname, onNavigate }: { items: NavItem[]; pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <Icon className="h-[18px] w-[18px]" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-5 py-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Sparkles className="h-5 w-5" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-bold text-slate-900">Smart Space</p>
        <p className="text-[11px] text-slate-500">Booking</p>
      </div>
    </div>
  );
}

export function DashboardShell({ children, expectedRole }: { children: React.ReactNode; expectedRole: Role }) {
  const router = useRouter();
  const pathname = usePathname();
  const qc = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = expectedRole === "admin_space" ? ADMIN_NAV : MEMBER_NAV;

  useEffect(() => {
    const role = getRole();
    if (!role) {
      router.replace("/login");
      return;
    }
    if (role !== expectedRole) {
      router.replace(role === "admin_space" ? "/admin/dashboard" : "/member/dashboard");
      return;
    }
    setUser(getUser());
    setReady(true);
  }, [expectedRole, router]);

  const handleLogout = () => {
    logout();
    qc.clear();
    router.replace("/login");
  };

  const displayName =
    user?.space_owner?.nama_coworking || user?.member?.nama_member || user?.username || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-white lg:flex">
        <Brand />
        <NavLinks items={items} pathname={pathname} />
        <div className="border-t p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
          >
            <LogOut className="h-[18px] w-[18px]" /> Logout
          </button>
        </div>
      </aside>

      {/* Content wrapper */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b bg-white/80 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="flex h-full flex-col">
                  <Brand />
                  <NavLinks items={items} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
                  <div className="border-t p-3">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="h-[18px] w-[18px]" /> Logout
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <span className="text-sm font-semibold text-slate-500">
              {expectedRole === "admin_space" ? "Admin Panel" : "Member Area"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight text-slate-900">{displayName}</p>
              <p className="text-[11px] capitalize text-slate-500">
                {expectedRole === "admin_space" ? "Admin Space" : "Member"}
              </p>
            </div>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
