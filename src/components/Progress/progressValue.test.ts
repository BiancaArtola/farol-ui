import { describe, expect, it } from "vitest";
import { clampProgress, getProgressPercent } from "./progressValue";

// Caso real: una importación informa "120 de 100" por un error de redondeo del servidor;
// la barra tiene que quedar llena, no salirse del contenedor.
describe("clampProgress", () => {
  it.each([
    [50, 100, 50],
    [-5, 100, 0],
    [120, 100, 100],
  ])("acota %s sobre %s a %s", (value, max, expected) => {
    expect(clampProgress(value, max)).toBe(expected);
  });
});

describe("getProgressPercent", () => {
  it("redondea al entero más cercano", () => {
    expect(getProgressPercent(1, 3)).toBe(33);
  });

  it("devuelve 0 si el máximo no es positivo", () => {
    expect(getProgressPercent(5, 0)).toBe(0);
  });

  it("no pasa de 100", () => {
    expect(getProgressPercent(250, 100)).toBe(100);
  });
});
