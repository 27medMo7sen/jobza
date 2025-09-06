"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const getInitialTheme = (): Theme => {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    try {
      return (localStorage.getItem("jobza-theme") as Theme) || "system";
    } catch (error) {
      console.warn("Error reading theme from localStorage:", error);
      return "system";
    }
  }
  return "system";
};

const initialState: ThemeProviderState = {
  theme: getInitialTheme(),
  setTheme: (theme: Theme) => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        localStorage.setItem("jobza-theme", theme);
      } catch (error) {
        console.warn("Error saving theme to localStorage:", error);
      }
    }
  },
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "jobza-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
      } catch (error) {
        console.warn("Error reading theme from localStorage:", error);
        return defaultTheme;
      }
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: light)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      if (
        typeof window !== "undefined" &&
        typeof localStorage !== "undefined"
      ) {
        try {
          localStorage.setItem(storageKey, theme);
        } catch (error) {
          console.warn("Error saving theme to localStorage:", error);
        }
      }
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
