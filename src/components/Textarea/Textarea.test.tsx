import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Textarea } from "./Textarea";

// Caso real: observaciones de un comprobante; el campo debe tener nombre, ayuda y error
// conectados igual que Input.
describe("Textarea", () => {
  it("expone un cuadro de texto con su etiqueta", () => {
    render(<Textarea label="Observaciones" />);
    expect(
      screen.getByRole("textbox", { name: "Observaciones" }),
    ).toBeInTheDocument();
  });

  it("acepta texto", async () => {
    render(<Textarea label="Observaciones" />);
    await userEvent.type(screen.getByRole("textbox"), "Pago parcial");
    expect(screen.getByRole("textbox")).toHaveValue("Pago parcial");
  });

  it("enlaza la ayuda y marca el error", () => {
    render(<Textarea label="Notas" hint="Opcional" error="Demasiado largo" />);
    const textbox = screen.getByRole("textbox");
    expect(textbox).toHaveAccessibleDescription("Opcional Demasiado largo");
    expect(textbox).toBeInvalid();
  });
});
