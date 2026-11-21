import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Switch } from "./Switch";

// Caso real: activar una opción (por ejemplo "Modo oscuro") con mouse o teclado; un lector
// de pantalla tiene que anunciarlo como interruptor y no como casilla.
describe("Switch", () => {
  it("se anuncia como interruptor con su etiqueta", () => {
    render(<Switch label="Modo oscuro" />);
    expect(
      screen.getByRole("switch", { name: "Modo oscuro" }),
    ).toBeInTheDocument();
  });

  it("alterna con un clic en la etiqueta", async () => {
    render(<Switch label="Avisos" />);
    await userEvent.click(screen.getByText("Avisos"));
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("alterna con la barra espaciadora", async () => {
    render(<Switch label="Avisos" />);
    await userEvent.tab();
    await userEvent.keyboard(" ");
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("enlaza la ayuda y respeta disabled", async () => {
    render(<Switch label="Avisos" hint="Un mail por semana" disabled />);
    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAccessibleDescription("Un mail por semana");
    await userEvent.click(toggle);
    expect(toggle).not.toBeChecked();
  });
});
