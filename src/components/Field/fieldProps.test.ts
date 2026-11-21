import { describe, expect, it } from "vitest";
import { splitFieldProps } from "./fieldProps";

// Caso real: Input, Textarea y Select reenvían todo lo que no es del campo al control
// nativo (placeholder, disabled, onChange...). Si una prop del campo se colara en el
// control, aparecería como atributo inválido en el HTML (por ejemplo `label` en un <input>).
describe("splitFieldProps", () => {
  it("separa las props del campo de las del control", () => {
    const { fieldProps, controlProps } = splitFieldProps({
      label: "Nombre",
      hint: "Como figura en el DNI",
      error: "Obligatorio",
      hideLabel: true,
      id: "nombre",
      placeholder: "Ana",
      disabled: true,
    });
    expect(fieldProps).toEqual({
      label: "Nombre",
      hint: "Como figura en el DNI",
      error: "Obligatorio",
      hideLabel: true,
      id: "nombre",
    });
    expect(controlProps).toEqual({ placeholder: "Ana", disabled: true });
  });

  it("no deja props del campo en el control cuando faltan las opcionales", () => {
    const { controlProps } = splitFieldProps({ label: "Edad", min: 0 });
    expect(controlProps).toEqual({ min: 0 });
    expect(controlProps).not.toHaveProperty("label");
  });
});
