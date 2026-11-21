import { describe, expect, it } from "vitest";
import { cx } from "./classNames";

// Caso real: los componentes arman sus clases con condiciones (variante, tamaño, error);
// las condiciones apagadas no deben dejar "false" ni espacios sobrantes en el HTML.
describe("cx", () => {
  it("une las clases con un espacio", () => {
    expect(cx("boton", "grande")).toBe("boton grande");
  });

  it("descarta false, null, undefined y cadenas vacías", () => {
    expect(cx("boton", false, null, undefined, "", "activo")).toBe(
      "boton activo",
    );
  });

  it("devuelve una cadena vacía si no queda nada", () => {
    expect(cx(false, undefined)).toBe("");
  });
});
