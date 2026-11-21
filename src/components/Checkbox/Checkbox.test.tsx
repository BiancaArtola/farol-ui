import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./Checkbox";

// Caso real: seleccionar filas o aceptar una opción; hacer clic en el texto tiene que
// alternar la casilla igual que en una casilla nativa.
describe("Checkbox", () => {
  it("expone un checkbox con su etiqueta", () => {
    render(<Checkbox label="Recordarme" />);
    expect(
      screen.getByRole("checkbox", { name: "Recordarme" }),
    ).toBeInTheDocument();
  });

  it("alterna al hacer clic en la casilla o en la etiqueta", async () => {
    const handleChange = vi.fn();
    render(<Checkbox label="Recordarme" onChange={handleChange} />);
    const checkbox = screen.getByRole("checkbox");
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    await userEvent.click(screen.getByText("Recordarme"));
    expect(checkbox).not.toBeChecked();
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  it("se puede alternar con la barra espaciadora", async () => {
    render(<Checkbox label="Aceptar" />);
    await userEvent.tab();
    await userEvent.keyboard(" ");
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("enlaza la ayuda con aria-describedby", () => {
    render(<Checkbox label="Notificaciones" hint="Una vez por semana" />);
    expect(screen.getByRole("checkbox")).toHaveAccessibleDescription(
      "Una vez por semana",
    );
  });

  it("no alterna cuando está deshabilitado", async () => {
    render(<Checkbox label="Bloqueado" disabled />);
    await userEvent.click(screen.getByText("Bloqueado"));
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("admite un estado controlado con checked", () => {
    render(<Checkbox label="Activo" checked onChange={() => undefined} />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });
});
