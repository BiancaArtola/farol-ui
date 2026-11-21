import { describe, expect, it } from "vitest";
import { shapeVariables } from "./shape";

// Caso real: tres estilos (editorial, suave, técnico) comparten los mismos componentes y
// solo se diferencian por estas variables; sin ellas los botones o las pestañas no cambiarían.
describe("shapeVariables", () => {
  it("sin opciones deja la forma que ya tenía la librería", () => {
    expect(shapeVariables({})).toMatchObject({
      "--farol-radius-md": "8px",
      "--farol-radius-button": "8px",
      "--farol-radius-badge": "999px",
      "--farol-button-transform": "none",
      "--farol-shadow-card": "none",
      "--farol-tab-indicator": "2px",
    });
  });

  it("no define la tipografía de títulos si no se pide", () => {
    expect(shapeVariables({})).not.toHaveProperty(
      "--farol-font-family-heading",
    );
    expect(
      shapeVariables({ headingFontFamily: "Georgia, serif" })[
        "--farol-font-family-heading"
      ],
    ).toBe("Georgia, serif");
  });

  it("los botones en píldora también redondean las insignias", () => {
    expect(shapeVariables({ buttonShape: "pill" })).toMatchObject({
      "--farol-radius-button": "999px",
      "--farol-radius-badge": "999px",
    });
  });

  it("con esquinas rectas las insignias dejan de ser píldora", () => {
    expect(shapeVariables({ radius: "sharp" })).toMatchObject({
      "--farol-radius-badge": "2px",
    });
  });

  it("los botones en mayúsculas llevan espaciado entre letras", () => {
    expect(shapeVariables({ uppercaseButtons: true })).toMatchObject({
      "--farol-button-transform": "uppercase",
      "--farol-button-letter-spacing": "0.04em",
    });
  });

  it("la sombra suave usa el color de sombra del tema claro u oscuro", () => {
    expect(shapeVariables({ shadow: "soft" })["--farol-shadow-card"]).toContain(
      "var(--farol-shadow-color)",
    );
  });

  it.each([
    ["underline", "2px", "transparent"],
    ["pill", "0px", "var(--farol-color-surface)"],
    ["block", "0px", "var(--farol-color-primary)"],
  ] as const)(
    "pestañas %s: indicador %s y fondo activo %s",
    (tabs, indicator, activeBackground) => {
      expect(shapeVariables({ tabs })).toMatchObject({
        "--farol-tab-indicator": indicator,
        "--farol-tab-active-bg": activeBackground,
      });
    },
  );
});
