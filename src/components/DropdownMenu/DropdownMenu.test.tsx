import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DropdownMenu, type DropdownMenuItem } from "./DropdownMenu";

const buildItems = (onSelect = vi.fn()): DropdownMenuItem[] => [
  { id: "editar", label: "Editar", onSelect },
  { id: "duplicar", label: "Duplicar", onSelect, disabled: true },
  { id: "eliminar", label: "Eliminar", onSelect, tone: "danger" },
];

const renderMenu = (items = buildItems()) =>
  render(
    <DropdownMenu
      trigger={<button>Acciones</button>}
      items={items}
      label="Acciones del pedido"
    />,
  );

// Caso real: el menú "Acciones" de una fila de pedidos. Se maneja entero con teclado,
// la acción deshabilitada se saltea y elegir una acción cierra el menú.
describe("DropdownMenu", () => {
  it("empieza cerrado y declara que abre un menú", () => {
    renderMenu();
    const trigger = screen.getByRole("button", { name: "Acciones" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("al abrir muestra los ítems y enfoca el primero habilitado", async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole("button", { name: "Acciones" }));
    expect(
      screen.getByRole("menu", { name: "Acciones del pedido" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("menuitem")).toHaveLength(3);
    expect(screen.getByRole("menuitem", { name: "Editar" })).toHaveFocus();
  });

  it("las flechas mueven el foco saltando los deshabilitados", async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole("button", { name: "Acciones" }));
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Eliminar" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Editar" })).toHaveFocus();
    await user.keyboard("{End}");
    expect(screen.getByRole("menuitem", { name: "Eliminar" })).toHaveFocus();
  });

  it("elegir un ítem lo ejecuta, cierra el menú y devuelve el foco al botón", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderMenu(buildItems(onSelect));
    await user.click(screen.getByRole("button", { name: "Acciones" }));
    await user.click(screen.getByRole("menuitem", { name: "Eliminar" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Acciones" })).toHaveFocus();
  });

  it("Enter sobre el ítem enfocado lo elige", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderMenu(buildItems(onSelect));
    await user.click(screen.getByRole("button", { name: "Acciones" }));
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("no ejecuta un ítem deshabilitado", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderMenu(buildItems(onSelect));
    await user.click(screen.getByRole("button", { name: "Acciones" }));
    await user.click(screen.getByRole("menuitem", { name: "Duplicar" }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("Escape cierra el menú y devuelve el foco al botón", async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole("button", { name: "Acciones" }));
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Acciones" })).toHaveFocus();
  });

  it("Tab cierra el menú", async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole("button", { name: "Acciones" }));
    await user.keyboard("{Tab}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});

// Caso real: el selector de emisor activo muestra, en cada ítem, el nombre y el CUIT, y marca
// cuál es el vigente; el ítem se encuentra por todo su contenido.
describe("DropdownMenu con contenido en los ítems", () => {
  it("acepta contenido en label y marca el ítem vigente con aria-current", async () => {
    render(
      <DropdownMenu
        trigger={<button>Emisor</button>}
        label="Elegir emisor"
        items={[
          {
            id: "a",
            label: (
              <>
                <b>María González</b> <small>27-98765432-0</small>
              </>
            ),
            onSelect: () => undefined,
            isCurrent: true,
          },
          { id: "b", label: "Ricardo Fernández", onSelect: () => undefined },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Emisor" }));
    const current = screen.getByRole("menuitem", { name: /María González/ });
    expect(current).toHaveAttribute("aria-current", "true");
    expect(current).toHaveTextContent("27-98765432-0");
    expect(
      screen.getByRole("menuitem", { name: "Ricardo Fernández" }),
    ).not.toHaveAttribute("aria-current");
  });
});
