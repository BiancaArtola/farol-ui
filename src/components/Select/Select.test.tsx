import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./Select";

const renderSelect = (props: Partial<Parameters<typeof Select>[0]> = {}) =>
  render(
    <Select label="Moneda" {...props}>
      <option value="ARS">Pesos</option>
      <option value="USD">Dólares</option>
    </Select>,
  );

// Caso real: elegir entre pesos y dólares es un campo más del formulario; tiene que
// funcionar con teclado y lector de pantalla igual que un Input.
describe("Select", () => {
  it("asocia la etiqueta y muestra las opciones", () => {
    renderSelect();
    expect(
      screen.getByRole("combobox", { name: "Moneda" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Dólares" })).toBeInTheDocument();
  });

  it("permite elegir una opción y avisa del cambio", async () => {
    const handleChange = vi.fn();
    renderSelect({ onChange: handleChange });
    await userEvent.selectOptions(screen.getByLabelText("Moneda"), "USD");
    expect(screen.getByLabelText("Moneda")).toHaveValue("USD");
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("con error marca aria-invalid y enlaza el mensaje", () => {
    renderSelect({ error: "Elegir una moneda" });
    const select = screen.getByLabelText("Moneda");
    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(select).toHaveAccessibleDescription("Elegir una moneda");
  });

  it("enlaza la ayuda con aria-describedby", () => {
    renderSelect({ hint: "Se usa para los totales" });
    expect(screen.getByLabelText("Moneda")).toHaveAccessibleDescription(
      "Se usa para los totales",
    );
  });

  it("queda inactivo cuando está deshabilitado", () => {
    renderSelect({ disabled: true });
    expect(screen.getByLabelText("Moneda")).toBeDisabled();
  });
});
