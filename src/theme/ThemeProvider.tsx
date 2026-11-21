import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_THEME_STORAGE_KEY,
  parsePreference,
  resolveTheme,
  type Theme,
  type ThemePreference,
} from "./theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";

interface ThemeContextValue {
  /** Lo que eligió la persona: light, dark o system. */
  preference: ThemePreference;
  /** El tema que realmente se está mostrando. */
  theme: Theme;
  setPreference: (preference: ThemePreference) => void;
  /** Alterna entre claro y oscuro a partir del tema que se ve ahora. */
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const readStoredPreference = (storageKey: string): ThemePreference => {
  try {
    return parsePreference(window.localStorage.getItem(storageKey));
  } catch {
    // localStorage puede estar bloqueado (modo privado); se usa el sistema.
    return "system";
  }
};

const prefersDark = (): boolean =>
  typeof window.matchMedia === "function" &&
  window.matchMedia(DARK_QUERY).matches;

interface ThemeProviderProps {
  children: ReactNode;
  storageKey?: string;
}

export const ThemeProvider = ({
  children,
  storageKey = DEFAULT_THEME_STORAGE_KEY,
}: ThemeProviderProps) => {
  // Servidor y primer render del cliente coinciden (system + claro); lo guardado y el
  // sistema se leen después de montar para no romper la hidratación.
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);

  useEffect(() => {
    setPreferenceState(readStoredPreference(storageKey));
    setSystemPrefersDark(prefersDark());
  }, [storageKey]);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }
    const query = window.matchMedia(DARK_QUERY);
    const handleChange = (event: MediaQueryListEvent) =>
      setSystemPrefersDark(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  const theme = resolveTheme(preference, systemPrefersDark);

  // Con "system" se quita data-theme y CSS sigue al sistema; con una elección, se fuerza.
  useEffect(() => {
    const root = document.documentElement;
    if (preference === "system") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", preference);
    }
  }, [preference]);

  const setPreference = useCallback(
    (nextPreference: ThemePreference) => {
      setPreferenceState(nextPreference);
      try {
        window.localStorage.setItem(storageKey, nextPreference);
      } catch {
        // Sin storage no se recuerda la elección, pero el cambio igual funciona.
      }
    },
    [storageKey],
  );

  const toggleTheme = useCallback(
    () => setPreference(theme === "dark" ? "light" : "dark"),
    [setPreference, theme],
  );

  const value = useMemo(
    () => ({ preference, theme, setPreference, toggleTheme }),
    [preference, theme, setPreference, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe usarse dentro de <ThemeProvider>.");
  }
  return context;
};
