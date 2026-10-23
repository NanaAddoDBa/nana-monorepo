import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface ThemeValue {
  dark: boolean;
  toggleTheme: () => void;
}

const THEME_KEY = "aventra.theme";
const ThemeContext = createContext<ThemeValue | null>(null);

function readTheme(): boolean {
  try {
    return localStorage.getItem(THEME_KEY) === "dark";
  } catch {
    return false;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(readTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
    } catch {
      // A failed preference write must not prevent theme switching.
    }
  }, [dark]);

  const value = useMemo(
    () => ({ dark, toggleTheme: () => setDark((current) => !current) }),
    [dark],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return value;
}
