import { describe, expect, it } from "vitest";
import { getNextTabId, isTabNavigationKey } from "./tabNavigation";

const tabs = [
  { id: "resumen" },
  { id: "datos", disabled: true },
  { id: "historial" },
  { id: "ajustes" },
];

// Caso real: la pantalla de facturación tiene pestañas y una de ellas puede estar
// bloqueada (por ejemplo, historial sin emisor). El teclado no debe caer en la bloqueada.
describe("getNextTabId", () => {
  it("ArrowRight avanza y salta las pestañas deshabilitadas", () => {
    expect(getNextTabId(tabs, "resumen", "ArrowRight")).toBe("historial");
  });

  it("ArrowRight desde la última da la vuelta a la primera", () => {
    expect(getNextTabId(tabs, "ajustes", "ArrowRight")).toBe("resumen");
  });

  it("ArrowLeft retrocede y da la vuelta desde la primera", () => {
    expect(getNextTabId(tabs, "historial", "ArrowLeft")).toBe("resumen");
    expect(getNextTabId(tabs, "resumen", "ArrowLeft")).toBe("ajustes");
  });

  it("Home y End van a la primera y última habilitadas", () => {
    expect(getNextTabId(tabs, "historial", "Home")).toBe("resumen");
    expect(getNextTabId(tabs, "resumen", "End")).toBe("ajustes");
  });

  it("devuelve null si todas están deshabilitadas", () => {
    const blocked = [
      { id: "a", disabled: true },
      { id: "b", disabled: true },
    ];
    expect(getNextTabId(blocked, "a", "ArrowRight")).toBeNull();
  });
});

describe("isTabNavigationKey", () => {
  it("reconoce solo las teclas de navegación", () => {
    expect(isTabNavigationKey("Home")).toBe(true);
    expect(isTabNavigationKey("ArrowDown")).toBe(false);
    expect(isTabNavigationKey("a")).toBe(false);
  });
});
