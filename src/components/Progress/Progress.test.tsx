import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Progress } from "./Progress";

// Caso real: la importación de un Excel informa su avance; el lector de pantalla tiene
// que poder consultar el valor, y sin valor conocido no debe inventar uno.
describe("Progress", () => {
  it("expone el valor, el mínimo y el máximo", () => {
    render(<Progress label="Importación" value={40} />);
    const bar = screen.getByRole("progressbar", { name: "Importación" });
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("acota un valor que se pasa del máximo", () => {
    render(<Progress label="Importación" value={120} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
  });

  it("sin valor es indeterminada y no declara aria-valuenow", () => {
    render(<Progress label="Procesando" />);
    expect(screen.getByRole("progressbar")).not.toHaveAttribute(
      "aria-valuenow",
    );
  });

  it("muestra el porcentaje solo si se pide y hay valor", () => {
    const { rerender } = render(<Progress label="Subida" value={25} />);
    expect(screen.queryByText("25%")).not.toBeInTheDocument();
    rerender(<Progress label="Subida" value={25} showValue />);
    expect(screen.getByText("25%")).toBeInTheDocument();
  });

  it("calcula el porcentaje con un máximo propio", () => {
    render(<Progress label="Pasos" value={3} max={4} showValue />);
    expect(screen.getByText("75%")).toBeInTheDocument();
  });
});
