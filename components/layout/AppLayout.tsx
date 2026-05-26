"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Trophy,
  BookOpen,
  User,
  Users,
  MessageSquare,
  Headphones,
  MessagesSquare,
  Sparkles,
  Settings,
  Flame,
  Award,
  ShieldAlert,
  LogOut
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { stats } = useAppStore();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: Compass },
    { name: "Lessons", href: "/lessons", icon: BookOpen },
    { name: "Listening", href: "/listening", icon: Headphones },
    { name: "Communication", href: "/communication", icon: MessagesSquare },
    { name: "Exams", href: "/exams", icon: Trophy },
    { name: "AI Teacher", href: "/ai-teacher", icon: Sparkles },
    { name: "Community", href: "/community", icon: Users },
    { name: "Leaderboard", href: "/leaderboard", icon: Award },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Admin Panel", href: "/admin", icon: ShieldAlert },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r-2 border-border bg-card p-6 fixed h-full z-20">
        {/* Logo / Branding */}
        <div className="flex items-center gap-3 mb-8 px-2 select-none">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-black text-white text-xl shadow-md shadow-primary/20">
            🦊
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-card-foreground flex items-center gap-1">
              Lingo<span className="text-primary">Fox</span>
            </h1>
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500">v1.2 Studio</span>
          </div>
        </div>

        {/* User Quick Stats Pill */}
        <div className="flex flex-col gap-2 p-4 mb-6 rounded-2xl lf-surface">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
            <span>Level {stats.level} Cadet</span>
            <span className="text-primary font-black">{stats.xp} XP</span>
          </div>
          <div className="h-2 w-full bg-border rounded-full overflow-hidden p-[1px]">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${Math.min(100, (stats.xp / (stats.level * 150)) * 100)}%` }}
            />
          </div>
          <div className="flex items-center gap-2 mt-2 text-sm font-extrabold text-card-foreground justify-center">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-bounce-subtle" />
            <span>{stats.streak} Day Streak!</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1 overflow-y-auto pr-1 scrollbar-thin">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={isActive ? "lf-nav-link lf-nav-link-active group" : "lf-nav-link group"}
              >
                <Icon
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    isActive ? "text-primary fill-primary/10" : ""
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer (Settings, Logout) */}
        <div className="border-t-2 border-border dark:border-dark-border pt-4 flex flex-col gap-2">
          <button
            onClick={async () => {
              const supabaseAuthEnabled = Boolean(
                process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
              );
              if (supabaseAuthEnabled) {
                const { createClient } = await import("@/lib/supabase/client");
                const supabase = createClient();
                await supabase.auth.signOut();
                window.location.href = "/auth/login";
              } else {
                const { signOut } = await import("next-auth/react");
                await signOut({ callbackUrl: "/auth/login" });
              }
            }}
            className="flex items-center justify-center p-3 rounded-xl border border-rose-500/25 hover:bg-rose-500/10 text-rose-500 transition-colors cursor-pointer w-full"
            title="Sign Out"
          >
            <span className="flex items-center gap-2 font-bold text-sm">
              <LogOut className="w-5 h-5" /> Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* Main Panel Wrapper */}
      <div className="flex-1 md:pl-64 flex flex-col">
        {/* Top Header - Sticky */}
        <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-md border-b-2 border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo Mobile */}
            <div className="md:hidden w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-base">
              🦊
            </div>
            <h2 className="text-lg font-black tracking-tight text-card-foreground md:block">
              {menuItems.find((item) => pathname.startsWith(item.href))?.name || "LingoFox Study Portal"}
            </h2>
          </div>

          {/* Quick Header Indicators */}
          <div className="flex items-center gap-4">
            {/* Streak Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 font-extrabold text-sm">
              <Flame className="w-4 h-4 fill-orange-500" />
              <span>{stats.streak}d</span>
            </div>

            {/* XP Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-secondary font-extrabold text-sm">
              <Award className="w-4 h-4" />
              <span>Lvl {stats.level}</span>
            </div>

            {/* Logout - Mobile */}
            <button
              onClick={async () => {
                const supabaseAuthEnabled = Boolean(
                  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                );
                if (supabaseAuthEnabled) {
                  const { createClient } = await import("@/lib/supabase/client");
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  window.location.href = "/auth/login";
                } else {
                  const { signOut } = await import("next-auth/react");
                  await signOut({ callbackUrl: "/auth/login" });
                }
              }}
              className="md:hidden p-2 rounded-xl border border-rose-500/20 bg-card text-rose-500 hover:bg-rose-500/10"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col"
          >
            {children}
          </motion.div>
        </main>

        {/* Mobile Navigation bar at bottom */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 flex items-center justify-around z-20">
          {menuItems.slice(0, 5).map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 p-2 rounded-xl text-xs font-bold ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="scale-90">{item.name.split(" ")[0]}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
