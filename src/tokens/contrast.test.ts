import { describe, expect, it } from "vitest";
import { contrastRatio, relativeLuminance } from "./contrast";

// Caso real: el cálculo de contraste decide si un par de colores de los tokens es legible.
// Si la fórmula estuviera mal, los tests de tokens aprobarían colores ilegibles.
describe("contrastRatio", () => {
  it("da 21 entre negro y blanco, el máximo posible", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
  });

  it("da 1 entre un color y sí mismo", () => {
    expect(contrastRatio("#1d4ed8", "#1d4ed8")).toBeCloseTo(1, 5);
  });

  it("no depende del orden de los colores", () => {
    expect(contrastRatio("#1d4ed8", "#ffffff")).toBeCloseTo(
      contrastRatio("#ffffff", "#1d4ed8"),
      10,
    );
  });

  it("coincide con un valor de referencia conocido (gris #777 sobre blanco)", () => {
    // Referencia publicada por WCAG: #777777 sobre blanco ronda 4,48.
    expect(contrastRatio("#777777", "#ffffff")).toBeCloseTo(4.48, 1);
  });
});

// Caso real: un token mal escrito (por ejemplo "#12") no debe pasar en silencio.
describe("relativeLuminance", () => {
  it("rechaza colores que no son hexadecimales de 6 dígitos", () => {
    expect(() => relativeLuminance("#12")).toThrow(
      "Color hexadecimal inválido",
    );
  });

  it("vale 0 para negro y 1 para blanco", () => {
    expect(relativeLuminance("#000000")).toBe(0);
    expect(relativeLuminance("#ffffff")).toBeCloseTo(1, 5);
  });
});
