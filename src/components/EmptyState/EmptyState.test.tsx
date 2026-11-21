import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./EmptyState";

// Caso real: una lista sin datos tiene que explicar qué falta y ofrecer el siguiente paso.
describe("EmptyState", () => {
  it("muestra título, descripción y acción", () => {
    render(
      <EmptyState
        title="Sin comprobantes"
        description="Cargá un cobro para empezar."
        action={<button type="button">Agregar</button>}
      />,
    );
    expect(screen.getByText("Sin comprobantes")).toBeInTheDocument();
    expect(
      screen.getByText("Cargá un cobro para empezar."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Agregar" })).toBeInTheDocument();
  });

  it("omite la descripción si no se pasa", () => {
    const { container } = render(<EmptyState title="Vacío" />);
    expect(container.querySelectorAll("p")).toHaveLength(1);
  });

  // Caso real: una pantalla entera sin datos ("Todavía no hay comprobantes") tiene que
  // dejar un encabezado en la página; un vacío suelto dentro de una tarjeta, no.
  it("con headingLevel el título es un encabezado de ese nivel", () => {
    render(<EmptyState title="Sin comprobantes" headingLevel={2} />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Sin comprobantes" }),
    ).toBeInTheDocument();
  });

  it("sin headingLevel no agrega ningún encabezado", () => {
    render(<EmptyState title="Vacío" />);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("el ícono es decorativo y no cuenta como contenido accesible", () => {
    render(<EmptyState title="Vacío" icon={<svg data-testid="icono" />} />);
    expect(screen.getByTestId("icono").parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
