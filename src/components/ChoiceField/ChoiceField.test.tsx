import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChoiceField } from "./ChoiceField";

// Checkbox, Switch y los radios comparten esta envoltura: si la ayuda no queda enlazada
// con aria-describedby, un lector de pantalla no la anuncia en ninguno de los tres.
describe("ChoiceField", () => {
  it("conecta la etiqueta y la ayuda con el control", () => {
    render(
      <ChoiceField label="Acepto" hint="Podés cambiarlo luego" id="acepto">
        {(controlProps) => <input type="checkbox" {...controlProps} />}
      </ChoiceField>,
    );
    const input = screen.getByLabelText("Acepto");
    expect(input).toHaveAccessibleDescription("Podés cambiarlo luego");
  });

  it("no agrega aria-describedby sin ayuda", () => {
    render(
      <ChoiceField label="Acepto">
        {(controlProps) => <input type="checkbox" {...controlProps} />}
      </ChoiceField>,
    );
    expect(screen.getByLabelText("Acepto")).not.toHaveAttribute(
      "aria-describedby",
    );
  });
});
