import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatCard } from "./StatCard";

const meta = {
  title: "Components/StatCard",
  component: StatCard,
  args: { label: "Comprobantes listos", value: 12, icon: "✓" },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = { args: { hint: "Este mes" } };

export const Clickable: Story = { args: { onClick: () => undefined } };

export const Tones: Story = {
  render: (args) => (
    <div className="story-grid">
      <StatCard {...args} tone="info" />
      <StatCard {...args} tone="success" />
      <StatCard {...args} tone="warning" />
      <StatCard {...args} tone="neutral" />
    </div>
  ),
};

export const ActiveFilter: Story = {
  args: { onClick: () => undefined, isActive: true },
};
