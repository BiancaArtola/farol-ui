import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "./Input";

// Caso real: un campo de formulario sin etiqueta asociada es invisible para un lector de
// pantalla, y un error que no está enlazado al campo no se anuncia al enfocarlo.
describe("Input", () => {
  it("asocia la etiqueta al campo", () => {
    render(<Input label="Correo" />);
    expect(screen.getByLabelText("Correo")).toBeInTheDocument();
  });

  it("mantiene la etiqueta accesible aunque se oculte visualmente", () => {
    render(<Input label="Buscar" hideLabel />);
    expect(screen.getByRole("textbox", { name: "Buscar" })).toBeInTheDocument();
  });

  it("enlaza la ayuda con aria-describedby", () => {
    render(<Input label="Clave" hint="Mínimo 8 caracteres" />);
    expect(screen.getByLabelText("Clave")).toHaveAccessibleDescription(
      "Mínimo 8 caracteres",
    );
  });

  it("con error marca aria-invalid y anuncia el mensaje", () => {
    render(<Input label="Correo" error="Falta la arroba" />);
    const input = screen.getByLabelText("Correo");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Falta la arroba");
    expect(screen.getByRole("alert")).toHaveTextContent("Falta la arroba");
  });

  it("describe a la vez la ayuda y el error", () => {
    render(<Input label="Edad" hint="En años" error="Debe ser un número" />);
    expect(screen.getByLabelText("Edad")).toHaveAccessibleDescription(
      "En años Debe ser un número",
    );
  });

  it("sin error no declara aria-invalid", () => {
    render(<Input label="Nombre" />);
    expect(screen.getByLabelText("Nombre")).not.toHaveAttribute("aria-invalid");
  });

  it("respeta un id propio y los atributos nativos", async () => {
    const handleChange = vi.fn();
    render(
      <Input
        label="Ciudad"
        id="ciudad"
        placeholder="Bahía Blanca"
        onChange={handleChange}
      />,
    );
    const input = screen.getByLabelText("Ciudad");
    expect(input).toHaveAttribute("id", "ciudad");
    await userEvent.type(input, "Sur");
    expect(handleChange).toHaveBeenCalledTimes(3);
    expect(input).toHaveValue("Sur");
  });

  it("reenvía el ref al input nativo", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input label="Con ref" ref={ref} />);
    expect(ref.current).toBe(screen.getByLabelText("Con ref"));
  });
});
