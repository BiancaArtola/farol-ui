import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Spinner } from "./Spinner";

// Caso real: una lista tarda en cargar; quien usa lector de pantalla tiene que enterarse
// de que se está esperando, no solo ver girar un círculo.
describe("Spinner", () => {
  it("se anuncia como estado con un texto por defecto", () => {
    render(<Spinner />);
    expect(
      screen.getByRole("status", { name: "Cargando" }),
    ).toBeInTheDocument();
  });

  it("permite cambiar el texto anunciado", () => {
    render(<Spinner label="Cargando comprobantes" />);
    expect(
      screen.getByRole("status", { name: "Cargando comprobantes" }),
    ).toBeInTheDocument();
  });

  it("aplica la clase del tamaño y combina className", () => {
    render(<Spinner size="lg" className="extra" />);
    expect(screen.getByRole("status")).toHaveClass("lg", "extra");
  });
});
