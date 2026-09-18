"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { springSoft } from "@/lib/motion";
import { THEME_COOKIE, type ThemeMode } from "@/lib/theme";

function applyTheme(theme: ThemeMode) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=31536000; samesite=lax`;
}

type ThemeToggleProps = {
  initialTheme?: ThemeMode;
};

export function ThemeToggle({ initialTheme = "light" }: ThemeToggleProps) {
  const [theme, setTheme] = useState<ThemeMode>(initialTheme);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
      applyTheme(stored);
    }
  }, []);

  const next = theme === "dark" ? "light" : "dark";
  const label = next === "dark" ? "Dark" : "Light";

  return (
    <button
      type="button"
      onClick={() => {
        setTheme(next);
        applyTheme(next);
      }}
      aria-label={`Switch to ${label} theme`}
      className={cn(
        "group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition",
        "hover:border-gold hover:shadow-[0_0_18px_rgba(228,184,92,0.35)]",
      )}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={springSoft}
        className="inline-flex"
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4 text-gold" />
        ) : (
          <Moon className="h-4 w-4 text-chocolate" />
        )}
      </motion.span>
      <span className="pointer-events-none absolute -bottom-8 left-1/2 z-30 -translate-x-1/2 rounded-full bg-dark-chocolate px-2 py-1 text-[10px] font-semibold text-cream opacity-0 shadow-lg transition group-hover:opacity-100">
        {label}
      </span>
    </button>
  );
}
