import { createTheme } from "./createTheme";

// Temas de ejemplo: sirven de punto de partida y para comprobar en tests que cualquier
// marca razonable cumple contraste AA en claro y en oscuro.

/** El azul por defecto de Farol. */
export const farolTheme = createTheme({
  primary: { light: "#1d4ed8", dark: "#5b9dff" },
});

export const tealTheme = createTheme({ primary: "#0e7490" });

export const violetTheme = createTheme({
  primary: "#7c3aed",
  radius: "round",
});
