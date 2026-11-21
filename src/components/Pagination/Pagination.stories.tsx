import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Pagination, type PaginationProps } from "./Pagination";

const meta = {
  title: "Components/Pagination",
  component: Pagination,
  args: { page: 1, pageCount: 12, onPageChange: () => undefined },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

const Interactive = (props: PaginationProps) => {
  const [page, setPage] = useState(props.page);
  return <Pagination {...props} page={page} onPageChange={setPage} />;
};

export const Default: Story = { render: (args) => <Interactive {...args} /> };

export const Pocas: Story = {
  args: { pageCount: 4 },
  render: (args) => <Interactive {...args} />,
};
