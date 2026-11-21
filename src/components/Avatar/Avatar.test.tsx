import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./Avatar";

// Caso real: junto al nombre de una persona; el lector de pantalla tiene que leer el nombre
// completo, no las letras sueltas.
describe("Avatar", () => {
  it("muestra las iniciales y expone el nombre completo", () => {
    render(<Avatar name="Juan Pérez" />);
    const avatar = screen.getByRole("img", { name: "Juan Pérez" });
    expect(avatar).toHaveTextContent("JP");
  });
});
