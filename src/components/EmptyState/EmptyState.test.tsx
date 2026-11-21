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
});
