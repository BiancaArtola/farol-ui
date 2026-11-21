import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./Switch";

const meta = {
  title: "Components/Switch",
  component: Switch,
  args: { label: "Avisos por mail" },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Enabled: Story = { args: { defaultChecked: true } };

export const WithHint: Story = { args: { hint: "Un resumen por semana" } };

export const Disabled: Story = { args: { disabled: true } };
