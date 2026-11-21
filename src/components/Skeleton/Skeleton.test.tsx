import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./Skeleton";

// Caso real: mientras carga una tarjeta se dibujan barras grises; no deben leerse como
// contenido ni ensuciar el árbol de accesibilidad.
describe("Skeleton", () => {
  it("es decorativo para los lectores de pantalla", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it.each(["text", "rect", "circle"] as const)(
    "aplica la clase de la forma %s",
    (shape) => {
      const { container } = render(<Skeleton shape={shape} />);
      expect(container.firstElementChild).toHaveClass(shape);
    },
  );

  it("toma ancho y alto como píxeles o como medida CSS", () => {
    const { container } = render(<Skeleton width={120} height="50%" />);
    expect(container.firstElementChild).toHaveStyle({
      width: "120px",
      height: "50%",
    });
  });
});
