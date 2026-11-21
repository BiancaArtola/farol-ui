import { describe, expect, it } from "vitest";
import { getPageItems } from "./pageItems";

// Caso real: un listado de 10 páginas. Al avanzar, la barra mantiene siempre siete
// elementos (primera, última, vecinas y puntos) en vez de crecer o achicarse.
describe("getPageItems", () => {
  it("muestra todas las páginas si caben", () => {
    expect(getPageItems(2, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageItems(1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("agrupa los puntos al final cerca del principio", () => {
    expect(getPageItems(1, 10)).toEqual([1, 2, 3, 4, 5, "ellipsis-end", 10]);
    expect(getPageItems(4, 10)).toEqual([1, 2, 3, 4, 5, "ellipsis-end", 10]);
  });

  it("pone puntos a los dos lados en el medio", () => {
    expect(getPageItems(5, 10)).toEqual([
      1,
      "ellipsis-start",
      4,
      5,
      6,
      "ellipsis-end",
      10,
    ]);
  });

  it("agrupa los puntos al principio cerca del final", () => {
    expect(getPageItems(10, 10)).toEqual([1, "ellipsis-start", 6, 7, 8, 9, 10]);
    expect(getPageItems(7, 10)).toEqual([1, "ellipsis-start", 6, 7, 8, 9, 10]);
  });

  it("acota una página fuera de rango", () => {
    expect(getPageItems(99, 10)).toEqual(getPageItems(10, 10));
    expect(getPageItems(-3, 10)).toEqual(getPageItems(1, 10));
  });

  it("devuelve una lista vacía sin páginas", () => {
    expect(getPageItems(1, 0)).toEqual([]);
  });

  it("respeta la cantidad de vecinas pedida", () => {
    expect(getPageItems(10, 20, 2)).toEqual([
      1,
      "ellipsis-start",
      8,
      9,
      10,
      11,
      12,
      "ellipsis-end",
      20,
    ]);
  });
});
