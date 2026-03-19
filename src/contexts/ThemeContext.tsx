import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useLocation } from "react-router-dom";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("zf-theme") as Theme | null;
    return saved || "system";
  });

  const getResolvedTheme = (t: Theme): "light" | "dark" => {
    if (t === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return t;
  };

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(getResolvedTheme(theme));

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("zf-theme", newTheme);
  };

  useEffect(() => {
    const isLandingPage = location.pathname === "/";
    const resolved = isLandingPage ? "light" : getResolvedTheme(theme);
    setResolvedTheme(resolved);
    document.documentElement.classList.toggle("dark", resolved === "dark");
  }, [theme, location.pathname]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const isLandingPage = location.pathname === "/";
      const resolved = isLandingPage ? "light" : getResolvedTheme("system");
      setResolvedTheme(resolved);
      document.documentElement.classList.toggle("dark", resolved === "dark");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
