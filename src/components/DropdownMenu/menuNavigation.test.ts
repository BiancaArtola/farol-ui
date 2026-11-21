import { describe, expect, it } from "vitest";
import { getNextMenuIndex, isMenuNavigationKey } from "./menuNavigation";

const items = [{}, { disabled: true }, {}, {}];

// Caso real: un menú "Acciones" con Editar, Duplicar (no disponible), Archivar y Eliminar.
// Las flechas tienen que saltear lo que no se puede elegir y dar la vuelta en los extremos.
describe("getNextMenuIndex", () => {
  it("ArrowDown avanza salteando los deshabilitados", () => {
    expect(getNextMenuIndex(items, 0, "ArrowDown")).toBe(2);
  });

  it("ArrowDown da la vuelta desde el último", () => {
    expect(getNextMenuIndex(items, 3, "ArrowDown")).toBe(0);
  });

  it("ArrowUp retrocede y da la vuelta desde el primero", () => {
    expect(getNextMenuIndex(items, 2, "ArrowUp")).toBe(0);
    expect(getNextMenuIndex(items, 0, "ArrowUp")).toBe(3);
  });

  it("Home y End van a los extremos habilitados", () => {
    expect(getNextMenuIndex(items, 2, "Home")).toBe(0);
    expect(getNextMenuIndex(items, 0, "End")).toBe(3);
  });

  it("sin foco previo, ArrowDown va al primero y ArrowUp al último", () => {
    expect(getNextMenuIndex(items, -1, "ArrowDown")).toBe(0);
    expect(getNextMenuIndex(items, -1, "ArrowUp")).toBe(3);
  });

  it("devuelve -1 si no hay ítems habilitados", () => {
    expect(getNextMenuIndex([{ disabled: true }], 0, "ArrowDown")).toBe(-1);
    expect(getNextMenuIndex([], -1, "Home")).toBe(-1);
  });
});

describe("isMenuNavigationKey", () => {
  it("reconoce solo las teclas de navegación", () => {
    expect(isMenuNavigationKey("ArrowDown")).toBe(true);
    expect(isMenuNavigationKey("Enter")).toBe(false);
  });
});
