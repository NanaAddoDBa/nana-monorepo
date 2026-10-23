import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

interface ThemeValue { dark: boolean; toggleTheme: () => void }
const ThemeContext = createContext<ThemeValue | null>(null);
function readTheme(): boolean {
  try { return localStorage.getItem("aventra.theme") === "dark"; } catch { return false; }
}
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(readTheme);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("aventra.theme", dark ? "dark" : "light"); } catch { /* storage disabled */ }
  }, [dark]);
  const value = useMemo(() => ({ dark, toggleTheme: () => setDark((current) => !current) }), [dark]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
export function useTheme(): ThemeValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("Theme must be inside ThemeProvider");
  return context;
}