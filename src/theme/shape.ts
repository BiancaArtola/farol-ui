// "Forma" del tema: lo que cambia entre estilos además del color (botones, sombras,
// pestañas, títulos). Lógica pura que devuelve variables --farol-*; los componentes solo las leen.
import type { ThemeVariables } from "./colors";

export const THEME_RADII = ["sharp", "default", "round"] as const;
export type ThemeRadius = (typeof THEME_RADII)[number];

export const BUTTON_SHAPES = ["default", "pill"] as const;
export type ButtonShape = (typeof BUTTON_SHAPES)[number];

export const THEME_SHADOWS = ["none", "soft"] as const;
export type ThemeShadow = (typeof THEME_SHADOWS)[number];

export const TAB_STYLES = ["underline", "pill", "block"] as const;
export type TabStyle = (typeof TAB_STYLES)[number];

export interface ThemeShape {
  radius?: ThemeRadius;
  /** Botones con esquinas del tema o en píldora (también redondea las insignias). */
  buttonShape?: ButtonShape;
  /** Botones en mayúsculas con algo de espaciado entre letras. */
  uppercaseButtons?: boolean;
  /** Sombra de tarjetas, tablas y paneles: ninguna o suave. */
  shadow?: ThemeShadow;
  tabs?: TabStyle;
  /** Tipografía de los títulos; sin ella usan la del tema. */
  headingFontFamily?: string;
}

const RADIUS_SCALES: Record<
  ThemeRadius,
  { sm: string; md: string; lg: string; badge: string }
> = {
  sharp: { sm: "0px", md: "2px", lg: "4px", badge: "2px" },
  default: { sm: "4px", md: "8px", lg: "12px", badge: "999px" },
  round: { sm: "8px", md: "12px", lg: "20px", badge: "999px" },
};

const PILL = "999px";

const TAB_VARIABLES: Record<TabStyle, ThemeVariables> = {
  underline: {
    "--farol-tab-radius": "0px",
    "--farol-tab-indicator": "2px",
    "--farol-tab-list-border": "1px solid var(--farol-color-border)",
    "--farol-tab-active-bg": "transparent",
    "--farol-tab-active-color": "var(--farol-color-primary)",
  },
  pill: {
    "--farol-tab-radius": PILL,
    "--farol-tab-indicator": "0px",
    "--farol-tab-list-border": "0",
    "--farol-tab-active-bg": "var(--farol-color-surface)",
    "--farol-tab-active-color": "var(--farol-color-text)",
  },
  block: {
    "--farol-tab-radius": "0px",
    "--farol-tab-indicator": "0px",
    "--farol-tab-list-border": "1px solid var(--farol-color-border-strong)",
    "--farol-tab-active-bg": "var(--farol-color-primary)",
    "--farol-tab-active-color": "var(--farol-color-primary-contrast)",
  },
};

export const shapeVariables = ({
  radius = "default",
  buttonShape = "default",
  uppercaseButtons = false,
  shadow = "none",
  tabs = "underline",
  headingFontFamily,
}: ThemeShape): ThemeVariables => {
  const scale = RADIUS_SCALES[radius];
  const variables: ThemeVariables = {
    "--farol-radius-sm": scale.sm,
    "--farol-radius-md": scale.md,
    "--farol-radius-lg": scale.lg,
    "--farol-radius-badge": buttonShape === "pill" ? PILL : scale.badge,
    "--farol-radius-button": buttonShape === "pill" ? PILL : scale.md,
    "--farol-button-transform": uppercaseButtons ? "uppercase" : "none",
    "--farol-button-letter-spacing": uppercaseButtons ? "0.04em" : "normal",
    "--farol-shadow-card":
      shadow === "soft" ? "0 6px 20px var(--farol-shadow-color)" : "none",
    ...TAB_VARIABLES[tabs],
  };
  if (headingFontFamily) {
    variables["--farol-font-family-heading"] = headingFontFamily;
  }
  return variables;
};
