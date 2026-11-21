import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./Select";

const meta = {
  title: "Components/Select",
  component: Select,
  args: {
    label: "Moneda",
    children: (
      <>
        <option value="ARS">Pesos</option>
        <option value="USD">Dólares</option>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div className="story-column">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = { args: { hint: "Se usa para los totales" } };

export const WithError: Story = { args: { error: "Elegir una moneda" } };

export const Disabled: Story = { args: { disabled: true } };
