import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Badge } from "../Badge/Badge";
import { Table, type TableColumn } from "./Table";
import { filterRows, setColumnFilter, type ColumnFilters } from "./filterRows";
import { nextSort, sortRows, type TableSort } from "./sortRows";

interface Invoice {
  id: string;
  client: string;
  total: number | null;
  status: "Listo" | "Revisar";
}

const invoices: Invoice[] = [
  { id: "1", client: "Juan Pérez", total: 120000, status: "Listo" },
  { id: "2", client: "María Gómez", total: 35050, status: "Revisar" },
  { id: "3", client: "Álvaro Díaz", total: null, status: "Revisar" },
  { id: "4", client: "Carla Ruiz", total: 8900, status: "Listo" },
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
    render: (row) =>
      row.total === null ? "—" : `$ ${row.total.toLocaleString("es-AR")}`,
  },
  {
    key: "status",
    header: "Estado",
    render: (row) => (
      <Badge tone={row.status === "Listo" ? "success" : "warning"}>
        {row.status}
      </Badge>
    ),
  },
];

const meta = {
  title: "Components/Table",
  component: Table<Invoice>,
  args: {
    caption: "Comprobantes",
    columns,
    rows: invoices,
    getRowKey: (row: Invoice) => row.id,
  },
} satisfies Meta<typeof Table<Invoice>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: { rows: [], emptyMessage: "Todavía no hay comprobantes" },
};

const SortableTable = (args: Story["args"]) => {
  const [sort, setSort] = useState<TableSort | null>(null);
  const rows = sortRows(invoices, sort, (row, key) =>
    key === "total" ? row.total : row.client,
  );
  return (
    <Table
      caption="Comprobantes"
      columns={columns}
      getRowKey={(row) => row.id}
      {...args}
      rows={rows}
      sort={sort}
      onSortChange={(key) => setSort(nextSort(sort, key))}
    />
  );
};

// Orden controlado: la tabla muestra el estado y quien la usa decide cómo ordenar.
export const Sortable: Story = {
  render: (args) => <SortableTable {...args} />,
};

const FilterableTable = (args: Story["args"]) => {
  const [filters, setFilters] = useState<ColumnFilters>({});
  const filterableColumns = columns.map((column) => ({
    ...column,
    filterable: column.key !== "status",
  }));
  const rows = filterRows(invoices, filters, (row, key) =>
    key === "total" ? row.total : row.client,
  );
  return (
    <Table
      caption="Comprobantes"
      getRowKey={(row) => row.id}
      {...args}
      columns={filterableColumns}
      rows={rows}
      filters={filters}
      onFilterChange={(key, value) =>
        setFilters(setColumnFilter(filters, key, value))
      }
      emptyMessage="Ningún comprobante coincide con los filtros"
    />
  );
};

// Filtro por columna controlado: la tabla muestra los campos y quien la usa filtra con filterRows.
export const Filterable: Story = {
  render: (args) => <FilterableTable {...args} />,
};

// Filtro con ícono: ocupa menos que la fila de campos y marca con un punto las columnas filtradas.
export const FilterableWithIcon: Story = {
  render: (args) => <FilterableTable {...args} filterMode="icon" />,
};

// Columna de fechas: el filtro es un calendario de rango. `filterRows` entiende el rango si la
// celda devuelve la fecha (un `Date` o "AAAA-MM-DD").
const DateFilterTable = () => {
  const [filters, setFilters] = useState<ColumnFilters>({});
  const dated = [
    { id: "1", client: "Juan Pérez", total: 1200, date: new Date(2026, 10, 3) },
    {
      id: "2",
      client: "María Gómez",
      total: 350,
      date: new Date(2026, 10, 20),
    },
    { id: "3", client: "Ana Ruiz", total: 90, date: new Date(2026, 11, 2) },
  ];
  const rows = filterRows(dated, filters, (row, key) =>
    key === "date" ? row.date : key === "total" ? row.total : row.client,
  );
  return (
    <Table
      caption="Cobros"
      getRowKey={(row) => row.id}
      columns={[
        { key: "client", header: "Cliente", render: (row) => row.client },
        {
          key: "date",
          header: "Fecha",
          filterable: true,
          filterType: "date",
          filterLabel: "Filtrar por fecha",
          render: (row) => row.date.toLocaleDateString("es-AR"),
        },
      ]}
      rows={rows}
      filters={filters}
      onFilterChange={(key, value) =>
        setFilters(setColumnFilter(filters, key, value))
      }
      filterMode="icon"
      emptyMessage="Ningún cobro en ese período"
    />
  );
};

export const DateFilter: Story = {
  render: () => <DateFilterTable />,
};
