"use client";

import React, { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export type Theme = "light" | "dark" | "system";

export type ThemeToggleVariant = "button" | "tabs" | "dropdown";
export type ThemeToggleSize = "sm" | "md" | "lg";

interface ThemeToggleProps {
  variant?: ThemeToggleVariant;
  size?: ThemeToggleSize;
  showLabel?: boolean;
  themes?: Theme[];
  className?: string;
  value?: Theme;
  onValueChange?: (theme: Theme) => void;
}

const themeIcons: Record<Theme, React.ElementType> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const themeLabels: Record<Theme, string> = {
  light: "Yorug‘",
  dark: "To‘q",
  system: "Tizim",
};

export function Theme({
  variant = "button",
  size = "md",
  showLabel = false,
  themes = ["light", "dark", "system"],
  className,
  value,
  onValueChange,
}: ThemeToggleProps) {
  const [internalTheme, setInternalTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aluvantis_theme") as Theme;
      if (saved && ["light", "dark", "system"].includes(saved)) return saved;
    }
    return "dark";
  });

  const theme = value || internalTheme;

  const setTheme = (t: Theme) => {
    setInternalTheme(t);
    if (onValueChange) onValueChange(t);
    if (typeof window !== "undefined") {
      localStorage.setItem("aluvantis_theme", t);
      if (t === "dark") {
        document.documentElement.classList.add("dark");
      } else if (t === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (isDark) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
      }
    }
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const saved = (localStorage.getItem("aluvantis_theme") as Theme) || "dark";
      if (saved === "dark") {
        document.documentElement.classList.add("dark");
      } else if (saved === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (isDark) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  if (!isMounted) {
    return <div className="w-8 h-8 rounded-xl bg-black/5 dark:bg-white/5 animate-pulse" />;
  }

  if (variant === "button") {
    const nextTheme = themes[(themes.indexOf(theme) + 1) % themes.length];
    const Icon = themeIcons[theme] || Sun;

    return (
      <button
        onClick={() => setTheme(nextTheme)}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-xl border transition-all cursor-pointer select-none",
          "border-border bg-card hover:bg-black/5 dark:hover:bg-white/10 text-foreground shadow-xs",
          size === "sm" ? "h-8 px-2.5 text-xs" : size === "md" ? "h-9 px-3 text-sm" : "h-11 px-4 text-base",
          className
        )}
        title={`Mavzu: ${themeLabels[theme]} (Bosing: ${themeLabels[nextTheme]})`}
      >
        <Icon className={cn("transition-transform duration-300", size === "sm" ? "w-4 h-4 text-[#0E4F4F] dark:text-[#C6A15B]" : "w-4 h-4 text-[#0E4F4F] dark:text-[#C6A15B]")} />
        {showLabel && <span className="font-semibold text-xs">{themeLabels[theme]}</span>}
      </button>
    );
  }

  // Segmented Tabs variant
  return (
    <div
      className={cn(
        "inline-flex items-center p-1 rounded-2xl bg-black/5 dark:bg-black/40 border border-border/80 shadow-inner select-none",
        className
      )}
    >
      {themes.map((tKey) => {
        const Icon = themeIcons[tKey] || Sun;
        const isSelected = theme === tKey;

        return (
          <button
            key={tKey}
            type="button"
            onClick={() => setTheme(tKey)}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold transition-all duration-200 cursor-pointer",
              size === "sm" ? "h-7 text-[11px]" : "h-8 text-xs",
              isSelected
                ? "bg-[#0E4F4F] text-[#F6F3EC] dark:bg-[#C6A15B] dark:text-[#14201F] shadow-md scale-100"
                : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
            )}
            title={themeLabels[tKey]}
          >
            <Icon className={cn(size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4", isSelected ? "text-[#C6A15B] dark:text-[#14201F]" : "")} />
            {showLabel && <span>{themeLabels[tKey]}</span>}
          </button>
        );
      })}
    </div>
  );
}
