import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TableToolbar } from "./TableToolbar";

// Caso real: buscador de comprobantes con filtros y contador; el buscador no tiene etiqueta
// visible, pero sí nombre accesible.
describe("TableToolbar", () => {
  it("expone un buscador con nombre accesible y avisa lo que se escribe", async () => {
    const handleSearchChange = vi.fn();
    render(
      <TableToolbar
        searchLabel="Buscar comprobante"
        searchValue=""
        onSearchChange={handleSearchChange}
      />,
    );
    await userEvent.type(
      screen.getByRole("searchbox", { name: "Buscar comprobante" }),
      "j",
    );
    expect(handleSearchChange).toHaveBeenCalledWith("j");
  });

  it("muestra filtros y contador cuando se pasan", () => {
    render(
      <TableToolbar
        searchLabel="Buscar"
        searchValue=""
        onSearchChange={() => undefined}
        filters={<button type="button">Listos</button>}
        summary="12 comprobantes"
      />,
    );
    expect(screen.getByRole("button", { name: "Listos" })).toBeInTheDocument();
    expect(screen.getByText("12 comprobantes")).toBeInTheDocument();
  });
});
