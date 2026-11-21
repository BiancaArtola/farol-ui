import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RadioGroup } from "./RadioGroup";

const options = [
  { value: "monotributo", label: "Monotributo" },
  { value: "inscripto", label: "Responsable inscripto" },
  { value: "exento", label: "Exento", disabled: true },
];

// Caso real: elegir la condición frente al IVA; tiene que ser un grupo con nombre, con una
// sola opción marcada y navegable con las flechas.
describe("RadioGroup", () => {
  it("agrupa las opciones bajo su leyenda", () => {
    render(
      <RadioGroup
        legend="Condición"
        options={options}
        value="monotributo"
        onChange={() => undefined}
      />,
    );
    expect(
      screen.getByRole("group", { name: "Condición" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(screen.getByRole("radio", { name: "Monotributo" })).toBeChecked();
  });

  it("avisa el valor elegido al hacer clic", async () => {
    const handleChange = vi.fn();
    render(
      <RadioGroup
        legend="Condición"
        options={options}
        value="monotributo"
        onChange={handleChange}
      />,
    );
    await userEvent.click(screen.getByText("Responsable inscripto"));
    expect(handleChange).toHaveBeenCalledWith("inscripto");
  });

  it("se mueve con las flechas y salta las opciones deshabilitadas", async () => {
    const handleChange = vi.fn();
    render(
      <RadioGroup
        legend="Condición"
        options={options}
        value="monotributo"
        onChange={handleChange}
      />,
    );
    await userEvent.tab();
    await userEvent.keyboard("{ArrowDown}");
    expect(handleChange).toHaveBeenCalledWith("inscripto");
    await userEvent.keyboard("{ArrowDown}");
    expect(handleChange).not.toHaveBeenCalledWith("exento");
  });

  it("describe el grupo con la ayuda", () => {
    render(
      <RadioGroup
        legend="Condición"
        options={options}
        value="monotributo"
        onChange={() => undefined}
        hint="Define el tipo de factura"
      />,
    );
    expect(screen.getByRole("group")).toHaveAccessibleDescription(
      "Define el tipo de factura",
    );
  });
});
