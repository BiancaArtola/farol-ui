import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../Button/Button";
import { TableToolbar, type TableToolbarProps } from "./TableToolbar";

const meta = {
  title: "Components/TableToolbar",
  component: TableToolbar,
  args: {
    searchLabel: "Buscar comprobante",
    searchValue: "",
    onSearchChange: () => undefined,
  },
} satisfies Meta<typeof TableToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

const SearchableToolbar = (props: TableToolbarProps) => {
  const [search, setSearch] = useState("");
  return (
    <TableToolbar {...props} searchValue={search} onSearchChange={setSearch} />
  );
};

export const Default: Story = {
  render: (args) => <SearchableToolbar {...args} />,
};

export const WithFilters: Story = {
  args: {
    summary: "12 comprobantes",
    filters: (
      <>
        <Button size="sm" variant="secondary">
          Listos
        </Button>
        <Button size="sm" variant="ghost">
          A revisar
        </Button>
      </>
    ),
  },
  render: (args) => <SearchableToolbar {...args} />,
};
