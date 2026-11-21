import { describe, expect, it } from "vitest";
import { contrastRatio } from "../tokens/contrast";
import { createTheme } from "./createTheme";
import { editorialTheme, softTheme, technicalTheme } from "./presets";
import type { ThemeVariables } from "./colors";

const readPair = (value: string): { light: string; dark: string } => {
  const match = /^light-dark\((#[0-9a-f]{6}), (#[0-9a-f]{6})\)$/i.exec(value);
  if (!match) {
    throw new Error(`Valor inesperado: ${value}`);
  }
  return { light: match[1], dark: match[2] };
};

const AA_TEXT = 4.5;

// Caso real: los tres estilos tienen fondos propios (crema, durazno, negro azulado). La
// marca, el texto y los botones deben leerse sobre SUS fondos, no sobre los de siempre.
describe.each([
  ["editorial", editorialTheme],
  ["suave", softTheme],
  ["técnico", technicalTheme],
] satisfies [string, ThemeVariables][])("preset %s", (_name, theme) => {
  const pair = (token: string) => readPair(theme[token as `--farol-${string}`]);

  it.each(["light", "dark"] as const)(
    "en %s: marca, texto y botones cumplen AA sobre sus fondos",
    (scheme) => {
      const background = pair("--farol-color-bg")[scheme];
      const surface = pair("--farol-color-surface")[scheme];
      const primary = pair("--farol-color-primary")[scheme];
      const contrast = pair("--farol-color-primary-contrast")[scheme];
      const hover = pair("--farol-color-primary-hover")[scheme];
      expect(contrastRatio(primary, background)).toBeGreaterThanOrEqual(
        AA_TEXT,
      );
      expect(contrastRatio(primary, surface)).toBeGreaterThanOrEqual(AA_TEXT);
      expect(contrastRatio(contrast, primary)).toBeGreaterThanOrEqual(AA_TEXT);
      expect(contrastRatio(contrast, hover)).toBeGreaterThanOrEqual(AA_TEXT);
    },
  );
});

describe("presets de estilo", () => {
  it("cada uno define una forma distinta de pestañas", () => {
    expect(editorialTheme["--farol-tab-indicator"]).toBe("2px");
    expect(softTheme["--farol-tab-radius"]).toBe("999px");
    expect(technicalTheme["--farol-tab-active-bg"]).toBe(
      "var(--farol-color-primary)",
    );
  });

  it("solo editorial y técnico cambian la tipografía de los títulos", () => {
    expect(editorialTheme).toHaveProperty("--farol-font-family-heading");
    expect(technicalTheme).toHaveProperty("--farol-font-family-heading");
    expect(softTheme).not.toHaveProperty("--farol-font-family-heading");
  });

  it("un color suelto se ajusta a los fondos propios del tema", () => {
    const theme = createTheme({
      primary: "#ffeb3b",
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
    const primary = readPair(theme["--farol-color-primary"]);
    expect(contrastRatio(primary.light, "#f3f1ea")).toBeGreaterThanOrEqual(
      AA_TEXT,
    );
  });
});
