import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverRaise?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hoverRaise = false,
  onClick,
}) => {
  const baseStyle =
    "bg-card text-card-foreground border-2 border-border rounded-3xl p-6 shadow-sm overflow-hidden";
  const hoverStyle = hoverRaise
    ? "hover:shadow-md hover:-translate-y-1 hover:bg-muted/50 dark:hover:bg-muted transition-all duration-200 cursor-pointer"
    : "";

  if (onClick) {
    return (
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onClick}
        className={cn(baseStyle, "cursor-pointer shadow-md select-none", className)}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={cn(baseStyle, hoverStyle, className)}>{children}</div>;
};
