import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button/Button";
import { EmptyState } from "./EmptyState";

const meta = {
  title: "Components/EmptyState",
  component: EmptyState,
  args: { title: "Todavía no hay comprobantes" },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    description: "Cuando cargues un cobro, aparece acá.",
    action: <Button size="sm">Agregar cobro</Button>,
  },
};
