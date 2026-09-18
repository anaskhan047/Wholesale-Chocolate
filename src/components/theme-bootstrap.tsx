"use client";

import { useLayoutEffect } from "react";
import { THEME_COOKIE } from "@/lib/theme";

/** Sync localStorage theme after hydration without injecting a <script>. */
export function ThemeBootstrap() {
  useLayoutEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored !== "dark" && stored !== "light") {
        return;
      }
      document.documentElement.classList.toggle("dark", stored === "dark");
      document.cookie = `${THEME_COOKIE}=${stored}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      // ignore
    }
  }, []);

  return null;
}
