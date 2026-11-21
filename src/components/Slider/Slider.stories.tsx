import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider } from "./Slider";

const meta = {
  title: "Components/Slider",
  component: Slider,
  args: { label: "Precio máximo", min: 0, max: 100, defaultValue: 40 },
  decorators: [
    (Story) => (
      <div className="story-column">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ConFormato: Story = {
  args: {
    label: "Descuento",
    hint: "Se aplica a todo el pedido",
    formatValue: (value) => `${value} %`,
  },
};

export const Deshabilitado: Story = { args: { disabled: true } };
