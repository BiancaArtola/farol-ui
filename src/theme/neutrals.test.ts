import { describe, expect, it } from "vitest";
import { neutralVariables, type ThemeNeutrals } from "./neutrals";

const valid: ThemeNeutrals = {
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
};

// Caso real: un proyecto quiere fondos cálidos en vez de blanco. La paleta se valida al
// crear el tema para no descubrir en producción un texto gris ilegible sobre crema.
describe("neutralVariables", () => {
  it("devuelve un light-dark() por cada color neutro", () => {
    const variables = neutralVariables(valid);
    expect(variables["--farol-color-bg"]).toBe("light-dark(#fbfaf7, #171715)");
    expect(Object.keys(variables)).toHaveLength(6);
  });

  it("rechaza un texto secundario que no se lee sobre la superficie", () => {
    const pale = { ...valid, light: { ...valid.light, muted: "#c8c4b8" } };
    expect(() => neutralVariables(pale)).toThrow(/contraste AA/);
  });

  it("rechaza un borde marcado casi invisible", () => {
    const faint = {
      ...valid,
      dark: { ...valid.dark, borderStrong: "#222220" },
    };
    expect(() => neutralVariables(faint)).toThrow(/borde marcado/);
  });

  it("rechaza un color que no es hex de 6 dígitos", () => {
    const broken = { ...valid, light: { ...valid.light, bg: "crema" } };
    expect(() => neutralVariables(broken)).toThrow(/hex de 6 dígitos/);
  });
});
