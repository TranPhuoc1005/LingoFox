import React from "react";
import { motion } from "framer-motion";

interface ProgressProps {
  value: number; // 0 to 100
  max?: number;
  color?: "primary" | "secondary" | "success" | "info" | "accent";
  className?: string;
  showText?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  color = "primary",
  className = "",
  showText = false,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colors = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    success: "bg-success",
    info: "bg-info",
    accent: "bg-accent",
  };

  return (
    <div className={`w-full ${className}`}>
      {showText && (
        <div className="flex justify-between items-center mb-1 text-xs font-bold text-zinc-500 dark:text-zinc-400">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="h-4 w-full bg-zinc-200 dark:bg-slate-700 rounded-full overflow-hidden p-[2px] border border-zinc-300 dark:border-slate-600">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${colors[color]} relative`}
        >
          {/* Highlight effect */}
          <div className="absolute inset-0 bg-white/20 h-1/3 rounded-full" />
        </motion.div>
      </div>
    </div>
  );
};
