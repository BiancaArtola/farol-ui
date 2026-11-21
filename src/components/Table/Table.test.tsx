import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Table, type TableColumn, type TableProps } from "./Table";

interface Invoice {
  id: string;
  client: string;
  total: number;
}

const invoices: Invoice[] = [
  { id: "1", client: "Juan Pérez", total: 1200 },
  { id: "2", client: "María Gómez", total: 350 },
];

const columns: TableColumn<Invoice>[] = [
  {
    key: "client",
    header: "Cliente",
    sortable: true,
    render: (row) => row.client,
  },
  {
    key: "total",
    header: "Total",
    numeric: true,
    sortable: true,
    render: (row) => row.total,
  },
];

const renderTable = (props: Partial<TableProps<Invoice>> = {}) =>
  render(
    <Table
      caption="Comprobantes"
      columns={columns}
      rows={invoices}
      getRowKey={(row) => row.id}
      {...props}
    />,
  );

// Caso real: el listado de comprobantes tiene que ser una tabla accesible, con nombre,
// cabeceras de columna y orden por cabecera anunciado a lectores de pantalla.
describe("Table", () => {
  it("expone una tabla con nombre, cabeceras y una fila por dato", () => {
    renderTable();
    expect(
      screen.getByRole("table", { name: "Comprobantes" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    expect(screen.getAllByRole("row")).toHaveLength(3);
  });

  it("alinea a la derecha las columnas numéricas", () => {
    renderTable();
    const cell = screen.getByRole("cell", { name: "1200" });
    expect(cell.className).toMatch(/numeric/);
  });

  it("anuncia el orden vigente con aria-sort", () => {
    renderTable({
      sort: { key: "total", direction: "desc" },
      onSortChange: () => undefined,
    });
    expect(screen.getByRole("columnheader", { name: /Total/ })).toHaveAttribute(
      "aria-sort",
      "descending",
    );
    expect(
      screen.getByRole("columnheader", { name: /Cliente/ }),
    ).toHaveAttribute("aria-sort", "none");
  });

  it("avisa qué columna se clicó para ordenar", async () => {
    const handleSortChange = vi.fn();
    renderTable({ onSortChange: handleSortChange });
    await userEvent.click(screen.getByRole("button", { name: /Cliente/ }));
    expect(handleSortChange).toHaveBeenCalledWith("client");
  });

  it("sin onSortChange las cabeceras son texto, no botones", () => {
    renderTable();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("muestra el mensaje cuando no hay filas", () => {
    renderTable({ rows: [], emptyMessage: "Sin comprobantes" });
    const body = screen.getAllByRole("rowgroup")[1];
    expect(within(body).getByText("Sin comprobantes")).toBeInTheDocument();
  });

  // Caso real: la tabla de cobros lleva un casillero "seleccionar todos" en la cabecera
  // y una columna angosta de selección, que necesita su propia clase de ancho.
  it("admite contenido en la cabecera y una clase por columna", () => {
    const selectable: TableColumn<Invoice>[] = [
      {
        key: "select",
        header: <input type="checkbox" aria-label="Seleccionar todos" />,
        className: "col-check",
        render: () => <input type="checkbox" aria-label="Seleccionar" />,
      },
      ...columns,
    ];
    renderTable({ columns: selectable });
    const headerCell = screen
      .getByRole("checkbox", { name: "Seleccionar todos" })
      .closest("th");
    expect(headerCell).toHaveClass("col-check");
    const firstRow = screen.getAllByRole("row")[1];
    expect(within(firstRow).getAllByRole("cell")[0]).toHaveClass("col-check");
  });
});
