import { describe, expect, it } from "vitest";
import { contrastRatio } from "../tokens/contrast";
import { createTheme, themeToCss, type ThemeVariables } from "./createTheme";
import { farolTheme, tealTheme, violetTheme } from "./presets";

const AA_TEXT = 4.5;

// Lee "light-dark(#aaaaaa, #bbbbbb)" y devuelve los dos colores.
const readPair = (value: string): { light: string; dark: string } => {
  const match = /^light-dark\((#[0-9a-f]{6}), (#[0-9a-f]{6})\)$/i.exec(value);
  if (!match) {
    throw new Error(`Valor inesperado: ${value}`);
  }
  return { light: match[1], dark: match[2] };
};

const LIGHT_BG = "#ffffff";
const DARK_BG = "#1d1e20";

const expectReadable = (theme: ThemeVariables): void => {
  const primary = readPair(theme["--farol-color-primary"]);
  const hover = readPair(theme["--farol-color-primary-hover"]);
  const contrast = readPair(theme["--farol-color-primary-contrast"]);
  expect(contrastRatio(primary.light, LIGHT_BG)).toBeGreaterThanOrEqual(
    AA_TEXT,
  );
  expect(contrastRatio(primary.dark, DARK_BG)).toBeGreaterThanOrEqual(AA_TEXT);
  expect(contrastRatio(contrast.light, primary.light)).toBeGreaterThanOrEqual(
    AA_TEXT,
  );
  expect(contrastRatio(contrast.dark, primary.dark)).toBeGreaterThanOrEqual(
    AA_TEXT,
  );
  expect(contrastRatio(contrast.light, hover.light)).toBeGreaterThanOrEqual(
    AA_TEXT,
  );
  expect(contrastRatio(contrast.dark, hover.dark)).toBeGreaterThanOrEqual(
    AA_TEXT,
  );
};

// Caso real: otro proyecto adopta farol-ui con su propia marca. Elija el color que elija,
// los botones y enlaces tienen que seguir legibles en claro y en oscuro.
describe("createTheme", () => {
  it.each([
    ["farol", farolTheme],
    ["teal", tealTheme],
    ["violeta", violetTheme],
  ])("el preset %s cumple contraste AA en ambos temas", (_name, theme) => {
    expectReadable(theme);
  });

  it.each(["#ffeb3b", "#00e5ff", "#ff5722", "#222222", "#cddc39"])(
    "ajusta el color suelto %s hasta que se lea",
    (color) => {
      expectReadable(createTheme({ primary: color }));
    },
  );

  it("respeta un par claro/oscuro explícito si ya cumple AA", () => {
    const theme = createTheme({
      primary: { light: "#1d4ed8", dark: "#5b9dff" },
    });
    expect(readPair(theme["--farol-color-primary"])).toEqual({
      light: "#1d4ed8",
      dark: "#5b9dff",
    });
  });

  it("rechaza un par explícito que no se lee y lo dice", () => {
    expect(() =>
      createTheme({ primary: { light: "#ffeb3b", dark: "#5b9dff" } }),
    ).toThrow(/contraste AA/);
  });

  it("rechaza un color que no es hex de 6 dígitos", () => {
    expect(() => createTheme({ primary: "azul" })).toThrow(/hex de 6 dígitos/);
  });

  it("define la tipografía solo si se pide, para no pisar la de la página", () => {
    expect(createTheme({ primary: "#0e7490" })).not.toHaveProperty(
      "--farol-font-family",
    );
    expect(
      createTheme({ primary: "#0e7490", fontFamily: '"Inter", sans-serif' })[
        "--farol-font-family"
      ],
    ).toBe('"Inter", sans-serif');
  });

  it("cambia el redondeo según la escala elegida", () => {
    expect(createTheme({ primary: "#0e7490", radius: "sharp" })).toMatchObject({
      "--farol-radius-md": "2px",
    });
    expect(createTheme({ primary: "#0e7490", radius: "round" })).toMatchObject({
      "--farol-radius-md": "12px",
    });
  });
});

// Caso real: renderizado en servidor, donde no hay efecto que aplique el tema; la
// aplicación vuelca este CSS en un <style> para que no parpadee con los colores por defecto.
describe("themeToCss", () => {
  it("genera una regla con una declaración por variable", () => {
    const css = themeToCss({ "--farol-radius-md": "2px" }, ".marca");
    expect(css).toBe(".marca {\n  --farol-radius-md: 2px;\n}\n");
  });
});
