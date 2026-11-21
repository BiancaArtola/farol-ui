import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Badge } from "../Badge/Badge";
import { Table, type TableColumn } from "./Table";
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
