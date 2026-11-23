import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Radio } from "./Radio";

// Caso real: la tabla de puntos de venta marca cuál es el activo con un radio por fila; cada
// uno lleva su nombre ("Activar punto de venta 2") aunque no se vea el texto.
describe("Radio", () => {
  it("es un radio con nombre accesible, aunque la etiqueta esté oculta", async () => {
    const onChange = vi.fn();
    render(
      <>
        <Radio
          name="activo"
          label="Activar punto de venta 1"
          hideLabel
          checked
          onChange={() => undefined}
        />
        <Radio
          name="activo"
          label="Activar punto de venta 2"
          hideLabel
          checked={false}
          onChange={onChange}
        />
      </>,
    );
    const segundo = screen.getByRole("radio", {
      name: "Activar punto de venta 2",
    });
    expect(screen.getByText("Activar punto de venta 2").className).toMatch(
      /visuallyHidden/,
    );
    await userEvent.click(segundo);
    expect(onChange).toHaveBeenCalledOnce();
  });
});
