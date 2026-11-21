import { describe, expect, it } from "vitest";
import { getNextEnabledIndex, isListNavigationKey } from "./listNavigation";

const items = [{}, { disabled: true }, {}, {}];

// Caso real: un menú "Acciones" con Editar, Duplicar (no disponible), Archivar y Eliminar.
// Las flechas tienen que saltear lo que no se puede elegir y dar la vuelta en los extremos.
describe("getNextEnabledIndex", () => {
  it("ArrowDown avanza salteando los deshabilitados", () => {
    expect(getNextEnabledIndex(items, 0, "ArrowDown")).toBe(2);
  });

  it("ArrowDown da la vuelta desde el último", () => {
    expect(getNextEnabledIndex(items, 3, "ArrowDown")).toBe(0);
  });

  it("ArrowUp retrocede y da la vuelta desde el primero", () => {
    expect(getNextEnabledIndex(items, 2, "ArrowUp")).toBe(0);
    expect(getNextEnabledIndex(items, 0, "ArrowUp")).toBe(3);
  });

  it("Home y End van a los extremos habilitados", () => {
    expect(getNextEnabledIndex(items, 2, "Home")).toBe(0);
    expect(getNextEnabledIndex(items, 0, "End")).toBe(3);
  });

  it("sin foco previo, ArrowDown va al primero y ArrowUp al último", () => {
    expect(getNextEnabledIndex(items, -1, "ArrowDown")).toBe(0);
    expect(getNextEnabledIndex(items, -1, "ArrowUp")).toBe(3);
  });

  it("devuelve -1 si no hay ítems habilitados", () => {
    expect(getNextEnabledIndex([{ disabled: true }], 0, "ArrowDown")).toBe(-1);
    expect(getNextEnabledIndex([], -1, "Home")).toBe(-1);
  });
});

describe("isListNavigationKey", () => {
  it("reconoce solo las teclas de navegación", () => {
    expect(isListNavigationKey("ArrowDown")).toBe(true);
    expect(isListNavigationKey("Enter")).toBe(false);
  });
});
