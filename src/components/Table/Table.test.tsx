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

// Caso real: Agenda y Emisores abren un panel al hacer clic en la fila y marcan la activa;
// con miles de filas la pantalla dibuja la fila entera con un componente memoizado.
describe("Table (filas)", () => {
  it("aplica la clase de cada fila y avisa el clic con su dato", async () => {
    const handleRowClick = vi.fn();
    renderTable({
      rowClassName: (row) => (row.id === "2" ? "activa" : undefined),
      onRowClick: handleRowClick,
    });
    const rows = screen.getAllByRole("row");
    expect(rows[2]).toHaveClass("activa");
    expect(rows[1]).not.toHaveClass("activa");
    await userEvent.click(rows[1]);
    expect(handleRowClick).toHaveBeenCalledWith(invoices[0]);
  });

  it("con renderRow las columnas no necesitan render", () => {
    renderTable({
      columns: [{ key: "client", header: "Cliente" }],
      renderRow: (row) => (
        <tr>
          <td>{row.client}</td>
        </tr>
      ),
    });
    expect(
      screen.getByRole("cell", { name: "Juan Pérez" }),
    ).toBeInTheDocument();
  });

  it("con renderRow la fila la dibuja quien usa el componente", () => {
    renderTable({
      renderRow: (row) => (
        <tr data-testid="propia">
          <td>{row.client}</td>
        </tr>
      ),
    });
    expect(screen.getAllByTestId("propia")).toHaveLength(2);
  });

  // Caso real: filtrar el listado por cliente. La tabla solo muestra el campo y avisa lo
  // escrito; quien la usa filtra las filas con filterRows.
  describe("filtros por columna", () => {
    const filterable = columns.map((column) => ({
      ...column,
      filterable: column.key === "client",
    }));

    it("muestra un campo con nombre accesible solo en las columnas filtrables", () => {
      renderTable({ columns: filterable, onFilterChange: vi.fn() });
      expect(
        screen.getByRole("searchbox", { name: "Filtrar Cliente" }),
      ).toBeInTheDocument();
      expect(screen.getAllByRole("searchbox")).toHaveLength(1);
    });

    it("sin onFilterChange no dibuja la fila de filtros", () => {
      renderTable({ columns: filterable });
      expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    });

    it("avisa cada cambio con la clave de la columna", async () => {
      const handleFilterChange = vi.fn();
      renderTable({ columns: filterable, onFilterChange: handleFilterChange });
      await userEvent.type(screen.getByRole("searchbox"), "ju");
      expect(handleFilterChange).toHaveBeenLastCalledWith("client", "u");
      expect(handleFilterChange).toHaveBeenCalledTimes(2);
    });

    it("muestra el texto vigente y acepta un nombre accesible propio", () => {
      renderTable({
        columns: filterable.map((column) => ({
          ...column,
          filterLabel: "Buscar cliente",
        })),
        filters: { client: "maria" },
        onFilterChange: vi.fn(),
      });
      expect(
        screen.getByRole("searchbox", { name: "Buscar cliente" }),
      ).toHaveValue("maria");
    });
  });

  // Caso real: la fila de campos bajo la cabecera ocupa lugar y no se nota cuál columna está
  // filtrada; con `filterMode="icon"` cada columna filtrable tiene un ícono que abre su filtro.
  describe("filtro con ícono en la cabecera", () => {
    const filterable = columns.map((column) => ({
      ...column,
      filterable: column.key === "client",
    }));

    it("no dibuja la fila de campos: hay un botón por columna filtrable y el campo está cerrado", () => {
      renderTable({
        columns: filterable,
        filterMode: "icon",
        onFilterChange: vi.fn(),
      });
      expect(
        screen.getByRole("button", { name: "Filtrar Cliente" }),
      ).toHaveAttribute("aria-expanded", "false");
      expect(screen.getAllByRole("button", { name: /^Filtrar/ })).toHaveLength(
        1,
      );
      expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    });

    it("el botón abre un panel con el campo enfocado y avisa cada cambio", async () => {
      const handleFilterChange = vi.fn();
      renderTable({
        columns: filterable,
        filterMode: "icon",
        onFilterChange: handleFilterChange,
      });
      await userEvent.click(
        screen.getByRole("button", { name: "Filtrar Cliente" }),
      );
      const field = screen.getByRole("searchbox", { name: "Filtrar Cliente" });
      expect(field).toHaveFocus();
      expect(
        screen.getByRole("button", { name: "Filtrar Cliente" }),
      ).toHaveAttribute("aria-expanded", "true");
      await userEvent.type(field, "ju");
      expect(handleFilterChange).toHaveBeenCalledWith("client", "u");
    });

    it("con un filtro puesto lo anuncia y permite limpiarlo", async () => {
      const handleFilterChange = vi.fn();
      renderTable({
        columns: filterable,
        filterMode: "icon",
        filters: { client: "maria" },
        onFilterChange: handleFilterChange,
      });
      expect(
        screen.getByRole("button", { name: "Filtrar Cliente" }),
      ).toHaveAccessibleDescription("Filtro activo: maria");
      await userEvent.click(
        screen.getByRole("button", { name: "Filtrar Cliente" }),
      );
      await userEvent.click(
        screen.getByRole("button", { name: "Limpiar filtro" }),
      );
      expect(handleFilterChange).toHaveBeenCalledWith("client", "");
    });

    it("Escape y Enter cierran el panel y devuelven el foco al ícono", async () => {
      renderTable({
        columns: filterable,
        filterMode: "icon",
        onFilterChange: vi.fn(),
      });
      const trigger = screen.getByRole("button", { name: "Filtrar Cliente" });
      await userEvent.click(trigger);
      await userEvent.keyboard("{Escape}");
      expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();

      await userEvent.click(trigger);
      await userEvent.keyboard("{Enter}");
      expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });

    it("la columna ordenable conserva su botón de orden junto al ícono", () => {
      renderTable({
        columns: filterable,
        filterMode: "icon",
        onSortChange: vi.fn(),
        onFilterChange: vi.fn(),
      });
      expect(
        screen.getByRole("button", { name: /^Cliente/ }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Filtrar Cliente" }),
      ).toBeInTheDocument();
    });
  });

  // Caso real: una columna de fechas se filtra eligiendo desde y hasta en un calendario.
  describe("filtro de fecha con ícono", () => {
    const dateColumns: TableColumn<Invoice>[] = [
      ...columns,
      {
        key: "date",
        header: "Fecha",
        filterable: true,
        filterType: "date",
        filterLabel: "Filtrar por fecha",
        render: () => "",
      },
    ];

    it("el panel muestra un calendario y no un campo de texto", async () => {
      renderTable({
        columns: dateColumns,
        filterMode: "icon",
        onFilterChange: vi.fn(),
      });
      await userEvent.click(
        screen.getByRole("button", { name: "Filtrar por fecha" }),
      );
      expect(screen.getByRole("grid")).toBeInTheDocument();
      expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    });

    it("elegir desde y hasta avisa el rango como texto", async () => {
      const handleFilterChange = vi.fn();
      renderTable({
        columns: dateColumns,
        filterMode: "icon",
        filters: { date: "2026-11-03.." },
        onFilterChange: handleFilterChange,
      });
      await userEvent.click(
        screen.getByRole("button", { name: "Filtrar por fecha" }),
      );
      await userEvent.click(
        screen.getByRole("button", { name: /20 de noviembre de 2026/ }),
      );
      expect(handleFilterChange).toHaveBeenCalledWith(
        "date",
        "2026-11-03..2026-11-20",
      );
    });

    it("con un rango puesto lo anuncia en lenguaje natural y permite borrarlo", async () => {
      const handleFilterChange = vi.fn();
      renderTable({
        columns: dateColumns,
        filterMode: "icon",
        filters: { date: "2026-11-03..2026-11-20" },
        onFilterChange: handleFilterChange,
      });
      const trigger = screen.getByRole("button", { name: "Filtrar por fecha" });
      expect(trigger).toHaveAccessibleDescription(
        "Filtro activo: 03/11/2026 – 20/11/2026",
      );
      await userEvent.click(trigger);
      await userEvent.click(
        screen.getByRole("button", { name: "Borrar fechas" }),
      );
      expect(handleFilterChange).toHaveBeenCalledWith("date", "");
    });
  });
});
