import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CloseButton } from "./CloseButton";

// Caso real: Modal y Toast cierran con el mismo "×". El lector de pantalla tiene que oír
// la etiqueta (traducible) y no el símbolo, y el botón no debe enviar formularios.
describe("CloseButton", () => {
  it("se anuncia por su etiqueta y no por el símbolo", () => {
    render(<CloseButton label="Cerrar" onClick={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Cerrar" })).toBeInTheDocument();
  });

  it("no es de tipo submit, para no enviar el formulario que lo contenga", () => {
    render(<CloseButton label="Cerrar" onClick={vi.fn()} />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("avisa al hacer clic", async () => {
    const onClick = vi.fn();
    render(<CloseButton label="Cerrar" onClick={onClick} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
