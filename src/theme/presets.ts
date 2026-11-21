import { createTheme } from "./createTheme";

// Temas listos para usar. Los tres últimos son estilos completos (paleta neutra, esquinas,
// botones, sombras, pestañas y títulos); los otros solo cambian la marca. Las fuentes se
// nombran con alternativas del sistema: cargarlas (Google Fonts, etc.) es cosa de la app.

/** El azul por defecto de Farol. */
export const farolTheme = createTheme({
  primary: { light: "#1d4ed8", dark: "#5b9dff" },
});

export const tealTheme = createTheme({ primary: "#0e7490" });

export const violetTheme = createTheme({
  primary: "#7c3aed",
  radius: "round",
});

/** Editorial sobrio: títulos en serif, bordes finos, esquinas casi rectas y sin sombras. */
export const editorialTheme = createTheme({
  primary: { light: "#1f3a5f", dark: "#9db8e0" },
  fontFamily: '"Inter", system-ui, sans-serif',
  headingFontFamily: '"Fraunces", Georgia, serif',
  radius: "sharp",
  tabs: "underline",
  neutrals: {
    light: {
      bg: "#fbfaf7",
      surface: "#f3f1ea",
      text: "#1b1a17",
      muted: "#5f5b52",
      border: "#d9d4c7",
      borderStrong: "#8a8578",
    },
    dark: {
      bg: "#171715",
      surface: "#211f1c",
      text: "#ece9e1",
      muted: "#a8a397",
      border: "#3a3832",
      borderStrong: "#77736a",
    },
  },
});

/** Suave y cálido: esquinas grandes, botones en píldora, relieve leve y terracota. */
export const softTheme = createTheme({
  primary: { light: "#c2410c", dark: "#ff9a6c" },
  fontFamily: '"Nunito", system-ui, sans-serif',
  radius: "round",
  buttonShape: "pill",
  shadow: "soft",
  tabs: "pill",
  neutrals: {
    light: {
      bg: "#fff8f2",
      surface: "#fdeee2",
      text: "#2b2220",
      muted: "#6b5a52",
      border: "#ecd9cc",
      borderStrong: "#9a8274",
    },
    dark: {
      bg: "#1e1715",
      surface: "#2a201d",
      text: "#f6e9e1",
      muted: "#c4b0a5",
      border: "#4a3a33",
      borderStrong: "#8a7468",
    },
  },
});

/** Técnico y denso: títulos monoespaciados, bordes marcados, sin radios y verde azulado. */
export const technicalTheme = createTheme({
  primary: { light: "#006b5e", dark: "#3ddbc2" },
  fontFamily: '"IBM Plex Sans", system-ui, sans-serif',
  headingFontFamily: '"JetBrains Mono", ui-monospace, Consolas, monospace',
  radius: "sharp",
  uppercaseButtons: true,
  tabs: "block",
  neutrals: {
    light: {
      bg: "#ffffff",
      surface: "#f1f3f5",
      text: "#0b0d10",
      muted: "#4a525c",
      border: "#c4cad1",
      borderStrong: "#0b0d10",
    },
    dark: {
      bg: "#0b0d10",
      surface: "#14181d",
      text: "#e8edf2",
      muted: "#9aa5b1",
      border: "#2b333b",
      borderStrong: "#5b6672",
    },
  },
});
