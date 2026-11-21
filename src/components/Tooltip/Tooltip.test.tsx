import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Tooltip } from "./Tooltip";

const renderTooltip = () =>
  render(
    <Tooltip content="Guardar los cambios">
      <button>Guardar</button>
    </Tooltip>,
  );

// Caso real: un botón con ayuda breve. Aparece con el mouse y también con el teclado, se
// puede descartar con Escape y se enlaza al botón para que el lector la lea.
describe("Tooltip", () => {
  it("empieza oculto y sin referencia en el botón", () => {
    renderTooltip();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-describedby");
  });

  it("aparece al pasar el mouse y desaparece al salir", async () => {
    const user = userEvent.setup();
    renderTooltip();
    await user.hover(screen.getByRole("button"));
    expect(screen.getByRole("tooltip")).toHaveTextContent(
      "Guardar los cambios",
    );
    await user.unhover(screen.getByRole("button"));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("aparece al enfocar con el teclado y desaparece al salir", async () => {
    const user = userEvent.setup();
    renderTooltip();
    await user.tab();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    await user.tab();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("se conecta al botón con aria-describedby", async () => {
    const user = userEvent.setup();
    renderTooltip();
    await user.hover(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveAccessibleDescription(
      "Guardar los cambios",
    );
  });

  it("Escape lo oculta aunque el botón siga enfocado", async () => {
    const user = userEvent.setup();
    renderTooltip();
    await user.tab();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveFocus();
  });

  it("aplica la clase de la ubicación elegida", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Ayuda" placement="bottom">
        <button>Ayuda</button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole("button"));
    expect(screen.getByRole("tooltip")).toHaveClass("bottom");
  });
});
