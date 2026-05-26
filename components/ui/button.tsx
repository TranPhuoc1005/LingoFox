import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyle =
    "relative inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-150 active:translate-y-[2px] disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none";

  const variants = {
    primary:
      "bg-primary text-white border-b-4 border-primary-hover hover:brightness-105 active:border-b-0 shadow-lg shadow-primary/20",
    secondary:
      "bg-secondary text-white border-b-4 border-secondary-hover hover:brightness-105 active:border-b-0 shadow-lg shadow-secondary/20",
    success:
      "bg-success text-white border-b-4 border-emerald-600 hover:brightness-105 active:border-b-0 shadow-lg shadow-success/20",
    danger:
      "bg-danger text-white border-b-4 border-rose-600 hover:brightness-105 active:border-b-0 shadow-lg shadow-danger/20",
    outline:
      "bg-card text-card-foreground border-2 border-border border-b-4 hover:bg-muted active:border-b-2",
    ghost:
      "text-foreground bg-transparent hover:bg-muted border-none active:translate-y-0",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-xl",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg rounded-3xl",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(baseStyle, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
};
