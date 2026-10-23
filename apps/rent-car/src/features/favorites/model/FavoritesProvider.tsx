import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface FavoritesValue {
  favorites: string[];
  toggle: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const STORAGE_KEY = "aventra.favorite-cars.v1";
const FavoritesContext = createContext<FavoritesValue | null>(null);

function readFavorites(): string[] {
  try {
    const parsed: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]",
    );

    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(readFavorites);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Storage may be unavailable when browser privacy restrictions apply.
    }
  }, [favorites]);

  const toggle = useCallback((id: string) => {
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((key) => key !== id)
        : [...previous, id],
    );
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  const value = useMemo(
    () => ({ favorites, toggle, isFavorite }),
    [favorites, toggle, isFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesValue {
  const value = useContext(FavoritesContext);
  if (!value) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return value;
}
