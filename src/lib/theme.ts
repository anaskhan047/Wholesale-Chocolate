export const THEME_COOKIE = "wc-theme";

export type ThemeMode = "light" | "dark";

export function resolveTheme(value?: string | null): ThemeMode {
  return value === "dark" ? "dark" : "light";
}
