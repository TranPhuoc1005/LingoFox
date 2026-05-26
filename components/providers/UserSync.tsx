"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { apiGet } from "@/lib/api-client";

export function UserSync() {
  const hydrateFromApi = useAppStore((s) => s.hydrateFromApi);

  useEffect(() => {
    apiGet<{
      user?: Parameters<typeof hydrateFromApi>[0]["user"];
      stats: Parameters<typeof hydrateFromApi>[0]["stats"];
      completedLessons: string[];
      examAttempts: Parameters<typeof hydrateFromApi>[0]["examAttempts"];
    }>("/api/me")
      .then(hydrateFromApi)
      .catch((err) => console.warn("UserSync:", err.message));
  }, [hydrateFromApi]);

  return null;
}
