import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatXp(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return String(xp);
}

export function getLevelThreshold(level: number): number {
  return level * 150;
}

export function getLevelProgress(xp: number, level: number): number {
  const threshold = getLevelThreshold(level);
  return Math.min(100, (xp / threshold) * 100);
}
