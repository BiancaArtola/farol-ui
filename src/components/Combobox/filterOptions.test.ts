import { describe, expect, it } from "vitest";
import { filterOptions, normalizeSearchText } from "./filterOptions";

const options = [
  { label: "Córdoba" },
  { label: "San Luis" },
  { label: "Buenos Aires" },
  { label: "Santa Cruz" },
];

// Caso real: un selector de provincias con búsqueda. Quien escribe "cordoba" sin tilde o
// "SAN" en mayúsculas tiene que encontrar la opción igual.
describe("normalizeSearchText", () => {
  it("pasa a minúsculas, quita tildes y espacios de los bordes", () => {
    expect(normalizeSearchText("  José ÁNGEL ")).toBe("jose angel");
  });
});

describe("filterOptions", () => {
  it("devuelve todas las opciones si no se escribió nada", () => {
    expect(filterOptions(options, "")).toEqual(options);
    expect(filterOptions(options, "   ")).toEqual(options);
  });

  it("ignora tildes y mayúsculas", () => {
    expect(filterOptions(options, "CORDOBA")).toEqual([{ label: "Córdoba" }]);
  });

  it("pone primero las que empiezan con lo escrito", () => {
    expect(filterOptions(options, "san")).toEqual([
      { label: "San Luis" },
      { label: "Santa Cruz" },
    ]);
    expect(filterOptions(options, "s")).toEqual([
      { label: "San Luis" },
      { label: "Santa Cruz" },
      { label: "Buenos Aires" },
    ]);
  });

  it("devuelve una lista vacía si nada coincide", () => {
    expect(filterOptions(options, "zzz")).toEqual([]);
  });
});
