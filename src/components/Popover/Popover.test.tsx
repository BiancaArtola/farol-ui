import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Popover } from "./Popover";

const renderPopover = () =>
  render(
    <div>
      <Popover trigger={<button>Filtros</button>} label="Filtros de la lista">
        <p>Contenido del panel</p>
      </Popover>
      <button>Otro</button>
    </div>,
  );

// Caso real: un botón "Filtros" que abre un panel con opciones. Tiene que anunciarse como
// desplegable, cerrarse con Escape (devolviendo el foco) y con un clic en otra parte.
describe("Popover", () => {
  it("empieza cerrado y declara que abre un diálogo", () => {
    renderPopover();
    const trigger = screen.getByRole("button", { name: "Filtros" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("abre el panel con nombre accesible y lo conecta con el botón", async () => {
    const user = userEvent.setup();
    renderPopover();
    const trigger = screen.getByRole("button", { name: "Filtros" });
    await user.click(trigger);
    const panel = screen.getByRole("dialog", { name: "Filtros de la lista" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", panel.id);
    expect(screen.getByText("Contenido del panel")).toBeInTheDocument();
  });

  it("se cierra al volver a hacer clic en el botón", async () => {
    const user = userEvent.setup();
    renderPopover();
    const trigger = screen.getByRole("button", { name: "Filtros" });
    await user.click(trigger);
    await user.click(trigger);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Escape lo cierra y devuelve el foco al botón", async () => {
    const user = userEvent.setup();
    renderPopover();
    const trigger = screen.getByRole("button", { name: "Filtros" });
    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("un clic afuera lo cierra sin mover el foco al botón", async () => {
    const user = userEvent.setup();
    renderPopover();
    await user.click(screen.getByRole("button", { name: "Filtros" }));
    await user.click(screen.getByRole("button", { name: "Otro" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Otro" })).toHaveFocus();
  });

  it("conserva el onClick propio del botón", async () => {
    const user = userEvent.setup();
    let clicks = 0;
    render(
      <Popover
        trigger={<button onClick={() => (clicks += 1)}>Abrir</button>}
        label="Panel"
      >
        Hola
      </Popover>,
    );
    await user.click(screen.getByRole("button", { name: "Abrir" }));
    expect(clicks).toBe(1);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
