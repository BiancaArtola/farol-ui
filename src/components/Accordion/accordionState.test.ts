import { describe, expect, it } from "vitest";
import { toggleOpenIds } from "./accordionState";

// Caso real: una página de preguntas frecuentes; con "una a la vez" abrir otra pregunta
// cierra la anterior, y con varias abiertas cada clic solo cambia la suya.
describe("toggleOpenIds", () => {
  it("abre una sección cerrada", () => {
    expect(toggleOpenIds([], "envios", false)).toEqual(["envios"]);
  });

  it("cierra una sección abierta", () => {
    expect(toggleOpenIds(["envios"], "envios", false)).toEqual([]);
  });

  it("cierra las demás al abrir una si no se admiten varias", () => {
    expect(toggleOpenIds(["envios"], "pagos", false)).toEqual(["pagos"]);
  });

  it("conserva las demás al abrir una si se admiten varias", () => {
    expect(toggleOpenIds(["envios"], "pagos", true)).toEqual([
      "envios",
      "pagos",
    ]);
  });
});
