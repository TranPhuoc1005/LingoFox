"use client";

import React, { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { useAppStore } from "@/store/useAppStore";
import { UserSync } from "@/components/providers/UserSync";

function ThemeSync() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeSync />
      <UserSync />
      {children}
    </SessionProvider>
  );
}
