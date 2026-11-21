import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CommandPalette, type Command } from "./CommandPalette";

const buildCommands = (onSelect = vi.fn()): Command[] => [
  { id: "pedidos", label: "Ir a pedidos", hint: "G P", onSelect },
  { id: "tema", label: "Cambiar tema", onSelect },
  { id: "salir", label: "Cerrar sesión", onSelect, disabled: true },
  { id: "perfil", label: "Ir al perfil", onSelect },
];

const renderPalette = (onSelect = vi.fn(), onClose = vi.fn()) =>
  render(
    <CommandPalette
      open
      onClose={onClose}
      commands={buildCommands(onSelect)}
    />,
  );

// Caso real: el atajo "Ctrl K" de una aplicación abre la paleta. Se escribe para filtrar,
// se navega con flechas y Enter ejecuta; todo sin tocar el mouse.
describe("CommandPalette", () => {
  it("no dibuja nada cerrada", () => {
    render(<CommandPalette open={false} onClose={vi.fn()} commands={[]} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("abre un diálogo con el buscador enfocado y todos los comandos", () => {
    renderPalette();
    expect(
      screen.getByRole("dialog", { name: "Buscar comando" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "Buscar comando" }),
    ).toHaveFocus();
    expect(screen.getAllByRole("option")).toHaveLength(4);
  });

  it("filtra al escribir sin distinguir tildes", async () => {
    const user = userEvent.setup();
    renderPalette();
    await user.type(screen.getByRole("combobox"), "sesion");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(
      screen.getByRole("option", { name: /Cerrar sesión/ }),
    ).toBeInTheDocument();
  });

  it("las flechas mueven el comando activo saltando los deshabilitados", async () => {
    const user = userEvent.setup();
    renderPalette();
    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute(
      "aria-activedescendant",
      screen.getByRole("option", { name: /Ir a pedidos/ }).id,
    );
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(input).toHaveAttribute(
      "aria-activedescendant",
      screen.getByRole("option", { name: /Ir al perfil/ }).id,
    );
  });

  it("Enter ejecuta el comando activo y cierra la paleta", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onClose = vi.fn();
    renderPalette(onSelect, onClose);
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("un clic en un comando lo ejecuta", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderPalette(onSelect);
    await user.click(screen.getByRole("option", { name: /Cambiar tema/ }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("no ejecuta un comando deshabilitado", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderPalette(onSelect);
    await user.click(screen.getByRole("option", { name: /Cerrar sesión/ }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("muestra el atajo de apoyo de un comando", () => {
    renderPalette();
    expect(screen.getByText("G P")).toBeInTheDocument();
  });

  it("avisa cuando nada coincide y Enter no ejecuta nada", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderPalette(onSelect);
    await user.type(screen.getByRole("combobox"), "zzz{Enter}");
    expect(screen.getByRole("status")).toHaveTextContent("Sin resultados");
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("Escape cierra la paleta", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderPalette(vi.fn(), onClose);
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
