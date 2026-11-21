// Lógica pura del tema: sin DOM ni storage, para poder probarla sola.

export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

export const THEME_PREFERENCES = ["light", "dark", "system"] as const;
export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export const DEFAULT_THEME_STORAGE_KEY = "farol-theme";

export const isThemePreference = (value: unknown): value is ThemePreference =>
  THEME_PREFERENCES.some((preference) => preference === value);

/** Un valor guardado inválido o ausente cuenta como "system". */
export const parsePreference = (storedValue: string | null): ThemePreference =>
  isThemePreference(storedValue) ? storedValue : "system";

export const resolveTheme = (
  preference: ThemePreference,
  systemPrefersDark: boolean,
): Theme => {
  if (preference === "system") {
    return systemPrefersDark ? "dark" : "light";
  }
  return preference;
};

/**
 * Script para pegar en el <head> y aplicar el tema antes de pintar, así la página no
 * parpadea con el tema equivocado. Solo fuerza data-theme si hay una elección guardada;
 * con "system" lo deja libre y CSS sigue al sistema por sí solo.
 */
export const getThemeInitScript = (
  storageKey: string = DEFAULT_THEME_STORAGE_KEY,
): string =>
  `(function(){try{var t=localStorage.getItem(${JSON.stringify(storageKey)});if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})();`;
