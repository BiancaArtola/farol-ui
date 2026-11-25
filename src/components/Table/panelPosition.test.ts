import { describe, expect, it } from "vitest";
import { computePanelPosition } from "./panelPosition";

// Caso real: el calendario del filtro de fecha mide unos 360 px y en una ventana de 600 u 800 px
// de alto quedaba cortado abajo, sin forma de llegar a "Borrar fechas": al desplazar la página el
// panel se cierra.
describe("computePanelPosition", () => {
  const panel = { width: 304, height: 360 };

  it("va debajo del ícono cuando entra", () => {
    expect(
      computePanelPosition({
        anchor: { top: 100, bottom: 120, left: 200 },
        panel,
        viewport: { width: 1400, height: 900 },
      }),
    ).toEqual({ top: 124, left: 200, maxHeight: 768 });
  });

  it("va arriba, anclado por abajo, si solo ahí entra", () => {
    expect(
      computePanelPosition({
        anchor: { top: 450, bottom: 470, left: 200 },
        panel,
        viewport: { width: 1400, height: 600 },
      }),
    ).toEqual({ bottom: 154, left: 200, maxHeight: 438 });
  });

  it("si no entra de ningún lado se mete en la ventana, pegado al borde inferior", () => {
    expect(
      computePanelPosition({
        anchor: { top: 300, bottom: 320, left: 200 },
        panel,
        viewport: { width: 1400, height: 500 },
      }),
    ).toEqual({ top: 132, left: 200, maxHeight: 484 });
  });

  it("en una ventana más baja que el panel arranca arriba y limita el alto", () => {
    expect(
      computePanelPosition({
        anchor: { top: 150, bottom: 170, left: 200 },
        panel,
        viewport: { width: 1400, height: 320 },
      }),
    ).toEqual({ top: 8, left: 200, maxHeight: 304 });
  });

  it("no se sale por los costados", () => {
    const leftFor = (left: number) =>
      computePanelPosition({
        anchor: { top: 100, bottom: 120, left },
        panel,
        viewport: { width: 800, height: 900 },
      }).left;
    expect(leftFor(780)).toBe(488);
    expect(leftFor(-20)).toBe(8);
  });
});
